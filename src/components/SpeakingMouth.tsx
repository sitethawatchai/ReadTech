type MouthShape='open'|'spread'|'round'|'mid'|'central';

// Short and long vowel pairs share a lip position. Playback controls motion.
export function vowelMouthShape(name:string):MouthShape{
 if(['อะ','อา','แอะ','แอ','เอาะ','ออ'].includes(name))return 'open';
 if(['อิ','อี','อึ','อือ'].includes(name))return 'spread';
 if(['อุ','อู','โอะ','โอ'].includes(name))return 'round';
 if(['เอะ','เอ'].includes(name))return 'mid';
 return 'central';
}
// Width, jaw drop and lip shape vary even within a mouth family.
const poses: Record<string, [number, number, number]> = {
 อะ:[43,24,0], อา:[46,29,0], อิ:[54,8,0], อี:[58,9,0],
 อึ:[38,9,0], อือ:[40,10,0], อุ:[23,11,1], อู:[20,12,1],
 เอะ:[49,12,0], เอ:[51,14,0], แอะ:[52,20,0], แอ:[54,23,0],
 โอะ:[29,16,1], โอ:[27,17,1], เอาะ:[35,22,1], ออ:[36,24,1],
 เออะ:[36,15,0], เออ:[38,17,0],
};

export function SpeakingMouth({active,label,vowel}:{active:boolean;label:string;vowel:string}){
 const [targetWidth,targetDrop,rounded]=poses[vowel] ?? poses.อะ;
 const w=active?targetWidth:43, drop=active?targetDrop:1;
 const round=active?rounded:0;
 const l=160-w,r=160+w,y=91, top=y-(round?10:4), bottom=y+drop;
 const lipTop=top-(round?9:7), lipBottom=bottom+(round?10:8);
 const jaw=active?targetDrop*.55:0;
 const transition={transition:'d 150ms ease-out'};
 return <svg className={'speaking-mouth mouth-'+vowelMouthShape(vowel)+(active?' is-speaking':'')} viewBox="0 0 320 180" role="img" aria-label={label}>
  <path fill="#f2c1a5" stroke="#c98c76" strokeWidth="1.3" style={transition}
    d={`M67 19 Q160 0 253 19 C253 77 249 111 218 ${127+jaw} Q195 ${153+jaw} 160 ${155+jaw} Q125 ${153+jaw} 102 ${127+jaw} C71 111 67 77 67 19Z`}/>
  <path d="M150 23 C149 39 139 46 143 52 Q147 58 153 53 Q160 59 167 53 Q173 58 177 52 C181 46 171 39 170 23" fill="#e8ac92"/>
  <path d="M145 52 Q149 49 153 53 M167 53 Q171 49 175 52 M157 62 Q160 68 163 62" fill="none" stroke="#b57b67" strokeWidth="2" strokeLinecap="round"/>
  <path fill="#a85455" style={transition}
    d={`M${l} ${y} C${l} ${top-4} 144 ${lipTop-5} 152 ${lipTop} Q160 ${lipTop+5} 168 ${lipTop} C176 ${lipTop-5} ${r} ${top-4} ${r} ${y} Q${r-4} ${lipBottom+7} 160 ${lipBottom} Q${l+4} ${lipBottom+7} ${l} ${y}Z`}/>
  <path fill="#512729" style={transition}
    d={`M${l+2} ${y} C${l+w*.32} ${top} 143 ${top} 160 ${top+1} C177 ${top} ${r-w*.32} ${top} ${r-2} ${y} Q${r-w*.32} ${bottom} 160 ${bottom} Q${l+w*.32} ${bottom} ${l+2} ${y}Z`}/>
  <path fill="#c67672" style={transition}
    d={`M${l+3} ${y+1} Q${l+w*.32} ${bottom+1} 160 ${bottom+1} Q${r-w*.32} ${bottom+1} ${r-3} ${y+1} Q${r-6} ${lipBottom+4} 160 ${lipBottom} Q${l+6} ${lipBottom+4} ${l+3} ${y+1}Z`}/>
  <path fill="#fff3e5" opacity={active && !round ? 1 : 0} style={{...transition,transitionProperty:'d, opacity'}}
    d={`M${l+w*.32} ${top+1} Q160 ${top-1} ${r-w*.32} ${top+1} Q160 ${top+Math.min(10,drop*.57)} ${l+w*.32} ${top+1}Z`}/>
  <path fill="none" stroke="#d59680" strokeWidth="2" strokeLinecap="round" style={transition}
    d={`M142 ${130+jaw} Q160 ${125+jaw} 178 ${130+jaw}`}/>
 </svg>;
}
