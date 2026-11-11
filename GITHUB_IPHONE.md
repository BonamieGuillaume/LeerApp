# Publiceren via GitHub en gebruiken op je iPhone

Repository: https://github.com/BonamieGuillaume/LeerApp

Verwacht websiteadres na een geslaagde publicatie:
**https://bonamieguillaume.github.io/LeerApp/**

## Eerste publicatie

1. Plaats de **inhoud** van dit project in de hoofdmap van de repository. `package.json`, `src/`, `public/` en `.github/` horen direct bovenaan. Zet niet de hele map `verzekeringen-leerplatform` als extra tussenmap in de repository.
2. Controleer dat `.github/workflows/deploy-pages.yml` is meegestuurd. Deze map is verborgen in Finder; toon verborgen bestanden zo nodig met Command+Shift+punt. Upload geen `node_modules/`, `.git/`, `.env`-bestanden, persoonlijke back-ups of `output/`.
3. Open https://github.com/BonamieGuillaume/LeerApp/settings/pages en kies onder **Build and deployment → Source → GitHub Actions**.
4. Open https://github.com/BonamieGuillaume/LeerApp/actions en kies **Publiceer Leeratelier**. Als de eerste run al mislukte voordat Pages was ingesteld, kies **Run workflow → main → Run workflow** of **Re-run all jobs**.
5. Wacht tot zowel `build` als `deploy` groen zijn. Open daarna het websiteadres hierboven. Een upload of groene build alleen is nog geen bevestigde publicatie; ook de deploy moet slagen.

De workflow installeert de vastgelegde dependencies, controleert de cursus en leerlogica, bouwt de app met `/LeerApp/` als basispad en publiceert uitsluitend `dist/`. Je hoeft `dist/` zelf niet in Git te bewaren. Er is geen eigen server of geheim token in de app nodig. Het tijdelijke publicatietoken wordt door GitHub Actions beheerd.

De repository is openbaar. De website bevat de appcode, cursus en oefenvragen. Persoonlijke voortgang wordt in de browser bewaard en wordt niet door deze app naar GitHub verstuurd.

## Op je iPhone zetten

1. Open **Safari** op je iPhone en ga naar https://bonamieguillaume.github.io/LeerApp/ nadat de publicatie geslaagd is.
2. Tik op **Delen**. Kies zo nodig **Toon meer** en daarna **Zet op beginscherm**.
3. Schakel **Open als webapp** in als die optie beschikbaar is.
4. Gebruik de naam **Leeratelier** en tik op **Voeg toe**.
5. Open Leeratelier via het icoon op je beginscherm. Ga naar **Instellingen & back-up**. Zodra daar staat dat de cursus offline is klaargezet, kun je de opgeslagen versie ook zonder internet openen. De browser kan lokale data later wissen; maak geregeld een back-up.

Dit levert een webapp op je beginscherm op. Je hoeft hiervoor niets in de App Store te publiceren. De installatie op het fysieke toestel moet je zelf uitvoeren; die is niet op afstand bevestigd.

Apple-handleiding: https://support.apple.com/nl-nl/guide/iphone/iphea86e5236/ios

## Bestaande voortgang meenemen

1. Open de oude app op je computer en kies **Instellingen & back-up → Exporteer JSON-back-up**.
2. Bewaar die back-up bijvoorbeeld in Bestanden/iCloud Drive.
3. Open de geïnstalleerde webapp op je iPhone en kies **Importeer back-up**.
4. Controleer het overzicht en kies **Samenvoegen en bewaren**. Controleer daarna je leesvoortgang en examens.

Lokale opslag op je Mac, de GitHub-website en de webapp op je iPhone is niet automatisch gesynchroniseerd. Controleer je gegevens ook na installatie op het beginscherm; importeer zo nodig je back-up in de geïnstalleerde app.

## Latere updates en nieuwe modules

Werk de bronbestanden bij en upload/push naar `main`. Dezelfde workflow publiceert opnieuw op hetzelfde adres. Behoud alle inhouds-ID's en de bestaande opslagversies zoals beschreven in `CONTENT_GUIDE.md`.

De offlinekopie heeft een inhoudsafhankelijke versie. Een nieuwe versie wordt gedownload en wacht tot alle vensters van Leeratelier gesloten zijn. Daarmee wordt een lopend examen niet automatisch herladen. Ga na een update even online, sluit alle appvensters en open opnieuw. De cache-update wist geen studievoortgang.

## Lokaal bouwen

```sh
pnpm install --frozen-lockfile
pnpm check
VITE_BASE_PATH=/LeerApp/ pnpm build
VITE_BASE_PATH=/LeerApp/ pnpm check:pwa
```

Voor de bestaande lokale start op `/` bouw je zonder `VITE_BASE_PATH`: `pnpm build`. GitHub Actions zet het Pages-pad automatisch voor je.

Officiële achtergrond:
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://vite.dev/guide/static-deploy.html#github-pages
