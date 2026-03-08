export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const HARMONIC_KEY = process.env.HARMONIC_API_KEY || 'LgSHxuFYlgkVZ43F8xY533qX608TOipB';
  const { path } = req.query;
  if (!path) return res.status(400).json({ error: 'Missing path' });

  const url = `https://api.harmonic.ai${path}`;
  console.log('Proxying', req.method, url);

  const opts = {
    method: req.method,
    headers: { 'apikey': HARMONIC_KEY, 'Content-Type': 'application/json' },
  };
  if (req.method === 'POST') opts.body = JSON.stringify(req.body);

  const upstream = await fetch(url, opts);
  const text = await upstream.text();
  console.log('Upstream status:', upstream.status, text.slice(0, 200));

  try { res.status(upstream.status).json(JSON.parse(text)); }
  catch { res.status(upstream.status).send(text); }
}
