const fs=require('node:fs');
const { chromium }=require(process.env.RULE_RASCALS_BROWSER_LIB||'playwright');
const artifact=name=>`work/${process.env.RULE_RASCALS_QA_PREFIX?process.env.RULE_RASCALS_QA_PREFIX+'-':''}${name}`;const evidenceDir=artifact('browser-evidence');fs.mkdirSync(evidenceDir,{recursive:true});
(async()=>{
 const {findPath,walkableTarget,clearSegment}=await import('../src/navigation.ts');
 const {HEISTS,missionConfig}=await import('../src/content.ts');const {inStore}=await import('../src/simulation.ts');const {STATIONS}=await import('../src/missions.ts');
 const b=await chromium.launch({headless:true,args:['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist']});
 const viewport={width:1672,height:941};
 const resume=process.argv.includes('--resume-campaign');const saved=resume?JSON.parse(fs.readFileSync(artifact('campaign-earned-storage.json'),'utf8')):undefined;
 // Resume only genuine input-earned completion records; carry their origin across dev/preview ports.
 if(saved)for(const origin of saved.origins)origin.origin=new URL(process.env.RULE_RASCALS_URL||'http://localhost:5203').origin;
 const context=await b.newContext({viewport,storageState:saved});const p=await context.newPage();const errors=[],log=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>{window.requestAnimationFrame=()=>0;});
 await p.goto(process.env.RULE_RASCALS_URL||'http://localhost:5203',{waitUntil:'domcontentloaded',timeout:90000});await p.waitForFunction(()=>typeof window.advanceTime==='function',{},{timeout:90000});
 const state=async()=>JSON.parse(await p.evaluate(()=>window.render_game_to_text()));
 const advance=async(ms)=>p.evaluate(ms=>window.advanceTime(ms),ms);
 const click=async(id)=>{await p.click(id,{force:true});await advance(0);};
 const key=async(code)=>{await p.keyboard.press(code);await advance(0);};
 const snap=async(name)=>{await p.screenshot({path:`${evidenceDir}/${name}.png`,timeout:90000});log.push({name,state:await state()});fs.writeFileSync(artifact('qa-progress.json'),JSON.stringify({errors,log},null,2));if((await state()).mode==='win')await context.storageState({path:artifact('campaign-earned-storage.json')});console.log(name,JSON.stringify((await state()).player),(await state()).mode);};
 async function go(x,z){
  for(let n=0;n<80;n++){
   const before=await state();if(before.mode==='win')return;if(before.mode!=='play'){fs.writeFileSync(artifact('qa-failure.json'),JSON.stringify({target:{x,z},state:before,log},null,2));throw Error(`go ended ${before.mode} ${before.message}`);}
   const routeState=before;
   if(before.heist>=6&&missionConfig(before.heist-1).watchedCargo&&before.cargo){
    // Use the same finite toy as a player. Proximity gives a useful reaction margin.
    if(before.robots.some(r=>r.kind==='guard'&&r.mode!=='distracted'&&Math.hypot(r.x-before.player.x,r.z-before.player.z)<9.5)&&Number(await p.locator('#squeak-btn').evaluate(e=>Number(e.style.opacity)))===1){await key('Space');continue;}
   }
   const goal=walkableTarget(routeState,before.player,{x,z},.42);if(!goal)throw Error(`No approach to ${x},${z}`);
   if(Math.hypot(before.player.x-goal.x,before.player.z-goal.z)<.4)return;
   // Read-only route planning chooses visible ground waypoints; all movement remains pointer input.
   const route=[];let from=before.player;for(const end of findPath(routeState,before.player,{x,z})){const count=Math.max(1,Math.ceil(Math.hypot(end.x-from.x,end.z-from.z)/.5));for(let i=1;i<=count;i++)route.push({x:from.x+(end.x-from.x)*i/count,z:from.z+(end.z-from.z)*i/count});from=end;}
   const safeRoute=route.filter(q=>clearSegment(routeState,before.player,q,.42));
   const points=await p.evaluate(route=>route.map(q=>window.projectWorld(q.x,q.z)),safeRoute);
   const point=points.filter(q=>q.x>90&&q.x<viewport.width-90&&q.y>190&&q.y<viewport.height-140).at(-1);
   if(!point){fs.writeFileSync(artifact('qa-failure.json'),JSON.stringify({target:{x,z},route,state:before},null,2));throw Error(`No visible route waypoint toward ${x},${z} from ${JSON.stringify(before.player)}`);}
   await p.mouse.click(point.x,point.y);
   await advance(before.heist>=6&&before.cargo?300:600);
  }
  throw Error(`Move stuck to ${x},${z}: ${JSON.stringify((await state()).player)}`);
 }
 async function take(id){const s=await state(),item=s.items.find(i=>i.id===id);await go(item.x,item.z);await p.selectOption('#near-target',id);await key('e');}
 async function inspectItem(id){const s=await state(),item=s.items.find(i=>i.id===id);await go(item.x,item.z);await p.selectOption('#near-target',id);await key('q');const text=await p.locator('.observed').innerText();await click('#resume-btn');return text;}
 async function begin(){await click('#start-btn');await click('#resume-btn');await key('e');if(!(await state()).badge)throw Error('badge not equipped');}
 async function next(){await click('#next-btn');await begin();}
 async function exit(){await go(-8.8,7.8);await advance(100);if((await state()).mode!=='win')throw Error('Expected win '+JSON.stringify(await state()));}
 await advance(0);await p.waitForFunction(()=>{const a=JSON.parse(window.render_game_to_text()).assets;return a.loaded&&Object.values(a.mechanical).every(m=>m.loaded);},{},{timeout:60000,polling:100});if(!resume){await begin();await go(7,0);await key('Space');await key('e');await snap('01-token-carry');await go(-2,0);await go(-5,5);await exit();await snap('01-success');
 await next();await take('map');await key('m');await snap('02-visited-route-map');await click('#resume-btn');await take('token');await exit();await snap('02-optional-map-success');
 await next();
 let s=await state(),h=s.robots.find(r=>r.id==='gardener');await go(h.x,h.z);await key('q');await click('#resume-btn');await key('e');
 await go(3,-1.5);await key('Space');await advance(450);await snap('03-escort-gate-target');await go(3,-4.5);await take('token');await snap('03-escort-carry');await go(3,-4.5);await go(3,-1.5);await exit();await snap('03-escort-success');
 await next();
 let keyId='';for(const id of ['key-case','key-side']){const text=await inspectItem(id);if(text.includes('side door'))keyId=id;}
 await take(keyId);await go(3,-1.8);await key('e');
 let bellId='';for(const id of ['bell-a','bell-b']){const text=await inspectItem(id);if(text.includes('polished'))bellId=id;}
 s=await state();const bell=s.items.find(i=>i.id===bellId);await go(bell.x,bell.z);await key('Space');await key('e');await snap('04-bell-carry');await go(3,-4.5);await go(3,-1.5);await go(1.2,-1.5);await go(1.2,4.2);await go(4,4.3);await snap('04-bell-cover-target');for(let wait=0;wait<8&&Number(await p.locator('#squeak-btn').evaluate(e=>Number(e.style.opacity)))<1;wait++)await advance(1000);await key('Space');await go(-2,7.5);await exit();await snap('04-bell-success');
 await next();await snap('05-large-bag-worn');await key('g');await snap('05-large-bag-left-outside');if(process.argv.includes('--trolley'))await take('trolley');
 await go(3,-1.5);await go(3,-4.5);
 let boxId='';for(const id of ['box-b','box-a']){const text=await inspectItem(id);if(text.includes('helper placed'))boxId=id;}
 await take(boxId);s=await state();h=s.robots.find(r=>r.id==='gardener');await go(h.x,h.z);await key('q');await click('#resume-btn');await key('e');await snap('05-helper-handoff');
 await go(3,-4.5);await go(3,-1.5);await advance(2000);await go(-2,0);await go(-5,5);await exit();await snap('05-transfer-success');}

 if(process.argv.includes('--campaign')){
  const start=resume?(await state()).heist-1:5;const end=Math.min(HEISTS.length,Number(process.argv.find(a=>a.startsWith('--through='))?.slice(10)??HEISTS.length));
  for(let level=start;level<end;level++){
   if(resume&&level===start)await begin();else await next();const config=missionConfig(level);if(config.bagOutside)await key('g');
   if(process.argv.includes('--trolley')&&config.trolley)await take('trolley');
   const chosen=new Map();let lastRequest='';
   async function recruit(){let current=await state(),helper=current.robots.find(r=>r.id==='gardener');for(let wait=0;config.escort&&!current.escort&&current.player.z>=-3&&helper.z< -3&&wait<65;wait++){await advance(500);current=await state();helper=current.robots.find(r=>r.id==='gardener');}for(let chase=0;chase<12;chase++){current=await state();helper=current.robots.find(r=>r.id==='gardener');await go(helper.x,helper.z);const latest=await state(),moving=latest.robots.find(r=>r.id==='gardener');if(Math.hypot(latest.player.x-moving.x,latest.player.z-moving.z)<1.8)break;}await p.selectOption('#near-target','gardener');await key('q');if((await state()).mode==='reading')await click('#resume-btn');await p.selectOption('#near-target','gardener');await key('e');}
   if(config.escort)await recruit();
   for(let attempt=0;attempt<60;attempt++){const count=(await state()).taskIndex;try{
    let current=await state();const task=config.tasks[current.taskIndex];if(!task)break;console.log('TASK',level+1,count+1,task.id);
    if(task.kind==='repair'){
     if(current.tool!==task.tool)await take(task.tool);
     if(config.escort&&!current.escort)await recruit();
    }else if(lastRequest!==task.request){
     // Inspect each near-match and compare its actual English record to the authored request.
     if(config.escort&&!(await state()).escort)await recruit();
     current=await state();if(!current.doorOpen)throw Error('Required repair did not open door');
     await go(3,-1.5);await go(3,-4.5);
     const cohort=config.items.filter(i=>i.request===task.request),expected=cohort.find(i=>i.correct).detail;
     let selected='';for(const candidate of cohort){const text=await inspectItem(candidate.id);if(text===expected)selected=candidate.id;}
     if(!selected)throw Error('No English record matches '+task.request);chosen.set(task.request,selected);
     current=await state();const item=current.items.find(i=>i.id===selected);await go(item.x,item.z);if(config.watchedCargo){for(let wait=0;wait<40&&Number(await p.locator('#squeak-btn').evaluate(e=>Number(e.style.opacity)))<1;wait++)await advance(200);await key('Space');}await p.selectOption('#near-target',selected);await key('e');
     if(config.helperCarry&&item.kind==='box')await recruit();
     lastRequest=task.request;
    }
    const target=STATIONS[task.station];current=await state();
    if(inStore(current.player)&&!inStore(target)){
     if(config.watchedCargo&&current.cargo){
      await go(8,-4.5);const stashed=(await state()).cargo;if(stashed)await key('g');for(let wait=0;wait<40&&Number(await p.locator('#squeak-btn').evaluate(e=>Number(e.style.opacity)))<1;wait++)await advance(200);await key('Space');if(stashed){await p.selectOption('#near-target',stashed);await key('e');}
     }
     await go(3,-4.5);await go(3,-1.5);
     if(config.watchedCargo&&current.cargo){await go(-8,-1.5);if(target.z>=-3)await go(-8,4.3);}
    }
    if(!inStore(current.player)&&inStore(target)){await go(3,-1.5);await go(3,-4.5);}
    if(task.station==='exit'&&(await state()).player.x>=-7)await go(-5,5);
    await go(target.x,target.z);await advance((await state()).cargo?100:800);
    current=await state();if(current.mode!=='win'&&current.taskIndex===count){if(task.station!=='exit')await p.selectOption('#near-target',`station-${task.station}`);await key('e');await advance(100);}
    current=await state();if(current.taskIndex!==count+1)throw Error(`Task failed L${level+1}: ${task.text} ${current.message}`);
    if(task.kind==='deliver')lastRequest='';
    if([10,14,19,24,29,34].includes(level)||task.kind==='repair')await snap(`campaign-${level+1}-${count+1}-${task.kind}`);
    }catch(error){const caught=await state();if(caught.mode==='caught'&&caught.retries<8){await snap(`campaign-${level+1}-caught-${caught.retries}`);await click('#retry-btn');lastRequest='';continue;}throw error;}
   }
   if((await state()).mode!=='win')throw Error('Missing campaign win '+(level+1));
   await snap(`campaign-${level+1}-success`);
  }
 }
 fs.writeFileSync(artifact('qa-results.json'),JSON.stringify({errors,log},null,2));console.log('PASS',errors);await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
