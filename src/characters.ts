import * as THREE from 'three';

// Original procedural prototype art. These rigid parts are not a Tripo rig.
const ink = new THREE.MeshBasicMaterial({ color: 0x25342d, side: THREE.BackSide });
const palette = {
  fur: 0x737771, cream: 0xe4dfc9, mask: 0x303735, dark: 0x263832,
  yellow: 0xefbf43, jade: 0x729d87, red: 0xcf5f4e, brass: 0xc6a75d,
};
function material(color: number, roughness = .82) {
  return new THREE.MeshStandardMaterial({ color, roughness });
}
function part(geometry: THREE.BufferGeometry, color: number, parent: THREE.Object3D,
  position: [number, number, number], scale: [number, number, number] = [1, 1, 1], outline = true) {
  const mesh = new THREE.Mesh(geometry, material(color));
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  if (outline) {
    const border = new THREE.Mesh(geometry, ink);
    border.scale.setScalar(1.035);
    mesh.add(border);
  }
  return mesh;
}
const orb = () => new THREE.SphereGeometry(1, 16, 12);
const box = () => new THREE.BoxGeometry(1, 1, 1);
const cylinder = (top = 1, bottom = 1, height = 1) => new THREE.CylinderGeometry(top, bottom, height, 16);
function limb(parent: THREE.Object3D, x: number, y: number, z: number, length: number, radius: number, color: number) {
  const pivot = new THREE.Group();
  pivot.position.set(x, y, z);
  parent.add(pivot);
  part(new THREE.CapsuleGeometry(radius, length - radius * 2, 4, 10), color, pivot, [0, -length / 2, 0]);
  return pivot;
}

export function createRaccoon(): THREE.Group {
  const root = new THREE.Group();
  root.name = 'Original procedural raccoon — Tripo model pending';
  const body = new THREE.Group();
  root.add(body);
  part(orb(), palette.fur, body, [0, .66, -.015], [.31, .43, .25]);
  part(orb(), palette.cream, body, [0, .63, .18], [.23, .31, .09], false);
  const belt = part(cylinder(), palette.dark, body, [0, .52, 0], [.315, .065, .26]);
  belt.rotation.y = .05;
  part(box(), palette.brass, body, [0, .52, .265], [.09, .065, .025]);
  part(box(), 0x6e6953, body, [.28, .55, -.02], [.1, .16, .16]);

  const legs = [limb(body, -.17, .41, 0, .29, .095, palette.mask), limb(body, .17, .41, 0, .29, .095, palette.mask)];
  for (const leg of legs) {
    part(orb(), palette.dark, leg, [0, -.28, .075], [.105, .09, .17]);
  }
  const arms = [limb(body, -.30, .91, .015, .39, .085, palette.fur), limb(body, .30, .91, .015, .39, .085, palette.fur)];
  for (let i = 0; i < arms.length; i++) {
    arms[i].rotation.z = i ? -.15 : .15;
    part(orb(), palette.mask, arms[i], [0, -.39, .025], [.085, .11, .085]);
  }
  const head = new THREE.Group();
  head.position.set(0, 1.09, .035);
  body.add(head);
  part(orb(), palette.fur, head, [0, 0, 0], [.32, .275, .28]);
  for (const side of [-1, 1]) {
    const ear = part(new THREE.ConeGeometry(.135, .25, 3), palette.mask, head, [side * .22, .23, -.02]);
    ear.rotation.z = side * -.20;
    ear.rotation.y = Math.PI;
    part(new THREE.ConeGeometry(.085, .17, 3), 0xb8a495, ear, [0, .02, .045], [.8, .8, .6], false);
    const mask = part(orb(), palette.mask, head, [side * .155, .025, .225], [.16, .105, .072], false);
    mask.rotation.z = side * .18;
    part(orb(), 0xf5eedb, head, [side * .15, .042, .282], [.064, .069, .031], false);
    part(orb(), 0x1b2725, head, [side * .15, .043, .311], [.033, .043, .018], false);
    part(orb(), 0xffffff, head, [side * .15 - .008, .06, .326], [.010, .012, .005], false);
  }
  part(orb(), palette.cream, head, [0, -.105, .27], [.21, .115, .17]);
  part(orb(), palette.dark, head, [0, -.063, .416], [.074, .047, .041]);
  const smile = part(new THREE.TorusGeometry(.068, .008, 4, 12, Math.PI), palette.dark, head, [0, -.13, .408], [1, .55, 1], false);
  smile.rotation.z = Math.PI;
  const neck = part(new THREE.TorusGeometry(.205, .06, 6, 16), palette.yellow, body, [0, .943, .04]);
  neck.rotation.x = Math.PI / 2;
  const scarf = part(box(), palette.yellow, body, [-.11, .795, .27], [.115, .29, .045]);
  scarf.rotation.z = -.18;
  const badge = new THREE.Group();
  badge.name = 'Equipped visitor badge';
  body.add(badge);
  part(box(), palette.cream, badge, [.10, .79, .267], [.105, .14, .025]);
  part(box(), palette.jade, badge, [.10, .8, .286], [.05, .04, .012], false);
  badge.visible = false;
  root.userData.badge = badge;

  const largeBag = new THREE.Group();
  largeBag.name = 'Worn large visitor backpack';
  body.add(largeBag);
  // Keep the pack above the tail root so its ringed silhouette stays visible.
  part(box(), 0x8b6244, largeBag, [0, .83, -.34], [.60, .52, .27]);
  part(box(), 0xa47a52, largeBag, [0, 1.035, -.36], [.63, .16, .30]);
  part(box(), 0xa47a52, largeBag, [0, .71, -.495], [.43, .20, .07]);
  const bagHandle = part(new THREE.TorusGeometry(.12, .027, 6, 12, Math.PI),
    0x62482f, largeBag, [0, 1.105, -.32], [1, .65, 1]);
  bagHandle.rotation.y = Math.PI;
  for (const side of [-1, 1]) {
    part(box(), 0x62482f, largeBag, [side * .225, .81, .235], [.065, .44, .035]);
    part(box(), 0x62482f, largeBag, [side * .225, 1.015, -.025], [.065, .06, .55]);
    part(box(), palette.brass, largeBag, [side * .19, .89, -.507], [.065, .08, .025]);
  }
  largeBag.visible = false;
  root.userData.largeBag = largeBag;

  // Tail is a sequence of rigid rounded segments, deliberately separate from the legs.
  const tail = new THREE.Group();
  tail.position.set(0, .52, -.21);
  body.add(tail);
  for (let i = 0; i < 8; i++) {
    const t = i / 7;
    part(orb(), i % 2 ? palette.mask : palette.fur, tail,
      [Math.sin(t * 1.15) * .33, -.06 - Math.sin(t * Math.PI) * .14, -.10 - t * .79],
      [.145 - t * .04, .14 - t * .025, .145]);
  }
  root.scale.setScalar(.91);
  root.userData.assetSource = 'original-procedural-prototype';
  root.userData.rigged = false;
  root.userData.animate = (time: number, speed: number, carrying: boolean, sneaking: boolean) => {
    const stride = Math.sin(time * (sneaking ? 7 : 11));
    const moving = Math.min(1, Math.abs(speed));
    legs[0].rotation.x = stride * .58 * moving;
    legs[1].rotation.x = -stride * .58 * moving;
    arms[0].rotation.x = carrying ? -1.13 : -stride * .4 * moving;
    arms[1].rotation.x = carrying ? -1.13 : stride * .4 * moving;
    arms[0].rotation.z = carrying ? -.12 : .15;
    arms[1].rotation.z = carrying ? .12 : -.15;
    body.position.y = sneaking ? -.08 : Math.abs(stride) * .035 * moving;
    body.rotation.x = sneaking ? .16 : moving * .06;
    tail.rotation.y = Math.sin(time * 4) * .1 * moving;
    head.rotation.y = Math.sin(time * 1.5) * .035 * (1 - moving);
  };
  return root;
}

export function createRobot(kind: 'guard' | 'watering' | 'sweeping'): THREE.Group {
  const root = new THREE.Group();
  root.name = `Original procedural rigid ${kind} robot — Tripo model pending`;
  const accent = kind === 'guard' ? palette.red : kind === 'watering' ? palette.jade : palette.brass;
  const chassis = new THREE.Group();
  root.add(chassis);
  const wheels: THREE.Mesh[] = [];
  for (const side of [-1, 1]) {
    const wheel = part(cylinder(), palette.dark, chassis, [side * .39, .20, 0], [.195, .13, .195]);
    wheel.rotation.z = Math.PI / 2;
    wheels.push(wheel);
    const hub = part(cylinder(), palette.brass, chassis, [side * .465, .20, 0], [.09, .022, .09]);
    hub.rotation.z = Math.PI / 2;
  }
  part(cylinder(.34, .37, .60), palette.cream, chassis, [0, .65, 0]);
  part(cylinder(.35, .36, .08), accent, chassis, [0, .41, 0]);
  part(orb(), accent, chassis, [0, 1.02, 0], [.32, .28, .28]);
  part(box(), palette.dark, chassis, [0, 1.045, .235], [.43, .18, .10]);
  for (const side of [-1, 1]) {
    part(orb(), kind === 'guard' ? 0xfde7af : 0xb8f0d4, chassis, [side * .11, 1.057, .299], [.04, .045, .012], false);
  }
  part(cylinder(.36, .39, .06), palette.cream, chassis, [0, 1.26, 0]);
  part(cylinder(.23, .28, .10), accent, chassis, [0, 1.34, 0]);
  part(cylinder(.025, .025, .16), palette.dark, chassis, [.13, 1.46, -.01]);
  part(orb(), kind === 'guard' ? palette.red : palette.brass, chassis, [.13, 1.55, -.01], [.06, .06, .06]);
  part(box(), accent, chassis, [0, .71, .356], [.13, .17, .028]);
  part(box(), palette.brass, chassis, [0, .72, .377], [.04, .07, .016], false);
  if (kind === 'watering') {
    part(cylinder(.20, .22, .45), accent, chassis, [0, .74, -.40]);
    const spout = part(cylinder(.055, .055, .43), palette.brass, chassis, [.42, .74, .04]);
    spout.rotation.z = -.95;
    const rose = part(cylinder(.10, .07, .07), accent, chassis, [.60, .86, .04]);
    rose.rotation.z = -.95;
  } else if (kind === 'sweeping') {
    const handle = part(cylinder(.025, .025, .92), palette.brass, chassis, [.48, .60, .08]);
    handle.rotation.z = -.16;
    part(box(), 0xbda67c, chassis, [.55, .12, .08], [.33, .18, .12]);
    for (let i = 0; i < 5; i++) part(box(), 0x887650, chassis, [.42 + i * .065, .045, .08], [.016, .06, .14], false);
  } else {
    part(box(), palette.dark, chassis, [-.36, .71, .04], [.12, .30, .16]);
    part(orb(), palette.brass, chassis, [-.36, .54, .04], [.07, .07, .07]);
  }
  root.userData.assetSource = 'original-procedural-prototype';
  root.userData.rigged = false;
  root.userData.animate = (time: number, speed: number) => {
    for (const wheel of wheels) wheel.rotation.x = time * speed * 6;
    chassis.rotation.z = Math.sin(time * 8) * Math.min(.025, Math.abs(speed) * .015);
  };
  return root;
}

/** Release only original per-instance prototype resources; the outline material is shared. */
export function disposeProceduralActor(root:THREE.Group){
 const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>();
 root.traverse(object=>{if(object instanceof THREE.Mesh){geometries.add(object.geometry);for(const material of Array.isArray(object.material)?object.material:[object.material])if(material!==ink)materials.add(material);}});
 root.removeFromParent();geometries.forEach(geometry=>geometry.dispose());materials.forEach(material=>material.dispose());root.clear();
}
