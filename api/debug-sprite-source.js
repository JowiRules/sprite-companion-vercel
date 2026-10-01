module.exports = async function handler(req,res){
  const names=[
    'spookydash.webp','spookydash_basic.webp','spooky_dash.webp','spooky_dash_basic.webp',
    'spookydash_gold.webp','spooky_dash_gold.webp','spookydash_cheatmaster.webp','spooky_dash_cheatmaster.webp','spookydash_loothacker.webp','spooky_dash_loothacker.webp','spookydash_bountyhunter.webp','spooky_dash_bountyhunter.webp','spookydash_trickortreat.webp','spooky_dash_trickortreat.webp','spookydash_trick_or_treat.webp',
    'vampire.webp','vampire_basic.webp','vampire_gold.webp','vampire_cheatmaster.webp','vampire_loothacker.webp','vampire_bountyhunter.webp','vampire_trickortreat.webp','vampire_trick_or_treat.webp',
    'thedeer.webp','thedeer_basic.webp','the_deer.webp','the_deer_basic.webp','thedeer_gold.webp','the_deer_gold.webp','thedeer_cheatmaster.webp','the_deer_cheatmaster.webp','thedeer_loothacker.webp','the_deer_loothacker.webp','thedeer_bountyhunter.webp','the_deer_bountyhunter.webp','thedeer_trickortreat.webp','the_deer_trickortreat.webp',
    'dumpsterdive.webp','dumpsterdive_basic.webp','dumpster_dive.webp','dumpster_dive_basic.webp','dumpsterdive_gold.webp','dumpster_dive_gold.webp','dumpsterdive_loothacker.webp','dumpster_dive_loothacker.webp','dumpsterdive_bountyhunter.webp','dumpster_dive_bountyhunter.webp','dumpsterdive_trickortreat.webp','dumpster_dive_trickortreat.webp',
    'crown_trickortreat.webp','crown_trick_or_treat.webp','klombo_trickortreat.webp','crash_trickortreat.webp','crashbandicoot_trickortreat.webp','blinky_trickortreat.webp'
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