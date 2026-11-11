import fs from 'node:fs'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
const c=JSON.parse(fs.readFileSync('src/content/module1.json','utf8'))
const pages=JSON.parse(fs.readFileSync('sources/module1-pages.json','utf8'))
const ls=c.chapters.flatMap(v=>v.sections)
assert.equal(c.sourcePageCount,27);assert.equal(c.coverage.length,27);assert.equal(ls.length,112)
assert.equal(c.chapters[0].sections.length,53);assert.equal(c.chapters[1].sections.length,59)
assert.equal(c.questions.length,158);assert.equal(c.cases.length,8)
assert.equal(c.sourceSha256,crypto.createHash('sha256').update(fs.readFileSync('public/studiegids-module-1.pdf')).digest('hex'))
const unique=(items)=>assert.equal(new Set(items).size,items.length,'Dubbele ID of vraag')
unique([...ls,...c.chapters,...c.questions,...c.cases].map(v=>v.id))
unique(c.questions.map(q=>q.prompt.trim().toLowerCase()))
for(const p of c.coverage){assert.equal(p.processed,true);assert.ok(p.text.trim());const clean=pages[p.page-1].split('\n').map(l=>l.trim()).filter(l=>l&&!l.startsWith('MODULE 1 |')&&l!==String(p.page)).join('\n');assert.equal(p.text,clean)}
const allSource=pages.join(' ').replace(/\s+/g,' ')
for(const l of ls){assert.ok(l.id&&l.title&&l.body&&l.example&&l.selfCheck);assert.ok(allSource.includes(l.body),l.id+' mist brontekst');assert.ok(allSource.includes(l.example),l.id+' mist voorbeeld');assert.ok(c.questions.some(q=>q.lessonId===l.id),'Geen kenniscontrole voor '+l.id);for(const p of l.pages)assert.ok(p>=3&&p<=20)}
for(const q of c.questions){assert.ok(ls.some(l=>l.id===q.lessonId));assert.ok(c.chapters.some(l=>l.id===q.chapterId));assert.ok(q.explanation&&q.pages.length);for(const p of q.pages)assert.ok(p>=1&&p<=27);if(q.kind!=='fill'){unique(q.choices.map(v=>v.toLowerCase()));for(const a of q.correct.split('|'))assert.ok(q.choices[Number(a)]);if(q.kind==='single'||q.kind==='boolean')assert.ok(!q.correct.includes('|'))}else assert.ok(q.correct)}
const answers=new Map([...pages.slice(24,26).join('\n').matchAll(/(?:^|\n)(\d+)\. ([A-D])\./g)].map(m=>[Number(m[1]),String('ABCD'.indexOf(m[2]))]))
assert.equal(answers.size,40)
for(let i=1;i<=40;i++)assert.equal(c.questions.find(q=>q.id===`m1-ed20261111-q${String(i).padStart(2,'0')}`).correct,answers.get(i))
console.log('OK: alle 27 pagina’s, 112 fiches met voorbeelden, 158 vragen, 8 casussen, unieke ID’s, paginakoppelingen en 40 bronantwoorden gecontroleerd.')
