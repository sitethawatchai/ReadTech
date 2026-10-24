import {useEffect,useRef} from 'react';
import {writingLayout} from '../writingLayout';

/** One pen, one ordered stroke at a time. Pen lifts never draw connecting lines. */
export function WritingDemo({glyph,vowel,onComplete}:{glyph:string;vowel:boolean;onComplete:()=>void}){
 const root=useRef<SVGGElement>(null),complete=useRef(onComplete);complete.current=onComplete;
 const layout=writingLayout(glyph,vowel);
 useEffect(()=>{
  const group=root.current;if(!group)return;
  const paths=Array.from(group.querySelectorAll<SVGPathElement>('.writing-demo-line'));
  const tips=Array.from(group.querySelectorAll<SVGCircleElement>('.writing-demo-tip'));
  const lengths=paths.map(path=>path.getTotalLength());
  const durations=lengths.map(length=>Math.max(1000,length*layout.scale/65*1000));
  let frame=0,started:number|undefined;
  function animate(now:number){
   started??=now;let elapsed=now-started;
   for(let i=0;i<paths.length;i++){
    const fraction=Math.min(1,Math.max(0,elapsed/durations[i]));
    paths[i].setAttribute('stroke-dashoffset',String(1-fraction));
    const active=elapsed>=0&&elapsed<durations[i];
    tips[i].setAttribute('visibility',active?'visible':'hidden');
    if(active){const p=paths[i].getPointAtLength(lengths[i]*fraction);tips[i].setAttribute('cx',String(p.x));tips[i].setAttribute('cy',String(p.y));group!.dataset.step=String(i+1);group!.dataset.phase='drawing';}
    if(elapsed>=durations[i]&&elapsed<durations[i]+600)group!.dataset.phase='lift';
    elapsed-=durations[i]+600;
   }
   if(elapsed>=0){complete.current();return;}
   frame=requestAnimationFrame(animate);
  }
  frame=requestAnimationFrame(animate);return()=>cancelAnimationFrame(frame);
 },[glyph,vowel,layout.scale]);
 let order=0;
 return <g ref={root} className="writing-demo" transform={layout.transform} aria-hidden="true" pointerEvents="none">
  {layout.parts.map((part,i)=><g key={i} transform={`translate(${part.x} 0)`}>{part.glyph.strokes.map((stroke,n)=><g key={n} data-order={++order}>
   <path className="writing-demo-line" d={stroke.d} pathLength="1" strokeDasharray="1" strokeDashoffset="1" stroke="#a72b63" strokeWidth={5/layout.scale} strokeLinecap="round" strokeLinejoin="round" fill="none"/>
   <circle className="writing-demo-tip" cx={stroke.start[0]} cy={stroke.start[1]} r={6/layout.scale} fill="#24766d" stroke="white" strokeWidth={2/layout.scale} visibility="hidden"/>
  </g>)}</g>)}
 </g>;
}
