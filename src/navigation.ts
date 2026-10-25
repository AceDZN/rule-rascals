import { blocked, type Point, type State } from './simulation';
const CELL=.65;
export function findPath(s:State,start:Point,end:Point):Point[]{
 if(blocked(s,end,.34))return [];
 const coords=(p:Point)=>[Math.round(p.x/CELL),Math.round(p.z/CELL)];const [sx,sz]=coords(start),[ex,ez]=coords(end);const key=(x:number,z:number)=>`${x},${z}`;
 const open=[{x:sx,z:sz,g:0,f:0}],cost=new Map([[key(sx,sz),0]]),prev=new Map<string,string>();let found='';
 for(let count=0;open.length&&count<2500;count++){
  open.sort((a,b)=>a.f-b.f);const n=open.shift()!,k=key(n.x,n.z);if(Math.abs(n.x-ex)+Math.abs(n.z-ez)<=1){found=k;break;}
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){
   const x=n.x+dx,z=n.z+dz,p={x:x*CELL,z:z*CELL};if(blocked(s,p,.34)||blocked(s,{x:n.x*CELL,z:z*CELL},.34)||blocked(s,{x:x*CELL,z:n.z*CELL},.34))continue;
   const nk=key(x,z),g=n.g+Math.hypot(dx,dz);if(g>=(cost.get(nk)??Infinity))continue;cost.set(nk,g);prev.set(nk,k);open.push({x,z,g,f:g+Math.hypot(x-ex,z-ez)});
  }
 }
 if(!found)return [];const path:Point[]=[end];while(found!==key(sx,sz)){const [x,z]=found.split(',').map(Number);path.push({x:x*CELL,z:z*CELL});const p=prev.get(found);if(!p)break;found=p;}
 return path.reverse();
}
