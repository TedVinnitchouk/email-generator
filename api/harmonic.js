const HARMONIC_KEY = process.env.HARMONIC_API_KEY || 'LgSHxuFYlgkVZ43F8xY533qX608TOipB';
const BASE = 'https://api.harmonic.ai';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { path, ...rest } = req.query;
  if (!path) return res.status(400).json({ error: 'Missing path' });

  const qs = new URLSearchParams(rest).toString();
  const url = `${BASE}${path}${qs ? '?' + qs : ''}`;

  const opts = {
    method: req.method,
    headers: { 'apikey': HARMONIC_KEY, 'Content-Type': 'application/json' },
  };
  if (req.method === 'POST' && req.body) {
    opts.body = JSON.stringify(req.body);
  }

  const upstream = await fetch(url, opts);
  const text = await upstream.text();
  try { res.status(upstream.status).json(JSON.parse(text)); }
  catch { res.status(upstream.status).send(text); }
}
