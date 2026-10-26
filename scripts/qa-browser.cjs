const fs=require('node:fs');
const { chromium }=require(process.env.RULE_RASCALS_BROWSER_LIB||'playwright');
fs.mkdirSync('work/browser-evidence',{recursive:true});
(async()=>{
 const {findPath}=await import('../src/navigation.ts');
 const b=await chromium.launch({headless:true,args:['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist']});
 const viewport={width:1672,height:941};
 const p=await b.newPage({viewport});const errors=[],log=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>{window.requestAnimationFrame=()=>0;});
 await p.goto(process.env.RULE_RASCALS_URL||'http://localhost:5203',{waitUntil:'domcontentloaded',timeout:90000});await p.waitForFunction(()=>typeof window.advanceTime==='function',{},{timeout:90000});
 const state=async()=>JSON.parse(await p.evaluate(()=>window.render_game_to_text()));
 const advance=async(ms)=>p.evaluate(ms=>window.advanceTime(ms),ms);
 const click=async(id)=>{await p.click(id,{force:true});await advance(0);};
 const key=async(code)=>{await p.keyboard.press(code);await advance(0);};
 const snap=async(name)=>{await p.screenshot({path:`work/browser-evidence/${name}.png`,timeout:90000});log.push({name,state:await state()});console.log(name,JSON.stringify((await state()).player),(await state()).mode);};
 async function go(x,z){
  for(let n=0;n<80;n++){
   const before=await state();if(before.mode==='win')return;if(before.mode!=='play')throw Error(`go ended ${before.mode} ${before.message}`);
   if(Math.hypot(before.player.x-x,before.player.z-z)<.4)return;
   // Read-only route planning chooses visible ground waypoints; all movement remains pointer input.
   const route=findPath(before,before.player,{x,z});
   const points=await p.evaluate(route=>route.map(q=>window.projectWorld(q.x,q.z)),route);
   const point=points.filter(q=>q.x>90&&q.x<viewport.width-90&&q.y>190&&q.y<viewport.height-140).at(-1);
   if(!point)throw Error(`No visible route waypoint toward ${x},${z}`);
   await p.mouse.click(point.x,point.y);
   await advance(600);
  }
  throw Error(`Move stuck to ${x},${z}: ${JSON.stringify((await state()).player)}`);
 }
 async function take(id){const s=await state(),item=s.items.find(i=>i.id===id);await go(item.x,item.z);await key('e');}
 async function inspectItem(id){const s=await state(),item=s.items.find(i=>i.id===id);await go(item.x,item.z);await key('q');const text=await p.locator('.observed').innerText();await click('#resume-btn');return text;}
 async function begin(){await click('#start-btn');await click('#resume-btn');await key('e');if(!(await state()).badge)throw Error('badge not equipped');}
 async function next(){await click('#next-btn');await begin();}
 async function exit(){await go(-8.8,7.8);await advance(100);if((await state()).mode!=='win')throw Error('Expected win '+JSON.stringify(await state()));}
 await advance(0);await p.waitForFunction(()=>{const a=JSON.parse(window.render_game_to_text()).assets;return a.loaded&&Object.values(a.mechanical).every(m=>m.loaded);},{},{timeout:60000,polling:100});await begin();await go(7,0);await key('Space');await key('e');await snap('01-token-carry');await go(-2,0);await go(-5,5);await exit();await snap('01-success');
 await next();await take('map');await key('m');await snap('02-visited-route-map');await click('#resume-btn');await take('token');await exit();await snap('02-optional-map-success');
 await next();
 let s=await state(),h=s.robots.find(r=>r.id==='gardener');await go(h.x,h.z);await key('q');await click('#resume-btn');await key('e');
 await go(3,-1.5);await go(3,-4.5);await go(7,-6.8);await key('e');await snap('03-escort-carry');await go(3,-4.5);await go(3,-1.5);await exit();await snap('03-escort-success');
 await next();
 let keyId='';for(const id of ['key-case','key-side']){const text=await inspectItem(id);if(text.includes('side door'))keyId=id;}
 await take(keyId);await go(3,-1.8);await key('e');
 let bellId='';for(const id of ['bell-a','bell-b']){const text=await inspectItem(id);if(text.includes('polished'))bellId=id;}
 await take(bellId);await key('Space');await snap('04-bell-carry');await go(3,-4.5);await go(3,-1.5);await exit();await snap('04-bell-success');
 await next();await snap('05-large-bag-worn');await key('g');await snap('05-large-bag-left-outside');if(process.argv.includes('--trolley'))await take('trolley');
 await go(3,-1.5);await go(3,-4.5);
 let boxId='';for(const id of ['box-b','box-a']){const text=await inspectItem(id);if(text.includes('helper placed'))boxId=id;}
 await take(boxId);s=await state();h=s.robots.find(r=>r.id==='gardener');await go(h.x,h.z);await key('q');await click('#resume-btn');await key('e');await snap('05-helper-handoff');
 await go(3,-4.5);await go(3,-1.5);await advance(2000);await go(-2,0);await go(-5,5);await exit();await snap('05-transfer-success');
 fs.writeFileSync('work/qa-results.json',JSON.stringify({errors,log},null,2));console.log('PASS',errors);await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
