const HARMONIC_KEY = process.env.HARMONIC_API_KEY || 'LgSHxuFYlgkVZ43F8xY533qX608TOipB';
const BASE = 'https://api.harmonic.ai';

export default async function handler(req, res) {
  // Allow all origins (your HTML file, GitHub Pages, local)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // path comes in as query param: /api/harmonic?path=/companies/search&...
  const { path, ...queryParams } = req.query;
  if (!path) {
    res.status(400).json({ error: 'Missing path parameter' });
    return;
  }

  // Rebuild query string (everything except 'path')
  const qs = new URLSearchParams(queryParams).toString();
  const url = `${BASE}${path}${qs ? '?' + qs : ''}`;

  try {
    const fetchOpts = {
      method: req.method === 'POST' ? 'POST' : 'GET',
      headers: {
        'apikey': HARMONIC_KEY,
        'Content-Type': 'application/json',
      },
    };

    if (req.method === 'POST' && req.body) {
      fetchOpts.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const upstream = await fetch(url, fetchOpts);
    const data = await upstream.json();

    res.status(upstream.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
