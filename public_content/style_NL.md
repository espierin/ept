# EFI EPT - stijlgids

Versie 1.1 · 15 oktober 2026 · Publieke implementatieafspraken


De [algemene EFI-basisstijlgids](efi-style_NL.html) toont kleuren, Montserrat, logo’s en knopvoorbeelden. Deze EPT-gids beschrijft de toepassing in de module.

## Basis

Deze projectstijlgids volgt de bestaande EFI-webstijl. Het is geen formele vervanging van een EFI-brandmanual. Gebruik wit en lichtgrijs als hoofdmateriaal, EFI-blauw als herkenningsanker en koraal voor gerichte accenten. Geen eigen kleurpalet per commissie of module.

## Kleurtokens

| Token | Kleur | Toepassing |
| --- | --- | --- |
| `--efi-blue` | `#064A89` | Titelband, primaire knoppen, actieve techniek |
| `--efi-coral` | `#DE5757` | Secundaire knoppen, actieve loci, eigen meetpunten |
| `--efi-ink` | `#232424` | Tekst, ook op koraal |
| `--efi-white` | `#FFFFFF` | Achtergrond en tekst op blauw |
| `--efi-surface` | `#F4F6F9` | Grijze panelen en niet-geselecteerde knoppen |
| `--efi-light` | `#EAEAEA` | Lichte knopvariant |
| `--efi-muted` | `#5E6568` | Secundaire metadata |
| `--efi-line` | `#DFE4E8` | Subtiele scheidingslijnen |

Kleine witte tekst op koraal is onvoldoende contrastrijk: gebruik donkere tekst. Koraal betekent niet automatisch fout of afkeur. Status krijgt een expliciet label en pictogram. Focus blijft zichtbaar en bediening is niet alleen kleurafhankelijk.

## Typografie en raster

Gebruik lokaal gehoste **Montserrat** met `ui-sans-serif, system-ui, sans-serif` als terugval. Marketingreferentie: H1 32–56px/700, H2 24–40px/700; een dataplatform gebruikt compactere hiërarchie met 16–18px/400 voor tabellen en formulieren, metadata 14–16px/500. Gebruik tabulaire cijfers en onveranderde HLA-notatie. Eén H1 per pagina.

Techniek en Locus delen een raster met een labelkolom van 120px, 12px kolomafstand en 10px rijafstand. SAB en A beginnen gelijk. Knoppen zijn minimaal 44px hoog. Smalle schermen stapelen labels boven de knopgroep; groepen lopen door zonder pagina-overloop.

## Knoppen en filters

| Groep | Actief | Niet geselecteerd |
| --- | --- | --- |
| Techniek | Blauw, witte tekst | Grijs met blauwe rand en blauwe tekst |
| Locus | Koraal, donkere tekst | Grijs met koraalrand en donkere tekst |

Randen zijn in beide toestanden 2px breed. Uitgeschakeld is gedempt grijs met een toegankelijke reden. Techniek is een enkelvoudige keuze; Locus meervoudig met `aria-pressed`. Behoud toetsenbordfocus en geselecteerde status bij taalwissel. Merge / Separate houdt in beide talen dezelfde labels.

<!--EPT_SPECIMEN-->

## Logo en afbeeldingen

Plaats het originele **witte EFI-SVG-logo rechtstreeks op de blauwe banner**, zonder wit vlak, zonder vervorming en met vrije ruimte. Richtmaat in een desktoprapport: 64–80px hoog. Gebruik het gekleurde origineel op witte ondergrond. Het woordmerk van de demo is een voorlopige producttitel, geen nieuw EFI-logo.

De banner mag rechts een ingetogen decoratieve antistof-/HLA-afbeelding hebben. Houd tekstzone en logo vrij. De decoratieve moleculaire afbeelding mag raster zijn; structurele wetenschappelijke claims volgen niet uit een decoratie.

## Vector als bouwvoorwaarde

Grafieken en schema’s worden waar praktisch mogelijk native SVG. Alle iconen en pictogrammen zijn SVG. Bewaar bewerkbare bronassets; een PNG in een SVG-container is geen vectorbestand. PNG is een optionele preview. Gebruik Canvas/WebGL alleen bij een aangetoonde prestatiebehoefte met tabel en vector-exportroute.

## Grafieken en rapporten

Alle MFI-assen starten op log10. Assen tonen oorspronkelijke waarden en benoemen de schaal. Nul/negatief/ontbrekend wordt expliciet behandeld. Specificiteiten staan als PL String in de grafiek. Cirkel = Werfen, vierkant = One Lambda; peerpunten blauw, eigen punten groter en koraal. De violin is lichtblauw met voldoende contrast voor punten.

Voor consensusvrijgave toont een rapport alleen eigen resultaten met een duidelijke statusmelding. Na vrijgave zijn Merge/Separate en toegestane peerpunten beschikbaar. Geen labidentificatie in peerpunten, exports of tooltips. Tabellen bieden dezelfde informatie zonder afhankelijkheid van een grafiek.

## Tweetaligheid en controle

Iedere pagina heeft een zichtbare NL/EN-wissel. Documentatie bestaat als gesynchroniseerde Markdown/HTML-paren. Controleer toetsenbordbediening, 320px-schermen, geen afgesneden PL Strings, contrast en reproduceerbare SVG-export. Gegenereerde mockups zijn geen bewijs van exacte CSS, fontinsluiting of logo-geometrie.

## Publieke referenties

- [EFI-website](https://efi-web.org/)
- [Origineel gekleurd logo](https://efi-web.org/dist/images/logos/logo-color.svg)
- [Origineel wit logo](https://efi-web.org/dist/images/logos/logo-white.svg)
- [Platformconcept](concept_NL.html)

## Blijvend toegankelijk menu

Het menu boven de banner is sticky. Sectiekoppen krijgen een offset op basis van de werkelijke menuhoogte; dit werkt ook wanneer het menu op mobiel over meerdere rijen loopt. De moleculaire banner is PNG uit de image generator; het witte logo is een afzonderlijk origineel SVG.

## Taal en dashboardnavigatie

Spreek deelnemers in de Nederlandse interface aan met je, jij en jouw. Gebruik korte, directe teksten. Deelnemende labs en EPT-providers hebben elk een apart dashboard. Houd de dashboardkeuze en taalwissel beschikbaar in het vaste bovenmenu. Gebruik geen lange gedachtestreepjes (em dashes) in eigen documentatie of webteksten; gebruik een punt, komma of gewoon koppelteken.

## Onderverdeling van de log-as

De MFI-as start op log10. Hoofdticks markeren de machten van tien. Binnen elke decade komen korte asstreepjes voor de veelvouden 2 tot en met 9, op hun logaritmische positie. Deze onderverdelingen lopen niet als lijnen door de grafiek. De lineaire stand krijgt geen logaritmische tussenstreepjes. SVG-export behoudt de onderverdeling.

## MFI-weergave

Toon MFI-waarden als afgeronde gehele getallen, zonder punt, komma of spatie als duizendtalscheiding. Dit geldt voor tabellen, aslabels en tooltips, in beide talen. Voorbeeld: 8001,5 wordt weergegeven als 8002. Berekeningen, puntposities en CSV/JSON-data-exports behouden de oorspronkelijke precisie; SVG-export volgt de visuele integerweergave.

## Beide demoklassen en vaste MFI-as

De publieke demo bevat standaard klasse I (vier HLA-beads) en klasse II (vijf HLA-beads), elk met een eigen CSV en EDS-lotbestand. Admin en provider krijgen beide demoklassen na inloggen. Een deelnemer bevestigt eerst een publieke demo-import; daarna wordt de andere demoklasse automatisch toegevoegd. Dit geldt uitsluitend voor de publieke demo. Bij eigen bestanden vindt geen automatische bijmenging van demodata plaats. Gebruik de knoppen I en II om te wisselen. Data, lot, loci, meetsectie en consensus blijven per klasse gescheiden; uitloggen wist beide imports.

Alle MFI-grafieken gebruiken een vast zichtbaar bereik van 1 tot en met 30000, zowel logaritmisch als lineair. De log-as heeft hoofdticks op 1, 10, 100, 1000, 10000 en de eindgrens 30000 en korte logaritmische onderverdelingen uitsluitend op de as. Waarden buiten het zichtbare bereik krijgen een gestippelde randmarkering en worden in de toelichting geteld. Brongegevens, berekeningen en numerieke exports behouden hun oorspronkelijke waarde. Tickmarks bij 10, 100, 1000 en 10000 zijn langer dan de tussenstreepjes. Waarden boven 30000 worden op precies 30000 getekend. De vaste as verandert geen meetresultaten.

Vijf extra browsercontroles in `app/tests/classes.cjs` toetsen de standaard klasse-II-import, gepaarde DQ/DP-specificiteiten, terugwisselen naar klasse I, beide vaste assen, waarden onder 1 en boven 30000, exportprecisie en het wissen van beide klassen bij uitloggen.
