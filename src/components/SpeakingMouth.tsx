type MouthShape='open'|'spread'|'round'|'mid'|'central';

// Short and long vowel pairs share a lip position. Playback controls motion.
export function vowelMouthShape(name:string):MouthShape{
 if(['อะ','อา','แอะ','แอ','เอาะ','ออ'].includes(name))return 'open';
 if(['อิ','อี','อึ','อือ'].includes(name))return 'spread';
 if(['อุ','อู','โอะ','โอ'].includes(name))return 'round';
 if(['เอะ','เอ'].includes(name))return 'mid';
 return 'central';
}
const dimensions:Record<MouthShape,{half:number;opening:number;arch:number}>={
 open:{half:92,opening:48,arch:18},spread:{half:112,opening:19,arch:9},
 round:{half:49,opening:52,arch:12},mid:{half:94,opening:31,arch:12},
 central:{half:76,opening:34,arch:11}
};
export function SpeakingMouth({active,label,vowel}:{active:boolean;label:string;vowel:string}){
 const shape=vowelMouthShape(vowel),{half,opening,arch}=dimensions[shape];
 const left=160-half,right=160+half,top=90-arch,bottom=96+opening;
 if(shape==='round')return <svg className={'speaking-mouth mouth-round'+(active?' is-speaking':'')} viewBox="0 0 320 180" role="img" aria-label={label}>
  <ellipse className="mouth-rounded-lip" cx="160" cy="99" rx="53" ry="66"/>
  <ellipse className="mouth-round-opening" cx="160" cy="100" rx="34" ry="48"/>
  <path className="mouth-round-glint" d="M137 49Q160 37 183 49"/>
 </svg>;
 return <svg className={'speaking-mouth mouth-'+shape+(active?' is-speaking':'')} viewBox="0 0 320 180" role="img" aria-label={label}>
  <path className="mouth-upper-lip" d={`M${left} 96 Q${left+38} ${top-11} 146 ${top} Q160 ${top+6} 174 ${top} Q${right-38} ${top-11} ${right} 96 Q${right-36} ${top+12} 160 ${top+13} Q${left+36} ${top+12} ${left} 96Z`}/>
  <path className="mouth-opening" d={`M${left+7} 99 Q160 ${top+17} ${right-7} 99 Q${right-26} ${bottom} 160 ${bottom} Q${left+26} ${bottom} ${left+7} 99Z`}/>
  <path className="mouth-tongue" d={`M${160-half*.46} ${bottom-4} Q160 ${bottom-26} ${160+half*.46} ${bottom-4} Q160 ${bottom+3} ${160-half*.46} ${bottom-4}Z`}/>
  <path className="mouth-lower-lip" d={`M${left} 98 Q${left+30} ${bottom+6} 160 ${bottom+9} Q${right-30} ${bottom+6} ${right} 98 Q${right-32} ${bottom+25} 160 ${bottom+25} Q${left+32} ${bottom+25} ${left} 98Z`}/>
  <path className="mouth-glint" d={`M${left+25} ${top+2} Q160 ${top-12} ${right-25} ${top+2}`}/>
 </svg>;
}
