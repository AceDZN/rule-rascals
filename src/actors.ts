import * as THREE from 'three';
import { createRaccoon, createRobot } from './characters';
import { loadLocalModel, type LocalModel } from './model-assets';

/** Local assets are visual only; the simulation owns positions and permissions. */
export function createPlayerActor() {
  const root = new THREE.Group();
  const fallback = createRaccoon();
  fallback.scale.multiplyScalar(1.25);
  root.add(fallback);
  let model: LocalModel | undefined;
  let lastTime = 0;
  let activeClip = '';
  let badge: THREE.Group | undefined;
  let backpack: THREE.Group | undefined;
  let hand: THREE.Group | undefined;
  const status = { source: 'procedural fallback', loaded: false, error: '', rigged: false, joints: 0, activeClip: '', playbackRate: 1, clips: [] as string[] };
  const ready = loadLocalModel({ url: `${import.meta.env.BASE_URL}models/raccoon.glb`, height: 1.7 }).then(asset => {
    model = asset;
    root.add(asset.root);
    root.remove(fallback);
    const cream = new THREE.MeshStandardMaterial({ color: 0xf4ebd4, roughness: .8 });
    const jade = new THREE.MeshStandardMaterial({ color: 0x427c65, roughness: .8 });
    badge = asset.createSocket('Visitor badge', [.18, 1.08, .32], 'mixamorigSpine2');
    badge.add(new THREE.Mesh(new THREE.BoxGeometry(.17, .23, .035), cream));
    const emblem = new THREE.Mesh(new THREE.BoxGeometry(.09, .06, .012), jade);
    emblem.position.z = .025; badge.add(emblem);
    backpack = asset.createSocket('Large visitor bag', [0, 1.03, -.38], 'mixamorigSpine2');
    const bag = new THREE.Mesh(new THREE.BoxGeometry(.6, .6, .3), new THREE.MeshStandardMaterial({color:0x9d6a43,roughness:.85}));
    backpack.add(bag);
    const flap = new THREE.Mesh(new THREE.BoxGeometry(.63, .14, .33), new THREE.MeshStandardMaterial({color:0xbb8d5e,roughness:.85}));
    flap.position.y = .24; backpack.add(flap);
    asset.root.updateMatrixWorld(true);
    const bone = asset.getBone('mixamorigRightHand');
    if (bone) {
      const position = asset.root.worldToLocal(bone.getWorldPosition(new THREE.Vector3()));
      hand = asset.createSocket('Cargo grip', position.toArray(), bone.name);
    }
    Object.assign(status, {source:'Tripo local GLB',loaded:true,rigged:asset.metadata.skinnedMeshes>0,joints:asset.metadata.bones.length,clips:asset.metadata.clips.map(c=>c.name)});
    asset.playClip('idle', 0); activeClip = 'idle'; status.activeClip = activeClip;
  }).catch(error => { status.error = error instanceof Error ? error.message : String(error); });
  return {
    root, status, ready,
    get carrySocket() { return hand; },
    update(time: number, speed: number, carrying: boolean, sneaking: boolean, hasBadge: boolean, hasBag: boolean, reduced: boolean) {
      const delta = Math.max(0, time - lastTime); lastTime = time;
      if (!model) {
        fallback.userData.animate?.(reduced?0:time,reduced?0:speed,carrying,sneaking);
        fallback.userData.badge.visible = hasBadge; fallback.userData.largeBag.visible = hasBag;
        return;
      }
      const preferred = carrying ? (speed > .1 ? 'carry-walk' : 'carry-idle') : speed > 2.6 ? 'run' : speed > .1 ? 'walk' : 'idle';
      const clip = status.clips.includes(preferred) ? preferred : 'idle';
      // Match support-foot travel to actual world displacement rather than sliding at 1x.
      const rate = clip === 'run' ? speed / 2.5 : clip === 'walk' || clip === 'carry-walk' ? speed / .72 : 1;
      if (model.playClip(clip, .16, Math.max(.1, rate))) activeClip = clip;
      status.playbackRate = rate;
      status.activeClip = activeClip;
      if (!reduced || speed > .1 || carrying) model.update(delta);
      if (badge) badge.visible = hasBadge;
      if (backpack) backpack.visible = hasBag;
      root.updateMatrixWorld(true);
    },
  };
}


const mechanicalTemplates = new Map<string, Promise<LocalModel>>();
export const mechanicalAssets: Record<string, {loaded:boolean;error:string;source:string;rigged:boolean}> = {};
export function createMechanicalActor(kind: 'guard' | 'watering' | 'sweeping') {
  const root = new THREE.Group();
  const fallback = createRobot(kind);
  root.add(fallback);
  if (kind === 'sweeping') return root;
  const file = kind === 'watering' ? 'watering-helper.glb' : 'guard.glb';
  if (!mechanicalTemplates.has(kind)) {
    mechanicalAssets[kind] = {loaded:false,error:'',source:file,rigged:false};
    mechanicalTemplates.set(kind,loadLocalModel({url:`${import.meta.env.BASE_URL}models/${file}`,height:1.5}));
  }
  mechanicalTemplates.get(kind)!.then(asset=>{
    root.remove(fallback); root.add(asset.root.clone(true));
    mechanicalAssets[kind].loaded = true;
    root.userData.assetSource = 'Tripo local rigid GLB';
  }).catch(error=>{mechanicalAssets[kind].error=String(error);});
  return root;
}
