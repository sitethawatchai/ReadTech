import test from 'node:test';
import assert from 'node:assert/strict';
import { consonants,vowels,consonantActivities,vowelActivities,blendSequence,combine,blendParts,optionsFor } from '../src/curriculum.mjs';
test('approved consonant and vowel tables and activity order are exact',()=>{
 assert.equal(consonants.map(c=>c.letter).join(''),'กขตนบผพมงรลชสฟอฮ');
 assert.deepEqual(vowels.map(v=>v.name),['อะ','อา','อิ','อี','อึ','อือ','อุ','อู','เอะ','เอ','แอะ','แอ','โอะ','โอ','เอาะ','ออ','เออะ','เออ']);
 assert.deepEqual(consonantActivities.map(a=>a.id),['intro','look','shape','initial','listen','write']);
 assert.deepEqual(vowelActivities.map(a=>a.id),['intro','listen','write']);
});
test('easy course is 128 unique pairs: eight vowels per consonant, ending at uu',()=>{
 const pairs=blendSequence('easy');assert.equal(pairs.length,128);assert.equal(new Set(pairs.map(p=>p.id)).size,128);
 assert.deepEqual(pairs.slice(0,9).map(p=>p.word),['กะ','กา','กิ','กี','กึ','กือ','กุ','กู','ขะ']);
 assert.equal(pairs.at(-1).word,'ฮู');
 for(let i=0;i<16;i++)assert.deepEqual(pairs.slice(i*8,i*8+8).map(p=>p.v.name),vowels.slice(0,8).map(v=>v.name));
});
test('missing-part and ordering retain all 18 vowels and correctly position Thai glyphs',()=>{
 for(const mode of ['missing','order'])assert.equal(blendSequence(mode).length,288);
 const c=consonants[0],find=name=>vowels.find(v=>v.name===name);
 for(const [name,word,parts] of [['อือ','กือ',['ก','ือ']],['เอ','เก',['เ','ก']],['เอาะ','เกาะ',['เ','ก','าะ']],['เออะ','เกอะ',['เ','ก','อะ']],['อู','กู',['ก','ู']]]){
  assert.equal(combine(c,find(name)),word);assert.deepEqual(blendParts(c,find(name)),parts);
 }
 assert.deepEqual(blendParts(consonants.find(c=>c.id==='อ'),find('ออ')),['อ','อ']);
});
test('answer options have one target and multiple distinct choices in stable varied positions',()=>{
 for(let n=0;n<8;n++){const opts=optionsFor('ก',['ก','ข','ข','ต'],n);assert.equal(opts.filter(v=>v==='ก').length,1);assert.equal(new Set(opts).size,3);assert.deepEqual(opts,optionsFor('ก',['ก','ข','ข','ต'],n));}
});
