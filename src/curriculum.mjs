export const consonants = [
 ['ก','ไก่','กอ','chicken','ถ'],['ข','ไข่','ขอ','egg','ช'],['ต','เต่า','ตอ','turtle','ด'],['น','หนู','นอ','mouse','ม'],
 ['บ','ใบไม้','บอ','leaf','ป'],['ผ','ผึ้ง','ผอ','bee','ฝ'],['พ','พาน','พอ','tray','ฟ'],['ม','ม้า','มอ','horse','น'],
 ['ง','งู','งอ','snake','จ'],['ร','เรือ','รอ','boat','ล'],['ล','ลิง','ลอ','monkey','ร'],['ช','ช้าง','ชอ','elephant','ซ'],
 ['ส','เสือ','สอ','tiger','ศ'],['ฟ','ฟัน','ฟอ','tooth','พ'],['อ','อ่าง','ออ','basin','ฮ'],['ฮ','นกฮูก','ฮอ','owl','อ']
].map(([letter,word,sound,art,similar],i)=>({id:letter,letter,word,sound,speech:`${sound} ${word}`,art,similar,number:i+1}));

export const vowels = [
 ['a','อะ','','ะ','–ะ'],['aa','อา','','า','–า'],['i','อิ','','ิ','–ิ'],['ii','อี','','ี','–ี'],
 ['ue','อึ','','ึ','–ึ'],['uee','อือ','','ือ','–ือ'],['u','อุ','','ุ','–ุ'],['uu','อู','','ู','–ู'],
 ['e','เอะ','เ','ะ','เ–ะ'],['ee','เอ','เ','','เ–'],['ae','แอะ','แ','ะ','แ–ะ'],['aee','แอ','แ','','แ–'],
 ['o','โอะ','โ','ะ','โ–ะ'],['oo','โอ','โ','','โ–'],['aw','เอาะ','เ','าะ','เ–าะ'],['aww','ออ','','อ','–อ'],
 ['oe','เออะ','เ','อะ','เ–อะ'],['oee','เออ','เ','อ','เ–อ']
].map(([id,name,before,after,form],i)=>({id,name,before,after,form,number:i+1}));

export const consonantActivities=[
 {id:'intro',title:'รู้จักกันก่อน',icon:'heart'}, {id:'look',title:'ดูและฟัง',icon:'book'},
 {id:'shape',title:'แยกตัวที่คล้ายกัน',icon:'letters'}, {id:'initial',title:'ภาพกับพยัญชนะต้น',icon:'leaf'},
 {id:'listen',title:'ฟังแล้วเลือก',icon:'sound'}, {id:'write',title:'เขียน',icon:'pencil'}
];
export const vowelActivities=[
 {id:'intro',title:'รู้จักกันก่อน',icon:'heart'}, {id:'listen',title:'ฟังแล้วเลือก',icon:'sound'}, {id:'write',title:'เขียน',icon:'pencil'}
];
export const blendModes=[
 {id:'easy',title:'ประสมคำง่าย',icon:'puzzle',description:'ค่อย ๆ ผสมเสียง ถึงสระอู'},
 {id:'missing',title:'เติมส่วนที่หาย',icon:'help',description:'เติมพยัญชนะหรือสระ'},
 {id:'order',title:'เรียงรูปคำ',icon:'letters',description:'เรียงให้เป็นรูปคำ'}
];
export function blendParts(consonant,vowel) { return [vowel.before,consonant.letter,vowel.after].filter(Boolean); }
export function combine(consonant,vowel) { return blendParts(consonant,vowel).join(''); }
export function blendSequence(mode) {
 return consonants.flatMap(c=>(mode==='easy'?vowels.slice(0,8):vowels).map(v=>({id:c.id+':'+v.id,c,v,word:combine(c,v)})));
}
export function getSelection(selection) {
 if(!selection)return null;
 if(selection.kind==='consonants')return consonants.find(c=>c.id===selection.id)??null;
 if(selection.kind==='vowels')return vowels.find(v=>v.id===selection.id)??null;
 return null;
}
export function selectionTitle(selection) {
 const item=getSelection(selection);
 return item?('letter' in item?item.letter+' '+item.word:'สระ'+item.name):'';
}
export function activityKey(kind,id,activity) { return `${kind}/${id}/${activity}`; }
export function visiblePart(value) { return /^[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/u.test(value)?'–'+value:value; }

// Stable options keep the target in different positions without moving on retry.
export function optionsFor(target,values,seed=0) {
 const others=[...new Set(values)].filter(v=>v!==target).slice(0,2);
 const options=[target,...others]; const shift=Math.abs(seed)%options.length;
 return [...options.slice(shift),...options.slice(0,shift)];
}
