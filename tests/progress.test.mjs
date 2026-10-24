import test from 'node:test';
import assert from 'node:assert/strict';
import {STORAGE_KEY,freshProgress,emptyDraft,parseProgress,loadProgress,saveProgress,resetProgress,markComplete,lessonStatus} from '../src/localProgress.mjs';
function memory(){const data=new Map();return {getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value),data};}
test('unfinished writing and lesson selection survive reopening without saving scores or identities',()=>{
 const store=memory(),p=freshProgress();Object.assign(p,{tab:'vowels',selection:{kind:'vowels',id:'uee'},activity:2,draft:{...emptyDraft(),strokes:[[[10,20],[30,40]]],help:1}});
 saveProgress(store,p);const loaded=loadProgress(store).progress;assert.deepEqual(loaded,p);
 for(const banned of ['score','points','stars','student','teacher','password'])assert.equal(JSON.stringify(p).includes('"'+banned+'"'),false);
});
test('last home tab and active practice can differ; reload preserves both',()=>{
 const p=freshProgress();p.tab='vowels';p.selection={kind:'consonants',id:'ก'};p.activity=4;
 const restored=parseProgress(JSON.stringify(p));assert.equal(restored.tab,'vowels');assert.equal(restored.selection.id,'ก');assert.equal(restored.activity,4);
});
test('completion is idempotent and lesson completion requires every activity',()=>{
 let p=freshProgress();for(const a of ['intro','look','shape','initial','listen'])p=markComplete(p,'consonants/ก/'+a);
 assert.equal(lessonStatus(p.done,'consonants','ก'),'started');p=markComplete(p,'consonants/ก/write');p=markComplete(p,'consonants/ก/write');assert.equal(p.done.length,6);assert.equal(lessonStatus(p.done,'consonants','ก'),'complete');assert.equal(lessonStatus(p.done,'consonants','ข'),'new');
 assert.equal(markComplete(p,'invalid').done.length,6);
});
test('reset clears only this app progress, preserves classroom settings and other app data',()=>{
 const store=memory();store.setItem('readup-original','keep');const p=markComplete(freshProgress(),'consonants/ก/intro');p.settings.calm=true;saveProgress(store,p);const reset=resetProgress(store,p.settings);
 assert.deepEqual(reset.done,[]);assert.equal(reset.selection,null);assert.equal(reset.activity,null);assert.equal(reset.settings.calm,true);assert.equal(store.getItem('readup-original'),'keep');assert.deepEqual(JSON.parse(store.getItem(STORAGE_KEY)),reset);
});
test('corrupt or blocked storage falls back safely and malformed saved coordinates are bounded',()=>{
 const store=memory();store.setItem(STORAGE_KEY,'broken');assert.equal(loadProgress(store).progress.selection,null);assert.ok(loadProgress(store).warning);
 const p=freshProgress();p.selection={kind:'consonants',id:'ก'};p.activity=5;p.done=['bad','consonants/ก/intro','consonants/ก/intro'];p.draft.strokes=[[[999,-1],[20,30],[null,40]]];
 const restored=parseProgress(JSON.stringify(p));assert.deepEqual(restored.done,['consonants/ก/intro']);assert.deepEqual(restored.draft.strokes,[[[440,0],[20,30]]]);
 p.selection={kind:'consonants',id:'missing'};assert.equal(parseProgress(JSON.stringify(p)).selection,null);
 const denied={getItem(){throw Error('blocked');}};assert.deepEqual(loadProgress(denied).progress,freshProgress());
});
