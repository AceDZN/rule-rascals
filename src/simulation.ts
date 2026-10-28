import { HEISTS, missionConfig } from './content';
import {STATIONS, type Task, type StationId} from './missions';
import { findPath, clearSegment } from './navigation';
import {gardenObstacles,overlapsObstacle,PLAYER_RADIUS,WALK_BOUNDS,groundPropObstacle,GROUND_PROP_SIZES,type Obstacle} from './world-layout';
export type {Obstacle} from './world-layout';
export type Point = {x:number;z:number};
export type Item = Point & {id:string;kind:'badge'|'map'|'bag'|'token'|'key'|'bell'|'box'|'trolley'|'tool';request?:string;label:string;detail:string;holder:'ground'|'player'|'helper'|'delivered';correct?:boolean;history?:string};
export type Robot = Point & {id:string;kind:'guard'|'watering'|'sweeping';angle:number;mode:'patrol'|'suspicious'|'chase'|'return'|'distracted'|'follow';timer:number;waypoint:number;cargo:string|null;lastKnown?:Point};
export type GameEvent = {at:number;heist:number;action:string;target?:string;success?:boolean;assisted:boolean;retry:number};
export type Input = {x:number;z:number;sprint?:boolean;sneak?:boolean};
export type State = {
 taskIndex:number;completedTasks:string[];taskCargo:Record<string,string>;transported:string[];tool:string|null;
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
 if(!Number.isInteger(level)||level<0||level>=HEISTS.length)throw new RangeError('Unknown campaign level');
 const config=missionConfig(level),parity=seed%2===0;
 const items:Item[]=[{id:'badge',kind:'badge',label:'Visitor badge',detail:'Wear this visitor badge. Carrying it is not wearing it.',x:-8,z:6.5,holder:'ground'}];
 if(level<=2)items.push({id:'token',kind:'token',label:level===1?'Silver token':'Garden token',detail:'A festival token. Bring it to the exit.',x:level===0?7:level===1?-8:7.8,z:level===0?0:-7,holder:'ground',correct:true});
 if(level===1)items.push({id:'map',kind:'map',label:'Garden map',detail:"You don't have to take a map. With or without it, you may continue.",x:-10,z:6,holder:'ground'},{id:'bag',kind:'bag',label:'Large bag',detail:'A bag. Keep the doorway clear.',x:-6,z:6.5,holder:'ground'});
 if(level===3){
  items.push({id:'key-side',kind:'key',label:'Small key',detail:'This key opens the side door.',x:parity?-10:-7,z:-6,holder:'ground'}, {id:'key-case',kind:'key',label:'Small key',detail:'This key opens the display case.',x:parity?-7:-10,z:-6,holder:'ground'});
  items.push({id:'bell-a',kind:'bell',label:'Brass bell',detail:`Garden log: The gardener ${parity?'polished':'moved'} this bell.`,history:parity?'polished':'moved',correct:parity,x:2,z:-7,holder:'ground'}, {id:'bell-b',kind:'bell',label:'Brass bell',detail:`Garden log: The gardener ${parity?'moved':'polished'} this bell.`,history:parity?'moved':'polished',correct:!parity,x:8,z:-7,holder:'ground'});
 }
 if(level===4)items.push({id:'box-a',kind:'box',label:'Festival box',detail:parity?'Delivery log: The helper placed this box beside the fountain.':'Delivery log: The sweeper placed this box beside the wall.',history:parity?'placed-beside-fountain':'placed-by-sweeper',correct:parity,x:parity?4.5:2,z:parity?-6:-7.5,holder:'ground'}, {id:'box-b',kind:'box',label:'Festival box',detail:!parity?'Delivery log: The helper placed this box beside the fountain.':'Delivery log: The sweeper placed this box beside the wall.',history:!parity?'placed-beside-fountain':'placed-by-sweeper',correct:!parity,x:!parity?7.7:2,z:!parity?-6:-7.5,holder:'ground'}, {id:'trolley',kind:'trolley',label:'Trolley',detail:"You don't have to use the trolley. The helper can carry a box with or without it.",x:-5,z:6,holder:'ground'});
 if(config.items){
  items.splice(1,items.length-1,...config.items.map(i=>({...i,holder:'ground' as const})));
  // Shuffle positions within each description cohort; shape/colour never encode its answer.
  for(const request of new Set(items.map(i=>i.request).filter(Boolean))){const group=items.filter(i=>i.request===request),spots=group.map(i=>({x:i.x,z:i.z}));group.forEach((i,n)=>Object.assign(i,spots[(n+Math.abs(seed+level))%spots.length]));}
  if(config.map)items.push({id:'map',kind:'map',label:'Pocket map',detail:"You don't have to take a map. Either choice is allowed.",x:-10,z:6,holder:'ground'});
  if(config.trolley)items.push({id:'trolley',kind:'trolley',label:'Trolley',detail:"You don't have to use the trolley. The helper can carry boxes either way.",x:-5,z:6,holder:'ground'});
 }
 const obstacles=gardenObstacles(level,items.filter(i=>i.kind==='bell'));
 if(level>=5&&config.locked)obstacles.push({x:3,z:-3,w:3.8,d:.35,h:2.4,kind:'door'});
 const robots:Robot[]=[{id:'guard',kind:'guard',x:1,z:5,angle:Math.PI,mode:'patrol',timer:0,waypoint:0,cargo:null}, {id:'gardener',kind:'watering',x:config.helperCarry&&!config.escort?8:-1.4,z:config.helperCarry&&!config.escort?-5:-1,angle:0,mode:'patrol',timer:0,waypoint:0,cargo:null}, {id:'sweeper',kind:'sweeping',x:-8,z:-1,angle:Math.PI/2,mode:'patrol',timer:0,waypoint:0,cargo:null}];
 if(level===3){const bell=items.find(i=>i.kind==='bell'&&i.correct)!;robots[1].x=bell.x;robots[1].z=bell.z+1.1;}
 if(config.helperCarry)robots.push({id:'arch-inspector',kind:'guard',x:5.5,z:-1.9,angle:-1.99,mode:'patrol',timer:0,waypoint:0,cargo:null});
 return {taskIndex:0,completedTasks:[],taskCargo:{},transported:[],tool:null,level,seed,mode:'intro',time:0,player:{...SPAWN,angle:0,speed:0,sneaking:false},items,robots,obstacles,badge:false,bag:!!config.bagOutside,map:false,trolley:false,cargo:null,escort:null,doorOpen:!config.locked,suspicion:0,violations:[],everViolated:false,catches:0,retries:0,supportUsed:false,readRules:false,inspected:[],noise:null,noiseUntil:0,squeakCooldown:0,trail:[{...SPAWN}],helperTransported:false,transportedCargo:null,mistakes:0,wrongDeliveries:[],message:'',messageUntil:0,events:[],walkDistance:0,lastSqueak:-99,results:[]};
}
const solidsCache=new WeakMap<State,{base:Obstacle[];count:number;doorOpen:boolean;props:{id:string;kind:string;x:number;z:number}[];solids:Obstacle[]}>();
export function activeObstacles(s:State){
 const cached=solidsCache.get(s);let count=0,same=!!cached&&cached.base===s.obstacles&&cached.count===s.obstacles.length&&cached.doorOpen===s.doorOpen;
 for(const item of s.items)if(item.holder==='ground'&&item.kind in GROUND_PROP_SIZES){const old=cached?.props[count++];if(!old||old.id!==item.id||old.kind!==item.kind||old.x!==item.x||old.z!==item.z)same=false;}
 if(same&&count===cached!.props.length)return cached!.solids;
 const props=s.items.filter(i=>i.holder==='ground'&&i.kind in GROUND_PROP_SIZES),solids=[...s.obstacles.filter(o=>o.kind!=='door'||!s.doorOpen),...props.map(groundPropObstacle).filter((o):o is Obstacle=>o!==null)];
 solidsCache.set(s,{base:s.obstacles,count:s.obstacles.length,doorOpen:s.doorOpen,props:props.map(i=>({id:i.id,kind:i.kind,x:i.x,z:i.z})),solids});return solids;
}
export function blocked(s:State,p:Point,r=PLAYER_RADIUS){return p.x-r<WALK_BOUNDS.minX||p.x+r>WALK_BOUNDS.maxX||p.z-r<WALK_BOUNDS.minZ||p.z+r>WALK_BOUNDS.maxZ||activeObstacles(s).some(o=>overlapsObstacle(o,p,r));}
export function move(s:State,p:Point,dx:number,dz:number,r=PLAYER_RADIUS){const steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.08));for(let i=0;i<steps;i++){if(!blocked(s,{x:p.x+dx/steps,z:p.z},r))p.x+=dx/steps;if(!blocked(s,{x:p.x,z:p.z+dz/steps},r))p.z+=dz/steps;}}
export function lineClear(s:State,a:Point,b:Point){const n=Math.max(2,Math.ceil(dist(a,b)/.2));for(let i=1;i<n;i++){const p={x:a.x+(b.x-a.x)*i/n,z:a.z+(b.z-a.z)*i/n};if(activeObstacles(s).some(o=>o.h>1.1&&overlapsObstacle(o,p)))return false;}return true;}
export function hasEscort(s:State){const h=s.robots.find(r=>r.id===s.escort);return !!h&&h.kind==='watering'&&dist(h,s.player)<2.65;}
export function getViolations(s:State):string[]{const v:string[]=[];
 if(!s.badge&&dist(s.player,SPAWN)>2.8)v.push('badge');
 if(missionConfig(s.level).doorwayClear&&s.items.some(i=>i.kind==='bag'&&i.holder==='ground'&&isDoorway(i)))v.push('doorway-bag');
 if(missionConfig(s.level).escort&&inStore(s.player)&&!hasEscort(s))v.push('without-helper');
 if(s.level===0&&s.items.find(i=>i.id===s.cargo)?.kind==='token'&&s.robots.some(r=>r.kind==='guard'&&r.mode!=='distracted'&&visibleTo(s,r)))v.push('watched-token');
 if(s.level===3&&s.items.find(i=>i.id===s.cargo)?.kind==='bell'&&s.robots.some(r=>r.kind==='guard'&&r.mode!=='distracted'&&visibleTo(s,r)))v.push('watched-bell');
 if(missionConfig(s.level).bagOutside&&(inStore(s.player)&&s.bag||s.items.some(i=>i.kind==='bag'&&i.holder==='ground'&&inStore(i))))v.push('large-bag');
 if(missionConfig(s.level).helperCarry&&isDoorway(s.player)&&s.cargo&&s.items.find(i=>i.id===s.cargo)?.kind==='box')v.push('helpers-only');
 if(s.level>=5&&missionConfig(s.level).watchedCargo&&s.items.find(i=>i.id===s.cargo)?.request&&s.robots.some(r=>r.kind==='guard'&&r.mode!=='distracted'&&visibleTo(s,r)))v.push('watched-cargo');
 if(missionConfig(s.level).quietStore&&inStore(s.player)&&s.player.speed>3.5)v.push('running-store');
 return v;
}
export function visibleTo(s:State,r:Robot,p:Point=s.player){const d=dist(r,p);if(d>(s.player.sneaking?5.2:7.4))return false;const angle=Math.atan2(p.x-r.x,p.z-r.z);const da=Math.atan2(Math.sin(angle-r.angle),Math.cos(angle-r.angle));return (Math.abs(da)<.72||d<1.25)&&lineClear(s,r,p);}
const mistakeText:Record<string,string>={'watched-cargo':'השומר ראה את חפץ המשימה בידיים. חפשו מחסה או הסיחו את דעתו.', 'running-store':'“mustn’t run inside” — בתוך המחסן צריך ללכת. אפשר לרוץ בחוץ.',badge:'התג נשאר בכיס? “must wear” אומר שחייבים לענוד אותו.', 'doorway-bag':'התיק חוסם את הפתח. “mustn’t leave bags in the doorway” אוסר להשאיר אותו שם.', 'without-helper':'“without a helper” הוא התנאי: צריך את העוזר שמשקה, קרוב אליכם במחסן.', 'watched-token':'השומר ראה את האסימון. “while a guard is watching” מגביל את הנשיאה גם כשעומדים. חפשו מחסה או הסיחו את דעתו.', 'watched-bell':'השומר ראה את הפעמון. “while a guard is watching” מגביל את הנשיאה כשהוא מסתכל. הסתתרו או הסיחו את דעתו.', 'large-bag':'התיק הגדול נשאר בחוץ לפי “must leave large bags outside”.', 'helpers-only':'“Only helpers” — תג מבקר אינו הופך אתכם לעוזרים. בקשו מהעוזר להעביר את הארגז.'};
export function nearbyTargets(s:State):{id:string;label:string;distance:number}[]{
 const candidates=[...s.items.filter(i=>i.holder==='ground').map(i=>({id:i.id,label:i.label,distance:dist(i,s.player)})),...s.robots.filter(r=>r.kind!=='guard').map(r=>({id:r.id,label:r.kind==='watering'?'Robot with watering can':'Robot with broom',distance:dist(r,s.player)})),{id:'notice',label:'Posted rules',distance:dist({x:-9.5,z:4.8},s.player)}, ...(s.level===3?[{id:'side-door',label:'Side door',distance:dist({x:3,z:-2},s.player)}]:[]),...(s.level>=5?Object.entries(STATIONS).filter(([id])=>id!=='exit').map(([id,p])=>({id:`station-${id}`,label:p.label,distance:dist(p,s.player)})):[])];
 candidates.sort((a,b)=>a.distance-b.distance);return candidates.filter(c=>c.distance<1.9);
}
export function nearest(s:State){return nearbyTargets(s)[0]??null;}
export function inspect(s:State,targetId:string){if(targetId.startsWith('station-')){const id=targetId.slice(8) as StationId,p=STATIONS[id];if(p&&dist(p,s.player)<2.1)return `${p.label}. Use E here to repair, scan or deliver, as stated in the current task. ${s.completedTasks.filter(t=>t.includes(id)).length?'A service action has been completed here.':''}`;}if(targetId==='notice'){s.readRules=true;record(s,'read-rules');return HEISTS[s.level].rules.join('\n');}const i=s.items.find(i=>i.id===targetId);if(i&&i.holder==='ground'&&dist(i,s.player)<2.1){if(!s.inspected.includes(i.id))s.inspected.push(i.id);record(s,'inspect',i.id);return i.detail;}const r=s.robots.find(r=>r.id===targetId);if(r&&dist(r,s.player)<2.1){if(!s.inspected.includes(r.id))s.inspected.push(r.id);record(s,'observe',r.id);return r.kind==='watering'?'This robot waters the plants. It is an exhibition helper.':'This robot sweeps the path. It is not the store helper.';}return '';}
export function interact(s:State,targetId?:string){if(s.mode!=='play')return false;const id=targetId??nearest(s)?.id;if(!id)return false;
 if(id.startsWith('station-'))return useStation(s,id.slice(8) as StationId);
 if(id==='notice'){s.readRules=true;s.mode='reading';record(s,'read-rules');return true;}
 if(id==='side-door'&&dist(s.player,{x:3,z:-2})<2.1){if(s.cargo==='key-side'){s.doorOpen=true;const key=s.items.find(i=>i.id===s.cargo)!;key.holder='ground';key.x=-2;key.z=-1;s.cargo=null;say(s,'המפתח מסתובב. הדלת הצדדית פתוחה.');record(s,'unlock',id,true);return true;}say(s,'המפתח לא מתאים למנעול הדלת. אפשר לבדוק את התווית שלו.');record(s,'unlock',id,false);return false;}
 const r=s.robots.find(r=>r.id===id&&r.kind!=='guard');if(r&&dist(r,s.player)<2.1){s.escort=r.id;r.mode='follow';say(s,r.kind==='watering'?'“Can you help me, please?” · העוזר מצטרף. הישארו קרובים.':'הרובוט מצטרף עם המטאטא שלו.');record(s,'request-escort',id,r.kind==='watering');
  if(missionConfig(s.level).helperCarry&&r.kind==='watering'&&s.cargo&&s.items.find(i=>i.id===s.cargo)?.kind==='box'){if(r.cargo){say(s,'העוזר כבר נושא ארגז. מסרו אותו או בקשו ממנו להניח אותו עם G.');return false;}r.cargo=s.cargo;s.items.find(i=>i.id===s.cargo)!.holder='helper';s.cargo=null;say(s,'“Can you carry this box, please?” · הארגז אצל העוזר.');record(s,'request-carry',r.cargo,true);}return true;}
 const i=s.items.find(i=>i.id===id&&i.holder==='ground');if(!i||dist(i,s.player)>2.1)return false;
 if(i.kind==='tool'){if(s.tool){const old=s.items.find(t=>t.id===s.tool)!;old.holder='ground';old.x=i.x;old.z=i.z;}s.tool=i.id;i.holder='player';say(s,'הכלי בכיס. E בנקודת שירות משתמש בו; לקיחת כלי אחר מחליפה ביניהם.');record(s,'equip-tool',id,true);return true;}
 if(i.kind==='badge'){s.badge=true;i.holder='player';say(s,'התג על הצעיף. מוכנים לביקור.');record(s,'equip',id,true);return true;}
 if(i.kind==='map'){s.map=true;i.holder='player';say(s,'המפה בכיס — בחירה שלכם.');record(s,'take-map',id,true);return true;}
 if(i.kind==='trolley'){s.trolley=true;i.holder='helper';say(s,'העגלה זמינה לעוזר. אפשר להמשיך גם בלעדיה.');record(s,'take-trolley',id,true);return true;}
 if(i.kind==='bag'&&missionConfig(s.level).bagOutside){s.bag=true;i.holder='player';record(s,'take-bag',id);return true;}
 if(s.cargo){say(s,'כפות מלאות. הניחו קודם את החפץ עם G.');return false;}
 s.cargo=id;i.holder='player';say(s,i.kind==='box'?'הארגז בידיים. אפשר לבקש עזרה מהרובוט.':'החפץ בידיים.');record(s,'take',id,true);return true;
}
/** Place bulky cargo beside its carrier, on free floor and outside every actor body. */
function freeDropPosition(s:State,item:Item,origin:Point,angle:number,player:Point=s.player):Point|null{
 const size=GROUND_PROP_SIZES[item.kind as keyof typeof GROUND_PROP_SIZES];
 if(!size)return{x:origin.x,z:origin.z};
 const radius=Math.hypot(size.w,size.d)/2;
 for(const distance of [1,1.2,1.4,1.6,1.8,2])for(const turn of [0,Math.PI/4,-Math.PI/4,Math.PI/2,-Math.PI/2,Math.PI*3/4,-Math.PI*3/4,Math.PI]){
  const p={x:origin.x+Math.sin(angle+turn)*distance,z:origin.z+Math.cos(angle+turn)*distance};
  if(blocked(s,p,radius)||!clearSegment(s,origin,p,0))continue;
  if(item.kind==='bag'&&missionConfig(s.level).bagOutside&&!inStore(origin)&&inStore(p))continue;
  const footprint:Obstacle={...p,...size,kind:'loose-item'};
  if(overlapsObstacle(footprint,player,PLAYER_RADIUS+.03)||s.robots.some(r=>overlapsObstacle(footprint,r,.52)))continue;
  return p;
 }
 return null;
}
export function drop(s:State){if(s.mode!=='play')return;
 if(s.cargo){const i=s.items.find(i=>i.id===s.cargo)!,p=freeDropPosition(s,i,s.player,s.player.angle);if(!p){say(s,'אין כאן מקום פנוי. זוזו מעט כדי להניח את החפץ.');return;}i.holder='ground';Object.assign(i,p);record(s,'drop',i.id);s.cargo=null;return;}
 if(s.bag){let i=s.items.find(i=>i.id==='bag');if(!i){i={id:'bag',kind:'bag',label:'Large bag',detail:'A large visitor bag.',...s.player,holder:'player'};s.items.push(i);}const p=freeDropPosition(s,i,s.player,s.player.angle);if(!p){say(s,'אין כאן מקום פנוי לתיק. זוזו מעט ונסו שוב.');return;}s.bag=false;i.holder='ground';Object.assign(i,p);record(s,'leave-bag','bag');say(s,'התיק הונח כאן.');return;}
 const h=s.robots.find(r=>r.cargo);if(h&&dist(h,s.player)<2.65){const i=s.items.find(i=>i.id===h.cargo)!,p=freeDropPosition(s,i,h,h.angle);if(!p){say(s,'העוזר צריך מקום פנוי כדי להניח את הארגז.');return;}i.holder='ground';Object.assign(i,p);h.cargo=null;say(s,'העוזר מניח את הארגז.');record(s,'helper-drop',i.id);}
}
export function squeak(s:State){if(s.mode!=='play'||s.squeakCooldown>0)return;s.noise={x:s.player.x+Math.sin(s.player.angle)*2.2,z:s.player.z+Math.cos(s.player.angle)*2.2};s.noiseUntil=s.time+5;s.squeakCooldown=7;s.lastSqueak=s.time;record(s,'squeak');for(const r of s.robots.filter(r=>r.kind==='guard'))if(dist(r,s.player)<11){r.mode='distracted';r.timer=5;r.lastKnown=undefined;}say(s,'צִיף! השומר בודק את מקור הצליל.');}
export function canComplete(s:State){if(s.level>=5){const tasks=missionConfig(s.level).tasks;return s.taskIndex===tasks.length&&tasks.every(t=>s.completedTasks.includes(t.id)&&(t.kind==='repair'||!!s.taskCargo[t.id]));}const cargo=s.items.find(i=>i.id===s.cargo)||s.items.find(i=>i.holder==='helper');if(!cargo||!cargo.correct||dist(s.player,SPAWN)>1.7)return false;if(cargo.holder==='helper'){const h=s.robots.find(r=>r.cargo===cargo.id);if(!h||dist(h,SPAWN)>3.5)return false;}return s.level!==4||(s.helperTransported&&s.transportedCargo===cargo.id);}
export function languageEvidence(s:State){if(s.level>=5)return s.readRules&&!s.supportUsed&&!s.everViolated&&s.retries===0&&s.mistakes===0&&s.items.filter(i=>i.correct&&i.request).every(i=>s.inspected.includes(i.id))&&(!missionConfig(s.level).escort&&!missionConfig(s.level).helperCarry||s.inspected.includes('gardener'));return s.readRules&&!s.supportUsed&&!s.everViolated&&s.retries===0&&s.mistakes===0&&((s.level!==2&&s.level!==4)||s.inspected.includes('gardener'))&&(s.level!==3||s.inspected.includes(s.cargo??'')&&s.inspected.includes('key-side'))&&(s.level!==4||s.inspected.includes(s.items.find(i=>i.correct)?.id??'')&&s.helperTransported);}
export function recover(s:State){if(missionConfig(s.level).bagOutside&&s.bag){s.bag=false;let bag=s.items.find(i=>i.id==='bag');if(!bag){bag={id:'bag',kind:'bag',label:'Large bag',detail:'A large visitor bag.',...SPAWN,holder:'ground'};s.items.push(bag);}bag.holder='player';const spot=freeDropPosition(s,bag,SPAWN,0,SPAWN);bag.holder='ground';Object.assign(bag,spot??{x:SPAWN.x+1.3,z:SPAWN.z});}s.mode='play';s.player={...SPAWN,angle:0,speed:0,sneaking:false};s.suspicion=0;s.retries++;s.cargo=null;s.escort=null;s.helperTransported=false;s.transportedCargo=null;s.transported=[];const fresh=createGame(s.level,s.seed);for(const i of s.items){if(['token','bell','box','key','bag'].includes(i.kind)&&i.holder!=='ground'&&i.holder!=='delivered'){i.holder='ground';const original=fresh.items.find(o=>o.id===i.id);i.x=original?.x??-8;i.z=original?.z??6;}}for(const r of s.robots){r.cargo=null;r.mode='patrol';r.timer=0;r.lastKnown=undefined;}record(s,'recover');say(s,'השומר החזיר אתכם לכניסה. החפצים שהושארו כאן נשארים; אפשר לנסות שוב.');}
export function activeTask(s:State):Task|undefined{return missionConfig(s.level).tasks[s.taskIndex];}
function heldCargo(s:State){return s.items.find(i=>i.id===s.cargo)||s.items.find(i=>i.holder==='helper'&&s.robots.some(r=>r.cargo===i.id&&dist(r,s.player)<2.65));}
function finishMission(s:State){if(s.mode==='win')return;s.mode='win';const lawful=!s.everViolated&&getViolations(s).length===0;s.results.push({level:s.level,assisted:s.supportUsed,retries:s.retries,lawful,languageEvidence:languageEvidence(s),time:+s.time.toFixed(1)});record(s,'heist-complete',undefined,true);}
export function useStation(s:State,id:StationId){
 if(s.mode!=='play'||s.level<5||!STATIONS[id]||dist(s.player,STATIONS[id])>2.1)return false;
 const task=activeTask(s);if(!task)return false;
 const fail=(reason:string)=>{const key=`${task.id}:${id}:${s.cargo??s.tool??'empty'}`;if(!s.wrongDeliveries.includes(key)){s.wrongDeliveries.push(key);s.mistakes++;record(s,'task-mismatch',task.id,false);}say(s,reason);return false;};
 if(task.station!==id)return fail('זו אינה התחנה הבאה לפי הסדר בהוראות. החפצים נשארו אצלכם; אפשר לתקן את המסלול.');
 let item:Item|undefined;
 if(task.kind==='repair'){
  if(s.tool!==task.tool||!s.items.some(i=>i.id===s.tool&&i.kind==='tool'&&i.holder==='player'))return fail('הכלי שבכיס אינו מתאים לפעולה הזאת. בדקו את מזוודות הכלים.');
  record(s,'service-complete',task.id,true);if(missionConfig(s.level).locked&&!s.doorOpen){s.doorOpen=true;record(s,'service-opened-door',task.id,true);}
 }else{
  item=heldCargo(s);
  if(!item||!item.correct||item.request!==task.request)return fail('החפץ אינו מתאים לתיאור של השלב הנוכחי. בדקו את הרשומה ואת סדר המשלוחים.');
  const carrier=item.holder==='helper'?s.robots.find(r=>r.cargo===item!.id):s.player;if(!carrier||dist(carrier,STATIONS[id])>2.1)return fail('החפץ עצמו צריך להגיע לנקודת השירות. התקרבו עוד והמתינו לעוזר.');
  const prior=missionConfig(s.level).tasks.slice(0,s.taskIndex).filter(t=>t.kind==='scan'&&t.request===task.request);
  if(prior.some(t=>s.taskCargo[t.id]!==item!.id))return fail('הסריקה הקודמת שייכת לחפץ אחר. החזירו את החפץ שנסרק.');
  if(item.kind==='box'&&missionConfig(s.level).helperCarry&&id!=='east'&&!s.transported.includes(item.id))return fail('הארגז צריך לעבור דרך הקשת אצל העוזר לפני המסירה.');
  s.taskCargo[task.id]=item.id;
  if(task.kind==='deliver'){item.holder='delivered';if(s.cargo===item.id)s.cargo=null;for(const r of s.robots)if(r.cargo===item.id)r.cargo=null;}
  record(s,task.kind==='scan'?'scan-complete':'delivery-complete',item.id,true);
 }
 s.completedTasks.push(task.id);s.taskIndex++;say(s,activeTask(s)?'הפעולה הושלמה. השלב הבא מופיע ברשימת המשימה.':'כל שלבי המשימה הושלמו!');
 if(canComplete(s))finishMission(s);return true;
}
const routes=new WeakMap<Robot,{until:number;end:Point;points:Point[]}>();
function approach(s:State,r:Robot,target:Point,speed:number,dt:number){
 if(dist(r,target)<.08)return;
 let route=routes.get(r);if(!route||s.time>route.until||dist(route.end,target)>1){route={until:s.time+.8,end:{...target},points:findPath(s,r,target,.52)};routes.set(r,route);}
 while(route.points.length&&dist(r,route.points[0])<.08)route.points.shift();const next=route.points[0]??target;const d=dist(r,next);if(d<.01)return;
 const dx=(next.x-r.x)/d,dz=(next.z-r.z)/d;r.angle=Math.atan2(dx,dz);const travel=Math.min(speed*dt,d);move(s,r,dx*travel,dz*travel,.52);
}
export function step(s:State,input:Input,dt:number){if(s.mode!=='play')return;dt=Math.min(.05,dt);s.time+=dt;s.squeakCooldown=Math.max(0,s.squeakCooldown-dt);
 const len=Math.hypot(input.x,input.z);s.player.sneaking=!!input.sneak;const speed=s.cargo?2.4:input.sneak?1.7:input.sprint?5:3.15;s.player.speed=0;
 if(len){const dx=input.x/len,dz=input.z/len;s.player.angle=Math.atan2(dx,dz);const prev={x:s.player.x,z:s.player.z};move(s,s.player,dx*speed*dt,dz*speed*dt);const travelled=dist(prev,s.player);s.walkDistance+=travelled;s.player.speed=travelled/dt;}
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
    if(missionConfig(s.level).helperCarry&&before&&!inStore(r)&&r.cargo){s.helperTransported=true;s.transportedCargo=r.cargo;if(!s.transported.includes(r.cargo))s.transported.push(r.cargo);record(s,'helper-crossed-arch',r.cargo,true);}
   }else{r.timer+=dt;if(s.level===3&&r.kind==='watering'&&r.timer<6){r.angle=Math.PI;continue;}const route=r.kind==='watering'?(s.level>=3&&!missionConfig(s.level).escort?[{x:8,z:-5},{x:3,z:-5}]:[{x:-1.6,z:-.9},{x:-1.6,z:-3.6}]):[{x:-9,z:1},{x:-8,z:-5}];const t=route[r.waypoint%route.length];if(dist(r,t)<.2){if(r.timer>3){r.waypoint++;r.timer=0;}}else approach(s,r,t,.6,dt);}
   continue;
  }
  if(r.mode==='distracted'){r.timer-=dt;if(s.noise){approach(s,r,s.noise,1.8,dt);r.angle=Math.atan2(s.noise.x-r.x,s.noise.z-r.z);}if(r.timer<=0)r.mode='return';continue;}
  if(r.mode==='chase'){const sees=visibleTo(s,r);if(sees){r.timer=3;r.lastKnown={x:s.player.x,z:s.player.z};}else r.timer-=dt;if(r.lastKnown)approach(s,r,r.lastKnown,4.1,dt);if(dist(r,s.player)<.7){s.catches++;s.mode='caught';record(s,'caught',s.violations[0],false);say(s,mistakeText[s.violations[0]]||'השומר תפס אתכם. אפשר לתכנן מסלול חדש.');return;}if(r.timer<=0){r.mode='return';s.suspicion=.1;}continue;}
  if(r.mode==='suspicious'){r.angle=Math.atan2(s.player.x-r.x,s.player.z-r.z);continue;}
  const route=[{x:1,z:5},{x:8,z:.2},{x:3,z:-1.8},{x:-2,z:-.1}];const t=route[r.waypoint%route.length];approach(s,r,t,1.1,dt);if(dist(r,t)<.25){r.waypoint++;r.mode='patrol';}
 }
 s.violations=getViolations(s);if(s.violations.length)s.everViolated=true;
 const g=s.robots.find(r=>r.kind==='guard')!;
 // The fixed arch inspector observes this physical crossing, separately from the roaming guard.
 if(missionConfig(s.level).helperCarry&&s.violations.includes('helpers-only')&&s.robots.find(r=>r.id==='arch-inspector')!.mode!=='distracted'&&visibleTo(s,s.robots.find(r=>r.id==='arch-inspector')!)){const item=s.items.find(i=>i.id===s.cargo)!;item.holder='ground';item.x=s.player.x;item.z=s.player.z< -3?-4.2:-1.8;s.cargo=null;s.everViolated=true;say(s,mistakeText['helpers-only']);record(s,'arch-returned-box',item.id,false);g.mode='chase';g.timer=3;g.lastKnown={x:s.player.x,z:s.player.z};}
 const bag=s.items.find(i=>i.kind==='bag'&&i.holder==='ground'&&isDoorway(i)),insideBag=s.items.find(i=>i.kind==='bag'&&i.holder==='ground'&&inStore(i));
 const seen=s.robots.filter(r=>r.kind==='guard'&&r.mode!=='distracted').some(observer=>s.violations.some(v=>v==='doorway-bag'?!!bag&&visibleTo(s,observer,bag):v==='large-bag'&&insideBag?visibleTo(s,observer,insideBag):visibleTo(s,observer)));
 if(seen&&g.mode!=='chase'){
  s.suspicion=Math.min(1,s.suspicion+dt*1.35);g.mode='suspicious';if(s.suspicion>=1){g.mode='chase';g.timer=3;g.lastKnown={x:s.player.x,z:s.player.z};s.everViolated=true;say(s,mistakeText[s.violations[0]]);record(s,'violation',s.violations[0],false);}
 }else if(g.mode!=='chase'){s.suspicion=Math.max(0,s.suspicion-dt*.5);if(g.mode==='suspicious'&&s.suspicion===0)g.mode='patrol';}
 if(s.noiseUntil<s.time)s.noise=null;
 if(s.level>=5&&activeTask(s)?.kind==='deliver'&&activeTask(s)?.station==='exit'&&dist(s.player,SPAWN)<1.7&&heldCargo(s))useStation(s,'exit');
 if(canComplete(s))finishMission(s);
 if(s.level<5&&dist(s.player,SPAWN)<1.7&&s.cargo&&!s.items.find(i=>i.id===s.cargo)?.correct&&!s.wrongDeliveries.includes(s.cargo)){say(s,'החפץ הגיע ליציאה, אבל אינו מתאים לתיאור במשימה. אפשר להחזיר אותו ולבדוק את היומן.');if(!s.wrongDeliveries.includes(s.cargo)){s.wrongDeliveries.push(s.cargo);s.mistakes++;record(s,'wrong-delivery',s.cargo,false);}}
}
