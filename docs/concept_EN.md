# EFI EPT - platform concept

Version 1.1 · 16 October 2026 · Public design documentation

**Status on 16 October 2026:** the current browser demo and proposed central platform are described separately below. The private storage, real sign-in and external backend proposal is documentation only; these features have not been implemented.

## Purpose

A bilingual research prototype for supplementary analysis of HLA single antigen bead results within EPT distributions. Participants can inspect their own measurements and compare them with suitable references after provider release. This is a developing design, not an official EFI service, accreditation assessment or medical advice.

## EPT context and identity

The structure is **provider → scheme/year edition → round → sample → technique → lot-specific analytical target**. Identical sample codes at different providers do not identify the same material. Providers, rounds and samples stay separate. Region is organisational metadata, not a peer-group definition. Provider enrolment is recorded only after confirmation.

## Own data and release

A participant can upload, validate and inspect own data before consensus release. Group data remain restricted. The authorised provider uploads officially released consensus with scope and version; validation and processing unlock the matching group context for authorised participants. A date, filename or participant action cannot trigger this.

The first local version processes files solely in the browser. There is no central upload, account environment or production permission model yet. Local demonstration of consensus release is not real provider authorisation. Real collaboration requires private submission contexts and access enforcement.

## Techniques and vendors

Conventional **IgG SAB**, **C1q** and **C3d** are parallel, separate techniques. Shared beadsets do not make measurements or consensus interchangeable. SAB in the interface means IgG SAB. Werfen/Immucor and Thermo Fisher/One Lambda have separate importer adapters; the first implementation starts with Werfen xPONENT CSV + EDS. MATCH IT! follows later. Unvalidated formats are explicitly rejected.

## Laboratory report

Technique offers SAB/C1q/C3d. Locus offers A, B, C, DRB1, DRB3-4-5, DQ and DP. Both rows align; multiple loci can be selected. The chart axis shows bead composition as a **PL String**, never bead numbers as main labels. DQ/DP chains are paired only through confirmed mapping; ambiguous exports are not silently reconstructed.

**Merge** computes one violin from pooled eligible vendor measurements for the same target. **Separate** computes one violin per vendor. Context, technique, quantity and explicit lot selection stay fixed. A laboratory can contribute two vendor measurements while counting once as a unique lab. Show laboratory and measurement counts. Own values are excluded from the reference by default.

MFI axes always start on **log10**, with original MFI units as labels. Zero, negative, missing and invalid remain separate; no silent replacement with 1. Small cohorts do not get artificial violins. Peer points use circles for Werfen and squares for One Lambda, all blue. Own points use the same vendor shape, are larger and coral. Peer points contain no laboratory identity.

## Input and output

Input comprises source exports, technique, lot metadata and confirmed mapping of local samples to the EPT context. EDS files support lot-specific bead annotations. Control beads are distinct from analytical targets. Source values remain unchanged; corrected and normalised measurements are different quantities. HAML can support interchange but does not replace provider/release metadata.

Outputs include import validation, own measurement tables, context-specific charts and reproducible JSON/CSV/SVG exports with source hash, method version, inclusions, exclusions and active filters. Official consensus assignments originate from provider consensus, never a substituted universal MFI cutoff.

## Privacy and publication

This public site contains approved design documentation, style conventions and synthetic illustrations only. Private correspondence, source PDFs, patient fields, tokens and real participant data are not published. Removing names does not automatically make peer data public. GitHub Pages is the public documentation layer; confidential data require a separate private context.

## Design images

The images are synthetic orientation views; implementation uses original logos and SVG components.

![Round overview after release](assets/mockups/overview-en.png)

![Own results before consensus](assets/mockups/own-en.png)

![Group context after consensus](assets/mockups/report-en.png)

## Public sources

- [EFI EPT Committee](https://efi-web.org/efi-committees/ept-committee)
- [EFI EPT providers](https://efi-web.org/efi-committees/ept-committee/ept-providers)
- [HAML](https://github.com/societyforimmunepolymorphism/haml)
- [IHIW converters](https://github.com/IHIW/Converters)
- [hlapro and public mock files](https://github.com/lcreteig/hlapro)
- [PL String specification](https://plstring.org/)

Public source links do not establish collaboration or enrolment. [EFI style guide](style_EN.html).

## Separate dashboards by user role

The participating laboratory dashboard contains its own import, measurements, report and exports. Group context becomes visible only after release by its EPT provider. The separate provider dashboard contains the overview by provider, scheme/edition, round, sample and technique, with consensus validation and release. Providers and techniques remain separate.

In the current browser prototype, the dashboard selector switches between these routes. This is navigation within a simulation, not authentication or secure authorisation. A new laboratory import rechecks whether a valid local demo release exists for the active context; otherwise only own data remain visible.

## Roles, sign-in and participant workflow

There are three demo roles: admin, provider and participant. Admin espierin sees the account overview and can inspect the other two dashboards. Provider provider_1 sees the consensus route. Participant participant_1 first chooses EPT schemes and vendors, then imports CSV and EDS, and sees analyses only after confirmation. Reporting remains linked to the enrolled provider and scheme edition. One Lambda participation can already be registered; its importer is not yet available.

My profile lets you add an optional email address and change your password. A password change requires the current password and repetition of the new password. No emails are sent and email recovery is not yet available. Signing out clears imported results and reference data from the session.

This is a local account simulation on GitHub Pages. The site contains salted PBKDF2-SHA256 verifiers with 210,000 iterations, with no readable initial passwords. Changed passwords, email and scheme enrolments are stored in localStorage under ept-demo-accounts-v1 and apply only to this browser and site origin. Login is not retained after refresh. Clearing local storage restores the original demo accounts. Even with hashes, browser code cannot enforce real authorisation; every publicly published file remains public. Production requires an authentication service, protected storage and server-side checks by role, provider and enrolment. Email verification and account recovery follow in that phase.

## Logarithmic axis subdivisions

The MFI axis defaults to log10. Major ticks mark powers of ten. Each decade contains short axis ticks for multiples 2 through 9, positioned logarithmically. These subdivisions do not extend as gridlines into the chart. Linear mode has no logarithmic minor ticks. SVG export preserves the subdivisions.

## MFI display

Display MFI values as rounded integers with no dot, comma or space as a thousands separator. Apply this to tables, axis labels and tooltips in both languages. Example: 8001.5 is displayed as 8002. Calculations and CSV/JSON data exports retain original precision; point positions are bounded only at the visible axis limits; SVG export follows the visual integer display.

Demo releases are retained in this browser by provider, scheme, round, sample, class and technique. A matching participant import applies the release; withdrawal removes that local release. Other browsers do not yet share this status. No raw laboratory results are stored centrally.

## Both demo classes and a fixed MFI axis

The public demo includes class I (four HLA beads) and class II (five HLA beads), each with its own CSV and EDS lot file. Admin and provider receive both demo classes after sign-in. A participant first confirms a public demo import; the other demo class is then added automatically. This applies only to the public demo. User-selected files do not automatically mix with demo data. Use buttons I and II to switch. Data, lot, loci, measurement section and consensus remain separate by class; signing out clears both imports.

All MFI charts use a fixed visible range from 1 through 30000 in both logarithmic and linear modes. The log axis has major ticks at 1, 10, 100, 1000, 10000 and the upper limit 30000, with short logarithmic subdivisions on the axis only. Values outside the visible range receive dashed boundary markers and are counted in the chart explanation. Source data, calculations and numeric exports retain their original values. Ticks at 10, 100, 1000 and 10000 are longer than minor ticks. Values above 30000 are plotted at exactly 30000. Fixing the axis does not change measurements.

Five additional browser checks in `app/tests/classes.cjs` cover default class II import, paired DQ/DP specificities, switching back to class I, both fixed axes, values below 1 and above 30000, export precision and clearing both classes on sign-out.

## Proposed central architecture: status and scope

**Design proposal dated 16 October 2026, not implemented.** The current local browser demo continues to behave as documented. The `ept-data` repository, backend, identity service and production permissions below have not been created. Demo accounts do not automatically become production accounts. These sections describe the intended next phase and do not replace existing access control with a security claim.

The preferred design retains the public website on GitHub Pages and stores permitted source files and processed measurement files in a separate **private repository named `ept-data`**. An external backend provides real sign-in, authorisation, validation, storage and report delivery. Users do not need GitHub accounts or direct repository access.

| Component | Intended responsibility | Location and access |
| --- | --- | --- |
| Public `ept` repository and GitHub Pages | Interface, code, manual, style guide and permitted demo files | Public; no real submissions or secret keys |
| Private `ept-data` repository | Unchanged permitted sources, normalised measurement files, import manifests and consensus versions | Storage service and explicitly authorised administrators only |
| FastAPI backend | Verify sessions/tokens, enforce role and scope, serve the API and exports | Separate HTTPS hosting; does not run in GitHub Pages |
| PostgreSQL | Account identifiers, labs, provider relationships, roles, approved enrolments, job status, file index and audit | Private database behind the backend |
| Background worker | Validate/process files, write Git commits and update the index | Separate process with durable PostgreSQL jobs |
| OpenID Connect identity service | Passwords, email verification, recovery and MFA | Managed identity service; no password database in Git |
| Private temporary file storage and secret management | Controlled upload buffer and protected service keys | Backend environment with restricted retention and access |

This is a concrete preferred stack, not a technical requirement to use Python. Another backend is possible if it meets the same authorisation, storage and processing contracts. Hosting provider, identity service, region, agreements and costs must be selected before implementation.

## Required backend and hosting

The minimum comprises an HTTPS API, background worker, durable PostgreSQL database, OpenID Connect provider and secure secret management. A PostgreSQL job table can provide the pilot's durable queue; Redis is then optional. The worker runs outside the web request, so an upload or GitHub outage does not depend on keeping a browser tab open. Temporary uploads are encrypted in private object storage and deleted after processing or rejection according to a configured retention period.

FastAPI is proposed as a container service, with a separate worker process and managed database. Both processes must resume unfinished work reliably after restart. The proposal does not require a dedicated physical server, but does require external compute and storage services alongside GitHub Pages. GitHub Actions may later run checks or scheduled archiving; it is not the interactive sign-in or access-control server.

The backend validates files even if the browser has already checked them. Browser validation is user assistance only. Supported formats, size, encoding, lot matching, samples, technique, class assignment and measurement sections are checked again server-side. The first central importer remains Werfen xPONENT CSV + EDS; One Lambda, MATCH IT!, C1q and C3d receive production status only after their own validation.

Hosting must support HTTPS, fixed permitted redirect URLs, private database connections, separate test/production environments, monitoring, backups and recovery. Real data additionally require decisions about location, retention and organisational responsibilities. An EU region for API/database does not automatically give GitHub storage the same data location; suitability of the selected GitHub service requires a separate assessment.

## Real sign-in and account lifecycle

The proposal uses OpenID Connect with **Authorization Code + PKCE**, through an appropriate client library. The identity service handles sign-in, email verification, password changes and recovery. MFA is required for admin and provider; participant policy must be established before use. Public demo passwords are not carried over. Production accounts are created through controlled invitations and confirmed association with a laboratory or provider.

The browser receives only short-lived user access to the EPT API. Long-lived service credentials and GitHub tokens never enter the browser. Access tokens are not stored as a production equivalent of the current localStorage login. The backend verifies token signature, issuer, audience and validity. The immutable identity issuer and subject identify a user; an email address or display name is not a permanent account ID.

PostgreSQL retains the internal user ID and current role grants. Roles supplied through forms, URLs or localStorage are never authoritative. A blocked account, revoked role or expired enrolment loses access at the next API check even if an access token has not yet expired. Production sign-out covers the application session and, where appropriate, the identity service; refreshing does not delete centrally stored submissions.

The pilot frontend may remain at `espierin.github.io/ept`, with an API on another HTTPS host and an explicitly allowed CORS origin. CORS distinguishes origins, not project paths: `/ept` is not a separate origin within `espierin.github.io`. CORS is not authorisation. Production preferably uses a domain dedicated exclusively to EPT. The future Content Security Policy must explicitly permit the selected API and identity hosts; the current demo remains unchanged. Any cookie/BFF arrangement requires a separate design covering SameSite, CSRF and cross-domain behaviour.

## Permissions by role, laboratory and provider

A user account is not a laboratory. Multiple users may belong to one laboratory; a laboratory may participate with multiple providers and schemes. Roles are scoped grants, for example provider management for one provider and specified scheme editions. A user may hold multiple grants, but the active context must always remain visible and bounded.

| Action | Participant | Provider | Admin |
| --- | --- | --- | --- |
| Manage own profile | Own account | Own account | Own account |
| Request participation and vendors | For linked laboratory | For own organisation where applicable | Administration and correction |
| Approve participation | No | Own provider and scheme only | Platform administration with audit |
| Submit and retrieve results | Own lab, approved participation and open round | Own provider context under documented authority | Explicit, logged administrative access only |
| Inspect other laboratories' submissions | No raw files | Own provider and assigned schemes only | Explicit administrative access; no silent laboratory impersonation |
| Prepare, publish and withdraw consensus | No | Own scope only | Only with explicit authority and reason |
| Retrieve group context | Matching authorised lab and valid release only | Own provider context | Within explicit administrative scope |
| Manage roles and provider organisations | No | Cannot grant platform roles | Yes, with audit |

At a later initial deployment, the first admin is explicitly linked to the verified identity of the platform owner. The display name `espierin` does not itself grant permissions. There is no hardcoded admin password or open self-promotion route; subsequent role changes use the audited administration process.

A participant may specify a scheme and vendors, but cannot thereby grant access to themselves: the provider approves participation. The backend derives lab ID from account association and checks provider, scheme, round and sample access. A participant cannot select another laboratory by changing an upload or URL ID. Vendor registration does not enable an unvalidated importer.

Every read, write, download and export request receives the same checks. Access is denied by default. No role receives the entire private repository or GitHub access tokens through the web application. Direct GitHub access remains restricted to the storage service and designated administrators, because a directory is not a per-laboratory security boundary.

## ept-data layout and data contract

`ept-data` is the intended private repository name; creation is a separate future step. GitHub Pages publishing is not enabled for this repository. The public `ept` build must not fetch the private repository or include any of its files.

One possible layout, solely a schema with fictional internal IDs:

```text
providers/{provider_id}/editions/{edition_id}/rounds/{round_id}/samples/{sample_id}/
  submissions/{submission_id}/revisions/{revision_id}/
    source/run.csv
    source/lot.eds
    normalized/measurements.json
    validation/report.json
    manifest.json
  releases/{technique}/{hla_class}/{release_id}/
    consensus.json
    cohort-manifest.json
    release.json
```

The submission manifest includes at least schema/parser/method versions, provider, edition, round, sample, lab ID, vendor, technique, class, lot, selected source measurement and well, measurement sections, source hashes, file references, receipt time and revision. The cohort manifest references the exact eligible submission revisions and analysis method. Physical directories and metadata must agree; the database makes information searchable without deriving authorisation from paths.

Accepted source files remain unchanged. A correction creates a new revision referencing its predecessor and giving a reason; there is no silent overwrite. Only permitted source files enter Git. Uploads with prohibited patient or identifying fields are stopped before archiving; the submitter must supply a suitable file. Silently stripping fields must not result in a modified file being presented as the original.

User passwords, access tokens, email lists and the identifying laboratory-name/user mapping are not stored in the measurement repository. That mapping is protected in the identity service/database. Internal IDs reduce identification in filenames but do not automatically make private measurement files anonymous or public.

## Saving, processing and retrieving data

The participant follows **sign in → select approved participation → confirm files and source measurement → server validation → storage → own analysis**. The server checks permissions before accepting an upload. Provider, laboratory and source mapping are revalidated; a client declaration alone is insufficient.

The API may initially return a job ID with status `queued`. This does not yet mean the submission is durably stored. Proposed job states are `queued`, `validating`, `rejected`, `committing`, `indexing` and `available`, with a separate recoverable `failed` state. The interface reports saved/available only after confirmation of Git commit, source-hash verification and database indexing.

The worker processes the temporary upload, creates a coherent Git commit for sources, normalisation and manifest, and records commit SHA and revision in PostgreSQL. Git and database do not share a transaction. Durable jobs/outbox, repeatable processing and reconciliation are therefore required. Restarting after a successful commit must not create a duplicate submission. An idempotency key includes confirmed submission context; file hash alone is insufficient because one file can contain multiple wells or legitimate contexts.

The pilot uses one writer per repository, checking the expected branch head and retrying conflicts. Conflicting versions are never blindly overwritten. Queue delays, GitHub limits and transient outages are returned as job status. To reload on another device, the backend retrieves the authorised index and files again; the user receives neither a direct private GitHub download URL nor a repository token.

## Consensus release as central state

Release remains scoped to **provider + scheme edition + round + sample + technique + class**, with a valid source, version, date, recorded measurement quantity and eligible lot selection. Only an authorised provider, or an admin explicitly authorised for that action, may publish. Uploading a consensus file first produces a validated draft and does not itself unlock group context.

Proposed release states are `draft`, `validated`, `published`, `revoked` and `superseded`. Publication fixes a version including consensus and the cohort of valid submission revisions. New submissions or changed analyses do not silently alter a previously released cohort; they require a new cohort/release version. Official consensus remains the provider source and is not inferred from a universal MFI threshold.

For participants, group charts, peer points, group statistics and associated exports are denied server-side before `published`. The backend checks role, current participation and release status for every request. Caches are separated by context, permission and version; sensitive responses use a private/no-store policy. An invalid request must not contain a hidden peer dataset or downloadable source.

Withdrawal closes subsequent group requests and invalidates affected report caches. Own submissions remain accessible under valid permissions. An already downloaded export cannot technically be recalled; reports therefore carry version, release time and status information. Republication creates a new version. Current browser-local demo releases are not migrated as central official releases.

## Anonymisation and cross-provider quality comparisons

The backend retains laboratory identity internally for authorisation, deduplication and exclusion of the own laboratory. Participant responses contain no lab ID, account name, email, another laboratory's filename, hidden point ID or alternative route to its raw file. Both vendors may contribute, but one laboratory counts once as a unique lab. Peer points retain vendor shape and common peer colour; techniques and quantities remain separate.

Before real use, an explicit policy for small cohorts and identifiable points must be established. The privacy minimum cohort size is a different setting from the minimum required for a violin. Providers may review group information internally earlier; that does not yet give participants access.

An overarching quality analysis of controls requires a separately authorised project, confirmed mapping to shared control material, explicit provider approval and an appropriate publication scope. Matching sample codes or regions do not establish a shared control. EPT rounds and unknown samples are not merged. Vendor results remain separately interpretable and may be compared through specificity consensus. This grants no mutual access to private provider repositories or raw laboratory data.

## Proposed API contracts

These are design interfaces, not existing endpoints. The backend always derives scope from verified identity, database associations and the requested EPT context.

| Interface | Input and checks | Intended output |
| --- | --- | --- |
| `GET /me` | Valid identity and account status | Profile, laboratories and permitted role scopes |
| `POST /participations` | Lab association, provider, edition and vendors | Request with approval state, no automatic access right |
| `POST /imports` | Approved participation, open round, source files, technique and confirmed well/sample mapping | Job ID and validation status |
| `GET /jobs/{id}` | Requester or authorised provider/admin | Progress, useful error code and revision reference |
| `GET /submissions/{id}` | Lab ownership or explicit provider/administrative scope | Own or permitted submission at a fixed revision |
| `POST /releases` | Provider authority, source consensus and context | Validated draft with errors or warnings |
| `POST /releases/{id}/publish` | Rechecked authority and complete validated version | Published release and cohort version |
| `POST /releases/{id}/revoke` | Authority and reason | Revoked status and audit reference |
| `GET /group-context` | Current participation, exact context and published version | Permitted chart data and counts without peer identity |
| `POST /exports` | Same permissions as displayed data, class, technique, filters and version | Reproducible CSV/JSON/SVG through authorised delivery |
| `POST /admin/role-grants` | Admin authority, scope, target account and reason | Recorded role change with audit |

## GitHub integration, operations and growth

The backend uses a GitHub App for the storage service, installed on `ept-data` only, with minimum repository permissions: initially Contents read/write and necessary metadata. No workflow, organisation-administration or public-site write permissions. Its private key stays in a secrets manager; short-lived installation tokens remain server-side. The service writes under its own technical identity; internal audit records which authorised EPT user initiated the action. A shared personal access token in the frontend is not part of this design.

Audit records actor ID, effective role and scope, action, target ID, time, reason, outcome, source/report version and commit SHA where appropriate. Audit details have restricted access and contain no passwords, tokens or unnecessary raw measurements. Git history does not replace this audit. Backups cover repository, database, identity configuration and recoverable key configuration; recovery must be tested as one coherent dataset.

Retention and deletion rules must cover Git history, temporary files, caches and backups. Deleting a file from the current branch does not remove it from earlier commits. If the required deletion or data-location guarantees cannot be met with the selected GitHub storage, private object storage must hold measurement files and Git only suitable version manifests. This is an explicit decision before storing real data.

GitHub is a version archive for a bounded pilot in this design, not a database for every individual measurement or chart click. PostgreSQL is the operational authorisation and index layer. Size, commit throughput, waiting times, conflicts and retention needs are measured. Growth or different retention requirements may lead to object storage using the same file contracts, with GitHub as a manifest/version archive. No costs or maximum participant counts are asserted at this stage.

## Conditions for a later implementation phase

Before implementation, decide hosting/identity service, domain, data location, permitted source content, retention, provider authority, participation approval and the privacy policy for small cohorts. This design creates no external services, keys or accounts.

Later acceptance tests must show at least that participants cannot select another lab, providers cannot access another provider, self-registration cannot approve participation, hidden endpoints and exports enforce the same rights, and blocking/withdrawal take effect even with still-valid tokens. Also required: no peer access before release, no mixing classes/techniques/measurement sections, correct dual-vendor deduplication, intact file hashes, no duplicate commits on retry, recovery after failure between Git commit and database update, and successful backup/recovery and deletion exercises. Permissions must be tested with genuinely separate accounts and server checks, not merely by hiding buttons.

## Technical sources for the architecture proposal

The cited product capabilities were checked on 16 October 2026. The architecture choices above are project proposals, not EPT functionality supplied by GitHub.

- [GitHub Pages is static hosting](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).
- [GitHub repository contents API](https://docs.github.com/en/rest/repos/contents).
- [GitHub App installation tokens and restricted repository permissions](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app).
- [GitHub App: credentials and authorisation](https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/best-practices-for-creating-a-github-app).
- [GitHub repository limits](https://docs.github.com/en/repositories/creating-and-managing-repositories/repository-limits).
- [FastAPI deployment concepts](https://fastapi.tiangolo.com/deployment/concepts/).
- [OAuth 2.0 Security Best Current Practice, RFC 9700](https://www.rfc-editor.org/rfc/rfc9700.html).
