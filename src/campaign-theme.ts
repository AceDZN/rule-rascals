import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { BOUNDARY_TREES, FOUNTAIN, PLANTERS, STORE_SHELF, WALK_BOUNDS } from './world-layout';

export type ChapterId = 'garden' | 'glasshouse' | 'workshop' | 'station' | 'museum' | 'rooftop' | 'festival';
export interface ChapterColors {
  stone: number; edge: number; jade: number; leaf: number;
  cream: number; ink: number; red: number; brass: number;
}
export interface ChapterTheme {
  id: ChapterId;
  name: string;
  nameHe: string;
  storeName: string;
  colors: ChapterColors;
  paving: readonly [number, number, number, number];
  background: number;
  sunColor: number;
  showFoliage: boolean;
  /** False requires the replacement posts included in createChapterDressing. */
  showBoundaryTrees: boolean;
}
export const CHAPTER_THEMES: readonly ChapterTheme[] = [
  { id:'garden', name:'Exhibition Garden', nameHe:'גני התערוכה', storeName:'THE GARDEN STORE',
    colors:{stone:0xe9dfc9,edge:0xc9bea9,jade:0x376b59,leaf:0x71977b,cream:0xf8efd8,ink:0x263c35,red:0xc9533e,brass:0xc8a44d},
    paving:[0xe8dfcc,0xeee4d1,0xe4dbc8,0xf0e6d3], background:0xe9e4d6,sunColor:0xffe8b0,showFoliage:true,showBoundaryTrees:true },
  { id:'glasshouse', name:'The Glasshouse', nameHe:'בית הזכוכית', storeName:'THE SEED LAB',
    colors:{stone:0xdde9dc,edge:0xa8bdb2,jade:0x3d7775,leaf:0x8eb586,cream:0xf0f6df,ink:0x294b4b,red:0xb96849,brass:0xc8b65c},
    paving:[0xdce8dd,0xe8efdf,0xd1e0d5,0xe3eddd],background:0xe1ece4,sunColor:0xf3ffd3,showFoliage:true,showBoundaryTrees:true },
  { id:'workshop', name:'Robot Workshop', nameHe:'סדנת הרובוטים', storeName:'THE PARTS WORKSHOP',
    colors:{stone:0xc6b4a0,edge:0x8a7467,jade:0x59655e,leaf:0x7c8a72,cream:0xe5d6b9,ink:0x343b3c,red:0xa5533c,brass:0xba9151},
    paving:[0xc2b19d,0xccbca7,0xb9aa98,0xd2c1aa],background:0xd4c4b0,sunColor:0xffd3a3,showFoliage:false,showBoundaryTrees:false },
  { id:'station', name:'Exhibition Station', nameHe:'תחנת התערוכה', storeName:'THE PARCEL OFFICE',
    colors:{stone:0xc7d1cf,edge:0x899b9e,jade:0x426271,leaf:0x718d83,cream:0xece5ce,ink:0x293f4b,red:0xb86c43,brass:0xd0ad59},
    paving:[0xc3cecd,0xd1d8d2,0xb9c6c7,0xd8dcd1],background:0xd8e1dd,sunColor:0xffe8bd,showFoliage:false,showBoundaryTrees:false },
  { id:'museum', name:'The Museum Wing', nameHe:'אגף המוזיאון', storeName:'THE COLLECTION ROOM',
    colors:{stone:0xe2ddd3,edge:0xb6a99b,jade:0x675866,leaf:0x8b9182,cream:0xf7eddd,ink:0x3b3645,red:0xa75c53,brass:0xb99a59},
    paving:[0xe4dfd6,0xf0e9db,0xd5d1c9,0xe9e2d6],background:0xe8e3db,sunColor:0xffeed3,showFoliage:false,showBoundaryTrees:false },
  { id:'rooftop', name:'Rooftop Run', nameHe:'גגות העיר', storeName:'THE ROOFTOP DEPOT',
    colors:{stone:0xa4adb8,edge:0x738196,jade:0x4d647c,leaf:0x839b91,cream:0xe7dbbf,ink:0x303e59,red:0xad705a,brass:0xd2ad68},
    paving:[0xa5afba,0xb2b9bf,0x98a4b3,0xb9bec2],background:0xbecbdc,sunColor:0xffd4b0,showFoliage:false,showBoundaryTrees:false },
  { id:'festival', name:'Festival Night', nameHe:'ליל הפסטיבל', storeName:'THE FESTIVAL PAVILION',
    colors:{stone:0xbfc3c5,edge:0x7a8396,jade:0x456c70,leaf:0x79998c,cream:0xf2e2be,ink:0x323a59,red:0xb85c50,brass:0xe0b95a},
    paving:[0xbcc2c3,0xcbd0cb,0xb0b9c0,0xd2d2c6],background:0xaebbd1,sunColor:0xffd5ac,showFoliage:true,showBoundaryTrees:true },
];

export function getChapterTheme(chapterIndex: number): ChapterTheme {
  const index = Number.isFinite(chapterIndex) ? Math.floor(chapterIndex) : 0;
  return CHAPTER_THEMES[Math.max(0, Math.min(CHAPTER_THEMES.length - 1, index))];
}

type PlacementKind = 'planter' | 'shelf' | 'fountain' | 'boundary-site' | 'outside-walk-bounds';
export interface DressingPlacement {
  name: string;
  kind: PlacementKind;
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  allowed?: { x: number; z: number; w: number; d: number };
}

/**
 * Static visual dressing only. Geometry stays inside authored solid footprints or
 * outside the walk bounds. It adds no navigation, interaction or collision state.
 * The caller owns scene lighting, the existing structure and chapter captions.
 */
export function createChapterDressing(chapterIndex: number): THREE.Group {
  const theme = getChapterTheme(chapterIndex), c = theme.colors;
  const root = new THREE.Group();
  root.name = `chapter-dressing-${theme.id}`;
  root.userData.decorativeOnly = true;
  root.userData.chapter = theme.id;
  const materials = new Map<string, THREE.MeshStandardMaterial>();
  const geometries = new Set<THREE.BufferGeometry>();
  const zones: { group: THREE.Group; kind: PlacementKind; allowed?: DressingPlacement['allowed'] }[] = [];
  const unitBox = keep(new THREE.BoxGeometry(1, 1, 1));
  const unitCylinder = keep(new THREE.CylinderGeometry(1, 1, 1, 14));
  const unitSphere = keep(new THREE.SphereGeometry(1, 12, 8));
  const unitCone = keep(new THREE.ConeGeometry(1, 1, 12));
  const axisY = new THREE.Vector3(0, 1, 0);
  function keep<T extends THREE.BufferGeometry>(geometry: T): T { geometries.add(geometry); return geometry; }
  function material(color: number, opacity = 1, glow = false) {
    const key = `${color}:${opacity}:${glow}`;
    if (!materials.has(key)) materials.set(key, new THREE.MeshStandardMaterial({
      color, roughness: glow ? .6 : .84, metalness: color === c.brass ? .35 : .08,
      transparent: opacity < 1, opacity, depthWrite: opacity === 1,
      side: THREE.DoubleSide, emissive: glow ? color : 0, emissiveIntensity: glow ? .45 : 0,
    }));
    return materials.get(key)!;
  }
  function mesh(parent: THREE.Object3D, geometry: THREE.BufferGeometry, color: number, x: number, y: number, z: number,
    sx = 1, sy = 1, sz = 1, opacity = 1, glow = false) {
    const m = new THREE.Mesh(geometry, material(color, opacity, glow));
    m.position.set(x, y, z); m.scale.set(sx, sy, sz);
    m.castShadow = opacity > .7; m.receiveShadow = true; parent.add(m); return m;
  }
  const box = (p: THREE.Object3D,x:number,y:number,z:number,w:number,h:number,d:number,color:number,opacity=1) => mesh(p,unitBox,color,x,y,z,w,h,d,opacity);
  const cylinder = (p:THREE.Object3D,x:number,y:number,z:number,r:number,h:number,color:number) => mesh(p,unitCylinder,color,x,y,z,r,h,r);
  const sphere = (p:THREE.Object3D,x:number,y:number,z:number,r:number,color:number,glow=false) => mesh(p,unitSphere,color,x,y,z,r,r,r,1,glow);
  function beam(p:THREE.Object3D,a:[number,number,number],b:[number,number,number],r:number,color:number) {
    const from=new THREE.Vector3(...a),to=new THREE.Vector3(...b),delta=to.clone().sub(from);
    const m=cylinder(p,0,0,0,r,delta.length(),color);m.position.copy(from.add(to).multiplyScalar(.5));m.quaternion.setFromUnitVectors(axisY,delta.normalize());return m;
  }
  function ring(p:THREE.Object3D,x:number,y:number,z:number,r:number,color:number,horizontal=false) {
    const m=mesh(p,keep(new THREE.TorusGeometry(r,.045,6,28)),color,x,y,z);if(horizontal)m.rotation.x=Math.PI/2;return m;
  }
  function zone(name:string,kind:PlacementKind,fn:(g:THREE.Group)=>void,allowed?:DressingPlacement['allowed']) {
    const group=new THREE.Group();group.name=name;root.add(group);fn(group);zones.push({group,kind,allowed});return group;
  }
  function onPlanters(fn:(g:THREE.Group,w:number,d:number,index:number)=>void) {
    PLANTERS.forEach((p,index)=>zone(`${theme.id}-cover-${index}`,'planter',g=>{
      g.position.set(p.x,p.h+.08,p.z);fn(g,p.w,p.d,index);
    },p));
  }
  function shelfDisplays(fn:(g:THREE.Group)=>void) {
    zone(`${theme.id}-shelf-displays`,'shelf',g=>{g.position.set(STORE_SHELF.x,1.36,STORE_SHELF.z);fn(g);},STORE_SHELF);
  }
  function gear(p:THREE.Object3D,x:number,y:number,z:number,r:number,color:number) {
    const g=new THREE.Group();g.position.set(x,y,z);p.add(g);
    const disc=cylinder(g,0,0,0,r*.86,.13,color);disc.rotation.x=Math.PI/2;
    for(let i=0;i<12;i++){const a=i/12*Math.PI*2;const tooth=box(g,Math.cos(a)*r*.92,Math.sin(a)*r*.92,0,r*.28,r*.23,.15,color);tooth.rotation.z=a;}
    const hub=cylinder(g,0,0,.09,r*.23,.05,c.ink);hub.rotation.x=Math.PI/2;return g;
  }
  function clock(p:THREE.Object3D,x:number,y:number,z:number,r:number) {
    const g=new THREE.Group();g.position.set(x,y,z);p.add(g);
    const disc=cylinder(g,0,0,0,r,.12,c.cream);disc.rotation.x=Math.PI/2;ring(g,0,0,.08,r,c.brass);
    for(let i=0;i<12;i++){const a=i/12*Math.PI*2;const tick=box(g,Math.sin(a)*r*.8,Math.cos(a)*r*.8,.08,.035,r*.12,.035,c.ink);tick.rotation.z=-a;}
    beam(g,[0,0,.12],[r*.45,r*.26,.12],.022,c.ink);beam(g,[0,0,.13],[-r*.18,r*.62,.13],.018,c.ink);return g;
  }
  function pennants(p:THREE.Object3D,a:[number,number,number],b:[number,number,number],count:number) {
    beam(p,a,b,.018,c.ink);const shape=new THREE.Shape();shape.moveTo(-.5,0);shape.lineTo(.5,0);shape.lineTo(0,-.8);shape.closePath();const geometry=keep(new THREE.ShapeGeometry(shape));
    for(let i=1;i<=count;i++){const t=i/(count+1);mesh(p,geometry,[c.red,c.brass,c.cream,0x5b9390][i%4],THREE.MathUtils.lerp(a[0],b[0],t),THREE.MathUtils.lerp(a[1],b[1],t),THREE.MathUtils.lerp(a[2],b[2],t),.28,.35,1);}
  }
  function boundaryPosts() {
    if(theme.showBoundaryTrees)return;
    for(const t of BOUNDARY_TREES)zone(`${theme.id}-boundary-${t.x}-${t.z}`,'boundary-site',g=>{
      g.position.set(t.x,0,t.z);cylinder(g,0,.25,0,.7,.5,c.edge);cylinder(g,0,t.h/2,0,.28,t.h,c.ink);
      if(theme.id==='workshop'){ring(g,0,t.h-.1,0,.34,c.brass,true);cylinder(g,0,t.h+.1,0,.32,.2,c.red);}
      if(theme.id==='station'){box(g,0,t.h,0,.66,.2,.45,c.brass);sphere(g,0,t.h+.25,0,.17,c.cream,true);}
      if(theme.id==='museum'){cylinder(g,0,t.h+.08,0,.39,.16,c.cream);cylinder(g,0,.52,0,.38,.12,c.cream);}
      if(theme.id==='rooftop'){box(g,0,t.h+.15,0,.55,.3,.45,c.edge);beam(g,[0,t.h+.3,0],[0,t.h+.8,0],.025,c.ink);}
    },{x:t.x,z:t.z,w:1.4,d:1.4});
  }

  boundaryPosts();
  // The existing fountain remains recognizable for location-bearing English.
  zone(`${theme.id}-fountain-rim`,'fountain',g=>{
    g.position.set(FOUNTAIN.x,0,FOUNTAIN.z);ring(g,0,.76,0,.85,c.brass,true);
  },{x:FOUNTAIN.x,z:FOUNTAIN.z,w:FOUNTAIN.radius*2,d:FOUNTAIN.radius*2});

  if(theme.id==='garden') {
    onPlanters((g,w,d,i)=>{
      const back=-d*.27,h=.85;
      for(const x of [-w*.34,w*.34])beam(g,[x,0,back],[x,h,back],.035,c.cream);
      for(let j=0;j<4;j++)beam(g,[-w*.34,.2+j*.2,back],[w*.34,.2+j*.2,back],.025,c.edge);
      for(let j=0;j<7;j++){const x=Math.sin(j*2.3+i)*w*.27;const leaf=sphere(g,x,.25+(j%3)*.2,back,.15,c.leaf);leaf.scale.multiply(new THREE.Vector3(1.2,.8,1));}
      cylinder(g,0,.18,d*.15,.22,.36,c.red);sphere(g,0,.42,d*.15,.3,c.jade);
    });
    zone('garden-pergola-backdrop','outside-walk-bounds',g=>{
      g.position.set(-5,0,-11.5);for(const x of [-3,3])box(g,x,2.1,0,.4,4.2,.5,c.cream);
      for(let x=-3.6;x<=3.6;x+=.6)box(g,x,4.2,0,.16,.2,1.8,c.edge);
      for(let j=0;j<9;j++)sphere(g,-3+j*.75,4.4,0,.35,j%2?c.leaf:c.jade);
    });
    shelfDisplays(g=>{for(let x=-3;x<=3;x+=1.5){cylinder(g,x,.14,0,.16,.28,c.red);sphere(g,x,.4,0,.23,c.leaf);}});
  }
  if(theme.id==='glasshouse') {
    onPlanters((g,w,d,i)=>{
      const x=w*.34,z=d*.3,h=.78;
      for(const xx of [-x,x])for(const zz of [-z,z])beam(g,[xx,0,zz],[xx,h,zz],.028,c.cream);
      for(const zz of [-z,z]){beam(g,[-x,h,zz],[0,h+.24,zz],.03,c.jade);beam(g,[0,h+.24,zz],[x,h,zz],.03,c.jade);}
      beam(g,[0,h+.24,-z],[0,h+.24,z],.028,c.jade);
      box(g,0,h*.5,-z,x*2,h,.025,0xa8d8c4,.22);
      for(let j=0;j<3;j++){const xx=(j-1)*w*.22;const bottle=cylinder(g,xx,.28,0,Math.min(w*.09,.18),.56,c.brass);bottle.material=material(0x85b7a6,.35);sphere(g,xx,.3,0,.10,[c.leaf,c.red,c.brass][(j+i)%3]);}
    });
    zone('glasshouse-domes','outside-walk-bounds',g=>{
      g.position.set(0,0,-13);for(const x of [-6,1,8]){
        cylinder(g,x,1.15,0,2.15,2.3,c.edge);
        const dome=mesh(g,keep(new THREE.SphereGeometry(2.2,20,12,0,Math.PI*2,0,Math.PI/2)),0xa8d8c4,x,2.3,0,1,1,1,.25);
        dome.castShadow=false;
        for(let j=0;j<12;j++){const a=j/12*Math.PI*2;beam(g,[x+Math.cos(a)*2.2,2.3,Math.sin(a)*2.2],[x,4.5,0],.035,c.jade);}
        ring(g,x,2.3,0,2.2,c.cream,true);
      }
    });
    shelfDisplays(g=>{for(let j=0;j<6;j++){const x=-3.4+j*1.35;cylinder(g,x,.24,0,.12,.48,c.jade);sphere(g,x,.55,0,.17,c.brass);}});
  }
  if(theme.id==='workshop') {
    onPlanters((g,w,d,i)=>{
      box(g,0,.13,0,w*.84,.26,d*.78,c.edge);
      const r=Math.min(.45,w*.17,d*.24);
      gear(g,-w*.22,.32+r,0,r,c.brass);gear(g,w*.19,.30+r*.8,0,r*.8,c.red);
      for(const x of [-w*.35,w*.35]){cylinder(g,x,.35,-d*.23,.08,.7,c.ink);ring(g,x,.7,-d*.23,.12,c.brass,true);}
      box(g,0,.42,d*.27,w*.6,.16,.07,c.ink);
    });
    zone('workshop-factory-backdrop','outside-walk-bounds',g=>{
      g.position.set(0,0,-12);box(g,0,2.3,0,23,4.6,1.4,c.red);box(g,0,4.7,0,23.4,.25,1.6,c.ink);
      for(let x=-9;x<=9;x+=3){box(g,x,2.4,.72,1.7,1.8,.08,c.ink);box(g,x,2.4,.78,1.4,1.5,.04,0xb1bdb2);box(g,x,2.4,.82,.08,1.5,.04,c.ink);}
      for(const x of [-9,8]){cylinder(g,x,3.8,-1,.48,7.6,c.ink);for(let y=1;y<8;y+=1.2)ring(g,x,y,-1,.51,c.brass,true);}
    });
    shelfDisplays(g=>{for(let j=0;j<5;j++)gear(g,-3.2+j*1.6,.34,0,.28,j%2?c.brass:c.ink);});
  }
  if(theme.id==='station') {
    onPlanters((g,w,d,i)=>{
      if(i===2){beam(g,[0,0,0],[0,.65,0],.05,c.ink);clock(g,0,.85,0,Math.min(.34,w*.18));return;}
      for(const x of [-w*.34,w*.34])beam(g,[x,0,0],[x,.86,0],.035,c.ink);
      box(g,0,.88,0,w*.85,.12,d*.72,c.jade);
      for(let j=0;j<2;j++){const x=(j?1:-1)*w*.19;box(g,x,.24,0,w*.28,.48,d*.45,j?c.red:c.brass);box(g,x,.24,d*.24,.05,.48,.025,c.ink);}
    });
    zone('station-train-backdrop','outside-walk-bounds',g=>{
      g.position.set(0,0,-13);for(const z of [-.75,.75])box(g,0,.12,z,25,.1,.1,c.ink);
      box(g,0,1.45,0,20,2.2,2.1,c.jade);box(g,0,2.65,0,20.4,.3,2.3,c.cream);
      for(let x=-8.4;x<=8.5;x+=2.4){box(g,x,1.8,1.08,1.4,.85,.04,0xacc4bf);box(g,x,.95,1.11,1.45,.06,.05,c.brass);}
      for(const x of [-8,-5,5,8]){const wheel=cylinder(g,x,.35,1.1,.4,.16,c.ink);wheel.rotation.x=Math.PI/2;}
      box(g,0,1.4,1.1,1,1.9,.06,c.brass);box(g,0,1.8,1.14,.65,.8,.03,c.ink);
    });
    shelfDisplays(g=>{for(let j=0;j<5;j++){box(g,-3.2+j*1.6,.2,0,.9,.4,.32,j%2?c.cream:c.brass);box(g,-3.2+j*1.6,.2,.17,.06,.4,.02,c.ink);}});
  }
  if(theme.id==='museum') {
    onPlanters((g,w,d,i)=>{
      box(g,0,.16,0,w*.58,.32,d*.6,c.cream);
      if(i%2===0){mesh(g,keep(new THREE.OctahedronGeometry(Math.min(w*.2,.48),0)),c.brass,0,.70,0);ring(g,0,.7,0,Math.min(w*.25,.6),c.edge);}
      else{cylinder(g,0,.5,0,Math.min(w*.12,.25),.7,c.cream);sphere(g,0,.95,0,Math.min(w*.15,.29),c.edge);}
    });
    zone('museum-colonnade-backdrop','outside-walk-bounds',g=>{
      g.position.set(0,0,-11.7);box(g,0,.15,0,24,.3,2,c.edge);
      for(let x=-10.5;x<=10.5;x+=3){cylinder(g,x,2.3,0,.38,4.3,c.cream);cylinder(g,x,.5,0,.65,.4,c.edge);cylinder(g,x,4.4,0,.65,.3,c.edge);}
      box(g,0,4.7,0,24.5,.5,1.8,c.cream);box(g,0,5.05,0,25,.2,2,c.edge);
    });
    shelfDisplays(g=>{for(let j=0;j<4;j++){const x=-3+j*2;box(g,x,.65,0,1.3,1.3,.16,c.brass);box(g,x,.65,.09,1.1,1.1,.03,c.cream);const m=box(g,x,.65,.12,.54,.54,.03,j%2?c.jade:c.red);m.rotation.z=Math.PI/4;}});
  }
  if(theme.id==='rooftop') {
    onPlanters((g,w,d,i)=>{
      box(g,0,.32,0,w*.78,.64,d*.73,c.edge);
      for(let j=0;j<6;j++)box(g,0,.12+j*.075,d*.375,w*.67,.035,.035,c.ink);
      const r=Math.min(w*.19,d*.24,.4);ring(g,0,.66,0,r,c.ink,true);
      for(let j=0;j<4;j++){const vane=box(g,0,.67,0,r*1.6,.035,r*.18,c.cream);vane.rotation.y=j*Math.PI/2+.4;}
      beam(g,[-w*.3,.65,-d*.25],[-w*.3,1.05,-d*.25],.025,c.ink);
    });
    zone('rooftop-city-skyline','outside-walk-bounds',g=>{
      g.position.set(0,0,-13);for(let i=0;i<8;i++){const x=-12+i*3.4,h=[4,6.5,5,8.5,5.5,7,4.5,6][i];box(g,x,h/2,0,2.6,h,2,c.ink);box(g,x,h+.12,0,2.8,.24,2.2,c.edge);
        for(let y=.8;y<h-.4;y+=1.1)for(const dx of [-.65,.65])box(g,x+dx,y,1.02,.42,.5,.035,(i+Math.round(y))%3?c.brass:0x8da7b8);
        beam(g,[x,h,0],[x,h+1,0],.035,c.ink);
      }
    });
    shelfDisplays(g=>{for(let j=0;j<5;j++){box(g,-3.2+j*1.6,.2,0,.7,.4,.32,c.edge);for(let k=0;k<3;k++)box(g,-3.2+j*1.6,.1+k*.1,.18,.55,.035,.03,c.ink);}});
  }
  if(theme.id==='festival') {
    onPlanters((g,w,d,i)=>{
      const h=.85;for(const x of [-w*.35,w*.35])beam(g,[x,0,0],[x,h,0],.025,c.brass);
      pennants(g,[-w*.35,h,0],[w*.35,h,0],Math.max(2,Math.floor(w*1.5)));
      for(let j=0;j<3;j++){const x=(j-1)*w*.2;const lantern=sphere(g,x,.3,-d*.1,Math.min(.18,w*.09),[c.brass,c.red,c.cream][(j+i)%3],true);lantern.scale.y*=1.2;ring(g,x,.3,-d*.1,Math.min(.19,w*.1),c.brass,true);}
    });
    zone('festival-stage-backdrop','outside-walk-bounds',g=>{
      g.position.set(0,0,-13);box(g,0,.35,0,21,.7,4,c.ink);box(g,0,.75,0,20,.1,3.8,c.red);
      for(const x of [-10,10])beam(g,[x,.7,0],[x,5.2,0],.15,c.brass);
      beam(g,[-10,5.2,0],[10,5.2,0],.12,c.brass);pennants(g,[-9.5,4.9,.1],[9.5,4.9,.1],20);
      for(let j=0;j<11;j++)sphere(g,-9+j*1.8,5.5,0,.18,j%2?c.brass:c.cream,true);
      for(const x of [-5,5]){const drum=cylinder(g,x,1.25,0,.7,1,c.red);drum.rotation.x=.2;ring(g,x,1.8,0,.73,c.brass,true);}
    });
    shelfDisplays(g=>{for(let j=0;j<6;j++)sphere(g,-3.4+j*1.35,.3,0,.17,j%2?c.brass:c.red,true);});
  }

  root.updateMatrixWorld(true);
  root.userData.placements = zones.map(({group,kind,allowed})=>{
    const b=new THREE.Box3().setFromObject(group);
    return {name:group.name,kind,allowed,bounds:{minX:b.min.x,maxX:b.max.x,minZ:b.min.z,maxZ:b.max.z}} satisfies DressingPlacement;
  });
  root.userData.walkBounds = { ...WALK_BOUNDS };
  // Batch by material here; the scene may batch these static meshes again.
  const batches=new Map<THREE.Material,THREE.BufferGeometry[]>();const originals:THREE.Mesh[]=[];
  root.traverse(o=>{if(!(o instanceof THREE.Mesh)||Array.isArray(o.material))return;const g=o.geometry.clone().applyMatrix4(o.matrixWorld);const plain=g.index?g.toNonIndexed():g;if(plain!==g)g.dispose();if(!batches.has(o.material))batches.set(o.material,[]);batches.get(o.material)!.push(plain);originals.push(o);});
  originals.forEach(m=>m.removeFromParent());
  for(const [m,parts] of batches){const geometry=mergeGeometries(parts,false);parts.forEach(p=>p.dispose());if(geometry){geometries.add(geometry);const batch=new THREE.Mesh(geometry,m);batch.castShadow=m.opacity>.7;batch.receiveShadow=true;root.add(batch);}}
  root.userData.dispose = () => { geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());root.removeFromParent(); };
  return root;
}

export function disposeChapterDressing(group: THREE.Group): void {
  (group.userData.dispose as (() => void) | undefined)?.();
}
