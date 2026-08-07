// gotogir-proxy — micro-service Node qui appelle l'API GoToGir/Mapal WAP
// avec une pile TLS tolérante (OpenSSL), là où Supabase/Deno échoue (tls handshake eof).
// Ne détient que le token GoToGir. Renvoie les heures pointées agrégées par unité.
import http from 'node:http';
import https from 'node:https';
import { URL } from 'node:url';

const PORT     = process.env.PORT || 8080;
const BASE     = (process.env.GOTOGIR_BASE || 'https://gotogir.com/WAP').replace(/\/+$/, '');
const TOKEN    = process.env.GOTOGIR_TOKEN || '';
let PREFIX     = process.env.GOTOGIR_AUTH_PREFIX ?? 'Bearer';    // le token est un Bearer token
if (PREFIX && !PREFIX.endsWith(' ')) PREFIX += ' ';             // garantit l'espace : "Bearer <token>"
const INSECURE = process.env.GOTOGIR_INSECURE === '1';           // mettre à 1 si erreur de chaîne de certificat
const ACCESS_KEY = process.env.ACCESS_KEY || '';                 // optionnel : protège l'accès au proxy
const APIVER   = process.env.GOTOGIR_API_VERSION || '1.2';       // certains endpoints n'existent qu'en v1.2

// Agent TLS "à la Postman" : OpenSSL, TLS ancien autorisé, niveau de sécurité abaissé.
const agent = new https.Agent({
  keepAlive: true,
  minVersion: 'TLSv1',
  ciphers: 'DEFAULT@SECLEVEL=1',
  rejectUnauthorized: !INSECURE,
});

function ggGet(path) {
  return new Promise((resolve) => {
    let u;
    try {
      u = new URL(BASE + path + (path.includes('?') ? '&' : '?') + 'api-version=' + APIVER);
    } catch (e) { return resolve({ status: 0, ok: false, error: 'bad url' }); }
    const req = https.request(u, {
      method: 'GET',
      agent,
      headers: { Authorization: PREFIX + TOKEN, Accept: 'application/json', 'api-version': APIVER },
    }, (res) => {
      let body = '';
      res.on('data', (d) => (body += d));
      res.on('end', () => {
        let data = null;
        try { data = body ? JSON.parse(body) : null; } catch { data = body; }
        resolve({ status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 300, data });
      });
    });
    req.on('error', (e) => resolve({ status: 0, ok: false, error: String((e && e.message) || e) }));
    req.setTimeout(30000, () => req.destroy(new Error('timeout')));
    req.end();
  });
}

const num = (v) => (typeof v === 'number' && isFinite(v) ? v : null);
function sumPayable(rows) {
  if (!Array.isArray(rows)) return { hours: null, count: 0 };
  let t = 0, f = false;
  for (const c of rows) {
    const h = num(c && c.payable_time) ?? num(c && c.net_computable_time) ?? num(c && c.computable_time) ?? num(c && c.total_time);
    if (h != null) { t += h; f = true; }
  }
  return { hours: f ? Math.round(t * 100) / 100 : null, count: rows.length };
}
// WorkedAndProjectedDistributionTime : somme du champ "time" (réel passé + projeté futur) par centre
function sumTime(rows) {
  if (!Array.isArray(rows)) return { raw: null, count: 0 };
  let t = 0, f = false;
  for (const c of rows) { const h = num(c && c.time); if (h != null) { t += h; f = true; } }
  return { raw: f ? Math.round(t * 100) / 100 : null, count: rows.length };
}

// Catégorie par salarié (EM = polyvalent de restauration / Encadrement = cadre + agent de maîtrise).
// Récupérée via AllHiredEmployees et mise en cache 1 h.
let EMP_CACHE = { ts: 0, map: null };
async function getEmployeeMap() {
  const now = Date.now();
  if (EMP_CACHE.map && (now - EMP_CACHE.ts) < 3600000) return EMP_CACHE.map;
  const r = await ggGet('/labor/Employee/AllHiredEmployees');
  const map = {};
  if (Array.isArray(r.data)) {
    for (const e of r.data) {
      const txt = ((e.job || '') + ' ' + (e.category_group || '')).toLowerCase();
      map[e.employee_id] = { isEM: /polyvalent/.test(txt), job: e.job, cat: e.category_group };
    }
  }
  EMP_CACHE = { ts: now, map };
  return map;
}
const rnd2 = (x) => Math.round(x * 100) / 100;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-access-key, content-type, apikey',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};
const send = (res, code, obj) => {
  res.writeHead(code, { ...CORS, 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
};
const enc = (s) => encodeURIComponent(s);

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') { res.writeHead(204, CORS); return res.end(); }
  const u = new URL(req.url, 'http://x');
  const p = u.pathname;

  if (p === '/' || p === '/health') {
    return send(res, 200, { ok: true, service: 'gotogir-proxy', hasToken: !!TOKEN });
  }

  if (ACCESS_KEY) {
    const k = u.searchParams.get('key') || req.headers['x-access-key'];
    if (k !== ACCESS_KEY) return send(res, 401, { error: 'unauthorized' });
  }
  if (!TOKEN) return send(res, 500, { error: 'GOTOGIR_TOKEN manquant sur le serveur' });

  // Validation : GET /diag?unit=9&start=2026-06-01&end=2026-06-30
  if (p === '/diag') {
    const unit = u.searchParams.get('unit');
    const start = u.searchParams.get('start');
    const end = u.searchParams.get('end');
    const r = await ggGet(`/labor/Clockings/GetClockingsByBusinessUnit?business_unit_ids=${enc(unit)}&start_date=${enc(start)}&end_date=${enc(end)}`);
    const rows = Array.isArray(r.data) ? r.data : null;
    const f = rows && rows[0] ? rows[0] : null;
    return send(res, 200, {
      status: r.status, ok: r.ok, error: r.error || null,
      count: rows ? rows.length : null,
      fields: f ? Object.keys(f) : null,
      sample: f ? { payable_time: f.payable_time, computable_time: f.computable_time, net_computable_time: f.net_computable_time, total_time: f.total_time, entry: f.entry, exit: f.exit } : (rows ? null : r.data),
    });
  }

  // Heures réelles : GET /reel?units=9,1,17&start=2026-06-01&end=2026-06-30
  if (p === '/reel') {
    const units = (u.searchParams.get('units') || '').split(',').map((s) => s.trim()).filter(Boolean);
    const start = u.searchParams.get('start');
    const end = u.searchParams.get('end');
    if (!units.length || !start || !end) return send(res, 400, { error: 'params requis: units, start, end' });
    const out = {};
    await Promise.all(units.map(async (unit) => {
      const r = await ggGet(`/labor/Clockings/GetClockingsByBusinessUnit?business_unit_ids=${enc(unit)}&start_date=${enc(start)}&end_date=${enc(end)}`);
      out[unit] = r.ok ? sumPayable(r.data) : { hours: null, count: 0, error: r.error || ('status ' + r.status) };
    }));
    return send(res, 200, { reel: out, meta: { start, end } });
  }

  // Diag du nouvel endpoint : GET /diag2?unit=9&from=2026-08-01&to=2026-08-31
  if (p === '/diag2') {
    const unit = u.searchParams.get('unit');
    const from = u.searchParams.get('from');
    const to = u.searchParams.get('to');
    const r = await ggGet(`/labor/Employee/WorkedAndProjectedDistributionTime?date_from=${enc(from)}&date_to=${enc(to)}&id_center=${enc(unit)}`);
    const rows = Array.isArray(r.data) ? r.data : null;
    const f = rows && rows[0] ? rows[0] : null;
    return send(res, 200, {
      status: r.status, ok: r.ok, error: r.error || null,
      count: rows ? rows.length : null,
      fields: f ? Object.keys(f) : null,
      sum_time: rows ? sumTime(rows).raw : null,
      sample: f ? { center: f.center, id_center: f.id_center, time: f.time, total_time: f.total_time } : (rows ? null : r.data),
    });
  }

  // Réel + prévisionnel (planning), avec répartition EM / Encadrement :
  // GET /estim?units=9,1,17&from=2026-08-01&to=2026-08-31
  if (p === '/estim') {
    const units = (u.searchParams.get('units') || '').split(',').map((s) => s.trim()).filter(Boolean);
    const from = u.searchParams.get('from');
    const to = u.searchParams.get('to');
    if (!units.length || !from || !to) return send(res, 400, { error: 'params requis: units, from, to' });
    const empMap = await getEmployeeMap();
    const out = {};
    await Promise.all(units.map(async (unit) => {
      const r = await ggGet(`/labor/Employee/WorkedAndProjectedDistributionTime?date_from=${enc(from)}&date_to=${enc(to)}&id_center=${enc(unit)}`);
      if (!r.ok) { out[unit] = { raw: null, em: null, encad: null, count: 0, error: r.error || ('status ' + r.status) }; return; }
      const rows = Array.isArray(r.data) ? r.data : [];
      let tot = 0, em = 0, encad = 0, unmatched = 0, f = false;
      for (const c of rows) {
        const h = num(c && c.time); if (h == null) continue;
        tot += h; f = true;
        const info = empMap[c && c.id_employee];
        if (info && info.isEM) em += h; else { encad += h; if (!info) unmatched++; }
      }
      out[unit] = { raw: f ? rnd2(tot) : null, em: rnd2(em), encad: rnd2(encad), count: rows.length, unmatched };
    }));
    return send(res, 200, { estim: out, meta: { from, to } });
  }

  // Découverte des centres : GET /centers?from=2026-08-01&to=2026-08-31  (ou &employee=2019)
  // Interroge WorkedAndProjectedDistributionTime sans filtre de centre pour lister les vrais id_center.
  if (p === '/centers') {
    const from = u.searchParams.get('from');
    const to = u.searchParams.get('to');
    const emp = u.searchParams.get('employee');
    const r = await ggGet(`/labor/Employee/WorkedAndProjectedDistributionTime?date_from=${enc(from)}&date_to=${enc(to)}${emp ? '&id_employee=' + enc(emp) : ''}`);
    const rows = Array.isArray(r.data) ? r.data : [];
    const map = {};
    for (const c of rows) {
      const k = c && c.id_center;
      if (k == null) continue;
      if (!map[k]) map[k] = { id_center: c.id_center, center: c.center, internal_code: c.internal_code_center, count: 0, hours: 0 };
      map[k].count++;
      const h = num(c.time); if (h != null) map[k].hours = Math.round((map[k].hours + h) * 100) / 100;
    }
    return send(res, 200, { status: r.status, ok: r.ok, error: r.error || null, total_rows: rows.length, centers: Object.values(map).sort((a, b) => a.id_center - b.id_center) });
  }

  // Diag catégories : GET /employees  → distribution job / category_group (pour valider la règle EM/Encad)
  if (p === '/employees') {
    const map = await getEmployeeMap();
    const ids = Object.keys(map);
    const dist = {};
    for (const id of ids) { const e = map[id]; const k = (e.cat || '') + ' | ' + (e.job || '') + ' | EM=' + e.isEM; dist[k] = (dist[k] || 0) + 1; }
    return send(res, 200, { total: ids.length, distribution: Object.entries(dist).map(([k, v]) => ({ k, v })).sort((a, b) => b.v - a.v) });
  }

  return send(res, 404, { error: 'not found' });
});

server.listen(PORT, () => console.log('gotogir-proxy en écoute sur le port ' + PORT));
