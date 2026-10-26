// Direct-input physical regression. Pointer input only positions the actor;
// held keyboard input tests contact. No player/world state is injected.
// RULE_RASCALS_BROWSER_LIB can select an installed Playwright browser runtime.
const fs=require('node:fs/promises');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.RULE_RASCALS_BROWSER_LIB||'playwright');

(async()=>{
 const out='work/physical-evidence';await fs.mkdir(out,{recursive:true});
 const browser=await chromium.launch({headless:true,timeout:180000,args:['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist']});
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],observations=[];
 page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(90000);
 const state=()=>page.evaluate(()=>JSON.parse(window.render_game_to_text()));
 const advance=ms=>page.evaluate(ms=>window.advanceTime(ms),ms);
 let layout;
 function check(s,label){
  assert.equal(s.mode,'play',`${label}: gameplay interrupted`);
  const {x,z}=s.player,r=layout.radius,b=layout.bounds;
  assert.ok(x-r>=b.minX-1e-5&&x+r<=b.maxX+1e-5&&z-r>=b.minZ-1e-5&&z+r<=b.maxZ+1e-5,`${label}: actor outside platform`);
  for(const o of [...s.obstacles,...(s.solidProps||[])]){
   if(o.kind==='door'&&s.doorOpen)continue;
   const separation=o.shape==='circle'?Math.hypot(x-o.x,z-o.z)-o.w/2:Math.hypot(Math.max(0,Math.abs(x-o.x)-o.w/2),Math.max(0,Math.abs(z-o.z)-o.d/2));
   assert.ok(separation>=r-1e-5,`${label}: penetrated ${o.kind} at ${o.x},${o.z}`);
  }
 }
 async function snap(name){await page.screenshot({path:`${out}/${name}.png`,timeout:90000});}
 async function go(x,z,near=.25,allowWin=false){
  for(let i=0;i<120;i++){
   const s=await state();if(allowWin&&s.mode==='win')return;check(s,'pointer positioning');
   if(Math.hypot(s.player.x-x,s.player.z-z)<near)return;
   const q=await page.evaluate(([x,z])=>window.projectWorld(x,z),[x,z]);
   await page.mouse.click(Math.max(90,Math.min(1350,q.x)),Math.max(190,Math.min(760,q.y)));
   await advance(300);
  }
  throw Error(`positioning stuck toward ${x},${z}: ${JSON.stringify((await state()).player)}`);
 }
 async function held(keys,ms,name){
  const before=await state();for(const key of keys)await page.keyboard.down(key);
  try{
   for(let i=0;i<Math.ceil(ms/50);i++){await advance(50);check(await state(),name);}
   const after=await state();await snap(name);
   observations.push({name,keys,ms,before:before.player,after:after.player,clip:after.assets.activeClip});
  }finally{for(const key of keys)await page.keyboard.up(key);await advance(0);}
  assert.equal((await state()).player.speed,0,`${name}: release should stop locomotion`);
 }
 try{
  await page.addInitScript(()=>window.requestAnimationFrame=()=>0);
  const url=new URL(process.env.RULE_RASCALS_URL||'http://localhost:5203');url.searchParams.set('deterministic','1');
  await page.goto(url.href,{waitUntil:'domcontentloaded',timeout:180000});
  await page.waitForFunction(()=>{
   if(typeof window.render_game_to_text!=='function')return false;
   const a=JSON.parse(window.render_game_to_text()).assets;
   return a.loaded&&Object.values(a.mechanical).every(m=>m.loaded);
  },null,{polling:100,timeout:90000});
  layout=await page.evaluate(async()=>{const m=await import('/src/world-layout.ts');return {radius:m.PLAYER_RADIUS,bounds:m.WALK_BOUNDS};});
  await advance(0);await page.locator('#start-btn').click({force:true});await advance(0);
  await page.locator('#resume-btn').click({force:true});await advance(0);
  await page.keyboard.press('KeyE');await advance(0);assert.equal((await state()).badge,true);
  await held(['KeyW'],800,'01-desk-front');
  await go(-7,6.2);await held(['KeyA'],300,'02-desk-right');
  await go(-9,4.5);await held(['ShiftLeft','KeyS'],400,'03-desk-back');
  await go(-5,5);await held(['ShiftLeft','KeyW'],500,'04-planter');
  await go(7,-1.5);await held(['ShiftLeft','KeyW'],400,'05-wall');
  await go(3,-1.5);await snap('06-conservatory-label-outside');
  await go(3,-5);await snap('07-conservatory-label-inside');
  await go(7,0);await page.keyboard.press('Space');await advance(0);
  await page.keyboard.press('KeyE');await advance(0);assert.equal((await state()).cargo,'token');
  await go(-2,0);await go(-5,5);await go(-8.8,7.8,.25,true);
  assert.equal((await state()).mode,'win');assert.equal((await state()).results[0].lawful,true);await snap('08-h1-success');
  await page.locator('#next-btn').click({force:true});await advance(0);
  await page.locator('#start-btn').click({force:true});await advance(0);
  await page.locator('#resume-btn').click({force:true});await advance(0);
  await page.keyboard.press('KeyE');await advance(0);
  await go(-5.4,7.58);await held(['KeyW'],300,'09-ground-bag-contact');
  assert.equal((await state()).items.find(i=>i.id==='bag').holder,'ground');
  await page.keyboard.press('KeyE');await advance(0);assert.equal((await state()).cargo,'bag');
  await go(-6,6.5,.15);assert.equal((await state()).solidProps.length,0);
  await page.keyboard.press('KeyG');await advance(0);
  const dropped=await state();assert.equal(dropped.cargo,null);assert.equal(dropped.solidProps.length,1);check(dropped,'bag drop');await snap('10-free-floor-drop');
  await page.keyboard.press('KeyE');await advance(0);assert.equal((await state()).cargo,'bag');
  await page.keyboard.down('KeyD');
  for(let i=1;i<=3;i++){
   await advance(160);const s=await state();check(s,'carry stride');assert.equal(s.assets.activeClip,'carry-walk');
   observations.push({name:`11-carry-stride-${i}`,player:s.player,clip:s.assets.activeClip,rate:s.assets.playbackRate});await snap(`11-carry-stride-${i}`);
  }
  await page.keyboard.up('KeyD');await advance(200);
  const stopped=await state();assert.equal(stopped.player.speed,0);assert.equal(stopped.assets.activeClip,'carry-idle');await snap('12-carry-idle');
  assert.deepEqual(errors,[]);console.log(JSON.stringify({pass:true,observations,errors}));
 }finally{
  await fs.writeFile(`${out}/results.json`,JSON.stringify({observations,final:await state().catch(()=>null),errors},null,2));
  await browser.close();
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
