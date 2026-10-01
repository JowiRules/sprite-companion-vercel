module.exports = async function handler(req,res){
  const names=[
    'Fortnite-Vampire-Sprite.webp','Fortnite-Trick-or-Treat-Vampire-Sprite.webp',
    'Fortnite-Trick-or-Treat-The-Deer-Sprite.webp',
    'Fortnite-Trick-or-Treat-Dumpster-Dive-Sprite.webp',
    'Fortnite-Trick-or-Treat-Tails-Sprite.webp',
    'Fortnite-Trick-or-Treat-Crown-Sprite.webp',
    'Fortnite-Trick-or-Treat-Klombo-Sprite.webp',
    'Fortnite-Trick-or-Treat-Crash-Bandicoot-Sprite.webp',
    'Fortnite-Trick-or-Treat-Blinky-Sprite.webp',
    'Fortnite-Trick-or-Treat-Killswitch-Sprite.webp',
    'Fortnite-Trick-or-Treat-X-Ray-Sprite.webp',
    'Fortnite-Trick-or-Treat-Morgana-Sprite.webp',
    'Fortnite-Trick-or-Treat-Sonic-Sprite.webp',
    'Fortnite-Trick-or-Treat-Overshield-Sprite.webp',
    'Fortnite-Trick-or-Treat-Shadow-Sprite.webp',
    'Fortnite-Trick-or-Treat-Pond-Sprite.webp',
    'Fortnite-Trick-or-Treat-8-Bit-Sprite.webp',
    'Fortnite-Trick-or-Treat-Birthday-Sprite.webp',
    'Fortnite-Trick-or-Treat-Bushranger-Sprite.webp',
    'Fortnite-Trick-or-Treat-Adventure-Sprite.webp',
    'Fortnite-Trick-or-Treat-Jonesy-Sprite.webp',
    'Fortnite-Trick-or-Treat-Storm-Scout-Sprite.webp',
    'Fortnite-Trick-or-Treat-Onigiri-Sprite.webp',
    'Fortnite-Trick-or-Treat-Spooky-Dash-Sprite.webp'
  ];
  const out=[];
  for(const n of names){
    try{
      const url='https://www-static.theclick.gg/wp-content/uploads/2026/10/'+n+'?media=1790268928';
      const r=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0','Accept':'image/avif,image/webp,image/*,*/*;q=0.8'}});
      const type=(r.headers.get('content-type')||'').toLowerCase();
      out.push({n,status:r.status,type,len:r.headers.get('content-length')});
    }catch(e){out.push({n,error:String(e)})}
  }
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.end(JSON.stringify(out,null,2));
};