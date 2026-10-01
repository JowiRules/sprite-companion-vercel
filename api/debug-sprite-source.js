module.exports = async function handler(req,res){
  try{
    const r=await fetch('https://mysprites.me/backbling',{headers:{'User-Agent':'Mozilla/5.0','Accept':'text/html'}});
    const html=await r.text();
    const matches=[...html.matchAll(/(?:src|href)=["']([^"']*\/images\/sprites\/[^"']+)["']/gi)].map(m=>m[1]);
    const uniq=[...new Set(matches)].filter(x=>/spooky|vamp|deer|dumpster|trick|crown|klombo|crash|blinky|killswitch|xray|morgana|tails|sonic|overshield|shadow|pond|eight|birthday|bush|adventure|jonesy|storm|onigiri/i.test(x));
    res.setHeader('Content-Type','application/json; charset=utf-8');
    res.setHeader('Cache-Control','no-store');
    res.end(JSON.stringify({status:r.status,count:uniq.length,items:uniq},null,2));
  }catch(e){res.statusCode=500;res.end(String(e&&e.stack||e));}
};