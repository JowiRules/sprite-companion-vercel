module.exports = async function handler(req,res){
  try{
    const r=await fetch('https://spritetrading.com/u/b833f229b5',{headers:{'User-Agent':'Mozilla/5.0','Accept':'text/html'}});
    const html=await r.text();
    const terms=['Trick or Treat Tails','Trick or Treat Jackrabbit','Vampire','Trick or Treat Vampire','Dumpster Dive','Cheat Master Dumpster Dive','The Deer'];
    const snippets={};
    for(const term of terms){
      const i=html.toLowerCase().indexOf(term.toLowerCase());
      snippets[term]=i>=0?html.slice(Math.max(0,i-1500),Math.min(html.length,i+2500)):null;
    }
    res.setHeader('Content-Type','application/json; charset=utf-8');
    res.setHeader('Cache-Control','no-store');
    res.end(JSON.stringify({status:r.status,length:html.length,snippets},null,2));
  }catch(e){res.statusCode=500;res.end(String(e&&e.stack||e));}
};