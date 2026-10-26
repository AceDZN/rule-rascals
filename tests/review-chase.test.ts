import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,step,visibleTo,blocked,type Point} from '../src/simulation';

function pursuing(player:Point){
 const s=createGame(0,2);s.mode='play';s.badge=true;Object.assign(s.player,player);
 const guard=s.robots.find(r=>r.id==='guard')!;
 Object.assign(guard,{x:4,z:0,angle:0,mode:'chase',timer:3,lastKnown:{x:4,z:.7}});
 assert.equal(blocked(s,s.player),false);return {s,guard};
}

test('moving behind cover cannot change an occluded chase trajectory or its remembered target',()=>{
 const a=pursuing({x:4,z:4.1}),b=pursuing({x:5.3,z:4.3});
 for(let i=0;i<10;i++){
  assert.equal(visibleTo(a.s,a.guard),false);assert.equal(visibleTo(b.s,b.guard),false);
  step(a.s,{x:0,z:0},.05);step(b.s,{x:0,z:0},.05);
  assert.deepEqual({x:a.guard.x,z:a.guard.z,angle:a.guard.angle,timer:a.guard.timer},
   {x:b.guard.x,z:b.guard.z,angle:b.guard.angle,timer:b.guard.timer},'hidden live coordinates must not steer pursuit');
  assert.deepEqual(a.guard.lastKnown,{x:4,z:.7});assert.deepEqual(b.guard.lastKnown,{x:4,z:.7});
 }
});

test('reacquiring sight updates a copied last-known position and redirects pursuit',()=>{
 const {s,guard}=pursuing({x:7,z:3});
 Object.assign(guard,{x:7,z:0,angle:0,lastKnown:{x:7,z:-2}});
 assert.equal(visibleTo(s,guard),true);step(s,{x:0,z:0},.05);
 assert.deepEqual(guard.lastKnown,{x:7,z:3});assert.ok(guard.z>0,'guard follows the newly seen position');
 s.player.z=3.5;assert.deepEqual(guard.lastKnown,{x:7,z:3},'memory is a snapshot, not a live player reference');
 assert.equal(visibleTo(s,guard),true);step(s,{x:0,z:0},.05);
 assert.deepEqual(guard.lastKnown,{x:7,z:3.5});assert.equal(s.mode,'play');
});
