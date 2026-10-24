import type {ReactNode} from 'react';
import {AnimalArt,animalKinds} from './AnimalArt';

// A consistent set of sixteen literal, loop-free vector illustrations. Distinct
// anatomy and object silhouettes remain readable on small lesson cards.
export function ConsonantArt({kind,label}:{kind:string;label:string}){
 const ink='#674b40',cream='#fff4db',gold='#efb64f',blue='#91c9dc';
 let art:ReactNode;
 if(animalKinds.includes(kind))art=<AnimalArt kind={kind}/>;
 else switch(kind){
 case 'egg':art=<><ellipse cx="100" cy="177" rx="48" ry="6" fill="#eadfcb" stroke="none"/><path d="M49 120c0-40 31-96 51-96s51 56 51 96c0 35-23 55-51 55s-51-20-51-55Z" fill="#f4dfb7"/><path d="M71 88c-9 16-12 29-11 41" stroke="#fff9ea" strokeWidth="9" fill="none"/></>;break;
 case 'leaf':art=<><path d="M46 147c-14-58 31-90 116-115 6 77-24 143-93 133Z" fill="#8fbc72"/><path d="M35 180 143 55m-79 91-4-35m23 13-5-37m27 13-3-28m-20 73 44-1m-22-24 43-5m-23-20 30-7" stroke="#426f4e" fill="none" strokeWidth="3"/></>;break;
 case 'tray':art=<><path d="M35 61h130l-22 43c-10 16-75 16-85 0Z" fill={gold}/><ellipse cx="100" cy="61" rx="65" ry="16" fill="#ffe5a4"/><ellipse cx="100" cy="61" rx="50" ry="8" fill="#d99836" strokeWidth="2"/><path d="m58 83 13 9 15-9 14 11 14-11 15 9 13-9" stroke="#fff0c0" fill="none"/><path d="M91 115h18v22c0 10 15 15 26 22H65c11-7 26-12 26-22Z" fill={gold}/><ellipse cx="100" cy="159" rx="37" ry="10" fill={gold}/><path d="M63 159v12h74v-12" fill={gold}/></>;break;
 case 'boat':art=<><path d="M20 106q76 37 160-6l-21 42c-30 23-99 25-125-1Z" fill="#bc8154"/><path d="M22 106q78 26 155-5" stroke="#e1b47c" strokeWidth="7" fill="none"/><path d="m63 120 6 24m64-25-6 25m-83-4q57 20 109-4" stroke="#8c593e" fill="none" strokeWidth="2"/><path d="m131 51-51 98" stroke="#8c593e" fill="none" strokeWidth="7"/><path d="m80 143-14 17q-4 13 10 15l13-23Z" fill="#d7a473"/><path d="M19 174q15-9 31 0t31 0t31 0t31 0t31 0" stroke={blue} fill="none" strokeWidth="4"/></>;break;
 case 'tooth':art=<><path d="M100 41C39 13 24 55 41 99c6 16 12 48 17 64 7 20 20 16 24-5l18-40 18 40c4 21 17 25 24 5 5-16 11-48 17-64 17-44 2-86-59-58Z" fill="#fffdfa"/><path d="M100 41q19 11 32 4M60 55q-12 10-8 29" fill="none" stroke="#b4d6e1" strokeWidth="5"/><path d="m165 22 4 11 11 4-11 4-4 11-4-11-11-4 11-4Z" fill={gold} strokeWidth="2"/></>;break;
 case 'basin':art=<><path d="M25 89c3 63 20 79 75 79s72-16 75-79Z" fill="#91bfd0"/><ellipse cx="100" cy="88" rx="75" ry="27" fill="#d4e4e9"/><ellipse cx="100" cy="89" rx="60" ry="17" fill="#95cbdc"/><path d="M43 89q57 18 114 0" fill="none" stroke="#e8f6f8" strokeWidth="3"/><path d="M44 119q3 23 16 29" fill="none" stroke="#c9e2e9" strokeWidth="5"/></>;break;
 default:throw new Error('Missing consonant illustration: '+kind);
 }
 return <svg viewBox="0 0 200 200" role="img" aria-label={label} data-illustration={kind} fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><title>{label}</title>{art}</svg>;
}
