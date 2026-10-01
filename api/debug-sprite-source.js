module.exports = async function handler(req,res){
  const paths=[
    'spooky-dash-sprite.webp','gold-spooky-dash-sprite.webp','cheat-master-spooky-dash-sprite.webp','loot-hacker-spooky-dash-sprite.webp','bounty-hunter-spooky-dash-sprite.webp','trick-or-treat-spooky-dash-sprite.webp',
    'vampire-sprite.webp','gold-vampire-sprite.webp','cheat-master-vampire-sprite.webp','loot-hacker-vampire-sprite.webp','bounty-hunter-vampire-sprite.webp','trick-or-treat-vampire-sprite.webp',
    'the-deer-sprite.webp','gold-the-deer-sprite.webp','cheat-master-the-deer-sprite.webp','loot-hacker-the-deer-sprite.webp','bounty-hunter-the-deer-sprite.webp','trick-or-treat-the-deer-sprite.webp',
    'dumpster-dive-sprite.webp','gold-dumpster-dive-sprite.webp','loot-hacker-dumpster-dive-sprite.webp','bounty-hunter-dumpster-dive-sprite.webp','trick-or-treat-dumpster-dive-sprite.webp',
    'trick-or-treat-crown-sprite.webp','trick-or-treat-klombo-sprite.webp'
  ];
  const out=[];
  for(const p of paths){
    try{
      const r=await fetch('https://spritechecklist.net/sprites/'+p,{method:'GET',headers:{'User-Agent':'Mozilla/5.0','Accept':'image/*,*/*;q=0.8'}});
      out.push({p,status:r.status,type:r.headers.get('content-type'),len:r.headers.get('content-length')});
    }catch(e){out.push({p,error:String(e)})}
  }
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.end(JSON.stringify(out,null,2));
};