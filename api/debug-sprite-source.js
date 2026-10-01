module.exports = async function handler(req,res){
  const names=[
    'spooky_dash','gold_spooky_dash','cheat_master_spooky_dash','loot_hacker_spooky_dash','bounty_hunter_spooky_dash','trick_or_treat_spooky_dash',
    'vampire','gold_vampire','cheat_master_vampire','loot_hacker_vampire','bounty_hunter_vampire','trick_or_treat_vampire',
    'the_deer','gold_the_deer','cheat_master_the_deer','loot_hacker_the_deer','bounty_hunter_the_deer','trick_or_treat_the_deer',
    'dumpster_dive','gold_dumpster_dive','loot_hacker_dumpster_dive','bounty_hunter_dumpster_dive','trick_or_treat_dumpster_dive',
    'trick_or_treat_crown','trick_or_treat_klombo','trick_or_treat_crash_bandicoot','trick_or_treat_blinky','trick_or_treat_killswitch',
    'trick_or_treat_xray','trick_or_treat_morgana','trick_or_treat_tails','trick_or_treat_sonic','trick_or_treat_overshield',
    'trick_or_treat_shadow','trick_or_treat_pond','trick_or_treat_eightbit','trick_or_treat_birthday','trick_or_treat_bush',
    'trick_or_treat_adventure','trick_or_treat_jonesy','trick_or_treat_storm_scout','trick_or_treat_onigiri'
  ];
  const out=[];
  for(const n of names){
    try{
      const r=await fetch('https://addi.yt/api/sprites/img/'+n,{method:'GET',headers:{'User-Agent':'Mozilla/5.0','Accept':'image/*,*/*;q=0.8'}});
      out.push({n,status:r.status,type:r.headers.get('content-type'),len:r.headers.get('content-length')});
    }catch(e){out.push({n,error:String(e)})}
  }
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.end(JSON.stringify(out,null,2));
};