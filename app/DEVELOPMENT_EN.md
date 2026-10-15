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

## Roles, sign-in and participant workflow

There are three demo roles: admin, provider and participant. Admin espierin sees the account overview and can inspect the other two dashboards. Provider provider_1 sees the consensus route. Participant participant_1 first chooses EPT schemes and vendors, then imports CSV and EDS, and sees analyses only after confirmation. Reporting remains linked to the enrolled provider and scheme edition. One Lambda participation can already be registered; its importer is not yet available.

My profile lets you add an optional email address and change your password. A password change requires the current password and repetition of the new password. No emails are sent and email recovery is not yet available. Signing out clears imported results and reference data from the session.

This is a local account simulation on GitHub Pages. The site contains salted PBKDF2-SHA256 verifiers with 210,000 iterations, with no readable initial passwords. Changed passwords, email and scheme enrolments are stored in localStorage under ept-demo-accounts-v1 and apply only to this browser and site origin. Login is not retained after refresh. Clearing local storage restores the original demo accounts. Even with hashes, browser code cannot enforce real authorisation; every publicly published file remains public. Production requires an authentication service, protected storage and server-side checks by role, provider and enrolment. Email verification and account recovery follow in that phase.

## Logarithmic axis subdivisions

The MFI axis defaults to log10. Major ticks mark powers of ten. Each decade contains short axis ticks for multiples 2 through 9, positioned logarithmically. These subdivisions do not extend as gridlines into the chart. Linear mode has no logarithmic minor ticks. SVG export preserves the subdivisions.

## MFI display

Display MFI values as rounded integers with no dot, comma or space as a thousands separator. Apply this to tables, axis labels and tooltips in both languages. Example: 8001.5 is displayed as 8002. Calculations, point positions and CSV/JSON data exports retain original precision; SVG export follows the visual integer display.

Demo releases are retained in this browser by provider, scheme, round, sample, class and technique. A matching participant import applies the release; withdrawal removes that local release. Other browsers do not yet share this status. No raw laboratory results are stored centrally.

## Detailed verification and republication

Checks cover 13 analysis tests, 13 original browser checks, 12 role checks, 12 additional workflow checks and 17 publication-package checks. Additional cases cover missing enrolment, missing vendor, One Lambda enrolment with Werfen input, multiple schemes, wrong passwords, invalid email, refresh, release and withdrawal between two tabs, and five viewport widths from 320 to 1440 pixels.

A fault when switching between Median and Net MFI has been corrected: a valid context-scoped consensus remains active while reference values are recomputed for the selected measurement section. Invalid consensus does not replace an existing valid release. The import message confirms context without incorrectly claiming that previously released consensus has been locked.

Browser commands: `node app/tests/browser.cjs`, `node app/tests/roles.cjs`, `node app/tests/detailed.cjs` and `node app/tests/online.cjs`. Supply account passwords only through the process variable `EPT_TEST_PASSWORDS` as a JSON object keyed by usernames; do not store them in tests or documentation. `EPT_PLAYWRIGHT_PATH` points to Playwright. `EPT_BASE_URL` is the app URL for roles/detailed and the publication-package root URL for online. Reports and screenshots remain in the ignored `.local/` directory. Browser checks verify the demo and do not prove secure production authorisation.

## Both demo classes and a fixed MFI axis

The public demo includes class I (four HLA beads) and class II (five HLA beads), each with its own CSV and EDS lot file. Admin and provider receive both demo classes after sign-in. A participant first confirms a public demo import; the other demo class is then added automatically. This applies only to the public demo. User-selected files do not automatically mix with demo data. Use buttons I and II to switch. Data, lot, loci, measurement section and consensus remain separate by class; signing out clears both imports.

All MFI charts use a fixed visible range from 1 through 10000 in both logarithmic and linear modes. The log axis has major ticks at 1, 10, 100, 1000 and 10000, with short logarithmic subdivisions on the axis only. Values outside the visible range receive dashed boundary markers and are counted in the chart explanation. Source data, calculations and numeric exports retain their original values. Fixing the axis does not change measurements.

Five additional browser checks in `app/tests/classes.cjs` cover default class II import, paired DQ/DP specificities, switching back to class I, both fixed axes, values below 1 and above 10000, export precision and clearing both classes on sign-out.
