import json,csv
from pathlib import Path
root=Path(__file__).resolve().parents[1]
p=root/'src/content/module1.json'
d=json.loads(p.read_text())
lessons={s['code']:s for c in d['chapters'] for s in c['sections']}
rows=list(csv.reader((root/'sources/editorial-questions.tsv').open(),delimiter='|'))
assert len(rows)==112,len(rows)
d['questions']=[q for q in d['questions'] if q['origin']=='pdf']
for i,(code,prompt,correct,w1,w2) in enumerate(rows):
 l=lessons[code]
 opts=[correct,w1]+([w2] if w2 else [])
 shift=i%len(opts);opts=opts[shift:]+opts[:shift]
 d['questions'].append(dict(id=l['id']+'-check-v1',chapterId='m1-'+code[:3].replace('.','-'),lessonId=l['id'],kind='boolean' if not w2 else 'single',prompt=prompt,choices=opts,correct=str(opts.index(correct)),explanation=correct+'. '+l['body'],pages=l['pages'],difficulty='toepassing' if '?' in prompt and len(prompt)>100 else 'begrip',origin='editorial'))
# Several deliberately different formats; each has a deterministic answer.
def add(code,suffix,kind,prompt,choices,correct,**extra):
 l=lessons[code]
 d['questions'].append(dict(id=l['id']+'-'+suffix,chapterId='m1-'+code[:3].replace('.','-'),lessonId=l['id'],kind=kind,prompt=prompt,choices=choices,correct=correct,explanation=l['body'],pages=l['pages'],difficulty='toepassing',origin='editorial',**extra))
add('1.2.16','multi-v1','multi','Welke drie van deze opties behoren tot de zes AVG-rechtsgronden? Selecteer alle juiste antwoorden.',['Toestemming','Noodzakelijkheid voor de overeenkomst','Wettelijke verplichting','Een willekeurige marketingwens'],'0|1|2')
add('1.2.15','multi-v1','multi','Welke werkwijzen passen bij de privacybeginselen? Selecteer alle juiste antwoorden.',['Alle mogelijke medische gegevens verzamelen','Niet meer gegevens verwerken dan nodig','Gegevens veilig en vertrouwelijk houden','Zonder doel onbeperkt bewaren'],'1|2')
add('1.1.09','match-v1','match','Koppel elke rol aan de juiste omschrijving.',['Sluit het contract','Ontvangt de verzekeringsprestatie','Lijdt schade'],'0|1|2',matchLabels=['Verzekeringnemer','Begunstigde','Benadeelde'])
add('1.2.25','match-v1','match','Koppel de instantie aan haar rol.',['Privacytoezicht','Analyse verdachte verrichtingen','Prudentieel toezicht'],'1|2|0',matchLabels=['CFI','NBB','GBA'])
add('1.1.13','fill-v1','fill','Waarde 300.000 euro, verzekerd 180.000 euro, gedekte schade 30.000 euro. Vul de evenredige vergoeding in vóór vrijstelling (alleen het bedrag in euro).',[],'18000',accepted=['18.000','18 000','18000 euro','18.000 euro'])
add('1.2.34','fill-v1','fill','Hoe heet de stap waarbij je de opgegeven identiteit toetst aan betrouwbare onafhankelijke bewijsstukken?',[],'verificatie',accepted=['controle','controle/verificatie'])
p.write_text(json.dumps(d,ensure_ascii=False,indent=2))
print(len(d['questions']),'objectief beoordeelbare vragen')
