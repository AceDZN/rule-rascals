// Inspect only explicitly supplied, normally downloaded local GLBs.
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const filename = process.argv[2];
if (!filename) throw new Error('Usage: node docs/asset-evidence/inspect-glb.mjs path/to/model.glb');
const bytes = await readFile(filename);
if (bytes.readUInt32LE(0) !== 0x46546c67 || bytes.readUInt32LE(4) !== 2 || bytes.readUInt32LE(8) !== bytes.length) {
  throw new Error('Not a complete binary glTF 2 file.');
}
let gltf, binary;
for (let offset = 12; offset < bytes.length;) {
  const length = bytes.readUInt32LE(offset);
  const type = bytes.readUInt32LE(offset + 4);
  const data = bytes.subarray(offset + 8, offset + 8 + length);
  if (type === 0x4e4f534a) gltf = JSON.parse(data.toString('utf8'));
  if (type === 0x004e4942) binary = data;
  offset += length + 8;
}
if (!gltf) throw new Error('GLB has no JSON chunk.');
function timeRange(accessorIndex) {
  const accessor = gltf.accessors?.[accessorIndex];
  if (!accessor) return null;
  if (accessor.min && accessor.max) return [accessor.min[0], accessor.max[0]];
  const view = gltf.bufferViews?.[accessor.bufferView];
  if (!binary || !view || accessor.componentType !== 5126 || accessor.type !== 'SCALAR') return null;
  const offset = (view.byteOffset || 0) + (accessor.byteOffset || 0);
  const stride = view.byteStride || 4;
  let min = Infinity, max = -Infinity;
  for (let i = 0; i < accessor.count; i++) {
    const value = binary.readFloatLE(offset + i * stride);
    min = Math.min(min, value); max = Math.max(max, value);
  }
  return [min, max];
}
const nodes = gltf.nodes || [];
const report = {
  file: filename,
  bytes: bytes.length,
  sha256: createHash('sha256').update(bytes).digest('hex'),
  generator: gltf.asset?.generator || null,
  meshes: gltf.meshes?.length || 0,
  meshStats: (gltf.meshes || []).map(mesh => ({ name: mesh.name || null, primitives: mesh.primitives.map(primitive => {
    const vertices = gltf.accessors?.[primitive.attributes.POSITION]?.count || 0;
    const indices = primitive.indices === undefined ? null : gltf.accessors?.[primitive.indices]?.count;
    const mode = primitive.mode ?? 4;
    return { vertices, indices, mode, triangles: mode === 4 ? (indices ?? vertices) / 3 : null };
  }) })),
  materials: gltf.materials?.length || 0,
  images: (gltf.images || []).map(image => ({ name: image.name || null, mimeType: image.mimeType || null, embedded: image.bufferView !== undefined, uri: image.uri || null })),
  skinnedMeshNodes: nodes.filter(node => node.skin !== undefined).map(node => node.name || null),
  skins: (gltf.skins || []).map(skin => ({ name: skin.name || null, jointCount: skin.joints.length, joints: skin.joints.map(index => nodes[index]?.name || `node_${index}`) })),
  animations: (gltf.animations || []).map((animation, index) => {
    const ranges = animation.samplers.map(sampler => timeRange(sampler.input)).filter(Boolean);
    const start = ranges.length ? Math.min(...ranges.map(range => range[0])) : null;
    const end = ranges.length ? Math.max(...ranges.map(range => range[1])) : null;
    return { name: animation.name || `animation_${index}`, duration: start === null ? null : end - start,
      channels: animation.channels.length,
      targets: [...new Set(animation.channels.map(channel => `${nodes[channel.target.node]?.name || `node_${channel.target.node}`}.${channel.target.path}`))] };
  }),
};
console.log(JSON.stringify(report, null, 2));
