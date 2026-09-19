const MAPPING = {
  'blinky_basic.webp': {
    alt: 'Blinky base',
    gg: ['T_Icon_BR_Creature_Sprite_GhostDamage_L', 'T_Icon_BR_Creature_Sprite_GhostDamage_Reaper_L', 'T_Icon_BR_Creature_Sprite_GhostDamage_Default_L']
  },
  'blinky_gold.webp': {
    alt: 'Blinky gold',
    gg: ['T_Icon_BR_Creature_Sprite_GhostDamage_Gold_L']
  },
  'blinky_cheatmaster.webp': {
    alt: 'Blinky cheatmaster',
    gg: ['T_Icon_BR_Creature_Sprite_GhostDamage_CheatMaster_L', 'T_Icon_BR_Creature_Sprite_GhostDamage_Cheatmaster_L']
  },
  'blinky_loothacker.webp': {
    alt: 'Blinky loothacker',
    gg: ['T_Icon_BR_Creature_Sprite_GhostDamage_LootHacker_L', 'T_Icon_BR_Creature_Sprite_GhostDamage_Loothacker_L']
  },
  'crashbandicoot_basic.webp': {
    alt: 'Crash Bandicoot base',
    gg: ['T_Icon_BR_Creature_Sprite_BodySlam_L', 'T_Icon_BR_Creature_Sprite_BodySlam_Reaper_L', 'T_Icon_BR_Creature_Sprite_BodySlam_Default_L']
  },
  'crashbandicoot_gold.webp': {
    alt: 'Crash Bandicoot gold',
    gg: ['T_Icon_BR_Creature_Sprite_BodySlam_Gold_L']
  },
  'crashbandicoot_cheatmaster.webp': {
    alt: 'Crash Bandicoot cheatmaster',
    gg: ['T_Icon_BR_Creature_Sprite_BodySlam_CheatMaster_L', 'T_Icon_BR_Creature_Sprite_BodySlam_Cheatmaster_L']
  },
  'crashbandicoot_loothacker.webp': {
    alt: 'Crash Bandicoot loothacker',
    gg: ['T_Icon_BR_Creature_Sprite_BodySlam_LootHacker_L', 'T_Icon_BR_Creature_Sprite_BodySlam_Loothacker_L']
  },
  'pond_basic.webp': {
    alt: 'Pond base',
    gg: ['T_Icon_BR_Creature_Sprite_WinnerA_L', 'T_Icon_BR_Creature_Sprite_WinnerA_Reaper_L', 'T_Icon_BR_Creature_Sprite_Pond_L', 'T_Icon_BR_Creature_Sprite_Pond_Reaper_L']
  },
  'pond_gold.webp': {
    alt: 'Pond gold',
    gg: ['T_Icon_BR_Creature_Sprite_WinnerA_Gold_L', 'T_Icon_BR_Creature_Sprite_Pond_Gold_L']
  },
  'pond_cheatmaster.webp': {
    alt: 'Pond cheatmaster',
    gg: ['T_Icon_BR_Creature_Sprite_WinnerA_CheatMaster_L', 'T_Icon_BR_Creature_Sprite_Pond_CheatMaster_L']
  },
  'pond_loothacker.webp': {
    alt: 'Pond loothacker',
    gg: ['T_Icon_BR_Creature_Sprite_WinnerA_LootHacker_L', 'T_Icon_BR_Creature_Sprite_Pond_LootHacker_L']
  },
  'crown_bountyhunter.webp': {
    alt: 'Crown bountyhunter',
    gg: ['T_Icon_BR_Creature_Sprite_Crown_BountyHunter_L']
  }
};

const GG_ROOT = 'https://fortnite.gg/img/x/sprites/icons/';
const MYSPRITES = 'https://mysprites.me/';

async function proxyImage(url, res) {
  try {
    const r = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SpriteCompanion/1.0)',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'
      }
    });
    const type = r.headers.get('content-type') || '';
    if (!r.ok || !type.toLowerCase().startsWith('image/')) return false;
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

function getAttr(tag, name) {
  const re = new RegExp('\\b' + name + '\\s*=\\s*["\\\']([^"\\\']+)["\\\']', 'i');
  const m = tag.match(re);
  return m ? m[1] : '';
}

async function findMySpritesImage(alt) {
  try {
    const r = await fetch(MYSPRITES, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SpriteCompanion/1.0)',
        'Accept': 'text/html,application/xhtml+xml'
      }
    });
    if (!r.ok) return null;
    const html = await r.text();
    const wanted = alt.trim().toLowerCase();
    const tags = html.match(/<img\b[^>]*>/gi) || [];
    for (const tag of tags) {
      if (getAttr(tag, 'alt').trim().toLowerCase() !== wanted) continue;
      const src = getAttr(tag, 'src') || getAttr(tag, 'data-src') || getAttr(tag, 'data-lazy-src');
      if (src) return new URL(src, MYSPRITES).href;
    }
  } catch (_) {}
  return null;
}

module.exports = async function handler(req, res) {
  const raw = Array.isArray(req.query && req.query.name) ? req.query.name[0] : req.query && req.query.name;
  const name = String(raw || '').toLowerCase();
  const item = MAPPING[name];
  if (!item) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.end('Unknown sprite');
  }

  // Prefer the tracker image because it already follows the current game art.
  const trackerUrl = await findMySpritesImage(item.alt);
  if (trackerUrl && await proxyImage(trackerUrl, res)) return;

  // Fall back to the official game-icon filenames mirrored by Fortnite.GG.
  for (const stem of item.gg) {
    if (await proxyImage(`${GG_ROOT}${encodeURIComponent(stem)}.webp`, res)) return;
  }

  res.statusCode = 404;
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end('Artwork not found');
};
