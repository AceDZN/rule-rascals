import { HEISTS } from './content';
import { findPath } from './navigation';
export type Point = {x:number;z:number};
export type Obstacle = Point & {w:number;d:number;h:number;kind:'planter'|'wall'|'door'|'fountain'};
export type Item = Point & {id:string;kind:'badge'|'map'|'bag'|'token'|'key'|'bell'|'box'|'trolley';label:string;detail:string;holder:'ground'|'player'|'helper';correct?:boolean;history?:string};
export type Robot = Point & {id:string;kind:'guard'|'watering'|'sweeping';angle:number;mode:'patrol'|'suspicious'|'chase'|'return'|'distracted'|'follow';timer:number;waypoint:number;cargo:string|null};
export type GameEvent = {at:number;heist:number;action:string;target?:string;success?:boolean;assisted:boolean;retry:number};
export type Input = {x:number;z:number;sprint?:boolean;sneak?:boolean};
export type State = {
 level:number;seed:number;mode:'intro'|'play'|'reading'|'paused'|'caught'|'win'|'complete';time:number;player:Point&{angle:number;speed:number;sneaking:boolean};
 items:Item[];robots:Robot[];obstacles:Obstacle[];badge:boolean;bag:boolean;map:boolean;trolley:boolean;cargo:string|null;escort:string|null;doorOpen:boolean;
 suspicion:number;violations:string[];everViolated:boolean;catches:number;retries:number;supportUsed:boolean;readRules:boolean;inspected:string[];noise:Point|null;noiseUntil:number;squeakCooldown:number;
 trail:Point[];helperTransported:boolean;transportedCargo:string|null;mistakes:number;wrongDeliveries:string[];message:string;messageUntil:number;events:GameEvent[];walkDistance:number;lastSqueak:number;results:{level:number;assisted:boolean;retries:number;lawful:boolean;languageEvidence:boolean;time:number}[];
};
export const dist=(a:Point,b:Point)=>Math.hypot(a.x-b.x,a.z-b.z);
export const inStore=(p:Point)=>p.z < -3 && p.x>0 && p.x<10;
export const isDoorway=(p:Point)=>Math.abs(p.z+3)<1.05&&p.x>1.25&&p.x<4.75;
export const SPAWN={x:-9,z:8};
export function record(s:State,action:string,target?:string,success?:boolean){s.events.push({at:+s.time.toFixed(2),heist:s.level+1,action,target,success,assisted:s.supportUsed,retry:s.retries});if(s.events.length>250)s.events.shift();}
export function say(s:State,message:string){s.message=message;s.messageUntil=s.time+6;}
export function createGame(level=0,seed=1):State {
 const parity=seed%2===0;
 const items:Item[]=[{id:'badge',kind:'badge',label:'Visitor badge',detail:'Wear this visitor badge. Carrying it is not wearing it.',x:-8,z:6.5,holder:'ground'}];
 if(level<=2)items.push({id:'token',kind:'token',label:level===1?'Silver token':'Garden token',detail:'A festival token. Bring it to the exit.',x:level===0?7:level===1?-8:7,z:level===0?0:-7,holder:'ground',correct:true});
 if(level===1)items.push({id:'map',kind:'map',label:'Garden map',detail:"You don't have to take a map. With or without it, you may continue.",x:-10,z:6,holder:'ground'},{id:'bag',kind:'bag',label:'Large bag',detail:'A bag. Keep the doorway clear.',x:-6,z:6.5,holder:'ground'});
 if(level===3){
  items.push({id:'key-side',kind:'key',label:'Small key',detail:'This key opens the side door.',x:parity?-10:-7,z:-6,holder:'ground'}, {id:'key-case',kind:'key',label:'Small key',detail:'This key opens the display case.',x:parity?-7:-10,z:-6,holder:'ground'});
  items.push({id:'bell-a',kind:'bell',label:'Brass bell',detail:`Garden log: The gardener ${parity?'polished':'moved'} this bell.`,history:parity?'polished':'moved',correct:parity,x:2,z:-7,holder:'ground'}, {id:'bell-b',kind:'bell',label:'Brass bell',detail:`Garden log: The gardener ${parity?'moved':'polished'} this bell.`,history:parity?'moved':'polished',correct:!parity,x:7,z:-7,holder:'ground'});
 }
 if(level===4)items.push({id:'box-a',kind:'box',label:'Festival box',detail:parity?'Delivery log: The helper placed this box beside the fountain.':'Delivery log: The sweeper placed this box beside the wall.',history:parity?'placed-beside-fountain':'placed-by-sweeper',correct:parity,x:parity?5:2,z:parity?-6:-7.5,holder:'ground'}, {id:'box-b',kind:'box',label:'Festival box',detail:!parity?'Delivery log: The helper placed this box beside the fountain.':'Delivery log: The sweeper placed this box beside the wall.',history:!parity?'placed-beside-fountain':'placed-by-sweeper',correct:!parity,x:!parity?7:2,z:!parity?-6:-7.5,holder:'ground'}, {id:'trolley',kind:'trolley',label:'Trolley',detail:"You don't have to use the trolley. The helper can carry a box with or without it.",x:-5,z:6,holder:'ground'});
 const obstacles:Obstacle[]=[{x:-4.8,z:2,w:4.2,d:2.2,h:1.65,kind:'planter'},{x:4,z:2.3,w:4.2,d:2,h:1.65,kind:'planter'}, {x:-5,z:-3.8,w:2.8,d:3.4,h:2.1,kind:'planter'},{x:9,z:5.5,w:1.8,d:3,h:1.65,kind:'planter'},
 {x:.5,z:-3,w:1,d:.35,h:2.8,kind:'wall'},{x:7.5,z:-3,w:5,d:.35,h:2.8,kind:'wall'},{x:0,z:-6,w:.3,d:6,h:2.8,kind:'wall'},{x:10,z:-6,w:.3,d:6,h:2.8,kind:'wall'},{x:5,z:-9,w:10,d:.3,h:2.8,kind:'wall'},{x:6,z:-6.9,w:1.2,d:1.2,h:.8,kind:'fountain'}];
 if(level===3)obstacles.push({x:3,z:-3,w:3.8,d:.35,h:2.4,kind:'door'});
 const robots:Robot[]=[{id:'guard',kind:'guard',x:1,z:5,angle:Math.PI,mode:'patrol',timer:0,waypoint:0,cargo:null}, {id:'gardener',kind:'watering',x:level===4?8:-1.4,z:level===4?-5:-1,angle:0,mode:'patrol',timer:0,waypoint:0,cargo:null}, {id:'sweeper',kind:'sweeping',x:-8,z:-1,angle:Math.PI/2,mode:'patrol',timer:0,waypoint:0,cargo:null}];
 if(level===3){const bell=items.find(i=>i.kind==='bell'&&i.correct)!;robots[1].x=bell.x;robots[1].z=bell.z+1.1;}
 if(level===4)robots.push({id:'arch-inspector',kind:'guard',x:5.5,z:-1.9,angle:-1.99,mode:'patrol',timer:0,waypoint:0,cargo:null});
 return {level,seed,mode:'intro',time:0,player:{...SPAWN,angle:0,speed:0,sneaking:false},items,robots,obstacles,badge:false,bag:level===4,map:false,trolley:false,cargo:null,escort:null,doorOpen:level!==3,suspicion:0,violations:[],everViolated:false,catches:0,retries:0,supportUsed:false,readRules:false,inspected:[],noise:null,noiseUntil:0,squeakCooldown:0,trail:[{...SPAWN}],helperTransported:false,transportedCargo:null,mistakes:0,wrongDeliveries:[],message:'',messageUntil:0,events:[],walkDistance:0,lastSqueak:-99,results:[]};
}
export function activeObstacles(s:State){return s.obstacles.filter(o=>o.kind!=='door'||!s.doorOpen);}
export function blocked(s:State,p:Point,r=.3){return Math.abs(p.x)>11.4||Math.abs(p.z)>9.4||activeObstacles(s).some(o=>Math.abs(p.x-o.x)<o.w/2+r&&Math.abs(p.z-o.z)<o.d/2+r);}
export function move(s:State,p:Point,dx:number,dz:number,r=.3){if(!blocked(s,{x:p.x+dx,z:p.z},r))p.x+=dx;if(!blocked(s,{x:p.x,z:p.z+dz},r))p.z+=dz;}
export function lineClear(s:State,a:Point,b:Point){const n=Math.max(2,Math.ceil(dist(a,b)/.2));for(let i=1;i<n;i++){const p={x:a.x+(b.x-a.x)*i/n,z:a.z+(b.z-a.z)*i/n};if(activeObstacles(s).some(o=>o.h>1.1&&Math.abs(p.x-o.x)<o.w/2&&Math.abs(p.z-o.z)<o.d/2))return false;}return true;}
export function hasEscort(s:State){const h=s.robots.find(r=>r.id===s.escort);return !!h&&h.kind==='watering'&&dist(h,s.player)<2.65;}
export function getViolations(s:State):string[]{const v:string[]=[];
 if(!s.badge&&dist(s.player,SPAWN)>2.8)v.push('badge');
 if(s.level===1&&s.items.some(i=>i.kind==='bag'&&i.holder==='ground'&&isDoorway(i)))v.push('doorway-bag');
 if(s.level===2&&inStore(s.player)&&!hasEscort(s))v.push('without-helper');
 if(s.level===0&&s.items.find(i=>i.id===s.cargo)?.kind==='token'&&s.robots.some(r=>r.kind==='guard'&&r.mode!=='distracted'&&visibleTo(s,r)))v.push('watched-token');
 if(s.level===3&&s.items.find(i=>i.id===s.cargo)?.kind==='bell'&&s.robots.some(r=>r.kind==='guard'&&r.mode!=='distracted'&&visibleTo(s,r)))v.push('watched-bell');
 if(s.level===4&&inStore(s.player)&&s.bag)v.push('large-bag');
 if(s.level===4&&isDoorway(s.player)&&s.cargo&&s.items.find(i=>i.id===s.cargo)?.kind==='box')v.push('helpers-only');
 return v;
}
export function visibleTo(s:State,r:Robot,p:Point=s.player){const d=dist(r,p);if(d>(s.player.sneaking?5.2:7.4))return false;const angle=Math.atan2(p.x-r.x,p.z-r.z);const da=Math.atan2(Math.sin(angle-r.angle),Math.cos(angle-r.angle));return (Math.abs(da)<.72||d<1.25)&&lineClear(s,r,p);}
const mistakeText:Record<string,string>={badge:'התג נשאר בכיס? “must wear” אומר שחייבים לענוד אותו.', 'doorway-bag':'התיק חוסם את הפתח. “mustn’t leave bags in the doorway” אוסר להשאיר אותו שם.', 'without-helper':'“without a helper” הוא התנאי: צריך את העוזר שמשקה, קרוב אליכם במחסן.', 'watched-token':'השומר ראה את האסימון. “while a guard is watching” מגביל את הנשיאה גם כשעומדים. חפשו מחסה או הסיחו את דעתו.', 'watched-bell':'השומר ראה את הפעמון. “while a guard is watching” מגביל את הנשיאה כשהוא מסתכל. הסתתרו או הסיחו את דעתו.', 'large-bag':'התיק הגדול נשאר בחוץ לפי “must leave large bags outside”.', 'helpers-only':'“Only helpers” — תג מבקר אינו הופך אתכם לעוזרים. בקשו מהעוזר להעביר את הארגז.'};
export function nearest(s:State):{id:string;label:string;distance:number}|null{
 const candidates=[...s.items.filter(i=>i.holder==='ground').map(i=>({id:i.id,label:i.label,distance:dist(i,s.player)})),...s.robots.filter(r=>r.kind!=='guard').map(r=>({id:r.id,label:r.kind==='watering'?'Robot with watering can':'Robot with broom',distance:dist(r,s.player)})),{id:'notice',label:'Posted rules',distance:dist({x:-9.5,z:4.8},s.player)}, ...(s.level===3?[{id:'side-door',label:'Side door',distance:dist({x:3,z:-2},s.player)}]:[])];
 candidates.sort((a,b)=>a.distance-b.distance);return candidates[0]?.distance<1.9?candidates[0]:null;
}
export function inspect(s:State,targetId:string){if(targetId==='notice'){s.readRules=true;record(s,'read-rules');return HEISTS[s.level].rules.join('\n');}const i=s.items.find(i=>i.id===targetId);if(i&&i.holder==='ground'&&dist(i,s.player)<2.1){if(!s.inspected.includes(i.id))s.inspected.push(i.id);record(s,'inspect',i.id);return i.detail;}const r=s.robots.find(r=>r.id===targetId);if(r&&dist(r,s.player)<2.1){if(!s.inspected.includes(r.id))s.inspected.push(r.id);record(s,'observe',r.id);return r.kind==='watering'?'This robot waters the plants. It is an exhibition helper.':'This robot sweeps the path. It is not the store helper.';}return '';}
export function interact(s:State,targetId?:string){if(s.mode!=='play')return false;const id=targetId??nearest(s)?.id;if(!id)return false;
 if(id==='notice'){s.readRules=true;s.mode='reading';record(s,'read-rules');return true;}
 if(id==='side-door'&&dist(s.player,{x:3,z:-2})<2.1){if(s.cargo==='key-side'){s.doorOpen=true;const key=s.items.find(i=>i.id===s.cargo)!;key.holder='ground';key.x=-2;key.z=-1;s.cargo=null;say(s,'המפתח מסתובב. הדלת הצדדית פתוחה.');record(s,'unlock',id,true);return true;}say(s,'המפתח לא מתאים למנעול הדלת. אפשר לבדוק את התווית שלו.');record(s,'unlock',id,false);return false;}
 const r=s.robots.find(r=>r.id===id&&r.kind!=='guard');if(r&&dist(r,s.player)<2.1){s.escort=r.id;r.mode='follow';say(s,r.kind==='watering'?'“Can you help me, please?” · העוזר מצטרף. הישארו קרובים.':'הרובוט מצטרף עם המטאטא שלו.');record(s,'request-escort',id,r.kind==='watering');
  if(s.level===4&&r.kind==='watering'&&s.cargo&&s.items.find(i=>i.id===s.cargo)?.kind==='box'){r.cargo=s.cargo;s.items.find(i=>i.id===s.cargo)!.holder='helper';s.cargo=null;say(s,'“Can you carry this box, please?” · הארגז אצל העוזר.');record(s,'request-carry',r.cargo,true);}return true;}
 const i=s.items.find(i=>i.id===id&&i.holder==='ground');if(!i||dist(i,s.player)>2.1)return false;
 if(i.kind==='badge'){s.badge=true;i.holder='player';say(s,'התג על הצעיף. מוכנים לביקור.');record(s,'equip',id,true);return true;}
 if(i.kind==='map'){s.map=true;i.holder='player';say(s,'המפה בכיס — בחירה שלכם.');record(s,'take-map',id,true);return true;}
 if(i.kind==='trolley'){s.trolley=true;i.holder='helper';say(s,'העגלה זמינה לעוזר. אפשר להמשיך גם בלעדיה.');record(s,'take-trolley',id,true);return true;}
 if(i.kind==='bag'&&s.level===4){s.bag=true;i.holder='player';record(s,'take-bag',id);return true;}
 if(s.cargo){say(s,'כפות מלאות. הניחו קודם את החפץ עם G.');return false;}
 s.cargo=id;i.holder='player';say(s,i.kind==='box'?'הארגז בידיים. אפשר לבקש עזרה מהרובוט.':'החפץ בידיים.');record(s,'take',id,true);return true;
}
export function drop(s:State){if(s.mode!=='play')return;
 if(s.cargo){const i=s.items.find(i=>i.id===s.cargo)!;i.holder='ground';i.x=s.player.x;i.z=s.player.z;record(s,'drop',i.id);s.cargo=null;return;}
 if(s.bag){s.bag=false;let i=s.items.find(i=>i.id==='bag');if(!i){i={id:'bag',kind:'bag',label:'Large bag',detail:'A large visitor bag.',x:s.player.x,z:s.player.z,holder:'ground'};s.items.push(i);}i.holder='ground';i.x=s.player.x;i.z=s.player.z;record(s,'leave-bag','bag');say(s,'התיק הונח כאן.');return;}
 const h=s.robots.find(r=>r.cargo);if(h&&dist(h,s.player)<2.65){const i=s.items.find(i=>i.id===h.cargo)!;i.holder='ground';i.x=h.x;i.z=h.z;h.cargo=null;say(s,'העוזר מניח את הארגז.');record(s,'helper-drop',i.id);}
}
export function squeak(s:State){if(s.mode!=='play'||s.squeakCooldown>0)return;s.noise={x:s.player.x+Math.sin(s.player.angle)*2.2,z:s.player.z+Math.cos(s.player.angle)*2.2};s.noiseUntil=s.time+5;s.squeakCooldown=7;s.lastSqueak=s.time;record(s,'squeak');for(const r of s.robots.filter(r=>r.kind==='guard'))if(dist(r,s.player)<11){r.mode='distracted';r.timer=5;}say(s,'צִיף! השומר בודק את מקור הצליל.');}
export function canComplete(s:State){const cargo=s.items.find(i=>i.id===s.cargo)||s.items.find(i=>i.holder==='helper');if(!cargo||!cargo.correct||dist(s.player,SPAWN)>1.7)return false;if(cargo.holder==='helper'){const h=s.robots.find(r=>r.cargo===cargo.id);if(!h||dist(h,SPAWN)>3.5)return false;}return s.level!==4||(s.helperTransported&&s.transportedCargo===cargo.id);}
export function languageEvidence(s:State){return s.readRules&&!s.supportUsed&&!s.everViolated&&s.retries===0&&s.mistakes===0&&((s.level!==2&&s.level!==4)||s.inspected.includes('gardener'))&&(s.level!==3||s.inspected.includes(s.cargo??'')&&s.inspected.includes('key-side'))&&(s.level!==4||s.inspected.includes(s.items.find(i=>i.correct)?.id??'')&&s.helperTransported);}
export function recover(s:State){if(s.level===4&&s.bag){s.bag=false;let bag=s.items.find(i=>i.id==='bag');if(!bag){bag={id:'bag',kind:'bag',label:'Large bag',detail:'A large visitor bag.',...SPAWN,holder:'ground'};s.items.push(bag);}bag.holder='ground';bag.x=SPAWN.x;bag.z=SPAWN.z;}s.mode='play';s.player={...SPAWN,angle:0,speed:0,sneaking:false};s.suspicion=0;s.retries++;s.cargo=null;s.escort=null;s.helperTransported=false;s.transportedCargo=null;const fresh=createGame(s.level,s.seed);for(const i of s.items){if(['token','bell','box','key','bag'].includes(i.kind)&&i.holder!=='ground'){i.holder='ground';const original=fresh.items.find(o=>o.id===i.id);i.x=original?.x??-8;i.z=original?.z??6;}}for(const r of s.robots){r.cargo=null;r.mode='patrol';r.timer=0;}record(s,'recover');say(s,'השומר החזיר אתכם לכניסה. החפצים שהושארו כאן נשארים; אפשר לנסות שוב.');}
const routes=new WeakMap<Robot,{until:number;end:Point;points:Point[]}>();
function approach(s:State,r:Robot,target:Point,speed:number,dt:number){
 if(dist(r,target)<.08)return;
 let route=routes.get(r);if(!route||s.time>route.until||dist(route.end,target)>1){route={until:s.time+.8,end:{...target},points:findPath(s,r,target)};routes.set(r,route);}
 while(route.points.length&&dist(r,route.points[0])<.2)route.points.shift();const next=route.points[0]??target;const d=dist(r,next);if(d<.01)return;
 const dx=(next.x-r.x)/d,dz=(next.z-r.z)/d;r.angle=Math.atan2(dx,dz);move(s,r,dx*speed*dt,dz*speed*dt,.3);
}
export function step(s:State,input:Input,dt:number){if(s.mode!=='play')return;dt=Math.min(.05,dt);s.time+=dt;s.squeakCooldown=Math.max(0,s.squeakCooldown-dt);
 const len=Math.hypot(input.x,input.z);s.player.sneaking=!!input.sneak;const speed=s.cargo?2.4:input.sneak?1.7:input.sprint?5:3.15;s.player.speed=len?speed:0;
 if(len){const dx=input.x/len,dz=input.z/len;s.player.angle=Math.atan2(dx,dz);const prev={x:s.player.x,z:s.player.z};move(s,s.player,dx*speed*dt,dz*speed*dt);s.walkDistance+=dist(prev,s.player);}
 if(dist(s.player,s.trail.at(-1)!)>1){s.trail.push({x:s.player.x,z:s.player.z});if(s.trail.length>400)s.trail.shift();}
 for(const i of s.items){if(i.holder==='player'){i.x=s.player.x;i.z=s.player.z;}if(i.holder==='helper'){const h=s.robots.find(r=>r.cargo===i.id);if(h){i.x=h.x;i.z=h.z;}}}
 for(const r of s.robots){
  if(r.id==='arch-inspector'){if(r.mode==='distracted'){r.timer-=dt;if(r.timer<=0)r.mode='patrol';}continue;}
  if(r.kind!=='guard'){
   if(r.mode==='follow'){
    const before=inStore(r);
    let target:Point=s.player;
    // Doorway waypoint keeps the helper with the player around the actual store wall.
    if(inStore(r)!==inStore(s.player)){target={x:3,z:inStore(r)?-2:-4};if(Math.abs(r.x-3)<.75)target={x:3,z:s.player.z};}
    if(dist(r,s.player)>1.15||target!==s.player)approach(s,r,target,s.cargo?2.6:3.35,dt);
    if(s.level===4&&before&&!inStore(r)&&r.cargo){s.helperTransported=true;s.transportedCargo=r.cargo;record(s,'helper-crossed-arch',r.cargo,true);}
   }else{r.timer+=dt;if(s.level===3&&r.kind==='watering'&&r.timer<6){r.angle=Math.PI;continue;}const route=r.kind==='watering'?(s.level>=3?[{x:8,z:-5},{x:3,z:-5}]:[{x:-1.6,z:-.9},{x:-1.6,z:-3.6}]):[{x:-9,z:1},{x:-8,z:-5}];const t=route[r.waypoint%route.length];if(dist(r,t)<.2){if(r.timer>3){r.waypoint++;r.timer=0;}}else approach(s,r,t,.6,dt);}
   continue;
  }
  if(r.mode==='distracted'){r.timer-=dt;if(s.noise){approach(s,r,s.noise,1.8,dt);r.angle=Math.atan2(s.noise.x-r.x,s.noise.z-r.z);}if(r.timer<=0)r.mode='return';continue;}
  if(r.mode==='chase'){const sees=visibleTo(s,r);if(sees)r.timer=3;else r.timer-=dt;approach(s,r,s.player,4.1,dt);if(dist(r,s.player)<.7){s.catches++;s.mode='caught';record(s,'caught',s.violations[0],false);say(s,mistakeText[s.violations[0]]||'השומר תפס אתכם. אפשר לתכנן מסלול חדש.');return;}if(r.timer<=0){r.mode='return';s.suspicion=.1;}continue;}
  if(r.mode==='suspicious'){r.angle=Math.atan2(s.player.x-r.x,s.player.z-r.z);continue;}
  const route=[{x:1,z:5},{x:8,z:.2},{x:3,z:-1.8},{x:-2,z:-.1}];const t=route[r.waypoint%route.length];approach(s,r,t,1.1,dt);if(dist(r,t)<.25){r.waypoint++;r.mode='patrol';}
 }
 s.violations=getViolations(s);if(s.violations.length)s.everViolated=true;
 const g=s.robots.find(r=>r.kind==='guard')!;
 // The fixed arch inspector observes this physical crossing, separately from the roaming guard.
 if(s.level===4&&s.violations.includes('helpers-only')&&s.robots.find(r=>r.id==='arch-inspector')!.mode!=='distracted'&&visibleTo(s,s.robots.find(r=>r.id==='arch-inspector')!)){const item=s.items.find(i=>i.id===s.cargo)!;item.holder='ground';item.x=s.player.x;item.z=s.player.z< -3?-4.2:-1.8;s.cargo=null;s.everViolated=true;say(s,mistakeText['helpers-only']);record(s,'arch-returned-box',item.id,false);g.mode='chase';g.timer=3;}
 const bag=s.items.find(i=>i.kind==='bag'&&i.holder==='ground'&&isDoorway(i));
 const seen=s.robots.filter(r=>r.kind==='guard'&&r.mode!=='distracted').some(observer=>s.violations.some(v=>v==='doorway-bag'?!!bag&&visibleTo(s,observer,bag):visibleTo(s,observer)));
 if(seen&&g.mode!=='chase'){
  s.suspicion=Math.min(1,s.suspicion+dt*1.35);g.mode='suspicious';if(s.suspicion>=1){g.mode='chase';g.timer=3;s.everViolated=true;say(s,mistakeText[s.violations[0]]);record(s,'violation',s.violations[0],false);}
 }else if(g.mode!=='chase'){s.suspicion=Math.max(0,s.suspicion-dt*.5);if(g.mode==='suspicious'&&s.suspicion===0)g.mode='patrol';}
 if(s.noiseUntil<s.time)s.noise=null;
 if(canComplete(s)){s.mode='win';const lawful=!s.everViolated&&getViolations(s).length===0;const result={level:s.level,assisted:s.supportUsed,retries:s.retries,lawful,languageEvidence:languageEvidence(s),time:+s.time.toFixed(1)};s.results.push(result);record(s,'heist-complete',undefined,true);}
 if(dist(s.player,SPAWN)<1.7&&s.cargo&&!s.items.find(i=>i.id===s.cargo)?.correct&&!s.wrongDeliveries.includes(s.cargo)){say(s,'החפץ הגיע ליציאה, אבל אינו מתאים לתיאור במשימה. אפשר להחזיר אותו ולבדוק את היומן.');if(!s.wrongDeliveries.includes(s.cargo)){s.wrongDeliveries.push(s.cargo);s.mistakes++;record(s,'wrong-delivery',s.cargo,false);}}
}
