import {test,expect,type Page} from '@playwright/test';
import {createRequire} from 'node:module';
import {consonants,vowels,blendParts} from '../../src/curriculum.mjs';
const require=createRequire(import.meta.url);
const key='readtech-open-progress-v1';
test.beforeEach(async({page})=>{
 await page.addInitScript(()=>{
  (window as any).__spoken=[];(window as any).SpeechSynthesisUtterance=class {constructor(public text:string){}};
  window.speechSynthesis.getVoices=()=>[{voiceURI:'premwadee',name:'Microsoft เปรมวดี',lang:'th-TH',default:true,localService:false}] as SpeechSynthesisVoice[];
  window.speechSynthesis.speak=u=>{(window as any).__spoken.push(u.text);};window.speechSynthesis.cancel=()=>{};
 });
});
async function home(page:Page){await page.getByRole('button',{name:'ReadTech กลับหน้าแรก',exact:true}).click();}
async function popupNext(page:Page){await page.getByRole('dialog',{name:'ทำได้แล้ว!',exact:true}).getByRole('button',{name:'ไปต่อ',exact:true}).click();}
async function stored(page:Page){return page.evaluate(key=>JSON.parse(localStorage.getItem(key)!),key);}
async function seed(page:Page,value:unknown){await page.goto('./');await page.evaluate(({key,value})=>localStorage.setItem(key,JSON.stringify(value)),{key,value});await page.reload();await page.getByRole('button',{name:/ฝึกต่อจากเดิม/}).click();}
function progress(tab:string,id:string,activity:number,mode='easy'){return {version:1,tab,mode,selection:{kind:tab,id},activity,done:[],draft:{help:0,answered:false,consonant:'',vowel:'',parts:[],strokes:[]},settings:{largeText:false,sound:true,effectsSound:true,calm:false,voiceURI:'',speechRate:.85}};}

test('home has only the approved tables, no account flow or database traffic',async({page})=>{
 const backend:string[]=[];page.on('request',r=>{if(/supabase|auth\/v1|rest\/v1|cloud-config/.test(r.url()))backend.push(r.url());});
 await page.goto('./');await expect(page.getByRole('heading',{name:'บทเรียนของฉัน.',exact:true})).toBeVisible();await expect(page.getByRole('tab')).toHaveCount(3);await expect(page.locator('.consonant-grid button')).toHaveCount(16);
 expect(await page.locator('.character-letter').allTextContents()).toEqual(consonants.map(c=>c.letter));await expect(page.getByText(/เข้าสู่ระบบ|บัญชีครู|LEVEL|คะแนน|สะสมดาว/)).toHaveCount(0);
 await page.getByRole('tab',{name:'สระ',exact:true}).click();await expect(page.locator('.vowel-grid button')).toHaveCount(18);expect(await page.locator('.vowel-card .character-name').allTextContents()).toEqual(vowels.map(v=>v.name));
 await page.getByRole('tab',{name:'ผสมคำ',exact:true}).click();await expect(page.locator('.blend-character-grid button')).toHaveCount(16);await expect(page.locator('.word-button')).toHaveCount(0);await expect(page.locator('.mode-card')).toHaveCount(0);
 for(const c of consonants){await page.getByRole('button',{name:'ผสมคำกับ '+c.letter+' '+c.word,exact:true}).click();await expect(page.getByRole('heading',{name:c.letter+' '+c.word,exact:true})).toBeVisible();await expect(page.locator('.blend-activities .activity-card')).toHaveCount(3);await expect(page.locator('.word-button')).toHaveCount(0);await expect(page.locator('.blend-workspace')).toHaveCount(0);await page.getByRole('button',{name:'เปิดกิจกรรม 1 ประสมคำง่าย',exact:true}).click();await expect(page.getByLabel('ตัวอย่าง '+c.letter+'ะ',{exact:true})).toBeVisible();await expect(page.locator('.blend-target')).toHaveCount(1);await page.getByRole('button',{name:'กลับผสมคำ',exact:true}).click();await page.getByRole('button',{name:'กลับเลือกพยัญชนะผสมคำ',exact:true}).click();}
 await page.getByRole('button',{name:'ผสมคำกับ ก ไก่',exact:true}).click();await page.getByRole('button',{name:'เปิดกิจกรรม 2 เติมส่วนที่หาย',exact:true}).click();await expect(page.getByRole('heading',{name:'เติมส่วนที่หาย',exact:true})).toBeVisible();await page.getByRole('button',{name:'กลับผสมคำ',exact:true}).click();await page.getByRole('button',{name:'เปิดกิจกรรม 3 เรียงรูปคำ',exact:true}).click();await expect(page.getByRole('heading',{name:'เรียงรูปคำ',exact:true})).toBeVisible();expect(backend).toEqual([]);
});

test('every consonant keeps its own six activities and feedback, with no scoring',async({page})=>{
 test.setTimeout(120000);await page.goto('./');
 for(const c of consonants){
  await home(page);await page.getByRole('tab',{name:'พยัญชนะ',exact:true}).click();await page.getByRole('button',{name:new RegExp('^ฝึก '+c.letter+' '+c.word)}).click();await expect(page.locator('.activity-card')).toHaveCount(6);
  await page.getByRole('button',{name:'เปิดกิจกรรม 1 รู้จักกันก่อน',exact:true}).click();await expect(page.locator('.giant-glyph')).toHaveText(c.letter);await expect(page.locator('.animated-picture').getByRole('img',{name:c.word,exact:true})).toBeVisible();
  await page.getByRole('button',{name:'ฟังเสียง',exact:true}).click();expect(await page.evaluate(()=>(window as any).__spoken.at(-1))).toBe(c.speech);await page.getByRole('button',{name:'ไปต่อ',exact:true}).click();
  for(const name of ['ดูและฟัง','แยกตัวที่คล้ายกัน','ภาพกับพยัญชนะต้น','ฟังแล้วเลือก']){await expect(page.getByRole('heading',{name,exact:true})).toBeVisible();await page.getByRole('button',{name:'เลือก '+c.letter,exact:true}).click();await expect(page.getByRole('dialog',{name:'ทำได้แล้ว!',exact:true})).toBeVisible();await expect(page.getByText(/ได้ 1 ดาว|คะแนน/)).toHaveCount(0);await popupNext(page);}
  await expect(page.getByRole('heading',{name:'เขียน',exact:true})).toBeVisible();await page.getByRole('button',{name:'เสร็จแล้ว',exact:true}).click();await page.getByRole('dialog',{name:'ฝึกเขียนเสร็จแล้ว!',exact:true}).getByRole('button',{name:'ไปต่อ',exact:true}).click();await expect(page.locator('.complete-badge')).toHaveText('ทำครบแล้ว');
 }
 const data=await stored(page);expect(data.done).toHaveLength(96);expect(Object.keys(data)).not.toContain('score');expect(Object.keys(data)).not.toContain('stars');
});

test('all 18 vowels offer intro, listening and writing only',async({page})=>{
 test.setTimeout(90000);await page.goto('./');
 for(const v of vowels){await home(page);await page.getByRole('tab',{name:'สระ',exact:true}).click();await page.getByRole('button',{name:new RegExp('^ฝึกสระ '+v.name+'(?: |$)')}).click();await expect(page.locator('.activity-card')).toHaveCount(3);await page.getByRole('button',{name:'เปิดกิจกรรม 1 รู้จักกันก่อน',exact:true}).click();await expect(page.locator('.giant-glyph')).toHaveAttribute('aria-label','สระ '+v.name);await page.getByRole('button',{name:'ฟังเสียง',exact:true}).click();expect(await page.evaluate(()=>(window as any).__spoken.at(-1))).toBe('สระ '+v.name);await page.getByRole('button',{name:'ไปต่อ',exact:true}).click();await page.getByRole('button',{name:'เลือก '+v.name,exact:true}).click();await popupNext(page);await expect(page.locator('.writing-model')).toHaveAttribute('data-glyph',v.form);await page.getByRole('button',{name:'เสร็จแล้ว',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'ไปต่อ',exact:true}).click();}
 expect((await stored(page)).done).toHaveLength(54);
});

test('wrong answers retry without losing help; writing survives reload, supports undo and reset is isolated',async({page})=>{
 await page.goto('./');await page.evaluate(()=>localStorage.setItem('readup-original','unchanged'));
 await page.getByRole('button',{name:'ฝึก ก ไก่',exact:true}).click();await page.getByRole('button',{name:'เปิดกิจกรรม 2 ดูและฟัง',exact:true}).click();
 await page.getByRole('button',{name:'เลือก ข',exact:true}).click();await expect(page.getByRole('dialog',{name:'ลองใหม่อีกทีนะ',exact:true})).toBeVisible();await expect(page.getByRole('img',{name:'ยังตอบไม่ถูก ลองใหม่ได้',exact:true})).toBeVisible();await page.screenshot({path:'test-results/readtech-retry-mobile.png',fullPage:true});await page.getByRole('button',{name:'ขอตัวช่วย',exact:true}).click();await expect(page.locator('.hint-box')).toHaveText('มองหาตัว ก');await page.getByRole('button',{name:'เลือก ก',exact:true}).click();await popupNext(page);
 await page.getByRole('button',{name:'กลับกิจกรรม',exact:true}).click();await page.getByRole('button',{name:'เปิดกิจกรรม 6 เขียน',exact:true}).click();
 const pad=page.locator('.writing-pad'),r=(await pad.boundingBox())!;await page.mouse.move(r.x+r.width*.4,r.y+r.height*.3);await page.mouse.down();await page.mouse.move(r.x+r.width*.6,r.y+r.height*.6,{steps:8});await page.mouse.up();await expect(pad.locator('polyline')).toHaveCount(1);const original=(await stored(page)).draft.strokes;
 await page.reload();await page.getByRole('button',{name:/ฝึกต่อจากเดิม/}).click();await expect(pad.locator('polyline')).toHaveCount(1);expect((await stored(page)).draft.strokes).toEqual(original);
 await page.getByRole('button',{name:'ย้อนเส้นล่าสุด',exact:true}).click();await expect(pad.locator('polyline')).toHaveCount(0);await pad.focus();await page.keyboard.down('Shift');await page.keyboard.press('ArrowRight');await page.keyboard.up('Shift');await expect(pad.locator('polyline')).toHaveCount(1);await page.getByRole('button',{name:'ล้างเพื่อเขียนใหม่',exact:true}).click();await expect(pad.locator('polyline')).toHaveCount(0);
 await page.getByRole('button',{name:'เริ่มใหม่',exact:true}).click();await page.getByRole('button',{name:'ยกเลิก',exact:true}).click();await expect(page.getByRole('heading',{name:'เขียน',exact:true})).toBeVisible();expect((await stored(page)).done).toContain('consonants/ก/look');
 await page.getByRole('button',{name:'เริ่มใหม่',exact:true}).click();await page.getByRole('button',{name:'ยืนยันเริ่มใหม่',exact:true}).click();expect((await stored(page)).done).toEqual([]);expect((await stored(page)).selection).toBeNull();expect(await page.evaluate(()=>localStorage.getItem('readup-original'))).toBe('unchanged');await page.reload();await expect(page.getByRole('button',{name:/ฝึกต่อจากเดิม/})).toHaveCount(0);
});

test('easy blends validate actual chosen parts, resume drafts, and advance from กู to ขะ',async({page})=>{
 await seed(page,progress('blend','ก:a',0));await page.getByRole('button',{name:'เลือกพยัญชนะ ข',exact:true}).click();await page.getByRole('button',{name:'เลือกสระ อะ',exact:true}).click();await expect(page.getByLabel('คำที่สร้าง',{exact:true})).toHaveText('ขะ');await page.getByRole('button',{name:'ตรวจคำที่สร้าง',exact:true}).click();await page.getByRole('button',{name:'ลองใหม่',exact:true}).click();
 await page.getByRole('button',{name:'เลือกพยัญชนะ ก',exact:true}).click();await page.reload();await page.getByRole('button',{name:/ฝึกต่อจากเดิม/}).click();await expect(page.getByRole('button',{name:'เลือกพยัญชนะ ก',exact:true})).toHaveAttribute('aria-pressed','true');await page.getByRole('button',{name:'เลือกสระ อะ',exact:true}).click();await page.getByRole('button',{name:'ตรวจคำที่สร้าง',exact:true}).click();await popupNext(page);expect((await stored(page)).selection.id).toBe('ก:aa');
 await seed(page,progress('blend','ก:uu',0));await page.getByRole('button',{name:'เลือกพยัญชนะ ก',exact:true}).click();await page.getByRole('button',{name:'เลือกสระ อู',exact:true}).click();await page.getByRole('button',{name:'ตรวจคำที่สร้าง',exact:true}).click();await popupNext(page);expect((await stored(page)).selection.id).toBe('ข:a');
 await seed(page,progress('blend','ฮ:uu',0));await page.getByRole('button',{name:'เลือกพยัญชนะ ฮ',exact:true}).click();await page.getByRole('button',{name:'เลือกสระ อู',exact:true}).click();await page.getByRole('button',{name:'ตรวจคำที่สร้าง',exact:true}).click();await popupNext(page);await expect(page.getByRole('dialog',{name:'ฝึกครบชุดแล้ว!',exact:true})).toBeVisible();
});

test('missing vowels and consonants stay fixed; ordering supports preposed and repeated letters',async({page})=>{
 for(const id of ['ก:a','ก:aa']){await seed(page,progress('blend',id,0,'missing'));const vowelMissing=id==='ก:a';await expect(page.getByRole('button',{name:/เลือกพยัญชนะ /})).toHaveCount(vowelMissing?0:3);await expect(page.getByRole('button',{name:/เลือกสระ /})).toHaveCount(vowelMissing?3:0);await page.getByRole('button',{name:vowelMissing?'เลือกสระ อะ':'เลือกพยัญชนะ ก',exact:true}).click();await page.getByRole('button',{name:'ตรวจคำที่สร้าง',exact:true}).click();await expect(page.getByRole('dialog',{name:'ทำได้แล้ว!',exact:true})).toBeVisible();}
 for(const [cId,vId] of [['ก','aw'],['ก','uee'],['อ','aww']]){await seed(page,progress('blend',cId+':'+vId,0,'order'));const c=consonants.find(c=>c.id===cId)!,v=vowels.find(v=>v.id===vId)!;if(vId==='uee'){await page.getByRole('button',{name:'เพิ่มส่วน –ือ',exact:true}).click();await expect(page.getByLabel('คำที่เรียง',{exact:true}).locator('.blend-glyph-svg')).toBeVisible();await page.getByRole('button',{name:'เรียงใหม่',exact:true}).click();}for(const part of blendParts(c,v)){const value=/^[\u0E34-\u0E3A]/u.test(part)?'–'+part:part;await page.getByRole('button',{name:'เพิ่มส่วน '+value,exact:true}).filter({visible:true}).all().then(async buttons=>{for(const b of buttons)if(await b.isEnabled()){await b.click();break;}});}await page.getByRole('button',{name:'ตรวจคำที่เรียง',exact:true}).click();await expect(page.getByRole('dialog',{name:'ทำได้แล้ว!',exact:true})).toBeVisible();}
});

test('keyboard navigation, calm mode and enlarged mobile layouts are accessible',async({page})=>{
 await page.goto('./');await page.getByRole('tab',{name:'พยัญชนะ',exact:true}).focus();await page.keyboard.press('ArrowRight');await expect(page.getByRole('tab',{name:'สระ',exact:true})).toHaveAttribute('aria-selected','true');await page.keyboard.press('Home');
 await page.getByRole('button',{name:'ปรับการใช้งาน',exact:true}).click();await page.getByRole('checkbox',{name:'ตัวหนังสือใหญ่ขึ้น',exact:true}).check();await page.getByRole('checkbox',{name:'โหมดสงบ · หยุดภาพขยับ',exact:true}).check();await page.getByRole('button',{name:'เรียบร้อย',exact:true}).click();
 for(const width of [1440,768,390,320]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'test-results/readtech-home-desktop.png',fullPage:true});await page.setViewportSize({width:390,height:844});await page.screenshot({path:'test-results/readtech-home-mobile.png',fullPage:true});
 await page.getByRole('button',{name:'ฝึก ก ไก่',exact:true}).click();await page.getByRole('button',{name:'เปิดกิจกรรม 1 รู้จักกันก่อน',exact:true}).click();expect(await page.locator('.animated-picture svg').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
 for(const width of [390,320]){await page.setViewportSize({width,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});const check=()=>page.evaluate(async()=>(await (window as any).axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map((v:any)=>({id:v.id,targets:v.nodes.map((n:any)=>n.target)})));
 expect(await check()).toEqual([]);await page.getByRole('button',{name:'ไปต่อ',exact:true}).click();expect(await check()).toEqual([]);await page.getByRole('button',{name:'เลือก ก',exact:true}).click();expect(await check()).toEqual([]);
 await page.getByRole('button',{name:'ปิดหน้าต่าง',exact:true}).click();await home(page);expect(await check()).toEqual([]);
 await page.getByRole('tab',{name:'สระ',exact:true}).click();await page.screenshot({path:'test-results/readtech-vowels-mobile.png',fullPage:true});expect(await check()).toEqual([]);
 await page.getByRole('button',{name:'ฝึกสระ อือ',exact:true}).click();await page.getByRole('button',{name:'เปิดกิจกรรม 3 เขียน',exact:true}).click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:'test-results/readtech-writing-mobile.png',fullPage:true});expect(await check()).toEqual([]);
});


test('blend activity rows open one word at a time and preserve drafts on back and reload',async({page})=>{
 await page.goto('./');await page.getByRole('tab',{name:'ผสมคำ',exact:true}).click();await page.setViewportSize({width:390,height:844});
 await page.getByRole('button',{name:'ผสมคำกับ ข ไข่',exact:true}).focus();await page.keyboard.press('Enter');await expect(page.locator('.activity-card')).toHaveCount(3);await expect(page.locator('.word-button')).toHaveCount(0);
 const cards=await page.locator('.activity-card').all();const rows=await Promise.all(cards.map(card=>card.boundingBox()));expect(rows[1]!.y).toBeGreaterThan(rows[0]!.y+rows[0]!.height);expect(rows[2]!.y).toBeGreaterThan(rows[1]!.y+rows[1]!.height);
 await page.getByRole('button',{name:'เปิดกิจกรรม 1 ประสมคำง่าย',exact:true}).click();await expect(page.getByLabel('ตัวอย่าง ขะ',{exact:true})).toBeVisible();await page.getByRole('button',{name:'เลือกพยัญชนะ ข',exact:true}).click();await page.getByRole('button',{name:'เลือกสระ อะ',exact:true}).click();await page.getByRole('button',{name:'ตรวจคำที่สร้าง',exact:true}).click();await popupNext(page);await expect(page.getByLabel('ตัวอย่าง ขา',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'เลือกพยัญชนะ ข',exact:true}).click();await page.getByRole('button',{name:'กลับผสมคำ',exact:true}).click();await expect(page.getByRole('heading',{name:'ข ไข่',exact:true})).toBeVisible();await page.getByRole('button',{name:'เปิดกิจกรรม 1 ประสมคำง่าย',exact:true}).click();await expect(page.getByLabel('ตัวอย่าง ขา',{exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'เลือกพยัญชนะ ข',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.reload();await page.getByRole('button',{name:/ฝึกต่อจากเดิม/}).click();await expect(page.getByLabel('ตัวอย่าง ขา',{exact:true})).toBeVisible();await page.getByRole('button',{name:'กลับผสมคำ',exact:true}).click();
 for(const width of [390,320]){await page.setViewportSize({width,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 await page.screenshot({path:'test-results/readtech-blend-activity-rows-mobile.png',fullPage:true});await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});expect(await page.evaluate(async()=>(await (window as any).axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map((v:any)=>v.id))).toEqual([]);
 await page.getByRole('button',{name:'กลับเลือกพยัญชนะผสมคำ',exact:true}).click();await expect(page.locator('.blend-character-grid button')).toHaveCount(16);
});


test('intro pictures visibly move and respect reduced motion',async({page})=>{
 await page.setViewportSize({width:320,height:844});await page.goto('./');await page.getByRole('button',{name:'ฝึก ก ไก่',exact:true}).click();await page.getByRole('button',{name:'เปิดกิจกรรม 1 รู้จักกันก่อน',exact:true}).click();
 const picture=page.locator('.animated-picture svg');await expect(picture).toHaveCSS('animation-name','picture-sway');
 const transforms=await picture.evaluate(async el=>{const animation=el.getAnimations()[0];animation.pause();return [0,560,1680].map(time=>{animation.currentTime=time;return getComputedStyle(el).transform;});});expect(new Set(transforms).size).toBe(3);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:'test-results/readtech-intro-motion-mobile.png',fullPage:true});await page.emulateMedia({reducedMotion:'reduce'});await expect(picture).toHaveCSS('animation-name','none');
});

test('all writing lessons have enlarged models and direction arrows; only consonants show pictures',async({page})=>{
 test.setTimeout(90000);
 for(const c of consonants){await seed(page,progress('consonants',c.id,5));await expect(page.locator('.writing-directions')).toHaveCount(1);expect(await page.locator('.writing-directions path[marker-end]').count()).toBeGreaterThan(0);await expect(page.locator('.writing-frame .writing-picture').getByRole('img',{name:c.word,exact:true})).toBeVisible();await expect(page.locator('.writing-model .writing-outline')).toHaveCount(1);await page.locator('.writing-pad').screenshot({path:'test-results/guide-consonant-'+c.number+'.png'});}
 await seed(page,progress('consonants','ก',5));await page.setViewportSize({width:390,height:950});await page.screenshot({path:'test-results/readtech-writing-consonant-arrows.png',fullPage:true});
 await page.getByRole('button',{name:'ซ่อนลูกศร',exact:true}).click();await expect(page.locator('.writing-directions')).toHaveCount(0);await page.getByRole('button',{name:'แสดงลูกศร',exact:true}).click();await expect(page.locator('.writing-directions')).toHaveCount(1);
 for(const v of vowels){await seed(page,progress('vowels',v.id,2));await expect(page.locator('.writing-directions')).toHaveCount(1);expect(await page.locator('.writing-directions path[marker-end]').count()).toBeGreaterThan(0);await expect(page.locator('.writing-picture')).toHaveCount(0);if(/[ิีึืุู]/u.test(v.form)){const bounds=await page.locator('.writing-model').evaluate((el:SVGGElement)=>{const b=el.getBoundingClientRect(),pad=el.closest('svg')!.getBoundingClientRect();return {top:(b.y-pad.y)/pad.height*300,bottom:(b.bottom-pad.y)/pad.height*300};});expect(bounds.top).toBeGreaterThan(8);expect(bounds.bottom).toBeLessThan(300);}await page.locator('.writing-pad').screenshot({path:'test-results/guide-vowel-'+v.number+'.png'});}
 await seed(page,progress('vowels','aw',2));await page.screenshot({path:'test-results/readtech-writing-vowel-arrows.png',fullPage:true});
 for(const width of [390,320]){await page.setViewportSize({width,height:950});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
});


test('blend chapter headings and large characters fit mobile, and writing starts follow Thai direction',async({page})=>{
 await page.goto('./');await page.getByRole('tab',{name:'ผสมคำ',exact:true}).click();await page.getByRole('button',{name:'ผสมคำกับ ก ไก่',exact:true}).click();await expect(page.getByText('บทที่ 1 · 3 กิจกรรม',{exact:true})).toBeVisible();
 await page.setViewportSize({width:390,height:900});await expect(page.locator('.blend-activities .activity-card')).toHaveCount(3);await page.getByRole('button',{name:'เปิดกิจกรรม 1 ประสมคำง่าย',exact:true}).click();await expect(page.getByRole('button',{name:'เลือกพยัญชนะ ก',exact:true})).toHaveCSS('font-size','48px');
 for(const width of [1440,390,320]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 await page.screenshot({path:'test-results/readtech-blend-large-practice.png',fullPage:true});
 await seed(page,progress('consonants','ก',5));const up=await page.locator('.writing-route').first().evaluate((el:SVGPathElement)=>{const start=el.getPointAtLength(0),next=el.getPointAtLength(80);return next.y>start.y;});expect(up).toBe(true);await expect(page.locator('.writing-start-label')).toHaveText('1');
 await seed(page,progress('consonants','ส',5));await expect(page.locator('.writing-start-label')).toHaveText(['1','2']);
 await seed(page,progress('vowels','ee',2));const headUp=await page.locator('.writing-route').first().evaluate((el:SVGPathElement)=>{const length=el.getTotalLength(),before=el.getPointAtLength(length-100),end=el.getPointAtLength(length);return end.y>before.y+95&&Math.abs(end.x-before.x)<2;});expect(headUp).toBe(true);await expect(page.locator('.writing-start-label')).toHaveText('1');
 await seed(page,progress('vowels','uee',2));await expect(page.locator('.writing-start-label')).toHaveText(['1','2','3','4']);
});


test('writing picture is inside the frame without covering the drawing surface',async({page})=>{
 await page.setViewportSize({width:390,height:1000});await seed(page,progress('consonants','ก',5));await expect(page.locator('.writing-frame .writing-picture').getByRole('img',{name:'ไก่',exact:true})).toBeVisible();
 const frame=(await page.locator('.writing-frame').boundingBox())!,picture=(await page.locator('.writing-picture').boundingBox())!,pad=(await page.locator('.writing-pad').boundingBox())!;
 expect(picture.y).toBeGreaterThan(frame.y);expect(picture.y+picture.height).toBeLessThanOrEqual(pad.y+1);expect(pad.y+pad.height).toBeLessThanOrEqual(frame.y+frame.height);
 await page.mouse.move(pad.x+pad.width*.4,pad.y+pad.height*.3);await page.mouse.down();await page.mouse.move(pad.x+pad.width*.6,pad.y+pad.height*.6,{steps:8});await page.mouse.up();await expect(page.locator('.writing-pad polyline')).toHaveCount(1);await page.screenshot({path:'test-results/readtech-writing-picture-in-frame.png',fullPage:true});
 await seed(page,progress('vowels','a',2));await expect(page.locator('.writing-picture')).toHaveCount(0);await expect(page.locator('.writing-directions')).toHaveCount(1);
});


test('all blend modes use one glyph scale on desktop, mobile and enlarged text',async({page})=>{
 test.setTimeout(90000);
 for(const largeText of [false,true])for(const mode of ['easy','missing','order']){
  const data=progress('blend','ก:uee',0,mode);data.settings.largeText=largeText;await seed(page,data);
  for(const width of [1440,390,320]){
   await page.setViewportSize({width,height:1000});const expected=width===1440?(largeText?72:64):(largeText?56:48);
   const styles=await page.locator('.blend-workspace .blend-glyph').evaluateAll(els=>els.map(el=>({size:parseFloat(getComputedStyle(el).fontSize),weight:getComputedStyle(el).fontWeight})));
   expect(styles.length).toBeGreaterThan(4);expect(styles.every(s=>s.size===expected&&s.weight==='400')).toBe(true);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  if(!largeText){await page.setViewportSize({width:390,height:1000});await page.screenshot({path:'test-results/readtech-uniform-'+mode+'.png',fullPage:true});}
 }
 await seed(page,progress('blend','ก:uee',0,'order'));await page.getByRole('button',{name:'เพิ่มส่วน –ือ',exact:true}).click();await page.getByRole('button',{name:'เพิ่มส่วน ก',exact:true}).click();await expect(page.getByLabel('คำที่เรียง',{exact:true}).getByText('ก',{exact:true})).toBeVisible();
 await seed(page,progress('blend','ฟ:aw',0,'missing'));await page.setViewportSize({width:320,height:950});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});expect(await page.evaluate(async()=>(await (window as any).axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map((v:any)=>v.id))).toEqual([]);
});

test('wrong answers play a gentle retry cue and respect the effects sound setting',async({page})=>{
 await page.addInitScript(()=>{
  (window as any).__feedbackNotes=[];
  const parameter=()=>({setValueAtTime:(value:number)=>{(window as any).__feedbackNotes.push(value);},exponentialRampToValueAtTime:()=>{},linearRampToValueAtTime:()=>{},cancelScheduledValues:()=>{}});
  (window as any).AudioContext=class{state='running';currentTime=0;destination={};resume(){return Promise.resolve();}close(){this.state='closed';return Promise.resolve();}createOscillator(){return {type:'sine',frequency:parameter(),connect(){},disconnect(){},start(){},stop(){},onended:null};}createGain(){return {gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){},cancelScheduledValues(){}},connect(){},disconnect(){}};}};
 });
 await seed(page,progress('consonants','ก',1));await page.getByRole('button',{name:'เลือก ข',exact:true}).click();await expect(page.getByRole('dialog',{name:'ลองใหม่อีกทีนะ',exact:true})).toBeVisible();await expect.poll(()=>page.evaluate(()=>(window as any).__feedbackNotes.slice(-2))).toEqual([392,329.63]);
 await page.getByRole('button',{name:'ลองใหม่',exact:true}).click();await page.getByRole('button',{name:'เลือก ก',exact:true}).click();await expect.poll(()=>page.evaluate(()=>(window as any).__feedbackNotes.slice(-4))).toEqual([523.25,659.25,783.99,1046.5]);
 const muted=progress('blend','ก:a',0);muted.settings.effectsSound=false;await seed(page,muted);await page.getByRole('button',{name:'เลือกพยัญชนะ ข',exact:true}).click();await page.getByRole('button',{name:'เลือกสระ อะ',exact:true}).click();await page.getByRole('button',{name:'ตรวจคำที่สร้าง',exact:true}).click();await expect(page.getByRole('dialog',{name:'ลองใหม่อีกทีนะ',exact:true})).toBeVisible();expect(await page.evaluate(()=>(window as any).__feedbackNotes)).toEqual([]);
});


test('writing routes stay inside the actual letter outlines in all 34 lessons',async({page})=>{
 test.setTimeout(90000);
 const cases=[...consonants.map(c=>({kind:'consonants',id:c.id,activity:5})),...vowels.map(v=>({kind:'vowels',id:v.id,activity:2}))];
 for(const item of cases){
  await seed(page,progress(item.kind,item.id,item.activity));
  const issues=await page.locator('.writing-directions').evaluate(root=>{
   const svg=root.closest('svg')!,ctx=document.createElement('canvas').getContext('2d')!,issues:string[]=[];
   for(const group of root.querySelectorAll<SVGGElement>('[data-character]')){
    const char=group.getAttribute('data-character')!,outline=Array.from(svg.querySelectorAll<SVGPathElement>('.writing-model .writing-outline')).find(path=>path.getAttribute('data-character')===char);if(!outline){if(char!=='–')issues.push('missing '+char);continue;}const shape=new Path2D(outline.getAttribute('d')!);
    for(const route of group.querySelectorAll<SVGPathElement>('.writing-route,.writing-arrow')){const length=route.getTotalLength();for(let at=0;at<=length;at+=Math.max(1,length/200)){const p=route.getPointAtLength(at);if(!ctx.isPointInPath(shape,p.x,p.y)){issues.push(char+' '+route.classList.value+' '+Math.round(p.x)+','+Math.round(p.y));break;}}if(route.classList.contains('writing-arrow')){const end=route.getPointAtLength(length),before=route.getPointAtLength(Math.max(0,length-1)),dx=end.x-before.x,dy=end.y-before.y,norm=Math.hypot(dx,dy)||1;for(const [along,across] of [[1.8,0],[-12.6,7.2],[-12.6,-7.2]]){const x=end.x+along*dx/norm-across*dy/norm,y=end.y+along*dy/norm+across*dx/norm;if(!ctx.isPointInPath(shape,x,y))issues.push(char+' arrow head outside');}}}
   }return issues;
  });expect(issues,item.kind+' '+item.id).toEqual([]);
  await page.setViewportSize({width:390,height:950});await page.locator('.writing-pad').screenshot({path:'test-results/corrected-writing-'+item.kind+'-'+item.id+'.png'});
 }
 await seed(page,progress('consonants','ส',5));await expect(page.locator('.writing-model')).toHaveAttribute('data-glyph','ส');await expect(page.locator('.writing-model .writing-outline')).toHaveCount(1);
 await seed(page,progress('vowels','uee',2));await expect(page.locator('.writing-model .writing-outline')).toHaveCount(2);await expect(page.locator('.writing-start-label')).toHaveText(['1','2','3','4']);
});

test('easy mode keeps consonant and vowel choices on the same row at all screen sizes',async({page})=>{
 await seed(page,progress('blend','ก:uee',0));
 for(const width of [1440,390,320]){await page.setViewportSize({width,height:1000});const boxes=await page.locator('.blend-easy .build-choices').all().then(items=>Promise.all(items.map(item=>item.boundingBox())));expect(Math.abs(boxes[0]!.y-boxes[1]!.y)).toBeLessThan(2);expect(boxes[0]!.x+boxes[0]!.width).toBeLessThan(boxes[1]!.x);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 await page.getByRole('button',{name:'เลือกพยัญชนะ ก',exact:true}).click();await page.getByRole('button',{name:'เลือกสระ อือ',exact:true}).click();await page.getByRole('button',{name:'ตรวจคำที่สร้าง',exact:true}).click();await expect(page.getByRole('dialog',{name:'ทำได้แล้ว!',exact:true})).toBeVisible();await page.getByRole('button',{name:'ปิดหน้าต่าง',exact:true}).click();await page.screenshot({path:'test-results/readtech-easy-choices-same-row.png',fullPage:true});
});

test('Thai pen routes turn heads in the correct direction and preserve intentional stroke order',async({page})=>{
 // Signed turn in font coordinates: clockwise on screen is negative.
 const heads=[{id:'ข',center:[120,409],sign:-1},{id:'ช',center:[120,409],sign:-1},{id:'อ',center:[209,296],sign:1},{id:'ฮ',center:[177,265],sign:1},{id:'ร',center:[280,92],sign:1},{id:'ส',center:[186,92],sign:-1}];
 for(const h of heads){await seed(page,progress('consonants',h.id,5));const turn=await page.locator('.writing-route').first().evaluate((p:SVGPathElement,center)=>{let last:number|undefined,turn=0;for(let t=0;t<=260;t+=5){const a=p.getPointAtLength(t),angle=Math.atan2(a.y-center[1],a.x-center[0]);if(last!==undefined)turn+=Math.atan2(Math.sin(angle-last),Math.cos(angle-last));last=angle;}return turn;},h.center);expect(turn*h.sign,h.id+' head winding').toBeGreaterThan(2);}
 await seed(page,progress('vowels','uee',2));const starts=await page.locator('.writing-route').evaluateAll(paths=>paths.map(path=>{const p=(path as SVGPathElement).getPointAtLength(0);return [p.x,p.y];}));expect(starts[1][0]).toBeGreaterThan(starts[2][0]); // Right tick before left tick.
 await seed(page,progress('consonants','ส',5));const strokes=await page.locator('.writing-route').all();expect(strokes).toHaveLength(2);const tail=await strokes[1].evaluate((p:SVGPathElement)=>{const a=p.getPointAtLength(0),b=p.getPointAtLength(p.getTotalLength());return {dx:b.x-a.x,dy:b.y-a.y};});expect(tail.dx).toBeGreaterThan(0);expect(tail.dy).toBeGreaterThan(0);
});

test('slow writing demonstration lifts between strokes and never changes the child drawing',async({page})=>{
 await page.clock.install();await seed(page,progress('consonants','ส',5));
 const pad=page.locator('.writing-pad'),box=(await pad.boundingBox())!;await page.mouse.move(box.x+80,box.y+80);await page.mouse.down();await page.mouse.move(box.x+100,box.y+110);await page.mouse.up();const before=(await stored(page)).draft.strokes;
 await page.getByRole('button',{name:'ดูการลากช้า ๆ',exact:true}).click();await page.clock.runFor(50);await expect(page.locator('.writing-demo')).toHaveAttribute('data-step','1');
 const duration=await page.locator('.writing-demo-line').first().evaluate((p:SVGPathElement)=>{const m=p.getCTM()!;return Math.max(1000,p.getTotalLength()*Math.hypot(m.a,m.b)/65*1000);});
 // The SVG viewBox is scaled on screen; playback uses SVG units, not CSS pixels.
 const ratio=await pad.evaluate(el=>440/el.getBoundingClientRect().width);await page.clock.runFor(duration*ratio-50+100);await expect(page.locator('.writing-demo')).toHaveAttribute('data-phase','lift');
 await expect(page.locator('.writing-demo-tip[visibility="visible"]')).toHaveCount(0);
 await page.clock.runFor(610);await expect(page.locator('.writing-demo')).toHaveAttribute('data-step','2');await expect(page.locator('.writing-demo-line').nth(1)).not.toHaveAttribute('stroke-dashoffset','1');
 await page.setViewportSize({width:390,height:950});await page.screenshot({path:'test-results/readtech-writing-slow-demo.png',fullPage:true});
 await page.getByRole('button',{name:'หยุดสาธิต',exact:true}).click();await expect(page.locator('.writing-demo')).toHaveCount(0);expect((await stored(page)).draft.strokes).toEqual(before);
 await page.getByRole('button',{name:'ดูการลากช้า ๆ',exact:true}).click();await page.clock.runFor(50);await expect(page.locator('.writing-demo')).toHaveAttribute('data-step','1');await page.clock.runFor(30000);await expect(page.locator('.writing-demo')).toHaveCount(0);await expect(page.locator('.writing-directions')).toHaveCount(1);expect((await stored(page)).draft.strokes).toEqual(before);await page.getByRole('button',{name:'ดูการลากช้า ๆ',exact:true}).click();await page.getByRole('button',{name:'กลับกิจกรรม',exact:true}).click();await expect(page.locator('.writing-demo')).toHaveCount(0);
});

