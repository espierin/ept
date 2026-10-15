# EFI EPT - lokale eerste implementatie

Versie 0.1 · 15 oktober 2026 · Taalpaar: DEVELOPMENT_EN.md

## Status en afbakening

Een werkende tweetalige browserapp voor **Werfen/Immucor xPONENT CSV + EDS**, getest met de publieke hlapro-mockruns voor klasse I en II. Het [browserprototype](https://espierin.github.io/ept/) wordt samen met de publieke conceptdocumentatie en stijlgidsen op GitHub Pages aangeboden. De verwerking blijft lokaal in de browser. Interne EFI-correspondentie en de mail-PDF blijven buiten de repository.

## Starten

Start vanuit de repositorymap: `node dev-server.mjs`. Open vervolgens [de lokale app](http://127.0.0.1:4173/app/). De server luistert uitsluitend op loopback en serveert alleen de mappen `app` en `docs`; `.local`, Git-bestanden en de bovenliggende projectmap worden niet aangeboden. Stop met Ctrl+C wanneer de preview niet meer nodig is.

De app start met het expliciet als mock gemarkeerde klasse-I-voorbeeld. Gebruik de voorbeeldknop Class II om de andere run te bekijken en bevestig de import. Eigen bestanden kunnen via bestandskeuze of slepen worden ingelezen. Kies één CSV en het bijpassende EDS. Bevestig techniek, provider/schema/ronde/sample en de combinatie van bron-Sample ID én well; andere wells worden geen peers.

## Wat werkt

- Strikte CSV-parsing met quotes, BOM, rijcontrole en afzonderlijke Median/Net MFI-secties.
- EDS-XML zonder DTD/entities, exacte lotcontrole, controlebeads, HLA-klasse en PL String-samenstelling.
- Bronwaarden, niet-positieve waarden, bead counts en SHA-256-herkomst; onbekende samenstelling wordt expliciet gemeld.
- Uitgelijnde Techniek/Locus-knoppen, eigen/peerlegenda, log10 als standaardschaal, Merge/Separate en NL/EN met behoud van rapportselecties.
- SVG-grafiek, CSV/JSON-download en zelfstandige SVG-export met ingesloten Montserrat en rapportmetadata.
- PNG-banner uit de image generator met het originele witte EFI-SVG-logo als afzonderlijke laag; vast topmenu met responsieve anker-offset.
- Uitsluitend lokale verwerking: geen POST, centrale opslag, browseropslag of automatische verzending van gekozen bestanden.

## Consensusdemonstratie

Vóór demovrijgave zijn alleen eigen data zichtbaar. Download het consensusvoorbeeld voor de actieve context en laad dat JSON-bestand lokaal terug. Alleen het expliciete synthetische schema wordt geaccepteerd; verkeerde provider/ronde/sample/techniek/klasse of ongeldige vrijgave wordt geweigerd. De voorbeeldcalls zijn `not_assessed`, niet afgeleid uit MFI.

Na validatie worden **gegenereerde synthetische** Werfen-peerwaarden getoond, nooit de andere wells van de bronrun als andere labs. Er zijn 18 synthetische referentielabs per meetdoel. Bij één vendor hebben Merge en Separate dezelfde data; de generieke analysefuncties zijn daarnaast getest met twee synthetische vendors. Intrekken verwijdert de peercontext.

Deze demonstratie is geen echte providerautorisatie. In productie vereist de vrijgave een bevoegde provider, contextgebonden private verwerking en toegangscontrole. Een lokale checkbox of bestandsnaam mag dat niet vervangen. Echte peerdata worden nu niet opgehaald of gepubliceerd.

## Nog niet gerealiseerd

Geen productieaccounts, centrale upload, private GitHub-datarepository, echte providerworkflow, gecertificeerde analyse of persistente opslag. One Lambda heeft alvast een vendoridentiteit en generieke analyseondersteuning, maar geen geteste importadapter. MATCH IT! volgt later. C1q/C3d blijven afzonderlijke technieken; echte complementexports zijn nog niet gevalideerd. HAML-import, lotoverschrijdende aggregatie, grotere datasets en formele statistische/publicatiedrempels zijn vervolgstappen.

## Testen

Unit- en analysetests: `node --test app/tests/core.test.mjs`.

Browserketen met draaiende lokale server: `node app/tests/browser.cjs`. Hiervoor is Playwright met Chrome nodig. Het script gebruikt standaard `playwright`; de variabele `EPT_PLAYWRIGHT_PATH` kan naar de module van een bestaande runtime wijzen. Er is geen frameworkbuild of npm-installatie nodig om de app te starten.

De eerste verificatie omvat 13 unit/analysetests en 13 browsercontroles: klasse I/II, CSV/EDS-koppeling, bronhash, verkeerde consensuscontext, privé-eigen toestand, synthetische vrijgave/intrekking, peerpunten aan/uit, exports, taalstatus, 390px-opmaak en sticky menu. Rapporten en screenshots staan lokaal in `.local/`; die map wordt niet gecommit. Productierechten zijn hiermee niet bewezen.

De online keten wordt afzonderlijk gecontroleerd met `node app/tests/online.cjs`: 15 controles via de echte interface en downloads, zonder lokale diagnosefunctie. Ook de hashes van online mockbestanden en appbestanden worden gecontroleerd. `EPT_BASE_URL` kan voor een controle vóór publicatie naar het lokale publicatiepakket wijzen. De standaard is `https://espierin.github.io/ept/`. De controles leggen ook HTTP-fouten en netwerkschrijfacties vast; het kiezen van een bestand hoort geen uploadrequest te veroorzaken.

## Bestanden en herkomst

`core.mjs` bevat import, mapping, validatie en statistiek. `app.mjs` beheert interface en lokale sessie. De grafiek gebruikt native SVG. De fixtures komen uit [hlapro](https://github.com/lcreteig/hlapro), met de aangetroffen MIT-licentie in `fixtures/LICENSE.md`; bron-URL, commit en hashes staan in `fixtures/provenance.json`. De bestanden zijn originele publieke mockbestanden en geen onafhankelijke deelnemersdatasets.

De documentatie op GitHub wordt uitsluitend opgebouwd uit `public_content` en expliciete publieke assets. De algemene [EFI-stijlgids](../docs/efi-style_NL.html) en [EPT-stijlgids](../docs/style_NL.html) zijn gescheiden en wederzijds gelinkt. De interne projectdocumenten zijn niet recursief naar de publieke site gekopieerd.

## Aparte dashboards per gebruiker

Het dashboard voor deelnemende labs bevat de eigen import, meetwaarden, rapportage en exports. Groepscontext wordt pas zichtbaar na vrijgave door de eigen EPT-provider. Het aparte providerdashboard bevat het overzicht per provider, schema/ editie, ronde, sample en techniek, plus consensusvalidatie en vrijgave. Providers en technieken blijven gescheiden.

In het huidige browserprototype wissel je met de dashboardkeuze tussen deze twee routes. Dit is navigatie binnen een simulatie, geen authenticatie of beveiligde autorisatie. Een nieuwe labimport vergrendelt de groepscontext opnieuw.
