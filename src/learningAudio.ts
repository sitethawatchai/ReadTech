import type { Settings } from './types';
import { stopFeedbackSound } from './feedbackAudio';
let generation=0;
export function thaiVoices(){return window.speechSynthesis?.getVoices().filter(v=>/^th(?:-|_)?/i.test(v.lang))??[];}
export function preferredThaiVoice(voices:SpeechSynthesisVoice[]){return voices.find(v=>/premwadee|เปรมวดี/i.test(v.name+' '+v.voiceURI)&&!v.localService)??voices.find(v=>/premwadee|เปรมวดี/i.test(v.name+' '+v.voiceURI))??voices.find(v=>v.default)??voices.find(v=>v.localService)??voices[0];}
export function stopLessonAudio(){generation++;window.speechSynthesis?.cancel();}
export function playLessonAudio(text:string,settings:Settings,onMessage:(s:string)=>void){
 stopFeedbackSound();stopLessonAudio();if(!settings.sound){onMessage('ปิดเสียงอยู่ เปิดได้ในปรับการใช้งาน');return;}
 const request=generation;const voice=thaiVoices().find(v=>v.voiceURI===settings.voiceURI)??preferredThaiVoice(thaiVoices());
 if(!voice||!window.speechSynthesis){onMessage('เครื่องนี้ไม่มีเสียงภาษาไทย ให้ผู้ดูแลอ่านให้ฟังได้');return;}
 try{const utterance=new SpeechSynthesisUtterance(text);utterance.lang='th-TH';utterance.voice=voice;utterance.rate=Math.max(.65,Math.min(1.1,settings.speechRate));utterance.pitch=1;utterance.volume=1;
 utterance.onend=()=>{if(request===generation)onMessage('ฟังซ้ำได้ตามต้องการ');};utterance.onerror=e=>{if(request===generation&&!['interrupted','canceled'].includes(e.error))onMessage('เปิดเสียงไม่สำเร็จ ลองกดฟังอีกครั้งได้');};
 onMessage('กำลังอ่าน');window.speechSynthesis.speak(utterance);
 }catch{onMessage('เปิดเสียงไม่สำเร็จ ลองกดฟังอีกครั้งได้');}
}
