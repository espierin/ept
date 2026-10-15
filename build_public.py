"""Build only explicitly public documents. Never recurse through project sources."""
from pathlib import Path
import hashlib, html, json, re, shutil
from urllib.parse import urlsplit, unquote
import markdown

ROOT = Path(__file__).resolve().parent
WORKSPACE = ROOT.parent
OUT = ROOT / 'docs'
ASSETS = OUT / 'assets'
ASSETS.mkdir(parents=True, exist_ok=True)
for name in ('logo-color.svg', 'logo-white.svg', 'montserrat-variable.ttf', 'montserrat-italic-variable.ttf'):
    shutil.copy2(WORKSPACE / 'efi_style/assets' / name, ASSETS / name)
css = (WORKSPACE / 'docs/assets/efi-documentation.css').read_text(encoding='utf-8')
css = css.replace('../../efi_style/assets/', '')
css += '\n.hero{position:relative;padding-right:max(140px,calc((100vw - 1320px)/2 + 120px))}.hero-logo{position:absolute;right:max(28px,calc((100vw - 1320px)/2));top:36px;width:76px;height:76px}.top .brand{color:var(--blue);font-weight:700;font-size:22px}.hero p{max-width:70ch}.top a{white-space:nowrap}@media(max-width:600px){.hero{padding-right:24px;padding-top:126px}.hero-logo{top:24px;left:24px;width:64px;height:64px}.top{padding:18px;gap:14px}.top img{width:65px;height:48px}}'
(ASSETS / 'efi.css').write_text(css, encoding='utf-8')
(ASSETS / 'mockups').mkdir(exist_ok=True)
for lang in ('nl','en'):
    for source, target in [('ept-round-overview','overview'),('ept-sample-report-merge','report'),('ept-sample-report-own-only','own')]:
        shutil.copy2(WORKSPACE / f'Brainstorm folder/assets/website-mockups/{source}-{lang}.png', ASSETS / f'mockups/{target}-{lang}.png')

def render(stem, lang, content):
    other = 'EN' if lang == 'NL' else 'NL'
    nl = lang == 'NL'
    title = content.splitlines()[0].removeprefix('# ')
    body = markdown.markdown('\n'.join(content.splitlines()[1:]), extensions=['tables','fenced_code','toc'])
    toc = ''.join(f'<a href="#{m[0]}">{m[1]}</a>' for m in re.findall(r'<h2 id="([^"]+)">(.*?)</h2>',body))
    page = f'''<!doctype html><html lang="{lang.lower()}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="strict-origin-when-cross-origin"><title>{html.escape(title)}</title><link rel="icon" href="assets/logo-color.svg"><link rel="stylesheet" href="assets/efi.css"></head><body><header class="top"><img src="assets/logo-color.svg" alt="EFI"><a class="brand" href="index_{lang}.html">EPT Insights</a><div class="header-actions"><a href="concept_{lang}.html">{'Concept' if nl else 'Concept'}</a><a href="style_{lang}.html">{'Stijlgids' if nl else 'Style guide'}</a><a class="language-switch" href="{stem}_{other}.html" lang="{other.lower()}" hreflang="{other.lower()}">{other}</a><button class="print" onclick="window.print()">{'Afdrukken' if nl else 'Print'}</button></div></header><div class="hero"><div class="eyebrow">EFI · EPT · {'Onderzoeksprototype' if nl else 'Research prototype'}</div><h1>{html.escape(title)}</h1><p>{'Publieke ontwerpdocumentatie · in ontwikkeling' if nl else 'Public design documentation · work in progress'}</p><img class="hero-logo" src="assets/logo-white.svg" alt="EFI"></div><div class="layout"><aside><strong>{'INHOUD' if nl else 'CONTENTS'}</strong>{toc}<a href="{stem}_{lang}.md">Markdown</a></aside><main>{body}</main></div><footer>{'Projectdocumentatie · geen officiële EFI-dienst' if nl else 'Project documentation · not an official EFI service'}</footer></body></html>'''
    (OUT / f'{stem}_{lang}.html').write_text(page,encoding='utf-8')
    (OUT / f'{stem}_{lang}.md').write_text(content,encoding='utf-8')
    return page

for lang in ('NL','EN'):
    for stem in ('concept','style'):
        render(stem,lang,(ROOT / f'public_content/{stem}_{lang}.md').read_text(encoding='utf-8'))
    text = ('# EFI EPT Insights\n\n## Concept en ontwikkeling\n\nEen onderzoeksprototype voor HLA single antigen bead-analyse binnen EPT. De documentatie beschrijft de structuur, beoogde invoer en uitvoer en EFI-opmaak. De applicatie wordt eerst lokaal gebouwd en getest; deze site bevat nu de publieke documentatie.\n\n- [Lees het platformconcept](concept_NL.html)\n- [Bekijk de stijlgids](style_NL.html)\n- [Repository](https://github.com/espierin/ept)\n\n## Status\n\nDocumentatie gepubliceerd op 15 oktober 2026. De ontwerpbeelden bevatten uitsluitend synthetische resultaten. Er worden via deze website geen deelnemersbestanden ontvangen. Interne communicatie en oorspronkelijke inzendingen staan niet in deze publicatie.\n' if lang=='NL' else '# EFI EPT Insights\n\n## Concept and development\n\nA research prototype for HLA single antigen bead analysis within EPT. The documentation describes structure, intended inputs and outputs, and EFI styling. The application is being built and tested locally first; this site currently contains public documentation.\n\n- [Read the platform concept](concept_EN.html)\n- [View the style guide](style_EN.html)\n- [Repository](https://github.com/espierin/ept)\n\n## Status\n\nDocumentation published on 15 October 2026. Design images contain synthetic results only. This website does not receive participant files. Internal communication and original submissions are not part of this publication.\n')
    page=render('index',lang,text)
    if lang=='NL': (OUT / 'index.html').write_text(page,encoding='utf-8')
(OUT / '.nojekyll').touch()

errors=[]
for p in OUT.rglob('*'):
    if not p.is_file(): continue
    if p.suffix.lower()=='.pdf': errors.append(f'Forbidden PDF: {p.name}')
    if p.suffix in ('.html','.md','.css','.svg','.json'):
        text=p.read_text(encoding='utf-8')
        for forbidden in ('RE_ EFI EPT Committee','Qualitative trend analyses on single antigen data','Yvonne','22 September 2025','27 March 2025','Patient Name','19s05189'):
            if forbidden in text: errors.append(f'Private/source content marker in {p.name}: {forbidden}')
        if p.suffix=='.html':
            for ref in re.findall(r'(?:href|src)="([^"]+)"',text):
                u=urlsplit(html.unescape(ref))
                if not u.scheme and u.path and not (p.parent/unquote(u.path)).exists(): errors.append(f'Missing asset {ref}')
assert not errors, errors
manifest={str(p.relative_to(OUT)).replace('\\','/'): hashlib.sha256(p.read_bytes()).hexdigest() for p in OUT.rglob('*') if p.is_file() and p.name!='publication-manifest.json'}
(OUT/'publication-manifest.json').write_text(json.dumps({'scope':'Explicit public documentation only','files':manifest},indent=2),encoding='utf-8')
print(f'Public build: {len(manifest)} allowlisted files; no private PDF or correspondence markers; links valid.')
