const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs');
const {chromium}=require(process.env.RULE_RASCALS_BROWSER_LIB||'playwright');
(async()=>{
 const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html');res.end('<script>window.messages=[];addEventListener("message",e=>{if(e.data?.source==="workbook-game")messages.push(e.data)})</script><iframe style="width:95vw;height:90vh" src="http://localhost:4203/?level=35&deterministic=1"></iframe>');});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,args:['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist']}),page=await browser.newPage();
 await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;});await page.route('**/models/raccoon.glb',route=>route.abort());
 await page.goto(`http://127.0.0.1:${server.address().port}/`);await page.waitForFunction(()=>window.messages.some(m=>m.type==='error'),{},{polling:100,timeout:60000});
 await page.waitForTimeout(300);const failure=await page.evaluate(()=>window.messages);assert.equal(failure.some(m=>m.type==='ready'),false);
 const standalone=await browser.newPage();await standalone.addInitScript(()=>{window.requestAnimationFrame=()=>0;window.hostMessages=[];addEventListener('message',event=>{if(event.data?.source==='workbook-game')window.hostMessages.push(event.data);});});
 await standalone.goto('http://localhost:4203/?level=35&deterministic=1');await standalone.waitForFunction(()=>typeof window.render_game_to_text==='function'&&JSON.parse(window.render_game_to_text()).assets.tripoGLBs===3,{},{polling:100,timeout:60000});
 const direct=await standalone.evaluate(()=>({heist:JSON.parse(window.render_game_to_text()).heist,messages:window.hostMessages}));assert.equal(direct.heist,35);assert.deepEqual(direct.messages,[]);
 fs.writeFileSync('work/workbook-negative.json',JSON.stringify({failure,standalone:direct},null,2));console.log('PASS: missing required model never ready; standalone silent');await browser.close();server.close();
})().catch(error=>{console.error(error);process.exit(1);});
