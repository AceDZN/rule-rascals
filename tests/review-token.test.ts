import test from 'node:test';
import assert from 'node:assert/strict';
import { HEISTS } from '../src/content';
import {
  createGame, interact, inspect, drop, squeak, step, getViolations,
  visibleTo, lineClear, canComplete, languageEvidence, SPAWN,
  type State, type Point,
} from '../src/simulation';

const TOKEN_RULE = "Visitors mustn't carry the token while a guard is watching them.";

function at(s:State,p:Point) { s.player.x=p.x; s.player.z=p.z; }
function take(s:State,id:string) {
  const item=s.items.find(i=>i.id===id);
  assert.ok(item,`fixture item ${id}`);
  at(s,item);
  assert.equal(interact(s,id),true);
}
function visitor(level=0,carryToken=true) {
  const s=createGame(level,2);s.mode='play';
  take(s,'badge');inspect(s,'notice');
  if(carryToken)take(s,'token');
  return s;
}
function watched(s:State) {
  at(s,{x:-9,z:2});
  const guard=s.robots.find(r=>r.id==='guard')!;
  Object.assign(guard,{x:-9,z:.9,angle:0,mode:'patrol',timer:0});
  assert.equal(visibleTo(s,guard),true);
  return guard;
}
function guardAway(s:State) {
  Object.assign(s.robots.find(r=>r.id==='guard')!,{x:11,z:9,angle:0,mode:'patrol'});
}

// Positions establish semantic unit fixtures; these are not browser win-path tests.
test('H1 notice states the exact conditional token prohibition in English and Hebrew',()=>{
  const index=HEISTS[0].rules.indexOf(TOKEN_RULE);
  assert.ok(index>=0);
  assert.equal(HEISTS[0].translation[index],'אסור למבקרים לשאת את האסימון כשהשומר צופה בהם.');
  assert.ok(HEISTS[0].rules.includes('Visitors must wear a badge.'));
});

test('a badge does not exempt a stationary token carrier in an attentive guard view',()=>{
  const s=visitor();watched(s);s.player.speed=0;
  assert.equal(s.badge,true);
  assert.deepEqual(getViolations(s),['watched-token']);
});

test('squeak permits token carrying while the observing guard is actually distracted',()=>{
  const s=visitor();const guard=watched(s);
  assert.ok(getViolations(s).includes('watched-token'));
  squeak(s);
  assert.equal(guard.mode,'distracted');
  assert.equal(guard.timer,5);
  assert.deepEqual(getViolations(s),[]);
});

test('expiry restores the token restriction if the guard is still looking at the carrier',()=>{
  const s=visitor();const guard=watched(s);
  // This guard has a short distraction remaining and no moving noise target.
  guard.mode='distracted';guard.timer=.05;s.noise=null;
  assert.deepEqual(getViolations(s),[]);
  step(s,{x:0,z:0},.05);
  assert.notEqual(guard.mode,'distracted');
  assert.equal(visibleTo(s,guard),true);
  assert.ok(getViolations(s).includes('watched-token'));
});

test('solid cover permits a token carrier even with an attentive guard facing them',()=>{
  const s=visitor();const guard=watched(s);
  at(s,{x:-4.8,z:3.2});Object.assign(guard,{x:-4.8,z:.8,angle:0});
  assert.equal(lineClear(s,guard,s.player),false);
  assert.equal(visibleTo(s,guard),false);
  assert.deepEqual(getViolations(s),[]);
});

test('a nearby ground token and a worn badge do not count as carrying the token',()=>{
  const s=visitor(0,false);watched(s);
  assert.equal(s.cargo,null);assert.deepEqual(getViolations(s),[]);
  take(s,'token');watched(s);drop(s);
  assert.equal(s.items.find(i=>i.id==='token')!.holder,'ground');
  assert.deepEqual(getViolations(s),[]);
});

test('unwatched transport remains lawful without ever using the toy',()=>{
  const s=visitor();at(s,{x:-9,z:2});guardAway(s);
  step(s,{x:0,z:0},1/60);
  assert.equal(s.everViolated,false);
  assert.equal(s.events.some(e=>e.action==='squeak'),false);
  at(s,SPAWN);
  assert.equal(canComplete(s),true);
  assert.equal(languageEvidence(s),true);
});

test('escaping after an observed token breach keeps action eligibility separate from language evidence',()=>{
  const s=visitor();const guard=watched(s);
  Object.assign(guard,{x:-9,z:-2,angle:0,mode:'suspicious'});
  for(let i=0;i<16;i++)step(s,{x:0,z:0},.05);
  assert.equal(s.mode,'play');
  assert.ok(s.events.some(e=>e.action==='violation'&&e.target==='watched-token'));
  assert.equal(s.everViolated,true);
  guardAway(s);at(s,SPAWN);
  assert.equal(canComplete(s),true);
  assert.equal(languageEvidence(s),false);
});

test('the H1 token restriction does not leak into either optional-map branch in H2',()=>{
  assert.ok(!HEISTS[1].rules.includes(TOKEN_RULE));
  for(const useMap of [false,true]) {
    const s=visitor(1,false);if(useMap)take(s,'map');take(s,'token');watched(s);
    assert.equal(s.map,useMap);
    assert.deepEqual(getViolations(s),[]);
    at(s,SPAWN);assert.equal(canComplete(s),true);
  }
});

test('reading and pause freeze token pressure and the remaining distraction window',()=>{
  for(const mode of ['reading','paused'] as const) {
    const s=visitor();watched(s);squeak(s);s.mode=mode;
    const before=JSON.stringify(s);
    for(let i=0;i<360;i++)step(s,{x:1,z:0,sprint:true},1/60);
    assert.equal(JSON.stringify(s),before);
  }
});
