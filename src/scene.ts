import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { createPlayerActor, createMechanicalActor, mechanicalAssets } from './actors';
import { activeObstacles, dist, type State, type Item } from './simulation';
export type View = ReturnType<typeof createView>;
const C={stone:0xe9dfc9,edge:0xc9bea9,jade:0x376b59,leaf:0x71977b,cream:0xf8efd8,ink:0x263c35,red:0xc9533e,brass:0xc8a44d};
export function createView(canvas:HTMLCanvasElement){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
 const scene=new THREE.Scene();scene.background=new THREE.Color(0xe9e4d6);scene.fog=new THREE.Fog(0xe9e4d6,50,100);
 const camera=new THREE.OrthographicCamera(-16,16,12,-12,.1,120);camera.position.set(12,18,24);camera.lookAt(0,0,0);
 scene.add(new THREE.HemisphereLight(0xfff9e9,0x8c9d8e,2.7));const sun=new THREE.DirectionalLight(0xffe8b0,3.4);sun.position.set(-13,26,12);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-20,right:20,top:20,bottom:-20,near:1,far:70});sun.shadow.normalBias=.035;sun.shadow.bias=-.0002;scene.add(sun);
 const world=new THREE.Group();scene.add(world);const items=new Map<string,THREE.Group>(),robots=new Map<string,THREE.Group>();const playerActor=createPlayerActor(),raccoon=playerActor.root;scene.add(raccoon);
 const mat=(color:number,roughness=.85,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});const material=new Map<number,THREE.Material>();
 function mesh(geo:THREE.BufferGeometry,color:number,parent:THREE.Object3D,x=0,y=0,z=0){if(!material.has(color))material.set(color,mat(color));const m=new THREE.Mesh(geo,material.get(color)!);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 const box=(p:THREE.Object3D,x:number,y:number,z:number,w:number,h:number,d:number,c:number)=>mesh(new THREE.BoxGeometry(w,h,d),c,p,x,y,z);
 const sphere=(p:THREE.Object3D,x:number,y:number,z:number,r:number,c:number)=>mesh(new THREE.SphereGeometry(r,8,6),c,p,x,y,z);
 const cylinder=(p:THREE.Object3D,x:number,y:number,z:number,r1:number,r2:number,h:number,c:number)=>mesh(new THREE.CylinderGeometry(r1,r2,h,16),c,p,x,y,z);
 function label(text:string,w=2.3,bg='#f7efd9',fg='#284a3c'){
  const can=document.createElement('canvas');can.width=640;can.height=160;const ctx=can.getContext('2d')!;ctx.fillStyle=bg;ctx.fillRect(0,0,640,160);ctx.strokeStyle=fg;ctx.lineWidth=5;ctx.strokeRect(10,10,620,140);ctx.fillStyle=fg;ctx.font='600 42px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,320,84,590);const texture=new THREE.CanvasTexture(can);texture.colorSpace=THREE.SRGBColorSpace;const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:false}));sp.scale.set(w,w/4,1);return sp;
 }
 function flowers(p:THREE.Object3D,x:number,z:number,seed:number){for(let i=0;i<13;i++){const a=i*2.4+seed,r=.15+(i%4)*.24,xx=x+Math.cos(a)*r,zz=z+Math.sin(a)*r;const y=.65+(i%3)*.15;cylinder(p,xx,y/2,zz,.025,.025,y,C.jade);sphere(p,xx,y,zz,.11,i%3?C.cream:C.red);}}
 function planter(x:number,z:number,w:number,d:number,h:number){const p=new THREE.Group();world.add(p);box(p,x,h/2,z,w,h,d,C.jade);box(p,x,h,z,w+.15,.12,d+.15,C.ink);box(p,x,.12,z,w+.18,.18,d+.18,C.edge);box(p,x,h+.03,z,w-.15,.1,d-.15,0x564f3d);for(let i=0;i<18;i++){const xx=x+Math.sin(i*3.41)*w*.4,zz=z+Math.cos(i*1.97)*d*.35;const m=sphere(p,xx,h+.25+(i%3)*.13,zz,.38,i%4===0?C.jade:C.leaf);m.scale.set(1.5,.8,1);}flowers(p,x,z,1);}
 function tree(x:number,z:number,h=4){const start=world.children.length;cylinder(world,x,h/2,z,.18,.28,h,C.ink);for(let j=0;j<8;j++){const a=j*2.4;const m=sphere(world,x+Math.cos(a)*.8,h+.2+(j%3)*.38,z+Math.sin(a)*.8,.85,j%2?C.leaf:C.jade);m.scale.y=1.2;}cylinder(world,x,.25,z,.7,.6,.5,C.edge);collectOccluders(start,{x,z,y:h});}
 function arch(x:number,z:number){for(const xx of [x-2,x+2]){box(world,xx,1.8,z,.48,3.6,.6,C.cream);box(world,xx,3.55,z,.7,.2,.8,C.edge);sphere(world,xx,3.9,z,.22,C.cream);}box(world,x,3.5,z,4.5,.38,.5,C.cream);}
 function makeItem(i:Item){const g=new THREE.Group();
  if(i.kind==='token'){cylinder(g,0,.32,0,.32,.32,.12,C.brass);const star=mesh(new THREE.OctahedronGeometry(.18),C.cream,g,0,.45,0);star.rotation.z=.4;}
  if(i.kind==='badge'){box(g,0,.4,0,.42,.6,.06,C.cream);const l=mesh(new THREE.TorusGeometry(.14,.035,6,12),C.brass,g,0,.8,0);l.rotation.y=0;sphere(g,0,.45,.04,.11,C.jade);}
  if(i.kind==='map'){box(g,0,.15,0,.65,.08,.48,C.cream);box(g,0,.2,0,.04,.01,.4,C.jade);box(g,0,.2,0,.6,.01,.03,C.red);}
  if(i.kind==='key'){const ring=mesh(new THREE.TorusGeometry(.18,.055,6,16),C.brass,g,-.2,.3,0);ring.rotation.x=Math.PI/2;box(g,.12,.3,0,.5,.08,.08,C.brass);box(g,.28,.3,.1,.09,.08,.18,C.brass);}
  if(i.kind==='bell'){cylinder(g,0,.45,0,.2,.4,.6,C.brass);cylinder(g,0,.15,0,.43,.43,.08,C.ink);sphere(g,0,.7,0,.17,C.brass);const loop=mesh(new THREE.TorusGeometry(.12,.04,6,16),C.brass,g,0,.95,0);loop.rotation.y=.3;}
  if(i.kind==='bag'){box(g,0,.45,0,.65,.8,.45,0x9d6a43);const handle=mesh(new THREE.TorusGeometry(.2,.045,6,12,Math.PI),C.ink,g,0,.9,0);handle.rotation.z=0;box(g,0,.45,.235,.42,.24,.03,C.cream);}
  if(i.kind==='box'){box(g,0,.45,0,.82,.85,.82,0xbca174);for(const x of [-.32,.32]){box(g,x,.46,.42,.07,.85,.03,0x806a49);box(g,x,.46,-.42,.07,.85,.03,0x806a49);}box(g,0,.45,.43,.35,.25,.03,C.cream);}
  if(i.kind==='trolley'){box(g,0,.2,0,.9,.13,1.1,C.jade);for(const x of [-.4,.4])for(const z of [-.4,.4])sphere(g,x,.14,z,.14,C.ink);box(g,0,.7,-.5,.8,.08,.08,C.ink);for(const x of [-.4,.4])box(g,x,.45,-.5,.06,.6,.06,C.ink);}
  g.userData.kind=i.kind;return g;
 }
 const conePositions=new Float32Array(42*9);const coneGeom=new THREE.BufferGeometry();coneGeom.setAttribute('position',new THREE.BufferAttribute(conePositions,3));
 const cone=new THREE.Mesh(coneGeom,new THREE.MeshBasicMaterial({color:0xd3a43b,transparent:true,opacity:.25,depthWrite:false,side:THREE.DoubleSide}));cone.position.y=.045;scene.add(cone);
 function symbol(text:string,bg:string){const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d')!;ctx.fillStyle=bg;ctx.beginPath();ctx.arc(64,64,59,0,Math.PI*2);ctx.fill();ctx.fillStyle='#263c35';ctx.font='bold 104px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,64,70);const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:false,depthWrite:false}));sprite.scale.set(.66,.66,1);return sprite;}
 const attention=symbol('!','#ed8266');attention.visible=false;scene.add(attention);const distractedMark=symbol('?','#f4d376');scene.add(distractedMark);distractedMark.visible=false;
 const selection=new THREE.Mesh(new THREE.RingGeometry(.55,.61,32),new THREE.MeshBasicMaterial({color:C.cream,side:THREE.DoubleSide,depthTest:false}));selection.rotation.x=-Math.PI/2;selection.position.y=.07;scene.add(selection);
 const destination=new THREE.Mesh(new THREE.RingGeometry(.19,.25,24),new THREE.MeshBasicMaterial({color:C.jade,side:THREE.DoubleSide}));destination.rotation.x=-Math.PI/2;destination.position.y=.06;destination.visible=false;scene.add(destination);
 const toy=new THREE.Group();sphere(toy,0,.25,0,.2,C.red);sphere(toy,.18,.4,0,.12,C.red);box(toy,.3,.4,0,.15,.07,.07,C.brass);scene.add(toy);toy.visible=false;
 const soundRings=[0,1,2].map(()=>{const ring=new THREE.Mesh(new THREE.RingGeometry(.92,1,48),new THREE.MeshBasicMaterial({color:C.red,transparent:true,opacity:.8,depthTest:false,depthWrite:false,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;scene.add(ring);return ring;});
 const fadingMaterials:{material:THREE.Material;opacity:number;tree?:{x:number;z:number;y:number}}[]=[];
 function collectOccluders(start:number,tree?:{x:number;z:number;y:number}){
  const group=new THREE.Group();for(const o of world.children.slice(start))group.add(o);world.add(group);
  const copies=new Map<THREE.Material,THREE.Material>();
  group.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.Sprite){o.userData.occluder=true;const m=o.material;if(!Array.isArray(m)){if(!copies.has(m)){const copy=m.clone();copy.transparent=true;copies.set(m,copy);fadingMaterials.push({material:copy,opacity:m.opacity,tree});}o.material=copies.get(m)!;}}});
  // Keep each tree independently fadeable while batching its same-colour canopy pieces.
  if(tree){group.updateMatrixWorld(true);const batches=new Map<THREE.Material,THREE.BufferGeometry[]>();const meshes:THREE.Mesh[]=[];group.traverse(o=>{if(o instanceof THREE.Mesh&&!Array.isArray(o.material)){const geo=o.geometry.clone().applyMatrix4(o.matrixWorld);const plain=geo.index?geo.toNonIndexed():geo;if(plain!==geo)geo.dispose();if(!batches.has(o.material))batches.set(o.material,[]);batches.get(o.material)!.push(plain);meshes.push(o);}});for(const o of meshes){o.removeFromParent();o.geometry.dispose();}for(const [material,geos]of batches){const merged=mergeGeometries(geos,false);geos.forEach(g=>g.dispose());if(merged){const mesh=new THREE.Mesh(merged,material);mesh.userData.occluder=true;mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);}}}
 }
 let door:THREE.Group,cloth:THREE.Mesh|undefined,level=-1, viewport={w:0,h:0};let lastFrame=performance.now();let fps=60;
 function disposeWorld(){world.traverse(o=>{if(o instanceof THREE.Mesh)o.geometry.dispose();if(o instanceof THREE.Sprite){const m=o.material as THREE.SpriteMaterial;m.map?.dispose();m.dispose();}});world.clear();for(const g of items.values())g.removeFromParent();for(const g of robots.values())g.removeFromParent();items.clear();robots.clear();}
 function build(s:State){disposeWorld();for(const {material} of fadingMaterials)material.dispose();fadingMaterials.length=0;level=s.level;box(world,0,-.4,0,24,.75,20,C.stone);box(world,0,-.85,0,24.4,.25,20.4,C.edge);
  // Jointed stone paving with restrained variation.
  for(let x=-11.2;x<12;x+=1.4)for(let z=-9.2;z<10;z+=1.4){const c=[0xe8dfcc,0xeee4d1,0xe4dbc8,0xf0e6d3][Math.abs(Math.round(x*11+z*7))%4];box(world,x,.002,z,1.37,.025,1.37,c);}
  // Sunken jade lawns soften the paving, paths remain physically navigable.
  for(const o of activeObstacles(s)){if(o.kind==='planter')planter(o.x,o.z,o.w,o.d,o.h);}
  for(const x of [-11.6,11.6]){box(world,x,.35,0,.35,.7,19.8,C.cream);for(let z=-9;z<10;z+=3.8)tree(x,z,3.4+(z%2)*.3);}
  box(world,0,.4,-9.6,23,.8,.4,C.cream);
  // Glass conservatory: actual walls use precise colliders; glazing and ribs remain readable from above.
  const glazingStart=world.children.length;
  for(const x of [0,10]){box(world,x,1.4,-6,.25,2.8,6,C.cream);for(let z=-8.8;z<-3;z+=1.4)box(world,x,2.9,z,.1,2.6,.12,C.jade);}
  box(world,5,1.1,-9,10,2.2,.3,C.cream);for(let x=.3;x<10;x+=1.3){box(world,x,2.9,-9,.09,2.6,.1,C.jade);box(world,x,2.9,-6,.07,.07,6,C.jade);}box(world,5,3,-9,10,.1,.1,C.jade);box(world,5,4,-9,10,.1,.1,C.jade);box(world,5,3,-3,10,.1,.1,C.jade);
  const glass=new THREE.MeshPhysicalMaterial({color:0x9bc8b6,transparent:true,opacity:.12,roughness:.2,side:THREE.DoubleSide,depthWrite:false});const roof=new THREE.Mesh(new THREE.BoxGeometry(10,.025,6),glass);roof.position.set(5,4.05,-6);world.add(roof);
  for(const x of [.05,9.95]){const pane=new THREE.Mesh(new THREE.BoxGeometry(.02,1.8,6),glass);pane.position.set(x,3,-6);world.add(pane);}
  collectOccluders(glazingStart);
  box(world,5,.035,-6,9.6,.045,5.6,0xd7d2b8);
  box(world,5,1.25,-8.6,8,.15,.5,C.jade);for(const x of [1.5,8.5])box(world,x,.6,-8.6,.12,1.2,.4,C.jade);
  for(let i=0;i<6;i++){const x=1.7+i*1.25;cylinder(world,x,1.5,-8.6,.22,.17,.4,C.red);sphere(world,x,1.9,-8.6,.29,i%2?C.jade:C.leaf);}
  if(s.level===3)for(const i of s.items.filter(i=>i.kind==='bell')){cylinder(world,i.x,.4,i.z,.34,.44,.8,C.cream);cylinder(world,i.x,.83,i.z,.5,.5,.1,C.jade);}

  const facadeStart=world.children.length;
  box(world,.5,1.2,-3,1,2.4,.3,C.cream);box(world,7.5,1.2,-3,5,2.4,.3,C.cream);arch(3,-3);
  for(let x=5.4;x<10;x+=1.2){box(world,x,2.75,-3,.07,1,.1,C.jade);}
  const storeSign=label(s.level===4?'HELPERS ONLY':'THE CONSERVATORY',3.5);storeSign.position.set(6.8,3.8,-3.1);world.add(storeSign);
  door=new THREE.Group();world.add(door);for(let x=1.3;x<4.8;x+=.3)box(door,x,1.2,-3,.05,2.4,.08,C.jade);box(door,3,2,-3,3.8,.08,.1,C.jade);
  collectOccluders(facadeStart);
  cylinder(world,6,.35,-6.9,.85,.95,.65,C.edge);cylinder(world,6,.73,-6.9,.77,.77,.05,0x72aba1);cylinder(world,6,1,-6.9,.16,.24,.7,C.cream);sphere(world,6,1.45,-6.9,.15,C.cream);
  // Entry desk and a physical exit mat.
  box(world,-9, .65,6.2,2.5,1.2,.8,C.jade);box(world,-9,1.3,6.2,2.7,.12,1,C.cream);const exit=label('EXIT',1.7,'#386951','#fff4d8');exit.position.set(-10.25,.13,8.7);exit.material.depthTest=false;exit.rotation.x=-Math.PI/2;world.add(exit);
  const notice=label('Wear a badge.',2.2);notice.position.set(-9.5,2.1,4.8);world.add(notice);box(world,-9.5,.95,4.8,.1,1.9,.1,C.ink);
  for(const [x,z] of [[-7.5,-8.5],[-9.5,3.8],[10.5,-1.5],[-.5,8]]){cylinder(world,x,.3,z,.42,.3,.6,C.red);flowers(world,x,z,x+z);}
  for(let i=0;i<12;i++){const g=sphere(world,-10+(i*2.31)%21,.08,-8+(i*3.37)%16,.06,C.red);g.scale.y=.25;}
  for(const item of s.items){const g=makeItem(item);scene.add(g);items.set(item.id,g);}
  for(const r of s.robots){const g=createMechanicalActor(r.kind);scene.add(g);robots.set(r.id,g);}
  cloth=undefined;if(s.level===3){cloth=box(world,0,0,0,.28,.12,.3,C.cream);}
  // Batch immutable scenery by material. Hundreds of paving/foliage meshes become a few draws.
  world.updateMatrixWorld(true);const batches=new Map<THREE.Material,THREE.BufferGeometry[]>();const originals:THREE.Mesh[]=[];
  world.traverse(o=>{if(!(o instanceof THREE.Mesh)||Array.isArray(o.material)||o===cloth||o.parent===door||o.userData.occluder)return;
   const geo=o.geometry.clone();if(geo.index)geo.setIndex(geo.index.clone());geo.applyMatrix4(o.matrixWorld);const nonIndexed=geo.index?geo.toNonIndexed():geo;
   if(nonIndexed!==geo)geo.dispose();if(!batches.has(o.material))batches.set(o.material,[]);batches.get(o.material)!.push(nonIndexed);originals.push(o);
  });
  for(const m of originals){m.removeFromParent();m.geometry.dispose();}
  for(const [m,geos] of batches){const merged=mergeGeometries(geos,false);for(const geo of geos)geo.dispose();if(merged){const b=new THREE.Mesh(merged,m);b.castShadow=true;b.receiveShadow=true;world.add(b);}}

 }
 function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;if(w===viewport.w&&h===viewport.h)return;viewport={w,h};renderer.setSize(w,h,false);const aspect=w/h;const half=aspect<1?11.5:6.7;camera.left=-half*aspect;camera.right=half*aspect;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();}
 function render(s:State,nearId?:string,pathTarget?:{x:number;z:number},reduced=false){if(s.level!==level)build(s);resize();
  const narrow=viewport.w/viewport.h<1.15;const t=new THREE.Vector3(narrow?s.player.x*.82:s.player.x*.76,0,narrow?s.player.z*.82:s.player.z*.76);const desired=t.clone().add(new THREE.Vector3(12,15,24));camera.position.copy(desired);camera.lookAt(t);
  raccoon.position.set(s.player.x,0,s.player.z);raccoon.rotation.y=s.player.angle;playerActor.update(s.time,s.player.speed,!!s.cargo,s.player.sneaking,s.badge,s.bag,reduced);
  for(const i of s.items){let g=items.get(i.id);if(!g){g=makeItem(i);items.set(i.id,g);scene.add(g);}g.visible=i.holder==='ground'||i.holder==='player'&&s.cargo===i.id||i.holder==='helper'&&i.kind==='box'||i.kind==='trolley'&&s.trolley;
   if(i.holder==='player'&&playerActor.carrySocket&&s.cargo===i.id){playerActor.carrySocket.add(g);g.position.set(0,.06,.08);g.rotation.set(0,0,0);g.scale.setScalar(.7);}else if(i.holder==='player'){scene.add(g);g.position.set(s.player.x+Math.sin(s.player.angle)*.55,.85,s.player.z+Math.cos(s.player.angle)*.55);g.scale.setScalar(.7);}else if(i.holder==='helper'&&i.kind==='box'){scene.add(g);const h=s.robots.find(r=>r.cargo===i.id);if(h)g.position.set(h.x-(s.trolley?Math.sin(h.angle)*.8:0),s.trolley?.3:1,h.z-(s.trolley?Math.cos(h.angle)*.8:0));g.scale.setScalar(.85);}else if(i.kind==='trolley'&&s.trolley){const h=s.robots.find(r=>r.id===s.escort);g.visible=!!h;if(h)g.position.set(h.x-Math.sin(h.angle)*.8,0,h.z-Math.cos(h.angle)*.8);}else{scene.add(g);g.position.set(i.x,i.id==='badge'||i.kind==='map'?1.35:i.kind==='bell'?.9:0,i.z);g.scale.setScalar(1);}
  }
  for(const r of s.robots){const g=robots.get(r.id)!;g.position.set(r.x,0,r.z);g.rotation.y=r.angle;g.userData.animate?.(reduced?0:s.time,reduced||r.mode==='distracted'?0:.7,false,false);}
  if(cloth){const h=s.robots.find(r=>r.kind==='watering')!;cloth.position.set(h.x,.7,h.z-.6+Math.sin((reduced?0:s.time)*7)*.12);}
  const guard=s.robots[0];cone.position.set(guard.x,.04,guard.z);const obs=activeObstacles(s).filter(o=>o.h>1.1);const reach=(angle:number)=>{for(let d=.15;d<7.4;d+=.15){const x=guard.x+Math.sin(angle)*d,z=guard.z+Math.cos(angle)*d;if(obs.some(o=>Math.abs(x-o.x)<o.w/2&&Math.abs(z-o.z)<o.d/2))return d;}return 7.4;};for(let i=0;i<42;i++){const a=guard.angle-.72+i/42*1.44,b=a+1.44/42,ra=reach(a),rb=reach(b);conePositions.set([0,0,0,Math.sin(a)*ra,0,Math.cos(a)*ra,Math.sin(b)*rb,0,Math.cos(b)*rb],i*9);}coneGeom.attributes.position.needsUpdate=true;coneGeom.computeBoundingSphere();cone.material.color.setHex(guard.mode==='chase'?0xd64a34:0xb7831e);cone.material.opacity=guard.mode==='chase'?.4:.34;cone.visible=guard.mode!=='distracted'&&(s.mode==='play'||s.mode==='reading');attention.visible=guard.mode!=='distracted'&&(s.suspicion>.05||guard.mode==='chase');attention.position.set(guard.x,2.5,guard.z);distractedMark.visible=guard.mode==='distracted';distractedMark.position.set(guard.x,2.5,guard.z);
  selection.visible=!!nearId;const item=s.items.find(i=>i.id===nearId),r=s.robots.find(r=>r.id===nearId);if(item)selection.position.set(item.x,.07,item.z);else if(r)selection.position.set(r.x,.07,r.z);else selection.visible=false;
  destination.visible=!!pathTarget;if(pathTarget)destination.position.set(pathTarget.x,.05,pathTarget.z);
  toy.visible=!!s.noise;if(s.noise){const flight=Math.min(1,(s.time-s.lastSqueak)/.45);toy.position.set(THREE.MathUtils.lerp(s.player.x,s.noise.x,flight),Math.sin(flight*Math.PI)*1.8,s.noise.z-(s.noise.z-s.player.z)*(1-flight));}for(let j=0;j<soundRings.length;j++){const ring=soundRings[j];ring.visible=!!s.noise;if(s.noise){const pulse=reduced?.45:((s.time-s.lastSqueak)*1.25+j/3)%1;ring.position.set(s.noise.x,.1,s.noise.z);ring.scale.setScalar(.45+pulse*1.5);ring.material.opacity=(1-pulse)*.8;}}door.visible=!s.doorOpen;
  const inside=s.player.x>-.5&&s.player.x<10.5&&s.player.z< -2.4||s.robots.some(r=>r.cargo&&r.z< -2.4);const sight=new THREE.Ray(camera.position,new THREE.Vector3(s.player.x,.9,s.player.z).sub(camera.position).normalize());const playerDistance=camera.position.distanceTo(new THREE.Vector3(s.player.x,.9,s.player.z));for(const f of fadingMaterials){const hit=f.tree?sight.intersectSphere(new THREE.Sphere(new THREE.Vector3(f.tree.x,f.tree.y,f.tree.z),2.4),new THREE.Vector3()):null;const faded=f.tree?!!hit&&hit.distanceTo(camera.position)<playerDistance:inside;f.material.opacity=f.opacity*(faded?.13:1);f.material.depthWrite=!faded;}
  const now=performance.now();fps=fps*.95+Math.min(120,1000/(now-lastFrame))*.05;lastFrame=now;renderer.render(scene,camera);
 }
 const raycaster=new THREE.Raycaster(),plane=new THREE.Plane(new THREE.Vector3(0,1,0),0);
 function groundAt(clientX:number,clientY:number){const b=canvas.getBoundingClientRect();raycaster.setFromCamera(new THREE.Vector2((clientX-b.left)/b.width*2-1,-(clientY-b.top)/b.height*2+1),camera);const p=new THREE.Vector3();return raycaster.ray.intersectPlane(plane,p)?{x:p.x,z:p.z}:null;}
 function project(x:number,z:number,y=0){const p=new THREE.Vector3(x,y,z).project(camera);return{x:(p.x+1)/2*viewport.w,y:(1-p.y)/2*viewport.h};}
 return {renderer,scene,camera,render,groundAt,project,assets:playerActor.status,mechanicalAssets,get fps(){return Math.round(fps);}};
}
