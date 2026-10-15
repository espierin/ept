# EFI - visuele basisstijlgids

Versie 1.0 · 15 oktober 2026 · Publieke projectreferentie

## Basis en relatie met EPT

Dit is de algemene visuele basis voor dit project, gebaseerd op de EFI-webstijl. De [EPT-stijlgids](style_NL.html) past deze basis toe op filters, resultaten en EPT-rapporten. Dit document is een projectreferentie, geen formeel door EFI uitgegeven brandmanual.

## Kleuren, zichtbaar naast elkaar

De kleurstalen hieronder bevatten de exacte CSS-token en hexwaarde. Wit/lichtgrijs vormen de hoofdmateriaalkeuze; blauw verankert de identiteit. Koraal is een secundair accent, geen automatische foutkleur.

<!--COLOUR_SPECIMEN-->

Kleine witte tekst op koraal heeft onvoldoende contrast. Gebruik donkere tekst op koraal en witte tekst op blauw. Gebruik secundaire tekstkleur uitsluitend op voldoende lichte achtergrond. Status wordt ook in tekst en met een icoon benoemd.

## Montserrat en teksthiërarchie

Gebruik lokaal gehoste Montserrat, met `ui-sans-serif, system-ui, sans-serif` als terugval. De voorbeelden hieronder gebruiken de echte fontbestanden. Cijfers in datatabellen zijn tabulair; HLA-notatie wordt niet cosmetisch veranderd.

<!--FONT_SPECIMEN-->

| Onderdeel | Richtmaat | Gewicht |
| --- | --- | --- |
| Website H1 | 32–56px | 700 |
| Website H2 | 24–40px | 700 |
| Data-app H2 | 22–28px | 700 |
| Formulier / tabel | 16–18px | 400 |
| Metadata / label | 14–16px | 500–600 |

De data-app mag compacter zijn dan een marketingpagina, met behoud van hiërarchie en leesbaarheid. Eén H1 per pagina; gebruik echte koppen, geen losse vetgedrukte tekst als structuur.

## Knoppen en interactie

De primaire knop is blauw/wit. De secundaire is koraal/donker. De lichte variant is lichtgrijs/donker. De demo laat actieve, niet-geselecteerde en uitgeschakelde toestanden zien. Gebruik Tab om de focusrand te controleren.

<!--BUTTON_SPECIMEN-->

Knoppen zijn in een data-app minimaal 44px hoog. Behoud randbreedte bij wisseling van toestand. Uitgeschakeld is niet hetzelfde als niet geselecteerd. Toetsenbordfocus is zichtbaar. Links in lopende tekst zijn onderstreept.

## Logo, banner en beeldgebruik

Gebruik originele SVG-bestanden, zonder vervorming, overtrekken of herkleuren. Wit EFI-logo op blauw; gekleurd EFI-logo op wit. Laat ademruimte en behoud bescheiden maar leesbare zichtbaarheid. De banner mag een decoratieve moleculaire antistof-/HLA-afbeelding bevatten als PNG, zoals in het ontwerp. Tekst en logo blijven echte HTML/SVG-lagen en worden niet in de afbeelding gebakken.

<!--LOGO_SPECIMEN-->

Het topmenu boven de banner blijft tijdens scrollen staan: `position: sticky; top: 0`, dekkend wit en met passende z-index. Meet de werkelijke menuhoogte bij responsieve rijomloop; gebruik die voor sectie-offsets en `scroll-padding-top`, zodat ankerdoelen en focus niet achter het menu vallen.

## Opbouw en witruimte

Werk met duidelijke inhoudssecties, voldoende witruimte en herhaalde uitlijning. Gebruik wit en grijs voor panelen, dunne scheidingslijnen en consequent geplaatste acties. Tabel- en grafiekpanelen mogen horizontaal scrollen; de pagina zelf hoort op mobiel niet horizontaal te overlopen.

## Vector en toegankelijkheid

Grafieken en schema’s worden waar praktisch mogelijk SVG. Alle iconen en pictogrammen zijn SVG. Een rasterafbeelding in een SVG-container is geen vectorasset. Decoratieve moleculaire PNG’s zijn toegestaan. Bied tabellen bij grafieken, tekst naast statuskleur, zichtbare focus en een NL/EN-wissel. Respecteer verminderde beweging en bied een afdrukweergave.

## Bronnen en moduleafspraken

- [EFI-website](https://efi-web.org/)
- [Origineel gekleurd logo](https://efi-web.org/dist/images/logos/logo-color.svg)
- [Origineel wit logo](https://efi-web.org/dist/images/logos/logo-white.svg)
- [EPT-specifieke stijlgids](style_NL.html)
- [Platformconcept](concept_NL.html)

## CSS-bestanden

[Gedeelde kleurtokens](assets/tokens.css), [documentatiestijl](assets/efi.css) en [visuele componentvoorbeelden](assets/specimen.css) zijn rechtstreeks beschikbaar. De lokale EPT-app importeert dezelfde kleurtokens.

## Taal en dashboardnavigatie

Spreek deelnemers in de Nederlandse interface aan met je, jij en jouw. Gebruik korte, directe teksten. Deelnemende labs en EPT-providers hebben elk een apart dashboard. Houd de dashboardkeuze en taalwissel beschikbaar in het vaste bovenmenu. Gebruik geen lange gedachtestreepjes (em dashes) in eigen documentatie of webteksten; gebruik een punt, komma of gewoon koppelteken.
