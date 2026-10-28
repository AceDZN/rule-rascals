import test from 'node:test';
import assert from 'node:assert/strict';
import {HEISTS,missionConfig} from '../src/content';
import {STATIONS} from '../src/missions';
import {createGame,blocked,dist} from '../src/simulation';
import {findPath,clearSegment} from '../src/navigation';

test('every campaign candidate has a traversable approach from the entry and inside the arch',()=>{
 const checked=new Set<string>();
 for(let level=5;level<HEISTS.length;level++)for(const seed of [1,2]){
  const s=createGame(level,seed);s.doorOpen=true;
  const layout=s.items.filter(i=>i.kind==='box'||i.kind==='trolley').map(i=>[i.kind,i.x,i.z]).sort().join('|');
  for(const start of [{x:-9,z:8},{x:3,z:-4.44}])for(const item of s.items.filter(i=>i.holder==='ground')){
   const key=JSON.stringify([layout,start,item.x,item.z]);if(checked.has(key))continue;checked.add(key);
   const route=findPath(s,start,item);assert.ok(route.length,`L${level+1} ${item.id} from ${JSON.stringify(start)}`);
   let previous=start;for(const point of route){assert.ok(clearSegment(s,previous,point),`L${level+1} ${item.id}: actual clear segment`);previous=point;}
   assert.ok(dist(previous,item)<1.9,`L${level+1} ${item.id}: within interaction range`);
  }
 }
});
test('campaign service actions have a larger-helper approach with their required cargo actually picked up',()=>{
 const checked=new Set<string>();
 for(let level=5;level<HEISTS.length;level++){
  const s=createGame(level,1);s.doorOpen=true;const config=missionConfig(level);
  for(const task of config.tasks){
   const item=s.items.find(i=>i.correct&&i.request===task.request);
   // A scan/delivery is performed after pickup; its parcel is no longer a floor obstacle.
   if(item)item.holder='helper';
   const station=STATIONS[task.station];
   const layout=s.items.filter(i=>i.holder==='ground'&&(i.kind==='box'||i.kind==='trolley')).map(i=>[i.kind,i.x,i.z]).sort().join('|');
   const key=JSON.stringify([layout,task.station]);
   if(!checked.has(key)){
    checked.add(key);assert.equal(blocked(s,station,.42),false,`L${level+1} ${station.label} is free floor`);
    if(config.escort||config.helperCarry)assert.ok(findPath(s,{x:3,z:-4.44},station,.52).length,`L${level+1} helper can reach ${task.id}`);
   }
   if(item&&task.kind==='deliver')item.holder='delivered';
  }
 }
});
