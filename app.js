(() => {
  'use strict';

  const SUPABASE_URL = 'https://kezblgjowhyonxylbnku.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlemJsZ2pvd2h5b254eWxibmt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0MjczODQsImV4cCI6MjEwNTAwMzM4NH0.KKNf7bTi5Jjs-gWmzxNcJD2fgJSSD_pVP_qVRDzyKek';
  const ASSET_HOST = 'https://sprite-companion-joel-sonia-namw04moj.vercel.app';
  const FALLBACK_HOST = 'https://sprite-vault-pro.lovable.app';
  const NEW_ART_FILES = new Set([
    'crown_bountyhunter.webp',
    'blinky_basic.webp', 'blinky_gold.webp', 'blinky_cheatmaster.webp', 'blinky_loothacker.webp',
    'crashbandicoot_basic.webp', 'crashbandicoot_gold.webp', 'crashbandicoot_cheatmaster.webp', 'crashbandicoot_loothacker.webp',
    'pond_basic.webp', 'pond_gold.webp', 'pond_cheatmaster.webp', 'pond_loothacker.webp'
  ]);

  const players = [
    { id: 'joel', initial: 'J', name: 'Joel' },
    { id: 'sonia', initial: 'S', name: 'Sonia' },
    { id: 'bea', initial: 'B', name: 'Bea' },
  ];

  const labels = {
    base: 'Base', gold: 'Gold', cheatmaster: 'Cheat Master', loothacker: 'Loot Hacker', bountyhunter: 'Bounty Hunter'
  };
  const suffix = { base: 'basic', gold: 'gold', cheatmaster: 'cheatmaster', loothacker: 'loothacker', bountyhunter: 'bountyhunter' };
  const fam = (slug, family, base = family) => ({ slug, family, entries: [
    ['base', base], ['gold', `Gold ${base}`], ['cheatmaster', `Cheat Master ${base}`], ['loothacker', `Loot Hacker ${base}`]
  ]});

  const families = [
    fam('jonesy','Jonesy'), fam('adventure','Adventure'),
    { slug:'bush', family:'Bush', entries:[['base','Bush'],['gold','Gold Bush'],['cheatmaster','Cheat Master Bush'],['loothacker','Loot Hacker Bushranger']] },
    fam('sonic','Sonic'), fam('tails','Tails'), fam('shadow','Shadow'), fam('eightbit','8-Bit'), fam('jackrabbit','Jackrabbit'),
    { slug:'crown', family:'Crown', entries:[['base','Crown'],['gold','Gold Crown'],['cheatmaster','Cheat Master Crown'],['loothacker','Loot Hacker Crown'],['bountyhunter','Bounty Hunter Crown']] },
    fam('killswitch','Killswitch'), fam('klombo','Klombo'),
    { slug:'megaman', family:'Mega Man', entries:[['base','Mega Man']] },
    fam('overshield','Overshield'),
    { slug:'xray', family:'X-Ray', entries:[['base','X-Ray'],['gold','Gold X-Ray'],['cheatmaster','Cheatmaster X-Ray'],['loothacker','Loot Hacker X-Ray']] },
    { slug:'onigiri', family:'Onigiri', entries:[['base','Onigiri'],['gold','Gold Onigiri'],['cheatmaster','Cheatmaster Onigiri'],['loothacker','Loot Hacker Onigiri']] },
    fam('stormscout','Storm Scout'), fam('blinky','Blinky'), fam('crashbandicoot','Crash Bandicoot'), fam('pond','Pond')
  ];

  const sprites = families.flatMap(({slug,family,entries}) => entries.map(([variant,name]) => ({
    id:`${slug}_${variant}`, slug, family, variant, name, file:`${slug}_${suffix[variant]}.webp`
  })));

  const state = { progress:new Map(), search:'', variant:'all', filter:'all', saving:new Set() };
  const $ = s => document.querySelector(s);
  const grid = $('#spriteGrid');
  const status = $('#syncStatus');

  const key = (p,s) => `${p}:${s}`;
  const level = (p,s) => state.progress.get(key(p,s)) ?? 0;
  const headers = json => ({
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    ...(json ? {'Content-Type':'application/json', Prefer:'return=minimal'} : {})
  });

  function setStatus(text, cls='') {
    status.textContent = text;
    status.className = `sync ${cls}`;
  }

  function mapsDiffer(a, b) {
    if (a.size !== b.size) return true;
    for (const [k,v] of b) if ((a.get(k) ?? 0) !== v) return true;
    return false;
  }

  async function loadProgress(quiet=false) {
    if (!quiet) setStatus('Sincronizando progreso…');
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/sprite_progress?select=player_id,sprite_id,level`, { headers:headers(false), cache:'no-store' });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const rows = await r.json();
      const nextProgress = new Map();
      for (const row of rows) nextProgress.set(key(row.player_id,row.sprite_id), Number(row.level)||0);
      const changed = mapsDiffer(state.progress, nextProgress);
      state.progress = nextProgress;
      if (changed) refreshProgressUI();
      if (!quiet) setStatus('Progreso sincronizado','ok');
    } catch (e) {
      console.error(e);
      if (!quiet) setStatus('No se ha podido sincronizar. Se reintentará automáticamente.','error');
    }
  }

  function applyButtonState(b, player, sprite, n) {
    b.className = `player-mark s${n}`;
    b.title = `${player.name} · ${['Falta','Obtenido','Maestría'][n]}`;
    b.setAttribute('aria-label', b.title);
    const symbol = n === 0 ? '×' : n === 1 ? '✓' : '';
    b.innerHTML = `${n===2?'<span class="crown" aria-hidden="true">👑</span>':''}<span class="initial">${player.initial}</span>${symbol?`<span class="symbol">${symbol}</span>`:''}`;
  }

  async function cycle(playerId, spriteId, button, player, sprite) {
    const k = key(playerId,spriteId);
    if (state.saving.has(k)) return;
    const before = level(playerId,spriteId);
    const next = (before + 1) % 3;
    state.progress.set(k,next);
    state.saving.add(k);
    applyButtonState(button, player, sprite, next);
    updateStats();
    if (state.filter !== 'all') render();
    setStatus('Guardando cambio…');
    try {
      const url = `${SUPABASE_URL}/rest/v1/sprite_progress?player_id=eq.${encodeURIComponent(playerId)}&sprite_id=eq.${encodeURIComponent(spriteId)}`;
      const r = await fetch(url,{ method:'PATCH', headers:headers(true), body:JSON.stringify({level:next}) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setStatus('Cambio guardado','ok');
    } catch (e) {
      console.error(e);
      state.progress.set(k,before);
      if (button.isConnected) applyButtonState(button, player, sprite, before);
      updateStats();
      if (state.filter !== 'all') render();
      setStatus('No se ha podido guardar el cambio.','error');
    } finally { state.saving.delete(k); }
  }

  function buttonFor(player,sprite,n) {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.player = player.id;
    b.dataset.sprite = sprite.id;
    applyButtonState(b, player, sprite, n);
    b.addEventListener('click', () => cycle(player.id,sprite.id,b,player,sprite));
    return b;
  }

  function card(sprite) {
    const el = document.createElement('article');
    el.className = `card variant-${sprite.variant}`;
    el.dataset.sprite = sprite.id;
    const art = document.createElement('div'); art.className='sprite-art';
    const img = document.createElement('img');
    img.loading='lazy'; img.alt=sprite.name;
    img.src = NEW_ART_FILES.has(sprite.file)
      ? `/api/new-sprite?name=${encodeURIComponent(sprite.file)}`
      : `${ASSET_HOST}/api/sprite?name=${encodeURIComponent(sprite.file)}`;
    img.onerror = () => {
      if (!img.dataset.fallback) {
        img.dataset.fallback='1';
        img.src=`${FALLBACK_HOST}/sprites/${encodeURIComponent(sprite.file)}`;
      } else {
        img.style.display='none';
      }
    };
    const pill = document.createElement('span'); pill.className='variant-pill'; pill.textContent=labels[sprite.variant];
    art.append(img,pill);
    const body = document.createElement('div'); body.className='card-body';
    const title = document.createElement('h2'); title.className='card-title'; title.textContent=sprite.name;
    const family = document.createElement('p'); family.className='family'; family.textContent=sprite.family;
    const row = document.createElement('div'); row.className='player-row';
    players.forEach(p => row.append(buttonFor(p,sprite,level(p.id,sprite.id))));
    body.append(title,family,row); el.append(art,body); return el;
  }

  function visibleSprites() {
    const q = state.search.trim().toLowerCase();
    return sprites.filter(s => {
      if (state.variant !== 'all' && s.variant !== state.variant) return false;
      if (q && !`${s.name} ${s.family} ${labels[s.variant]}`.toLowerCase().includes(q)) return false;
      if (state.filter !== 'all') {
        const playerId = state.filter.replace('missing-','');
        if (level(playerId,s.id) !== 0) return false;
      }
      return true;
    });
  }

  function updateStats() {
    for (const p of players) {
      let owned = 0;
      let mastery = 0;
      for (const s of sprites) {
        const n = level(p.id,s.id);
        if (n > 0) owned++;
        if (n === 2) mastery++;
      }
      $(`#${p.id}Owned`).textContent = `${owned}/${sprites.length}`;
      $(`#${p.id}Mastery`).textContent = mastery;
    }
  }

  function refreshProgressUI() {
    if (state.filter !== 'all') {
      render();
      return;
    }
    document.querySelectorAll('.player-mark[data-player][data-sprite]').forEach(b => {
      const player = players.find(p => p.id === b.dataset.player);
      const sprite = sprites.find(s => s.id === b.dataset.sprite);
      if (player && sprite) applyButtonState(b, player, sprite, level(player.id, sprite.id));
    });
    updateStats();
  }

  function render() {
    const list=visibleSprites();
    grid.textContent='';
    if (!list.length) {
      const e=document.createElement('div');
      e.className='empty';
      e.textContent='No hay espíritus que coincidan con los filtros.';
      grid.append(e);
    } else {
      list.forEach(s => grid.append(card(s)));
    }
    updateStats();
  }

  function buildFilters() {
    const vf=$('#variantFilters');
    [['all','Todas'],['base','Base'],['gold','Gold'],['cheatmaster','Cheat Master'],['loothacker','Loot Hacker'],['bountyhunter','Bounty Hunter']].forEach(([v,t])=>{
      const b=document.createElement('button');
      b.textContent=t;
      b.className=v==='all'?'active':'';
      b.onclick=()=>{state.variant=v; [...vf.children].forEach(x=>x.classList.toggle('active',x===b)); render();};
      vf.append(b);
    });
    const sf=$('#stateFilters');
    players.forEach(p=>{
      const v=`missing-${p.id}`;
      const b=document.createElement('button');
      b.textContent=p.name;
      b.title=`Ver solo los espíritus que le faltan a ${p.name}`;
      b.onclick=()=>{
        const wasActive = state.filter === v;
        state.filter = wasActive ? 'all' : v;
        [...sf.children].forEach(x=>x.classList.toggle('active',!wasActive && x===b));
        render();
      };
      sf.append(b);
    });
  }

  $('#searchInput').addEventListener('input', e => { state.search=e.target.value; render(); });
  $('#refreshBtn').addEventListener('click', () => loadProgress(false));
  buildFilters();
  render();
  loadProgress(false);
  setInterval(() => loadProgress(true), 2500);
})();
