import { blocked, type Point, type State } from './simulation';
import { PLAYER_RADIUS } from './world-layout';
const CELL=.5;
const distance=(a:Point,b:Point)=>Math.hypot(a.x-b.x,a.z-b.z);
export function clearSegment(s:State,a:Point,b:Point,radius=PLAYER_RADIUS):boolean{
 const steps=Math.max(1,Math.ceil(distance(a,b)/.08));
 for(let i=1;i<=steps;i++)if(blocked(s,{x:a.x+(b.x-a.x)*i/steps,z:a.z+(b.z-a.z)*i/steps},radius))return false;
 return true;
}
/** Clicking furniture approaches its edge; it never places an actor inside the footprint. */
export function walkableTarget(s:State,start:Point,end:Point,radius=PLAYER_RADIUS):Point|null{
 if(!blocked(s,end,radius))return end;
 for(let ring=.15;ring<=2.1;ring+=.15){
  const candidates=Array.from({length:32},(_,i)=>({x:end.x+Math.cos(i*Math.PI/16)*ring,z:end.z+Math.sin(i*Math.PI/16)*ring})).filter(p=>!blocked(s,p,radius));
  if(candidates.length)return candidates.sort((a,b)=>distance(a,start)-distance(b,start))[0];
 }
 return null;
}
export function findPath(s:State,start:Point,requestedEnd:Point,radius=PLAYER_RADIUS):Point[]{
 const end=walkableTarget(s,start,requestedEnd,radius);if(!end)return [];
 if(clearSegment(s,start,end,radius))return [end];
 const coords=(p:Point)=>[Math.round(p.x/CELL),Math.round(p.z/CELL)];const [sx,sz]=coords(start),[ex,ez]=coords(end);const key=(x:number,z:number)=>`${x},${z}`;
 const startKey=key(sx,sz),open=[{x:sx,z:sz,g:0,f:0}],cost=new Map([[startKey,0]]),prev=new Map<string,string>();let found='';
 for(let count=0;open.length&&count<3500;count++){
  open.sort((a,b)=>a.f-b.f);const n=open.shift()!,k=key(n.x,n.z),from=k===startKey?start:{x:n.x*CELL,z:n.z*CELL};
  if(Math.abs(n.x-ex)+Math.abs(n.z-ez)<=1&&clearSegment(s,from,end,radius)){found=k;break;}
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){
   const x=n.x+dx,z=n.z+dz,p={x:x*CELL,z:z*CELL};if(!clearSegment(s,from,p,radius))continue;
   const nk=key(x,z),g=n.g+Math.hypot(dx,dz);if(g>=(cost.get(nk)??Infinity))continue;cost.set(nk,g);prev.set(nk,k);open.push({x,z,g,f:g+Math.hypot(x-ex,z-ez)});
  }
 }
 if(!found)return [];const path:Point[]=[end];while(found!==startKey){const [x,z]=found.split(',').map(Number);path.push({x:x*CELL,z:z*CELL});const p=prev.get(found);if(!p)break;found=p;}
 return path.reverse();
}
