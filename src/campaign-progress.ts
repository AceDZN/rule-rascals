import {HEISTS} from './content';
export type Completion={level:number;assisted:boolean;retries:number;lawful:boolean;languageEvidence:boolean;time:number};
export type CampaignProgress={version:2;current:number;seed:number;completed:Record<number,Completion>};
export const PROGRESS_KEY='rule-rascals-campaign-v2';
export function freshProgress():CampaignProgress{return {version:2,current:0,seed:Math.floor(Math.random()*9999),completed:{}};}
export function unlockedThrough(p:CampaignProgress){let n=0;while(n<HEISTS.length&&p.completed[n])n++;return Math.min(HEISTS.length-1,n);}
export function medals(r:Completion){return 1+Number(r.lawful)+Number(r.languageEvidence);}
export function completeLevel(p:CampaignProgress,result:Completion):CampaignProgress{
 if(!Number.isInteger(result.level)||result.level<0||result.level>unlockedThrough(p))return p;
 const old=p.completed[result.level];const completed={...p.completed};if(!old||medals(result)>medals(old)||medals(result)===medals(old)&&result.time<old.time)completed[result.level]={...result};
 return {...p,completed,current:Math.min(HEISTS.length-1,unlockedThrough({...p,completed})),seed:p.seed+1};
}
export function parseProgress(raw:string|null):CampaignProgress{
 const clean=freshProgress();try{const data=JSON.parse(raw??'null');if(data?.version!==2||!data.completed)return clean;
  const completed:Record<number,Completion>={};for(let level=0;level<HEISTS.length;level++){const r=data.completed[level];if(!r||r.level!==level||typeof r.lawful!=='boolean'||typeof r.languageEvidence!=='boolean'||typeof r.assisted!=='boolean'||!Number.isFinite(r.time)||!Number.isInteger(r.retries))break;completed[level]={level,lawful:r.lawful,languageEvidence:r.languageEvidence,assisted:r.assisted,time:Math.max(0,r.time),retries:Math.max(0,r.retries)};}
  const progress={...clean,completed,seed:Number.isSafeInteger(data.seed)&&data.seed>=0?data.seed:clean.seed};progress.current=Number.isInteger(data.current)?Math.max(0,Math.min(data.current,unlockedThrough(progress))):unlockedThrough(progress);return progress;
 }catch{return clean;}
}
