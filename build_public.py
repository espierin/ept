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
    source=WORKSPACE / 'efi_style/assets' / name
    if source.exists(): shutil.copy2(source, ASSETS / name)
if not (ASSETS/'efi.css').exists():
    css = (WORKSPACE / 'docs/assets/efi-documentation.css').read_text(encoding='utf-8').replace('../../efi_style/assets/', '')
    css += '\n.hero{position:relative;padding-right:max(140px,calc((100vw - 1320px)/2 + 120px))}.hero-logo{position:absolute;right:max(28px,calc((100vw - 1320px)/2));top:36px;width:76px;height:76px}.top .brand{color:var(--blue);font-weight:700;font-size:22px}.hero p{max-width:70ch}.top a{white-space:nowrap}@media(max-width:600px){.hero{padding-right:24px;padding-top:126px}.hero-logo{top:24px;left:24px;width:64px;height:64px}.top{padding:18px;gap:14px}.top img{width:65px;height:48px}}'
    (ASSETS / 'efi.css').write_text(css, encoding='utf-8')
for name in ('specimen.css','style-demo.js','tokens.css'): shutil.copy2(ROOT/'public_content'/name,ASSETS/name)
banner=ROOT/'app/assets/antibody-hla-banner.png'
if banner.exists():shutil.copy2(banner,ASSETS/'antibody-hla-banner.png')
(ASSETS / 'mockups').mkdir(exist_ok=True)
for lang in ('nl','en'):
    for source, target in [('ept-round-overview','overview'),('ept-sample-report-merge','report'),('ept-sample-report-own-only','own')]:
        original=WORKSPACE / f'Brainstorm folder/assets/website-mockups/{source}-{lang}.png'
        if original.exists():shutil.copy2(original, ASSETS / f'mockups/{target}-{lang}.png')

def specimens(content,lang):
    nl=lang=='NL'
    colours=[('blue','#064A89','EFI blue'),('coral','#DE5757','EFI coral'),('ink','#232424','Ink'),('white','#FFFFFF','White'),('surface','#F4F6F9','Surface'),('light','#EAEAEA','Light'),('muted','#5E6568','Muted'),('line','#DFE4E8','Line')]
    swatches='<div class="colour-grid">'+''.join(f'<div class="colour-card"><div class="colour-chip" style="background:{v}"></div><strong>{n}</strong><code>--efi-{k}</code><code>{v}</code><small>RGB {", ".join(str(int(v[i:i+2],16)) for i in (1,3,5))}</small></div>' for k,v,n in colours)+'</div>'
    fonts='<div class="type-specimen"><div class="type-title">Montserrat · EFI</div><div class="type-h2">'+('Heldere informatie, herkenbare stijl' if nl else 'Clear information, recognisable style')+'</div><p class="type-body">HLA-A*01:01 · HLA-DQA1*05:01~HLA-DQB1*02:01<br>0123456789 · Aa Bb Cc Dd Ee Ff Gg</p><div class="weight-row">'+''.join(f'<span style="font-weight:{w}">{w} · Montserrat</span>' for w in (300,400,500,600,700))+'</div></div>'
    buttons='<div class="button-specimen"><div class="button-row"><button class="button-demo primary">'+('Primair' if nl else 'Primary')+'</button><button class="button-demo secondary">'+('Secundair' if nl else 'Secondary')+'</button><button class="button-demo light">'+('Licht' if nl else 'Light')+'</button><button class="button-demo" disabled>'+('Uitgeschakeld' if nl else 'Disabled')+'</button></div><p class="token-note">'+('Beweeg over de knoppen en gebruik Tab voor focus.' if nl else 'Hover over buttons and use Tab to inspect focus.')+'</p></div>'
    logos='<div class="logo-examples"><figure><img src="assets/logo-color.svg" alt="EFI"><figcaption>'+('Gekleurd origineel op wit' if nl else 'Coloured original on white')+'</figcaption></figure><figure><img src="assets/logo-white.svg" alt="EFI"><figcaption>'+('Wit origineel op EFI-blauw' if nl else 'White original on EFI blue')+'</figcaption></figure></div>'
    ept='<div class="ept-specimen"><div class="ept-control-grid"><strong>Technique</strong><div class="button-row" data-demo-group="single">'+''.join(f'<button class="button-demo" aria-pressed="{str(i==0).lower()}">{v}</button>' for i,v in enumerate(['SAB','C1q','C3d']))+'</div><strong>Locus</strong><div class="button-row" data-demo-group="multiple">'+''.join(f'<button class="button-demo locus" aria-pressed="{str(i<2).lower()}">{v}</button>' for i,v in enumerate(['A','B','C','DRB1','DRB3-4-5','DQ','DP']))+'</div></div><p class="token-note">'+('Klik om enkelvoudige techniekkeuze en meervoudige locuskeuze te testen.' if nl else 'Click to test single technique selection and multiple locus selection.')+'</p></div>'
    for key,value in [('COLOUR',swatches),('FONT',fonts),('BUTTON',buttons),('LOGO',logos),('EPT',ept)]:content=content.replace(f'<!--{key}_SPECIMEN-->',value)
    return content

def render(stem, lang, content):
    other = 'EN' if lang == 'NL' else 'NL'
    nl = lang == 'NL'
    title = content.splitlines()[0].removeprefix('# ')
    body = markdown.markdown(specimens('\n'.join(content.splitlines()[1:]),lang), extensions=['tables','fenced_code','toc'])
    body = re.sub(r'(<table>.*?</table>)',r'<div class="table-scroll">\1</div>',body,flags=re.S)
    toc = ''.join(f'<a href="#{m[0]}">{m[1]}</a>' for m in re.findall(r'<h2 id="([^"]+)">(.*?)</h2>',body))
    page = f'''<!doctype html><html lang="{lang.lower()}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="strict-origin-when-cross-origin"><title>{html.escape(title)}</title><link rel="icon" href="assets/logo-color.svg"><link rel="stylesheet" href="assets/efi.css"></head><body><header class="top"><img src="assets/logo-color.svg" alt="EFI"><a class="brand" href="index_{lang}.html">EPT Insights</a><div class="header-actions"><a href="concept_{lang}.html">{'Concept' if nl else 'Concept'}</a><a href="style_{lang}.html">{'Stijlgids' if nl else 'Style guide'}</a><a class="language-switch" href="{stem}_{other}.html" lang="{other.lower()}" hreflang="{other.lower()}">{other}</a><button class="print" onclick="window.print()">{'Afdrukken' if nl else 'Print'}</button></div></header><div class="hero"><div class="eyebrow">EFI · EPT · {'Onderzoeksprototype' if nl else 'Research prototype'}</div><h1>{html.escape(title)}</h1><p>{'Publieke ontwerpdocumentatie · in ontwikkeling' if nl else 'Public design documentation · work in progress'}</p><img class="hero-logo" src="assets/logo-white.svg" alt="EFI"></div><div class="layout"><aside><strong>{'INHOUD' if nl else 'CONTENTS'}</strong>{toc}<a href="{stem}_{lang}.md">Markdown</a></aside><main>{body}</main></div><footer>{'Projectdocumentatie · geen officiële EFI-dienst' if nl else 'Project documentation · not an official EFI service'}</footer></body></html>'''
    page=page.replace('</head>','<link rel="stylesheet" href="assets/tokens.css"><link rel="stylesheet" href="assets/specimen.css"><script src="assets/style-demo.js" defer></script></head>')
    page=page.replace(f'<a href="style_{lang}.html">',f'<a href="efi-style_{lang}.html">EFI</a><a href="style_{lang}.html">')
    (OUT / f'{stem}_{lang}.html').write_text(page,encoding='utf-8')
    (OUT / f'{stem}_{lang}.md').write_text(content,encoding='utf-8')
    return page

for lang in ('NL','EN'):
    for stem in ('concept','style','efi-style'):
        render(stem,lang,(ROOT / f'public_content/{stem}_{lang}.md').read_text(encoding='utf-8'))
    text = ('# EFI EPT Insights\n\n## Concept en ontwikkeling\n\nEen onderzoeksprototype voor HLA single antigen bead-analyse binnen EPT. De documentatie beschrijft de structuur, beoogde invoer en uitvoer en EFI-opmaak. De applicatie wordt eerst lokaal gebouwd en getest; deze site bevat nu de publieke documentatie.\n\n- [Lees het platformconcept](concept_NL.html)\n- [Algemene EFI-basisstijl met kleur- en fontvoorbeelden](efi-style_NL.html)\n- [EPT-stijlgids met interactieve filters](style_NL.html)\n- [Repository](https://github.com/espierin/ept)\n\n## Status\n\nDocumentatie gepubliceerd op 15 oktober 2026. De ontwerpbeelden bevatten uitsluitend synthetische resultaten. Er worden via deze website geen deelnemersbestanden ontvangen. Interne communicatie en oorspronkelijke inzendingen staan niet in deze publicatie.\n' if lang=='NL' else '# EFI EPT Insights\n\n## Concept and development\n\nA research prototype for HLA single antigen bead analysis within EPT. The documentation describes structure, intended inputs and outputs, and EFI styling. The application is being built and tested locally first; this site currently contains public documentation.\n\n- [Read the platform concept](concept_EN.html)\n- [General EFI foundation with colour and font examples](efi-style_EN.html)\n- [EPT style guide with interactive filters](style_EN.html)\n- [Repository](https://github.com/espierin/ept)\n\n## Status\n\nDocumentation published on 15 October 2026. Design images contain synthetic results only. This website does not receive participant files. Internal communication and original submissions are not part of this publication.\n')
    page=render('index',lang,text)
    if lang=='NL': (OUT / 'index.html').write_text(page,encoding='utf-8')
(OUT / '.nojekyll').touch()

errors=[]
for p in OUT.rglob('*'):
    if not p.is_file(): continue
    if p.suffix.lower()=='.pdf': errors.append(f'Forbidden PDF: {p.name}')
    if p.suffix in ('.html','.md','.css','.svg','.json'):
        text=p.read_text(encoding='utf-8')
        for forbidden in ('Patient Name','19s05189','mailto:'):
            if forbidden in text: errors.append(f'Private/source content marker in {p.name}: {forbidden}')
        if p.suffix=='.html':
            for ref in re.findall(r'(?:href|src)="([^"]+)"',text):
                u=urlsplit(html.unescape(ref))
                if not u.scheme and u.path and not (p.parent/unquote(u.path)).exists(): errors.append(f'Missing asset {ref}')
assert not errors, errors
manifest={str(p.relative_to(OUT)).replace('\\','/'): hashlib.sha256(p.read_bytes()).hexdigest() for p in OUT.rglob('*') if p.is_file() and p.name!='publication-manifest.json'}
(OUT/'publication-manifest.json').write_text(json.dumps({'scope':'Explicit public documentation only','files':manifest},indent=2),encoding='utf-8')
print(f'Public build: {len(manifest)} allowlisted files; no private PDF or correspondence markers; links valid.')
