import test from 'node:test';
import assert from 'node:assert/strict';
import { HEISTS } from '../src/content';
import { createGame, getViolations, hasEscort, interact, inspect, drop, step, lineClear, visibleTo, canComplete, languageEvidence, recover, squeak, SPAWN, type State, type Point } from '../src/simulation';

function playing(level:number, seed=1) { const s=createGame(level,seed); s.mode='play'; return s; }
function at(s:State,p:Point) { s.player.x=p.x; s.player.z=p.z; }
function take(s:State,id:string) { const i=s.items.find(i=>i.id===id); assert.ok(i,`fixture item ${id}`); at(s,i); assert.equal(interact(s,id),true); }
function guardAway(s:State) { const g=s.robots.find(r=>r.kind==='guard')!; g.x=11; g.z=9; g.angle=0; return g; }

test('English fixtures preserve exclusive role, optional equipment and conditional entry',()=>{
 assert.ok(HEISTS[1].rules.includes("You don't have to take a map."));
 assert.ok(HEISTS[2].rules.includes("Visitors mustn't enter the store without a helper."));
 assert.ok(HEISTS[4].rules.includes('Only helpers can carry boxes through the arch.'));
 assert.ok(HEISTS[4].rules.includes('Visitors must leave large bags outside the arch.'));
 assert.ok(HEISTS[4].rules.includes("You don't have to use the trolley."));
 assert.equal(HEISTS[4].hint,'','transfer withholds solution hint');
});

test('wearing the badge satisfies the visitor obligation; an unequipped badge does not',()=>{
 const s=playing(0); at(s,{x:-9,z:2});
 assert.ok(getViolations(s).includes('badge'));
 take(s,'badge'); at(s,{x:-9,z:2});
 assert.equal(s.badge,true); assert.ok(!getViolations(s).includes('badge'));
 assert.equal(hasEscort(s),false,'a visitor badge does not confer helper status');
});

test('optional map may be taken or skipped without creating a violation',()=>{
 for(const useMap of [false,true]) {
  const s=playing(1); take(s,'badge'); if(useMap)take(s,'map');
  at(s,{x:-9,z:2}); assert.deepEqual(getViolations(s),[]);
  take(s,'token'); at(s,SPAWN);
  assert.equal(canComplete(s),true,`map ${useMap ? 'taken':'skipped'} remains eligible`);
 }
});

test('bag prohibition applies to the named doorway, not every location',()=>{
 const s=playing(1); take(s,'badge'); take(s,'bag');
 at(s,{x:-7,z:3}); drop(s); assert.ok(!getViolations(s).includes('doorway-bag'));
 take(s,'bag'); at(s,{x:3,z:-3}); drop(s);
 assert.ok(getViolations(s).includes('doorway-bag'));
 take(s,'bag'); at(s,{x:-7,z:3}); drop(s);
 assert.ok(!getViolations(s).includes('doorway-bag'),'moving the bag repairs the state');
});

test('conditional store prohibition permits outside visits and authorized accompanied entry',()=>{
 const s=playing(2); s.badge=true; at(s,{x:3,z:-1});
 assert.ok(!getViolations(s).includes('without-helper'));
 at(s,{x:3,z:-5}); assert.ok(getViolations(s).includes('without-helper'));
 const h=s.robots.find(r=>r.kind==='watering')!; h.x=3; h.z=-4.5;
 assert.equal(interact(s,h.id),true); assert.equal(hasEscort(s),true);
 assert.ok(!getViolations(s).includes('without-helper'));
 h.x=-8; h.z=5; assert.ok(getViolations(s).includes('without-helper'),'escort is a live condition');
});

test('the sweeping robot cannot satisfy the watering-helper description',()=>{
 const s=playing(2); s.badge=true; at(s,{x:3,z:-5});
 const r=s.robots.find(r=>r.kind==='sweeping')!; r.x=3; r.z=-4.5;
 assert.equal(interact(s,r.id),true); assert.equal(hasEscort(s),false);
 assert.ok(getViolations(s).includes('without-helper'));
});

test('physical cover occludes sight despite a guard facing the player',()=>{
 const s=playing(0); const g=s.robots.find(r=>r.kind==='guard')!;
 g.x=-4.8; g.z=.8; g.angle=0; at(s,{x:-4.8,z:3.2});
 assert.equal(lineClear(s,g,s.player),false);
 assert.equal(visibleTo(s,g),false);
});

test('guard sees a nearby unobstructed violation, but does not enforce an unseen one',()=>{
 const unseen=playing(2); at(unseen,{x:3,z:-7}); unseen.badge=true; guardAway(unseen);
 for(let i=0;i<120;i++)step(unseen,{x:0,z:0},1/60);
 assert.equal(unseen.suspicion,0); assert.ok(unseen.robots.every(r=>r.mode!=='chase'));
 const seen=playing(0); at(seen,{x:-7.5,z:1.5}); const g=seen.robots.find(r=>r.kind==='guard')!;
 g.x=-9; g.z=.5; g.angle=0;
 for(let i=0;i<90;i++)step(seen,{x:0,z:0},1/60);
 assert.ok(seen.suspicion>0||g.mode==='chase'||seen.mode==='caught','visible unmet obligation has a consequence');
});

test('seeing a compliant player does not reveal a doorway bag hidden behind cover',()=>{
 const s=playing(1); s.badge=true; const bag=s.items.find(i=>i.id==='bag')!;
 bag.x=3;bag.z=-3;at(s,{x:1.5,z:5});
 const g=s.robots.find(r=>r.kind==='guard')!;g.x=3;g.z=5;g.angle=-Math.PI/2;
 assert.equal(visibleTo(s,g,s.player),true);assert.equal(lineClear(s,g,bag),false);
 for(let i=0;i<15;i++)step(s,{x:0,z:0},1/60);
 assert.equal(s.suspicion,0,'observation must attach to the object violating the rule');
});

test('key function identifies the side-door key; the display-case key does not unlock it',()=>{
 const s=playing(3); s.badge=true; take(s,'key-case'); at(s,{x:3,z:-2});
 assert.equal(interact(s,'side-door'),false); assert.equal(s.doorOpen,false);
 at(s,{x:-7,z:-6}); drop(s); take(s,'key-side'); at(s,{x:3,z:-2});
 assert.equal(interact(s,'side-door'),true); assert.equal(s.doorOpen,true);
});

test('bell delivery depends on polishing history, with both spatial variants',()=>{
 for(const seed of [1,2]) {
  const s=playing(3,seed); s.badge=true;
  const wrong=s.items.find(i=>i.kind==='bell'&&!i.correct)!;
  assert.match(wrong.detail,/moved/); take(s,wrong.id); at(s,SPAWN);
  assert.equal(canComplete(s),false); drop(s);
  const right=s.items.find(i=>i.kind==='bell'&&i.correct)!;
  assert.match(right.detail,/polished/); take(s,right.id); at(s,SPAWN);
  assert.equal(canComplete(s),true);
 }
 assert.notEqual(createGame(3,1).items.find(i=>i.correct)?.id,createGame(3,2).items.find(i=>i.correct)?.id);
});

test('lawful carrier does not make the wrong transfer box the correct object',()=>{
 const s=playing(4); s.badge=true; s.bag=false; take(s,'box-b');
 const h=s.robots.find(r=>r.kind==='watering')!; h.x=s.player.x; h.z=s.player.z+.5;
 interact(s,h.id); s.helperTransported=true; at(s,SPAWN); h.x=SPAWN.x; h.z=SPAWN.z;
 assert.equal(canComplete(s),false);
});

test('transfer target identity varies and its history remains the deciding fact',()=>{
 const a=createGame(4,1),b=createGame(4,2);
 assert.notEqual(a.items.find(i=>i.correct)?.id,b.items.find(i=>i.correct)?.id);
 for(const s of [a,b]){
  assert.equal(s.items.filter(i=>i.kind==='box'&&i.correct).length,1);
  assert.match(s.items.find(i=>i.correct)!.detail,/helper placed this box beside the fountain/);
 }
});

test('transporting another cargo cannot authorize the target box delivery',()=>{
 const s=playing(4);s.badge=true;s.bag=false;
 const correct=s.items.find(i=>i.kind==='box'&&i.correct)!,wrong=s.items.find(i=>i.kind==='box'&&!i.correct)!;
 take(s,correct.id);at(s,SPAWN);s.helperTransported=true;s.transportedCargo=wrong.id;
 assert.equal(canComplete(s),false);
 s.transportedCargo=correct.id;assert.equal(canComplete(s),true);
});

test('visitor box-carrying violates the exclusive arch role despite badge or escort',()=>{
 const s=playing(4); s.badge=true; s.bag=false; take(s,'box-a'); at(s,{x:3,z:-3});
 const h=s.robots.find(r=>r.kind==='watering')!; h.x=3; h.z=-4; s.escort=h.id;
 assert.equal(hasEscort(s),true); assert.ok(getViolations(s).includes('helpers-only'));
});

test('large bag must stay outside the arch; dropping it outside repairs entry eligibility',()=>{
 const s=playing(4); s.badge=true; at(s,{x:3,z:-5});
 assert.ok(getViolations(s).includes('large-bag'));
 at(s,{x:-9,z:6}); drop(s); at(s,{x:3,z:-5});
 assert.ok(!getViolations(s).includes('large-bag'));
});

test('both optional trolley choices allow a helper to hold the chosen box',()=>{
 for(const trolley of [false,true]) {
  const s=playing(4); s.badge=true; s.bag=false; if(trolley)take(s,'trolley');
  take(s,'box-a'); const h=s.robots.find(r=>r.kind==='watering')!;
  h.x=s.player.x; h.z=s.player.z+.5; assert.equal(interact(s,h.id),true);
  assert.equal(s.cargo,null); assert.equal(h.cargo,'box-a');
  assert.equal(s.items.find(i=>i.id==='box-a')!.holder,'helper');
 }
});

test('an empty helper crossing cannot satisfy transfer transport',()=>{
 const s=playing(4); s.badge=true; s.bag=false; guardAway(s);
 const h=s.robots.find(r=>r.kind==='watering')!; h.x=3; h.z=-3.1; h.mode='follow'; s.escort=h.id;
 at(s,{x:3,z:-1}); for(let i=0;i<60;i++)step(s,{x:0,z:0},1/60);
 assert.equal(s.helperTransported,false);
});

test('reading and pause stop simulation pressure',()=>{
 for(const mode of ['reading','paused','intro','caught','win'] as const) {
  const s=playing(2); s.mode=mode; const before=JSON.stringify(s);
  step(s,{x:1,z:0,sprint:true},1/60); assert.equal(JSON.stringify(s),before,mode);
 }
});

test('distraction gives a finite recoverable window and cooldown',()=>{
 const s=playing(0); const g=s.robots.find(r=>r.kind==='guard')!; g.x=-4;g.z=6;
 squeak(s); assert.equal(g.mode,'distracted'); assert.ok(s.squeakCooldown>0);
 const count=s.events.length; squeak(s); assert.equal(s.events.length,count,'cooldown rejects repeat squeaks');
 for(let i=0;i<480;i++)step(s,{x:0,z:0},1/60);
 assert.notEqual(g.mode,'distracted'); assert.equal(s.squeakCooldown,0);
});

test('catch recovery preserves retry evidence and returns player to a usable state',()=>{
 const s=playing(0); take(s,'badge'); take(s,'token'); s.mode='caught'; s.catches=1;
 recover(s); assert.equal(s.mode,'play'); assert.equal(s.retries,1); assert.equal(s.cargo,null);
 assert.equal(s.player.x,SPAWN.x); assert.equal(s.player.z,SPAWN.z);
 assert.ok(s.items.some(i=>i.id==='token'&&i.holder==='ground'));
 assert.equal(languageEvidence(s),false);
});

test('ordinary English rule reading is unaided; support or retry removes first-unaided evidence',()=>{
 const s=playing(0); take(s,'badge'); inspect(s,'notice');
 assert.equal(s.supportUsed,false); assert.equal(languageEvidence(s),true);
 s.supportUsed=true; assert.equal(languageEvidence(s),false); s.supportUsed=false;
 s.retries=1; assert.equal(languageEvidence(s),false);
});

test('wrong delivery is a mistaken decision, without falsely recording requested assistance',()=>{
 const s=playing(3);s.badge=true;guardAway(s);
 take(s,s.items.find(i=>i.kind==='bell'&&!i.correct)!.id);at(s,SPAWN);
 step(s,{x:0,z:0},1/60);
 assert.equal(s.mode,'play');assert.equal(s.supportUsed,false);assert.equal(s.mistakes,1);
 assert.ok(s.events.some(e=>e.action==='wrong-delivery'&&e.success===false));
});

test('unseen badge violation cannot earn lawful language evidence merely by reading the notice',()=>{
 const s=playing(0); inspect(s,'notice'); guardAway(s); at(s,{x:-9,z:2});
 for(let i=0;i<60;i++)step(s,{x:0,z:0},1/60); at(s,SPAWN);
 assert.equal(languageEvidence(s),false,'stealth completion and rule comprehension evidence must stay separate');
});

test('unescorted store visit cannot become language evidence after walking back outside',()=>{
 const s=playing(2); take(s,'badge'); inspect(s,'notice');
 const h=s.robots.find(r=>r.kind==='watering')!; at(s,h); inspect(s,h.id);
 guardAway(s); at(s,{x:3,z:-7}); for(let i=0;i<60;i++)step(s,{x:0,z:0},1/60); at(s,SPAWN);
 assert.equal(languageEvidence(s),false,'observing the right robot alone is not using its escort condition');
});
