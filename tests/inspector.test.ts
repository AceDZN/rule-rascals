import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,step,visibleTo,squeak,recover,blocked,dist,SPAWN,interact} from '../src/simulation';
test('the fixed inspector reports an observed large bag even when the roaming guard cannot see it',()=>{
 const s=createGame(4,1);s.mode='play';s.badge=true;s.player.x=3;s.player.z=-4;
 const guard=s.robots.find(r=>r.id==='guard')!,inspector=s.robots.find(r=>r.id==='arch-inspector')!;
 guard.x=-9;guard.z=8;guard.mode='distracted';guard.timer=5;
 assert.equal(visibleTo(s,guard),false);assert.equal(visibleTo(s,inspector),true);
 for(let i=0;i<60;i++)step(s,{x:0,z:0},1/60);
 assert.ok(s.suspicion>0||guard.mode==='chase','the observing inspector radios the patrol');
 assert.ok(s.everViolated);
});

test('the fixed inspector distraction expires instead of lasting forever',()=>{
 const s=createGame(4,1);s.mode='play';s.badge=true;s.bag=false;s.player.x=3;s.player.z=-2;
 const inspector=s.robots.find(r=>r.id==='arch-inspector')!;squeak(s);assert.equal(inspector.mode,'distracted');
 for(let i=0;i<360;i++)step(s,{x:0,z:0},1/60);
 assert.equal(inspector.mode,'patrol');
});
test('bag capture recovery leaves one solid reachable bag beside a free entrance',()=>{
 const s=createGame(4,1);s.mode='caught';recover(s);
 assert.equal(s.bag,false);const bags=s.items.filter(i=>i.kind==='bag');assert.equal(bags.length,1);assert.equal(bags[0].holder,'ground');
 assert.deepEqual({x:s.player.x,z:s.player.z},SPAWN);
 assert.equal(blocked(s,s.player),false,'retry must not spawn the raccoon inside the bag');
 assert.ok(dist(bags[0],s.player)<2.1,'bag remains reachable from the entrance');
 assert.equal(blocked(s,bags[0]),true,'the released bag has a physical footprint');
 assert.equal(interact(s,bags[0].id),true);assert.equal(s.bag,true);
 assert.equal(s.items.filter(i=>i.kind==='bag').length,1);
});
