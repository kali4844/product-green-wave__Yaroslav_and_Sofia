# Системні кейси TC-40..TC-43 у справжньому браузері (Chromium через Playwright).
# Запуск: python3 run-system.py   (pip install playwright; playwright install chromium)
import asyncio, os
from playwright.async_api import async_playwright
URL = 'file://' + os.path.abspath(os.path.join(os.path.dirname(__file__), '../../2-architecture/prototype/green-wave.html'))

def lum(c):
    r, g, b = [x / 255 for x in c]
    f = lambda v: v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
def ratio(a, b):
    la, lb = sorted([lum(a), lum(b)], reverse=True)
    return (la + 0.05) / (lb + 0.05)

async def main():
    out = {}
    async with async_playwright() as p:
        br = await p.chromium.launch()
        # TC-40: ширина 360 px
        pg = await br.new_page(viewport={'width': 360, 'height': 740})
        await pg.goto(URL)
        sw = await pg.evaluate('document.documentElement.scrollWidth')
        out['TC-40'] = (sw <= 360, f'scrollWidth={sw} при ширині 360')
        await pg.close()
        # TC-41: темна тема, контраст
        ctx = await br.new_context(color_scheme='dark', viewport={'width': 1100, 'height': 900})
        pg = await ctx.new_page(); await pg.goto(URL)
        js = '''() => { const p = s => getComputedStyle(document.querySelector(s));
          const rgb = x => x.match(/\\d+/g).slice(0,3).map(Number);
          return { tx: rgb(p('body').color), bg: rgb(p('body').backgroundColor),
                   mut: rgb(p('label').color), card: rgb(p('.card').backgroundColor) } }'''
        c = await pg.evaluate(js)
        r1, r2 = ratio(c['tx'], c['bg']), ratio(c['mut'], c['card'])
        out['TC-41'] = (r1 >= 4.5 and r2 >= 4.5, f'контраст основного тексту {r1:.1f}:1, підписів {r2:.1f}:1 (темна тема)')
        await ctx.close()
        # TC-42: головний сценарій + TC-43: без зовнішніх запитів
        ctx = await br.new_context(viewport={'width': 1100, 'height': 900})
        pg = await ctx.new_page()
        reqs = []
        pg.on('request', lambda r: reqs.append(r.url))
        await pg.goto(URL)
        await pg.click('#auto')
        msg = await pg.inner_text('#msg')
        kp = await pg.inner_text('#kpis')
        has_svg = await pg.evaluate("document.querySelector('#chart svg polyline') !== null")
        out['TC-42'] = ('Зелёная волна есть' in msg and '0\nОстановок' in kp.replace(' на красный', '') or ('Зелёная волна есть' in msg), 'повідомлення: «Зелёная волна есть», графік побудовано' if has_svg else 'графік не побудовано')
        out['TC-42'] = ('Зелёная волна есть' in msg and has_svg, out['TC-42'][1])
        ext = [u for u in reqs if not u.startswith('file://') and not u.startswith('data:')]
        out['TC-43'] = (len(ext) == 0, f'зовнішніх запитів: {len(ext)}')
        await ctx.close(); await br.close()
    for k in sorted(out):
        print(('PASS ' if out[k][0] else 'FAIL ') + k + '  ' + out[k][1])
asyncio.run(main())
