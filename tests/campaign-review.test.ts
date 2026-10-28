import test from 'node:test';
import assert from 'node:assert/strict';
import {HEISTS,missionConfig} from '../src/content';
import {STATIONS,type StationId,type Task} from '../src/missions';
import {freshProgress,parseProgress,completeLevel,unlockedThrough,medals,type Completion} from '../src/campaign-progress';
import {createGame,activeTask,interact,inspect,drop,step,recover,canComplete,getViolations,visibleTo,blocked,dist,nearest,inStore,SPAWN,type State,type Point,type Item} from '../src/simulation';
import {walkableTarget,findPath} from '../src/navigation';

// These are simulation tests. Positioning establishes unit fixtures; it is not
// browser route completion, and no task index/completion/win state is injected
// in the complete-plan runs below.
function position(s:State,p:Point){const free=walkableTarget(s,s.player,p);assert.ok(free,`no free approach to ${JSON.stringify(p)}`);Object.assign(s.player,free);}
function take(s:State,id:string){
 const item=s.items.find(i=>i.id===id);assert.ok(item,`missing ${id}`);assert.equal(item.holder,'ground');
 position(s,item);assert.ok(dist(s.player,item)<2.1,`${id} is outside interaction reach`);
 inspect(s,id);assert.equal(interact(s,id),true,`could not take ${id}`);return item;
}
function nearbyFree(s:State,p:Point,radius=.52){
 for(const d of [1.1,1.3,1.5,1.7])for(let i=0;i<16;i++){
  const q={x:p.x+Math.sin(i*Math.PI/8)*d,z:p.z+Math.cos(i*Math.PI/8)*d};
  if(!blocked(s,q,radius))return q;
 }
 assert.fail(`no nearby actor approach to ${JSON.stringify(p)}`);
}
function askHelper(s:State){
 const h=s.robots.find(r=>r.id==='gardener')!;Object.assign(h,nearbyFree(s,s.player));
 inspect(s,h.id);assert.equal(interact(s,h.id),true);return h;
}
function crossWithHelper(s:State,item:Item){
 const h=askHelper(s);assert.equal(h.cargo,item.id);assert.equal(item.holder,'helper');
 Object.assign(h,{x:3,z:-3.7});Object.assign(s.player,{x:3,z:-1.7});
 for(let i=0;i<30&&!s.transported.includes(item.id);i++)step(s,{x:0,z:0},.05);
 assert.equal(s.mode,'play');assert.ok(s.transported.includes(item.id),'actual helper arch crossing must record this cargo id');
}
function begin(level:number,seed=2,equipment=false){
 const s=createGame(level,seed);s.mode='play';take(s,'badge');inspect(s,'notice');
 const cfg=missionConfig(level);if(cfg.bagOutside){position(s,SPAWN);drop(s);assert.equal(s.bag,false);}
 if(equipment&&cfg.map)take(s,'map');if(equipment&&cfg.trolley)take(s,'trolley');
 return s;
}
function station(s:State,id:StationId){
 position(s,STATIONS[id]);const h=s.robots.find(r=>r.id==='gardener')!;
 if(h.cargo||missionConfig(s.level).escort&&s.escort===h.id)Object.assign(h,nearbyFree(s,STATIONS[id]));
 return interact(s,`station-${id}`);
}
function perform(s:State,task:Task){
 const cfg=missionConfig(s.level);
 if(task.kind==='repair'){
  if(s.tool!==task.tool)take(s,task.tool!);
  if(cfg.escort&&!s.escort)askHelper(s);
 }else{
  const item=s.items.find(i=>i.correct&&i.request===task.request&&i.holder!=='delivered');assert.ok(item);
  if(item.holder==='ground'){
   if(cfg.escort&&!s.escort)askHelper(s);
   take(s,item.id);
   if(cfg.helperCarry&&item.kind==='box')crossWithHelper(s,item);
  }
 }
 const before=s.taskIndex;assert.equal(station(s,task.station),true,`L${s.level+1} ${task.id}: ${s.message}`);
 assert.equal(s.taskIndex,before+1,'one interaction advances exactly one task');
 assert.equal(s.completedTasks.at(-1),task.id);
}
function completePlan(level:number,seed=2,equipment=false){
 const s=begin(level,seed,equipment),cfg=missionConfig(level);
 if(level<5){
  if(level===2)askHelper(s);
  if(level===3){take(s,'key-side');position(s,{x:3,z:-1.8});assert.equal(interact(s,'side-door'),true);}
  const item=s.items.find(i=>i.correct)!;take(s,item.id);
  if(cfg.helperCarry)crossWithHelper(s,item);
  position(s,SPAWN);if(cfg.helperCarry){const h=s.robots.find(r=>r.id==='gardener')!;Object.assign(h,nearbyFree(s,SPAWN));}
  step(s,{x:0,z:0},1/60);
 }else{
  for(const task of cfg.tasks)perform(s,task);
  assert.deepEqual(s.completedTasks,cfg.tasks.map(t=>t.id));
  for(const task of cfg.tasks.filter(t=>t.kind==='deliver')){
   const item=s.items.find(i=>i.id===s.taskCargo[task.id]);assert.ok(item);assert.equal(item.holder,'delivered');assert.equal(item.request,task.request);
  }
 }
 assert.equal(canComplete(s),true);assert.equal(s.mode,'win');assert.equal(s.results.length,1);assert.equal(s.results[0].level,level);
 return s;
}

test('the normal campaign contains35 numbered jobs in7 progressively longer story chapters',()=>{
 assert.equal(HEISTS.length,35);
 const maxima:number[]=[];
 for(let c=0;c<7;c++){
  const group=HEISTS.slice(c*5,c*5+5);assert.equal(group.length,5);
  for(const [i,h]of group.entries()){
   const n=c*5+i;assert.equal(h.chapter??0,c);assert.equal(h.difficulty??1,c+1);
   assert.match(h.subtitle,new RegExp(`^${String(n+1).padStart(2,'0')} · `));assert.ok(h.title&&h.objective&&h.rules.length);
   assert.equal(h.translation.length,h.rules.length,`L${n+1} needs a translation for every posted rule`);
  }
  maxima.push(Math.max(...group.map((_,i)=>missionConfig(c*5+i).tasks.length)));
 }
 for(let c=1;c<maxima.length;c++)assert.ok(maxima[c]>maxima[c-1],`chapter${c+1} should extend the longest prior plan`);
});

test('every authored task has an actual station, unique id, real tool or uniquely described request',()=>{
 for(let level=5;level<HEISTS.length;level++){
  const cfg=missionConfig(level),items=cfg.items!;assert.ok(cfg.tasks.length);assert.equal(new Set(cfg.tasks.map(t=>t.id)).size,cfg.tasks.length);
  assert.equal(new Set(items.map(i=>i.id)).size,items.length);
  for(const task of cfg.tasks){
   assert.ok(STATIONS[task.station]);assert.ok(task.text);
   if(task.kind==='repair')assert.ok(items.some(i=>i.kind==='tool'&&i.id===task.tool));
   else{
    const cohort=items.filter(i=>i.request===task.request);assert.ok(task.request&&cohort.length>=2);
    assert.equal(cohort.filter(i=>i.correct).length,1);assert.equal(new Set(cohort.map(i=>i.detail)).size,cohort.length);
   }
  }
  assert.equal(cfg.tasks.at(-1)!.kind,'deliver');
 }
});

test('the automatic exit mat cannot steal the first ordinary E badge action in a new job',()=>{
 for(let level=5;level<35;level++){
  const s=createGame(level,2);s.mode='play';assert.equal(nearest(s)?.id,'badge');
  assert.equal(interact(s),true);assert.equal(s.badge,true);assert.equal(s.taskIndex,0);
 }
});

test('combined escort/carry jobs allow lawful helper recruitment before store entry',()=>{
 for(let level=5;level<35;level++){
  const cfg=missionConfig(level);if(!cfg.escort||!cfg.helperCarry)continue;
  const s=begin(level),h=s.robots.find(r=>r.id==='gardener')!;assert.equal(inStore(h),false);
  const path=findPath(s,s.player,h);assert.ok(path.length);assert.ok(path.every(p=>!inStore(p)),'helper must be approachable without forbidden entry');
  position(s,h);inspect(s,h.id);assert.equal(interact(s,h.id),true);assert.equal(s.escort,h.id);
  Object.assign(s.player,{x:3,z:-5});assert.ok(getViolations(s).includes('without-helper'),'conversation alone does not permanently authorize entry');
  Object.assign(h,{x:3,z:-4});assert.equal(getViolations(s).includes('without-helper'),false);
 }
});

for(let level=0;level<35;level++)test(`L${level+1}: complete its real interaction/task sequence in three positional variants`,()=>{
 for(const [seed,equipment]of [[1,false],[2,true],[3,false]] as const)completePlan(level,seed,equipment);
});

test('new missions never complete merely by returning the right item with unfinished tasks',()=>{
 for(let level=5;level<35;level++){
  const s=begin(level),item=s.items.find(i=>i.correct&&i.request)!;take(s,item.id);position(s,SPAWN);
  assert.equal(canComplete(s),false);assert.equal(s.taskIndex,0);assert.equal(s.mode,'play');
 }
});

test('correct histories change location across seeds while near-match labels stay equally plausible',()=>{
 for(let level=5;level<35;level++){
  const a=createGame(level,1),b=createGame(level,2);
  for(const target of a.items.filter(i=>i.correct&&i.request)){
   const other=b.items.find(i=>i.id===target.id)!;assert.equal(other.detail,target.detail);assert.equal(other.correct,true);
   assert.notDeepEqual({x:target.x,z:target.z},{x:other.x,z:other.z});
   const near=a.items.filter(i=>i.request===target.request);assert.ok(near.every(i=>i.label===target.label&&i.kind===target.kind));
  }
 }
});

test('station actions require real proximity and the next station in the stated order',()=>{
 const s=begin(8);const task=activeTask(s)!;const item=s.items.find(i=>i.correct&&i.request===task.request)!;take(s,item.id);
 position(s,SPAWN);assert.equal(interact(s,`station-${task.station}`),false);assert.equal(s.taskIndex,0);
 const wrong=(Object.keys(STATIONS) as StationId[]).find(id=>id!==task.station)!;
 assert.equal(station(s,wrong),false);assert.equal(s.taskIndex,0);assert.equal(item.holder,'player');
 assert.equal(station(s,task.station),true);assert.equal(s.taskIndex,1);
});

test('the wrong tool cannot repair or unlock; exchanging actual tools preserves the parcel slot',()=>{
 const s=begin(10);assert.equal(s.doorOpen,false);
 assert.equal(station(s,'west'),false);take(s,'brush');assert.equal(station(s,'west'),false);assert.equal(s.taskIndex,0);assert.equal(s.doorOpen,false);
 const parcel=s.items.find(i=>i.correct&&i.request)!;take(s,parcel.id);assert.equal(s.cargo,parcel.id);
 take(s,'wrench');assert.equal(s.cargo,parcel.id);assert.equal(s.tool,'wrench');assert.equal(s.items.find(i=>i.id==='brush')!.holder,'ground');
 assert.equal(station(s,'west'),true);assert.equal(s.doorOpen,true);assert.equal(s.taskIndex,1);assert.equal(s.cargo,parcel.id);
});

test('one repair interaction cannot silently complete a later repair at another station',()=>{
 const s=begin(13);take(s,'wrench');assert.equal(station(s,'west'),true);assert.equal(s.taskIndex,1);
 assert.equal(station(s,'west'),false);assert.equal(s.taskIndex,1);assert.deepEqual(s.completedTasks,['repair-west']);
 assert.equal(station(s,'east'),true);assert.equal(s.taskIndex,2);assert.equal(s.tool,'wrench');
});

test('wrong history never consumes a recoverable parcel or advances delivery',()=>{
 const s=begin(5),task=activeTask(s)!;const wrong=s.items.find(i=>i.request===task.request&&!i.correct)!;take(s,wrong.id);
 assert.equal(station(s,'exit'),false);assert.equal(s.taskIndex,0);assert.equal(wrong.holder,'player');assert.equal(s.cargo,wrong.id);assert.equal(s.mistakes,1);
 assert.equal(station(s,'exit'),false);assert.equal(s.mistakes,1,'held input is not multiple distinct mistaken decisions');
 drop(s);assert.equal(wrong.holder,'ground');const right=s.items.find(i=>i.correct&&i.request===task.request)!;take(s,right.id);
 assert.equal(station(s,'exit'),true);assert.equal(s.mode,'win');
});

test('the correct object for a later request cannot substitute for the current delivery',()=>{
 const s=begin(9),task=activeTask(s)!,later=s.items.find(i=>i.correct&&i.request!==task.request)!;
 take(s,later.id);assert.equal(station(s,'dispatch'),false);assert.equal(s.taskIndex,0);
 assert.equal(later.holder,'player');assert.equal(s.cargo,later.id);assert.deepEqual(s.completedTasks,[]);
});

test('scan evidence belongs to the actual scanned identity, and swapping can be repaired',()=>{
 const s=begin(7),task=activeTask(s)!;const original=s.items.find(i=>i.correct&&i.request===task.request)!;take(s,original.id);
 assert.equal(station(s,task.station),true);assert.equal(s.taskCargo[task.id],original.id);
 drop(s);assert.equal(original.holder,'ground');
 // Equivalent record, distinct physical item: generic scan semantics still require the same identity.
 const replacement:Item={...original,id:'unscanned-equivalent',x:7,z:0,holder:'ground'};s.items.push(replacement);take(s,replacement.id);
 assert.equal(station(s,'exit'),false);assert.equal(replacement.holder,'player');assert.equal(s.taskIndex,1);
 drop(s);take(s,original.id);assert.equal(station(s,'exit'),true);assert.equal(s.mode,'win');
});

test('a helper-held object must itself reach the station, beyond player-only interaction reach',()=>{
 const s=begin(12);perform(s,activeTask(s)!);perform(s,activeTask(s)!);
 const task=activeTask(s)!,item=s.items.find(i=>i.correct&&i.request===task.request)!;take(s,item.id);const h=askHelper(s);
 Object.assign(s.player,{x:6,z:-4.5});Object.assign(h,{x:3.6,z:-4.5});assert.equal(item.holder,'helper');assert.equal(h.cargo,item.id);
 assert.ok(dist(s.player,STATIONS.east)<2.1&&dist(h,s.player)<2.65);assert.ok(dist(h,STATIONS.east)>2.1);
 assert.equal(interact(s,'station-east'),false);assert.equal(s.taskIndex,2);
 Object.assign(h,{x:7,z:-4.5});assert.equal(interact(s,'station-east'),true);assert.equal(s.taskCargo[task.id],item.id);
});

test('a box cannot borrow another box’s helper-crossing evidence',()=>{
 const s=begin(9);const task=activeTask(s)!,box=s.items.find(i=>i.correct&&i.request===task.request)!;take(s,box.id);
 s.transported.push('different-box');assert.equal(station(s,'dispatch'),false);assert.equal(box.holder,'player');assert.equal(s.taskIndex,0);
 crossWithHelper(s,box);assert.equal(station(s,'dispatch'),true);assert.equal(box.holder,'delivered');
});

test('helper-only box transport does not forbid a visitor carrying a token through the arch',()=>{
 const s=begin(9),box=s.items.find(i=>i.kind==='box')!,token=s.items.find(i=>i.kind==='token')!;
 take(s,box.id);Object.assign(s.player,{x:3,z:-3});assert.ok(getViolations(s).includes('helpers-only'));
 position(s,{x:-2,z:0});drop(s);take(s,token.id);Object.assign(s.player,{x:3,z:-3});assert.equal(getViolations(s).includes('helpers-only'),false);
});

test('quiet-store means normal walking is permitted and actual sprinting is restricted only inside',()=>{
 const s=begin(6);Object.assign(s.player,{x:3,z:-5});step(s,{x:1,z:0},.05);
 assert.ok(Math.abs(s.player.speed-3.15)<.001);assert.equal(getViolations(s).includes('running-store'),false);
 step(s,{x:1,z:0,sprint:true},.05);assert.ok(s.player.speed>4.9);assert.ok(getViolations(s).includes('running-store'));
 s.player.z=-1;step(s,{x:1,z:0,sprint:true},.05);assert.equal(getViolations(s).includes('running-store'),false);
 s.player.z=-5;step(s,{x:0,z:0},.05);assert.equal(s.player.speed,0);assert.equal(getViolations(s).includes('running-store'),false);
});

test('watched requested cargo includes stationary holding but excludes a separately equipped tool',()=>{
 const s=begin(14),item=s.items.find(i=>i.correct&&i.request&&i.kind==='bell')!;take(s,'wrench');
 const g=s.robots.find(r=>r.id==='guard')!;Object.assign(s.player,{x:-9,z:1,speed:0});Object.assign(g,{x:-9,z:-.2,angle:0,mode:'patrol'});
 assert.equal(visibleTo(s,g),true);assert.equal(getViolations(s).includes('watched-cargo'),false);
 take(s,item.id);Object.assign(s.player,{x:-9,z:1,speed:0});assert.ok(getViolations(s).includes('watched-cargo'));
 g.mode='distracted';assert.equal(getViolations(s).includes('watched-cargo'),false);
});

test('catch recovery preserves delivered stages, scan identity and a real persistent tool',()=>{
 const s=begin(13);perform(s,activeTask(s)!);perform(s,activeTask(s)!);perform(s,activeTask(s)!);
 const delivered=s.items.find(i=>i.holder==='delivered')!;assert.ok(delivered);assert.equal(s.taskIndex,3);
 const scanTask=activeTask(s)!,next=s.items.find(i=>i.correct&&i.request===scanTask.request)!;take(s,next.id);assert.equal(station(s,scanTask.station),true);
 const completed=[...s.completedTasks],cargoEvidence={...s.taskCargo};s.mode='caught';recover(s);
 assert.equal(s.taskIndex,4);assert.deepEqual(s.completedTasks,completed);assert.deepEqual(s.taskCargo,cargoEvidence);assert.equal(delivered.holder,'delivered');
 assert.equal(s.tool,'wrench');assert.equal(s.items.find(i=>i.id==='wrench')!.holder,'player');assert.equal(s.retries,1);assert.equal(s.cargo,null);assert.equal(next.holder,'ground');
 take(s,next.id);assert.equal(station(s,'exit'),true);assert.equal(s.mode,'win');assert.equal(s.results[0].languageEvidence,false);
});

test('recovering a scanned helper box permits a new real crossing and its pending delivery',()=>{
 const s=begin(12);perform(s,activeTask(s)!);perform(s,activeTask(s)!);perform(s,activeTask(s)!);
 const task=activeTask(s)!,box=s.items.find(i=>i.correct&&i.request===task.request)!;assert.equal(box.holder,'helper');
 const evidence={...s.taskCargo};s.mode='caught';recover(s);
 assert.equal(s.taskIndex,3);assert.deepEqual(s.taskCargo,evidence);assert.equal(box.holder,'ground');assert.deepEqual(s.transported,[]);
 take(s,box.id);crossWithHelper(s,box);assert.equal(station(s,'dispatch'),true);assert.equal(s.mode,'win');assert.equal(box.holder,'delivered');
});

test('every finale equipment combination can complete without making map or trolley mandatory',()=>{
 for(const map of [false,true])for(const trolley of [false,true]){
  const s=begin(34);if(map)take(s,'map');if(trolley)take(s,'trolley');
  for(const task of missionConfig(34).tasks)perform(s,task);
  assert.equal(s.mode,'win');assert.equal(s.map,map);assert.equal(s.trolley,trolley);
 }
});

function result(level:number,extra:Partial<Completion>={}):Completion{return {level,assisted:true,retries:2,lawful:false,languageEvidence:false,time:60,...extra};}

test('ordinary assisted or retried action wins unlock all35 jobs sequentially without a grade gate',()=>{
 let p=freshProgress();assert.equal(unlockedThrough(p),0);
 for(let level=0;level<35;level++){assert.equal(unlockedThrough(p),level);p=completeLevel(p,result(level));assert.ok(p.completed[level]);assert.equal(p.current,Math.min(34,level+1));}
 assert.equal(Object.keys(p.completed).length,35);assert.equal(unlockedThrough(p),34);
 assert.deepEqual(Object.keys(p).sort(),['completed','current','seed','version']);
});

test('progress rejects skipped or invalid levels and preserves a better replay result without mutating input',()=>{
 const fresh=freshProgress();for(const level of [-1,1,34,35,1.5,NaN])assert.equal(completeLevel(fresh,result(level)),fresh);
 const first=completeLevel(fresh,result(0,{assisted:false,retries:0,lawful:true,languageEvidence:true,time:40}));
 const snapshot=JSON.stringify(first),next=completeLevel(first,result(0,{time:10}));
 assert.equal(JSON.stringify(first),snapshot);assert.equal(next.completed[0].time,40);assert.equal(medals(next.completed[0]),3);
 assert.equal(unlockedThrough(next),1);assert.equal(completeLevel(next,result(0,{assisted:false,retries:0,lawful:true,languageEvidence:true,time:30})).completed[0].time,30);
});

test('saved progress restores only a valid consecutive prefix and cannot unlock by current or grade metadata',()=>{
 const p=parseProgress(JSON.stringify({version:2,current:34,seed:42,grade:9,completed:{0:result(0),2:result(2)}}));
 assert.equal(p.seed,42);assert.equal(p.current,1);assert.equal(unlockedThrough(p),1);assert.deepEqual(Object.keys(p.completed),['0']);
 for(const raw of [null,'{','null',JSON.stringify({version:1,grade:9,current:34,completed:{}})]){const clean=parseProgress(raw);assert.equal(clean.current,0);assert.deepEqual(clean.completed,{});}
 const corrupt=parseProgress(JSON.stringify({version:2,current:34,completed:{0:result(0),1:{...result(1),time:'fast'}}}));assert.equal(unlockedThrough(corrupt),1);
});

test('reading and pause freeze campaign task, inventory and recovery pressure state',()=>{
 for(const mode of ['reading','paused'] as const){
  const s=begin(34);take(s,'wrench');s.mode=mode;const before=JSON.stringify(s);
  for(let i=0;i<60;i++)step(s,{x:1,z:1,sprint:true},.05);
  assert.equal(JSON.stringify(s),before);
 }
});
