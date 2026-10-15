# EFI EPT - initial local implementation

Version 0.1 · 15 October 2026 · Language pair: DEVELOPMENT_NL.md

## Status and scope

A working bilingual browser app for **Werfen/Immucor xPONENT CSV + EDS**, tested with public hlapro class I and II mock runs. The [browser prototype](https://espierin.github.io/ept/) is offered on GitHub Pages alongside the public concept and style guides. Processing remains local to the browser. Internal EFI correspondence and the email PDF remain outside the repository.

## Starting

From the repository directory run `node dev-server.mjs`, then open [the local app](http://127.0.0.1:4173/app/). The server listens on loopback only and serves the `app` and `docs` folders; it does not expose `.local`, Git files or the parent project directory. Stop with Ctrl+C when the preview is no longer needed.

The app starts with the explicitly labelled class I mock example. Use Class II to preview the other run and confirm import. Local files can be selected or dropped. Choose one CSV and its matching EDS. Confirm technique, provider/scheme/round/sample and the source Sample ID **and** well combination; other wells never become peers.

## Working features

- Strict CSV parsing with quotes, BOM, row validation and distinct Median/Net MFI sections.
- EDS XML without DTD/entities, exact lot checks, control beads, HLA class and PL String composition.
- Original values, non-positive statuses, bead counts and SHA-256 provenance; unresolved composition is explicitly reported.
- Aligned Technique/Locus controls, own/peer legend, default log10, Merge/Separate and NL/EN retaining report selections.
- SVG charts, CSV/JSON downloads and standalone SVG export with embedded Montserrat and report metadata.
- Image-generator PNG banner with the original white EFI SVG logo as a separate layer; sticky navigation with responsive anchor offsets.
- Local processing only: no POST, central storage, browser persistence or automatic transmission of selected files.

## Consensus demonstration

Before demo release only own data are visible. Download the consensus example for the active context and load the JSON locally. Only the explicitly synthetic schema is accepted; incorrect provider/round/sample/technique/class or invalid release is rejected. Example calls are `not_assessed`, not inferred from MFI.

After validation the app displays **generated synthetic** Werfen peer values, never treating other source wells as other laboratories. There are 18 synthetic reference laboratories per target. With one vendor Merge and Separate have identical data; generic analysis functions are also tested with two synthetic vendors. Withdrawal removes peer context.

This is not real provider authorisation. Production release requires an authorised provider, context-specific private processing and enforced access. A local checkbox or filename must not substitute for that. Real peer data are not fetched or published now.

## Not yet implemented

No production accounts, central upload, private GitHub data repository, real provider workflow, certified analysis or persistence. One Lambda already has vendor identity and generic analysis support but no tested importer. MATCH IT! follows later. C1q/C3d remain distinct techniques; genuine complement exports have not been validated. HAML import, cross-lot aggregation, larger workloads and formal statistical/disclosure thresholds remain further work.

## Tests

Unit/analysis tests: `node --test app/tests/core.test.mjs`.

Browser chain with the local server running: `node app/tests/browser.cjs`. This needs Playwright with Chrome. The script defaults to `playwright`; `EPT_PLAYWRIGHT_PATH` can point to a module in an existing runtime. Starting the app needs no framework build or npm installation.

Initial verification covers 13 unit/analysis tests and 13 browser checks: class I/II, CSV/EDS mapping, source hash, wrong consensus context, own-only state, synthetic release/withdrawal, peer visibility, exports, language state, 390px layout and sticky navigation. Reports/screenshots are retained locally under `.local/`, which is not committed. These checks do not prove production permissions.

The online flow is checked separately with `node app/tests/online.cjs`: 15 checks through the actual interface and downloads, without local diagnostics. Online mock-file and application-asset hashes are checked as well. `EPT_BASE_URL` may point to the local publication package for a pre-publication check. The default is `https://espierin.github.io/ept/`. Checks also record HTTP errors and network writes; choosing a file must not cause an upload request.

## Files and provenance

`core.mjs` contains import, mapping, validation and statistics. `app.mjs` manages the interface and local session. Charts use native SVG. Fixtures originate from [hlapro](https://github.com/lcreteig/hlapro), with the supplied MIT licence at `fixtures/LICENSE.md`; source URLs, commit and hashes are in `fixtures/provenance.json`. These are original public mock files, not independent participant datasets.

GitHub documentation is built from `public_content` and explicitly public assets only. The general [EFI style guide](../docs/efi-style_EN.html) and [EPT style guide](../docs/style_EN.html) are separate and linked in both directions. Internal project documentation is not recursively copied into the public site.

## Separate dashboards by user role

The participating laboratory dashboard contains its own import, measurements, report and exports. Group context becomes visible only after release by its EPT provider. The separate provider dashboard contains the overview by provider, scheme/edition, round, sample and technique, with consensus validation and release. Providers and techniques remain separate.

In the current browser prototype, the dashboard selector switches between these routes. This is navigation within a simulation, not authentication or secure authorisation. A new laboratory import locks group context again.
