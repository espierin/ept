# EFI - visual foundation style guide

Version 1.0 · 15 October 2026 · Public project reference

## Foundation and relationship with EPT

This is the general visual foundation for this project, based on EFI web styling. The [EPT style guide](style_EN.html) applies it to filters, results and EPT reports. This is a project reference, not a formally issued EFI brand manual.

## Colours, shown together

The swatches below show exact CSS tokens and hexadecimal values. White/pale grey are the main surfaces; blue anchors identity. Coral is a secondary accent, not an automatic error colour.

<!--COLOUR_SPECIMEN-->

Small white text on coral has insufficient contrast. Use dark text on coral and white text on blue. Use muted text only on sufficiently light backgrounds. Status is also expressed in words and with an icon.

## Montserrat and text hierarchy

Use locally hosted Montserrat, falling back to `ui-sans-serif, system-ui, sans-serif`. These examples use the actual font files. Numbers in data tables are tabular; HLA notation is not cosmetically altered.

<!--FONT_SPECIMEN-->

| Element | Target size | Weight |
| --- | --- | --- |
| Website H1 | 32–56px | 700 |
| Website H2 | 24–40px | 700 |
| Data app H2 | 22–28px | 700 |
| Form / table | 16–18px | 400 |
| Metadata / label | 14–16px | 500–600 |

The data app may be more compact than a marketing page while preserving hierarchy and readability. One H1 per page; use real headings rather than standalone bold paragraphs for structure.

## Buttons and interaction

Primary buttons are blue/white. Secondary buttons are coral/dark. The light variant is light grey/dark. The demo shows active, deselected and disabled states. Use Tab to inspect keyboard focus.

<!--BUTTON_SPECIMEN-->

Data-app buttons are at least 44px high. Preserve border width when state changes. Disabled is distinct from deselected. Keyboard focus is visible. Links within prose are underlined.

## Logo, banner and images

Use original SVG files without distortion, tracing or recolouring. White EFI logo on blue; coloured EFI logo on white. Retain breathing room and modest but readable prominence. The banner may contain a decorative antibody/HLA molecular PNG as in the design. Text and logo remain real HTML/SVG layers, not baked into the image.

<!--LOGO_SPECIMEN-->

The menu above the banner stays visible while scrolling: `position: sticky; top: 0`, opaque white and an appropriate z-index. Measure actual menu height when responsive rows wrap; use it for section offsets and `scroll-padding-top` so anchor targets and focus are not hidden.

## Structure and whitespace

Use clear content sections, sufficient whitespace and repeated alignment. Use white/grey panels, fine separators and consistently placed actions. Table/chart panels may scroll horizontally; the page itself should not overflow horizontally on mobile.

## Vector and accessibility

Charts and diagrams use SVG wherever practicable. All icons and pictograms are SVG. A raster image inside an SVG container is not a vector asset. Decorative molecular PNGs are permitted. Provide tables alongside charts, text alongside status colours, visible focus and an NL/EN switch. Respect reduced motion and provide a print layout.

## Sources and module conventions

- [EFI website](https://efi-web.org/)
- [Original coloured logo](https://efi-web.org/dist/images/logos/logo-color.svg)
- [Original white logo](https://efi-web.org/dist/images/logos/logo-white.svg)
- [EPT-specific style guide](style_EN.html)
- [Platform concept](concept_EN.html)

## CSS files

[Shared colour tokens](assets/tokens.css), [documentation styles](assets/efi.css) and [visual component examples](assets/specimen.css) are directly available. The local EPT app imports the same colour tokens.

## Language and dashboard navigation

Use a friendly, direct voice. Dutch interface copy uses je, jij and jouw. Participating laboratories and EPT providers each have a separate dashboard. Keep dashboard selection and language switching available in the sticky top navigation. Do not use em dashes in authored documentation or website copy; use a full stop, comma or ordinary hyphen.
