module.exports = async function handler(req, res) {
  const targets = [
    'https://fortnite.gg/assets?id=6992',
    'https://fortnite.gg/assets?id=6994',
    'https://fortnite.gg/sprites?pubDate=20260917',
    'https://mysprites.me/',
    'https://mysprites.me/backbling'
  ];
  const out = [];
  for (const url of targets) {
    try {
      const r = await fetch(url, { redirect:'follow', headers:{'User-Agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1','Accept':'text/html,application/xhtml+xml'} });
      const html = await r.text();
      const urls = [...new Set((html.match(/https?:[^\"'<>\\s]+|(?:src|href)=[\"'][^\"']+[\"']/gi) || [])
        .map(x => x.replace(/^(?:src|href)=[\"']|[\"']$/gi,''))
        .filter(x => /(?:webp|png|jpg|jpeg|sprite|blinky|crash|pond)/i.test(x)))].slice(0,120);
      const snippets = [];
      for (const term of ['Blinky','Crash Bandicoot','Pond','GhostDamage','BodySlam','WinnerA','Crown_BountyHunter']) {
        const i = html.toLowerCase().indexOf(term.toLowerCase());
        if (i >= 0) snippets.push({term, text: html.slice(Math.max(0,i-350), i+700)});
      }
      out.push({url,status:r.status,finalUrl:r.url,contentType:r.headers.get('content-type'),length:html.length,urls,snippets});
    } catch (e) { out.push({url,error:String(e)}); }
  }
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.end(JSON.stringify(out));
};
