import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone as cloneSkeleton } from 'three/addons/utils/SkeletonUtils.js';

/** Caller supplies only paths of acquired local assets and verified clip names. */
export interface LocalModelOptions {
  url: string;
  height: number;
  /** Yaw that makes the source asset face the game's +Z direction. */
  frontYaw?: number;
  /** Additional animation GLBs exported for this exact skeleton, if present. */
  animationUrls?: readonly string[];
  /** Defaults to the observed Tripo Mixamo hips; false disables offset alignment. */
  centerRootBone?: string | false;
}
export interface LocalModelMetadata {
  sourceUrl: string;
  clips: { name: string; duration: number; tracks: number }[];
  skinnedMeshes: number;
  bones: string[];
  originalSize: [number, number, number];
  normalizationScale: number;
  rootCentering: { clip: string; bone: string; offsetX: number; offsetZ: number }[];
  derivedClips: { name: string; lowerBody: string; upperBody: string; upperMode: 'motion' | 'held-pose' }[];
}
export interface LocalModel {
  /** Canonical metres: ground at Y=0 and caller's actor transform goes here. */
  root: THREE.Group;
  /** Original skin hierarchy preserved intact beneath the normalization transform. */
  model: THREE.Object3D;
  metadata: LocalModelMetadata;
  mixer: THREE.AnimationMixer;
  /** Exact names only. A missing clip returns false instead of claiming playback. */
  playClip(name: string, fadeSeconds?: number, speed?: number): boolean;
  update(deltaSeconds: number): void;
  getBone(name: string): THREE.Bone | undefined;
  /** Position is in canonical actor metres; an observed bone may keep it attached during motion. */
  createSocket(name: string, position: [number, number, number], boneName?: string): THREE.Group;
  dispose(): void;
}

/** Advance all elapsed simulation time, keeping individual mixer steps small. */
export function advanceAnimation(mixer: Pick<THREE.AnimationMixer, 'update'>, deltaSeconds: number): void {
  if (!Number.isFinite(deltaSeconds) || deltaSeconds < 0) return;
  const steps = Math.max(1, Math.ceil(deltaSeconds / .1));
  const step = deltaSeconds / steps;
  for (let i = 0; i < steps; i++) mixer.update(step);
}

/**
 * Loading is explicit; importing this module never requests an asset. It does not
 * infer provenance, animation semantics, front direction or rig completion.
 */
export async function loadLocalModel(options: LocalModelOptions): Promise<LocalModel> {
  if (!(options.height > 0)) throw new Error('Model height must be positive.');
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(options.url);
  const animationFiles = await Promise.all((options.animationUrls ?? []).map(url => loader.loadAsync(url)));
  const model = cloneSkeleton(gltf.scene);
  const orientation = new THREE.Group();
  orientation.rotation.y = options.frontYaw ?? 0;
  orientation.add(model);
  orientation.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(orientation);
  const size = bounds.getSize(new THREE.Vector3());
  if (!Number.isFinite(size.y) || size.y <= 0) throw new Error(`Model has no measurable height: ${options.url}`);
  const center = bounds.getCenter(new THREE.Vector3());
  const normalizationScale = options.height / size.y;
  orientation.scale.setScalar(normalizationScale);
  orientation.position.set(-center.x * normalizationScale, -bounds.min.y * normalizationScale, -center.z * normalizationScale);
  const root = new THREE.Group();
  root.name = 'Local GLB actor';
  root.userData.assetSource = 'local-glb';
  root.add(orientation);
  const bones = new Map<string, THREE.Bone>();
  let skinnedMeshes = 0;
  model.traverse(node => {
    if (node instanceof THREE.Bone) bones.set(node.name, node);
    if (node instanceof THREE.SkinnedMesh) skinnedMeshes++;
    if (node instanceof THREE.Mesh) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });
  const rootCentering: LocalModelMetadata['rootCentering'] = [];
  const motionRoot = options.centerRootBone === false ? undefined : bones.get(options.centerRootBone ?? 'mixamorigHips');
  // Tripo's stay-in-place export retains different constant initial hips offsets
  // across actions. Align only those offsets; preserve vertical and relative motion.
  const clips = [...gltf.animations, ...animationFiles.flatMap(file => file.animations)].map(source => {
    const clip = source.clone();
    if (!motionRoot) return clip;
    const track = clip.tracks.find(candidate => candidate.name === `${motionRoot.name}.position`);
    if (!track || track.getValueSize() !== 3 || !track.values.length) return clip;
    const offsetX = track.values[0] - motionRoot.position.x;
    const offsetZ = track.values[2] - motionRoot.position.z;
    for (let i = 0; i < track.values.length; i += 3) {
      track.values[i] -= offsetX;
      track.values[i + 2] -= offsetZ;
    }
    rootCentering.push({ clip: clip.name, bone: motionRoot.name, offsetX, offsetZ });
    return clip;
  });
  const derivedClips: LocalModelMetadata['derivedClips'] = [];
  const carry = clips.find(clip => clip.name === 'Walk slowly in place in a seamless loop while carrying a small ');
  const spine = bones.get('mixamorigSpine');
  if (carry && spine) {
    const upperBones = new Set<string>();
    spine.traverse(node => { if (node instanceof THREE.Bone) upperBones.add(node.name); });
    const upperTracks = new Map(carry.tracks.filter(track => upperBones.has(track.name.split('.')[0])).map(track => [track.name, track]));
    for (const [baseName, name, held] of [['walk', 'carry-walk', false], ['idle', 'carry-idle', true]] as const) {
      const base = clips.find(clip => clip.name === baseName);
      if (!base) continue;
      const tracks = base.tracks.map(track => {
        const upper = upperTracks.get(track.name);
        if (!upper) return track.clone();
        const replacement = upper.clone();
        if (held) {
          // Sample the acquired carry's bent-arm pose; the acquired idle keeps
          // the legs in a supported stance instead of freezing a raised step.
          const values = Array.from(upper.InterpolantFactoryMethodLinear().evaluate(carry.duration * .25));
          replacement.times = new Float32Array([0, base.duration]);
          replacement.values = new Float32Array([...values, ...values]);
        } else {
          replacement.times = new Float32Array(Array.from(upper.times, time => time * base.duration / carry.duration));
        }
        return replacement;
      });
      clips.push(new THREE.AnimationClip(name, base.duration, tracks));
      derivedClips.push({ name, lowerBody: base.name, upperBody: carry.name, upperMode: held ? 'held-pose' : 'motion' });
    }
  }
  const metadata: LocalModelMetadata = {
    sourceUrl: options.url,
    clips: clips.map(clip => ({ name: clip.name, duration: clip.duration, tracks: clip.tracks.length })),
    skinnedMeshes,
    bones: [...bones.keys()],
    originalSize: size.toArray() as [number, number, number],
    normalizationScale,
    rootCentering,
    derivedClips,
  };
  root.userData.modelMetadata = metadata;
  const mixer = new THREE.AnimationMixer(model);
  const actions = new Map<string, THREE.AnimationAction>();
  for (const clip of clips) actions.set(clip.name, mixer.clipAction(clip));
  let active: THREE.AnimationAction | undefined;
  return {
    root, model, metadata, mixer,
    playClip(name, fadeSeconds = .15, speed = 1) {
      const next = actions.get(name);
      if (!next) return false;
      next.setEffectiveTimeScale(speed);
      if (next === active) return true;
      next.reset().setEffectiveWeight(1).fadeIn(fadeSeconds).play();
      active?.fadeOut(fadeSeconds);
      active = next;
      return true;
    },
    update(deltaSeconds) { advanceAnimation(mixer, deltaSeconds); },
    getBone(name) { return bones.get(name); },
    createSocket(name, position, boneName) {
      const socket = new THREE.Group();
      socket.name = name;
      socket.position.set(...position);
      root.add(socket);
      if (boneName) {
        const bone = bones.get(boneName);
        if (!bone) {
          root.remove(socket);
          throw new Error(`No attachment bone named ${boneName}`);
        }
        // Preserve canonical size/position while entering the source bone's units.
        root.updateMatrixWorld(true);
        bone.attach(socket);
      }
      return socket;
    },
    dispose() {
      mixer.stopAllAction();
      mixer.uncacheRoot(model);
      root.removeFromParent();
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      const textures = new Set<THREE.Texture>();
      model.traverse(node => {
        if (!(node instanceof THREE.Mesh)) return;
        geometries.add(node.geometry);
        for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
          materials.add(material);
          for (const value of Object.values(material)) if (value instanceof THREE.Texture) textures.add(value);
        }
      });
      geometries.forEach(geometry => geometry.dispose());
      textures.forEach(texture => texture.dispose());
      materials.forEach(material => material.dispose());
    },
  };
}
