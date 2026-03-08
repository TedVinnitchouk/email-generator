const HARMONIC_KEY = process.env.HARMONIC_API_KEY || 'LgSHxuFYlgkVZ43F8xY533qX608TOipB';
const BASE = 'https://api.harmonic.ai';

export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,apikey');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { path, ...queryParams } = req.query;
  if (!path) { res.status(400).json({ error: 'Missing path parameter' }); return; }

  const qs = new URLSearchParams(queryParams).toString();
  const url = `${BASE}${path}${qs ? '?' + qs : ''}`;

  try {
    const fetchOpts = {
      method: req.method,
      headers: {
        'apikey': HARMONIC_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    if (req.method === 'POST') {
      fetchOpts.body = JSON.stringify(req.body || {});
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
