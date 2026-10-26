/** Shared authored footprints: visible solid scenery and navigation use the same dimensions. */
export type ObstacleKind = 'planter' | 'wall' | 'door' | 'fountain' | 'desk' | 'post' | 'pot' | 'tree-base' | 'tree-trunk' | 'shelf' | 'pedestal' | 'loose-item';
export type Obstacle = {x:number;z:number;w:number;d:number;h:number;kind:ObstacleKind;shape?:'circle'};
export const PLAYER_RADIUS = .42;
export const WALK_BOUNDS = {minX:-11.425,maxX:11.425,minZ:-9.4,maxZ:9.65};
export const ENTRY_DESK = {x:-9,z:6.2,w:2.7,d:1,h:1.36} as const;
export const NOTICE = {x:-9.5,z:4.8,w:.1,d:.1,h:1.9} as const;
export const ARCH_POSTS = [1,5].map(x=>({x,z:-3,w:.48,d:.6,h:3.6}));
export const STORE_SHELF = {x:5,z:-8.6,w:8,d:.5,h:1.325} as const;
export const FOUNTAIN = {x:6,z:-6.9,radius:.95,h:.8} as const;
export const BELL_PEDESTAL_RADIUS = .5;
export const FLOWER_POTS = [{x:-7.5,z:-8.5},{x:-9.5,z:3.8},{x:10.5,z:-1.5},{x:-.5,z:8}];
export const BOUNDARY_TREES = [-11.6,11.6].flatMap(x=>Array.from({length:5},(_,i)=>{const z=-9+i*3.8;return{x,z,h:3.4+(z%2)*.3};}));
export const PLANTERS: readonly Obstacle[] = [
 {x:-4.8,z:2,w:4.2,d:2.2,h:1.65,kind:'planter'},
 {x:4,z:2.3,w:4.2,d:2,h:1.65,kind:'planter'},
 {x:-5,z:-3.8,w:2.8,d:3.4,h:2.1,kind:'planter'},
 {x:9,z:5.5,w:1.8,d:3,h:1.65,kind:'planter'},
];
export const STORE_WALLS: readonly Obstacle[] = [
 {x:.5,z:-3,w:1,d:.3,h:2.4,kind:'wall'},
 {x:7.5,z:-3,w:5,d:.3,h:2.4,kind:'wall'},
 {x:0,z:-6,w:.25,d:6,h:2.8,kind:'wall'},
 {x:10,z:-6,w:.25,d:6,h:2.8,kind:'wall'},
 {x:5,z:-9,w:10,d:.3,h:2.2,kind:'wall'},
];
export function gardenObstacles(level:number,bells:readonly {x:number;z:number}[]=[]):Obstacle[]{
 return [
  ...PLANTERS.map(o=>({...o})),...STORE_WALLS.map(o=>({...o})),
  {...ENTRY_DESK,kind:'desk'}, {...NOTICE,kind:'post'},
  ...ARCH_POSTS.map(o=>({...o,kind:'post' as const})),
  {...STORE_SHELF,kind:'shelf'},
  {x:FOUNTAIN.x,z:FOUNTAIN.z,w:FOUNTAIN.radius*2,d:FOUNTAIN.radius*2,h:FOUNTAIN.h,kind:'fountain',shape:'circle'},
  ...FLOWER_POTS.map(o=>({...o,w:.84,d:.84,h:.6,kind:'pot' as const,shape:'circle' as const})),
  ...BOUNDARY_TREES.flatMap(o=>[
   {x:o.x,z:o.z,w:1.4,d:1.4,h:.5,kind:'tree-base' as const,shape:'circle' as const},
   {x:o.x,z:o.z,w:.56,d:.56,h:o.h,kind:'tree-trunk' as const,shape:'circle' as const},
  ]),
  ...(level===3?[
   {x:3,z:-3,w:3.8,d:.35,h:2.4,kind:'door' as const},
   ...bells.map(o=>({...o,w:BELL_PEDESTAL_RADIUS*2,d:BELL_PEDESTAL_RADIUS*2,h:.88,kind:'pedestal' as const,shape:'circle' as const})),
  ]:[]),
 ];
}
/** Actor discs against solid rectangles/circles, including rounded corner clearance. */
export function overlapsObstacle(o:Obstacle,p:{x:number;z:number},radius=0):boolean{
 const x=Math.abs(p.x-o.x),z=Math.abs(p.z-o.z);
 if(o.shape==='circle'){const reach=o.w/2+radius-1e-7;return x<reach&&z<reach&&x*x+z*z<reach*reach;}
 if(radius===0)return x<o.w/2&&z<o.d/2;
 if(x>=o.w/2+radius||z>=o.d/2+radius)return false;
 const dx=Math.max(0,x-o.w/2),dz=Math.max(0,z-o.d/2),reach=radius-1e-7;
 return dx*dx+dz*dz<reach*reach;
}

export const GROUND_PROP_SIZES={bag:{w:.65,d:.45,h:.8},box:{w:.82,d:.82,h:.85},trolley:{w:.9,d:1.1,h:.3}} as const;
export function groundPropObstacle(item:{id:string;kind:string;holder:string;x:number;z:number}):Obstacle|null{
 if(item.holder!=='ground'||!(item.kind in GROUND_PROP_SIZES))return null;
 const size=GROUND_PROP_SIZES[item.kind as keyof typeof GROUND_PROP_SIZES];return{x:item.x,z:item.z,...size,kind:'loose-item'};
}
