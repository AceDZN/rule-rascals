// This replay check requires a profile genuinely earned by qa-browser --campaign.
const fs=require('node:fs');const assert=require('node:assert/strict');
const {chromium}=require(process.env.RULE_RASCALS_BROWSER_LIB||'playwright');
(async()=>{
 const saved=JSON.parse(fs.readFileSync('work/campaign-earned-storage.json','utf8'));
 const record=saved.origins.flatMap(o=>o.localStorage).find(i=>i.name==='rule-rascals-campaign-v2');
 assert.equal(Object.keys(JSON.parse(record.value).completed).length,35,'requires all35 genuine earned records');
 const url=process.env.RULE_RASCALS_URL||'http://localhost:4203';for(const origin of saved.origins)origin.origin=new URL(url).origin;
 const browser=await chromium.launch({headless:true,args:['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist']});
 const context=await browser.newContext({storageState:saved,viewport:{width:1280,height:800}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;});
 await page.goto(url+'/?deterministic=1',{waitUntil:'domcontentloaded',timeout:90000});
 const ready=()=>page.waitForFunction(()=>typeof window.advanceTime==='function',{},{timeout:90000});await ready();
 const state=()=>page.evaluate(()=>JSON.parse(window.render_game_to_text()));
 const step=ms=>page.evaluate(ms=>window.advanceTime(ms),ms);
 const click=async selector=>{await page.click(selector,{force:true});await step(0);};
 assert.equal((await state()).campaign.completed,35);assert.equal((await state()).heist,35);
 await click('#campaign-btn');assert.equal(await page.locator('[data-level]').count(),35);assert.equal(await page.locator('[data-level]:disabled').count(),0);
 fs.mkdirSync('work/progress-evidence',{recursive:true});await page.screenshot({path:'work/progress-evidence/35-earned-map.png',timeout:90000});
 await click('[data-level="0"]');assert.equal((await state()).heist,1);await page.reload({waitUntil:'domcontentloaded'});await ready();
 assert.equal((await state()).heist,1);assert.equal((await state()).campaign.completed,35);
 await click('#start-btn');await click('#resume-btn');await page.locator('#near-target').focus();const before=(await state()).player;
 await page.keyboard.press('ArrowDown');await step(500);const after=(await state()).player;assert.equal(after.x,before.x);assert.equal(after.z,before.z);
 await page.keyboard.press('q');await step(0);assert.equal((await state()).mode,'reading');assert.match(await page.locator('.observed').innerText(),/visitor badge/);
 await click('#resume-btn');await page.keyboard.press('e');await step(0);assert.equal((await state()).badge,true);
 await page.screenshot({path:'work/progress-evidence/replay-badge.png',timeout:90000});
 assert.deepEqual(errors,[]);const result={earnedLevels:35,allUnlocked:true,replay:true,reloadPreservesCompletion:true,nativeSelectorKeyboard:true,actualBadgeEquip:true,errors};
 fs.writeFileSync('work/progress-evidence/results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));await browser.close();
})().catch(error=>{console.error(error);process.exit(1);});
