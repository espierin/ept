# EFI EPT Insights - handleiding

Versie 1.0 · 15 oktober 2026 · Nederlandse gebruikershandleiding

[Open de demo](app/) · [English](manual_EN.html) · [Download als Markdown](manual_NL.md)

## Quick start: je eerste demorapport

Volg deze stappen in één normale browser. Je hebt geen eigen bestanden of e-mailadres nodig. De demo gebruikt publieke Werfen / Immucor xPONENT-bestanden van het hlapro-project. De groepswaarden worden synthetisch gegenereerd.

### 1. Log in als deelnemer

Open [EPT Insights](app/). Gebruik gebruikersnaam **participant_1** en startwachtwoord **5678**. Klik op **Inloggen**. Is de interface Engels, klik dan bovenaan op **NL**.

Heb je dit wachtwoord in deze browser al gewijzigd? Gebruik dan je gewijzigde wachtwoord. Profielen gelden voorlopig alleen in dezelfde browser en voor hetzelfde websiteadres.

### 2. Controleer je profiel

Klik bovenaan op **Mijn profiel**. Je profiel opent onderaan de pagina. Je mag een e-mailadres invullen, bijvoorbeeld `participant@example.org` als testadres, maar je kunt het ook leeg laten. Klik op **Profiel opslaan**. Laat de drie wachtwoordvelden leeg als je alleen het e-mailadres wilt bewaren.

Controle: je ziet **Opgeslagen in deze browser.** Er wordt geen e-mail verstuurd. Voor deze quick start hoef je je wachtwoord niet te wijzigen.

### 3. Registreer schema en vendor

Ga naar **1. Kies je EPT-schema’s en vendors** en vul het volgende in:

| Instelling | Kies of vul in |
| --- | --- |
| Provider | `provider_1` |
| Schema / editie | `SAB-2026-DEMO` |
| Vendor(s) | Vink **Werfen / Immucor** aan |

Klik op **Schema toevoegen**. Controleer dat boven het formulier een regel verschijnt met `provider_1`, `SAB-2026-DEMO` en `Werfen / Immucor`.

**Deze stap is nodig.** Alleen One Lambda aanvinken werkt niet voor de Werfen-demobestanden. Je mag beide vendors registreren, maar de huidige importer verwerkt alleen Werfen / Immucor xPONENT + EDS.

### 4. Laad klasse I en bevestig de import

Ga via **2. Importeren** naar **Importeer een xPONENT-run**. Klik bij **Publieke mockvoorbeelden** op **Class I**. Wacht op de melding dat de preview gereed is. Je hoeft hiervoor zelf geen CSV of EDS te downloaden.

Controleer de velden:

| Veld | Waarde voor de quick start |
| --- | --- |
| Provider | `provider_1` |
| Schema / editie | `SAB-2026-DEMO` |
| Ronde | `ROUND-02` |
| EPT sample | `DEMO-01` |
| Techniek volgens het uitgevoerde protocol | `IgG SAB` |
| Te koppelen bronmeting | `S001 · 33(1,A5)` |

Vink **Ik bevestig techniek, lot en de koppeling van deze bronmeting aan dit EPT-sample** aan. Klik op **Import bevestigen**. Het rapport verschijnt en de tweede publieke demoklasse wordt automatisch klaargezet.

### 5. Bekijk klasse I en II

Gebruik de knoppen **I** en **II** boven de dashboards. Ze kiezen de actieve klasse; ze voegen de klassen niet samen.

| Actieve klasse | Wat je ziet bij de eerste bronmeting |
| --- | --- |
| I | Vier HLA-specificiteiten; de eerste eigen MFI is `8002` |
| II | Vijf HLA-specificiteiten, inclusief gekoppelde DQ/DP-ketens |

NC en PC zijn controlebeads. Ze staan in **Kwaliteit, controlebeads en herkomst**, buiten de specificiteitsgrafiek. De MFI-as loopt altijd van **1 tot 30000** en staat standaard op **Log**. Eigen waarden zijn grote koraalrode cirkels.

**Nog geen violin plots of blauwe peerpunten? Dat klopt.** Zolang de provider geen passende democonsensus heeft vrijgegeven, zie je alleen eigen resultaten. Ga verder met de volgende quick start om de groepscontext te testen.

## Quick start: groepscontext vrijgeven

Gebruik twee tabs in **dezelfde browser, hetzelfde browserprofiel en op hetzelfde websiteadres**. Een privévenster of andere browser deelt deze demovrijgave niet.

1. Laat je deelnemersrapport uit de vorige quick start open in tab 1. Kies daar klasse **I**.
2. Open [de demo](app/) in tab 2. Log in als **provider_1**, startwachtwoord **1234**. Deze tab toont het providerdashboard. Klasse I en II worden automatisch geladen.
3. Kies ook in tab 2 klasse **I**. Controleer provider `provider_1`, schema `SAB-2026-DEMO`, ronde `ROUND-02` en sample `DEMO-01`.
4. Klik op **Download consensusvoorbeeld**. Bewaar het JSON-bestand en laat de inhoud ongewijzigd.
5. Klik op **Laad consensus-JSON** en kies dit gedownloade bestand. Wacht op de bevestiging dat de democonsensus is gevalideerd.
6. Ga terug naar tab 1. De passende groepscontext verschijnt zonder opnieuw te importeren: violin plots en kleinere blauwe peerpunten. Bij deze demo zijn dat 18 synthetische labs per specificiteit.
7. Voor klasse **II** herhaal je stap 3 tot en met 5 met **II** geselecteerd in de providertab. Kies daarna **II** in je deelnemerstab. Klasse I-vrijgave geldt niet automatisch voor klasse II.
8. Test eventueel **Trek demovrijgave in** in de providertab. In de deelnemerstab verdwijnen de betreffende peerwaarden; de eigen resultaten blijven staan.

De calls in het ongewijzigde voorbeeld zijn **Niet beoordeeld** (`not_assessed`). Het bestand opent de synthetische context; het bevat geen officiële positieve of negatieve EPT-beoordeling. Je hoeft voor deze oefening geen JSON te bewerken.

## Rollen en paginaopbouw

| Rol | Scherm en mogelijkheden |
| --- | --- |
| Participant | Eigen profiel, schema’s en vendors; eerst import bevestigen, daarna analyseren en exporteren |
| Provider | Eigen demo-overzicht per klasse en context; consensusvoorbeeld downloaden, laden en intrekken |
| Admin | Accountoverzicht en dashboardkeuze om de lab- en providerweergave te inspecteren |

Het adminaccount heet `espierin`. Gebruik het eerder ingestelde adminwachtwoord; dat staat niet in deze openbare handleiding. Admin kan via **Dashboard** kiezen voor **Admin**, **Deelnemend lab** of **EPT-provider**. De labweergave van admin toont diens eigen demosessie, niet de ruwe imports uit andere tabs of accounts.

Het bovenmenu blijft bij scrollen beschikbaar. **Handleiding** opent deze uitleg in een nieuw tabblad, zodat je rapport open blijft. **Concept** beschrijft het platformontwerp. **Mijn profiel** opent het profielgedeelte. **EN / NL** wisselt de interfacetaal en behoudt de actieve sessie. De taalwissel in deze handleiding opent de overeenkomstige vertaling.

## Profiel, wachtwoord en e-mail

Bij **Mijn profiel** kun je een optioneel e-mailadres opslaan. Het adres wordt lokaal bewaard; er is nog geen verificatiemail, notificatie of wachtwoordherstel per e-mail.

Om je wachtwoord te wijzigen vul je **Huidig wachtwoord**, **Nieuw wachtwoord** en **Herhaal nieuw wachtwoord** in en klik je op **Profiel opslaan**. De twee nieuwe waarden moeten gelijk zijn. De demo accepteert minimaal vier tekens. Na een geslaagde wijziging gebruik je het nieuwe wachtwoord in deze browser; de oorspronkelijke startcode werkt daar dan niet meer.

De accountnaam en rol staan in het bovenmenu. **Uitloggen** wist de actieve imports en peercontext uit die tab. Opgeslagen profielgegevens en schema-inschrijvingen blijven bewaard. Logins worden niet na vernieuwen hersteld.

## Deelnames, schema’s en vendors

Registreer per schema de provider, schema-editie en één of beide vendors. In deze demo is alleen `provider_1` als provider beschikbaar. Je kunt een eigen schema-editienaam invullen om de structuur te testen; de standaard providerdemovrijgave past alleen bij de overeenkomstige context.

**Schema toevoegen** bewaart een nieuwe deelname. Dezelfde provider en schema-editie opnieuw toevoegen werkt de vendorselectie van die deelname bij. Met **Verwijderen** verwijder je de betreffende inschrijving. Dit verwijdert niet automatisch een al geopend rapport.

De huidige Werfen-import vereist een inschrijving met dezelfde provider en schema-editie en met **Werfen / Immucor** als vendor. One Lambda kan al in je deelname staan, maar er is nog geen werkende One Lambda-importer of One Lambda-peerreeks. Registratie van een vendor betekent dus niet dat diens bestanden al kunnen worden ingelezen.

## Demodata en bestanden

| Klasse | CSV | Bijbehorend EDS-lotbestand | HLA-beads + controles |
| --- | --- | --- | --- |
| I | [LSA1-test.csv](app/fixtures/LSA1-test.csv) | [3012456_3065421-SA1.eds](app/fixtures/3012456_3065421-SA1.eds) | 4 + NC/PC |
| II | [LSA2-test.csv](app/fixtures/LSA2-test.csv) | [3062145_3045216-SA2.eds](app/fixtures/3062145_3045216-SA2.eds) | 5 + NC/PC |

De bestanden komen uit [hlapro van L. Creteig](https://github.com/lcreteig/hlapro), onder MIT-licentie. [Herkomst en bronhashes](app/fixtures/provenance.json) en [licentie](app/fixtures/LICENSE.md) zijn beschikbaar. Dit zijn verkleinde mockbestanden, geen volledige commerciële beadsets of inzendingen van deelnemende labs.

Elke CSV bevat twee bronmetingen. Alleen de gekozen bronmeting wordt aan het EPT-sample gekoppeld. De tweede well wordt niet als een ander lab behandeld. Bij een bevestigde publieke demo-import wordt de andere demoklasse automatisch voorbereid met de eerste bronmeting en dezelfde EPT-context. Eigen lokaal gekozen bestanden starten deze automatische demoaanvulling niet.

## Import stap voor stap

Voor een eigen import kies je één xPONENT-CSV en één bijbehorend EDS-bestand via het bestandsvak of sleep je ze erop. Je kunt de twee bestanden samen of na elkaar kiezen. De limieten zijn 20 MB voor CSV en 5 MB voor EDS. Bestanden worden in de browser verwerkt, niet naar een centrale server verzonden.

Gebruik UTF-8-bestanden en behoud de oorspronkelijke xPONENT-secties, inclusief Median. Een willekeurige tabel met alleen MFI-kolommen is geen ondersteunde export.

De preview controleert onder andere CSV-structuur, leesbaarheid van EDS, lotkoppeling en beaddefinities. Je ziet lot, klasse, bronmetingen, meetwaarden, mappingmeldingen en SHA-256-bronhashes. Een geldige preview is nog geen bevestigde import.

Controleer provider, schema-editie, ronde en sample. Selecteer de werkelijk uitgevoerde techniek en de bedoelde bronmeting. De techniek wordt niet uit de beadset afgeleid. Bevestig daarna het vinkvak en **Import bevestigen**. Een mislukte nieuwe import vervangt het bestaande rapport niet.

Om de andere bronmeting uit hetzelfde bestand te analyseren, laad je het voorbeeld of bestanden opnieuw, kies je de andere bronmeting in de preview en bevestig je opnieuw. Het veld **Bronmeting** in het rapport toont de bevestigde koppeling; het is geen vrije wissel tussen wells.

De knoppen **I / II** herstellen de afzonderlijke imports, loci en meetsecties. **Wis sessie** verwijdert beide imports en previews uit de actieve sessie. Het verwijdert je profiel, inschrijvingen of lokaal bewaarde providervrijgave niet.

## Technieken, loci en meetsecties

**Techniek** kiest **SAB**, **C1q** of **C3d**. De demo is bedoeld voor IgG SAB. C1q en C3d gebruiken een parallelle gegevensstructuur en blijven strikt gescheiden, maar hun import is nog niet met echte assaybestanden gevalideerd. Het kiezen van C1q/C3d maakt van een IgG-meting geen complementbindingsassay. Een niet-gemeten techniek toont een lege toestand.

De locusknoppen zijn **A**, **B**, **C**, **DRB1**, **DRB3-4-5**, **DQ** en **DP**. Je kunt meerdere loci selecteren. Niet-passende loci zijn uitgeschakeld. Actieve techniekknoppen zijn blauw; actieve locusknoppen koraal. Geen locus geselecteerd geeft een lege grafiek en tabel.

Met **Meetsectie** kies je **Median** of **Net MFI**, als de bron die sectie bevat. De originele waarden blijven bewaard. Een passende, geldige consensus blijft bij deze wissel actief; synthetische referenties worden opnieuw voor de gekozen sectie berekend. De kleine demobestanden kunnen in beide secties dezelfde waarden bevatten.

## Grafieken en consensus lezen

De grafiek en tabel gebruiken **PL Strings** in plaats van beadnummers. Bij DQ en DP blijven de gekoppelde alfa- en bètaketens samen zichtbaar, bijvoorbeeld `HLA-DQA1*02:01~HLA-DQB1*02:01`. Technieken, klassen en EPT-contexten worden niet samengevoegd.

| Visueel element | Betekenis |
| --- | --- |
| Grote koraalrode marker | Eigen labresultaat |
| Kleine blauwe marker | Synthetische peerwaarde, zonder labidentificatie bij het punt |
| Cirkel | Werfen / Immucor |
| Vierkant | Gereserveerd voor One Lambda in de uitbreidbare grafiekopzet |
| Violin plot | Verdeling van de geselecteerde peerwaarden, exclusief eigen lab |
| Gestippelde randmarker | Positieve waarde onder 1 of boven 30000, aan de asgrens getoond |

De MFI-as loopt in iedere weergave van **1 tot 30000**. **Log** is de standaard; **Lineair** is een expliciete alternatieve weergave. Tickmarks bij 10, 100, 1000 en 10000 zijn langer dan de tussenstreepjes. Deze streepjes staan alleen op de as. Waarden boven 30000 worden op precies 30000 getekend; de oorspronkelijke waarde blijft behouden in tabel en numerieke exports. Alle weergegeven MFI-getallen zijn afgeronde integers zonder duizendtalscheiding, bijvoorbeeld `8002`. Berekeningen en numerieke exports behouden `8001.5` als dat de bronwaarde was.

**Individuele peerwaarden** zet de blauwe punten aan of uit, zonder de violin te veranderen. **Merge** berekent één verdeling uit de samengevoegde vendorwaarnemingen per geldige specificiteit. **Separate** berekent de verdeling per vendor afzonderlijk. In deze demo is alleen Werfen aanwezig; beide standen gebruiken daarom dezelfde peerreeks. Zonder vrijgave zijn deze standen niet beschikbaar.

De demoreferentie gebruikt 18 gegenereerde labs per geldige positieve meetwaarde. Dat zijn geen echte peerinzendingen. De tabel geeft onder andere de eigen MFI, providercall en aantallen labs, metingen en niet-positieve/ongeldige referentiewaarden. Positieve waarden buiten het zichtbare asbereik blijven in de data en statistiek. Nul, negatief, ontbrekend of ongeldig worden niet in een logaritmische density verwerkt. Bij te weinig of constante referentiewaarden kan een violin ontbreken.

De violin wordt berekend als een Gaussische kernschatting op log10-MFI, met bandbreedte 0.18 en 100 evaluatiepunten. Er zijn minimaal vijf geldige positieve referentiewaarden nodig; een constante reeks krijgt geen violin. De getoonde violins hebben gelijke maximale breedte, zodat breedte geen zelfstandig aantal labs aanduidt. Het eigen lab wordt uit de referentie gehouden. Unieke labs en meetwaarnemingen zijn afzonderlijke aantallen; herhaalde exports mogen die aantallen niet opblazen.

## Provider: vrijgave en intrekken

Een demovrijgave is gebonden aan **provider + schema-editie + ronde + sample + techniek + klasse**. De versie, expliciete vrijgave en geldige datum worden gecontroleerd. Een bestand met een verkeerde context, klasse, techniek of ongeldige structuur wordt geweigerd. Een ongeldige poging vervangt een al geldige vrijgave niet.

Het providerdashboard gebruikt de publieke klasse-I- en klasse-II-demo en biedt geen algemene editor voor alle mogelijke rondes. Download voor de geselecteerde klasse het actuele voorbeeld, laad het terug en controleer de status. Bewerk de JSON alleen als je bewust een afwijkend scenario wilt testen. Een vrijgavedatum in de toekomst is ongeldig.

De opgeslagen demovrijgave wordt toegepast bij een passende import in dezelfde browser. Een al geopende passende deelnemerstab krijgt wijzigingen automatisch door. Andere browsers, browserprofielen en computers delen de status niet. Intrekken verwijdert de vrijgave voor de actieve klasse en context; het verwijdert geen eigen meetwaarden.

## Export, kwaliteitsinformatie en opslag

**CSV** exporteert de actieve selectie en context. **JSON + metadata** bewaart ook bronherkomst, ruwe numerieke precisie, asbereik, meetsectie, consensusstatus en analysemethode. **SVG** exporteert de huidige vectorfiguur met ingebed font en metadata. Maak per klasse en gewenste selectie een eigen export. Een SVG is een visuele momentopname, geen volledige database-export.

Onder **Kwaliteit, controlebeads en herkomst** staan NC/PC, brongegevens en controles. Deze informatie ondersteunt inspectie van het bestand; de app geeft hiermee geen officiële kwaliteitsgoedkeuring of EPT-score.

| Gegeven | Bewaring in deze demo |
| --- | --- |
| Login en ingelezen meetwaarden | Alleen actieve tab; weg na uitloggen of vernieuwen |
| Profiel, gewijzigd wachtwoord en schema-inschrijvingen | Lokale browseropslag voor dit websiteadres |
| Providerdemovrijgave | Lokale browseropslag, gedeeld tussen tabs met dezelfde origin |
| Gedownloade exports | De downloadlocatie die je browser gebruikt |

Gebruik voor een schone oefening een apart browserprofiel. Het wissen van websitegegevens verwijdert ook gewijzigde wachtwoorden, e-mail, inschrijvingen en demovrijgaven; de oorspronkelijke demoaccounts komen dan terug. Wis deze gegevens niet als je die lokale instellingen wilt behouden.

## Problemen oplossen

| Wat je ziet | Wat je controleert |
| --- | --- |
| Inloggen lukt niet | Exacte accountnaam en het eventueel lokaal gewijzigde wachtwoord; wacht tot de knop actief is |
| Bericht over inschrijving of Werfen | Voeg het juiste schema toe en vink Werfen / Immucor aan; controleer dezelfde provider en schema-editie bij import |
| Import bevestigen niet beschikbaar | Laad een geldige CSV/EDS-combinatie of klik Class I/II; wacht op de preview en vink de bevestiging aan |
| `lot_mismatch` | Gebruik CSV en EDS uit dezelfde rij van de bestandentabel |
| Alleen eigen punten, geen violin | Laat de provider de juiste klasse en context vrijgeven in dezelfde browser |
| Consensus geweigerd | Controleer provider, schema, ronde, sample, klasse, techniek, versie en datum; gebruik een vers gedownload voorbeeld |
| Klasse II-knop kort uitgeschakeld | Wacht op het voorbereiden van de tweede demoklasse; controleer eventuele importmelding |
| Lege grafiek | Selecteer een gemeten techniek en minstens één passend locus |
| Merge en Separate zien er hetzelfde uit | Er is in deze demo maar één vendor met meetwaarden |
| Tussenstreepjes ontbreken | Kies Log; Lineair heeft geen logaritmische onderverdeling |
| Na vernieuwen opnieuw inloggen/importeren | Dat is het huidige sessiegedrag; lokale instellingen en vrijgave kunnen nog bewaard zijn |
| Andere computer ziet geen vrijgave | De demo heeft nog geen centrale opslag; herhaal de oefening in dezelfde browser |

## Huidige grenzen en verdere documentatie

Dit is een browserdemo met lokale accounts, geen beveiligde centrale authenticatie of afgeschermde opslag. Publiek gepubliceerde bestanden blijven publiek. Er is nog geen centrale inzending, e-mailherstel, One Lambda-import, validatie met echte C1q/C3d-bestanden of officiële EPT-beoordeling. Gebruik de quick start met de publieke demobestanden.

[Platformconcept](concept_NL.html) · [EPT-stijlgids](style_NL.html) · [Algemene EFI-stijl](efi-style_NL.html) · [Repository](https://github.com/espierin/ept)
