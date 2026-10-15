"""Local development docs only; deliberately outside the Pages directory."""
from pathlib import Path
import html,re
import markdown
ROOT=Path(__file__).resolve().parent
for lang,other in [('NL','EN'),('EN','NL')]:
    p=ROOT/f'app/DEVELOPMENT_{lang}.md'
    text=p.read_text(encoding='utf-8');title=text.splitlines()[0].removeprefix('# ')
    body=markdown.markdown('\n'.join(text.splitlines()[1:]),extensions=['tables','fenced_code','toc'])
    toc=''.join(f'<a href="#{a}">{b}</a>' for a,b in re.findall(r'<h2 id="([^"]+)">(.*?)</h2>',body))
    result=f'''<!doctype html><html lang="{lang.lower()}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{html.escape(title)}</title><link rel="stylesheet" href="../docs/assets/efi.css"><link rel="stylesheet" href="../docs/assets/specimen.css"><script src="../docs/assets/style-demo.js" defer></script></head><body><header class="top"><img src="../docs/assets/logo-color.svg" alt="EFI"><a href="index.html">EPT Insights</a><div class="header-actions"><a href="DEVELOPMENT_{other}.html" class="language-switch">{other}</a></div></header><div class="hero"><h1>{html.escape(title)}</h1><img class="hero-logo" src="../docs/assets/logo-white.svg" alt="EFI"></div><div class="layout"><aside>{toc}<a href="DEVELOPMENT_{lang}.md">Markdown</a></aside><main>{body}</main></div></body></html>'''
    p.with_suffix('.html').write_text(result,encoding='utf-8')
print('Built local NL/EN Markdown + HTML development documents.')
