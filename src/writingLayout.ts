import geometry from './writingGeometry.json';
export type WritingStroke={d:string;start:number[];arrows:number[]};
export type WritingGlyph={advance:number;bounds:number[];outline:string;strokes:WritingStroke[];tip?:string};
const glyphs=geometry as Record<string,WritingGlyph>;
export function writingLayout(value:string,vowel:boolean){
 let advance=0;
 const parts=[...value].map(char=>{const glyph=glyphs[char];const x=advance;advance+=glyph?.advance??0;return {char,x,glyph};}).filter(part=>part.glyph);
 const minX=Math.min(...parts.map(p=>p.x+p.glyph.bounds[0])),maxX=Math.max(...parts.map(p=>p.x+p.glyph.bounds[2]));
 const minY=Math.min(...parts.map(p=>p.glyph.bounds[1])),maxY=Math.max(...parts.map(p=>p.glyph.bounds[3]));
 const scale=Math.min(350/(maxX-minX),210/(maxY-minY));
 return {parts,scale,transform:`translate(${220-(minX+maxX)*scale/2} ${150+(minY+maxY)*scale/2}) scale(${scale} ${-scale})`,tip:!vowel?glyphs[value]?.tip:undefined};
}
