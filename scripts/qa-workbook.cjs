const fs=require('node:fs');const http=require('node:http');const assert=require('node:assert/strict');
const {chromium}=require(process.env.RULE_RASCALS_BROWSER_LIB||'playwright');
(async()=>{
 const {findPath,walkableTarget}=await import('../src/navigation.ts');
 const browser=await chromium.launch({headless:true,args:['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist']});
 const viewport={width:1280,height:800},page=await browser.newPage({viewport}),errors=[],links=[];
 page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;});
 const server=http.createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/html'});res.end('<style>html,body{margin:0;width:100%;height:100%}iframe{border:0;width:100%;height:100%}</style><iframe></iframe><script>window.events=[];addEventListener("message",e=>{if(e.origin==="http://localhost:4203"&&e.source===document.querySelector("iframe").contentWindow&&e.data.source==="workbook-game")events.push(e.data)})</script>');});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 await page.goto(`http://127.0.0.1:${server.address().port}/`);let frame;
 const events=()=>page.evaluate(()=>window.events);
 const state=()=>frame.evaluate(()=>JSON.parse(window.render_game_to_text()));
 const step=ms=>frame.evaluate(ms=>window.advanceTime(ms),ms);
 async function load(level){await page.evaluate(level=>{window.events=[];document.querySelector('iframe').src=`http://localhost:4203/?level=${level}&deterministic=1`;},level);try{await page.waitForFunction(()=>window.events.some(e=>e.type==='ready'),{},{timeout:60000,polling:100});}catch(error){console.error('DIAG',await page.evaluate(()=>({events:window.events,html:document.body.innerHTML})));for(const child of page.frames().slice(1))console.error('FRAME',await child.evaluate(()=>({url:location.href,ref:document.referrer,ancestors:Array.from(location.ancestorOrigins||[]),state:typeof window.render_game_to_text==='function'?JSON.parse(window.render_game_to_text()):document.body.innerText})));throw error;}frame=page.frames().find(f=>f.url().startsWith('http://localhost:4203'));}
 for(let n=1;n<=35;n++){
  console.log("LINK",n);await load(n);assert.equal((await state()).heist,n);assert.equal((await state()).mode,'reading');assert.equal((await events()).length,1);
  await frame.click('#resume-btn',{force:true});await step(0);const messages=await events();assert.deepEqual(messages.map(m=>[m.type,m.level]),[['ready',undefined],['level-start',n]]);
  const assets=(await state()).assets;assert.equal(assets.tripoGLBs,3);assert.equal(assets.tripoRig,true);links.push({level:n,events:messages,models:assets.tripoGLBs});
 }
 fs.mkdirSync('work/workbook-evidence',{recursive:true});await page.screenshot({path:'work/workbook-evidence/35-start.png'});
 await load(1);await step(60000);assert.equal((await state()).time,0);await frame.click('#resume-btn',{force:true});await step(0);await page.keyboard.press('e');await step(0);assert.equal((await state()).badge,true);
 async function go(x,z){for(let attempt=0;attempt<70;attempt++){const s=await state();if(s.mode==='win')return;assert.equal(s.mode,'play');const target=walkableTarget(s,s.player,{x,z});if(Math.hypot(s.player.x-target.x,s.player.z-target.z)<.4)return;const route=[];let from=s.player;for(const end of findPath(s,s.player,{x,z})){const count=Math.max(1,Math.ceil(Math.hypot(end.x-from.x,end.z-from.z)/.5));for(let i=1;i<=count;i++)route.push({x:from.x+(end.x-from.x)*i/count,z:from.z+(end.z-from.z)*i/count});from=end;}const points=await frame.evaluate(route=>route.map(p=>window.projectWorld(p.x,p.z)),route);const visible=points.filter(p=>p.x>60&&p.x<1220&&p.y>190&&p.y<650).at(-1);assert.ok(visible);await page.mouse.click(visible.x,visible.y);await step(600);}throw Error('Movement did not arrive');}
 await go(7,0);await page.keyboard.press('Space');await step(0);await frame.selectOption('#near-target','token');await page.keyboard.press('e');await step(0);await page.screenshot({path:'work/workbook-evidence/01-carry.png'});
 await go(-2,0);await go(-5,5);await go(-9,8);assert.equal((await state()).mode,'win');
 let messages=await events();assert.equal(messages.filter(m=>m.type==='level-complete').length,1);assert.equal(messages.at(-1).level,1);assert.ok(messages.at(-1).durationMs<60000);
 await frame.click('#review-btn',{force:true});await frame.click('#back-result',{force:true});await step(0);assert.equal((await events()).filter(m=>m.type==='level-complete').length,1);
 await page.screenshot({path:'work/workbook-evidence/01-complete.png'});await frame.click('#next-btn',{force:true});await frame.click('#start-btn',{force:true});await frame.click('#resume-btn',{force:true});await step(0);
 messages=await events();assert.deepEqual(messages.map(m=>[m.type,m.level]),[['ready',undefined],['level-start',1],['level-complete',1],['level-start',2]]);
 // A lesson link overrides the newly earned saved level2 without forging earlier wins.
 await load(35);assert.equal((await state()).heist,35);assert.equal((await state()).campaign.completed,1);
 assert.deepEqual(errors,[]);fs.writeFileSync('work/workbook-bridge.json',JSON.stringify({links,completionEvents:messages,savedLevelOverride:true,errors},null,2));
 console.log('PASS:35 iframe links, real completion, pause duration, Next, saved override',errors);await browser.close();server.close();
})().catch(error=>{console.error(error);process.exit(1);});
