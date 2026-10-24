import outlines from '../vowelOutlines.json';
// Use font units for isolated vowel forms, at the same em size and baseline
// as native Sarabun text. Do not independently enlarge a vowel's ink bounds.
export function BlendGlyph({value,label}:{value:string;label?:string}){
 const orphan=value.match(/^([ิีึืุู]อ?)(.*)$/u);
 if(orphan)return <span className="blend-glyph blend-glyph-sequence"><BlendGlyph value={'–'+orphan[1]}/>{orphan[2]&&<BlendGlyph value={orphan[2]}/>}</span>;
 if(!value.includes('–'))return <span className="blend-glyph blend-glyph-text">{value}</span>;
 const glyph=value.includes('–')?value:'–'+value;
 type Outline={path:string;bounds:number[];advance?:number};
 const get=(char:string)=>outlines[char as keyof typeof outlines] as Outline|undefined;
 let x=0;const paths=[...glyph].map((char,i)=>{const data=get(char),left=x;x+=data?.advance??0;return data?<path key={i} d={data.path} transform={`translate(${left} 1218) scale(1 -1)`}/>:null;});
 return <svg className="blend-glyph blend-glyph-svg" viewBox={`0 0 ${x} 1600`} style={{width:`${x/1000}em`,height:'1.6em'}} role="img" aria-label={label??glyph} fill="currentColor">{paths}</svg>;
}
