// Автоматичний прогін тест-кейсів TC-01..TC-39 (див. ../test-cases.md).
// Запуск: node run-tests.js   (потрібен Node.js 18+, без залежностей)
// Сторінка виконується у vm з імітацією DOM (не у справжньому браузері).
const fs = require('fs'), vm = require('vm'), path = require('path');
const file = path.join(__dirname, '../../2-architecture/prototype/green-wave.html');
const html = fs.readFileSync(file, 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>/)[1];

function load() {
  const vals = {}; let m; const re = /id="(\w+)" type="number" value="([^"]*)"/g;
  while ((m = re.exec(html))) vals[m[1]] = m[2];
  const els = {}, handlers = {};
  const el = id => els[id] || (els[id] = { id, value: vals[id] !== undefined ? vals[id] : '', innerHTML: '',
    addEventListener(t, f) { handlers[id + ':' + t] = f; } });
  const ctx = { document: { getElementById: el }, console, Math, JSON, parseFloat, isFinite };
  vm.createContext(ctx);
  vm.runInContext(script, ctx);
  return { ctx, els, handlers,
    run: c => vm.runInContext(c, ctx),
    set(id, v) { el(id).value = String(v); },
    lights(a) { vm.runInContext('lights=' + JSON.stringify(a), ctx); },
    click(id) { el(id).onclick(); } };
}
const L1 = (d, g, r, o) => [{ d, g, r, o }];
const results = [];
function tc(id, name, fn) {
  let ok = false, info = '';
  try { const r = fn(); ok = r === true; info = ok ? '' : 'очікування не виконано'; }
  catch (e) { info = 'ПОМИЛКА: ' + e.message; }
  results.push({ id, name, ok, info });
}
const near = (a, b, e = 1e-6) => Math.abs(a - b) <= e;
function base(o = {}) {
  const a = load();
  a.set('L', o.L || 1000); a.set('t0', o.t0 || 0); a.set('mg', o.mg ?? 3); a.set('pl', o.pl ?? 10);
  a.set('vmin', o.vmin || 20); a.set('vmax', o.vmax || 60); a.set('v', o.v || 36);
  return a;
}

// --- Модульні: simulate
tc('TC-01', 'simulate: зелений, без зупинок', () => { const a = base(); a.lights(L1(500, 30, 30, 0)); const r = a.run('sim(72)');
  return r.stops === 0 && near(r.total, 50) && near(r.avg, 72) && near(r.rows[0].arr, 25) && near(r.minMg, 5); });
tc('TC-02', 'simulate: червоний, очікування', () => { const a = base(); a.lights(L1(500, 30, 30, 0)); const r = a.run('sim(36)');
  return r.stops === 1 && near(r.waitSum, 10) && near(r.total, 110) && near(r.avg, 1000 / 110 * 3.6); });
tc('TC-03', 'simulate: прибуття в момент кінця зеленого (межа)', () => { const a = base(); a.lights(L1(300, 30, 30, 0)); const r = a.run('sim(36)');
  return r.stops === 1 && near(r.waitSum, 30); });
tc('TC-04', 'simulate: прибуття в момент початку зеленого (межа)', () => { const a = base(); a.lights(L1(600, 30, 30, 0)); a.set('L', 1200); const r = a.run('sim(36)');
  return r.stops === 0 && near(r.minMg, 0); });
tc('TC-05', 'simulate: зсув фази', () => { const a = base(); a.lights(L1(500, 30, 30, 40)); const r = a.run('sim(36)');
  return r.stops === 0 && near(r.minMg, 10); });
tc('TC-06', 'simulate: фаза більша за час прибуття (від\'ємна різниця)', () => { const a = base(); a.lights(L1(500, 30, 30, 70)); const r = a.run('sim(36)');
  return r.stops === 1 && near(r.waitSum, 20); });
tc('TC-07', 'simulate: момент старту t0', () => { const a = base({ t0: 20 }); a.lights(L1(500, 30, 30, 0)); const r = a.run('sim(36)');
  return r.stops === 0 && near(r.rows[0].arr, 70) && near(r.total, 100); });
tc('TC-08', 'simulate: очікування накопичується на двох світлофорах', () => { const a = base({ L: 900 }); a.lights([{ d: 300, g: 30, r: 30, o: 0 }, { d: 600, g: 30, r: 30, o: 0 }]);
  const r = a.run('sim(36)'); return r.stops === 2 && near(r.waitSum, 60) && near(r.total, 150) && near(r.avg, 21.6); });
tc('TC-09', 'simulate: світлофор за межами маршруту ігнорується', () => { const a = base(); a.lights(L1(2000, 30, 30, 0)); const r = a.run('sim(36)');
  return r.rows.length === 0 && near(r.total, 100); });
tc('TC-10', 'simulate: порожній список світлофорів', () => { const a = base(); a.lights([]); const r = a.run('sim(36)'); return r.stops === 0 && near(r.total, 100); });
tc('TC-11', 'simulate: світлофори введені не за порядком', () => { const a = base({ L: 900 }); a.lights([{ d: 600, g: 30, r: 30, o: 0 }, { d: 300, g: 30, r: 30, o: 0 }]);
  const r = a.run('sim(36)'); return near(r.rows[0].arr, 30) && r.stops === 2; });
tc('TC-12', 'simulate: швидкість 0 замінюється на 0,1 км/год', () => { const a = base(); a.lights([]); const r = a.run('sim(0)'); return near(r.total, 36000, 1e-3); });

// --- Модульні: scanSpeeds / groupRanges
tc('TC-13', 'scanSpeeds: найвища швидкість без зупинок', () => { const a = base({ vmin: 20, vmax: 72 }); a.lights(L1(500, 30, 30, 0)); const r = a.run('scan()');
  return near(r.opt.v, 72) && r.reserve === true && r.opt.r.stops === 0; });
tc('TC-14', 'scanSpeeds: запас 3 с обмежує швидкість (28,5)', () => { const a = base({ vmin: 20, vmax: 55 }); a.lights(L1(500, 30, 30, 0)); const r = a.run('scan()');
  return near(r.opt.v, 28.5) && r.reserve === true; });
tc('TC-15', 'scanSpeeds: немає швидкості без зупинок', () => { const a = base({ vmin: 36, vmax: 36 }); a.lights(L1(300, 30, 30, 0)); const r = a.run('scan()');
  return r.ok.length === 0 && near(r.opt.v, 36) && r.opt.r.stops === 1; });
tc('TC-16', 'scanSpeeds: запас 30 с недосяжний, береться найвища без зупинок', () => { const a = base({ vmin: 20, vmax: 72, mg: 30 }); a.lights(L1(500, 30, 30, 0)); const r = a.run('scan()');
  return near(r.opt.v, 72) && r.reserve === false && r.opt.r.stops === 0; });
tc('TC-17', 'groupRanges: групування сусідніх швидкостей', () => { const a = base(); const r = a.run('ranges([30,29.9,29.8,20.3,20.2])');
  return r.length === 2 && near(r[0][0], 20.2) && near(r[0][1], 20.3) && near(r[1][0], 29.8) && near(r[1][1], 30); });

// --- Модульні: recommendTiming
tc('TC-18', 'recommendTiming: типовий випадок', () => { const a = base(); const x = a.run('recFor({d:500,g:30,r:30,o:0},36)');
  return near(x.g, 16) && near(x.r, 44) && near(x.o, 47) && near(x.arr, 50); });
tc('TC-19', 'recommendTiming: короткий цикл — зелений обмежується C−3', () => { const a = base(); const x = a.run('recFor({d:500,g:10,r:5,o:0},36)');
  return near(x.g, 12) && near(x.r, 3); });
tc('TC-20', 'recommendTiming: нульові колона й запас — мінімум 1 с', () => { const a = base({ mg: 0, pl: 0 }); const x = a.run('recFor({d:500,g:30,r:30,o:0},36)');
  return near(x.g, 1) && near(x.r, 59); });

// --- Модульні: validate
const errs = a => a.run('validate()');
tc('TC-21', 'validate: типові дані коректні', () => { const a = load(); return errs(a).length === 0; });
tc('TC-22', 'validate: довжина маршруту 0', () => { const a = load(); a.set('L', 0); return errs(a).some(s => s.includes('Длина маршрута')); });
tc('TC-23', 'validate: швидкість 0,9 (нижче межі)', () => { const a = load(); a.set('v', 0.9); return errs(a).some(s => s.includes('Скорость автомобиля')); });
tc('TC-24', 'validate: швидкість 200 (верхня межа допустима)', () => { const a = load(); a.set('v', 200); a.set('vmax', 200); return errs(a).length === 0; });
tc('TC-25', 'validate: швидкість 200,1 (вище межі)', () => { const a = load(); a.set('v', 200.1); return errs(a).some(s => s.includes('Скорость автомобиля')); });
tc('TC-26', 'validate: максимум менший за мінімум', () => { const a = load(); a.set('vmin', 50); a.set('vmax', 40); return errs(a).some(s => s.includes('Максимальная')); });
tc('TC-27', 'validate: від\'ємний момент старту', () => { const a = load(); a.set('t0', -1); return errs(a).some(s => s.includes('Момент старта')); });
tc('TC-28', 'validate: запас 30,1 с', () => { const a = load(); a.set('mg', 30.1); return errs(a).some(s => s.includes('Запас')); });
tc('TC-29', 'validate: зелений 0 с', () => { const a = load(); a.lights(L1(300, 0, 30, 0)); return errs(a).some(s => s.includes('Светофор 1') && s.includes('зелёный')); });
tc('TC-30', 'validate: порожній список світлофорів', () => { const a = load(); a.lights([]); return errs(a).some(s => s.includes('хотя бы один')); });
tc('TC-31', 'validate: порожнє поле швидкості = 0 → помилка', () => { const a = load(); a.set('v', ''); return errs(a).some(s => s.includes('Скорость автомобиля')); });

// --- Інтеграційні
tc('TC-32', 'retime: після налаштування зелена хвиля без зупинок із запасом ≥ 2,9 с', () => { const a = load(); a.set('v', 50); a.click('opt');
  const r = a.run('sim(50)'); return r.stops === 0 && r.minMg >= 2.9; });
tc('TC-33', 'кнопка «Рассчитать всё»: v = vmax і зелена хвиля', () => { const a = load(); a.click('auto');
  const r = a.run('sim(num("v"))'); return near(parseFloat(a.els.v.value), 60) && r.stops === 0; });
tc('TC-34', 'кнопка «Оптимальная скорость» записує швидкість зі scan()', () => { const a = load(); const exp = a.run('scan().opt.v'); a.click('find');
  return near(parseFloat(a.els.v.value), Math.round(exp * 10) / 10); });
tc('TC-35', 'кнопка «Добавить светофор» додає рядок', () => { const a = load(); a.click('add');
  return a.run('lights.length') === 5 && (a.els.tb.innerHTML.match(/<tr>/g) || []).length === 5; });
tc('TC-36', 'видалення світлофора', () => { const a = load(); a.handlers['tb:click']({ target: { dataset: { del: '0' } } }); return a.run('lights.length') === 3; });
tc('TC-37', 'редагування клітинки таблиці оновлює модель і результат', () => { const a = load();
  a.handlers['tb:input']({ target: { dataset: { i: '0', k: 'd' }, value: '250' } }); return a.run('lights[0].d') === 250 && a.els.kpis.innerHTML !== ''; });
tc('TC-38', 'некоректні дані блокують результат і графік', () => { const a = load(); a.set('v', 0); a.run('render()');
  return a.els.msg.innerHTML.includes('Проверьте данные') && a.els.kpis.innerHTML === '' && a.els.chart.innerHTML === ''; });
tc('TC-39', 'графік містить SVG і траєкторію автомобіля', () => { const a = load(); a.run('render()');
  return a.els.chart.innerHTML.includes('<svg') && a.els.chart.innerHTML.includes('<polyline'); });

// --- Додаткові спостереження (дефекти і метрики, не тест-кейси)
const extra = {};
{ const a = load(); a.lights([{ d: 600, g: 30, r: 30, o: 0 }, { d: 300, g: 30, r: 30, o: 0 }]); a.set('L', 900); a.run('render()');
  extra.bug003_numberingMatchesInputOrder = /<td>1 \(600 м\)/.test(a.els.res.innerHTML); }
{ const a = load(); a.set('mg', 3); a.set('pl', 10); const x = a.run('recFor({d:500,g:10,r:5,o:0},36)');
  extra.bug002_greenShorterThanNeeded = x.g < 10 + 2 * 3; }
{ const a = load(); const rows = [];
  for (let i = 1; i <= 20; i++) rows.push({ d: i * 150, g: 30, r: 30, o: (i * 7) % 60 });
  a.lights(rows); a.set('L', 3200); a.set('vmin', 1); a.set('vmax', 200);
  let t = process.hrtime.bigint(); a.run('scan()'); extra.scanMs_20lights_1_200kmh = Math.round(Number(process.hrtime.bigint() - t) / 1e5) / 10;
  t = process.hrtime.bigint(); a.run('render()'); extra.renderMs_20lights = Math.round(Number(process.hrtime.bigint() - t) / 1e5) / 10; }
extra.fileBytes = Buffer.byteLength(html);
extra.externalRefs = (html.match(/https?:\/\//g) || []).length;

const pass = results.filter(r => r.ok).length;
for (const r of results) console.log((r.ok ? 'PASS ' : 'FAIL ') + r.id + '  ' + r.name + (r.info ? '  [' + r.info + ']' : ''));
console.log(`\nУсього: ${results.length}, пройдено: ${pass}, не пройдено: ${results.length - pass}`);
console.log('Додатково:', JSON.stringify(extra));
process.exit(pass === results.length ? 0 : 1);
