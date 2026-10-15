module.exports=async function handler(req,res){
  const mode=String(req.query?.mode||'pages');
  const timeout=6500;
  const tryFetch=async(url)=>{try{return await fetch(url,{headers:{'User-Agent':'Mozilla/5.0','Accept':'text/html,image/webp,*/*'},signal:AbortSignal.timeout(timeout)});}catch(e){return {ok:false,status:0,error:String(e),headers:{get:()=>''}};}};
  if(mode==='pages'){
    const sources=['https://mysprites.me/all?lang=es','https://spritetrading.com/index','https://fortnite.gg/sprites'];
    const results=await Promise.all(sources.map(async url=>{
      const r=await tryFetch(url);if(!r.ok)return {url,status:r.status,error:r.error};
      const html=await r.text();let out={url,status:r.status,length:html.length,hits:{}};
      for(const word of ['honey','obsession','one wish willow','quack klombo','quack jonesy','quack bush','quack adventure','quack spooky dash']){
        let i=html.toLowerCase().indexOf(word);out.hits[word]=i<0?null:html.slice(Math.max(i-650,0),i+280).slice(0,1000);
      }return out;
    }));
    res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json');return res.end(JSON.stringify(results));
  }
  const slugs=[
    'winnere','winnerf','honey','obsession','onewishwillow','one-wish-willow','willow','honeybee','bees','honey-sprite','onewish',
    'gold-winnere','cheatmaster-winnere','loothacker-winnere','reaper-winnere','tricktreat-winnere',
    'gold-winnerf','cheatmaster-winnerf','loothacker-winnerf','reaper-winnerf','tricktreat-winnerf',
    'quack-jonesy','quack-adventure','quack-bush','quack-klombo','quack-phasedash',
    'quack-spookydash','quack-winnerf','quack-crown','quack-obsession'
  ];
  const results=await Promise.all(slugs.map(async slug=>{
    const url='https://api.spritetrading.com/sprites/'+slug+'.webp?w=192';
    const r=await tryFetch(url);
    return {slug,status:r.status,type:r.headers.get('content-type')||'',len:r.headers.get('content-length')||''};
  }));
  res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json');res.end(JSON.stringify(results));
};