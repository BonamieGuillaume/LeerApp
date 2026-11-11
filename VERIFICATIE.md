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

Dit zijn gerichte functionele controles, geen volledige onafhankelijke toets van elke wettelijke uitspraak, alle schermlezers of alle browsers. De 31 expliciet gemarkeerde inhoudsleemten vragen aanvullend bronmateriaal of een aparte actualiteitscontrole. Open antwoorden blijven zelfbeoordelingen.

## GitHub Pages en iPhone-uitbreiding

- GitHub-repository `BonamieGuillaume/LeerApp` is openbaar, met standaardbranch `main` en GitHub Pages ingesteld op GitHub Actions.
- Build met `/LeerApp/` geslaagd. PDF-links verwijzen naar `/LeerApp/studiegids-module-1.pdf`.
- 4 extra PWA-tests geslaagd: manifest en iconen, volledige offline precache inclusief PDF, uitsluitend eigen cacheversies opruimen en behoud van PDF-responses zonder andere websites of mutaties te onderscheppen. Samen met de bestaande leer-/opslagtests: 13 tests.
- In de browser verschijnt bevestiging dat de volledige cursus voor offline gebruik klaarstaat. Na uitschakelen van de lokale webserver blijft herladen en navigeren tussen broncontrole en instellingen werken.
- Appmanifest, Apple-touch-icoon, zelfstandige weergave en iPhone-installatiehulp toegevoegd. Installatie op een fysieke iPhone is niet op afstand uitgevoerd.
- Een GitHub Actions-workflow controleert, bouwt en publiceert na wijzigingen op `main`.

## Online publicatie bevestigd

- Alle 54 projectbestanden zijn via de aangemelde GitHub-browsersessie opgeslagen; geen persoonlijke voortgangs- of back-upbestanden. Aanmelden voor `git push` via de opdrachtregel was niet beschikbaar.
- De eerste publicatie is geslaagd: [GitHub Actions-run 43063829150](https://github.com/BonamieGuillaume/LeerApp/actions/runs/43063829150), commit `c88899fedc639dc83a88848f9562b575431d4878`.
- De inhoud van alle 54 opgeslagen bestanden is met de lokale bronbestanden vergeleken aan de hand van Git-blobhashes: geen verschillen vóór deze verslagupdate.
- De live website is geopend en het dashboard en lessenoverzicht zijn gecontroleerd: [Leeratelier](https://bonamieguillaume.github.io/LeerApp/).
- Het live appmanifest is beschikbaar, met `display: standalone`, Nederlandse taal en correcte relatieve iconen en startpagina.
- De live cursus-PDF is gedownload en byte voor byte gecontroleerd via SHA-256: `2adfa1e0d2d8dedd8395f5dc3f6bf44c4df83b1793ad10315b39e137fd4e7e6a`.
- Installeren op iPhone: open het live adres in Safari, kies Delen → Zet op beginscherm en voeg de app toe. De installatie op een fysieke iPhone moet de gebruiker zelf uitvoeren.
- Voortgang blijft lokaal op het apparaat; gebruik export/import voor overdracht. GitHub bevat de app en cursus, niet de persoonlijke studieresultaten.
