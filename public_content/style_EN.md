# EFI EPT - style guide

Version 1.1 · 15 October 2026 · Public implementation conventions


The [general EFI foundation style guide](efi-style_EN.html) shows colours, Montserrat, logos and button examples. This EPT guide describes their module-specific use.

## Foundation

This project guide follows the existing EFI web style. It is not a formal replacement for an EFI brand manual. Use white and pale grey as the main surfaces, EFI blue as the identity anchor and coral for focused accents. Do not introduce separate committee or module palettes.

## Colour tokens

| Token | Colour | Use |
| --- | --- | --- |
| `--efi-blue` | `#064A89` | Title band, primary buttons, active technique |
| `--efi-coral` | `#DE5757` | Secondary buttons, active loci, own measurements |
| `--efi-ink` | `#232424` | Text, including on coral |
| `--efi-white` | `#FFFFFF` | Background and text on blue |
| `--efi-surface` | `#F4F6F9` | Grey panels and deselected buttons |
| `--efi-light` | `#EAEAEA` | Light button variant |
| `--efi-muted` | `#5E6568` | Secondary metadata |
| `--efi-line` | `#DFE4E8` | Subtle separators |

Small white text on coral has insufficient contrast: use dark text. Coral does not automatically mean failure. Status has an explicit label and icon. Focus stays visible and interaction does not depend on colour alone.

## Typography and grid

Use locally hosted **Montserrat**, falling back to `ui-sans-serif, system-ui, sans-serif`. Marketing reference: H1 32–56px/700, H2 24–40px/700; a data platform uses a compact hierarchy with 16–18px/400 for forms and tables, metadata 14–16px/500. Use tabular numerals and unchanged HLA notation. One H1 per page.

Technique and Locus share a grid with a 120px label column, 12px column gap and 10px row gap. SAB and A start at the same position. Buttons are at least 44px high. Narrow screens stack labels above groups; groups wrap without page overflow.

## Buttons and filters

| Group | Active | Deselected |
| --- | --- | --- |
| Technique | Blue, white text | Grey with blue border and blue text |
| Locus | Coral, dark text | Grey with coral border and dark text |

Borders stay 2px in both states. Disabled controls are muted grey with an accessible reason. Technique is single-select; Locus is multi-select with `aria-pressed`. Retain keyboard focus and selected state on language changes. Merge / Separate keeps the same labels in both languages.

<!--EPT_SPECIMEN-->

## Logo and images

Place the original **white EFI SVG logo directly on the blue banner**, without a white tile, distortion or crowding. Desktop report target: 64–80px high. Use the coloured original on white. The demo wordmark is a provisional product title, not a new EFI logo.

The banner may contain restrained decorative antibody/HLA imagery on the right. Keep the text and logo zones clear. Decorative molecular imagery may be raster; it establishes no structural scientific claims.

## Vector as a build requirement

Charts and diagrams use native SVG wherever practicable. All icons and pictograms are SVG. Keep editable source assets; a PNG wrapped in SVG is not a vector asset. PNG is an optional preview. Use Canvas/WebGL only for demonstrated performance needs, with a table and vector-export route.

## Charts and reports

Every MFI axis defaults to log10. Axes show original values and name the scale. Zero/negative/missing values receive explicit treatment. Specificities appear as PL Strings. Circle = Werfen, square = One Lambda; peer points blue, own points larger and coral. Violins are pale blue with sufficiently distinct points.

Before consensus release a report shows own results only with clear status. After release Merge/Separate and permitted peer points become available. No lab identity appears in peer points, exports or tooltips. Tables provide information without depending on charts.

## Bilingual content and verification

Every page has a visible NL/EN switch. Documentation consists of synchronised Markdown/HTML pairs. Check keyboard interaction, 320px screens, unclipped PL Strings, contrast and reproducible SVG export. Generated mockups do not establish exact CSS, font embedding or logo geometry.

## Public references

- [EFI website](https://efi-web.org/)
- [Original coloured logo](https://efi-web.org/dist/images/logos/logo-color.svg)
- [Original white logo](https://efi-web.org/dist/images/logos/logo-white.svg)
- [Platform concept](concept_EN.html)

## Persistent navigation

The menu above the banner is sticky. Section headings use an offset based on actual menu height, including wrapped mobile navigation. The molecular banner is a PNG from the image generator; its white logo is a separate original SVG.

## Language and dashboard navigation

Use a friendly, direct voice. Dutch interface copy uses je, jij and jouw. Participating laboratories and EPT providers each have a separate dashboard. Keep dashboard selection and language switching available in the sticky top navigation. Do not use em dashes in authored documentation or website copy; use a full stop, comma or ordinary hyphen.

## Logarithmic axis subdivisions

The MFI axis defaults to log10. Major ticks mark powers of ten. Each decade contains short axis ticks for multiples 2 through 9, positioned logarithmically. These subdivisions do not extend as gridlines into the chart. Linear mode has no logarithmic minor ticks. SVG export preserves the subdivisions.

## MFI display

Display MFI values as rounded integers with no dot, comma or space as a thousands separator. Apply this to tables, axis labels and tooltips in both languages. Example: 8001.5 is displayed as 8002. Calculations, point positions and CSV/JSON data exports retain original precision; SVG export follows the visual integer display.
