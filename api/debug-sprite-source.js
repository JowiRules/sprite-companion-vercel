module.exports = async function handler(req,res){
  const names=[
    'jonesy_trickortreat.webp','adventure_trickortreat.webp','bush_trickortreat.webp','bushranger_trickortreat.webp','sonic_trickortreat.webp','tails_trickortreat.webp','shadow_trickortreat.webp','eightbit_trickortreat.webp','8bit_trickortreat.webp','killswitch_trickortreat.webp','overshield_trickortreat.webp','xray_trickortreat.webp','x-ray_trickortreat.webp','onigiri_trickortreat.webp','stormscout_trickortreat.webp','storm_scout_trickortreat.webp','morgana_trickortreat.webp','pond_trickortreat.webp','birthday_trickortreat.webp',
    'vamp.webp','vamp_basic.webp','vampire.webp','vampire_basic.webp','vampiresprite.webp','vampire_sprite.webp',
    'vamp_gold.webp','vampire_gold.webp','vamp_cheatmaster.webp','vampire_cheatmaster.webp','vamp_loothacker.webp','vampire_loothacker.webp','vamp_bountyhunter.webp','vampire_bountyhunter.webp','vamp_trickortreat.webp','vampire_trickortreat.webp',
    'deer.webp','deer_basic.webp','thedeer.webp','thedeer_basic.webp','the_deer.webp','the_deer_basic.webp','deersprite.webp','thedeersprite.webp',
    'deer_gold.webp','thedeer_gold.webp','deer_cheatmaster.webp','thedeer_cheatmaster.webp','deer_loothacker.webp','thedeer_loothacker.webp','deer_bountyhunter.webp','thedeer_bountyhunter.webp','deer_trickortreat.webp','thedeer_trickortreat.webp',
    'dumpster.webp','dumpster_basic.webp','dumpsterdive.webp','dumpsterdive_basic.webp','dumpster_dive.webp','dumpster_dive_basic.webp','dumpsterdivesprite.webp',
    'dumpster_gold.webp','dumpsterdive_gold.webp','dumpster_cheatmaster.webp','dumpsterdive_cheatmaster.webp','dumpster_loothacker.webp','dumpsterdive_loothacker.webp','dumpster_bountyhunter.webp','dumpsterdive_bountyhunter.webp','dumpster_trickortreat.webp','dumpsterdive_trickortreat.webp'
  ];
  const out=[];
  for(const n of names){
    try{
      const r=await fetch('https://mysprites.me/images/sprites/'+n,{headers:{'User-Agent':'Mozilla/5.0 (compatible; SpriteCompanion/1.0)','Accept':'image/avif,image/webp,image/*,*/*;q=0.8','Referer':'https://mysprites.me/'}});
      const type=(r.headers.get('content-type')||'').toLowerCase();
      if(r.ok && type.startsWith('image/')) out.push({n,status:r.status,type});
    }catch(e){}
  }
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.end(JSON.stringify(out,null,2));
};