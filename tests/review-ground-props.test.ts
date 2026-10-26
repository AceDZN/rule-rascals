import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,activeObstacles,blocked,move,interact,drop,dist,getViolations,inStore,visibleTo,step,type State,type Item} from '../src/simulation';
import {walkableTarget,findPath} from '../src/navigation';
import {groundPropObstacle,overlapsObstacle,PLAYER_RADIUS,ENTRY_DESK} from '../src/world-layout';

function propFixture(kind:'bag'|'box'|'trolley'){
 const s=createGame(kind==='bag'?1:4,2);s.mode='play';s.badge=true;s.bag=false;
 const item=s.items.find(i=>i.kind===kind)!;
 s.items=[item];s.obstacles=[];s.robots=[];Object.assign(item,{x:0,z:0,holder:'ground'});
 Object.assign(s.player,{x:-1.5,z:0});return {s,item};
}
function heldFixture(){
 const {s,item}=propFixture('bag');assert.equal(interact(s,item.id),true);return {s,item};
}
function assertFreeDrop(s:State,item:Item){
 const footprint=groundPropObstacle(item);assert.ok(footprint);
 assert.equal(overlapsObstacle(footprint,s.player,PLAYER_RADIUS),false,'prop is outside the carrier');
 for(const r of s.robots)assert.equal(overlapsObstacle(footprint,r,.52),false,'prop is outside other actor bodies');
 const withoutItem={...s,items:s.items.filter(i=>i.id!==item.id)};
 // Sample the whole visible footprint against scenery and the platform boundary.
 for(let x=-footprint.w/2;x<=footprint.w/2+.001;x+=footprint.w/8)
  for(let z=-footprint.d/2;z<=footprint.d/2+.001;z+=footprint.d/8)
   assert.equal(blocked(withoutItem,{x:item.x+x,z:item.z+z},0),false,'drop intersects scenery or leaves the platform');
 assert.equal(blocked(s,s.player),false);
 assert.equal(blocked(s,item),true);
}

test('ground bags, boxes and trolleys stop direct travel through their visible centres',()=>{
 for(const kind of ['bag','box','trolley'] as const){
  const {s,item}=propFixture(kind);
  assert.equal(blocked(s,item),true);
  for(const axis of ['x','z'] as const){
   const p={x:axis==='x'?-3:0,z:axis==='z'?-3:0};
   move(s,p,axis==='x'?6:0,axis==='z'?6:0);
   assert.ok(p[axis]<0,`${kind} should stop traversal before its centre`);
   assert.equal(blocked(s,p),false);
  }
 }
});

test('bulky props remain reachable from free floor and pickup removes only their footprint',()=>{
 for(const kind of ['bag','box','trolley'] as const){
  const {s,item}=propFixture(kind),target=walkableTarget(s,s.player,item);
  assert.ok(target);assert.equal(blocked(s,target),false);assert.ok(dist(target,item)<2.1);
  Object.assign(s.player,target);assert.equal(interact(s,item.id),true);
  assert.notEqual(item.holder,'ground');assert.equal(blocked(s,item),false);
  assert.equal(activeObstacles(s).length,0);
 }
});

test('small collectible tokens, badges, maps and keys do not create invisible floor walls',()=>{
 const s=createGame(0,2);s.obstacles=[];s.robots=[];
 const fixtures=[...createGame(0).items,...createGame(1).items,...createGame(3).items].filter(i=>['badge','map','token','key'].includes(i.kind));
 for(const item of fixtures){Object.assign(item,{x:0,z:0,holder:'ground'});s.items=[item];assert.equal(blocked(s,item),false);}
});

test('dropping carried bulky cargo places it on free floor and permits another pickup',()=>{
 const {s,item}=heldFixture();drop(s);
 assert.equal(s.cargo,null);assert.equal(item.holder,'ground');assertFreeDrop(s,item);
 assert.ok(dist(s.player,item)<2.1);assert.equal(interact(s,item.id),true);
 assert.equal(s.cargo,item.id);assert.equal(blocked(s,item),false);
});

test('a drop beside the entry counter does not put cargo inside the desk or the player',()=>{
 const {s,item}=heldFixture();s.obstacles=[{...ENTRY_DESK,kind:'desk'}];
 Object.assign(s.player,{x:ENTRY_DESK.x,z:ENTRY_DESK.z+ENTRY_DESK.d/2+PLAYER_RADIUS+.03,angle:Math.PI});
 assert.equal(blocked(s,s.player),false);drop(s);
 assert.equal(item.holder,'ground');assertFreeDrop(s,item);
});

function enclosed(s:State){
 // A valid actor-sized room with no space for an additional bulky prop.
 s.obstacles=[{x:-2.35,z:0,w:3.3,d:8,h:2,kind:'wall'},{x:2.35,z:0,w:3.3,d:8,h:2,kind:'wall'},
  {x:0,z:-2.35,w:8,d:3.3,h:2,kind:'wall'},{x:0,z:2.35,w:8,d:3.3,h:2,kind:'wall'}];
 Object.assign(s.player,{x:0,z:0,angle:0});assert.equal(blocked(s,s.player),false);
}

test('a failed bulky drop keeps held cargo and does not record a successful drop',()=>{
 const {s,item}=heldFixture();enclosed(s);const events=s.events.length;drop(s);
 assert.equal(s.cargo,item.id);assert.equal(item.holder,'player');
 assert.equal(s.events.length,events);assert.equal(blocked(s,s.player),false);
});

test('repeated failed worn-bag drops neither duplicate it nor turn it into a floor obstruction',()=>{
 const s=createGame(4,2);s.mode='play';s.items=[];s.robots=[];enclosed(s);
 for(let i=0;i<3;i++)drop(s);
 assert.equal(s.bag,true);const bags=s.items.filter(i=>i.kind==='bag');assert.equal(bags.length,1);
 assert.equal(bags[0].holder,'player');assert.equal(groundPropObstacle(bags[0]),null);
});

test('the helper places a box outside both bodies and the player can take it back',()=>{
 const s=createGame(4,2);s.mode='play';s.badge=true;s.bag=false;s.obstacles=[];
 const item=s.items.find(i=>i.kind==='box')!,helper=s.robots.find(r=>r.id==='gardener')!;
 s.items=[item];s.robots=[helper];Object.assign(s.player,{x:-1.5,z:0});
 Object.assign(helper,{x:0,z:0,angle:0,cargo:item.id});item.holder='helper';drop(s);
 assert.equal(helper.cargo,null);assert.equal(item.holder,'ground');assertFreeDrop(s,item);
 assert.ok(dist(s.player,item)<2.1);assert.equal(interact(s,item.id),true);assert.equal(s.cargo,item.id);
});

test('navigation routes around a loose box instead of through its centre',()=>{
 const {s}=propFixture('box'),start={x:-2,z:0},goal={x:2,z:0},path=findPath(s,start,goal);
 assert.ok(path.length);let from=start;
 for(const to of path){const count=Math.ceil(dist(from,to)/.04);for(let i=0;i<=count;i++)assert.equal(blocked(s,{x:from.x+(to.x-from.x)*i/count,z:from.z+(to.z-from.z)*i/count}),false);from=to;}
 assert.ok(dist(path.at(-1)!,goal)<.05);
});

test('a real bag drop in the named doorway still creates the H2 prohibition',()=>{
 const s=createGame(1,2);s.mode='play';s.badge=true;const bag=s.items.find(i=>i.kind==='bag')!;
 bag.holder='player';s.cargo=bag.id;Object.assign(s.player,{x:3,z:-2.6,angle:Math.PI/2});
 drop(s);assert.equal(bag.holder,'ground');assert.ok(getViolations(s).includes('doorway-bag'));
});

test('leaving the H5 bag just outside the arch cannot offset-drop it inside',()=>{
 const s=createGame(4,2);s.mode='play';s.badge=true;
 Object.assign(s.player,{x:3,z:-2.3,angle:Math.PI});assert.equal(inStore(s.player),false);
 drop(s);const bag=s.items.find(i=>i.kind==='bag')!;
 assert.equal(s.bag,false);assert.equal(bag.holder,'ground');assert.equal(inStore(bag),false);
 assertFreeDrop(s,bag);
 Object.assign(s.player,{x:3,z:-4.2});assert.equal(getViolations(s).includes('large-bag'),false);
});

test('a free landing point beyond a thin wall cannot receive a drop through that wall',()=>{
 const {s,item}=heldFixture();Object.assign(s.player,{x:0,z:.65,angle:Math.PI});
 s.obstacles=[{x:0,z:0,w:8,d:.1,h:2,kind:'wall'},
  {x:-2.35,z:0,w:3.3,d:8,h:2,kind:'wall'},{x:2.35,z:0,w:3.3,d:8,h:2,kind:'wall'},
  {x:0,z:3.325,w:8,d:4.05,h:2,kind:'wall'}];
 assert.equal(blocked(s,s.player),false);assert.equal(blocked(s,{x:0,z:-.75}),false,'opposite side has free landing floor');
 drop(s);assert.equal(s.cargo,item.id);assert.equal(item.holder,'player');
});

test('an inside ground bag still violates H5, and guards must see that bag to enforce it',()=>{
 const s=createGame(4,2);s.mode='play';s.badge=true;s.bag=false;
 const bag:Item={id:'bag',kind:'bag',label:'Large bag',detail:'A visitor bag.',x:3,z:-5,holder:'ground'};s.items.push(bag);
 const guard=s.robots.find(r=>r.id==='guard')!,inspector=s.robots.find(r=>r.id==='arch-inspector')!;
 inspector.mode='distracted';inspector.timer=100;
 Object.assign(guard,{x:-9,z:6.8,angle:0,mode:'suspicious'});
 assert.ok(getViolations(s).includes('large-bag'));assert.equal(visibleTo(s,guard),true);assert.equal(visibleTo(s,guard,bag),false);
 step(s,{x:0,z:0},.05);assert.equal(s.suspicion,0,'seeing a compliant player cannot reveal a distant bag');
 Object.assign(guard,{x:3,z:-3.8,angle:Math.PI,mode:'suspicious'});
 assert.equal(visibleTo(s,guard),false);assert.equal(visibleTo(s,guard,bag),true);
 step(s,{x:0,z:0},.05);assert.ok(s.suspicion>0,'the actual observed inside bag is enforceable');
});
