module.exports = async function handler(req,res){
  try{
    const url='https://fortnite.gg/sprites';
    const r=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0','Accept':'text/html'}});
    const html=await r.text();
    const terms=['Spooky Dash','Vampire','The Deer','Dumpster Dive','Trick or Treat','Birthday','Morgana'];
    const snippets={};
    for(const term of terms){
      const i=html.toLowerCase().indexOf(term.toLowerCase());
      snippets[term]=i>=0?html.slice(Math.max(0,i-1800),Math.min(html.length,i+2600)):null;
    }
    res.setHeader('Content-Type','application/json; charset=utf-8');
    res.setHeader('Cache-Control','no-store');
    res.end(JSON.stringify({status:r.status,length:html.length,snippets},null,2));
  }catch(e){res.statusCode=500;res.end(String(e&&e.stack||e));}
};