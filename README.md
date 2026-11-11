# Verzekeringen Leeratelier

Een werkende Nederlandstalige React/TypeScript-app voor persoonlijke zelfstudie.

## GitHub Pages en iPhone

Dit project is voorbereid voor de repository **BonamieGuillaume/LeerApp**, automatische publicatie met GitHub Actions en installatie als webapp op de iPhone. Zie **GITHUB_IPHONE.md** voor de eenmalige instelling, installatie en het overzetten van je voortgang. De online versie krijgt `/LeerApp/` als basispad; lokaal bouwen zonder die instelling blijft mogelijk.


## Meteen lokaal gebruiken op deze Mac

Dubbelklik op **Start Leeratelier.command**. Het platform opent op **http://127.0.0.1:5173/**. Laat het terminalvenster open tijdens het studeren. Stop met Ctrl+C. De gebouwde app staat in `dist/`; Python 3 volstaat om die lokaal te gebruiken. De startknop gebruikt zo nodig de gebundelde Codex-Python op deze Mac.

Gebruik telkens hetzelfde adres, dezelfde poort en hetzelfde browserprofiel. `localhost` en `127.0.0.1` hebben afzonderlijke browseropslag. Exporteer een JSON-back-up voordat je van adres, browser of apparaat wisselt. De app bevat geen vooraf ingevulde studieresultaten. De browsercontroles gebeurden op het afzonderlijke testadres `localhost`.

## Wat werkt

- Dashboard met werkelijk geregistreerde voortgang, beantwoorde vragen, examengemiddelde, actieve studietijd, studiedagen en aanbevelingen.
- Vier vaste moduleslots. Alleen module 1 is gevuld; modules 2–4 wachten op hun PDF.
- Alle 27 PDF-pagina's verwerkt: 2 hoofdstukken, 10 subhoofdstukken, 112 leerfiches met voorbeelden en open zelfcontrole, 8 toepassingscasussen.
- 158 automatisch beoordeelbare vragen: 40 uit de PDF en 118 aanvullende vragen op basis van dezelfde leerstof.
- Meerkeuze, juist/fout, meerdere antwoorden, koppelen en invullen. Open antwoorden zijn duidelijk gemarkeerde zelfbeoordelingen.
- Losse leesvoortgang, oefenhistoriek, beheersing, moeilijke markeringen en herhalingsagenda.
- Aangepaste SM-2-benadering: fout na 10 minuten, correct na 1 en 3 dagen en vervolgens een groeiend interval; moeilijk maximaal 1 dag.
- Proefexamens per hoofdstuk, module of alle beschikbare modules; aantal, tijd, moeilijkheid, vraagselectie en volgorde instelbaar. Geen feedback tijdens een proef. Hervatten na herladen en automatische indiening bij tijdsverloop.
- Examengeschiedenis, uitleg, hoofdstukresultaten en vergelijkingen. Elke vraag telt even zwaar; koppelen en meerdere antwoorden krijgen uitsluitend punten als alles juist is. Open vragen worden niet automatisch nagekeken en zitten niet in getimede proeven.
- Werkelijke statistieken met aanklikbare examengrafiek, studieplan met examendatum en dagbudget, licht/donker en mobiele navigatie.
- Lokale persistente opslag met gegevensversies, herstelkopie, foutmeldingen, JSON-export en gecontroleerde import met samenvoeging.
- Een controlepagina met volledige paginateksten, paginaverwijzingen, verwerking per hoofdstuk en 31 gemarkeerde inhoudsleemten.

## Inhoudelijke grenzen

De primaire bron is `Studiegids_Module_1_1_en_1_2_Uitgebreid.pdf`, editie 11 november 2026. Deze onafhankelijke gids vermeldt zelf dat hij **geen officiële Certassur-syllabus** is. Alle aanwezige theorie is opgenomen, maar volledige verwerking van deze PDF bewijst geen volledige beheersing of dekking van de officiële examenstof. De gids werkt onder meer verschillende wettelijke termijnen, procedures en uitzonderingen niet concreet uit. De app markeert vastgestelde leemten; er is geen volledige juridische actualiteitsaudit uitgevoerd.

De gepubliceerde Certassur-examenstructuur en beide eindtermendocumenten zijn op 11 november 2026 geraadpleegd. De structuur vermeldt voor 1.1 en 1.2 elk 20 vragen en één uur. De 10 subhoofdstukken groeperen de fiches volgens de onderwerpen van die eindtermendocumenten; de labels zijn verkort. De vragenbank en standaardscoregrenzen in deze app zijn eigen oefenmateriaal. Ze zijn geen officiële examenvragen of officiële slaagcriteria.

Bronnen:
- https://www.certassur.be/nl/exameninfo/examens-en-eindtermen
- https://www.certassur.be/images/docs/Certassur-Eindtermen-Examen-1-Basiskennis-Deel-1.pdf (versie 04/11/2024)
- https://www.certassur.be/images/docs/Certassur-Eindtermen-Examen-1-Basiskennis-Deel-2.pdf (versie 26/09/2024)

## Voortgang en beheersing

Een les is afgerond zodra de theorie als gelezen staat én alle bijbehorende vragen minstens eenmaal geprobeerd zijn. Lezen alleen levert geen beheersing op. Voor **beheerst** moeten alle lesvragen geprobeerd zijn, moet de score van de laatste antwoorden minstens de ingestelde beheersingsgrens zijn, moet minstens één vraag correct herhaald zijn na minimaal 24 uur en mogen er geen laatste fouten of moeilijke markeringen meer zijn. Een hoofdstuk is beheerst als alle lessen beheerst zijn. Die laatste voorwaarde maakt de beheersingsnorm bewust strenger dan alleen de scoregrens.

Standaarddoelen: <60% onvoldoende, 60–79% extra oefenen, 80–89% goed, ≥90% zeer goed. Instelbaar, niet officieel. De percentages voor antwoorden tellen daadwerkelijk ingevulde pogingen; onbeantwoorde examenvragen tellen wel als fout binnen de examenscore en in de herstelagenda. Vergelijkingen tussen proeven vermelden dat vraagmixen kunnen verschillen.

Het dashboard toont zowel beschikbare leerstof als vaste trajectdekking. Elke module draagt maximaal 25 procentpunt bij aan de opgebouwde leesvoortgang van het volledige traject. Een later gevulde module verlaagt de al verdiende bijdrage van een bestaande module niet. Dit is een persoonlijke voortgangsconventie, geen officiële examenweging.

De tijdmeter registreert met intervallen van maximaal 15 seconden, alleen wanneer de pagina zichtbaar en gefocust is en er in de laatste twee minuten activiteit was. Niet-opgeslagen seconden van het laatste interval kunnen bij abrupt afsluiten ontbreken. Studieplanning is een raming op basis van 5 minuten per fiche, werkelijke herhalingsdata en een periodieke oefenproef. De planning wordt opnieuw berekend na voortgang; zij voorspelt geen toekomstige leerresultaten.

## Ontwikkeling en controles

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm build
```

`pnpm check` controleert de inhoud, voert de tests van het leer- en opslagsysteem uit en controleert TypeScript. `pnpm build` maakt `dist/` opnieuw. De gekozen publicatieroute is nu GitHub Pages. `.github/workflows/deploy-pages.yml` bouwt en publiceert de app. Eventuele oude lokale Sites-instellingen in `.openai/` worden niet meegestuurd naar GitHub. Raadpleeg de Actions-status om te zien of de online publicatie daadwerkelijk geslaagd is.

## Architectuur en uitbreiden

- `src/types.ts`: afzonderlijke versies van het inhoudsmodel en de voortgang.
- `src/content/module1.json`: cursusinhoud, vragen, bronverwijzingen en dekking.
- `src/content/index.ts`: permanente moduleslots en indexen; hier extra modules registreren.
- `src/lib/learning.ts`: beoordeling, beheersing, herhaling en examenafhandeling.
- `src/lib/storage.ts`: versievalidatie, migraties, lokale repository en back-upformaat.
- `src/lib/useStudy.ts`: centrale toegang voor de interface, opslagmeldingen en importfusie. Dit is de integratiegrens voor een latere asynchrone databaseadapter en accounts.
- `src/components/`: afzonderlijke gebruikersfuncties.
- `sources/module1-pages.json`: volledige oorspronkelijke tekstextractie voor controle.
- `sources/editorial-questions.tsv`: redactionele lescontroles; gegenereerde bronvragen en lesvragen blijven bewust onderscheiden. Gelijke begrippen keren soms doelbewust terug tussen een lescontrole en een gemengde oefenproef.
- `sources/legacy-module1.json`: onaangeroerd archief van de aangetroffen eerdere inhoud; wordt niet in de app geladen. Nieuwe vragen kregen andere ID's zodat oude resultaten nooit bij een andere vraag terechtkomen.

Zie `CONTENT_GUIDE.md` voor de procedure om een volgende PDF veilig toe te voegen.

## Nog niet aanwezig

Modules 2–4 hebben nog geen leerinhoud. Er zijn geen accounts, centrale database of automatische synchronisatie tussen apparaten. Vrije teksten krijgen geen automatische inhoudelijke AI-beoordeling. Er is geen automatische PDF-import of live synchronisatie vanuit ChatGPT naar een gedeployde app. Of de online versie gepubliceerd is, blijkt uit de geslaagde deploy-run in GitHub Actions.

Lokale browseropslag kan door de browser of gebruiker gewist worden en heeft een capaciteitslimiet. De app meldt opslagproblemen en biedt export en een vorige lokale kopie; maak daarom regelmatig externe JSON-back-ups. Voor gelijktijdig studeren op meerdere apparaten is later een database nodig.
