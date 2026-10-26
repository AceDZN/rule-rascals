import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, blocked, move, step, interact, activeObstacles, SPAWN, type Point } from '../src/simulation';
import { findPath, clearSegment, walkableTarget } from '../src/navigation';
import {
  ENTRY_DESK, NOTICE, ARCH_POSTS, STORE_SHELF, FOUNTAIN, FLOWER_POTS,
  BOUNDARY_TREES, PLANTERS, STORE_WALLS, PLAYER_RADIUS, WALK_BOUNDS,
  BELL_PEDESTAL_RADIUS, type Obstacle,
} from '../src/world-layout';

const EPS=1e-6;
function isolated(o:Obstacle) { const s=createGame(0,2);s.obstacles=[o];return s; }
function sampleRoute(s:ReturnType<typeof createGame>,start:Point,path:Point[],radius=PLAYER_RADIUS) {
  let from=start;
  for(const end of path) {
    const steps=Math.max(1,Math.ceil(Math.hypot(end.x-from.x,end.z-from.z)/.035));
    for(let i=0;i<=steps;i++) {
      const point={x:from.x+(end.x-from.x)*i/steps,z:from.z+(end.z-from.z)*i/steps};
      assert.equal(blocked(s,point,radius),false,`route overlaps solid at ${JSON.stringify(point)}`);
    }
    from=end;
  }
}

test('shared layout includes desk, notice, arch posts, shelf, pots and tree bases as actual solids',()=>{
  const s=createGame(0,2);
  const expected:[string,Point][]=[['desk',ENTRY_DESK],['post',NOTICE],['shelf',STORE_SHELF],
    ...ARCH_POSTS.map(p=>['post',p] as [string,Point]),...FLOWER_POTS.map(p=>['pot',p] as [string,Point]),
    ...BOUNDARY_TREES.map(p=>['tree-base',p] as [string,Point])];
  for(const [kind,p] of expected)assert.ok(s.obstacles.some(o=>o.kind===kind&&o.x===p.x&&o.z===p.z),`${kind} footprint absent at ${p.x},${p.z}`);
});

test('direct movement cannot pass through any of the four desk faces',()=>{
  const s=isolated({...ENTRY_DESK,kind:'desk'}),r=PLAYER_RADIUS;
  const left=ENTRY_DESK.x-ENTRY_DESK.w/2-r,right=ENTRY_DESK.x+ENTRY_DESK.w/2+r;
  const north=ENTRY_DESK.z-ENTRY_DESK.d/2-r,south=ENTRY_DESK.z+ENTRY_DESK.d/2+r;
  const cases=[{p:{x:left-.1,z:ENTRY_DESK.z},dx:5,dz:0,axis:'x',limit:left,side:-1},
    {p:{x:right+.1,z:ENTRY_DESK.z},dx:-5,dz:0,axis:'x',limit:right,side:1},
    {p:{x:ENTRY_DESK.x,z:north-.1},dx:0,dz:5,axis:'z',limit:north,side:-1},
    {p:{x:ENTRY_DESK.x,z:south+.1},dx:0,dz:-5,axis:'z',limit:south,side:1}] as const;
  for(const c of cases){const p={...c.p};assert.equal(blocked(s,p),false);move(s,p,c.dx,c.dz);assert.equal(blocked(s,p),false);assert.ok((p[c.axis]-c.limit)*c.side>=-EPS,`crossed desk ${c.axis} face`);}
});

test('a long displacement cannot tunnel through a thin conservatory wall',()=>{
  const wall=STORE_WALLS.find(o=>o.x===7.5)!,s=isolated({...wall}),p={x:7.5,z:-1};
  move(s,p,0,-20);
  assert.ok(p.z>=wall.z+wall.d/2+PLAYER_RADIUS-EPS);
  assert.ok(p.z< -2,'movement reached the wall instead of rejecting the whole request');
});

test('diagonal sprint contact stays outside planter geometry at every burst',()=>{
  const planter=PLANTERS.find(o=>o.x===4)!,s=isolated({...planter});
  const p={x:planter.x-planter.w/2-PLAYER_RADIUS-.12,z:planter.z-planter.d/2-PLAYER_RADIUS-.12};
  for(let i=0;i<60;i++){move(s,p,.125,.125);assert.equal(blocked(s,p),false);}
  assert.ok(p.x<planter.x&&p.z<planter.z,'diagonal input did not emerge through the far side');
});

test('wall contact preserves free tangent movement for sliding',()=>{
  const wall=STORE_WALLS.find(o=>o.x===7.5)!,s=isolated({...wall});
  const p={x:6,z:wall.z+wall.d/2+PLAYER_RADIUS+.005};
  move(s,p,1,-1);
  assert.ok(p.x>6.9,'tangent motion should continue');
  assert.ok(p.z>=wall.z+wall.d/2+PLAYER_RADIUS-EPS);
  assert.equal(blocked(s,p),false);
});

test('actor discs can clear a rounded box corner without using square radius padding',()=>{
  const planter=PLANTERS.find(o=>o.x===4)!,s=isolated({...planter});
  const corner={x:planter.x+planter.w/2,z:planter.z+planter.d/2};
  assert.equal(blocked(s,{x:corner.x+.31,z:corner.z+.31}),false);
  assert.equal(blocked(s,{x:corner.x+.25,z:corner.z+.25}),true);
});

test('platform bounds stop the whole actor disc on all four sides',()=>{
  const s=createGame();s.obstacles=[];
  for(const [dx,dz,axis,limit,side] of [[50,0,'x',WALK_BOUNDS.maxX-PLAYER_RADIUS,1],[-50,0,'x',WALK_BOUNDS.minX+PLAYER_RADIUS,-1],[0,50,'z',WALK_BOUNDS.maxZ-PLAYER_RADIUS,1],[0,-50,'z',WALK_BOUNDS.minZ+PLAYER_RADIUS,-1]] as const){
    const p={x:0,z:0};move(s,p,dx,dz);
    assert.ok((p[axis]-limit)*side<=EPS);assert.ok(Math.abs(p[axis]-limit)<.081);assert.equal(blocked(s,p),false);
  }
});

test('unlocking permits the arch centre while both post fronts remain solid',()=>{
  const s=createGame(3,2),p={x:3,z:-1};move(s,p,0,-8);
  assert.ok(p.z> -3,'locked side door stops entry');
  s.doorOpen=true;Object.assign(p,{x:3,z:-1});move(s,p,0,-5);
  assert.ok(p.z< -4,'open centre permits entry');
  assert.ok(!activeObstacles(s).some(o=>o.kind==='door'));
  for(const post of ARCH_POSTS)assert.equal(blocked(s,{x:post.x,z:post.z+post.d/2+PLAYER_RADIUS-.04}),true,'rendered post protrudes beyond wall face');
});

test('the fountain blocks its full outer lip while leaving diagonal circle clearance',()=>{
  const s=createGame(0,2);
  assert.equal(blocked(s,{x:FOUNTAIN.x+FOUNTAIN.radius+PLAYER_RADIUS-.04,z:FOUNTAIN.z}),true);
  assert.equal(blocked(s,{x:FOUNTAIN.x+1,z:FOUNTAIN.z+1}),false);
});

test('pots and tree bases block their actual circular footprint inside the walk boundary',()=>{
  const s=createGame(0,2);
  for(const pot of FLOWER_POTS)assert.equal(blocked(s,pot),true);
  for(const tree of BOUNDARY_TREES){
    const base=s.obstacles.find(o=>o.kind==='tree-base'&&o.x===tree.x&&o.z===tree.z)!;
    const only=isolated(base),innerX=tree.x+Math.sign(-tree.x)*(base.w/2+PLAYER_RADIUS-.03);
    assert.equal(blocked(only,{x:innerX,z:tree.z}),true);
  }
});

test('the shelf front and each bell pedestal block standing actors',()=>{
  const s=createGame(3,2);
  assert.equal(blocked(s,{x:STORE_SHELF.x,z:STORE_SHELF.z+STORE_SHELF.d/2+PLAYER_RADIUS-.03}),true);
  for(const bell of s.items.filter(i=>i.kind==='bell')){
    assert.equal(blocked(s,bell),true);
    const pedestal=s.obstacles.find(o=>o.kind==='pedestal'&&o.x===bell.x&&o.z===bell.z)!;
    assert.equal(pedestal.w/2,BELL_PEDESTAL_RADIUS);
  }
});

test('clicking the desk approaches free floor and preserves badge interaction reach',()=>{
  const s=createGame(0,2);s.mode='play';const badge=s.items.find(i=>i.id==='badge')!;
  assert.equal(blocked(s,badge),true);
  const target=walkableTarget(s,SPAWN,badge);assert.ok(target);assert.equal(blocked(s,target),false);
  const path=findPath(s,SPAWN,badge);assert.ok(path.length);sampleRoute(s,SPAWN,path);
  Object.assign(s.player,path.at(-1)!);assert.equal(interact(s,'badge'),true);assert.equal(s.badge,true);
});

test('click navigation around the new solids yields segments the physical actor can traverse',()=>{
  const s=createGame(0,2),goal={x:7,z:0};
  assert.equal(clearSegment(s,SPAWN,goal),false,'direct route crosses authored scenery');
  const path=findPath(s,SPAWN,goal);assert.ok(path.length);sampleRoute(s,SPAWN,path);
  assert.ok(Math.hypot(path.at(-1)!.x-goal.x,path.at(-1)!.z-goal.z)<.05);
});

test('an opened side door leaves a reachable free-floor approach to each bell pedestal',()=>{
  const s=createGame(3,2);s.mode='play';s.badge=true;s.doorOpen=true;const start={x:3,z:-1.4};
  for(const bell of s.items.filter(i=>i.kind==='bell')){
    const path=findPath(s,start,bell);assert.ok(path.length);sampleRoute(s,start,path);
    Object.assign(s.player,path.at(-1)!);s.cargo=null;
    assert.equal(interact(s,bell.id),true,`bell ${bell.id} is reachable without entering its pedestal`);
  }
});

test('sustained input into the desk reports zero actual speed after contact',()=>{
  const s=createGame(1,2);s.mode='play';s.badge=true;
  Object.assign(s.player,{x:ENTRY_DESK.x,z:ENTRY_DESK.z+ENTRY_DESK.d/2+PLAYER_RADIUS+.005});
  for(let i=0;i<90;i++)step(s,{x:0,z:-1,sprint:true},1/60);
  assert.equal(s.mode,'play');assert.equal(s.player.speed,0);
  assert.ok(s.player.z>=ENTRY_DESK.z+ENTRY_DESK.d/2+PLAYER_RADIUS-EPS);
});
