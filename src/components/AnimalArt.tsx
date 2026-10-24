import {useId} from 'react';
export const animalKinds=['chicken','turtle','mouse','bee','horse','snake','monkey','elephant','tiger','owl'];

/** Natural proportions and species-specific anatomy, drawn for young readers. */
export function AnimalArt({kind}:{kind:string}){
 const id=useId().replace(/:/g,''),coat=`url(#coat-${id})`;
 const eyes=(x:number,y:number,r=2.4)=><><circle cx={x} cy={y} r={r} fill="#29271f" strokeWidth=".8"/><circle cx={x+.6} cy={y-.7} r={r*.28} fill="white" stroke="none"/></>;
 const defs=<defs><linearGradient id={'coat-'+id} x1="0" y1="0" x2=".8" y2="1"><stop stopColor={kind==='elephant'?'#c4c4bd':kind==='tiger'?'#e9ad48':kind==='chicken'?'#fff2cf':'#cda374'}/><stop offset="1" stopColor={kind==='elephant'?'#929b96':kind==='tiger'?'#cc7b2c':kind==='chicken'?'#dfbc82':'#9c6d45'}/></linearGradient></defs>;
 let drawing;
 switch(kind){
 case 'chicken':drawing=<>
  <path d="M128 104c11-32 22-51 38-53 13 3-2 25-10 35 23-25 35-26 38-17 2 8-13 25-28 37 19-8 27-6 25 3-3 13-25 28-46 30" fill="#335c4d"/>
  <path d="M143 110q24-30 37-39m-31 46 29-16" stroke="#6c9270" fill="none" strokeWidth="1.4"/>
  <path d="m87 143-4 28-7 8m7-8 13 7m-13-7-17 3m49-31 5 30-7 8m7-8 14 5m-14-5 4-4" stroke="#bd873b" strokeWidth="3" fill="none"/>
  <path d="M53 61c-8-8-9-18-3-21l7 7c-4-19 7-21 12-6 4-13 14-8 12 3l6 15-7 10" fill="#bc4540"/>
  <path d="M53 78c-7 28 9 60 39 69 29 9 59-4 63-22 8-25-20-35-43-32-14-4-17-12-24-30-4-12-19-13-28-6-8 6-10 13-7 21Z" fill={coat}/>
  <path d="M87 74c0 17 5 26 16 32m-39-8 9 10m-7-2 9 11m2-12 8 12m-5-21 8 11m-2-18 8 12" stroke="#b18d52" strokeWidth="1.5" fill="none"/>
  <path d="m53 69-18 7 19 7" fill="#d6a23d"/><path d="m36 76 17 1" fill="none" strokeWidth="1"/>
  <path d="M60 83c-5 7-6 16 0 19 8 3 10-6 8-15" fill="#bd4942"/>
  <path d="M91 111c15-12 39-9 44 5 0 17-20 22-37 17l-12-6" fill="#d6b17b"/>
  <path d="m103 115 22 7m-27 1 21 7m-27-2 15 6m27-1 8-5" stroke="#aa804c" strokeWidth="1.3" fill="none"/>
  <ellipse cx="68" cy="69" rx="5" ry="6" fill="#dca852" strokeWidth="1"/>{eyes(68,69,2.3)}
 </>;break;
 case 'horse':drawing=<>
  <path d="M44 89C22 87 27 119 15 140c25-6 25-28 28-37" fill="#513a2c"/>
  <path d="m66 123-7 25-4 25h9l9-23 7-29m34 1 7 25 5 26h9l-1-28-5-25" fill="#96724e"/>
  <path d="M42 85c23-18 50-12 68-9l17-29 12-17 3-14 6 3 2 14 12-11 3 5-5 16 16 29q11 14 0 21c-8 5-17-2-24-6l-13-5-7 30c-7 17-24 23-48 22-28-1-51-11-42-49Z" fill={coat}/>
  <path d="M123 50c-7 10-12 19-15 29l10 15 7-19 14-32-5-8" fill="#513a2c"/>
  <path d="M150 37c-4 12-8 16-12 26l13-12 8 25 12 10" fill="#eed6ac" stroke="none"/>
  <path d="m50 122-4 25-7 28h11l10-25 14-25m34 5 3 21-1 24h11l4-26-3-24" fill="#b4895b"/>
  <path d="m39 174-2 6h14l-1-6m4-1-1 6h12l-1-6m46 1-1 6h14l-2-6m4-1 1 6h13l-3-6" fill="#483b32"/>
  <path d="M47 98q12-13 32-9m25 2 11 16m19-32-7 28m-76 36 6 5m62 2 6 3" stroke="#8f6946" strokeWidth="1.2" fill="none"/>
  {eyes(154,52,2.1)}<ellipse cx="175" cy="78" rx="2" ry="3" fill="#654a39"/><path d="m168 86 8-1" fill="none" strokeWidth="1"/>
 </>;break;
 case 'elephant':drawing=<>
  <path d="M36 100c-8 12-5 29-14 36" fill="none" strokeWidth="3"/><path d="m22 131-5 10 6-2 4-8" fill="#585b57"/>
  <path d="m58 125-5 41h19l7-39m39-2 1 41h18l5-43" fill="#969f9b"/>
  <path d="M35 101c0-39 38-48 72-41 13-20 41-20 54 0 10 13 8 30 7 47l-1 24q0 20 10 11l7-10c8 10-2 27-13 28-21 1-24-13-24-33l-2-19-5 31H65c-18-3-30-17-30-38Z" fill={coat}/>
  <path d="m44 124-2 47q9 7 23 0l6-40m37 2-1 38q10 7 24 0l7-43" fill="#adb5af"/>
  <path d="M49 166v7m7-7v8m58-8v8m8-8v8" stroke="#e3dfcf" strokeWidth="3" fill="none"/>
  <path d="M119 60c-26-11-42 7-34 30l12 25c12 10 28-4 28-18l4-25Z" fill="#a7aca3"/>
  <path d="M117 67c-16-4-28 5-23 21l10 18c8 1 14-10 14-20" fill="#c0bcb0" stroke="none"/>
  <path d="M145 105c8 10 17 14 27 9-7 13-23 12-30 2" fill="#fff4d5"/>
  {eyes(151,78,2.5)}<path d="M146 71q5-3 9 0m5 26 6 1m-7 7 7 1m-6 8 6 1m-5 8 5 1m-7 9 6 1M76 90l-6 11m3 7-3 8m61-52-3 13" stroke="#818d85" strokeWidth="1.2" fill="none"/>
 </>;break;
 case 'tiger':drawing=<>
  <path d="M147 111c41-4 40 36 24 38-8 0-13-8-6-13" fill="none" stroke="#c9802f" strokeWidth="10"/>
  <path d="m178 118 6 9m-1 7-7 5m-6 6-6-5" stroke="#3d3a30" strokeWidth="4" fill="none"/>
  <path d="m67 125-3 42h15l6-38m41-1 3 39h14l1-45" fill="#d29b4f"/>
  <path d="M52 96c21-25 71-20 93-4 13 11 12 36-9 46-17 9-54 5-70-4l-18-13" fill={coat}/>
  <path d="M62 128q36 22 78 2l-5 12-55-1" fill="#f2e1be" stroke="none"/>
  <path d="m51 120-4 48q8 6 21 0l9-43m27 11 5 32q8 5 20 0l-1-33" fill="#dfa34d"/>
  <path d="m50 162 13 1m49-1 13 1" stroke="#f1dfb8" strokeWidth="6"/>
  <path d="M56 71q-14-12-18-1l-1 9m35-6q12-13 17-2l-1 12" fill="#d39746"/>
  <path d="M42 75c-15 11-15 35 2 44 22 12 47 2 49-18 0-19-23-35-51-26Z" fill={coat}/>
  <path d="M44 96q-15 7-6 17l12 7 23-3c12-8 6-18-7-18" fill="#f4e6cf" stroke="none"/>
  <path d="m48 104 8 7 8-7q-8-5-16 0" fill="#9c7365"/><path d="M56 111v6m-11-3 11 3 11-3" fill="none" strokeWidth="1.2"/>
  {eyes(43,94,2)}{eyes(72,95,2)}
  <path d="m44 77 5 11m13-10-4 10m23 0-8 1m-39 9 7 3m-5 8 6-1m36-6-7 3m6 7-6-1m15-24 8 20-9-4m23-20-2 23 9-5m15-15-4 23 11-6m7 0-6 21m-59 8 12 3m-16 9 12 3m40-11 11-2m-8 12 12-2" stroke="#393930" strokeWidth="3.7" fill="none"/>
  <path d="m41 109-15-1m17 5-16 4m43-7 17 1m-16 4 16 5" fill="none" strokeWidth=".8"/>
 </>;break;
 case 'monkey':drawing=<>
  <path d="M120 139c60 18 63-42 41-48-16-5-22 11-12 19" stroke="#96724d" strokeWidth="8" fill="none"/>
  <path d="M93 95c-13 4-25 26-29 44l-14 19 6 5 18-18 18-27m19-20 20 34 9 23-7 3-13-20-17-21" fill="#ac8358"/>
  <path d="M85 135c-27 16-25 30-5 35l-6 10 22 1 4-7-11-12 12-12m9-12c24 9 30 22 18 32l12 10h-22l-8-8 5-11-14-10" fill="#a48058"/>
  <ellipse cx="101" cy="127" rx="25" ry="34" fill={coat}/><path d="M96 103c-20 12-20 46 4 48 23 0 18-32 6-46" fill="#d0b58c" stroke="none"/>
  <circle cx="74" cy="71" r="13" fill="#ad865f"/><circle cx="128" cy="71" r="13" fill="#ad865f"/><circle cx="74" cy="71" r="7" fill="#d0b08a" strokeWidth="1"/><circle cx="128" cy="71" r="7" fill="#d0b08a" strokeWidth="1"/>
  <path d="M72 67c-2-27 54-32 59-4l-3 23c-12 27-48 22-53-1Z" fill={coat}/>
  <path d="M80 68c6-17 17-7 22-5 8-8 20-8 22 7l-4 18c-8 15-32 14-39-1Z" fill="#d3b591"/>
  <ellipse cx="102" cy="88" rx="13" ry="9" fill="#d9c09f" strokeWidth="1"/>{eyes(90,73,2)}{eyes(114,73,2)}<path d="m98 84 3-1m3 0 3 1m-14 9q9 4 18-1" fill="none" strokeWidth="1.2"/>
  <path d="m84 54 7 6m5-9 5 8m10-8-4 9m-20 50-5 13m34-12 5 11m-36 29 7 6m19-5-6 6m-53 2 4 1m78-1 4-2" stroke="#896746" fill="none" strokeWidth="1"/>
 </>;break;
 case 'owl':drawing=<>
  <path d="m85 156-4 20m32-20 5 20m-43-2-6 5m12-5 4 5m27-5-4 5m10-5 8 5" stroke="#ac8f48" strokeWidth="2.5" fill="none"/>
  <path d="M63 39l19 10q18-5 37 0l18-10-5 24c15 31 13 67-1 87-11 16-49 19-65 0-16-20-20-53-5-86Z" fill="#a18a65"/>
  <path d="M75 94c-27 7-29 34-18 56l13-4 11-37m43-15c27 7 29 34 18 56l-13-4-11-37" fill="#78694f"/>
  <path d="M77 94c-9 27-7 56 25 64 29-9 32-38 19-64" fill="#d4c39c" stroke="none"/>
  <path d="M98 67c-30-28-52 17-31 34 13 14 28 4 34-8 8 14 24 22 36 6 18-20-8-57-36-32" fill="#e2d1a7" stroke="#8a795a" strokeWidth="1.6"/>
  <ellipse cx="81" cy="83" rx="10" ry="12" fill="#c49c3c"/><ellipse cx="121" cy="83" rx="10" ry="12" fill="#c49c3c"/>{eyes(81,83,5.5)}{eyes(121,83,5.5)}<path d="m95 101 6 13 6-13q-6-7-12 0" fill="#89806b"/>
  <path d="m85 116 4 7 5-4m13-3 5 7 5-4m-27 13 4 7 4-5m7-2 4 7 5-4m-21 10 5 6 5-6m-45-26 10 7m-10 0 11 7m-10 0 10 7m62-20-10 7m10 0-11 7m10 0-10 7m-69-73 8 7m32-7-8 7" stroke="#887653" strokeWidth="1.3" fill="none"/>
 </>;break;
 case 'mouse':drawing=<>
  <path d="M140 133c42 25 56-9 35-25" fill="none" stroke="#b49a89" strokeWidth="4"/>
  <path d="m77 143-5 22 15 2m31-22 12 16 14 3" fill="none" stroke="#ac9580" strokeWidth="3"/>
  <path d="M46 124c13-32 62-52 94-31 31 22 12 56-22 60-28 3-57-7-80-16-9-4-7-9 8-13Z" fill="#a69c8c"/>
  <ellipse cx="78" cy="103" rx="15" ry="20" transform="rotate(-20 78 103)" fill="#a69c8c"/><ellipse cx="78" cy="103" rx="10" ry="14" transform="rotate(-20 78 103)" fill="#c7ae9a" strokeWidth="1"/>
  <path d="M45 123c5-9 14-15 25-14" fill="none" stroke="#ccc0a9" strokeWidth="2"/>{eyes(54,124,2.4)}<ellipse cx="35" cy="133" rx="3.5" ry="2.5" fill="#ac8071" strokeWidth="1"/>
  <path d="m40 130-19-7m19 11-22 1m24 4-17 8M97 96l10-2m-4 7 12-2m-4 8 15-1m1 8 11 3m-21 9 12 5" stroke="#766f61" strokeWidth=".9" fill="none"/>
 </>;break;
 case 'turtle':drawing=<>
  <path d="m56 124-13 26 9 8 20-27m48-7 8 29 13-4-6-28" fill="#8e9b65"/>
  <path d="m38 124-18 9 21-2m100-19c23-21 45-11 43 2-2 18-27 24-43 15" fill="#9faa73"/>
  <path d="M36 130c-5-48 19-74 56-74 38 0 63 30 55 75-29 15-80 15-111-1Z" fill="#71804e"/>
  <path d="M43 126c-3-38 17-62 49-62 33 0 55 23 49 63-31 10-63 11-98-1Z" fill="#9b9e61"/>
  <path d="m73 69 20 17 25-15m-25 15-21 22-26-5m26 5 14 23m-14-23 45-1 23-6m-23 6-12 24m-12-45 24 21M39 130q54 20 105 0" fill="none" stroke="#586a40" strokeWidth="2"/>
  {eyes(174,113,2.3)}<path d="m176 124 8-3m-137 27 3 5m3-9 3 5m77-4 1 5m4-7 1 5m17-31 6-1" strokeWidth="1.2" fill="none"/>
 </>;break;
 case 'bee':drawing=<>
  <path d="m91 109-20 20-11 16m38-31-7 24-10 13m33-36 11 25 12 9m-38-47-4-22-11-11m29 34 9-21 14-6m-45 22-22-9-17 3" fill="none" stroke="#514a35" strokeWidth="2.3"/>
  <path d="M99 91C54 72 54 35 74 38c19 2 28 34 29 48 3-29 24-59 35-45 17 24-17 43-32 50" fill="#e5eee4" fillOpacity=".85"/>
  <path d="m100 86-24-40m29 39 27-36m-34 31L77 65m32 14 17-12" stroke="#aabcb2" strokeWidth="1" fill="none"/>
  <path d="M55 108c8-32 58-36 79-12l-1 25c-31 24-63 13-78-13Z" fill="#bca75a"/>
  <path d="M69 89q-6 14 2 33m14-39q-9 23 5 46m14-46q-10 23 4 45m15-39q-7 14-2 31" stroke="#504c37" strokeWidth="8" fill="none"/>
  <ellipse cx="139" cy="106" rx="15" ry="19" fill="#6b6244"/><ellipse cx="145" cy="103" rx="6" ry="10" fill="#383b30" strokeWidth="1"/>
  <path d="m133 90-1-15 9-8m3 23 8-13 10-2m-7 33 10 4-5 9" fill="none" strokeWidth="2"/>
  <path d="m67 98 3 4m15-9 2 5m18-4 2 5m20-1 2 5" stroke="#dac985" strokeWidth="1" fill="none"/>
 </>;break;
 case 'snake':drawing=<>
  <path d="M22 149c25 30 151 23 147-4-3-25-109-23-108 0 2 16 79 17 78-3-1-14-51-21-44-56l3-21" fill="none" stroke="#5a6c40" strokeWidth="21"/>
  <path d="M22 149c25 30 151 23 147-4-3-25-109-23-108 0 2 16 79 17 78-3-1-14-51-21-44-56l3-21" fill="none" stroke="#9eaa64" strokeWidth="16"/>
  <path d="M95 82c-18-6-21-22-11-32 7-10 31-11 39-2 16 15-3 31-15 34Z" fill="#9eaa64"/>
  <path d="M97 80c-9 16 0 29 15 36" fill="none" stroke="#c5bf87" strokeWidth="5"/>
  {eyes(88,58,1.9)}{eyes(117,56,1.9)}<path d="m102 72 11-1m-6 2 3 12 5 3m-5-3-3 5" stroke="#8b5a4b" fill="none" strokeWidth="1.2"/>
  <path d="m45 161 5-6m17 8 4-5m20 5 4-5m20 5 3-5m20 3 2-5m18-1 1-6m-79-13 5 5m14-7 4 5m15-4 3 4m-15-44 6-2m-5 9 7-2m-5 9 7-2" stroke="#78874c" strokeWidth="1.4" fill="none"/>
 </>;break;
 default:throw new Error('Unknown animal: '+kind);
 }
 return <g stroke="#534f3d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{defs}{drawing}</g>;
}
