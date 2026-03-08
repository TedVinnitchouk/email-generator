const HARMONIC_KEY = process.env.HARMONIC_API_KEY || 'LgSHxuFYlgkVZ43F8xY533qX608TOipB';
const BASE = 'https://api.harmonic.ai';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { path, ...queryParams } = req.query;
  if (!path) { res.status(400).json({ error: 'Missing path parameter' }); return; }

  // Forward all extra query params (except 'path') to Harmonic
  const qs = new URLSearchParams(queryParams).toString();
  const url = `${BASE}${path}${qs ? '?' + qs : ''}`;

  try {
    const fetchOpts = {
      method: req.method,
      headers: { 'apikey': HARMONIC_KEY, 'Content-Type': 'application/json' },
    };
    if (req.method === 'POST' && req.body) {
      fetchOpts.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const upstream = await fetch(url, fetchOpts);
    const text = await upstream.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
    res.status(upstream.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
