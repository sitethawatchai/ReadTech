import {useId,useLayoutEffect,useRef,useState} from 'react';
import {writingLayout,type WritingStroke} from '../writingLayout';
function StrokeDirection({stroke,marker,number,scale}:{stroke:WritingStroke;marker:string;number:number;scale:number}){
 const ref=useRef<SVGPathElement>(null),[arrows,setArrows]=useState<string[]>([]),[end,setEnd]=useState(stroke.start);
 useLayoutEffect(()=>{const path=ref.current;if(!path)return;const length=path.getTotalLength(),last=path.getPointAtLength(length);setEnd([last.x,last.y]);setArrows(stroke.arrows.map(fraction=>{const arrowEnd=length*fraction,start=Math.max(0,arrowEnd-40);return Array.from({length:9},(_,i)=>{const p=path.getPointAtLength(start+(arrowEnd-start)*i/8);return `${i?'L':'M'}${p.x} ${p.y}`;}).join(' ');}));},[stroke]);
 const [x,y]=stroke.start;
 const starRadius=8/scale,star=Array.from({length:10},(_,i)=>{const angle=-Math.PI/2+i*Math.PI/5,r=i%2?starRadius*.45:starRadius;return `${end[0]+Math.cos(angle)*r},${end[1]+Math.sin(angle)*r}`;}).join(' ');
 return <g className="writing-stroke" data-order={number}>
  <path ref={ref} className="writing-route" d={stroke.d} opacity=".55"/>
  {arrows.map((d,i)=><path key={i} className="writing-arrow" d={d} markerEnd={marker}/>)}
  <circle className="writing-start" cx={x} cy={y} r={6/scale} fill="#22a447" stroke="#fffdfb" strokeWidth={2/scale}/>
  <polygon className="writing-end" points={star} fill="#dc3545" stroke="#fffdfb" strokeWidth={2/scale}/>
  <text className="writing-start-label" transform={`translate(${x-9/scale} ${y+7/scale}) scale(1 -1)`} textAnchor="end" fontSize={14/scale}>{number}</text>
 </g>;
}
export function writingTip(glyph:string,vowel:boolean){
 if(!vowel)return writingLayout(glyph,false).tip??'เริ่มที่หัว แล้วลากต่อเนื่องตามลูกศรไปจนจบตัว';
 if(/[เแโ]/u.test(glyph))return 'เริ่มที่หัวด้านล่าง ลากขึ้นตามลูกศร และเขียนส่วนถัดไปตามตัวเลข';
 if(glyph.includes('ื'))return 'ลากเส้นล่างจากขวาไปซ้าย โค้งกลับ แล้วเติมขีดขวาก่อนขีดซ้าย จากนั้นเขียน อ';
 if(/[ิีึ]/u.test(glyph))return 'ลากเส้นล่างจากขวาไปซ้าย แล้วโค้งกลับ เติมขีดหรือวงกลมตามลำดับ';
 return 'เริ่มที่จุดสีเขียว เขียนตามลูกศรไปถึงดาวสีแดง และยกมือเมื่อขึ้นเลขถัดไป';
}
export function WritingDirections({glyph,vowel}:{glyph:string;vowel:boolean}){
 const id='write-arrow-'+useId().replace(/:/g,''),marker=`url(#${id})`,layout=writingLayout(glyph,vowel);let number=0;
 return <g className="writing-directions" aria-hidden="true" transform={layout.transform} fill="none" stroke="#24766d" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" pointerEvents="none">
  <defs><marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="3" markerHeight="3" orient="auto"><path d="M1 1 9 5 1 9" fill="none" stroke="#24766d" strokeWidth="2"/></marker></defs>
  {layout.parts.map((part,i)=><g key={i} data-character={part.char} transform={`translate(${part.x} 0)`}>{part.glyph.strokes.map((stroke,n)=><StrokeDirection key={n} stroke={stroke} number={++number} marker={marker} scale={layout.scale}/>)}</g>)}
 </g>;
}
