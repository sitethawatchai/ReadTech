import {writingLayout} from '../writingLayout';
export function WritingModel({glyph,vowel}:{glyph:string;vowel:boolean}){
 const layout=writingLayout(glyph,vowel);
 return <g className="writing-model" data-glyph={glyph} aria-hidden="true" transform={layout.transform}>
  {layout.parts.map((part,i)=><path key={i} className={part.char==='–'?'writing-placeholder':'writing-outline'} data-character={part.char} d={part.glyph.outline} transform={`translate(${part.x} 0)`} fill={part.char==='–'?'#e8dce2':'#f6e9ef'} stroke={part.char==='–'?'none':'#cba4b5'} strokeWidth="2" strokeDasharray="10 10"/>)}
 </g>;
}
