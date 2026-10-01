module.exports = async function handler(req,res){
  try{
    const url='https://fortnite.gg/sprites';
    const r=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0','Accept':'text/html'}});
    const html=await r.text();
    const terms=['Spooky Dash','Vampire','The Deer','Dumpster Dive','Trick or Treat','Birthday','Morgana'];
    const snippets={};
    for(const term of terms){
      const i=html.toLowerCase().indexOf(term.toLowerCase());
      snippets[term]=i>=0?html.slice(Math.max(0,i-1200),Math.min(html.length,i+1800)):null;
    }
    const urls=[...html.matchAll(/https?:\\/\\/[^"'<>\\s]+/g)].map(m=>m[0]).filter(x=>/sprite|fortnite/i.test(x));
    res.setHeader('Content-Type','application/json; charset=utf-8');
    res.setHeader('Cache-Control','no-store');
    res.end(JSON.stringify({status:r.status,length:html.length,snippets,urls:[...new Set(urls)].slice(0,300)},null,2));
  }catch(e){res.statusCode=500;res.end(String(e&&e.stack||e));}
};