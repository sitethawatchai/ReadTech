import { useEffect,useRef,useState } from 'react';
import { WritingDirections,writingTip } from './WritingDirections';
import { ConsonantArt } from './ConsonantArt';
import { WritingModel } from './WritingModel';
import { WritingDemo } from './WritingDemo';
import { writingLayout } from '../writingLayout';
export type Stroke=number[][];
function DirectionLockRoutes({glyph,vowel}:{glyph:string;vowel:boolean}){const layout=writingLayout(glyph,vowel);return <g className="writing-lock-routes" aria-hidden="true" visibility="hidden" pointerEvents="none" transform={layout.transform}>{layout.parts.map((part,i)=><g key={i} transform={`translate(${part.x} 0)`}>{part.glyph.strokes.map((stroke,n)=><path key={n} className="writing-lock-route" d={stroke.d}/>)}</g>)}</g>;}
export function WritingPad({glyph,strokes,onChange,vowel=false,picture,guided=true}:{glyph:string;strokes:Stroke[];onChange:(lines:Stroke[])=>void;vowel?:boolean;picture?:{art:string;word:string};guided?:boolean}) {
 const drawing=useRef(false),outside=useRef(true),trace=useRef<{route:SVGPathElement;progress:number}|null>(null),pad=useRef<SVGSVGElement>(null),latest=useRef(strokes),cursor=useRef([220,150]);
 const [arrows,setArrows]=useState(guided);
 const [playing,setPlaying]=useState(false);
 useEffect(()=>{setPlaying(false);setArrows(guided);},[glyph,vowel,guided]);
 const [keyboard,setKeyboard]=useState(false),[point,setPoint]=useState([220,150]);latest.current=strokes;
 function write(lines:Stroke[]){latest.current=lines;onChange(lines);}
 function coordinate(e:React.PointerEvent<SVGSVGElement>){const r=e.currentTarget.getBoundingClientRect();return [Math.max(0,Math.min(440,(e.clientX-r.left)/r.width*440)),Math.max(0,Math.min(300,(e.clientY-r.top)/r.height*300))];}
 function insideGuide(point:number[]){const svg=pad.current,root=svg?.getScreenCTM();if(!svg||!root)return false;const screen=new DOMPoint(point[0],point[1]).matrixTransform(root);return [...svg.querySelectorAll<SVGGeometryElement>('.writing-outline')].some(path=>{const matrix=path.getScreenCTM();if(!matrix)return false;return path.isPointInFill(screen.matrixTransform(matrix.inverse()));});}
 function segmentInside(from:number[],to:number[]){const distance=Math.hypot(to[0]-from[0],to[1]-from[1]),steps=Math.max(1,Math.ceil(distance/3));for(let i=1;i<=steps;i++)if(!insideGuide([from[0]+(to[0]-from[0])*i/steps,from[1]+(to[1]-from[1])*i/steps]))return false;return true;}
 function nearest(route:SVGPathElement,point:number[]){const svg=pad.current,root=svg?.getScreenCTM();if(!svg||!root)return {progress:0,distance:Infinity};const inverse=root.inverse(),matrix=route.getScreenCTM(),length=route.getTotalLength();if(!matrix||!length)return {progress:0,distance:Infinity};let best={progress:0,distance:Infinity};const steps=Math.max(30,Math.ceil(length/8));for(let i=0;i<=steps;i++){const p=route.getPointAtLength(length*i/steps),local=new DOMPoint(p.x,p.y).matrixTransform(matrix).matrixTransform(inverse),distance=Math.hypot(local.x-point[0],local.y-point[1]);if(distance<best.distance)best={progress:i/steps,distance};}return best;}
 function directionAt(point:number[]){const current=trace.current;if(current){const position=nearest(current.route,point),advance=position.progress-current.progress;if(position.distance>45||advance<=.002||advance>.25)return false;current.progress=position.progress;return true;}let match:{route:SVGPathElement;progress:number;distance:number}|null=null;for(const route of pad.current?.querySelectorAll<SVGPathElement>('.writing-lock-route')??[]){const position=nearest(route,point);if(!match||position.distance<match.distance)match={route,...position};}if(!match||match.distance>45)return false;trace.current={route:match.route,progress:match.progress};return true;}
 function addPoint(next:number[]){if(!insideGuide(next)||(guided&&!directionAt(next))){outside.current=true;return;}const lines=latest.current,last=lines.at(-1),previous=last?.at(-1);if(outside.current||!last||!previous||!segmentInside(previous,next))write([...lines.slice(-99),[next]]);else write([...lines.slice(0,-1),[...last.slice(-1199),next]]);outside.current=false;}
 return <div className="writing-area">
  <p className="writing-instruction" id="writing-instruction">{guided?'ลากภายในกรอบตัวอักษรไปตามทิศลูกศร ระบบจะไม่รับเส้นที่ลากย้อนกลับ':'ลองเขียนด้วยตนเองภายในกรอบตัวอักษร'}</p>
  <p className="sr-only" id="writing-keyboard">ใช้ลูกศรเลื่อนจุด กด Shift ค้างพร้อมลูกศรเพื่อเขียน ระบบจะเขียนเฉพาะภายในกรอบตัวอักษร</p>
  <div className="writing-frame">
  {picture&&!vowel&&<figure className="writing-picture"><ConsonantArt kind={picture.art} label={picture.word}/><figcaption>{glyph} {picture.word}</figcaption></figure>}
  <svg ref={pad} className="writing-pad" viewBox="0 0 440 300" tabIndex={0} role="group" aria-label={'พื้นที่ฝึกเขียน '+glyph} aria-describedby="writing-instruction writing-keyboard"
   onFocus={()=>setKeyboard(true)} onBlur={()=>setKeyboard(false)}
   onPointerDown={e=>{if(e.button!==0||!e.isPrimary)return;e.preventDefault();setPlaying(false);e.currentTarget.focus({preventScroll:true});setKeyboard(false);e.currentTarget.setPointerCapture(e.pointerId);drawing.current=true;outside.current=true;trace.current=null;addPoint(coordinate(e));}}
   onPointerMove={e=>{if(drawing.current)addPoint(coordinate(e));}}
   onPointerUp={()=>{drawing.current=false;outside.current=true;trace.current=null;}} onPointerCancel={()=>{drawing.current=false;outside.current=true;trace.current=null;}} onLostPointerCapture={()=>{drawing.current=false;outside.current=true;trace.current=null;}}
   onKeyDown={e=>{const deltas:Record<string,number[]>={ArrowLeft:[-10,0],ArrowRight:[10,0],ArrowUp:[0,-10],ArrowDown:[0,10]};const delta=deltas[e.key];if(!delta)return;e.preventDefault();const old=cursor.current;const next=[Math.max(0,Math.min(440,old[0]+delta[0])),Math.max(0,Math.min(300,old[1]+delta[1]))];cursor.current=next;setPoint(next);if(e.shiftKey){if(!trace.current)outside.current=!insideGuide(old);addPoint(next);}else{outside.current=true;trace.current=null;}}}>
   <rect x="2" y="2" width="436" height="296" rx="24" fill="#fffdfb"/>
   <path d="M22 70h396M22 150h396M22 230h396" stroke="#ecdee5" strokeDasharray="6 8" fill="none"/>
   <WritingModel glyph={glyph} vowel={vowel}/>
   {guided&&<DirectionLockRoutes glyph={glyph} vowel={vowel}/>} 
   {arrows&&!playing&&<WritingDirections glyph={glyph} vowel={vowel}/>}
   {strokes.map((line,i)=><polyline key={i} points={line.map(p=>p.join(',')).join(' ')} fill="none" stroke="#a72b63" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>)}
   {keyboard&&<circle cx={point[0]} cy={point[1]} r="7" fill="#277a70"/>}
   {playing&&<WritingDemo glyph={glyph} vowel={vowel} onComplete={()=>setPlaying(false)}/>}
  </svg>
  </div>
  {guided&&arrows?<p className="writing-guide-note"><span className="writing-legend" aria-hidden="true"/>จุดสีเขียวเริ่มเขียน · <span className="writing-end-legend" aria-hidden="true">★</span> ดาวสีแดงคือจุดสิ้นสุด · ตัวเลขบอกลำดับเส้น<br/>{writingTip(glyph,vowel)}</p>:!guided&&<p className="writing-guide-note">เขียนได้เฉพาะภายในกรอบตัวอักษร</p>}
  <p className="writing-demo-status" role="status">{playing?'ดูจุดสีเขียวลากทีละเส้น หยุดพักเมื่อยกมือ':''}</p>
  <div className="writing-actions">{guided&&<><button className="secondary" aria-pressed={playing} onClick={()=>setPlaying(value=>!value)}>{playing?'หยุดสาธิต':'ดูการลากช้า ๆ'}</button><button className="text-button" aria-pressed={arrows} onClick={()=>setArrows(value=>!value)}>{arrows?'ซ่อนลูกศร':'แสดงลูกศร'}</button></>}<button className="text-button" disabled={!strokes.length} onClick={()=>write(strokes.slice(0,-1))}>ย้อนเส้นล่าสุด</button><button className="secondary" disabled={!strokes.length} onClick={()=>write([])}>ล้างเพื่อเขียนใหม่</button></div>
 </div>;
}
