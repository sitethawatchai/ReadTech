export function BookFriend({ className = '', mood = 'happy' }: { className?: string; mood?: 'happy'|'retry' }) {
  const retry=mood==='retry';
  return <svg className={className} viewBox="0 0 320 280" aria-hidden="true">
    <ellipse cx="162" cy="245" rx="84" ry="11" fill="#d9dde7" />
    <path d="M100 207l-12 30m125-30 12 30" stroke="#9d174d" strokeWidth="12" strokeLinecap="round" />
    <path d={retry?"M74 141 48 176m198-35 26 35":"M74 141 44 165m202-24 28-23"} stroke="#9d174d" strokeWidth="12" strokeLinecap="round" />
    <path d="M69 73q45-22 92 8 48-30 92-8v139q-43-22-92 7-49-29-92-7z" fill="#92d9cc" stroke="#9d174d" strokeWidth="4" strokeLinejoin="round" />
    <path d="M77 64q42-18 84 10 45-28 83-10v138q-42-17-83 9-42-26-84-9z" fill="#fffef5" stroke="#9d174d" strokeWidth="4" strokeLinejoin="round" />
    <path d="M161 74v137" stroke="#e7b8c9" strokeWidth="4" />
    <circle cx="126" cy="134" r="9" fill="#603744" /><circle cx="193" cy="134" r="9" fill="#603744" /><circle cx="129" cy="131" r="3" fill="white"/><circle cx="196" cy="131" r="3" fill="white"/>
    <ellipse cx="111" cy="151" rx="12" ry="7" fill="#f5aac5" /><ellipse cx="208" cy="151" rx="12" ry="7" fill="#f5aac5" />
    {retry&&<path d="m114 114 20-5m51 0 20 5" stroke="#603744" strokeWidth="4" strokeLinecap="round"/>}
    <path d={retry?"M145 169q16-15 32 0":"M144 155q17 20 34 0"} stroke="#603744" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="m80 208-13 28 23 2 8-25m108 0 8 25 23-2-13-28" fill="#efbb67" stroke="#9d174d" strokeWidth="3" strokeLinejoin="round"/>
    {retry?<g><circle cx="260" cy="54" r="30" fill="#fff0eb" stroke="#b84938" strokeWidth="4"/><path d="m250 44 20 20m0-20-20 20" fill="none" stroke="#b84938" strokeWidth="6" strokeLinecap="round"/></g>:<>
    <path d="m249 37 5 12 13 2-10 9 2 13-11-6-12 6 3-13-10-9 14-2z" fill="#efbb67" />
    <path d="m49 60 3 8 9 2-7 6 2 9-8-4-8 4 2-9-7-6 9-2z" fill="#efbb67" />
    <path d="M136 35q3-15 12-11 10 2 2 15l-10 10z" fill="#e98db0" />
    </>}
    <path d="M91 91h28m-28 12h20m73-12h35m-35 12h26" stroke="#e6ccd5" strokeWidth="4" strokeLinecap="round" />
  </svg>;
}
