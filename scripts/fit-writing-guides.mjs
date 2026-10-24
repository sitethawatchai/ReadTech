// Regenerate font outlines with the explicitly authored Thai pen routes.
// This compatibility entry point intentionally does NOT skeleton-fit the pen.
import {writingStrokes} from './writing-strokes.mjs';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const temp=mkdtempSync(join(tmpdir(),'readtech-writing-'));
try{
 const records=join(temp,'strokes.json');writeFileSync(records,JSON.stringify(writingStrokes));
 execFileSync(process.env.READTECH_PYTHON||'python3',[join(dirname(fileURLToPath(import.meta.url)),'fit-writing-guides.py'),records],{stdio:'inherit'});
}finally{rmSync(temp,{recursive:true,force:true});}
