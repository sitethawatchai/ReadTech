import { consonants,vowels,consonantActivities,vowelActivities,blendModes,blendSequence,activityKey } from './curriculum.mjs';

// A new namespace leaves ReadUP's existing browser data alone.
export const STORAGE_KEY='readtech-open-progress-v1';
export const defaultSettings={largeText:false,sound:true,effectsSound:true,calm:false,voiceURI:'',speechRate:0.85};
export function emptyDraft(){return {help:0,answered:false,consonant:'',vowel:'',parts:[],strokes:[]};}
export function freshProgress(settings=defaultSettings){return {version:1,tab:'consonants',mode:'easy',selection:null,activity:null,done:[],draft:emptyDraft(),settings:{...defaultSettings,...settings}};}
export const validKeys=new Set([
 ...consonants.flatMap(c=>consonantActivities.map(a=>activityKey('consonants',c.id,a.id))),
 ...vowels.flatMap(v=>vowelActivities.map(a=>activityKey('vowels',v.id,a.id))),
 ...blendModes.flatMap(m=>blendSequence(m.id).map(p=>activityKey('blend',p.id,m.id)))
]);
export function parseProgress(raw) {
 const value=JSON.parse(raw);if(value?.version!==1)throw new Error('Unsupported progress');
 const next=freshProgress();
 if(['consonants','vowels','blend'].includes(value.tab))next.tab=value.tab;
 if(blendModes.some(m=>m.id===value.mode))next.mode=value.mode;
 next.done=[...new Set((Array.isArray(value.done)?value.done:[]).filter(k=>validKeys.has(k)))];
 for(const key of ['largeText','sound','effectsSound','calm'])if(typeof value.settings?.[key]==='boolean')next.settings[key]=value.settings[key];
 if(typeof value.settings?.voiceURI==='string')next.settings.voiceURI=value.settings.voiceURI.slice(0,300);
 if(Number.isFinite(value.settings?.speechRate))next.settings.speechRate=Math.max(.65,Math.min(1.1,value.settings.speechRate));
 const s=value.selection;
 const valid=s&&(s.kind==='consonants'?consonants.some(c=>c.id===s.id):s.kind==='vowels'?vowels.some(v=>v.id===s.id):s.kind==='blend'&&blendSequence(next.mode).some(p=>p.id===s.id));
 if(valid){
  next.selection={kind:s.kind,id:s.id};
  const length=s.kind==='consonants'?6:s.kind==='vowels'?3:1;
  if(Number.isInteger(value.activity)&&value.activity>=0&&value.activity<length)next.activity=value.activity;
  const draft=value.draft??{};
  next.draft.help=Number.isInteger(draft.help)?Math.max(0,Math.min(3,draft.help)):0;
  next.draft.answered=draft.answered===true;
  next.draft.consonant=consonants.some(c=>c.id===draft.consonant)?draft.consonant:'';
  next.draft.vowel=vowels.some(v=>v.id===draft.vowel)?draft.vowel:'';
  next.draft.parts=Array.isArray(draft.parts)?draft.parts.filter(v=>typeof v==='string'&&v.length<=8).slice(0,3):[];
  next.draft.strokes=Array.isArray(draft.strokes)?draft.strokes.slice(0,100).filter(Array.isArray).map(line=>line.slice(0,1200).filter(p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)).map(([x,y])=>[Math.max(0,Math.min(440,x)),Math.max(0,Math.min(300,y))])):[];
 }
 return next;
}
export function loadProgress(storage) {
 try {const raw=storage.getItem(STORAGE_KEY);return {progress:raw?parseProgress(raw):freshProgress(),warning:''};}
 catch{return {progress:freshProgress(),warning:'อ่านจุดฝึกเดิมไม่ได้ เริ่มใหม่ให้แล้ว'};}
}
export function saveProgress(storage,value){storage.setItem(STORAGE_KEY,JSON.stringify(value));}
export function resetProgress(storage,settings){const next=freshProgress(settings);saveProgress(storage,next);return next;}
export function markComplete(progress,key){return {...progress,done:validKeys.has(key)?[...new Set([...progress.done,key])]:progress.done,draft:{...progress.draft,answered:true}};}
export function lessonStatus(done,kind,id){
 const list=kind==='consonants'?consonantActivities:vowelActivities;
 const count=list.filter(a=>done.includes(activityKey(kind,id,a.id))).length;
 return count===list.length?'complete':count?'started':'new';
}
