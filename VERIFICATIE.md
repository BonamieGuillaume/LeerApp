# Verificatie van de eerste werkende versie

Uitgevoerd op 11 november 2026.

## Geautomatiseerd

- Productiebuild met Vite en TypeScript geslaagd, zonder buildwaarschuwingen na opsplitsing van cursus- en bibliotheekbestanden.
- Broncontrole geslaagd: SHA-256 van de PDF, alle 27 paginateksten, 112 leerfiches met oorspronkelijke uitleg en voorbeelden, unieke inhouds-ID's, 10 subhoofdstukken, 158 vragen, 8 casussen en overeenkomst van de 40 originele antwoorden met de antwoordsleutel.
- 9 tests geslaagd: alle vraagtypes en foute antwoorden, herhalingsintervallen, afzonderlijke leesvoortgang/beheersing, minimale 24-uursherhaling, onbeantwoorde examenvragen, eenmalige examenafsluiting en deadline, opslag/back-up-rondgang met lopend examen, migraties met historische ID's, afwijzing van beschadigde gegevens zonder overschrijven, idempotente importfusie en behoud van recentere herhalingsgegevens bij een oud verlopen examen.

## In de browser

De testgegevens zijn uitsluitend gebruikt op `http://localhost:5173`. De gebruikersomgeving gebruikt `http://127.0.0.1:5173` en heeft een afzonderlijke browseropslag.

- Dashboard toont lege scores vóór de eerste antwoorden; geen vooraf ingevulde resultaten.
- Theorie als gelezen markeren blijft bewaard na herladen.
- Fout antwoord toont correct antwoord, bron en uitleg en wordt ingepland voor herhaling.
- Proefexamen van drie vragen hervat na herladen op vraag 2 met het eerste antwoord behouden.
- Eén correct antwoord plus twee onbeantwoorde vragen levert 1/3 en 33% op, met rapport per hoofdstuk.
- Import van een gecontroleerde verlopen proef sluit automatisch af op de deadline en behoudt bestaande gegevens.
- Koppelvraag met drie rollen wordt correct beoordeeld en opgeslagen.
- JSON-export daadwerkelijk gedownload en opnieuw geparseerd: gegevensversie, leesvoortgang en beide proefexamens aanwezig.
- Donkere weergave werkt en blijft behouden na herladen.
- Responsieve controle op 390 × 844 pixels: menu openen, navigeren, dashboard en leszoekfunctie.
- Zoeken op Onderverzekering geeft de juiste fiche in het juiste subhoofdstuk.
- Studieplan bewaart het dagbudget en een via toetsenbord gekozen examendatum, berekent de resterende dagen en plant zwakke onderwerpen eerst.
- De productiebuild wordt met het meegeleverde lokale startprogramma geserveerd; de browser meldt geen JavaScript-fouten tijdens de gecontroleerde routes.

## Grenzen

Dit zijn gerichte functionele controles, geen volledige onafhankelijke toets van elke wettelijke uitspraak, alle schermlezers of alle browsers. De 31 expliciet gemarkeerde inhoudsleemten vragen aanvullend bronmateriaal of een aparte actualiteitscontrole. Open antwoorden blijven zelfbeoordelingen. Online publicatie is niet uitgevoerd: automatische goedkeuringscontrole blokkeerde de upload van projectcode naar de remote privébronopslag. Lokale werking is onafhankelijk daarvan gecontroleerd.

## GitHub Pages en iPhone-uitbreiding

- GitHub-repository `BonamieGuillaume/LeerApp` live gecontroleerd: openbaar, leeg, standaardbranch `main`; Pages nog niet actief.
- Build met `/LeerApp/` geslaagd. PDF-links verwijzen naar `/LeerApp/studiegids-module-1.pdf`.
- 4 extra PWA-tests geslaagd: manifest en iconen, volledige offline precache inclusief PDF, uitsluitend eigen cacheversies opruimen en behoud van PDF-responses zonder andere websites of mutaties te onderscheppen. Samen met de bestaande leer-/opslagtests: 13 tests.
- In de browser verschijnt bevestiging dat de volledige cursus voor offline gebruik klaarstaat. Na uitschakelen van de lokale webserver blijft herladen en navigeren tussen broncontrole en instellingen werken.
- Appmanifest, Apple-touch-icoon, zelfstandige weergave en iPhone-installatiehulp toegevoegd. Installatie op een fysieke iPhone is niet op afstand uitgevoerd.
- Een GitHub Actions-workflow bouwt en publiceert na een push. De daadwerkelijke push is nog niet uitgevoerd: automatische goedkeuringscontrole vraagt expliciete toestemming om de cursus-PDF en inhoud openbaar in de opgegeven repository te publiceren. Er is dus nog geen bevestigde live GitHub Pages-versie of geslaagde CI-run.

## Hervatting van de GitHub-publicatie

- De huidige bronbestanden zijn opnieuw gecontroleerd: 54 projectbestanden; geen persoonlijke voortgangs- of back-upbestanden. De 27-pagina-studiegids bevat algemene theorie, voorbeelden en vragen; geen e-mailadressen of IBAN's aangetroffen.
- De hernieuwde git-push werd na die controle toegelaten, maar kon niet aanmelden: geen GitHub-gebruikersgegevens beschikbaar voor de opdrachtregel.
- De bestaande Opera-sessie is aangemeld als eigenaar van BonamieGuillaume/LeerApp.
- In de repository is Settings → Pages → Source succesvol opgeslagen als GitHub Actions. GitHub bevestigde: GitHub Pages source saved.
- De browserupload is nog niet uitgevoerd: de ChatGPT-browserextensie verlangt de instelling Allow access to file URLs. Die beveiligingsinstelling is niet door de agent gewijzigd.
- Eerstvolgende stap: gebruiker schakelt bestandstoegang voor de extensie in Opera in; vervolgens bestanden uploaden, workflow volgen en het live websiteadres controleren. De repository bevat op dit moment nog geen appbestanden en de website is niet als live bevestigd.
