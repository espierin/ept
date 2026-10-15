# EFI EPT Insights - user manual

Version 1.0 · 15 October 2026 · English user manual

[Open the demo](app/) · [Nederlands](manual_NL.html) · [Download Markdown](manual_EN.md)

## Quick start: your first demo report

Follow these steps in one regular browser. You do not need your own files or an email address. The demo uses public Werfen / Immucor xPONENT files from the hlapro project. Group values are generated synthetically.

### 1. Sign in as a participant

Open [EPT Insights](app/). If the interface is Dutch, click **EN** at the top. Use username **participant_1** and initial password **5678**. Click **Sign in**.

Have you already changed this password in this browser? Use your changed password. Profiles currently apply only within the same browser and website address.

### 2. Check your profile

Click **My profile** in the top menu. Your profile opens near the bottom of the page. You can enter an email address, for example `participant@example.org` as a test address, or leave it empty. Click **Save profile**. Leave all three password fields empty if you only want to save your email address.

Check: you see **Saved in this browser.** No email is sent. You do not need to change your password for this quick start.

### 3. Register your scheme and vendor

Go to **1. Choose your EPT schemes and vendors** and enter these settings:

| Setting | Choose or enter |
| --- | --- |
| Provider | `provider_1` |
| Scheme / edition | `SAB-2026-DEMO` |
| Vendor(s) | Tick **Werfen / Immucor** |

Click **Add scheme**. Check that a row appears above the form showing `provider_1`, `SAB-2026-DEMO` and `Werfen / Immucor`.

**This step is required.** Selecting only One Lambda will not work for the Werfen demo files. You may register both vendors, but the current importer handles Werfen / Immucor xPONENT + EDS only.

### 4. Load class I and confirm the import

Use **2. Import** to reach **Import an xPONENT run**. Under **Public mock examples**, click **Class I**. Wait for the preview-ready message. You do not need to download CSV or EDS yourself for this route.

Check the fields:

| Field | Quick-start value |
| --- | --- |
| Provider | `provider_1` |
| Scheme / edition | `SAB-2026-DEMO` |
| Round | `ROUND-02` |
| EPT sample | `DEMO-01` |
| Technique according to the performed protocol | `IgG SAB` |
| Source measurement to map | `S001 · 33(1,A5)` |

Tick **I confirm technique, lot and mapping of this source measurement to this EPT sample**. Click **Confirm import**. The report appears and the second public demo class is prepared automatically.

### 5. View classes I and II

Use buttons **I** and **II** above the dashboards. They select the active class; they do not merge the classes.

| Active class | What you see for the first source measurement |
| --- | --- |
| I | Four HLA specificities; the first own MFI is `8002` |
| II | Five HLA specificities, including paired DQ/DP chains |

NC and PC are control beads. They appear under **Quality, control beads and provenance**, outside the specificity chart. The MFI axis always runs from **1 to 10000** and defaults to **Log**. Your values are large coral circles.

**No violin plots or blue peer points yet? That is expected.** Until the provider releases matching demo consensus, only your own results are visible. Continue with the next quick start to test group context.

## Quick start: release group context

Use two tabs in **the same browser, browser profile and website address**. A private window or another browser will not share this demo release.

1. Leave the participant report from the previous quick start open in tab 1. Select class **I** there.
2. Open [the demo](app/) in tab 2. Click **EN** if necessary. Sign in as **provider_1**, initial password **1234**. This tab opens the provider dashboard. Classes I and II load automatically.
3. Select class **I** in tab 2 as well. Check provider `provider_1`, scheme `SAB-2026-DEMO`, round `ROUND-02` and sample `DEMO-01`.
4. Click **Download consensus example**. Save the JSON file and leave its contents unchanged.
5. Click **Load consensus JSON** and choose this downloaded file. Wait for confirmation that demo consensus has been validated.
6. Return to tab 1. Matching group context appears without re-importing: violin plots and smaller blue peer points. This demo uses 18 synthetic laboratories per specificity.
7. For class **II**, repeat steps 3 through 5 with **II** selected in the provider tab. Then select **II** in the participant tab. Class I release does not automatically release class II.
8. Optionally test **Withdraw demo release** in the provider tab. Corresponding peer values disappear from the participant tab; your own results remain.

Calls in the unchanged example are **Not assessed** (`not_assessed`). The file opens synthetic context; it contains no official positive or negative EPT assessment. You do not need to edit JSON for this exercise.

## Roles and page layout

| Role | Screen and capabilities |
| --- | --- |
| Participant | Own profile, schemes and vendors; confirm an import first, then analyse and export |
| Provider | Own demo overview by class and context; download, load and withdraw example consensus |
| Admin | Account overview and dashboard selector to inspect laboratory and provider views |

The admin account is `espierin`. Use the previously configured admin password; it is not included in this public manual. Admin can use **Dashboard** to choose **Admin**, **Participating lab** or **EPT provider**. The admin laboratory view displays its own demo session, not raw imports from other tabs or accounts.

The top menu remains available while scrolling. **Manual** opens these instructions in a new tab so your report stays open. **Concept** explains the platform design. **My profile** opens the profile section. **EN / NL** switches interface language while retaining the active session. The language switch in this manual opens the matching translation.

## Profile, password and email

Under **My profile**, you can save an optional email address. It is retained locally; email verification, notifications and email password recovery are not yet available.

To change your password, enter **Current password**, **New password** and **Repeat new password**, then click **Save profile**. The new values must match. The demo accepts a minimum of four characters. After a successful change, use the new password in this browser; the initial password will no longer work there.

Your account name and role appear in the top menu. **Sign out** clears active imports and peer context from that tab. Saved profile information and scheme enrolments remain. Login is not restored after refresh.

## Participation, schemes and vendors

Register the provider, scheme edition and one or both vendors for each scheme. This demo currently offers only `provider_1` as a provider. You can enter your own scheme edition name to test the structure; the default provider demo release matches only its corresponding context.

**Add scheme** saves a new participation. Adding the same provider and scheme edition again updates that participation's vendor selection. **Remove** deletes the corresponding enrolment. This does not automatically delete an already open report.

The current Werfen import requires enrolment with the same provider and scheme edition and **Werfen / Immucor** as a vendor. One Lambda can already be registered, but there is no working One Lambda importer or One Lambda peer series yet. Registering a vendor does not mean its files can already be imported.

## Demo data and files

| Class | CSV | Matching EDS lot file | HLA beads + controls |
| --- | --- | --- | --- |
| I | [LSA1-test.csv](app/fixtures/LSA1-test.csv) | [3012456_3065421-SA1.eds](app/fixtures/3012456_3065421-SA1.eds) | 4 + NC/PC |
| II | [LSA2-test.csv](app/fixtures/LSA2-test.csv) | [3062145_3045216-SA2.eds](app/fixtures/3062145_3045216-SA2.eds) | 5 + NC/PC |

Files come from [L. Creteig's hlapro](https://github.com/lcreteig/hlapro), under the MIT licence. [Provenance and source hashes](app/fixtures/provenance.json) and the [licence](app/fixtures/LICENSE.md) are available. These are reduced mock files, not complete commercial bead sets or participating laboratory submissions.

Each CSV contains two source measurements. Only the chosen source measurement is mapped to the EPT sample. The second well is not treated as another laboratory. Confirming a public demo import automatically prepares the other demo class with its first source measurement and the same EPT context. User-selected local files do not trigger this automatic demo addition.

## Import step by step

For your own import, choose one xPONENT CSV and one matching EDS file through the file area, or drag them onto it. You can choose both files together or separately. Limits are 20 MB for CSV and 5 MB for EDS. Files are processed in your browser, not submitted to a central server.

Use UTF-8 files and retain the original xPONENT sections, including Median. An arbitrary table containing only MFI columns is not a supported export.

The preview checks CSV structure, EDS readability, lot matching and bead definitions, among other things. It shows lot, class, source measurements, observations, mapping issues and SHA-256 source hashes. A valid preview is not yet a confirmed import.

Check provider, scheme edition, round and sample. Select the technique actually performed and the intended source measurement. Technique is not inferred from the bead set. Then tick the confirmation box and select **Confirm import**. A failed new import does not replace the existing report.

To analyse the other source measurement in the same file, reload the example or files, select the other source measurement in the preview and confirm again. The report's **Source measurement** field shows the confirmed mapping; it does not freely switch between wells.

Buttons **I / II** restore separate imports, loci and measurement sections. **Clear session** removes both imports and previews from the active session. It does not delete your profile, enrolments or locally retained provider release.

## Techniques, loci and measurement sections

**Technique** selects **SAB**, **C1q** or **C3d**. The demo is intended for IgG SAB. C1q and C3d have parallel data structures and remain strictly separate, but their import has not yet been validated with genuine assay files. Selecting C1q/C3d does not turn an IgG measurement into a complement-binding assay. An unmeasured technique displays an empty state.

Locus buttons are **A**, **B**, **C**, **DRB1**, **DRB3-4-5**, **DQ** and **DP**. You can select several loci. Inapplicable loci are disabled. Active technique buttons are blue; active locus buttons are coral. Selecting no loci produces an empty chart and table.

Use **Measurement section** to select **Median** or **Net MFI**, if the source contains that section. Original values are preserved. Matching valid consensus stays active when switching; synthetic references are recalculated for the chosen section. These small demo files may contain identical values in both sections.

## Reading charts and consensus

The chart and table use **PL Strings** instead of bead numbers. DQ and DP retain paired alpha and beta chains, for example `HLA-DQA1*02:01~HLA-DQB1*02:01`. Techniques, classes and EPT contexts are not merged.

| Visual element | Meaning |
| --- | --- |
| Large coral marker | Your laboratory result |
| Small blue marker | Synthetic peer value, without laboratory identification attached to the point |
| Circle | Werfen / Immucor |
| Square | Reserved for One Lambda in the extensible chart design |
| Violin plot | Distribution of selected peer values, excluding your own laboratory |
| Dashed boundary marker | Positive value below 1 or above 10000, displayed at the axis boundary |

The MFI axis runs from **1 to 10000** in every view. **Log** is the default; **Linear** is an explicit alternative. Logarithmic minor ticks appear on the axis only. All displayed MFI numbers are rounded integers without a thousands separator, for example `8002`. Calculations and numeric exports preserve `8001.5` if that was the source value.

**Individual peer values** shows or hides blue points without changing the violin. **Merge** calculates one distribution from pooled vendor observations per valid specificity. **Separate** calculates a distribution for each vendor separately. Only Werfen is present in this demo, so both modes use the same peer series. These modes are unavailable before release.

The demo reference uses 18 generated laboratories per valid positive measurement. These are not actual peer submissions. The table shows own MFI, provider call and counts of laboratories, measurements and non-positive/invalid reference values, among other fields. Positive values outside the visible axis remain in data and statistics. Zero, negative, missing or invalid values are not included in logarithmic density. Too few or constant reference values may produce no violin.

The violin uses Gaussian kernel density estimation on log10 MFI, with bandwidth 0.18 and 100 evaluation points. At least five valid positive reference values are required; a constant series receives no violin. Violins have equal maximum width, so width does not independently indicate laboratory count. The own laboratory is excluded from references. Unique laboratories and measurement observations are separate counts; repeated exports must not inflate them.

## Provider: release and withdrawal

A demo release is scoped to **provider + scheme edition + round + sample + technique + class**. Version, explicit release and a valid date are checked. A file with the wrong context, class, technique or invalid structure is rejected. An invalid attempt does not replace an existing valid release.

The provider dashboard uses the public class I and II demo and does not offer a general editor for every possible round. Download the current example for the selected class, load it back and check its status. Edit JSON only if you deliberately want to test a different scenario. A future release date is invalid.

The saved demo release is applied to matching imports in the same browser. An already open matching participant tab receives changes automatically. Other browsers, browser profiles and computers do not share the status. Withdrawal removes the release for the active class and context; it does not delete own measurements.

## Export, quality information and storage

**CSV** exports the active selection and context. **JSON + metadata** also retains provenance, raw numerical precision, axis range, measurement section, consensus status and analysis method. **SVG** exports the current vector figure with an embedded font and metadata. Make a separate export for each class and desired selection. An SVG is a visual snapshot, not a complete database export.

**Quality, control beads and provenance** contains NC/PC, source information and checks. This supports file inspection; the app does not provide official quality approval or an EPT score through this information.

| Information | Retention in this demo |
| --- | --- |
| Login and imported measurements | Active tab only; cleared on sign-out or refresh |
| Profile, changed password and scheme enrolments | Local browser storage for this website address |
| Provider demo release | Local browser storage, shared between tabs with the same origin |
| Downloaded exports | The download location used by your browser |

For a clean exercise, use a separate browser profile. Clearing website data also deletes changed passwords, email, enrolments and demo releases; the initial demo accounts then return. Do not clear these data if you want to retain those local settings.

## Troubleshooting

| What you see | What to check |
| --- | --- |
| Sign-in fails | Exact account name and any locally changed password; wait until the button is enabled |
| Enrolment or Werfen message | Add the correct scheme and tick Werfen / Immucor; check the same provider and scheme edition during import |
| Confirm import unavailable | Load a valid CSV/EDS pair or click Class I/II; wait for preview and tick confirmation |
| `lot_mismatch` | Use CSV and EDS from the same row of the file table |
| Own points only, no violin | Have the provider release the correct class and context in the same browser |
| Consensus rejected | Check provider, scheme, round, sample, class, technique, version and date; use a freshly downloaded example |
| Class II button briefly disabled | Wait for preparation of the second demo class; check any import message |
| Empty chart | Select a measured technique and at least one applicable locus |
| Merge and Separate look identical | Only one vendor has measurement data in this demo |
| Missing minor ticks | Select Log; Linear has no logarithmic subdivisions |
| Sign-in/import required after refresh | This is current session behaviour; local settings and release may still be retained |
| Another computer cannot see release | The demo has no central storage yet; repeat the exercise in the same browser |

## Current limits and further documentation

This is a browser demo with local accounts, not secure central authentication or protected storage. Publicly published files remain public. Central submissions, email recovery, One Lambda import, validation with genuine C1q/C3d files and official EPT assessment are not yet available. Use the quick start with the public demo files.

[Platform concept](concept_EN.html) · [EPT style guide](style_EN.html) · [General EFI style](efi-style_EN.html) · [Repository](https://github.com/espierin/ept)
