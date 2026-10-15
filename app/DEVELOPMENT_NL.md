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

## Rollen, inloggen en deelnemersworkflow

Er zijn drie demorollen: admin, provider en participant. Admin espierin ziet het accountoverzicht en kan de dashboards voor beide andere rollen bekijken. Provider provider_1 ziet de consensusroute. Participant participant_1 kiest eerst de eigen EPT-schema’s en vendors, importeert daarna CSV en EDS en ziet pas na bevestiging de analyses. De rapportage blijft met de ingeschreven provider en schema-editie gekoppeld. Een One Lambda-deelname kan al worden geregistreerd; de One Lambda-importer is nog niet beschikbaar.

Via Mijn profiel kun je optioneel een e-mailadres toevoegen en je wachtwoord wijzigen. Wachtwoord wijzigen vereist het huidige wachtwoord en een herhaling van het nieuwe wachtwoord. Er worden geen e-mails verstuurd en er is nog geen herstel via e-mail. Bij uitloggen verdwijnen de geïmporteerde resultaten en referentiedata uit de sessie.

Dit is een lokale accountsimulatie op GitHub Pages. De site bevat gezouten PBKDF2-SHA256-verifiers met 210.000 iteraties, geen leesbare startwachtwoorden. Gewijzigde wachtwoorden, e-mail en schema-inschrijvingen staan in localStorage onder ept-demo-accounts-v1 en gelden alleen in deze browser en voor deze site-origin. De login wordt niet bewaard na vernieuwen. Lokale opslag wissen herstelt de oorspronkelijke demoaccounts. Ook met hashes kan browsercode geen echte autorisatie afdwingen; alle publiek gepubliceerde bestanden blijven publiek. Voor productie zijn een authenticatiedienst, beveiligde opslag en controles per rol, provider en inschrijving aan de serverzijde nodig. E-mailverificatie en accountherstel volgen in die fase.

## Onderverdeling van de log-as

De MFI-as start op log10. Hoofdticks markeren de machten van tien. Binnen elke decade komen korte asstreepjes voor de veelvouden 2 tot en met 9, op hun logaritmische positie. Deze onderverdelingen lopen niet als lijnen door de grafiek. De lineaire stand krijgt geen logaritmische tussenstreepjes. SVG-export behoudt de onderverdeling.

## MFI-weergave

Toon MFI-waarden als afgeronde gehele getallen, zonder punt, komma of spatie als duizendtalscheiding. Dit geldt voor tabellen, aslabels en tooltips, in beide talen. Voorbeeld: 8001,5 wordt weergegeven als 8002. Berekeningen, puntposities en CSV/JSON-data-exports behouden de oorspronkelijke precisie; SVG-export volgt de visuele integerweergave.

De demovrijgave wordt per provider, schema, ronde, sample, klasse en techniek in deze browser bewaard. Na een overeenkomende deelnemersimport wordt die vrijgave toegepast; intrekken verwijdert deze lokale vrijgave. Andere browsers delen deze status nog niet. Er worden geen ruwe labresultaten centraal opgeslagen.

## Uitgebreide verificatie en herpublicatie

De controles omvatten 13 analysetests, 13 oorspronkelijke browsercontroles, 12 rollencontroles, 12 aanvullende workflowcontroles en 17 controles op het publicatiepakket. De aanvullende gevallen testen ontbrekende inschrijving, ontbrekende vendor, One Lambda-deelname met Werfen-input, meerdere schema’s, verkeerde wachtwoorden, ongeldige e-mail, herladen, vrijgave en intrekken tussen twee tabs en vijf schermbreedtes van 320 tot 1440 pixels.

Een gevonden fout bij wisselen tussen Median en Net MFI is hersteld: een geldige contextgebonden consensus blijft actief, terwijl de referentiewaarden opnieuw voor de gekozen meetsectie worden berekend. Een ongeldige consensus vervangt geen bestaande geldige vrijgave. De importmelding bevestigt de context zonder onterecht te zeggen dat een eerder vrijgegeven consensus vergrendeld is.

Browsercommando’s: `node app/tests/browser.cjs`, `node app/tests/roles.cjs`, `node app/tests/detailed.cjs` en `node app/tests/online.cjs`. Geef de accountwachtwoorden uitsluitend via de procesvariabele `EPT_TEST_PASSWORDS` als JSON-object met gebruikersnamen als sleutels mee; sla ze niet in tests of documentatie op. `EPT_PLAYWRIGHT_PATH` wijst naar Playwright. `EPT_BASE_URL` is voor roles/detailed de app-URL en voor online de root-URL van het publicatiepakket. Testrapporten en screenshots blijven in de genegeerde map `.local/`. De browsercontroles toetsen de demo en bewijzen geen beveiligde productieautorisatie.
