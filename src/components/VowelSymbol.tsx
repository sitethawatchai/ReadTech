import outlines from '../vowelOutlines.json';
// Sara marks are drawn from the installed Sarabun outlines. Isolated combining
// marks otherwise become missing-glyph boxes on some browsers and font engines.
function NativeDrawing({glyph,size=68,center=100,baseline=103,color,stroke,guide}:{glyph:string;size?:number;center?:number;baseline?:number;color:string;stroke?:string;guide:boolean}){
 const scale=size/1000;
 const get=(char:string)=>outlines[char as keyof typeof outlines] as {path:string;advance?:number}|undefined;
 const width=[...glyph].reduce((sum,char)=>sum+(get(char)?.advance??0),0);let x=center-width*scale/2;
 return <>{[...glyph].map((char,i)=>{const data=get(char),left=x;x+=(data?.advance??0)*scale;return data?<path key={i} d={data.path} transform={`translate(${left} ${baseline}) scale(${scale} ${-scale})`} fill={color} stroke={stroke} strokeWidth={guide?10:undefined} strokeDasharray={guide?'42 42':undefined}/>:null;})}</>;
}
export function VowelDrawing({glyph,guide=false}:{glyph:string;guide?:boolean}){
 const mark=glyph.match(/[ิีึืุู]/u)?.[0] as keyof typeof outlines|undefined;
 const color=guide?'#f6e9ef':'currentColor',stroke=guide?'#cba4b5':undefined;
 if(!mark)return <NativeDrawing glyph={glyph} color={color} stroke={stroke} guide={guide}/>;
 const data=outlines[mark],scale=.13,lower=['ุ','ู'].includes(mark),trailing=mark==='ื'&&glyph.includes('อ');
 const [x1,y1,x2,y2]=data.bounds,center=trailing?71:100;
 const translateX=center-(x1+x2)/2*scale;
 const translateY=lower?101+y2*scale:57+y1*scale;
 return <>
  <path d={`M${center-28} ${lower?71:98}h56`} fill="none" stroke={guide?'#e8dce2':'#b59aa8'} strokeWidth="4" strokeLinecap="round"/>
  <path d={data.path} transform={`translate(${translateX} ${translateY}) scale(${scale} ${-scale})`} fill={color} stroke={stroke} strokeWidth={guide?5:undefined} strokeDasharray={guide?'20 20':undefined}/>
  {trailing&&<NativeDrawing glyph="อ" size={73} center={137} baseline={113} color={color} stroke={stroke} guide={guide}/>}
 </>;
}
export function VowelSymbol({glyph,label}:{glyph:string;label?:string}){
 return <svg className="vowel-symbol" viewBox="0 0 200 150" role="img" aria-label={label??glyph}><VowelDrawing glyph={glyph}/></svg>;
}
