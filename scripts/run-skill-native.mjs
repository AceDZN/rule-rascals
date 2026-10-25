// Adapter for the installed Codex skill client. Its action/capture/state loop is unchanged.
// Native Metal and longer transport timeouts avoid this desktop's SwiftShader stalls.
import path from 'node:path';
import os from 'node:os';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
const skillRoot=process.env.RULE_RASCALS_WEB_GAME_SKILL||path.join(os.homedir(),'.codex/skills/develop-web-game');
const require=createRequire(path.join(skillRoot,'package.json'));
const {chromium}=require('playwright');
const originalLaunch=chromium.launch.bind(chromium);
chromium.launch=async options=>{
 const browser=await originalLaunch({...options,args:['--use-angle=metal','--enable-gpu','--ignore-gpu-blocklist']});
 const originalPage=browser.newPage.bind(browser);
 browser.newPage=async options=>{
  const page=await originalPage(options);page.setDefaultNavigationTimeout(90000);page.setDefaultTimeout(60000);
  const click=page.click.bind(page);page.click=(selector,options)=>click(selector,{...options,force:true,timeout:60000});
  return page;
 };
 return browser;
};
await import(pathToFileURL(path.join(skillRoot,'scripts/web_game_playwright_client.js')).href);
