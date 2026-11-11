"""Deterministic conversion of all 27 pages. Never change published IDs in place."""
import json, re, hashlib
from pathlib import Path
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[1]
PDF=ROOT/'public/studiegids-module-1.pdf'
r=PdfReader(PDF)
assert len(r.pages)==27
pages=[p.extract_text() or '' for p in r.pages]
clean=[]
for n,text in enumerate(pages,1):
 lines=[s.strip() for s in text.splitlines() if s.strip() and not s.startswith('MODULE 1 |') and s.strip()!=str(n)]
 clean.append('\n'.join(lines))
lines=[(line,p) for p in range(3,21) for line in clean[p-1].splitlines()]
starts=[i for i,(line,_) in enumerate(lines) if re.match(r'^1\.[12]\.\d{2} ',line)]
assert len(starts)==112
starts.append(len(lines))
lessons=[]
for i in range(112):
 block=lines[starts[i]:starts[i+1]]
 code,title=block[0][0].split(' ',1)
 text=' '.join(t for t,_ in block[1:] if t!='1.2 Diverse wetgeving' and not t.startswith('Elke genummerde fiche') and not t.startswith('zelfstandig geformuleerd;'))
 body,tail=text.split('Praktijkvoorbeeld:',1)
 example,check=tail.split('Controleer jezelf:',1)
 # A heading at the next submodule boundary is not part of fiche 1.1.53.
 check=check.split('1.2 Diverse wetgeving')[0].strip()
 lessons.append(dict(id='m1-'+code.replace('.','-'),code=code,title=title,body=body.strip(),example=example.strip(),selfCheck=check,pages=sorted({p for _,p in block}),sourceKind='independent-guide'))
# Remove boundary explanatory paragraph carried after the final 1.1 fiche.
lessons[52]['selfCheck']='Leg het begrip uit, benoem de wettelijke consequentie en pas het toe op het voorbeeld.'
lessons[52]['pages']=[11]
chapters=[]
for part,title in [('1.1','Verzekeringscontract'),('1.2','Diverse wetgeving')]:
 sections=[s for s in lessons if s['code'].startswith(part+'.')]
 chapters.append(dict(id='m1-'+part.replace('.','-'),number=len(chapters)+1,title=title,part=part,pages=sorted({p for s in sections for p in s['pages']}),learningObjectives=[s['code']+' '+s['title'] for s in sections],sections=sections))
groups={
 '1.1':[(1,4,'Belgische verzekeringsmarkt'),(5,39,'Verzekeringsovereenkomsten'),(40,46,'Afhandeling van klachten'),(47,53,'Financiële vakbekwaamheid')],
 '1.2':[(1,6,'Verzekeringsdistributie'),(7,13,'Consumentenbescherming'),(14,23,'Gegevensbescherming'),(24,38,'Witwaswetgeving'),(39,55,'Informatievereisten en gedragsregels'),(56,59,'Bedrijfsethiek')]
}
for c in chapters:
 c['subchapters']=[dict(id=c['id']+f'-groep-{a:02}',title=title,lessonIds=[l['id'] for l in c['sections'] if a<=int(l['code'].split('.')[-1])<=b]) for a,b,title in groups[c['part']]]
qtext='\n'.join(clean[21:24])
qm=list(re.finditer(r'(?m)^(\d+)\. (.+)',qtext))
assert len(qm)==40
answertext='\n'.join(clean[24:26])
am={int(m[1]):m[2] for m in re.finditer(r'(?m)^(\d+)\. ([A-D])\.',answertext)}
links=['1.1.03','1.1.02','1.1.04','1.1.09','1.1.11','1.1.13','1.1.15','1.1.16','1.1.18','1.1.26','1.1.29','1.1.45','1.1.48','1.1.51','1.1.11','1.2.05','1.2.04','1.2.01','1.2.11','1.2.22','1.2.16','1.2.15','1.2.17','1.2.18','1.2.25','1.2.30','1.2.34','1.2.37','1.2.32','1.2.33','1.2.40','1.2.43','1.2.46','1.2.47','1.2.45','1.2.50','1.2.51','1.2.52','1.2.54','1.2.57']
questions=[]
for idx,m in enumerate(qm):
 n=idx+1
 text=' '.join(qtext[m.start():qm[idx+1].start() if idx<39 else len(qtext)].split())
 text=re.sub(r'^\d+\. ','',text)
 opts=list(re.finditer(r'\b([A-D])\. ',text))
 assert len(opts)==4,(n,text)
 choices=[text[o.end():opts[j+1].start() if j<3 else len(text)].strip() for j,o in enumerate(opts)]
 lesson=next(s for s in lessons if s['code']==links[idx])
 page=next(p+1 for p,t in enumerate(clean) if m.group(0) in t)
 questions.append(dict(id=f'm1-ed20261111-q{n:02}',chapterId='m1-'+lesson['code'][:3].replace('.','-'),lessonId=lesson['id'],kind='single',prompt=text[:opts[0].start()].strip(),choices=choices,correct=str('ABCD'.index(am[n])),explanation=lesson['body'],pages=sorted(set(lesson['pages']+[page,25 if n<=32 else 26])),difficulty='begrip',origin='pdf'))
ct=clean[20]
cm=list(re.finditer(r'(?m)^Casus (\d+): (.+)',ct))
casecodes=['1.1.13','1.1.15','1.1.26','1.2.42','1.2.18','1.2.33','1.2.47','1.1.45']
cases=[]
for i,m in enumerate(cm):
 code=casecodes[i]
 cases.append(dict(id=f'm1-ed20261111-case{i+1:02}',number=i+1,chapterId='m1-'+code[:3].replace('.','-'),lessonId='m1-'+code.replace('.','-'),title=m[2],prompt='Beschrijf je aanpak en motiveer die vanuit de cursus.',modelAnswer=' '.join(ct[m.end():cm[i+1].start() if i<7 else len(ct)].split()),pages=[21]))
coverage=[]
for p,t in enumerate(clean,1):
 coverage.append(dict(page=p,kind='Theorie' if 3<=p<=20 else 'Casussen' if p==21 else 'Oefenvragen' if 22<=p<=24 else 'Antwoorden' if 25<=p<=26 else 'Bronnen en leerplanning' if p==27 else 'Inleiding',processed=True,text=t,lessonIds=[s['id'] for s in lessons if p in s['pages']],questionIds=[q['id'] for q in questions if p in q['pages']]))
out=dict(id='m1',title='Verzekeringsdistributie in België',contentVersion='2026.11.11.1',sourceDate='2026-11-11',sourceTitle='Uitgebreide examengerichte studiegids voor 1.1 en 1.2',sourceType='Onafhankelijke studiegids; geen officiële Certassur-syllabus',sourceFile='/studiegids-module-1.pdf',sourcePageCount=27,sourceSha256=hashlib.sha256(PDF.read_bytes()).hexdigest(),chapters=chapters,questions=questions,cases=cases,coverage=coverage,sourceLinks=[dict(title='Certassur: examens en eindtermen',url='https://www.certassur.be/nl/exameninfo/examens-en-eindtermen'),dict(title='Eindtermen 1.1 (04/11/2024)',url='https://www.certassur.be/images/docs/Certassur-Eindtermen-Examen-1-Basiskennis-Deel-1.pdf'),dict(title='Eindtermen 1.2 (26/09/2024)',url='https://www.certassur.be/images/docs/Certassur-Eindtermen-Examen-1-Basiskennis-Deel-2.pdf')])
(ROOT/'src/content/module1.json').write_text(json.dumps(out,ensure_ascii=False,indent=2))
print(f'Verwerkt: {len(clean)} pagina’s, {len(lessons)} fiches, {len(questions)} vragen, {len(cases)} casussen.')
