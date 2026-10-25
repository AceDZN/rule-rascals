const fs=require('node:fs');
const { chromium }=require(process.env.RULE_RASCALS_BROWSER_LIB||'playwright');
fs.mkdirSync('work/browser-evidence',{recursive:true});
(async()=>{
 const b=await chromium.launch({headless:true,args:['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist']});
 const p=await b.newPage({viewport:{width:1440,height:900}});const errors=[],log=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>{window.requestAnimationFrame=()=>0;});
 await p.goto(process.env.RULE_RASCALS_URL||'http://localhost:5203',{waitUntil:'domcontentloaded',timeout:90000});await p.waitForFunction(()=>typeof window.advanceTime==='function',{},{timeout:90000});
 const state=async()=>JSON.parse(await p.evaluate(()=>window.render_game_to_text()));
 const advance=async(ms)=>p.evaluate(ms=>window.advanceTime(ms),ms);
 const click=async(id)=>{await p.click(id,{force:true});await advance(0);};
 const key=async(code)=>{await p.keyboard.press(code);await advance(0);};
 const snap=async(name)=>{await p.screenshot({path:`work/browser-evidence/${name}.png`,timeout:90000});log.push({name,state:await state()});console.log(name,JSON.stringify((await state()).player),(await state()).mode);};
 async function go(x,z){
  let point=await p.evaluate(({x,z})=>window.projectWorld(x,z),{x,z});
  if(point.y<75||point.y>850||point.x<15||point.x>1425)throw Error(`Offscreen ${x},${z} projects ${JSON.stringify(point)}`);
  await p.mouse.click(point.x,point.y);
  for(let n=0;n<22;n++){await advance(600);const s=await state();if(s.mode==='win')return;if(s.mode!=='play')throw Error(`go ended ${s.mode} ${s.message}`);if(Math.hypot(s.player.x-x,s.player.z-z)<.4)return;}
  throw Error(`Move stuck to ${x},${z}: ${JSON.stringify((await state()).player)}`);
 }
 async function take(id){const s=await state(),item=s.items.find(i=>i.id===id);await go(item.x,item.z);await key('e');}
 async function inspectItem(id){const s=await state(),item=s.items.find(i=>i.id===id);await go(item.x,item.z);await key('q');const text=await p.locator('.observed').innerText();await click('#resume-btn');return text;}
 async function begin(){await click('#start-btn');await click('#resume-btn');await key('e');if(!(await state()).badge)throw Error('badge not equipped');}
 async function next(){await click('#next-btn');await begin();}
 async function exit(){await go(-8.8,7.8);await advance(100);if((await state()).mode!=='win')throw Error('Expected win '+JSON.stringify(await state()));}
 await advance(0);await begin();await take('token');await snap('01-token-carry');await exit();await snap('01-success');
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
