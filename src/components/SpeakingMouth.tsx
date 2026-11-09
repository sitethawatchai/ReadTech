export function SpeakingMouth({active,label}:{active:boolean;label:string}){
 return <svg className={'speaking-mouth '+(active?'is-speaking':'')} viewBox="0 0 320 180" role="img" aria-label={label}>
  <path className="mouth-upper" d="M34 94C77 86 104 55 158 68C211 54 244 84 286 94C246 108 203 111 159 106C113 112 72 107 34 94Z"/>
  <path className="mouth-inside" d="M48 96C86 93 120 91 159 92C200 91 237 94 273 96C238 138 199 151 158 151C116 151 78 136 48 96Z"/>
  <path className="mouth-tongue" d="M91 132C112 120 137 118 159 123C184 118 207 122 226 133C206 145 184 151 158 151C133 151 110 145 91 132Z"/>
  <path className="mouth-lower" d="M34 94C69 112 100 151 158 154C218 151 252 114 286 94C251 144 208 169 158 169C107 169 66 143 34 94Z"/>
  <path className="mouth-highlight" d="M68 88C101 78 126 76 158 81C190 76 220 80 253 89"/>
 </svg>;
}
