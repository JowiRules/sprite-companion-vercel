module.exports = async function handler(req,res){
  try{
    const r=await fetch('https://spritetrading.com/u/b833f229b5',{headers:{'User-Agent':'Mozilla/5.0','Accept':'text/html'}});
    const html=await r.text();
    const out=[];
    const re=/<li class="holder-li"([^>]*)>[\s\S]*?<img src="([^"]+)"/g;
    let m;
    while((m=re.exec(html))){
      const attrs=m[1], src=m[2].replace(/&amp;/g,'&');
      const get=(k)=>{const x=attrs.match(new RegExp('data-'+k+'="([^"]*)"'));return x?x[1]:''};
      out.push({slug:get('slug'),base:get('base'),tier:get('tier'),name:get('sortname')||get('name'),level:get('level'),mastered:get('mastered'),src});
    }
    res.setHeader('Content-Type','application/json; charset=utf-8');
    res.setHeader('Cache-Control','no-store');
    res.end(JSON.stringify({status:r.status,count:out.length,items:out},null,2));
  }catch(e){res.statusCode=500;res.end(String(e&&e.stack||e));}
};