const SOURCES = {
  'blinky_basic.webp': [
    'https://mysprites.me/images/sprites/Blinky.webp'
  ],
  'blinky_gold.webp': [
    'https://mysprites.me/images/sprites/blinky_gold.webp'
  ],
  'blinky_cheatmaster.webp': [
    'https://mysprites.me/images/sprites/blinky_cheatmaster.webp'
  ],
  'blinky_loothacker.webp': [
    'https://mysprites.me/images/sprites/blinky_loothacker.webp'
  ],
  'crashbandicoot_basic.webp': [
    'https://mysprites.me/images/sprites/crash.webp'
  ],
  'crashbandicoot_gold.webp': [
    'https://mysprites.me/images/sprites/crash_gold.webp'
  ],
  'crashbandicoot_cheatmaster.webp': [
    'https://mysprites.me/images/sprites/crash_cheatmaster.webp'
  ],
  'crashbandicoot_loothacker.webp': [
    'https://mysprites.me/images/sprites/crash_loothacker.webp'
  ],
  'pond_basic.webp': [
    'https://mysprites.me/images/sprites/pond.webp'
  ],
  'pond_gold.webp': [
    'https://mysprites.me/images/sprites/pond_gold.webp'
  ],
  'pond_cheatmaster.webp': [
    'https://mysprites.me/images/sprites/pond_cheatmaster.webp'
  ],
  'pond_loothacker.webp': [
    'https://mysprites.me/images/sprites/pond_loothacker.webp'
  ],
  'crown_bountyhunter.webp': [
    'https://mysprites.me/images/sprites/crown_bountyhunter.webp',
    'https://mysprites.me/images/sprites/Crown_bountyhunter.webp',
    'https://mysprites.me/images/sprites/crown_bountyHunter.webp'
  ]
};

async function proxyImage(url, res) {
  try {
    const r = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SpriteCompanion/1.0)',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'Referer': 'https://mysprites.me/backbling'
      }
    });
    const type = (r.headers.get('content-type') || '').toLowerCase();
    if (!r.ok || !type.startsWith('image/')) return false;
    const bytes = Buffer.from(await r.arrayBuffer());
    if (!bytes.length) return false;
    res.statusCode = 200;
    res.setHeader('Content-Type', type);
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(bytes);
    return true;
  } catch (_) {
    return false;
  }
}

module.exports = async function handler(req, res) {
  const raw = Array.isArray(req.query && req.query.name) ? req.query.name[0] : req.query && req.query.name;
  const name = String(raw || '').toLowerCase();
  const sources = SOURCES[name];

  if (!sources) {
    res.statusCode = 404;
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.end('Unknown sprite');
  }

  for (const url of sources) {
    if (await proxyImage(url, res)) return;
  }

  res.statusCode = 404;
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end('Artwork not found');
};
