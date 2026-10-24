import { useEffect,useRef,useState } from 'react';
import { WritingDirections,writingTip } from './WritingDirections';
import { ConsonantArt } from './ConsonantArt';
import { WritingModel } from './WritingModel';
import { WritingDemo } from './WritingDemo';
export type Stroke=number[][];
export function WritingPad({glyph,strokes,onChange,vowel=false,picture}:{glyph:string;strokes:Stroke[];onChange:(lines:Stroke[])=>void;vowel?:boolean;picture?:{art:string;word:string}}) {
 const drawing=useRef(false),latest=useRef(strokes),cursor=useRef([220,150]);
 const [arrows,setArrows]=useState(true);
 const [playing,setPlaying]=useState(false);
 useEffect(()=>setPlaying(false),[glyph,vowel]);
 const [keyboard,setKeyboard]=useState(false),[point,setPoint]=useState([220,150]);latest.current=strokes;
 function write(lines:Stroke[]){latest.current=lines;onChange(lines);}
 function coordinate(e:React.PointerEvent<SVGSVGElement>){const r=e.currentTarget.getBoundingClientRect();return [Math.max(0,Math.min(440,(e.clientX-r.left)/r.width*440)),Math.max(0,Math.min(300,(e.clientY-r.top)/r.height*300))];}
 return <div className="writing-area">
  <p className="writing-instruction" id="writing-instruction">ลากตามรอยและทิศลูกศร แล้วกดเสร็จแล้ว</p>
  <p className="sr-only" id="writing-keyboard">ใช้ลูกศรเลื่อนจุด กด Shift ค้างพร้อมลูกศรเพื่อเขียน</p>
  <div className="writing-frame">
  {picture&&!vowel&&<figure className="writing-picture"><ConsonantArt kind={picture.art} label={picture.word}/><figcaption>{glyph} {picture.word}</figcaption></figure>}
  <svg className="writing-pad" viewBox="0 0 440 300" tabIndex={0} role="group" aria-label={'พื้นที่ฝึกเขียน '+glyph} aria-describedby="writing-instruction writing-keyboard"
   onFocus={()=>setKeyboard(true)} onBlur={()=>setKeyboard(false)}
   onPointerDown={e=>{if(e.button!==0||!e.isPrimary)return;e.preventDefault();setPlaying(false);e.currentTarget.focus({preventScroll:true});setKeyboard(false);e.currentTarget.setPointerCapture(e.pointerId);drawing.current=true;write([...latest.current.slice(-99),[coordinate(e)]]);}}
   onPointerMove={e=>{if(!drawing.current)return;const lines=latest.current;if(!lines.length)return;write([...lines.slice(0,-1),[...lines.at(-1)!.slice(-1199),coordinate(e)]]);}}
   onPointerUp={()=>{drawing.current=false;}} onPointerCancel={()=>{drawing.current=false;}} onLostPointerCapture={()=>{drawing.current=false;}}
   onKeyDown={e=>{const deltas:Record<string,number[]>={ArrowLeft:[-10,0],ArrowRight:[10,0],ArrowUp:[0,-10],ArrowDown:[0,10]};const delta=deltas[e.key];if(!delta)return;e.preventDefault();const old=cursor.current;const next=[Math.max(0,Math.min(440,old[0]+delta[0])),Math.max(0,Math.min(300,old[1]+delta[1]))];cursor.current=next;setPoint(next);if(e.shiftKey)write([...latest.current.slice(-99),[old,next]]);}}>
   <rect x="2" y="2" width="436" height="296" rx="24" fill="#fffdfb"/>
   <path d="M22 70h396M22 150h396M22 230h396" stroke="#ecdee5" strokeDasharray="6 8" fill="none"/>
   <WritingModel glyph={glyph} vowel={vowel}/>
   {arrows&&!playing&&<WritingDirections glyph={glyph} vowel={vowel}/>}
   {strokes.map((line,i)=><polyline key={i} points={line.map(p=>p.join(',')).join(' ')} fill="none" stroke="#a72b63" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>)}
   {keyboard&&<circle cx={point[0]} cy={point[1]} r="7" fill="#277a70"/>}
   {playing&&<WritingDemo glyph={glyph} vowel={vowel} onComplete={()=>setPlaying(false)}/>}
  </svg>
  </div>
  {arrows&&<p className="writing-guide-note"><span className="writing-legend" aria-hidden="true"/>จุดเริ่ม · ตัวเลขบอกลำดับเส้น · ยกมือเมื่อขึ้นเลขใหม่<br/>{writingTip(glyph,vowel)}</p>}
  <p className="writing-demo-status" role="status">{playing?'ดูจุดสีเขียวลากทีละเส้น หยุดพักเมื่อยกมือ':''}</p>
  <div className="writing-actions"><button className="secondary" aria-pressed={playing} onClick={()=>setPlaying(value=>!value)}>{playing?'หยุดสาธิต':'ดูการลากช้า ๆ'}</button><button className="text-button" aria-pressed={arrows} onClick={()=>setArrows(value=>!value)}>{arrows?'ซ่อนลูกศร':'แสดงลูกศร'}</button><button className="text-button" disabled={!strokes.length} onClick={()=>write(strokes.slice(0,-1))}>ย้อนเส้นล่าสุด</button><button className="secondary" disabled={!strokes.length} onClick={()=>write([])}>ล้างเพื่อเขียนใหม่</button></div>
 </div>;
}
