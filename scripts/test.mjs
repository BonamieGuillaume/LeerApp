import {createRequire} from 'node:module'
import {mkdtemp,rm} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {spawnSync} from 'node:child_process'
const require=createRequire(import.meta.resolve('vite'));const {build}=require('esbuild')
const dir=await mkdtemp(join(tmpdir(),'leeratelier-test-'))
try{const file=join(dir,'tests.mjs');await build({entryPoints:['scripts/core.test.ts'],outfile:file,bundle:true,platform:'node',format:'esm',logLevel:'error'});const r=spawnSync(process.execPath,['--test',file],{stdio:'inherit'});process.exitCode=r.status??1}finally{await rm(dir,{recursive:true,force:true})}
