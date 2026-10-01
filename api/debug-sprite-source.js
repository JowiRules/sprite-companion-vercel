module.exports = async function handler(req,res){
  const qs=['Spooky Dash Sprite','Vampire Sprite','The Deer Sprite','Dumpster Dive Sprite','Trick or Treat Crown Sprite'];
  const out=[];
  for(const q of qs){
    try{
      const r=await fetch('https://fortnite-api.com/v2/cosmetics/br/search?name='+encodeURIComponent(q),{headers:{'User-Agent':'Mozilla/5.0','Accept':'application/json'}});
      const t=await r.text();
      out.push({q,status:r.status,text:t.slice(0,2500)});
    }catch(e){out.push({q,error:String(e)})}
  }
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.end(JSON.stringify(out,null,2));
};