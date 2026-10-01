module.exports = async function handler(req,res){
  const slugs=[
    'fortnite-spooky-dash-sprite','fortnite-gold-spooky-dash-sprite','fortnite-cheat-master-spooky-dash-sprite','fortnite-loot-hacker-spooky-dash-sprite','fortnite-bounty-hunter-spooky-dash-sprite','fortnite-trick-or-treat-spooky-dash-sprite',
    'fortnite-vampire-sprite','fortnite-gold-vampire-sprite','fortnite-cheat-master-vampire-sprite','fortnite-loot-hacker-vampire-sprite','fortnite-bounty-hunter-vampire-sprite','fortnite-trick-or-treat-vampire-sprite',
    'fortnite-the-deer-sprite','fortnite-gold-the-deer-sprite','fortnite-cheat-master-the-deer-sprite','fortnite-loot-hacker-the-deer-sprite','fortnite-bounty-hunter-the-deer-sprite','fortnite-trick-or-treat-the-deer-sprite',
    'fortnite-dumpster-dive-sprite','fortnite-gold-dumpster-dive-sprite','fortnite-loot-hacker-dumpster-dive-sprite','fortnite-bounty-hunter-dumpster-dive-sprite','fortnite-trick-or-treat-dumpster-dive-sprite',
    'fortnite-trick-or-treat-tails-sprite'
  ];
  const out=[];
  for(const slug of slugs){
    try{
      const r=await fetch('https://www.theclick.gg/'+slug+'/',{headers:{'User-Agent':'Mozilla/5.0','Accept':'text/html'}});
      const html=await r.text();
      const m=html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)||html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
      out.push({slug,status:r.status,og:m?m[1]:null,title:(html.match(/<title>([^<]+)/i)||[])[1]||null});
    }catch(e){out.push({slug,error:String(e)})}
  }
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.end(JSON.stringify(out,null,2));
};