/* ============ A+J dash layer: header, clocks, weather, TDAC, W/M/Y calendar ============ */
(function(){
'use strict';

/* ---------- injected styles ---------- */
const css = `
header.top .wrap{display:block;position:relative;padding-top:2px}
.hdrbar{display:flex;align-items:center;justify-content:flex-end;gap:2px;margin:0;padding:calc(4px + env(safe-area-inset-top)) 12px 7px;border-bottom:1px solid var(--line);position:sticky;top:0;z-index:30;background:#e4ebed}
.hdr-ic{background:none;border:none;padding:6px 7px;cursor:pointer;color:var(--ink)}
.hdr-ic svg{display:block}
.brandc{text-align:center;padding:0}
.brandc img,.brandc .hdrlogo{height:46px;display:inline-block}
.brandc .bn{font-size:18px;font-weight:700;letter-spacing:.4px;margin-top:3px}
.brandc .bs{font-size:11.5px;color:var(--muted);font-style:italic;margin-top:1px}
.hwallet{text-align:center;font-size:13px;font-weight:700;color:var(--teal);border-top:1px solid var(--line2);margin-top:9px;padding:8px 0 2px;cursor:pointer;letter-spacing:.3px}
body:not(.searching) #v-home .searchbar{display:none}
body.searching #v-home .searchbar{display:flex}
.clocks{display:flex;justify-content:center;gap:6px;padding:6px 0 2px}
.clk{text-align:center}
.clk .lbl{font-size:10px;letter-spacing:2.4px;color:var(--muted2);font-weight:700;margin-top:4px}
.clk .dig{font-size:12px;color:var(--ink2);font-variant-numeric:tabular-nums}
.clk .who{font-size:8.5px;letter-spacing:1px;color:var(--muted);font-style:italic}
.clk{cursor:pointer}
.clk .cwx{font-size:10.5px;color:var(--ink2);margin-top:1px}
.today-loc{font-size:14.5px;padding:1px 0 9px;border-bottom:1px solid var(--line2);margin-bottom:9px}
.wallet-link{text-align:center;font-size:13.5px;font-weight:700;color:var(--teal);padding:7px 0 3px;cursor:pointer;letter-spacing:.3px}
.wcard{border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin:10px 0;cursor:pointer;background:#fff}
.wc-t{font-size:14px;font-weight:700}
.wc-s{font-size:12px;color:var(--muted);font-style:italic}
.wc-n{font-size:24px;letter-spacing:2.5px;text-align:center;margin:8px 0 2px;font-variant-numeric:tabular-nums}
.wc-c{font-size:10.5px;color:var(--muted2);text-align:center}
.wline{text-align:center;font-size:13.5px;color:var(--ink2);padding:4px 0 8px;border-bottom:1px solid var(--line2);margin-bottom:6px}
.wline:empty{display:none!important}
.tdac{display:flex;align-items:center;gap:10px;padding:9px 0;border-top:1px solid var(--line2);margin-top:6px}
.tdac a{color:var(--teal);font-weight:700}
.seg{display:flex;background:#fff;border:1px solid var(--line);border-radius:10px;padding:3px;margin-bottom:12px}
.seg button{flex:1;background:none;border:none;font-family:var(--serif);font-weight:700;font-size:13.5px;padding:8px;border-radius:8px;color:var(--muted);cursor:pointer}
.seg button.on{background:var(--teal);color:#fff}
.wk-day{display:flex;gap:12px;padding:10px 0;border-bottom:1px solid var(--line2)}
.wk-day:last-child{border-bottom:0}
.wk-d{width:52px;text-align:center;flex:0 0 auto}
.wk-d b{display:block;font-size:16px}
.wk-d span{font-size:10px;letter-spacing:1.5px;color:var(--muted2);text-transform:uppercase}
.wk-d.today b{color:var(--teal)}
.wk-ev{flex:1;font-size:13.5px;color:var(--ink2)}
.wk-ev .mini{display:block}
.yr-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.yr-m{border:1px solid var(--line);border-radius:10px;padding:10px 6px;text-align:center;cursor:pointer}
.yr-m b{display:block;font-size:14px}
.yr-m span{font-size:11px;color:var(--muted)}
.yr-m.has span{color:var(--teal);font-weight:700}
.ag-mo{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);font-weight:700;margin:16px 0 4px;border-bottom:1px solid var(--line2);padding-bottom:4px}
.ag-row{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--line2)}
.ag-row:last-child{border-bottom:0}
.ag-d{width:44px;flex:0 0 auto;text-align:center}
.ag-d span{display:block;font-size:10px;letter-spacing:1.5px;color:var(--muted2);text-transform:uppercase}
.ag-d b{display:block;font-size:17px;line-height:1.1}
.ag-d.today b{color:var(--teal)}
.ag-main{flex:1;min-width:0}
.agh{font-size:14.5px;font-weight:700}
.ags{font-size:12px;color:var(--muted)}
.ag-tm{width:46px;flex:0 0 auto;text-align:right;font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums;padding-top:2px}
`;
const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

/* ---------- header rebuild ---------- */
window.__AJP='M3459 3163 c-6 -16 -59 -172 -119 -348 -59 -176 -113 -332 -119 -348 -9 -24 24 -122 306 -895 362 -995 351 -959 333 -1002 -18 -44 -106 -77 -212 -80 -5 0 -8 -9 -8 -20 0 -20 5 -20 588 -18 514 3 587 5 587 18 0 10 -16 18 -50 23 -248 43 -252 47 -421 483 -63 164 -214 553 -334 864 -120 311 -286 740 -369 954 -83 214 -151 391 -151 393 0 15 -23 -3 -31 -24z M622 3158 c-42 -42 -3 -55 173 -60 161 -5 192 -13 222 -57 17 -24 18 -83 21 -867 l2 -841 -30 -38 -30 -38 31 -35 32 -36 -6 -375 c-5 -401 -10 -446 -57 -514 -39 -57 -84 -81 -161 -85 -79 -5 -97 11 -63 53 11 13 32 39 47 58 31 39 43 88 33 142 -33 173 -397 208 -483 46 -80 -153 35 -340 232 -377 46 -8 45 -15 -16 -80 l-52 -54 278 0 c260 0 277 1 270 18 -20 46 -55 145 -53 147 2 2 37 19 78 40 203 101 339 250 378 416 32 133 35 237 33 1271 -3 1081 0 1182 28 1198 10 5 80 12 157 15 76 3 149 8 162 11 30 6 28 32 -4 44 -40 15 -1207 13 -1222 -2z M2425 2424 c-416 -52 -566 -396 -335 -771 l48 -77 -118 -58 c-366 -178 -508 -493 -360 -795 155 -314 676 -390 1060 -154 l48 30 23 -25 c128 -137 406 -168 574 -64 84 52 137 150 82 150 -17 0 -28 -10 -40 -35 -58 -121 -182 -71 -312 127 l-66 100 40 61 c76 117 120 229 195 489 21 72 61 106 135 115 53 6 82 26 64 44 -6 6 -101 8 -244 7 -226 -3 -234 -4 -234 -23 0 -17 9 -21 68 -27 118 -11 138 -39 117 -166 -16 -99 -51 -205 -104 -317 -72 -149 -50 -160 -221 107 -82 128 -191 297 -242 376 -51 79 -93 147 -93 152 0 4 44 32 98 60 138 75 226 135 262 180 132 166 82 361 -116 455 -90 43 -241 70 -329 59z m130 -88 c112 -86 136 -316 49 -476 -31 -57 -122 -150 -132 -134 -197 289 -251 464 -178 574 51 77 183 95 261 36z m-102 -1248 c152 -234 277 -431 277 -436 0 -30 -159 -82 -250 -82 -396 1 -657 470 -455 815 28 49 135 150 145 138 3 -4 131 -200 283 -435z';
const hdr = document.querySelector('header.top .wrap');
hdr.innerHTML = `
  <div class="hdrbar"><img id="hdrLogo" src="aj-logo.png" alt="J&A" style="height:22px;width:auto;display:block;margin-right:auto;cursor:pointer"><button class="hdr-ic" id="hdrSearch" aria-label="Search"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></svg></button><span id="verTag" style="display:none">v225</span><button class="hdr-ic" id="hdrF1" aria-label="Formula 1"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2 14.5h1.5l2-2H10l2.2-2 1.8 2H19a3 3 0 0 1 3 3"/><path d="M8.5 16.5h6"/><circle cx="6" cy="16.5" r="2"/><circle cx="17" cy="16.5" r="2"/></svg></button><button class="hdr-ic" id="hdrNotes" aria-label="Notes"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 3h11l3 3v15H5z"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg></button><button class="hdr-ic" id="hdrCal" aria-label="Calendar"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="2.5" x2="8" y2="6.5"/><line x1="16" y1="2.5" x2="16" y2="6.5"/></svg></button><button class="hdr-ic" id="hdrWallet" aria-label="Wallet" onclick="openCards()"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2.5" y="5.5" width="19" height="13" rx="2.5"/><line x1="2.5" y1="10" x2="21.5" y2="10"/></svg></button><button class="hdr-ic" id="hdrMusic" aria-label="Music" onclick="location.href='villa.html'"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 18V5l11-2v13"/><circle cx="6.2" cy="18" r="2.8"/><circle cx="17.2" cy="16" r="2.8"/></svg></button></div>
  <div class="brandc">
    <div class="bn" id="brandName" style="display:none">A + J</div>
    <div class="bs" style="display:none"><span class="dot" id="syncDot" style="display:inline-block;margin-right:5px"></span><span id="brandSub">Trips &amp; Info</span></div>
  </div>
  `;
try{var _hb=document.querySelector('header.top .hdrbar');if(_hb)document.body.insertBefore(_hb,document.body.firstChild);}catch(e){}
try{var _lg=document.getElementById('hdrLogo');var _vt=document.getElementById('verTag');if(_lg){_lg.title=_vt?_vt.textContent:'';_lg.onclick=function(){try{go('home');window.scrollTo(0,0);}catch(e){}};}}catch(e){}
document.getElementById('hdrSearch').onclick = () => {
  document.body.classList.toggle('searching');
  if (document.body.classList.contains('searching')) {
    const s = document.getElementById('homeSearch'); if (s) s.focus();
  } else { homeQuery=''; if (cur==='home') rHome(); }
};

/* ---------- timezone helpers ---------- */
const TZMAP = {'hong kong':'Asia/Hong_Kong','hk':'Asia/Hong_Kong','singapore':'Asia/Singapore','london':'Europe/London','uk':'Europe/London','manchester':'Europe/London','bury':'Europe/London','tokyo':'Asia/Tokyo','osaka':'Asia/Tokyo','sydney':'Australia/Sydney','melbourne':'Australia/Melbourne','dubai':'Asia/Dubai','paris':'Europe/Paris','rome':'Europe/Rome','new york':'America/New_York','los angeles':'America/Los_Angeles','bali':'Asia/Makassar','kuala lumpur':'Asia/Kuala_Lumpur','hanoi':'Asia/Bangkok','saigon':'Asia/Ho_Chi_Minh','ho chi minh':'Asia/Ho_Chi_Minh','phnom penh':'Asia/Phnom_Penh','manila':'Asia/Manila','taipei':'Asia/Taipei','seoul':'Asia/Seoul','delhi':'Asia/Kolkata','mumbai':'Asia/Kolkata'};
function currentOrNextTrip(){
  const tk = iso(today());
  const act = D.trips.find(t=>t.start_date&&String(t.start_date).slice(0,10)<=tk&&tk<=String(t.end_date||t.start_date).slice(0,10));
  return act || nextTrip();
}
function secondZone(){
  const t = currentOrNextTrip();
  if (t && t.dest){
    const d = t.dest.toLowerCase();
    for (const k in TZMAP){ if (d.includes(k) && TZMAP[k] !== 'Asia/Bangkok') return {tz:TZMAP[k], label:t.dest.toUpperCase()}; }
  }
  return {tz:'Europe/London', label:'LONDON'};
}
const tzFmtCache={};
function tzParts(tz){
  const f = tzFmtCache[tz]||(tzFmtCache[tz]=new Intl.DateTimeFormat('en-GB',{timeZone:tz,hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}));
  const p = f.formatToParts(new Date());
  const g = t => +p.find(x=>x.type===t).value;
  return {h:g('hour')%24, m:g('minute'), s:g('second')};
}

/* ---------- Lange-style clock dial (1815) ---------- */
function dialSVG(id){
  let g='';
  // railway minute track: two rings + minute bars
  g+='<circle cx="60" cy="60" r="50.5" fill="none" stroke="#1a1a1a" stroke-width="0.55"/>';
  g+='<circle cx="60" cy="60" r="45.8" fill="none" stroke="#1a1a1a" stroke-width="0.55"/>';
  for(let i=0;i<60;i++){
    const a=i*6*Math.PI/180, maj=i%5===0;
    g+=`<line x1="${60+45.8*Math.sin(a)}" y1="${60-45.8*Math.cos(a)}" x2="${60+50.5*Math.sin(a)}" y2="${60-50.5*Math.cos(a)}" stroke="#1a1a1a" stroke-width="${maj?1.5:0.5}"/>`;
    if(maj) g+=`<circle cx="${60+53.6*Math.sin(a)}" cy="${60-53.6*Math.cos(a)}" r="0.9" fill="#1a1a1a"/>`;
  }
  // all twelve numerals inside the track
  for(let n=1;n<=12;n++){
    const a=n*30*Math.PI/180;
    g+=`<text x="${60+37.5*Math.sin(a)}" y="${60-37.5*Math.cos(a)+3.8}" text-anchor="middle" font-family="Times New Roman,serif" font-size="11.5" font-weight="600" fill="#1a1a1a">${n}</text>`;
  }
  // sub-seconds at 6
  g+='<circle cx="60" cy="82" r="11.5" fill="none" stroke="#1a1a1a" stroke-width="0.45"/>';
  for(let i=0;i<12;i++){
    const a=i*30*Math.PI/180;
    g+=`<line x1="${60+9.6*Math.sin(a)}" y1="${82-9.6*Math.cos(a)}" x2="${60+11.5*Math.sin(a)}" y2="${82-11.5*Math.cos(a)}" stroke="#1a1a1a" stroke-width="${i%3===0?0.9:0.45}"/>`;
  }
  return `<svg width="80" height="80" viewBox="0 0 120 120">
    <circle cx="60" cy="60" r="58.5" fill="#fff" stroke="#cfcfcf" stroke-width="1"/>
    ${g}
    <path id="${id}h" d="M60 60 L57.9 51 L60 30.5 L62.1 51 Z" fill="#2b4a7a"/>
    <path id="${id}m" d="M60 60 L58.4 50 L60 17.5 L61.6 50 Z" fill="#2b4a7a"/>
    <line id="${id}s" x1="60" y1="85.5" x2="60" y2="72.8" stroke="#2b4a7a" stroke-width="0.9" stroke-linecap="round"/>
    <circle cx="60" cy="60" r="2.2" fill="#2b4a7a"/>
    <circle cx="60" cy="82" r="1.1" fill="#2b4a7a"/>
  </svg>`;
}
let clockTimer=null;
const CITIES=[
  {c:'Samui',tz:'Asia/Bangkok',lat:9.512,lon:100.014},
  {c:'Bangkok',tz:'Asia/Bangkok',lat:13.756,lon:100.502},
  {c:'Chiang Mai',tz:'Asia/Bangkok',lat:18.788,lon:98.985},
  {c:'London',tz:'Europe/London',lat:51.507,lon:-0.128},
  {c:'Manchester',tz:'Europe/London',lat:53.481,lon:-2.243},
  {c:'Halifax',tz:'America/Halifax',lat:44.649,lon:-63.575},
  {c:'Dubai',tz:'Asia/Dubai',lat:25.204,lon:55.271},
  {c:'Hong Kong',tz:'Asia/Hong_Kong',lat:22.319,lon:114.169},
  {c:'Singapore',tz:'Asia/Singapore',lat:1.352,lon:103.820},
  {c:'Tokyo',tz:'Asia/Tokyo',lat:35.677,lon:139.650},
  {c:'Sydney',tz:'Australia/Sydney',lat:-33.869,lon:151.209},
  {c:'New York',tz:'America/New_York',lat:40.713,lon:-74.006},
  {c:'Los Angeles',tz:'America/Los_Angeles',lat:34.052,lon:-118.244},
  {c:'Paris',tz:'Europe/Paris',lat:48.857,lon:2.352},
  {c:'Rome',tz:'Europe/Rome',lat:41.903,lon:12.496},
  {c:'Kuala Lumpur',tz:'Asia/Kuala_Lumpur',lat:3.139,lon:101.687},
  {c:'Bali',tz:'Asia/Makassar',lat:-8.409,lon:115.189}
];
const CLOCK_DEFAULTS=[
  {city:'Samui',who:'HOME'},
  {city:'London',who:'ED'},
  {city:'Halifax',who:'EVE · ALEX'},
  {city:'Dubai',who:'EMILY'}
];
function clockSlots(){
  let ov=null; try{ ov=JSON.parse(localStorage.getItem('aj_clocks')||'null'); }catch(e){}
  const slots=(Array.isArray(ov)&&ov.length===4)?ov:CLOCK_DEFAULTS;
  return slots.map(s=>{
    const ci=CITIES.find(x=>x.c===s.city)||CITIES[0];
    const def=CLOCK_DEFAULTS.find(d=>d.city===s.city);
    return {tz:ci.tz,label:ci.c.toUpperCase(),who:(s.who!=null&&s.who!==''?s.who:(def?def.who:'')),lat:ci.lat,lon:ci.lon,city:ci.c};
  });
}
function zoneList(){ return clockSlots(); }
function tickClocks(){
  const zs=zoneList();
  zs.forEach((z,i)=>{
    const id='ck'+(i+1);
    const hEl=document.getElementById(id+'h'); if(!hEl) return;
    const t=tzParts(z.tz);
    const frac=(Date.now()%1000)/1000;
    hEl.setAttribute('transform',`rotate(${(t.h%12)*30+t.m*0.5} 60 60)`);
    document.getElementById(id+'m').setAttribute('transform',`rotate(${t.m*6+(t.s+frac)*0.1} 60 60)`);
    const sEl=document.getElementById(id+'s'); if(sEl) sEl.setAttribute('transform',`rotate(${(t.s+frac)*6} 60 82)`);
    const dig=document.getElementById(id+'d'); if(dig) dig.textContent=`${String(t.h).padStart(2,'0')}:${String(t.m).padStart(2,'0')}`;
  });
}

/* ---------- weather (open-meteo) ---------- */
const WICON={0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',51:'🌦️',53:'🌦️',55:'🌧️',56:'🌧️',57:'🌧️',61:'🌦️',63:'🌧️',65:'🌧️',66:'🌧️',67:'🌧️',71:'🌨️',73:'🌨️',75:'🌨️',80:'🌦️',81:'🌧️',82:'⛈️',95:'⛈️',96:'⛈️',99:'⛈️'};
const wxCache={};
async function wx(lat,lon){
  const key=lat.toFixed(2)+','+lon.toFixed(2);
  const now=Date.now();
  if(wxCache[key]&&now-wxCache[key].t<600000) return wxCache[key].v;
  const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`);
  const j=await r.json();
  const v={temp:Math.round(j.current.temperature_2m),icon:WICON[j.current.weather_code]||'🌡️'};
  wxCache[key]={t:now,v};return v;
}
async function geo(name){
  const key='g:'+name;
  if(wxCache[key]) return wxCache[key];
  const r=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1`);
  const j=await r.json();
  const v=j.results&&j.results[0]?{lat:j.results[0].latitude,lon:j.results[0].longitude}:null;
  wxCache[key]=v;return v;
}
async function fillWeather(){
  const elw=document.getElementById('wline'); if(!elw) return;
  try{
    const t=currentOrNextTrip();
    const tripSoon=t&&t.start_date&&((parseD(t.start_date)-today())/864e5)<=7;
    if(t&&t.dest&&tripSoon&&!/samui|bangkok/i.test(t.dest)){
      const g=await geo(t.dest.split('—')[0].split(',')[0].trim());
      if(g){const dw=await wx(g.lat,g.lon);elw.innerHTML=`✈️ ${esc(t.dest)} ${dw.temp}° ${dw.icon}`;return;}
    }
    elw.innerHTML='';
  }catch(e){}
}
async function fillClockWx(){
  const zs=zoneList();
  for(let i=0;i<zs.length;i++){
    try{ const v=await wx(zs[i].lat,zs[i].lon); const w=document.getElementById('ck'+(i+1)+'w'); if(w) w.textContent=v.temp+'° '+v.icon; }catch(e){}
  }
}
window.pickClock=function(i){
  const cur=clockSlots()[i];
  openSheet(`<h3>Clock ${i+1} — choose city</h3>`+CITIES.map(x=>`<div class="list-item" style="cursor:pointer" onclick="setClock(${i},'${x.c.replace(/'/g,"\\'")}')"><div class="li-main"><div class="h">${x.c===cur.city?'✓ ':''}${x.c}</div></div></div>`).join('')+`<button class="btn ghost block" style="margin-top:12px" onclick="resetClocks()">↩ Back to the usual four</button>`);
};
window.setClock=function(i,city){
  let ov=null; try{ ov=JSON.parse(localStorage.getItem('aj_clocks')||'null'); }catch(e){}
  if(!Array.isArray(ov)||ov.length!==4) ov=CLOCK_DEFAULTS.map(d=>({city:d.city,who:d.who}));
  const def=CLOCK_DEFAULTS.find(d=>d.city===city);
  ov[i]={city:city,who:def?def.who:''};
  localStorage.setItem('aj_clocks',JSON.stringify(ov));
  closeSheet(); rHome();
};
window.resetClocks=function(){ localStorage.removeItem('aj_clocks'); closeSheet(); rHome(); };
async function fillTodayWx(act){
  const el2=document.getElementById('todWx'); if(!el2) return;
  try{
    let lat=9.512, lon=100.014;
    if(act&&act.dest&&!/samui/i.test(act.dest)){ const g=await geo(act.dest.split('—')[0].split(',')[0].trim()); if(g){lat=g.lat;lon=g.lon;} }
    const key='tw:'+lat.toFixed(2)+','+lon.toFixed(2);
    const now=Date.now();
    let v=(wxCache[key]&&now-wxCache[key].at<600000)?wxCache[key].v:null;
    if(!v){
      const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=1`);
      const j=await r.json();
      v={t:Math.round(j.current.temperature_2m),ic:WICON[j.current.weather_code]||'🌡️',hi:Math.round(j.daily.temperature_2m_max[0]),lo:Math.round(j.daily.temperature_2m_min[0]),rain:j.daily.precipitation_probability_max[0]==null?0:j.daily.precipitation_probability_max[0]};
      wxCache[key]={at:now,v};
    }
    el2.innerHTML=` · ${v.ic} ${v.t}° <span class="mini">${v.lo}–${v.hi}° · ☔ ${v.rain}%</span>`;
  }catch(e){}
}
window.weatherCard=async function(i){
  const z=(typeof i==='object')?i:zoneList()[i];
  openSheet(`<h3>${esc(z.city)} — weather</h3><div id="wxCard"><div class="mini">Loading…</div></div>`);
  try{
    const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${z.lat}&longitude=${z.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&timezone=auto&forecast_days=7`);
    const j=await r.json();
    const c=j.current, d=j.daily;
    let h=`<div style="text-align:center;font-size:36px;margin:8px 0 2px">${WICON[c.weather_code]||'🌡️'} ${Math.round(c.temperature_2m)}°</div>
      <div class="mini" style="text-align:center;margin-bottom:8px">humidity ${c.relative_humidity_2m}% · wind ${Math.round(c.wind_speed_10m)} km/h · local time ${new Intl.DateTimeFormat('en-GB',{timeZone:z.tz,hour:'2-digit',minute:'2-digit'}).format(new Date())}</div><div class="divider"></div>`;
    for(let k=0;k<d.time.length;k++){
      const dd=parseD(d.time[k]);
      h+=`<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--line2)">
        <span><b>${k===0?'Today':dd.toLocaleDateString(undefined,{weekday:'short',day:'numeric'})}</b> ${WICON[d.weather_code[k]]||''}</span>
        <span class="mini">${Math.round(d.temperature_2m_min[k])}° – ${Math.round(d.temperature_2m_max[k])}° · ☔ ${d.precipitation_probability_max[k]==null?0:d.precipitation_probability_max[k]}%</span></div>`;
    }
    h+=`<div class="btn-row" style="margin-top:14px">
      <a class="btn ghost" target="_blank" href="https://www.windy.com/${z.lat}/${z.lon}">🌍 Windy map</a>
      <a class="btn ghost" target="_blank" href="https://www.google.com/search?q=${encodeURIComponent('weather '+z.city)}">Full report</a></div>`;
    const bx=document.getElementById('wxCard'); if(bx) bx.innerHTML=h;
  }catch(e){ const bx=document.getElementById('wxCard'); if(bx) bx.innerHTML='<div class="mini">Weather unavailable right now.</div>'; }
};

/* ---------- TDAC ---------- */
const THAI_AIRPORTS=['USM','BKK','DMK','CNX','HKT','KBV','URT','HDY','CEI','UTH','KKC','UBP','NST','TST','SGZ'];
const THAI_PLACES=/samui|bangkok|chiang\s*mai|chiang\s*rai|phuket|krabi|hua\s*hin|pattaya|surat|khao|isaan|trang|songkhla|hat\s*yai|thailand/i;
function tripIntl(t){
  const fls=D.flights.filter(f=>f.trip_id===t.id);
  if(fls.length) return fls.some(f=>{
    const a=(f.from_code||'').toUpperCase(), b=(f.to_code||'').toUpperCase();
    return (a&&THAI_AIRPORTS.indexOf(a)<0)||(b&&THAI_AIRPORTS.indexOf(b)<0);
  })?'intl':'domestic';
  if(t.dest&&THAI_PLACES.test(t.dest)) return 'domestic';
  if(t.dest) return 'intl';
  return 'unknown';
}
function tdacRows(){
  const tk=iso(today());
  const soon=[];
  D.trips.forEach(t=>{
    const end=String(t.end_date||t.start_date||'').slice(0,10);
    if(!end)return;
    const kind=tripIntl(t);
    if(kind==='domestic')return;
    const d=daysTo(end);
    if(d!=null&&d>=0&&d<=3&&end>=tk){
      const ask=kind==='unknown';
      soon.push(`<div class="tdac">🛂<div style="flex:1"><b>${ask?'Returning from abroad? TDAC arrival card':'TDAC arrival card'}</b> — return ${fmtShort(end)}${d===0?' today':` in ${d} day${d===1?'':'s'}`} · file within 72h of landing<br><a href="https://tdac.immigration.go.th/arrival-card/?#/home" target="_blank">tdac.immigration.go.th ↗</a></div></div>`);
    }
  });
  return soon.join('');
}
window.smackPick=function(f){
  if(!f||!f.ftime) return '';
  const dom=THAI_AIRPORTS.indexOf(String(f.from_code||'').toUpperCase())>=0&&THAI_AIRPORTS.indexOf(String(f.to_code||'').toUpperCase())>=0;
  const hm=f.ftime.split(':'); let m=(+hm[0])*60+(+hm[1]||0)-(dom?120:150); if(m<0)m+=1440; /* villa pickup: -2h Thai domestic, -2h30 international */
  return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
};
function smackRows(){
  const rows=[];
  const _ss=new Set();
  D.flights.forEach(f=>{
    if((f.from_code||'').toUpperCase()!=='USM'||!f.fdate)return;
    const k=String(f.fdate).slice(0,10);
    if(_ss.has((f.flight_no||'')+k))return; _ss.add((f.flight_no||'')+k);
    const d=daysTo(k);
    if(d==null||d<0||d>3)return;
    const bk=D.trip_items.find(i=>i.trip_id===f.trip_id&&i.kind==='transport'&&String(i.idate||'').slice(0,10)===k);
    const pick=smackPick(f);
    if(bk){
      rows.push(`<div class="tdac">🚗<div style="flex:1"><b>Smackone booked</b> — ${esc(f.flight_no||'flight')} ${fmtShort(f.fdate)}${bk.itime?' · pickup '+esc(bk.itime):''}<br><a href="#" onclick="event.preventDefault();smackText('${f.trip_id}')">Message text ⧉</a></div></div>`);
      return;
    }
    rows.push(`<div class="tdac">🚗<div style="flex:1"><b>Book Smackone</b> — ${esc(f.flight_no||'flight')} departs ${fmtShort(f.fdate)}${d===0?' today':d===1?' tomorrow':' in '+d+' days'}${pick?' · pickup '+pick:''}<br><a href="#" onclick="event.preventDefault();smackText('${f.trip_id}')">Copy WhatsApp text ⧉</a> &nbsp;·&nbsp; <a href="#" onclick="event.preventDefault();smackBooked('${f.trip_id}','${k}','${pick}')">✓ Mark booked</a></div></div>`);
  });
  return rows.join('');
}
window.smackBooked=async function(tid,d,pick){
  await put('trip_items',{trip_id:tid,kind:'transport',title:'Smackone pickup',idate:d,itime:pick||'',notes:'Booked via WhatsApp'});
  toast('Smackone marked as booked');
  rHome();
};
window.smackUnbook=async function(iid){
  await del('trip_items',iid);
  toast('Smackone marked as unbooked');
  rHome();
};

/* ---------- birthdays ---------- */
let BDAYS=null;
function nextOcc(m,dd){
  const t=today();let y=t.getFullYear();
  let d=new Date(y,m-1,dd); if(d<t) d=new Date(y+1,m-1,dd);
  return d;
}
async function fillBdays(card){
  if(!card) return;
  try{
    if(!BDAYS){ const r=await sb.from('birthdays').select('*'); BDAYS=r.data||[]; }
    const rows=BDAYS.map(b=>({b,d:nextOcc(b.bmonth,b.bday)}))
      .map(x=>({...x,days:Math.round((x.d-today())/864e5)}))
      .filter(x=>x.days<=7).sort((a,b)=>a.days-b.days);
    if(!rows.length) return;
    const html=rows.map(x=>`<div class="tdac">🎂<div style="flex:1"><b>${esc(x.b.name)}</b>${x.days===0?" — birthday today!":` — birthday ${x.d.toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long'})} (${x.days===1?'tomorrow':'in '+x.days+' days'})`}</div></div>`).join('');
    card.insertAdjacentHTML('beforeend',html);
  }catch(e){}
}

/* ---------- home enhancement ---------- */
const _rHome = rHome;
window.rHome = function(){
  _rHome();
  const v=document.getElementById('v-home');
  const c=v.querySelector('.cal'); if(c) c.remove();               // calendar lives behind the icon now
  if(homeQuery.trim()) return;
  const first=document.getElementById('homeMain')||v.querySelector('.sect');
  const dash=document.createElement('div');
  dash.id='dashRow';
  const zs=zoneList();
  dash.innerHTML=`<div class="clocks">${zs.map((z,i)=>`<div class="clk${z.tz==='Asia/Bangkok'?' clk-bkk':''}" onclick="pickClock(${i})">${dialSVG('ck'+(i+1))}<div class="lbl">${esc(z.label)}</div>${z.who?`<div class="who">${esc(z.who)}</div>`:''}<div class="dig" id="ck${i+1}d"></div><div class="cwx" id="ck${i+1}w" onclick="event.stopPropagation();weatherCard(${i})"></div></div>`).join('')}</div><div class="wline" id="wline"></div>`;
  v.insertBefore(dash, first);
  const todayCard=first?first.nextElementSibling&&first.nextElementSibling.classList&&v.querySelectorAll('.sect')[1]?v.querySelectorAll('.sect')[1].nextElementSibling:null:null;
  const cards=v.querySelectorAll('.card');
  if(cards[0]){
    const tk2=iso(today());
    const act=D.trips.find(x=>x.start_date&&String(x.start_date).slice(0,10)<=tk2&&tk2<=String(x.end_date||x.start_date).slice(0,10));
    cards[0].insertAdjacentHTML('afterbegin', `<div class="today-loc">📍 <b>${esc(act&&act.dest?act.dest:'Ko Samui')}</b>${act?'':'<span class="mini"> — home</span>'}<span id="todWx"></span></div>`);
    fillTodayWx(act);
    const t=tdacRows(); if(t) cards[0].insertAdjacentHTML('beforeend', t);
    const sm=smackRows(); if(sm) cards[0].insertAdjacentHTML('beforeend', sm);
    fillBdays(cards[0]);
    (D.events||[]).forEach(ev=>{ if(String(ev.edate||'').slice(0,10)===tk2) cards[0].insertAdjacentHTML('beforeend', `<div class="tdac">${ev.icon||'📌'}<div style="flex:1"><b>${esc(ev.title)}</b>${ev.etime?' — '+esc(ev.etime):''}${ev.notes?`<div class="mini">${esc(ev.notes)}</div>`:''}</div></div>`); });
  }
  tickClocks();
  if(clockTimer) clearInterval(clockTimer);
  clockTimer=setInterval(tickClocks,10000); /* 6 beats/sec — 21,600 vph, same as the 1815 */
  fillWeather();
  fillClockWx();
};

/* ---------- W/M/Y calendar sheet ---------- */
let calView='agenda';
let weekRef=0;
window.calMove=function(n){const b=calRef||today();calRef=new Date(b.getFullYear(),b.getMonth()+n,1);
  if(document.getElementById('calSheet')) renderCalSheet(); else if(cur==='home') rHome();};
function evFor(dstr){
  const out=[];
  D.trips.forEach(t=>{if(t.start_date&&String(t.start_date).slice(0,10)<=dstr&&dstr<=String(t.end_date||t.start_date).slice(0,10))out.push({tm:'',txt:'✈️ '+t.title,tid:t.id});});
  D.flights.forEach(f=>{if(String(f.fdate||'').slice(0,10)===dstr)out.push({tm:f.ftime||'',txt:`🛫 ${f.from_code}→${f.to_code}`,tid:f.trip_id});});
  D.trip_items.forEach(i=>{const _s=String(i.idate||'').slice(0,10),_e=String(i.edate||i.idate||'').slice(0,10);if(_s<=dstr&&dstr<=_e)out.push({tm:_s===dstr?(i.itime||''):(_e===dstr?'out':''),txt:`${kindMeta(i.kind)[1]} ${i.title||''}`,tid:i.trip_id});});
  (D.events||[]).forEach(ev=>{if(String(ev.edate||'').slice(0,10)===dstr)out.push({tm:ev.etime||'',txt:`${ev.icon||'📌'} ${ev.title}`});});
  return out;
}
function agendaHTML(){
  const tk=iso(today());
  if(!BDAYS){ try{ sb.from('birthdays').select('*').then(r=>{ BDAYS=r.data||[]; if(document.getElementById('calSheet')&&calView==='agenda') renderCalSheet(); }); }catch(e){} }
  const evs=[];
  D.trips.forEach(t=>{ if(!t.start_date)return; const a=String(t.start_date).slice(0,10),b=String(t.end_date||t.start_date).slice(0,10);
    if(b>=tk) evs.push({d:a>=tk?a:tk,ic:'✈️',h:t.title,sub:fmtShort(t.start_date)+(t.end_date&&t.end_date!==t.start_date?' — '+fmtShort(t.end_date):''),id:t.id}); });
  D.flights.forEach(f=>{ const k=String(f.fdate||'').slice(0,10);
    if(k>=tk) evs.push({d:k,tm:f.ftime||'',ic:'🛫',h:(f.from_code||'?')+' → '+(f.to_code||'?'),sub:[f.airline,f.flight_no,f.conf].filter(Boolean).join(' · '),id:f.trip_id}); });
  D.trip_items.forEach(i=>{ const k=String(i.idate||'').slice(0,10);
    const k2=String(i.edate||i.idate||'').slice(0,10); if(k2>=tk){ const km=kindMeta(i.kind); evs.push({d:k>=tk?k:tk,tm:i.itime||'',ic:km[1],h:i.title||km[2],sub:[(k2>k?fmtShort(k)+' — '+fmtShort(k2):''),i.ref,i.address].filter(Boolean).join(' · '),id:i.trip_id}); }});
  (D.events||[]).forEach(ev=>{ const k=String(ev.edate||'').slice(0,10);
    if(k>=tk) evs.push({d:k,tm:ev.etime||'',ic:ev.icon||'📌',h:ev.title,sub:[ev.notes].filter(Boolean).join(' · '),id:null}); });
  (BDAYS||[]).forEach(b=>{ const d=nextOcc(b.bmonth,b.bday); evs.push({d:iso(d),ic:'🎂',h:b.name,sub:'Birthday',id:null}); });
  evs.sort((a,b)=>a.d.localeCompare(b.d));
  if(!evs.length) return '<div class="mini" style="text-align:center;margin-top:14px">Nothing coming up.</div>';
  let h='',lm='',ld='';
  evs.forEach(e=>{
    const dd=parseD(e.d), mo=e.d.slice(0,7);
    if(mo!==lm){ h+=`<div class="ag-mo">${dd.toLocaleDateString(undefined,{month:'long',year:'numeric'})}</div>`; lm=mo; ld=''; }
    const lab=e.d!==ld?`<span>${dd.toLocaleDateString(undefined,{weekday:'short'})}</span><b>${dd.getDate()}</b>`:'';
    ld=e.d;
    h+=`<div class="ag-row" ${e.id?`style="cursor:pointer" onclick="openTrip('${e.id}')"`:''}><div class="ag-d ${e.d===tk?'today':''}">${lab}</div><div class="ag-tm">${e.tm?esc(e.tm):''}</div><div class="ag-main"><div class="agh">${e.ic} ${esc(e.h)}</div>${e.sub?`<div class="ags">${esc(e.sub)}</div>`:''}</div>${e.id?'<div class="chev">›</div>':''}</div>`;
  });
  return h;
}
function renderCalSheet(){
  const box=document.getElementById('calSheet'); if(!box) return;
  let h=`<div class="seg">${[['agenda','Agenda'],['week','Week'],['month','Month'],['planner','Planner']].map(s=>`<button class="${calView===s[0]?'on':''}" onclick="window.__calSeg('${s[0]}')">${s[1]}</button>`).join('')}</div>`;
  if(calView==='month'){ h+=calendarHTML(); h+=(window.__monthList?window.__monthList():''); }
  else if(calView==='planner'){ h+='<div id="tlHost" style="height:72vh;position:relative;margin-top:6px;border:1px solid #e4e9ee;border-radius:12px;overflow:hidden;background:#fff"></div>'; setTimeout(function(){ if(window.__tlInline&&document.getElementById('tlHost')) window.__tlInline(document.getElementById('tlHost')); },30); }
  else if(calView==='week'){
    const t=today(); const mon=new Date(t); mon.setDate(t.getDate()-((t.getDay()+6)%7)+weekRef*7);
    const sun=new Date(mon); sun.setDate(mon.getDate()+6);
    h+=`<div class="cal-head" style="margin-bottom:6px"><button class="cal-nav" onclick="window.__wk(-1)">‹</button><b>${mon.getDate()} ${mon.toLocaleDateString(undefined,{month:'short'})} — ${sun.getDate()} ${sun.toLocaleDateString(undefined,{month:'short',year:'numeric'})}</b><button class="cal-nav" onclick="window.__wk(1)">›</button></div>`;
    if(weekRef!==0) h+=`<div class="mini" style="text-align:center;margin-bottom:4px;cursor:pointer;color:var(--teal);font-weight:700" onclick="window.__wk(null)">↩ Back to this week</div>`;
    for(let i=0;i<7;i++){const d=new Date(mon);d.setDate(mon.getDate()+i);const k=iso(d);const evs=evFor(k).sort((a,b)=>String(a.tm||'~').localeCompare(String(b.tm||'~')));
      h+=`<div class="wk-day" style="cursor:pointer" onclick="openDay('${k}')"><div class="wk-d ${k===iso(t)?'today':''}"><span>${d.toLocaleDateString(undefined,{weekday:'short'})}</span><b>${d.getDate()}</b></div>
        <div class="wk-ev">${evs.length?evs.map(e=>`<span class="mini"${e.tid?` style="cursor:pointer;text-decoration:underline dotted rgba(43,74,122,.4)" onclick="event.stopPropagation();openTrip('${e.tid}')"`:''}>${e.tm?`<b style="color:var(--ink2)">${esc(e.tm)}</b> `:''}${esc(e.txt)}</span>`).join(''):'<span class="mini" style="color:var(--muted2)">—</span>'}</div></div>`;}
  }
  else { h+=agendaHTML(); }
  box.innerHTML=h;
}
window.renderCalSheet_=renderCalSheet;
window.__calSeg=function(v){calView=v;renderCalSheet();};
window.__wk=function(n){weekRef=(n===null?0:weekRef+n);renderCalSheet();};
document.getElementById('hdrNotes').onclick=function(){openNotes();};
let f1View='race', f1RaceIdx=null, f1Driver=null;
function f1Data(){ return (D.f1_meta&&D.f1_meta[0]&&D.f1_meta[0].data)||null; }
window.f1Data=f1Data;window.f1DocSrc=f1DocSrc;window.renderF1Sheet=renderF1Sheet;
function renderF1Sheet(){
  const box=document.getElementById('f1Sheet'); if(!box) return;
  const rec=f1Data();
  if(!rec){ box.innerHTML='<div class="mini" style="padding:8px">No F1 data yet — check back on a race week.</div>'; return; }
  if(f1RaceIdx===null){ const i=(rec.races||[]).findIndex(r=>r.status==='current'); f1RaceIdx=i<0?0:i; }
  let h=`<div class="seg">${[['race','Race'],['drivers','Drivers'],['teams','Teams'],['compare','Compare']].map(s=>`<button class="${f1View===s[0]?'on':''}" onclick="window.__f1Seg('${s[0]}')">${s[1]}</button>`).join('')}</div>`;
  if(f1View==='race') h+=f1RaceView(rec);
  else if(f1View==='teams') h+=f1TeamsView(rec);
  else if(f1View==='compare') h+=window.f1CompareView(rec);
  else h+=(f1Driver?f1DriverDrill(rec):f1DriversView(rec));
  box.innerHTML=h;
}
var f1DocCache={};
function f1DocSrc(id){
  if(!id) return null;
  var v=f1DocCache[id];
  if(typeof v==='string'&&v.indexOf('data:')===0) return v;
  if(v==='loading'||v==='none') return null;
  f1DocCache[id]='loading';
  sb.from('documents').select('mime,content').eq('id',id).single().then(function(res){
    var dd=res&&res.data;
    f1DocCache[id]=(dd&&dd.content)?('data:'+(dd.mime||'image/png')+';base64,'+dd.content):'none';
    try{renderF1Sheet();}catch(_e){}try{if(window.renderHomePager&&typeof cur!=='undefined'&&cur==='home')renderHomePager();}catch(_e){}
  }).catch(function(){ f1DocCache[id]='none'; try{renderF1Sheet();}catch(_e){}try{if(window.renderHomePager&&typeof cur!=='undefined'&&cur==='home')renderHomePager();}catch(_e){} });
  return null;
}
function f1RaceView(rec){
  const races=rec.races||[]; if(!races.length) return '<div class="mini">No race data.</div>';
  if(f1RaceIdx<0)f1RaceIdx=0; if(f1RaceIdx>races.length-1)f1RaceIdx=races.length-1;
  const r=races[f1RaceIdx];
  const canPrev=f1RaceIdx>0, canNext=f1RaceIdx<races.length-1;
  const badge=r.status==='done'?'Result':(r.status==='current'?'This weekend':'Upcoming');
  let h=`<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px"><button class="cal-nav" style="${canPrev?'':'opacity:.25'}" ${canPrev?'':'disabled'} onclick="window.__f1Race(-1)">‹</button><div style="text-align:center;flex:1"><div style="font-weight:800">${esc(r.name)}</div><div class="mini">R${r.round} · ${esc(r.dates||'')} · <b style="color:var(--teal)">${badge}</b></div></div><button class="cal-nav" style="${canNext?'':'opacity:.25'}" ${canNext?'':'disabled'} onclick="window.__f1Race(1)">›</button></div>`;
  const _mapSrc=f1DocSrc(r.map), _heroSrc=f1DocSrc(r.hero), _st=r.stats||null;
  if(_heroSrc){ h+=`<div style="position:relative;height:152px;border-radius:12px;overflow:hidden;margin-bottom:10px"><img src="${_heroSrc}" alt="${esc(r.name||'')}" style="width:100%;height:100%;object-fit:cover"><div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.04),rgba(0,0,0,.66))"></div><div style="position:absolute;left:12px;right:12px;bottom:8px;color:#fff"><div style="font-weight:800;font-size:18px;text-shadow:0 1px 4px rgba(0,0,0,.6)">${esc(r.name||'')}</div><div style="font-size:11px;opacity:.92;text-shadow:0 1px 3px rgba(0,0,0,.6)">${esc(r.circuit||'')}</div></div></div>`; }
  if(_mapSrc){ h+=`<div style="border-radius:12px;border:1px solid #e2e8f2;background:#fff;padding:8px;margin-bottom:8px;text-align:center"><img src="${_mapSrc}" alt="${esc(r.circuit||'')} circuit map" style="max-width:100%;max-height:200px;object-fit:contain"></div>`; } else if(!_heroSrc){ h+=`<div style="height:118px;border-radius:12px;border:1px dashed #b9c4d6;background:#f3f6fb;display:flex;align-items:center;justify-content:center;margin-bottom:10px"><div class="mini" style="text-align:center;color:var(--muted2)">🏁 ${esc(r.circuit||'')}<br>circuit map</div></div>`; }
  if(_st){ const _sr=[['Length',_st.length],['Laps',_st.laps],['First GP',_st.firstGP],['Race dist',_st.raceDist]].filter(x=>x[1]); h+=`<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px">`+_sr.map(s=>`<div style="flex:1 1 44%;background:#f3f6fb;border-radius:9px;padding:6px 9px"><div class="mini" style="color:var(--muted2);font-size:9px;text-transform:uppercase;letter-spacing:.4px">${s[0]}</div><div style="font-weight:800;font-size:13px">${esc(s[1])}</div></div>`).join('')+`</div>`; if(_st.lapRecord) h+=`<div class="mini" style="margin-bottom:8px;color:var(--muted2)">⏱ Lap record ${esc(_st.lapRecord)}</div>`; }
  if(_mapSrc||_heroSrc) h+=`<div class="mini" style="text-align:right;font-size:9px;color:var(--muted2);margin:-2px 2px 8px">Map & photo: formula1.com</div>`;
  if(r.status==='done'&&r.results){
    if(r.results.sprint){ h+=`<div class="sect">Sprint</div><div class="card">`+r.results.sprint.map(f1ResRow).join('')+`</div>`; }
    h+=`<div class="sect">Race result</div><div class="card">`+(r.results.race||[]).map(f1ResRow).join('')+`</div>`;
    h+=window.f1SnapBlock(rec,r);
  } else {
    if(r.sprint) h+=`<div class="mini" style="font-weight:700;color:var(--teal);margin:-2px 0 6px">Sprint weekend</div>`;
    if((r.schedule||[]).length){ h+=`<div class="card">`; let last=''; (r.schedule||[]).forEach(s=>{ if(s.day!==last){h+=`<div class="mini" style="font-weight:800;color:var(--ink2);margin:8px 0 2px">${esc(s.day)}</div>`;last=s.day;} const hl=s.hl?'color:var(--teal);font-weight:800':''; const dim=(s.type==='pre'||s.type==='post'||s.type==='show')?'opacity:.7':''; h+=`<div class="it-line" style="${dim}"><div class="it-main"><b style="${hl}">${esc(s.label)}</b></div><div class="ag-tm" style="${hl}">${esc(s.time||'')}</div></div>`; }); h+=`</div>`; h+=`<div class="mini" style="margin-top:8px">📺 ${esc(rec.broadcaster||'')}</div>`; }
    if(r.note) h+=`<div class="mini" style="margin-top:6px;color:var(--muted2)">${esc(r.note)}</div>`;
  }
  return h;
}
function f1ResRow(x){ const m=x.pos===1?'🥇':(x.pos===2?'🥈':(x.pos===3?'🥉':'')); return `<div class="it-line"><span class="it-ic" style="width:24px;text-align:center;font-weight:800;color:var(--ink2)">${m||x.pos}</span><div class="it-main"><b>${esc(x.driver)}</b><span class="mini">${esc(x.team||'')}</span></div></div>`; }
function f1DriversView(rec){
  let h=`<div class="sect">Drivers' Championship</div><div class="card">`;
  h+=(rec.standings||[]).map((d,i)=>`<div class="it-line" style="cursor:pointer" onclick="window.__f1Driver(${i})"><span class="it-ic" style="width:20px;text-align:center;font-weight:800;color:var(--ink2)">${d.pos}</span><span style="width:4px;height:22px;border-radius:2px;background:${d.color||'#888'};flex:0 0 auto;margin:0 8px"></span><div class="it-main"><b>${esc(d.driver)}</b><span class="mini">${esc(d.team||'')}</span></div><div class="ag-tm" style="font-weight:800">${d.pts}</div><div class="chev">›</div></div>`).join('');
  h+=`</div>`;
  if(rec.standings_note) h+=`<div class="mini" style="margin-top:8px;color:var(--muted2)">${esc(rec.standings_note)}</div>`;
  return h;
}
function f1DriverDrill(rec){
  const d=(rec.standings||[]).find(x=>x.driver===f1Driver)||{}; const p=(rec.drivers_profile||{})[f1Driver]||{};
  const color=d.color||p.color||'#888'; const num=d.num||p.num||'';
  const ini=((f1Driver||'').split(' ').map(w=>w[0]||'').join('')).slice(0,2).toUpperCase();
  let h=`<div class="mini" style="cursor:pointer;color:var(--teal);font-weight:700;margin-bottom:8px" onclick="window.__f1Back()">‹ Drivers</div>`;
  h+=`<div class="card"><div style="display:flex;align-items:center;gap:12px">${(function(){var _ps=f1DocSrc(p.photo);return _ps?`<div style="width:64px;height:64px;border-radius:50%;overflow:hidden;flex:0 0 auto;border:2px solid ${color};background:${color}"><img src="${_ps}" alt="${esc(f1Driver)}" title="${esc(f1Driver)}" style="width:100%;height:100%;object-fit:cover"></div>`:`<div style="width:64px;height:64px;border-radius:50%;background:${color};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:20px;flex:0 0 auto">${esc(ini)}</div>`;})()}<div><div style="font-weight:800;font-size:17px">${esc(f1Driver)}</div><div class="mini">${esc(d.team||p.team||'')}${num?` · #${esc(num)}`:''}</div><div class="mini" style="margin-top:2px">P${d.pos||'—'} · <b>${d.pts!=null?d.pts:'—'} pts</b></div></div></div>`;
  const stats=[]; if(p.wins!=null)stats.push(['Wins',p.wins]); if(p.poles!=null)stats.push(['Poles',p.poles]); if(p.podiums!=null)stats.push(['Podiums',p.podiums]);
  if(stats.length) h+=`<div style="display:flex;gap:8px;margin-top:10px">`+stats.map(s=>`<div style="flex:1;text-align:center;background:#f3f6fb;border-radius:10px;padding:8px 4px"><div style="font-weight:800;font-size:16px">${s[1]}</div><div class="mini">${s[0]}</div></div>`).join('')+`</div>`;
  h+=`</div>`;
  if(Array.isArray(p.points)&&p.points.length){ const _pts=p.points,_lab=(rec.points_rounds||[]),_mx=Math.max.apply(null,_pts.concat([1])),_n=_pts.length,_W=300,_H=94,_pad=8; const _x=i=>_pad+(_n<=1?0:i*(_W-2*_pad)/(_n-1)); const _y=v=>_H-16-(v/_mx)*(_H-2*_pad-8); const _d=_pts.map((v,i)=>`${i?'L':'M'}${_x(i).toFixed(1)},${_y(v).toFixed(1)}`).join(' '); const _area=`M${_x(0).toFixed(1)},${(_H-16).toFixed(1)} `+_pts.map((v,i)=>`L${_x(i).toFixed(1)},${_y(v).toFixed(1)}`).join(' ')+` L${_x(_n-1).toFixed(1)},${(_H-16).toFixed(1)} Z`; const _dots=_pts.map((v,i)=>`<circle cx="${_x(i).toFixed(1)}" cy="${_y(v).toFixed(1)}" r="2.1" fill="${color}"/>`).join(''); const _labs=_lab.map((l,i)=>`<text x="${_x(i).toFixed(1)}" y="${_H-3}" font-size="7" fill="#9aa6b8" text-anchor="middle">${esc(l)}</text>`).join(''); h+=`<div class="sect">Season points by round</div><div class="card"><svg viewBox="0 0 ${_W} ${_H}" style="width:100%;height:auto;display:block"><path d="${_area}" fill="${color}" opacity="0.12"/><path d="${_d}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>${_dots}${_labs}</svg><div class="mini" style="text-align:right;margin-top:2px">${_pts[_n-1]} pts · ${_n} rounds</div></div>`; }
  h+=`<div class="mini" style="margin-top:8px;text-align:center;color:var(--muted2)">${p.points?'📊 Round-by-round · formula1.com · ':''}Photo: ${esc(p.photo_credit||'press')}</div>`;
  return h;
}
function f1TeamsView(rec){
  let h=`<div class="sect">Constructors' Championship</div><div class="card">`;
  h+=(rec.constructors||[]).map(c=>`<div class="it-line"><span class="it-ic" style="width:20px;text-align:center;font-weight:800;color:var(--ink2)">${c.pos}</span><span style="width:4px;height:22px;border-radius:2px;background:${c.color||'#888'};flex:0 0 auto;margin:0 8px"></span><div class="it-main"><b>${esc(c.team)}</b></div><div class="ag-tm" style="font-weight:800">${c.pts}</div></div>`).join('');
  h+=`</div>`;
  if(rec.constructors_note) h+=`<div class="mini" style="margin-top:8px;color:var(--muted2)">${esc(rec.constructors_note)}</div>`;
  return h;
}
window.__f1Seg=function(v){f1View=v;f1Driver=null;renderF1Sheet();};
window.__f1Race=function(dd){ const rec=f1Data(); const n=(rec&&rec.races)?rec.races.length:1; f1RaceIdx=Math.max(0,Math.min(n-1,(f1RaceIdx||0)+dd)); renderF1Sheet();};
window.__f1Driver=function(i){ const rec=f1Data(); const d=rec&&rec.standings&&rec.standings[i]; f1Driver=d?d.driver:null; f1View='drivers'; renderF1Sheet();};
window.__f1Back=function(){ f1Driver=null; renderF1Sheet();};
document.getElementById('hdrF1').onclick=function(){ openSheet(`<h3>Formula 1</h3><div id="f1Sheet"></div>`); renderF1Sheet(); try{ sb.from('f1_meta').select('*').then(function(r){ if(!r.error&&r.data){ D.f1_meta=r.data; renderF1Sheet(); } }); }catch(e){} };
document.getElementById('hdrCal').onclick=function(){
  openSheet(`<h3>Calendar</h3><div id="calSheet"></div>`);
  renderCalSheet();
};

/* re-render home to apply */
if (typeof cur!=='undefined' && cur==='home' && !document.getElementById('auth').classList.contains('hide')===false) { try{ rHome(); }catch(e){} }
})();

/* ===== Documents (tickets & PDFs) on trips ===== */
(function(){
const _oT = window.openTrip;
window.openTrip = function(id){
  _oT(id);
  const sheet = document.getElementById('sheet');
  if(!sheet) return;
  const old = document.getElementById('docsBlk'); if(old) old.remove();
  const blk = document.createElement('div');
  blk.id = 'docsBlk';
  blk.innerHTML = '<label class="f" style="margin-top:16px">Documents</label><div class="mini">Loading…</div>';
  const divs = sheet.querySelectorAll('.divider');
  const anchor = divs.length ? divs[divs.length-1] : null;
  if(anchor) sheet.insertBefore(blk, anchor); else sheet.appendChild(blk);
  sb.from('documents').select('id,title,mime').eq('trip_id', id).order('title')
    .then(function(res){
      const b = document.getElementById('docsBlk'); if(!b) return;
      if(res.error){ b.querySelector('.mini').textContent = 'Documents unavailable offline.'; return; }
      const data = res.data || [];
      b.innerHTML = '<label class="f" style="margin-top:16px">Documents</label>' +
        data.map(function(d){return `<div class="list-item" onclick="openDocById('${d.id}')"><div class="li-main"><div class="h">📄 ${esc(d.title)}</div><div class="sub">${d.mime==='application/pdf'?'PDF':esc(d.mime||'')} · tap to open</div></div><div class="chev">›</div></div>`;}).join('') +
        `<button class="btn ghost sm" style="margin-top:8px" onclick="addDoc('${id}')">📎 Add document / photo</button>`;
    });
};
window.addDoc=function(tid){
  let inp=document.getElementById('docInp');
  if(!inp){ inp=document.createElement('input'); inp.type='file'; inp.id='docInp'; inp.accept='image/*,application/pdf'; inp.multiple=true; inp.style.display='none'; document.body.appendChild(inp); }
  inp.onchange=async function(){
    const files=Array.from(inp.files||[]); if(!files.length) return;
    toast('Uploading…');
    for(const f of files){
      const b64=await new Promise(function(res,rej){const r=new FileReader();r.onload=function(){res(String(r.result).split(',')[1]);};r.onerror=rej;r.readAsDataURL(f);});
      const row={trip_id:tid,title:f.name.replace(/\.[^.]+$/,''),mime:f.type||'application/octet-stream',content:b64};
      if(window.USER&&USER.id) row.owner=USER.id;
      const ins=await sb.from('documents').insert(row);
      if(ins.error){ toast('Upload failed: '+ins.error.message); return; }
    }
    toast(files.length+' document'+(files.length>1?'s':'')+' added');
    inp.value=''; openTrip(tid);
  };
  inp.value=''; inp.click();
};
window.openDocById = async function(id){
  toast('Opening…');
  const res = await sb.from('documents').select('title,mime,content').eq('id',id).single();
  if(res.error || !res.data){ toast('Could not load document'); return; }
  const d = res.data;
  try{
    const s = atob(d.content); const a = new Uint8Array(s.length);
    for(let i=0;i<s.length;i++) a[i]=s.charCodeAt(i);
    const blob = new Blob([a],{type:d.mime||'application/pdf'});
    const u = URL.createObjectURL(blob);
    const w = window.open(u,'_blank');
    if(!w){ const l=document.createElement('a'); l.href=u; l.download=(d.title||'document')+((d.mime||'').includes('pdf')?'.pdf':''); document.body.appendChild(l); l.click(); l.remove(); }
    setTimeout(function(){ URL.revokeObjectURL(u); }, 60000);
  }catch(e){ toast('Could not open document'); }
};
})();

/* ===== Day drill-in: tap any calendar day to see and open its events ===== */
(function(){
function dayEvents(dstr){
  const out=[];
  D.trips.forEach(function(t){ if(t.start_date&&String(t.start_date).slice(0,10)<=dstr&&dstr<=String(t.end_date||t.start_date).slice(0,10)) out.push({ic:'✈️',h:t.title,sub:[t.dest,(t.start_date?fmtShort(t.start_date):'')+(t.end_date&&t.end_date!==t.start_date?' — '+fmtShort(t.end_date):'')].filter(Boolean).join(' · '),id:t.id}); });
  D.flights.forEach(function(f){ if(String(f.fdate||'').slice(0,10)===dstr) out.push({ic:'🛫',h:(f.from_code||'?')+' → '+(f.to_code||'?')+(f.ftime?' · '+f.ftime:''),sub:[f.airline,f.flight_no,f.conf].filter(Boolean).join(' · '),id:f.trip_id}); });
  D.trip_items.forEach(function(i){ var _s=String(i.idate||'').slice(0,10),_e=String(i.edate||i.idate||'').slice(0,10); if(_s<=dstr&&dstr<=_e){ const km=kindMeta(i.kind); var _t=_s===dstr?(i.itime||''):(_e===dstr?('out'+(i.etime?' '+i.etime:'')):'stay'); out.push({ic:km[1],h:i.title||km[2],sub:[_t,i.ref,i.address].filter(Boolean).join(' · '),id:i.trip_id}); } });
  (D.events||[]).forEach(function(ev){ if(String(ev.edate||'').slice(0,10)===dstr) out.push({ic:ev.icon||'📌',h:ev.title,sub:[ev.etime,ev.notes].filter(Boolean).join(' · '),id:null}); });
  return out;
}
window.openDay=function(dstr){
  const d=new Date(dstr+'T12:00:00');
  const evs=dayEvents(dstr);
  const rows=evs.length?evs.map(function(e){
    return `<div class="list-item" ${e.id?`style="cursor:pointer" onclick="openTrip('${e.id}')"`:''}><div class="li-main"><div class="h">${e.ic} ${esc(e.h)}</div>${e.sub?`<div class="sub">${esc(e.sub)}</div>`:''}</div>${e.id?'<div class="chev">›</div>':''}</div>`;
  }).join(''):`<div class="mini" style="margin-top:10px">Nothing on this day.</div>`;
  openSheet(`<h3>${d.toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</h3>${rows}`);
};
})();

/* ===== Month agenda: list what the dots mean, tappable ===== */
(function(){
window.__monthList=function(){
  const base=calRef||today(); const y=base.getFullYear(),m=base.getMonth();
  const mm=String(m+1).padStart(2,'0'); const ym=y+'-'+mm;
  const lastDay=new Date(y,m+1,0).getDate();
  const first=ym+'-01', last=ym+'-'+String(lastDay).padStart(2,'0');
  const rows=[];
  D.trips.forEach(function(t){ if(!t.start_date)return;
    const a=String(t.start_date).slice(0,10), b=String(t.end_date||t.start_date).slice(0,10);
    if(a<=last&&b>=first){
      const d1=a.slice(0,7)===ym?+a.slice(8,10):1, d2=b.slice(0,7)===ym?+b.slice(8,10):lastDay;
      rows.push({d:a<first?first:a,lab:d1+(b!==a?'–'+d2:''),ic:'✈️',h:t.title,id:t.id});
    }});
  D.flights.forEach(function(f){ const k=String(f.fdate||'').slice(0,10);
    if(k>=first&&k<=last) rows.push({d:k,lab:String(+k.slice(8,10)),ic:'🛫',h:(f.from_code||'?')+' → '+(f.to_code||'?')+(f.ftime?' · '+f.ftime:''),id:f.trip_id}); });
  D.trip_items.forEach(function(i){ const k=String(i.idate||'').slice(0,10);
    const k2=String(i.edate||i.idate||'').slice(0,10); if(k<=last&&k2>=first){ const km=kindMeta(i.kind); const kd=k<first?first:k; const ke=k2<=last?k2:last; rows.push({d:kd,lab:String(+kd.slice(8,10))+(ke>kd?'–'+String(+ke.slice(8,10)):''),ic:km[1],h:i.title||km[2],id:i.trip_id}); }});
  (D.events||[]).forEach(function(ev){ const k=String(ev.edate||'').slice(0,10);
    if(k>=first&&k<=last) rows.push({d:k,lab:String(+k.slice(8,10)),ic:ev.icon||'📌',h:ev.title,id:null}); });
  if(!rows.length) return '<div class="mini" style="margin-top:12px;text-align:center">Nothing this month.</div>';
  rows.sort(function(a,b){return a.d.localeCompare(b.d);});
  const mon=base.toLocaleDateString(undefined,{month:'short'});
  return '<div class="sect" style="margin-top:14px">This month</div>'+rows.map(function(e){
    return `<div class="list-item" ${e.id?`style="cursor:pointer" onclick="openTrip('${e.id}')"`:''}><div class="li-main"><div class="h">${e.ic} ${esc(e.h)}</div><div class="sub">${e.lab} ${mon}</div></div>${e.id?'<div class="chev">›</div>':''}</div>`;
  }).join('');
};
})();

/* ===== Wallet: cards, memberships, show-me numbers ===== */
(function(){
window.openCards=async function(){
  openSheet(`<h3>Wallet</h3><div id="walletBox"><div class="mini">Loading…</div></div>`);
  try{
    const [cardsRes, docsRes] = await Promise.all([
      sb.from('wallet_cards').select('*').order('sort'),
      sb.from('documents').select('id,title').eq('is_card',true).order('title')
    ]);
    let h='';
    const cards=(cardsRes&&cardsRes.data)||[];
    if(cards.length){
      h+=cards.map(function(c){
        const num=String(c.number||'');
        return `<div class="wcard" onclick="copy('${num.replace(/'/g,'')}')"><div class="wc-t">${c.icon||'💳'} ${esc(c.title)}</div>${c.subtitle?`<div class="wc-s">${esc(c.subtitle)}</div>`:''}<div class="wc-n">${esc(num)}</div><div class="wc-c">tap to copy</div></div>`;
      }).join('');
    }
    const docs=(docsRes&&docsRes.data)||[];
    if(docs.length){
      h+='<label class="f" style="margin-top:14px">Cards to show (PDF)</label>'+docs.map(function(d){
        return `<div class="list-item" style="cursor:pointer" onclick="openDocById('${d.id}')"><div class="li-main"><div class="h">📄 ${esc(d.title)}</div><div class="sub">tap to show full screen</div></div><div class="chev">›</div></div>`;
      }).join('');
    }
    const b=document.getElementById('walletBox'); if(b) b.innerHTML=h||'<div class="mini">Nothing in the wallet yet.</div>';
  }catch(e){ const b=document.getElementById('walletBox'); if(b) b.innerHTML='<div class="mini">Wallet unavailable offline.</div>'; }
};
/* documents attached to vault entries (e.g. insurance) */
const _vI=window.viewInfo;
window.viewInfo=function(id){
  _vI(id);
  const sheet=document.getElementById('sheet'); if(!sheet) return;
  const old=document.getElementById('vDocsBlk'); if(old) old.remove();
  const blk=document.createElement('div');
  blk.id='vDocsBlk';
  sheet.appendChild(blk);
  sb.from('documents').select('id,title,mime').eq('vault_item_id', id).order('title')
    .then(function(res){
      const b=document.getElementById('vDocsBlk'); if(!b) return;
      const data=(res&&res.data)||[];
      if(!data.length){ b.remove(); return; }
      b.innerHTML='<label class="f" style="margin-top:16px">Documents</label>'+
        data.map(function(d){return `<div class="list-item" style="cursor:pointer" onclick="openDocById('${d.id}')"><div class="li-main"><div class="h">📄 ${esc(d.title)}</div><div class="sub">${d.mime==='application/pdf'?'PDF':esc(d.mime||'')} · tap to open</div></div><div class="chev">›</div></div>`;}).join('');
    });
};
})();

/* ===== Smackone pickup text (WhatsApp copy) ===== */
(function(){
function dfmt(d){ const p=parseD(d); return String(p.getDate()).padStart(2,'0')+'/'+String(p.getMonth()+1).padStart(2,'0')+'/'+p.getFullYear(); }
function dow(d){ return parseD(d).toLocaleDateString('en-GB',{weekday:'long'}); }
window.smackText=function(id){
  const fls=D.flights.filter(f=>f.trip_id===id).sort(function(a,b){return (a.fdate||'').localeCompare(b.fdate||'');});
  const out=fls.find(f=>(f.from_code||'').toUpperCase()==='USM');
  if(!out||!out.fdate){ toast('No flight from Samui on this trip'); return; }
  const pick=smackPick(out);
  let msg=`Hello Smackone — please pick us up from the villa on ${dow(out.fdate)} ${dfmt(out.fdate)}${pick?' at '+pick:''} for flight ${out.flight_no||''} at ${out.ftime||''}.`;
  const ret=fls.find(f=>(f.to_code||'').toUpperCase()==='USM'&&f!==out);
  if(ret&&ret.fdate){
    const m=(ret.notes||'').match(/arr[^0-9]*(\d{1,2}:\d{2})/i)||(ret.notes||'').match(/(\d{1,2}:\d{2})/);
    msg+=` And please collect us from Samui airport on ${dow(ret.fdate)} ${dfmt(ret.fdate)} — flight ${ret.flight_no||''}${m?` arriving ${m[1]}`:(ret.ftime?` departing ${ret.ftime} (I will confirm the arrival time)`:` (I will confirm the arrival time)`)} — back to the villa.`;
  } else {
    msg+=` (I will let you know the return later.)`;
  }
  msg+=` Thank you — Adrian.`;
  window.__smackMsg=msg;
  openSheet(`<h3>Smackone message</h3><textarea id="smackMsg" style="width:100%;min-height:150px;font-size:15px;line-height:1.5">${esc(msg)}</textarea>
    <button class="btn primary block" style="margin-top:14px" onclick="copy(document.getElementById('smackMsg').value)">⧉ Copy message</button>
    <a class="btn ghost block" style="margin-top:10px" href="#" onclick="event.preventDefault();window.open('https://wa.me/?text='+encodeURIComponent(document.getElementById('smackMsg').value),'_blank')">📲 Open in WhatsApp</a>
    <div class="mini" style="text-align:center;margin-top:8px">copy &amp; paste into the Smackone chat — or open WhatsApp with it pre-filled</div>`);
};
const _oT2=window.openTrip;
window.openTrip=function(id){
  _oT2(id);
  const sheet=document.getElementById('sheet'); if(!sheet) return;
  const has=D.flights.some(f=>f.trip_id===id&&(f.from_code||'').toUpperCase()==='USM');
  if(!has) return;
  const old=document.getElementById('smackBtn'); if(old) old.remove();
  const btn=document.createElement('button');
  btn.id='smackBtn'; btn.className='btn ghost sm'; btn.style.marginTop='10px';
  btn.textContent='🚗 Smackone pickup — copy WhatsApp text';
  btn.onclick=function(){ smackText(id); };
  const divs=sheet.querySelectorAll('.divider');
  const anchor=divs.length?divs[divs.length-1]:null;
  if(anchor) sheet.insertBefore(btn, anchor); else sheet.appendChild(btn);
};
})();


/* ===== Inbox (email → app via Resend inbound) — v206: attachment chips + Dropbox filing state ===== */
(function(){
function fmtDT(s){ try{ const d=new Date(s); return d.toLocaleString('en-GB',{timeZone:'Asia/Bangkok',day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});}catch(e){ return s||''; } }
function pushState(p, hasTrip){
  if(p){
    if(p.status==='pushed'||p.status==='preexisting') return ' · ✓ in Dropbox';
    if(p.status==='sent') return ' · ⏳ filing to Dropbox…';
    if(p.status==='error') return ' · ⚠️ Dropbox filing failed';
  }
  return hasTrip ? ' · Dropbox filing queued' : ' · not matched to a trip yet';
}
window.openInbox = async function(){
  openSheet('<h3>📥 Inbox</h3><div class="mini">Forward any email to <b>app@inbox.jjaj.info</b> and it lands here (seconds later).</div><div id="inboxList" style="margin-top:10px">Loading…</div>');
  const res = await sb.from('inbox_emails').select('id,from_addr,subject,received_at').order('received_at',{ascending:false}).limit(50);
  const el = document.getElementById('inboxList'); if(!el) return;
  if(res.error){ el.textContent='Inbox unavailable offline.'; return; }
  const data = res.data||[];
  if(!data.length){ el.innerHTML='<div class="mini">Nothing yet. Forward an email to <b>app@inbox.jjaj.info</b> to test.</div>'; return; }
  var counts={};
  try{
    const dres = await sb.from('documents').select('id,email_id').in('email_id', data.map(function(m){return m.id;}));
    ((dres&&dres.data)||[]).forEach(function(d){ if(d.email_id) counts[d.email_id]=(counts[d.email_id]||0)+1; });
  }catch(e){}
  el.innerHTML = data.map(function(m){
    var n=counts[m.id]||0;
    var chip = n ? ' <span style="display:inline-block;background:#eef3ee;color:#3d6b3d;border-radius:10px;padding:0 7px;font-size:11.5px;font-weight:600;vertical-align:1px">📎 '+n+'</span>' : '';
    return '<div class="list-item" onclick="openInboxEmail(\''+m.id+'\')"><div class="li-main"><div class="h">✉️ '+esc(m.subject||'(no subject)')+chip+'</div><div class="sub">'+esc(m.from_addr||'')+' · '+fmtDT(m.received_at)+'</div></div><div class="chev">›</div></div>';
  }).join('');
};
window.openInboxEmail = async function(id){
  const res = await sb.from('inbox_emails').select('*').eq('id',id).single();
  if(res.error||!res.data){ toast('Could not load email'); return; }
  const m = res.data;
  openSheet('<h3>✉️ '+esc(m.subject||'(no subject)')+'</h3><div class="mini">'+esc(m.from_addr||'')+' · '+fmtDT(m.received_at)+'</div><div id="mailDocs" style="margin-top:12px"></div><div style="white-space:pre-wrap;font-size:13.5px;margin-top:10px;max-height:45vh;overflow:auto">'+esc(m.body_text||'')+'</div><button class="btn ghost sm" style="margin-top:10px" onclick="openInbox()">‹ Back to inbox</button>');
  const dr = await sb.from('documents').select('id,title,mime,trip_id').eq('email_id',id);
  const el=document.getElementById('mailDocs');
  if(!el || !dr || !dr.data || !dr.data.length) return;
  var pushes={}, tnames={};
  try{
    const pr = await sb.from('doc_pushes').select('doc_id,status,path').in('doc_id', dr.data.map(function(d){return d.id;}));
    ((pr&&pr.data)||[]).forEach(function(p){ pushes[p.doc_id]=p; });
  }catch(e){}
  try{
    var tids = dr.data.map(function(d){return d.trip_id;}).filter(function(v,i,a){return v&&a.indexOf(v)===i;});
    if(tids.length){ const tr = await sb.from('trips').select('id,title').in('id',tids); ((tr&&tr.data)||[]).forEach(function(t){ tnames[t.id]=t.title; }); }
  }catch(e){}
  el.innerHTML = '<label class="f">Attachments</label>' + dr.data.map(function(d){
    var kind = d.mime==='application/pdf' ? 'PDF' : esc(String(d.mime||'').replace('image/','').toUpperCase());
    var sub = kind+' · tap to open'+pushState(pushes[d.id], !!d.trip_id)+(d.trip_id&&tnames[d.trip_id]?' · '+esc(tnames[d.trip_id]):'');
    return '<div class="list-item" onclick="openDocById(\''+d.id+'\')"><div class="li-main"><div class="h">📄 '+esc(d.title)+'</div><div class="sub">'+sub+'</div></div><div class="chev">›</div></div>';
  }).join('');
};
try{
  const nb=document.getElementById('hdrNotes');
  if(nb && !document.getElementById('hdrInbox')){
    const b=document.createElement('button'); b.className='hdr-ic'; b.id='hdrInbox'; b.setAttribute('aria-label','Inbox');
    b.innerHTML='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 5h18v14H3z"/><path d="M3 7l9 6 9-6"/></svg>';
    b.onclick=function(){openInbox();};
    nb.parentNode.insertBefore(b, nb);
  }
}catch(e){}
})();

/* ===== Home pager: This Week + swipeable trip pages with one-tap resources ===== */
if(typeof window.homePage!=='number') window.homePage=0;
if(typeof window.HOMEDOCS==='undefined') window.HOMEDOCS=null;
window.__homeUpcoming=function(){ const t0=today(); return tripsSorted().filter(function(x){ return x.start_date&&(tripFilter==='all'||((x.category||'personal')===tripFilter))&&parseD(x.end_date||x.start_date)>=t0; }); };
window.loadHomeDocs=function(){
  try{
    const t0=today(), tk=iso(t0);
    const up=window.__homeUpcoming().map(function(t){ return t.id; });
    const act=D.trips.filter(function(t){ return t.start_date&&String(t.start_date).slice(0,10)<=tk&&tk<=String(t.end_date||t.start_date).slice(0,10); }).map(function(t){ return t.id; });
    const ids=Array.from(new Set(up.concat(act)));
    if(!ids.length){ window.HOMEDOCS={}; window.__hdkey=''; return; }
    const key=ids.slice().sort().join(',');
    if(key===window.__hdkey && window.HOMEDOCS){ return; }
    window.__hdkey=key;
    sb.from('documents').select('id,title,mime,trip_id').in('trip_id',ids).order('title').then(function(res){
      const map={};
      if(!res.error && res.data){ res.data.forEach(function(d){ (map[d.trip_id]=map[d.trip_id]||[]).push(d); }); }
      window.HOMEDOCS=map;
      if(typeof cur!=='undefined' && cur==='home') window.renderHomePager();
    });
  }catch(e){ window.HOMEDOCS={}; }
};
window.__f1Home=function(){
  var t0=today(), tk=iso(t0), we=iso(new Date(t0.getTime()+7*864e5));
  var f1rec=(typeof f1Data==='function')?f1Data():null;
  if(!f1rec&&!window.__f1ld&&typeof sb!=='undefined'){window.__f1ld=true;try{sb.from('f1_meta').select('*').then(function(r){if(!r.error&&r.data){D.f1_meta=r.data;}window.__f1ld=false;try{if(typeof cur!=='undefined'&&cur==='home')renderHomePager();}catch(e){}});}catch(e){window.__f1ld=false;}}
  var f1cur=(f1rec&&f1rec.races)?(f1rec.races.find(function(r){return r.status==='current';})||f1rec.races.slice().sort(function(a,b){return String(a.race_date||'9999').localeCompare(String(b.race_date||'9999'));}).find(function(r){return r.status!=='done';})):null;
  var out={rec:f1rec,cur:f1cur,card:'',wk:false};
  if(f1cur){
    var _hero=(typeof f1DocSrc==='function')?f1DocSrc(f1cur.map||f1cur.hero):null;
    var _rc=(f1cur.schedule||[]).filter(function(x){return x.label==='Race';}).pop();
    var _rt=_rc?(esc(_rc.day)+' &middot; '+esc(_rc.time)):esc(f1cur.dates||'');
    var _rd=String(f1cur.race_date||'').slice(0,10);
    out.wk=!!(_rd&&_rd>=tk&&_rd<=we);
    out.card='<div class="it-f1" onclick="try{openSheet(\'<h3>Formula 1</h3><div id=&quot;f1Sheet&quot;></div>\');renderF1Sheet();}catch(e){}" style="position:relative;border-radius:12px;overflow:hidden;margin:2px 0 8px;cursor:pointer;background:#fff">'+(_hero?'<img src="'+_hero+'" style="width:100%;height:130px;object-fit:contain;display:block">':'')+'<div style="'+(_hero?'position:absolute;inset:0;':'')+'display:flex;flex-direction:column;justify-content:flex-end;height:'+(_hero?'130px':'auto')+';padding:8px 10px;color:#fff;background:linear-gradient(180deg,rgba(0,0,0,.15),rgba(0,0,0,.72))"><div style="font-weight:800;font-size:14px">&#127950; '+esc(f1cur.name)+'</div><div style="font-size:11px;opacity:.95">&#127937; Race '+_rt+' &middot; <b>'+(out.wk?'This weekend':'Coming up')+'</b></div></div></div>';
  }
  return out;
};
window.renderHomePager=function(){
  const box=document.getElementById('homePager'); if(!box) return;
  if(typeof window.homePage!=='number'||window.homePage<0) window.homePage=0;
  const HOMEDOCS=window.HOMEDOCS;
  const docMatch=function(docs,ref){ if(!ref)return null; const r=String(ref).toUpperCase(); return docs.find(function(d){ return String(d.title||'').toUpperCase().indexOf(r)>=0; })||null; };
  const up=window.__homeUpcoming();
  const pages=[{type:'week'},{type:'f1'}].concat(up.map(function(t){ return {type:'trip',t:t}; }));
  if(window.homePage>pages.length-1) window.homePage=pages.length-1;
  const pg=pages[window.homePage];
  const label=pg.type==='week'?'This week':(pg.type==='f1'?'Formula 1':esc(pg.t.title));
  let h=`<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px"><button class="cal-nav" style="${window.homePage>0?'':'opacity:.25'}" ${window.homePage>0?'':'disabled'} onclick="window.__hp(-1)">‹</button><div style="text-align:center;flex:1;min-width:0"><div class="sect" style="margin:0">${label}</div>${pg.type==='trip'?`<div class="mini">${fmtD(pg.t.start_date)}${pg.t.end_date&&pg.t.end_date!==pg.t.start_date?' — '+fmtShort(pg.t.end_date):''}</div>`:''}</div><button class="cal-nav" style="${window.homePage<pages.length-1?'':'opacity:.25'}" ${window.homePage<pages.length-1?'':'disabled'} onclick="window.__hp(1)">›</button></div>`;
  if(pages.length>1){ h+=`<div style="display:flex;gap:5px;justify-content:center;margin-bottom:8px">`+pages.map(function(p,i){ return `<span onclick="window.__hpGo(${i})" style="width:7px;height:7px;border-radius:50%;cursor:pointer;background:${i===window.homePage?'var(--teal)':'#cfd8e6'}"></span>`; }).join('')+`</div>`; }
  let inner='';
  if(pg.type==='week'){
    const t0=today(), tk=iso(t0), we=iso(new Date(t0.getTime()+7*864e5));
    const inwk=function(ds){ const k=String(ds||'').slice(0,10); return k>=tk&&k<=we; };
    const active=D.trips.filter(function(t){ return t.start_date&&String(t.start_date).slice(0,10)<=tk&&tk<=String(t.end_date||t.start_date).slice(0,10); });
    const fl=D.flights.filter(function(f){ return inwk(f.fdate); }).sort(function(a,b){ return (a.fdate||'').localeCompare(b.fdate||''); });
    const it=D.trip_items.filter(function(i){ return inwk(i.idate)&&i.kind!=='transport'; }).sort(function(a,b){ return (a.idate||'').localeCompare(b.idate||''); });
    const ev=(D.events||[]).filter(function(e){ return inwk(e.edate); }).sort(function(a,b){ return ((a.edate||'')+' '+(a.etime||'23:59')).localeCompare((b.edate||'')+' '+(b.etime||'23:59')); });
    const F1H=window.__f1Home();
    if(!(active.length||fl.length||it.length||ev.length)){ const nx=nextTrip(); const dd=nx?daysTo(nx.start_date):null; inner=F1H.wk?'':`<div class="mini">Nothing this week.${nx?` Next: <b>${esc(nx.title)}</b>${dd>0?` in ${dd} day${dd===1?'':'s'}`:''} — swipe ›`:''}</div>`; }
    else {
      active.forEach(function(t){ inner+=`<div class="it-line" style="cursor:pointer" onclick="openTrip('${t.id}')"><span class="it-ic">📍</span><div class="it-main"><b>${esc(t.title)}</b><span class="mini">until ${fmtShort(t.end_date||t.start_date)}</span></div></div>`; });
      const mx=[];
      fl.forEach(function(f){ mx.push({k:(f.fdate||'')+' '+(f.ftime||'23:59'),h:`<div style="cursor:pointer" onclick="${docMatch((HOMEDOCS&&HOMEDOCS[f.trip_id])||[],f.conf)?"openDocById('"+docMatch((HOMEDOCS&&HOMEDOCS[f.trip_id])||[],f.conf).id+"')":"flightActions('"+f.id+"')"}">${flightLine(f,true)}${docMatch((HOMEDOCS&&HOMEDOCS[f.trip_id])||[],f.conf)?'<div class="mini" style="color:var(--teal);margin-top:-2px">🎫 tap to view boarding card / ticket</div>':''}</div>`}); });
      it.forEach(function(i){ mx.push({k:(i.idate||'')+' '+(i.itime||'23:59'),h:`<div style="cursor:pointer" onclick="${docMatch((HOMEDOCS&&HOMEDOCS[i.trip_id])||[],i.ref)?"openDocById('"+docMatch((HOMEDOCS&&HOMEDOCS[i.trip_id])||[],i.ref).id+"')":"itemActions('"+i.id+"')"}">${itemLine(i)}${docMatch((HOMEDOCS&&HOMEDOCS[i.trip_id])||[],i.ref)?'<div class="mini" style="color:var(--teal);margin-top:-2px">📄 tap to view document</div>':''}</div>`}); });
      ev.forEach(function(e){ mx.push({k:(e.edate||'')+' '+(e.etime||'23:59'),h:'<div class="it-line"><span class="it-ic">'+(e.icon||(e.source==='f1'?'🏁':'📅'))+'</span><div class="it-main"><b>'+esc(e.title)+'</b><span class="mini">'+fmtShort(e.edate)+(e.etime?' · '+e.etime:'')+'</span></div></div>'}); });
      mx.sort(function(a,b){ return a.k.localeCompare(b.k); });
      inner+=mx.map(function(x){ return x.h; }).join('');
    }
    if(F1H.wk&&F1H.card) inner=F1H.card+inner;
  } else if(pg.type==='f1'){
    var _F=window.__f1Home(); var f1rec=_F.rec, f1cur=_F.cur, f1card=_F.card;
    if(f1card){ inner=f1card+'<div class="mini" style="text-align:center;margin-top:8px;color:var(--teal);cursor:pointer;font-weight:700" onclick="try{openSheet(\'<h3>Formula 1</h3><div id=&quot;f1Sheet&quot;></div>\');renderF1Sheet();}catch(e){}">Full schedule · results · standings ›</div>';
      var nxt=(f1rec&&f1rec.races)?f1rec.races.filter(function(r){return r.status==='upcoming'&&r!==f1cur;}).slice(0,3):[];
      if(nxt.length){ inner+='<div class="sect" style="margin-top:10px">Coming up</div>'+nxt.map(function(r){return '<div class="it-line"><span class="it-ic">🏁</span><div class="it-main"><b>'+esc(r.name)+'</b><span class="mini">R'+r.round+' · '+esc(r.dates||'')+'</span></div></div>';}).join('');}
    } else inner='<div class="mini">Loading race data…</div>';
  } else {
    const t=pg.t;
    const docs=(HOMEDOCS&&HOMEDOCS[t.id])||[];
    const fls=D.flights.filter(function(f){ return f.trip_id===t.id&&!f.archived; }).sort(function(a,b){ return (a.fdate||'').localeCompare(b.fdate||''); });
    const items=D.trip_items.filter(function(i){ return i.trip_id===t.id; }).sort(function(a,b){ return (a.idate||'').localeCompare(b.idate||''); });
    fls.forEach(function(f){ const dm=docMatch(docs,f.conf); const tap=dm?`openDocById('${dm.id}')`:`flightActions('${f.id}')`; inner+=`<div style="cursor:pointer" onclick="${tap}">${flightLine(f,true)}${dm?'<div class="mini" style="color:var(--teal);margin-top:-2px">🎫 tap to view boarding card / ticket</div>':''}</div>`; });
    items.forEach(function(i){ const dm=docMatch(docs,i.ref); const tap=dm?`openDocById('${dm.id}')`:`itemActions('${i.id}')`; inner+=`<div style="cursor:pointer" onclick="${tap}">${itemLine(i)}${dm?'<div class="mini" style="color:var(--teal);margin-top:-2px">📄 tap to view document</div>':''}</div>`; });
    if(HOMEDOCS===null){ inner+=`<div class="mini" style="margin-top:8px">Loading documents…</div>`; }
    else if(docs.length){ inner+=`<div class="mini" style="font-weight:800;color:var(--ink2);margin:10px 0 2px">Documents · tap to open</div>`; inner+=docs.map(function(d){ return `<div class="list-item" onclick="openDocById('${d.id}')"><div class="li-main"><div class="h">${d.mime==='application/pdf'?'📄':'🖼'} ${esc(d.title)}</div><div class="sub">${d.mime==='application/pdf'?'PDF':esc(d.mime||'')} · tap to open</div></div><div class="chev">›</div></div>`; }).join(''); }
    if(!fls.length&&!items.length&&!docs.length&&HOMEDOCS!==null){ inner+=`<div class="mini">Nothing added yet — tap Open / edit to add.</div>`; }
    inner+=`<div class="btn-row" style="margin-top:12px"><button class="btn ghost sm" onclick="openTrip('${t.id}')">Open / edit</button><a class="btn ghost sm" target="_blank" href="${gcal(t.title,t.start_date,(t.notes||''),t.dest)}">📅 Calendar</a></div>`;
  }
  h+=`<div class="card">`+inner+`</div>`;
  box.innerHTML=h;
  let x0=null;
  box.ontouchstart=function(e){ x0=e.touches[0].clientX; };
  box.ontouchend=function(e){ if(x0===null)return; const dx=e.changedTouches[0].clientX-x0; x0=null; if(Math.abs(dx)>45) window.__hp(dx<0?1:-1); };
};
window.__hp=function(d){ window.homePage=Math.max(0,(window.homePage||0)+d); window.renderHomePager(); };
window.__hpGo=function(i){ window.homePage=i; window.renderHomePager(); };


/* ===== Move documents in/out of trips (companion to server-side auto-file) ===== */
(function(){
  if(!window.openTrip) return;
  const _oT = window.openTrip;
  window.openTrip = function(id){
    _oT(id);
    let tries=0;
    const iv=setInterval(function(){
      tries++;
      const b=document.getElementById('docsBlk');
      if(!b){ if(tries>50) clearInterval(iv); return; }
      if(b.textContent.indexOf('Loading')>=0 && tries<50) return;
      clearInterval(iv);
      try{ enhance(b,id); }catch(e){}
    },100);
  };
  function enhance(b, tripId){
    b.querySelectorAll('.list-item').forEach(function(it){
      const oc=it.getAttribute('onclick')||'';
      const m=oc.match(/openDocById\('([^']+)'\)/);
      if(!m || it.dataset.enh) return;
      it.dataset.enh='1';
      it.style.position='relative';
      const x=document.createElement('button');
      x.textContent='✕ trip';
      x.title='Remove from this trip (stays in your diary)';
      x.style.cssText='position:absolute;top:6px;right:24px;border:none;background:#f4e9e9;color:#a23;border-radius:6px;font-size:10.5px;font-weight:700;padding:2px 6px;cursor:pointer';
      x.onclick=function(ev){ ev.stopPropagation(); ev.preventDefault(); window.docUnfile(m[1],tripId); };
      it.appendChild(x);
    });
    if(document.getElementById('unfiledBlk')) return;
    const wrap=document.createElement('div');
    wrap.id='unfiledBlk';
    wrap.innerHTML='<div class="mini" id="unfiledToggle" style="margin-top:8px;color:var(--teal);cursor:pointer;font-weight:700">＋ Add a document from Unfiled…</div><div id="unfiledList" style="display:none"></div>';
    b.appendChild(wrap);
    document.getElementById('unfiledToggle').onclick=function(){
      const l=document.getElementById('unfiledList');
      if(l.style.display==='none'){ l.style.display='block'; loadUnfiled(l,tripId); } else { l.style.display='none'; }
    };
  }
  function loadUnfiled(l, tripId){
    l.innerHTML='<div class="mini">Loading…</div>';
    sb.from('documents').select('id,title,mime').is('trip_id',null).eq('mime','application/pdf').order('title').then(function(res){
      const data=(res&&res.data)||[];
      if(!data.length){ l.innerHTML='<div class="mini">Nothing unfiled.</div>'; return; }
      l.innerHTML=data.map(function(d){ return '<div class="list-item"><div class="li-main"><div class="h">📄 '+esc(d.title)+'</div><div class="sub">tap ✚ to add to this trip</div></div><button onclick="window.docSetTrip(\''+d.id+'\',\''+tripId+'\')" style="border:none;background:var(--teal);color:#fff;border-radius:6px;font-weight:700;padding:4px 10px;cursor:pointer">✚</button></div>'; }).join('');
    });
  }
  window.docUnfile=async function(docId, tripId){
    const r=await sb.from('documents').update({trip_id:null}).eq('id',docId);
    if(r&&r.error){ toast('Could not update'); return; }
    toast('Removed from trip — kept in your diary');
    window.openTrip(tripId);
  };
  window.docSetTrip=async function(docId, tripId){
    const r=await sb.from('documents').update({trip_id:tripId}).eq('id',docId);
    if(r&&r.error){ toast('Could not update'); return; }
    toast('Added to this trip');
    window.openTrip(tripId);
  };
})();


/* ===== Boot layout settle: apply the enhanced home render once after load =====
   Fixes: on a fresh refresh the desktop 2-column home / calendar-behind-icon layout
   did not settle until the user toggled the Personal/All filter. This replays that
   same re-render automatically once the page is loaded and laid out. ===== */
(function(){
  function resettle(){
    try{
      const v=document.getElementById('v-home');
      if(v && v.classList.contains('active') && document.getElementById('homeMain') && typeof window.rHome==='function'){
        window.rHome();
      }
    }catch(e){}
  }
  window.addEventListener('load', function(){ setTimeout(resettle, 700); setTimeout(resettle, 2000); });
})();


/* ===== Phone view: show only the Bangkok clock (all four remain on desktop) ===== */
(function(){
  try{
    var s=document.createElement('style');
    s.textContent='@media(max-width:600px){.clocks{justify-content:center}.clocks .clk{display:none!important}.clocks .clk-loc{display:block!important}.clocks .clk-loc .locsvg{width:168px!important;height:168px!important}}';
    document.head.appendChild(s);
  }catch(e){}
})();


/* ===== v62 — dual clocks: tappable city change + weather under each ===== */
(function(){
  var ROMAN=['I','II','III','IIII','V','VI','VII','VIII','IX','X','XI','XII'];
  var MYCITIES=[{c:'Samui',tz:'Asia/Bangkok',lat:9.51,lon:100.01},{c:'Bangkok',tz:'Asia/Bangkok',lat:13.75,lon:100.5},{c:'Chiang Mai',tz:'Asia/Bangkok',lat:18.79,lon:98.98},{c:'Hong Kong',tz:'Asia/Hong_Kong',lat:22.32,lon:114.17},{c:'Singapore',tz:'Asia/Singapore',lat:1.35,lon:103.82},{c:'Tokyo',tz:'Asia/Tokyo',lat:35.68,lon:139.65},{c:'Dubai',tz:'Asia/Dubai',lat:25.2,lon:55.27},{c:'Abu Dhabi',tz:'Asia/Dubai',lat:24.45,lon:54.38},{c:'London',tz:'Europe/London',lat:51.51,lon:-0.13},{c:'Manchester',tz:'Europe/London',lat:53.48,lon:-2.24},{c:'Dublin',tz:'Europe/Dublin',lat:53.35,lon:-6.26},{c:'Paris',tz:'Europe/Paris',lat:48.85,lon:2.35},{c:'Halifax',tz:'America/Halifax',lat:44.65,lon:-63.6},{c:'New York',tz:'America/New_York',lat:40.71,lon:-74.0},{c:'Los Angeles',tz:'America/Los_Angeles',lat:34.05,lon:-118.24},{c:'Sydney',tz:'Australia/Sydney',lat:-33.87,lon:151.21}];
  function myTz(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||'Asia/Bangkok';}catch(e){return 'Asia/Bangkok';}}
  function locLabel(tz){var p=(tz||'').split('/');var c=p[p.length-1]||tz||'';return c.replace(/_/g,' ');}
  function pad(n){return (n<10?'0':'')+n;}
  function tp(tz){try{var p=new Intl.DateTimeFormat('en-GB',{timeZone:tz,hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).formatToParts(new Date());var g=function(t){return +(p.find(function(x){return x.type===t;})||{}).value;};var h=g('hour');if(h===24)h=0;return{h:h,m:g('minute'),s:g('second')};}catch(e){return{h:0,m:0,s:0};}}
  var DEFAULTS={a:{main:{tz:'@loc',label:'@loc'},sub:{tz:'Europe/London',label:'London'}},b:{main:{tz:'Asia/Dubai',label:'Dubai'},sub:{tz:'America/Halifax',label:'Halifax'}}};
  function store(){try{var s=JSON.parse(localStorage.getItem('ajclk2')||'null');if(s&&s.a&&s.b)return s;}catch(e){}return JSON.parse(JSON.stringify(DEFAULTS));}
  function save(s){try{localStorage.setItem('ajclk2',JSON.stringify(s));}catch(e){}}
  function resolve(slot){var L=window.__ajLoc;var tz=slot.tz==='@loc'?((L&&L.tz)||myTz()):slot.tz;var label=slot.label==='@loc'?((L&&L.label)||locLabel(tz)):slot.label;return{tz:tz,label:label,auto:slot.tz==='@loc'};}
  var DEFS='<defs><filter id="ajtN" x="-10%" y="-10%" width="120%" height="120%"><feFlood flood-color="#e8cf86"/><feComposite in2="SourceAlpha" operator="in"/></filter><filter id="ajtS" x="-10%" y="-10%" width="120%" height="120%"><feFlood flood-color="#8a6a24"/><feComposite in2="SourceAlpha" operator="in"/></filter>'
    +'<radialGradient id="ajnavy" cx="50%" cy="40%" r="72%"><stop offset="0%" stop-color="#2c3f60"/><stop offset="68%" stop-color="#1b2b47"/><stop offset="100%" stop-color="#0f1b30"/></radialGradient>'
    +'<radialGradient id="ajsilver" cx="50%" cy="38%" r="75%"><stop offset="0%" stop-color="#f8f5ee"/><stop offset="68%" stop-color="#e7e2d4"/><stop offset="100%" stop-color="#cbc3ae"/></radialGradient>'
    +'<linearGradient id="ajbrass" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f0d896"/><stop offset="30%" stop-color="#c19a45"/><stop offset="60%" stop-color="#7e6229"/><stop offset="85%" stop-color="#a9853c"/><stop offset="100%" stop-color="#4f3d1b"/></linearGradient>'
    +'<radialGradient id="ajbrassIn" cx="50%" cy="35%" r="75%"><stop offset="0%" stop-color="#f4dfa0"/><stop offset="55%" stop-color="#c6a04a"/><stop offset="100%" stop-color="#7a5f2b"/></radialGradient>'
    +'<linearGradient id="ajgold" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f4de95"/><stop offset="50%" stop-color="#cfb26c"/><stop offset="100%" stop-color="#96762f"/></linearGradient>'
    +'</defs>';
  function faceG(theme){
    var navy=(theme==='navy'),dialFill=navy?'url(#ajnavy)':'url(#ajsilver)',guil=navy?'#3a4f74':'#c1baa6',numFill=navy?'#e0c477':'#7c5f28',outerRing=navy?'#33260f':'#182842',g='';
    g+='<circle cx="100" cy="100" r="99" fill="'+outerRing+'"/><circle cx="100" cy="100" r="95.5" fill="url(#ajbrass)"/>';
    for(var i=0;i<72;i++){var a=i*5*Math.PI/180;g+='<circle cx="'+(100+92.2*Math.sin(a))+'" cy="'+(100-92.2*Math.cos(a))+'" r="0.8" fill="'+(i%2?'#f3dc97':'#6b521f')+'"/>';}
    g+='<circle cx="100" cy="100" r="89.5" fill="#241b0e"/><circle cx="100" cy="100" r="88" fill="url(#ajbrassIn)"/>';
    [0,90,180,270].forEach(function(d){var a=d*Math.PI/180;g+='<circle cx="'+(100+97.1*Math.sin(a))+'" cy="'+(100-97.1*Math.cos(a))+'" r="2.6" fill="url(#ajbrassIn)" stroke="#2c2110" stroke-width="0.5"/>';});
    g+='<circle cx="100" cy="100" r="86.5" fill="'+dialFill+'"/>';
    for(var r=9;r<=82;r+=2.6){g+='<circle cx="100" cy="100" r="'+r+'" fill="none" stroke="'+guil+'" stroke-width="0.3" opacity="'+(navy?0.28:0.45)+'"/>';}
    g+='<circle cx="100" cy="100" r="83.5" fill="none" stroke="#b8923f" stroke-width="0.5"/>';
    for(var k=0;k<60;k++){var ak=k*6*Math.PI/180,maj=k%5===0,r1=maj?80:81.5;g+='<line x1="'+(100+r1*Math.sin(ak))+'" y1="'+(100-r1*Math.cos(ak))+'" x2="'+(100+83.5*Math.sin(ak))+'" y2="'+(100-83.5*Math.cos(ak))+'" stroke="#b8923f" stroke-width="'+(maj?1.2:0.5)+'"/>';}
    for(var n=1;n<=12;n++){if(n===5||n===6||n===7)continue;var an=n*30*Math.PI/180;g+='<text x="'+(100+72*Math.sin(an))+'" y="'+(100-72*Math.cos(an)+5.2)+'" text-anchor="middle" font-family="Georgia,serif" font-size="16" font-weight="600" fill="'+numFill+'">'+ROMAN[n-1]+'</text>';}
    return g;
  }
  function mainHands(tz){var t=tp(tz),ha=(t.h%12)*30+t.m*0.5,ma=t.m*6+t.s*0.1,sa=t.s*6;
    return '<line class="ajhand" data-role="s" data-tz="'+tz+'" data-cx="100" data-cy="100" x1="100" y1="112" x2="100" y2="22" stroke="#a9863a" stroke-width="0.7" transform="rotate('+sa+' 100 100)"/>'
    +'<polygon class="ajhand" data-role="h" data-tz="'+tz+'" data-cx="100" data-cy="100" points="100,114 95.6,70 98.2,58 100,50 101.8,58 104.4,70" fill="url(#ajgold)" stroke="#6e5320" stroke-width="0.4" transform="rotate('+ha+' 100 100)"/>'
    +'<polygon class="ajhand" data-role="m" data-tz="'+tz+'" data-cx="100" data-cy="100" points="100,116 96.7,48 98.4,36 100,24 101.6,36 103.3,48" fill="url(#ajgold)" stroke="#6e5320" stroke-width="0.4" transform="rotate('+ma+' 100 100)"/>'
    +'<circle cx="100" cy="100" r="3.8" fill="#caa64e" stroke="#6e5320" stroke-width="0.5"/><circle cx="100" cy="100" r="1.2" fill="#2c2110"/>';}
  function subHands(tz,cx,cy){var t=tp(tz),ha=(t.h%12)*30+t.m*0.5,ma=t.m*6+t.s*0.1,sa=t.s*6;
    return '<line class="ajhand" data-role="s" data-tz="'+tz+'" data-cx="'+cx+'" data-cy="'+cy+'" x1="'+cx+'" y1="'+(cy+7)+'" x2="'+cx+'" y2="'+(cy-32)+'" stroke="#a9863a" stroke-width="0.5" transform="rotate('+sa+' '+cx+' '+cy+')"/>'
    +'<polygon class="ajhand" data-role="h" data-tz="'+tz+'" data-cx="'+cx+'" data-cy="'+cy+'" points="'+cx+','+(cy+6)+' '+(cx-2.3)+','+(cy-13)+' '+cx+','+(cy-19)+' '+(cx+2.3)+','+(cy-13)+'" fill="url(#ajgold)" stroke="#6e5320" stroke-width="0.3" transform="rotate('+ha+' '+cx+' '+cy+')"/>'
    +'<polygon class="ajhand" data-role="m" data-tz="'+tz+'" data-cx="'+cx+'" data-cy="'+cy+'" points="'+cx+','+(cy+6)+' '+(cx-1.8)+','+(cy-23)+' '+cx+','+(cy-29)+' '+(cx+1.8)+','+(cy-23)+'" fill="url(#ajgold)" stroke="#6e5320" stroke-width="0.3" transform="rotate('+ma+' '+cx+' '+cy+')"/>'
    +'<circle cx="'+cx+'" cy="'+cy+'" r="2" fill="#caa64e" stroke="#6e5320" stroke-width="0.4"/>';}
  function miniFace(theme,tz,city,cx,cy,R,pickAttr){
    var navy=(theme==='navy'),dialFill=navy?'url(#ajnavy)':'url(#ajsilver)',numFill=navy?'#e0c477':'#7c5f28',g='';
    g+='<g '+(pickAttr||'')+' style="cursor:pointer">';
    g+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(R+1.7)+'" fill="url(#ajbrass)"/><circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="'+dialFill+'"/>';
    for(var i=0;i<12;i++){var a=i*30*Math.PI/180,r1=R-3.6,r2=R-1;g+='<line x1="'+(cx+r1*Math.sin(a))+'" y1="'+(cy-r1*Math.cos(a))+'" x2="'+(cx+r2*Math.sin(a))+'" y2="'+(cy-r2*Math.cos(a))+'" stroke="#b8923f" stroke-width="'+(i%3===0?1:0.5)+'"/>';}
    g+='<text x="'+cx+'" y="'+(cy-R*0.40)+'" text-anchor="middle" font-family="Georgia,serif" font-size="6" font-weight="700" letter-spacing="0.5" fill="'+numFill+'">'+city.toUpperCase()+'</text>';
    g+=subHands(tz,cx,cy);
    g+='</g>';
    return g;
  }
  function llFor(city,tz){try{var u=(city||'').toUpperCase();var e=MYCITIES.find(function(c){return c.c.toUpperCase()===u;})||MYCITIES.find(function(c){return c.tz===tz;});if(e)return{lat:e.lat,lon:e.lon};}catch(e){}return null;}
  var WICON={0:'&#9728;&#65039;',1:'&#127780;&#65039;',2:'&#9925;',3:'&#9729;&#65039;',45:'&#127787;&#65039;',48:'&#127787;&#65039;',51:'&#127783;&#65039;',53:'&#127783;&#65039;',55:'&#127783;&#65039;',61:'&#127783;&#65039;',63:'&#127783;&#65039;',65:'&#127783;&#65039;',71:'&#127784;&#65039;',73:'&#127784;&#65039;',75:'&#10052;&#65039;',80:'&#127783;&#65039;',81:'&#127783;&#65039;',82:'&#9928;&#65039;',95:'&#9928;&#65039;',96:'&#9928;&#65039;',99:'&#9928;&#65039;'};
  var wxc={};
  function loadWx(el,ll){if(!el||!ll)return;var key=ll.lat.toFixed(2)+','+ll.lon.toFixed(2),now=Date.now();
    if(wxc[key]&&now-wxc[key].at<600000){el.innerHTML=wxc[key].h;return;}
    fetch('https://api.open-meteo.com/v1/forecast?latitude='+ll.lat+'&longitude='+ll.lon+'&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=1')
    .then(function(r){return r.json();}).then(function(j){var t=Math.round(j.current.temperature_2m),ic=WICON[j.current.weather_code]||'&#127777;&#65039;';var h=ic+' '+t+'&deg;';wxc[key]={at:now,h:h};el.innerHTML=h;
      /* v167: a home re-render can replace the card while this fetch is in flight,
         leaving the captured el detached and the visible line blank. Fill every
         matching live node too. */
      try{document.querySelectorAll('.ajwx[data-lat]').forEach(function(n){if((+n.getAttribute('data-lat')).toFixed(2)+','+(+n.getAttribute('data-lon')).toFixed(2)===key)n.innerHTML=h;});}catch(e){}
    }).catch(function(){});
  }
  function block(idx){
    /* v163 (4 Aug 2026): digital departure-board card - AJ picked design A.
       Analogue artwork dials retired from render; full restore point lives in
       site_backup CLOCKS-RESTORE-POINT-20260803__dash.js / __index.html.
       Kept: city picker taps (main+sub), auto-location pin, .ajwx weather line
       (open-meteo loadWx + weatherCard tap), sub-timezone, rAF .ajtime ticker. */
    var s=store()[idx];
    var M=resolve(s.main), S=resolve(s.sub);
    /* v171: OPPO-style home time - when the auto clock is outside the home
       timezone, its sub-line becomes Home (Ko Samui) automatically. */
    if(M.auto&&M.tz!=='Asia/Bangkok')S={tz:'Asia/Bangkok',label:'🏠 Home',auto:false};
    var pickMain='onclick="window.__ajpickOpen(\''+idx+'\',\'main\')"';
    var pickSub='onclick="event.stopPropagation();window.__ajpickOpen(\''+idx+'\',\'sub\')"';
    var ll=(M.auto&&window.__ajLoc&&window.__ajLoc.lat)?window.__ajLoc:llFor(M.label,M.tz);
    return '<div class="ajc dg">'
      +'<div class="dgcity" '+pickMain+' style="cursor:pointer">'+(M.auto?'&#128205; ':'')+M.label.toUpperCase()+'</div>'
      +'<div class="dgtime" '+pickMain+' style="cursor:pointer"><span class="ajtime" data-tz="'+M.tz+'"></span></div>'
      +'<div class="ajwx dgwx"'+(ll?' data-lat="'+ll.lat+'" data-lon="'+ll.lon+'"':'')+' data-city="'+M.label+'" data-tz="'+M.tz+'" style="cursor:pointer" onclick="event.stopPropagation();weatherCard({city:this.dataset.city,lat:this.dataset.lat,lon:this.dataset.lon,tz:this.dataset.tz})"></div>'
      +'<div class="dgsub" '+pickSub+' style="cursor:pointer">'+S.label.toUpperCase()+' <span class="ajtime" data-tz="'+S.tz+'"></span></div></div>';
  }
  function enhance(force){
    try{
      var row=document.querySelector('#v-home .clocks')||document.querySelector('.clocks');
      if(!row) return;
      if(!force && row.getAttribute('data-aj4')==='1') return;
      row.setAttribute('data-aj4','1');row.classList.add('ajclocks');
      row.innerHTML=block('a')+block('b')+'<div class="dgdate">'+new Date().toLocaleDateString('en-GB',{timeZone:'Asia/Bangkok',weekday:'long',day:'numeric',month:'long'})+'</div>'+'<div class="dgtrip"></div>';
      row.querySelectorAll('.ajwx').forEach(function(el){var la=el.getAttribute('data-lat');if(la)loadWx(el,{lat:+la,lon:+el.getAttribute('data-lon')});});
    }catch(e){}
  }
  window.__ajEnhance=enhance;
  window.__ajpickOpen=function(idx,part){
    try{
      var list=MYCITIES.slice();
      var btns='';
      if(part==='main'){ btns+='<button class="ajpk" onclick="window.__ajpick(\''+idx+'\',\'main\',\'@loc\',\'@loc\')">&#128205; Current location (auto)</button>'; }
      list.forEach(function(c){ btns+='<button class="ajpk" onclick="window.__ajpick(\''+idx+'\',\''+part+'\',\''+c.tz+'\',\''+c.c.replace(/'/g,'')+'\')">'+c.c+'</button>'; });
      var html='<h3>Choose city</h3><div class="ajpkwrap">'+btns+'</div>';
      if(typeof openSheet==='function') openSheet(html);
    }catch(e){}
  };
  window.__ajpick=function(idx,part,tz,label){
    try{
      var s=store(); s[idx][part]={tz:tz,label:label}; save(s);
      if(typeof hideSheet==='function') hideSheet();
      enhance(true);
    }catch(e){}
  };
  function tick(){
    try{var f=(Date.now()%1000)/1000;
      document.querySelectorAll('.ajhand[data-role]').forEach(function(e){var t=tp(e.getAttribute('data-tz')),role=e.getAttribute('data-role'),cx=e.getAttribute('data-cx'),cy=e.getAttribute('data-cy');var a=role==='h'?(t.h%12)*30+t.m*0.5:role==='m'?t.m*6+(t.s+f)*0.1:(t.s+f)*6;e.setAttribute('transform','rotate('+a+' '+cx+' '+cy+')');});
      document.querySelectorAll('.ajtime[data-tz]').forEach(function(e){var t=tp(e.getAttribute('data-tz'));e.textContent=pad(t.h)+':'+pad(t.m);});
    }catch(e){}
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  var pend=false;
  try{var mo=new MutationObserver(function(){if(pend)return;pend=true;requestAnimationFrame(function(){pend=false;enhance();});});mo.observe(document.body,{childList:true,subtree:true});}catch(e){}
  var st=document.createElement('style');
  st.textContent='.clocks.ajclocks{display:flex;gap:12px;justify-content:center;align-items:flex-start;flex-wrap:nowrap;overflow:visible;margin-bottom:16px}'
    +'.ajc{flex:1 1 0;min-width:0;text-align:center}'
    +'.ajc .ajsvg{width:100%;max-width:190px;margin:0 auto;height:auto;display:block;filter:drop-shadow(0 5px 8px rgba(30,18,4,.45))}'
    +'.ajlab{margin-top:3px;font-family:Georgia,serif;font-size:11px;color:#7a5f2b}'
    +'.ajlab .ajcity{letter-spacing:1.2px;font-weight:700}.ajlab .ajpin{opacity:.7}'
    +'.ajwx{font-family:Georgia,serif;font-size:15px;font-weight:600;color:#4f6142;margin-top:5px;min-height:18px}.ajt2{font-family:Georgia,serif;font-size:12px;color:#7a5f2b;margin-top:1px}'
    +'.ajwx .ajwxs{font-size:9px;opacity:.85}'
    +'.ajpkwrap{display:grid;grid-template-columns:1fr 1fr;gap:6px;max-height:52vh;overflow:auto;padding:4px 2px}'
    +'.ajpk{padding:9px 8px;border:1px solid #cdb98a;border-radius:8px;background:#fbf6ea;font:600 13px Georgia,serif;color:#4a3c1e;text-align:left;cursor:pointer}';
  document.head.appendChild(st);
  enhance();
})();


/* ===== v84 — News: F1 + Telegraph RSS ===== */
(function(){
'use strict';
var NCSS='.ajnseg{display:flex;gap:8px;margin:2px 0 12px}.ajnseg button{flex:1;padding:8px 0;border-radius:999px;border:1px solid var(--line);background:#fff;font-family:var(--serif);font-size:14px;font-weight:700;color:var(--muted);cursor:pointer}.ajnseg button.on{border-color:var(--teal);color:var(--teal)}.ajni{display:block;padding:11px 0;border-bottom:1px solid var(--line2);cursor:pointer}.ajni:last-child{border-bottom:0}.ajni b{display:block;font-size:15px;line-height:1.35}.ajni span{display:block;font-size:12px;color:var(--muted2);margin-top:3px;font-style:italic}';
var st=document.createElement('style');st.textContent=NCSS;document.head.appendChild(st);
var CFGX=window.AJ_CONFIG||{};var nCache={};var nSrc='f1';
function ago(ds){try{var t=new Date(ds).getTime();if(!t)return'';var m=Math.floor((Date.now()-t)/60000);if(m<1)return'just now';if(m<60)return m+'m ago';var h=Math.floor(m/60);if(h<24)return h+'h ago';return Math.floor(h/24)+'d ago';}catch(e){return'';}}
function nEsc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function nList(items){return items.map(function(i,ix){return '<a class="ajni" href="'+nEsc(i.l)+'" target="_blank" rel="noopener"><b>'+nEsc(i.t)+'</b><span>'+nEsc(ago(i.d))+(nSrc==='f1'?' · formula1.com':' · The Telegraph')+'</span></a>';}).join('');}
function nRender(){var box=document.getElementById('ajNews');if(!box)return;
 var h='<div class="ajnseg"><button class="'+(nSrc==='f1'?'on':'')+'" onclick="window.__ajnSrc(\'f1\')">🏎 F1</button><button class="'+(nSrc==='tg'?'on':'')+'" onclick="window.__ajnSrc(\'tg\')">📰 Telegraph</button></div><div id="ajNewsList">';
 var c=nCache[nSrc];
 if(c&&c.items&&c.items.length){h+=nList(c.items);}
 else if(c&&c.err){h+=nErrHtml();}
 else{h+='<div class="mini" style="text-align:center;padding:24px 0">Loading…</div>';}
 h+='</div>';box.innerHTML=h;
 if(!c){nFetch(nSrc);}}
function nErrHtml(){return '<div class="mini" style="text-align:center;padding:24px 0">Couldn\'t load news.<br><button onclick="window.__ajnRetry()" style="margin-top:10px;padding:7px 22px;border-radius:999px;border:1px solid var(--teal);background:#fff;color:var(--teal);font-family:var(--serif);font-weight:700;font-size:13px;cursor:pointer">Try again</button></div>';}
function nFail(src){nCache[src]={err:1};if(nSrc===src)nRender();}
function nFetch(src){try{
 var ctl=(typeof AbortController!=='undefined')?new AbortController():null;
 var tmr=setTimeout(function(){try{if(ctl)ctl.abort();}catch(e){}},15000);
 fetch(CFGX.SUPABASE_URL+'/functions/v1/rss?src='+src+'&t='+Date.now(),{headers:{'Authorization':'Bearer '+CFGX.SUPABASE_KEY,'apikey':CFGX.SUPABASE_KEY},signal:ctl?ctl.signal:undefined})
 .then(function(r){if(!r.ok)throw new Error('http');return r.json();})
 .then(function(j){var it=(j&&j.items)||[];if(!it.length)throw new Error('empty');clearTimeout(tmr);nCache[src]={items:it};if(nSrc===src)nRender();})
 .catch(function(){clearTimeout(tmr);nFail(src);});
}catch(e){nFail(src);}}
window.__ajnRetry=function(){delete nCache[nSrc];nRender();};
window.__ajnSrc=function(s){nSrc=s;nRender();};
window.openNews=function(){if(typeof openSheet==='function'){openSheet('<h3>📰 News</h3><div id="ajNews"></div>');nRender();}};
function addBtn(){try{
 var bar=document.querySelector('.hdrbar');if(!bar||document.getElementById('hdrNews'))return;
 var b=document.createElement('button');b.className='hdr-ic';b.id='hdrNews';b.setAttribute('aria-label','News');
 b.innerHTML='<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5h13v14H6a2 2 0 0 1-2-2V5z"/><path d="M17 8h3v9a2 2 0 0 1-2 2"/><line x1="7" y1="9" x2="14" y2="9"/><line x1="7" y1="12.5" x2="14" y2="12.5"/><line x1="7" y1="16" x2="11" y2="16"/></svg>';
 b.onclick=window.openNews;
 var f1=document.getElementById('hdrF1');
 if(f1&&f1.parentNode===bar){bar.insertBefore(b,f1.nextSibling);}else{bar.appendChild(b);}
}catch(e){}}
addBtn();setTimeout(addBtn,800);
})();


/* ===== v88 — Trip To-Do checklist ===== */
(function(){
'use strict';
if(!window.openTrip) return;
function tesc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
var curTrip=null;
function tdRow(c){var done=c.status==='done';
 return '<div style="display:flex;align-items:center;gap:10px;padding:8px 2px;border-bottom:1px solid var(--line2)">'
 +'<button onclick="window.__tdTog(\''+c.id+'\',\''+(done?'open':'done')+'\')" style="width:22px;height:22px;flex:0 0 22px;border-radius:6px;border:1.5px solid '+(done?'var(--teal)':'#b8a97f')+';background:'+(done?'var(--teal)':'#fff')+';color:#fff;font-size:13px;line-height:1;cursor:pointer;padding:0">'+(done?'✓':'')+'</button>'
 +'<div style="flex:1;font-size:14px;'+(done?'opacity:.55;text-decoration:line-through;':'')+'">'+tesc(c.label)+(c.evidence?'<div class="mini" style="font-size:11px;color:var(--muted2)">'+tesc(c.evidence)+'</div>':'')+'</div>'
 +'<button onclick="window.__tdDel(\''+c.id+'\')" style="border:none;background:none;color:#a23;font-size:14px;cursor:pointer;padding:2px 6px">✕</button></div>';}
function tdRender(list){var el=document.getElementById('tripTodoList');if(!el)return;
 var open=list.filter(function(c){return c.status!=='done'&&c.status!=='superseded'&&c.status!=='expired'}).length;
 var h=list.map(tdRow).join('');
 h+='<div class="mini" style="margin-top:8px;color:var(--teal);cursor:pointer;font-weight:700" onclick="window.__tdAdd()">＋ Add to-do…</div>';
 el.innerHTML=h;
 var hd=document.getElementById('tripTodoHead'); if(hd) hd.textContent='To do'+(open?' · '+open+' open':' · all done ✓');}
function tdLoad(){ if(!curTrip) return;
 try{ sb.from('trip_checklist').select('*').eq('trip_id',curTrip).order('created_at').then(function(r){ if(!r.error) tdRender(r.data||[]); }); }catch(e){}
}
window.__tdTog=function(id,ns){ try{ sb.from('trip_checklist').update({status:ns}).eq('id',id).then(function(){ tdLoad(); }); }catch(e){} };
window.__tdDel=function(id){ if(!confirm('Remove this to-do?')) return; try{ sb.from('trip_checklist').delete().eq('id',id).then(function(){ tdLoad(); }); }catch(e){} };
window.__tdAdd=function(){ var lb=prompt('New to-do for this trip:'); if(!lb||!lb.trim()) return; try{ sb.from('trip_checklist').insert({trip_id:curTrip,kind:'custom',label:lb.trim(),source:'custom'}).then(function(){ tdLoad(); }); }catch(e){} };
var _oT=window.openTrip;
window.openTrip=function(id){ _oT(id); curTrip=id; var tries=0;
 var iv=setInterval(function(){ tries++;
   var b=document.getElementById('docsBlk');
   if(!b){ if(tries>60) clearInterval(iv); return; }
   if(b.textContent.indexOf('Loading')>=0 && tries<60) return;
   clearInterval(iv);
   if(document.getElementById('tripTodo')){ tdLoad(); return; }
   var w=document.createElement('div'); w.id='tripTodo';
   w.innerHTML='<div class="sect" id="tripTodoHead" style="margin-top:12px">To do</div><div id="tripTodoList"><div class="mini">Loading…</div></div>';
   b.parentNode.insertBefore(w,b);
   tdLoad();
 },100);
};
})();


/* ===== v89 — Trips sheet from top bar ===== */
(function(){
'use strict';
function xesc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function fmtR(t){ try{ var a=t.start_date?fmtD(t.start_date):''; var b=(t.end_date&&t.end_date!==t.start_date)?(' — '+fmtShort(t.end_date)):''; return a+b; }catch(e){ return t.start_date||''; } }
function tRow(t,od){ var n=od[t.id]||0;
 return '<div class="list-item" onclick="openTrip(\''+t.id+'\')"><div class="li-main"><div class="h">✈️ '+xesc(t.title)+'</div><div class="sub">'+xesc(fmtR(t))+(n?' · <span style="color:#a23;font-weight:700">'+n+' to-do open</span>':'')+'</div></div><div class="chev">›</div></div>'; }
function tRender(od){ var el=document.getElementById('ajTripsList'); if(!el) return;
 var tk=(new Date()).toISOString().slice(0,10);
 var up=D.trips.filter(function(t){return t.start_date&&String(t.end_date||t.start_date).slice(0,10)>=tk;}).sort(function(a,b){return String(a.start_date).localeCompare(String(b.start_date));});
 var past=D.trips.filter(function(t){return t.start_date&&String(t.end_date||t.start_date).slice(0,10)<tk;}).sort(function(a,b){return String(b.start_date).localeCompare(String(a.start_date));});
 var h='';
 if(up.length){ h+='<div class="card">'+up.map(function(t){return tRow(t,od);}).join('')+'</div>'; } else { h+='<div class="mini" style="padding:12px 0">No upcoming trips.</div>'; }
 if(past.length){ h+='<div class="mini" id="ajPastTog" style="margin-top:10px;color:var(--teal);cursor:pointer;font-weight:700">Past trips ('+past.length+') ›</div><div id="ajPastList" style="display:none"><div class="card" style="margin-top:6px">'+past.map(function(t){return tRow(t,od);}).join('')+'</div></div>'; }
 el.innerHTML=h;
 var tg=document.getElementById('ajPastTog');
 if(tg) tg.onclick=function(){ var l=document.getElementById('ajPastList'); l.style.display=(l.style.display==='none')?'block':'none'; };
}
window.openTrips=function(){ if(typeof openSheet!=='function') return;
 openSheet('<h3>✈️ Trips</h3><div id="ajTripsList"><div class="mini">Loading…</div></div>');
 var od={};
 try{ sb.from('trip_checklist').select('trip_id,status').then(function(r){ (r.data||[]).forEach(function(c){ if(c.status!=='done'&&c.status!=='superseded'&&c.status!=='expired') od[c.trip_id]=(od[c.trip_id]||0)+1; }); tRender(od); }); }catch(e){ tRender(od); }
};
function addBtn(){ try{
 var bar=document.querySelector('.hdrbar'); if(!bar||document.getElementById('hdrTrips')) return;
 var b=document.createElement('button'); b.className='hdr-ic'; b.id='hdrTrips'; b.setAttribute('aria-label','Trips');
 b.innerHTML='<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="8" width="14" height="12" rx="2"/><path d="M9 8V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V8"/><line x1="9" y1="11" x2="9" y2="17"/><line x1="15" y1="11" x2="15" y2="17"/></svg>';
 b.onclick=window.openTrips;
 var lg=document.getElementById('hdrLogo');bar.insertBefore(b,lg?lg.nextSibling:bar.firstChild);
}catch(e){} }
addBtn(); setTimeout(addBtn,800);
})();


/* ===== v90 — sheet back-stack + grouped flights ===== */
(function(){
'use strict';
var stack=[],reshow=false;
var _os=window.openSheet;
function sheetEl(){return document.getElementById('sheet');}
function decorate(){try{var sh=sheetEl();if(!sh)return;
 sh.querySelectorAll('.ajshx,.ajshb').forEach(function(x){x.remove();});
 if(getComputedStyle(sh).position==='static')sh.style.position='relative';
 var x=document.createElement('button');x.className='ajshx';x.textContent='✕';x.setAttribute('aria-label','Close');
 x.style.cssText='position:absolute;top:10px;right:14px;border:none;background:#eee7d6;color:#4a3c1e;width:30px;height:30px;border-radius:15px;font-size:14px;line-height:1;cursor:pointer;z-index:5';
 x.onclick=function(ev){ev.stopPropagation();var n=stack.length;stack.length=0;if(n>0&&history.state&&history.state.sheet){history.go(-n);}else{hideSheet();}};
 sh.appendChild(x);
 if(stack.length>1){var bk=document.createElement('button');bk.className='ajshb';bk.textContent='‹';bk.setAttribute('aria-label','Back');
  bk.style.cssText='position:absolute;top:10px;left:14px;border:none;background:#eee7d6;color:#4a3c1e;width:30px;height:30px;border-radius:15px;font-size:18px;line-height:1;cursor:pointer;z-index:5';
  bk.onclick=function(ev){ev.stopPropagation();history.back();};
  sh.appendChild(bk);}
}catch(e){}}
window.openSheet=function(html){
 try{var sh=sheetEl();if(stack.length&&document.getElementById('scrim').classList.contains('show'))stack[stack.length-1]=sh.innerHTML;}catch(e){}
 _os(html);
 try{if(stack.length&&!(history.state&&history.state.sheet===stack.length+1))history.pushState({sheet:stack.length+1},'');}catch(e){}
 stack.push(sheetEl().innerHTML);
 decorate();
};
window.addEventListener('popstate',function(){
 if(stack.length>1){reshow=true;stack.pop();
  var sh=sheetEl();sh.innerHTML=stack[stack.length-1];
  document.getElementById('scrim').classList.add('show');document.body.style.overflow='hidden';
  if(!(history.state&&history.state.sheet))history.pushState({sheet:true},'');
  decorate();reshow=false;
 } else stack.length=0;
});

function gesc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function groupF(fls){var m={},order=[];
 fls.forEach(function(f){var k=(f.flight_no||'?')+'|'+(f.fdate||'')+'|'+(f.ftime||'');if(!m[k]){m[k]=[];order.push(k);}m[k].push(f);});
 return order.map(function(k){return{k:k.replace(/[^A-Za-z0-9]/g,''),list:m[k]};});}
function paxNames(list){var s=[];list.forEach(function(f){String(f.pax||'').split('&').forEach(function(p){p=p.trim();if(p&&s.indexOf(p)<0)s.push(p);});});return s.join(' + ');}
function detRow(f,tid){var t=tid||f.trip_id||'';
 return '<div style="padding:7px 0;border-top:1px dashed var(--line2)">'
 +'<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">'
 +'<b style="font-size:13px">'+gesc(f.pax||'—')+'</b>'
 +(f.conf?'<button class="copybtn" onclick="event.stopPropagation();copy(\''+gesc(f.conf)+'\')">'+gesc(f.conf)+' ⧉</button>':'')
 +'<button class="btn ghost sm" style="padding:3px 10px;font-size:12px" onclick="event.stopPropagation();window.__ajTicket(\''+t+'\',\''+gesc(f.conf||'')+'\')">🎫 Ticket</button>'
 +'<span class="mini" style="cursor:pointer;color:var(--muted2);text-decoration:underline" onclick="event.stopPropagation();editFlight(\''+t+'\',\''+f.id+'\')">edit</span>'
 +'</div>'
 +(f.notes?'<div class="mini" style="margin-top:3px">'+gesc(f.notes)+'</div>':'')
 +'</div>';}
window.ajFlightCards=function(fls,tid,showTrip){
 var tt=function(id){var t=D.trips.find(function(x){return x.id===id;});return t?t.title:'';};
 return groupF(fls).map(function(g){var f=g.list[0];var did='fx'+g.k+String(f.id||'').replace(/[^A-Za-z0-9]/g,'').slice(0,6);
  return '<div class="subbox" style="cursor:pointer" onclick="var d=document.getElementById(\''+did+'\');if(d)d.style.display=(d.style.display===\'none\')?\'block\':\'none\';">'
  +'<div class="flight-line"><span class="code">'+gesc(f.from_code||'?')+'</span><span class="arrow">→</span><span class="code">'+gesc(f.to_code||'?')+'</span>'
  +'<span class="mini">'+[fmtShort(f.fdate),f.ftime,f.airline,f.flight_no].filter(Boolean).map(gesc).join(' · ')+'</span></div>'
  +'<div class="mini" style="margin-top:2px">'+gesc(paxNames(g.list))+(showTrip&&f.trip_id?' · '+gesc(tt(f.trip_id)):'')+' <span style="color:var(--teal)">details ▾</span></div>'
  +'<div id="'+did+'" style="display:none">'+g.list.map(function(x){return detRow(x,tid);}).join('')+'</div>'
  +'</div>';}).join('');
};
window.__ajTicket=function(tid,conf){
 if(!conf){if(typeof toast==='function')toast('No booking ref');return;}
 try{sb.from('documents').select('id,title').eq('trip_id',tid).then(function(r){
  var d=(r.data||[]).find(function(x){return x.title&&x.title.toUpperCase().indexOf(conf.toUpperCase())>=0;});
  if(d)openDocById(d.id);else if(typeof toast==='function')toast('No ticket on file for '+conf);
 });}catch(e){}
};
var _oT=window.openTrip;
window.openTrip=function(id){_oT(id);
 try{
  var fls=D.flights.filter(function(f){return f.trip_id===id&&!f.archived;}).sort(function(a,b){return String(a.fdate||'').localeCompare(String(b.fdate||''))||String(a.ftime||'').localeCompare(String(b.ftime||''));});
  if(!fls.length)return;
  var sh=sheetEl();if(!sh)return;
  var fl=null;sh.querySelectorAll('label.f').forEach(function(l){if(l.textContent.trim()==='Flights')fl=l;});
  if(!fl)return;
  var n=fl.nextSibling,rm=[];
  while(n){if(n.nodeType===1&&n.tagName==='BUTTON')break;
   if(n.nodeType===1&&n.classList&&(n.classList.contains('subbox')||n.classList.contains('mini')))rm.push(n);
   n=n.nextSibling;}
  var host=document.createElement('div');host.innerHTML=window.ajFlightCards(fls,id,false);
  fl.parentNode.insertBefore(host,rm.length?rm[0]:fl.nextSibling);
  rm.forEach(function(x){if(x.parentNode)x.parentNode.removeChild(x);});
  if(stack.length)stack[stack.length-1]=sh.innerHTML;
 }catch(e){}
};
window.rFlights=function(){
 var t0=today();
 var all=D.flights.filter(function(f){return !f.archived;}).sort(function(a,b){return String(a.fdate||'9999').localeCompare(String(b.fdate||'9999'));});
 var up=all.filter(function(f){return parseD(f.fdate||'9999-12-31')>=t0;});
 var past=all.filter(function(f){return parseD(f.fdate||'1900-01-01')<t0;}).reverse();
 var h='<div class="sect">Upcoming flights</div><div class="card">'+(up.length?window.ajFlightCards(up,null,true):'<div class="mini">No upcoming flights.</div>')+'</div>';
 if(past.length)h+='<div class="sect">Past</div><div class="card">'+window.ajFlightCards(past,null,true)+'</div>';
 document.getElementById('v-flights').innerHTML=h;
};
})();


/* ===== v91 — fresh trip data on open + to-do options (SmackOne copy text) ===== */
(function(){
'use strict';
var refetching=false, tdCache={}, curT=null;
function esc9(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function two(n){return (n<10?'0':'')+n;}
function minus2h(t){var m=/^(\d{1,2}):(\d{2})/.exec(String(t||''));if(!m)return'';var h=(parseInt(m[1],10)+22)%24;return two(h)+':'+m[2];}
function wd(ds){try{return new Date(ds+'T00:00:00').toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});}catch(e){return ds;}}
function paxAll(fls){var s=[];fls.forEach(function(f){String(f.pax||'').split('&').forEach(function(p){p=p.trim();if(p&&s.indexOf(p)<0)s.push(p);});});return s.join(' & ')||'Adrian & Jacqueline';}
window.__tdText=function(kind,tripId){
 var t=D.trips.find(function(x){return x.id===tripId;})||{};
 var fls=D.flights.filter(function(f){return f.trip_id===tripId&&!f.archived;}).sort(function(a,b){return String(a.fdate||'').localeCompare(String(b.fdate||''));});
 if(kind==='car_home_out'){ var f=fls.find(function(x){return x.from_code==='USM';});
  if(f) return 'SmackOne booking request\n'+wd(f.fdate)+'\nPickup: home, Ko Samui at '+minus2h(f.ftime)+'\nDrop-off: USM airport ('+(f.flight_no||'')+' departs '+(f.ftime||'')+')\nPassengers: '+paxAll(fls)+'\nThank you!'; }
 if(kind==='car_home_ret'){ var r=fls.slice().reverse().find(function(x){return x.to_code==='USM';});
  if(r) return 'SmackOne booking request\n'+wd(r.fdate)+'\nMeet flight '+(r.flight_no||'')+' arriving USM (departs '+(r.from_code||'')+' '+(r.ftime||'')+')\nDrive home to Ko Samui\nPassengers: '+paxAll(fls)+'\nThank you!'; }
 return (t.title||'Trip')+' — '+String(kind).replace(/_/g,' ')+(t.start_date?' ('+t.start_date+(t.end_date?' — '+t.end_date:'')+')':'');
};
function refOf(c){var e=String(c.evidence||'');var m=/conf\.?\s*#?\s*([A-Za-z0-9]{5,})/i.exec(e);if(m)return m[1];m=/\b([A-Z0-9]{6}|[A-Z0-9]{8,14})\b/.exec(e.replace(/[a-z]/g,' '));return m?m[1]:'';}
function row9(c){var done=c.status==='done';var rf=refOf(c);
 return '<div style="display:flex;align-items:center;gap:10px;padding:8px 2px;border-bottom:1px solid var(--line2)">'
 +'<button onclick="event.stopPropagation();window.__tdTog(\''+c.id+'\',\''+(done?'open':'done')+'\')" style="width:22px;height:22px;flex:0 0 22px;border-radius:6px;border:1.5px solid '+(done?'var(--teal)':'#b8a97f')+';background:'+(done?'var(--teal)':'#fff')+';color:#fff;font-size:13px;line-height:1;cursor:pointer;padding:0">'+(done?'✓':'')+'</button>'
 +'<div style="flex:1;font-size:14px;cursor:pointer;'+(done?'opacity:.55;text-decoration:line-through;':'')+'" onclick="window.__tdOpt(\''+c.id+'\')">'+esc9(c.label)
 +(c.evidence?'<div class="mini" style="font-size:11px;color:var(--muted2)">'+esc9(c.evidence)+'</div>':'')
 +'</div>'
 +'<button onclick="event.stopPropagation();copy(window.__tdText(\''+esc9(c.kind)+'\',\''+c.trip_id+'\'))" title="Copy booking text" style="border:1px solid #cdb98a;background:#fff;border-radius:8px;font-size:14px;cursor:pointer;padding:3px 8px">📋</button>'
 +(rf?'<button onclick="event.stopPropagation();copy(\''+esc9(rf)+'\')" title="Copy booking ref" style="border:1px solid #cdb98a;background:#fff;border-radius:8px;font-size:13px;cursor:pointer;padding:3px 8px;font-weight:700;color:#4a3c1e">⧉</button>':'')
 +'<button onclick="event.stopPropagation();window.__tdDel(\''+c.id+'\')" style="border:none;background:none;color:#a23;font-size:14px;cursor:pointer;padding:2px 6px">✕</button></div>';}
function load9(){ if(!curT) return;
 try{ sb.from('trip_checklist').select('*').eq('trip_id',curT).order('created_at').then(function(r){
  if(r.error) return;
  var list=r.data||[]; tdCache={}; list.forEach(function(c){tdCache[c.id]=c;});
  var el=document.getElementById('tripTodoList'); if(!el) return;
  var open=list.filter(function(c){return c.status!=='done'&&c.status!=='superseded'&&c.status!=='expired';}).length;
  el.innerHTML=list.map(row9).join('')+'<div class="mini" style="margin-top:8px;color:var(--teal);cursor:pointer;font-weight:700" onclick="window.__tdAdd()">＋ Add to-do…</div>';
  var hd=document.getElementById('tripTodoHead'); if(hd) hd.textContent='To do'+(open?' · '+open+' open':' · all done ✓');
 }); }catch(e){}
}
window.__tdTog=function(id,ns){ try{ sb.from('trip_checklist').update({status:ns}).eq('id',id).then(function(){ load9(); }); }catch(e){} };
window.__tdDel=function(id){ if(!confirm('Remove this to-do?')) return; try{ sb.from('trip_checklist').delete().eq('id',id).then(function(){ load9(); if(history.state&&history.state.sheet&&document.querySelector('#sheet .ajshb')) history.back(); }); }catch(e){} };
window.__tdAdd=function(){ var lb=prompt('New to-do for this trip:'); if(!lb||!lb.trim()) return; try{ sb.from('trip_checklist').insert({trip_id:curT,kind:'custom',label:lb.trim(),source:'custom'}).then(function(){ load9(); }); }catch(e){} };
window.__tdOpt=function(id){ var c=tdCache[id]; if(!c) return; var done=c.status==='done';
 openSheet('<h3>📝 '+esc9(c.label)+'</h3>'
 +(c.evidence?'<div class="mini" style="margin-bottom:10px">'+esc9(c.evidence)+'</div>':'')
 +'<button class="btn primary block" onclick="copy(window.__tdText(\''+esc9(c.kind)+'\',\''+c.trip_id+'\'))">📋 Copy booking text</button>'
 +(refOf(c)?'<button class="btn ghost block" style="margin-top:8px" onclick="copy(\''+esc9(refOf(c))+'\')">⧉ Copy ref '+esc9(refOf(c))+'</button>':'')
 +'<button class="btn ghost block" style="margin-top:8px" onclick="window.__tdTog(\''+c.id+'\',\''+(done?'open':'done')+'\');history.back()">'+(done?'↺ Mark as open':'✓ Mark as done')+'</button>'
 +'<button class="btn ghost block" style="margin-top:8px" onclick="window.__tdDel(\''+c.id+'\')">🗑 Remove from list</button>');
};
var _oT=window.openTrip;
window.openTrip=function(id){ _oT(id); curT=id;
 var tries=0; var iv=setInterval(function(){ tries++;
  if(document.getElementById('tripTodoList')){ clearInterval(iv); load9(); }
  else if(tries>60) clearInterval(iv);
 },150);
 if(refetching) return;
 try{ Promise.all([
   sb.from('trip_items').select('*').eq('trip_id',id),
   sb.from('flights').select('*').eq('trip_id',id).eq('archived',false)
  ]).then(function(rs){ try{
   if(rs[0].error||rs[1].error) return;
   var it=rs[0].data||[], fl=(rs[1].data||[]).filter(function(x){return !x.archived;});
   var key=function(a){return JSON.stringify(a.slice().sort());};
   var same= key(D.trip_items.filter(function(x){return x.trip_id===id;}).map(function(x){return String(x.id);}))===key(it.map(function(x){return String(x.id);}))
    && key(D.flights.filter(function(x){return x.trip_id===id&&!x.archived;}).map(function(x){return String(x.id)+String(x.fdate)+String(x.ftime);}))===key(fl.map(function(x){return String(x.id)+String(x.fdate)+String(x.ftime);}));
   if(same) return;
   D.trip_items=D.trip_items.filter(function(x){return x.trip_id!==id;}).concat(it);
   D.flights=D.flights.filter(function(x){return x.trip_id!==id;}).concat(fl);
   if(typeof cacheSave==='function'){try{cacheSave();}catch(e){}}
   refetching=true; try{ window.openTrip(id); }finally{ refetching=false; }
   if(typeof toast==='function') toast('Updated with latest bookings');
  }catch(e){} }); }catch(e){}
};
})();

/* ===== v100 · find-anything: contacts + notes in search, fingertip actions ===== */
(function(){
function jq(s){ return JSON.stringify(String(s==null?'':s)).replace(/"/g,'&quot;'); }
function telh(p){ return String(p||'').replace(/[^\d+]/g,''); }
window.__jq=jq; window.__telh=telh;
function ctext(c){ return [c.name,c.role,c.phone,c.email,c.notes].filter(Boolean).join('\n'); }
window.__ctext=ctext;
/* pull the first phone-looking string out of free text */
function firstPhone(s){ var m=String(s||'').match(/\+?\d[\d\s\-()]{6,}\d/); return m?m[0].trim():''; }

window.openContact=function(id){
  var c=(D.contacts||[]).find(function(x){return x.id===id;}); if(!c) return;
  var h='<h3>'+esc(c.name)+'</h3>'+(c.role?'<div class="mini" style="margin:-8px 0 12px">'+esc(c.role)+'</div>':'');
  if(c.phone) h+='<div class="kv-line"><span class="kv-text">&#128222; <a href="tel:'+esc(telh(c.phone))+'">'+esc(c.phone)+'</a></span><button class="copybtn" onclick="copy('+jq(c.phone)+')">&#10696;</button></div>';
  if(c.email) h+='<div class="kv-line"><span class="kv-text">&#9993;&#65039; <a href="mailto:'+esc(c.email)+'">'+esc(c.email)+'</a></span><button class="copybtn" onclick="copy('+jq(c.email)+')">&#10696;</button></div>';
  String(c.notes||'').split('\n').filter(function(l){return l.trim();}).forEach(function(l){
    h+='<div class="kv-line"><span class="kv-text">'+linkify(l)+'</span><button class="copybtn" onclick="copy('+jq(l)+')">&#10696;</button></div>';
  });
  if(c.dropbox_path) h+='<div class="kv-line"><span class="kv-text">&#128193; <a href="#" onclick="event.preventDefault();openDrop('+jq(c.dropbox_path)+')">Open in Dropbox &#8599;</a></span></div>';
  h+='<div class="btn-row" style="margin-top:18px">'
    +(c.phone?'<a class="btn primary" href="tel:'+esc(telh(c.phone))+'">&#128222; Call</a>':'')
    +'<button class="btn ghost" onclick="copy('+jq(ctext(c))+')">&#10696; Copy all</button>'
    +'<button class="btn ghost" onclick="editContact(\''+c.id+'\')">&#9999;&#65039;</button></div>';
  openSheet(h);
};

window.__contactRow=function(c){
  var sub=[c.role,c.phone||firstPhone(c.notes)].filter(Boolean).join(' · ');
  return '<div class="list-item"><div class="li-main" style="cursor:pointer" onclick="openContact(\''+c.id+'\')"><div class="h">&#128100; '+esc(c.name)+'</div><div class="sub">'+esc(sub)+'</div></div>'
   +(c.phone?'<a class="btn ghost sm" href="tel:'+esc(telh(c.phone))+'" onclick="event.stopPropagation()">&#128222;</a>':'')
   +'<button class="copybtn" onclick="event.stopPropagation();copy('+jq(c.phone||ctext(c))+')">&#10696;</button></div>';
};
window.__noteRow=function(n){
  var first=String(n.body||'').replace(/<[^>]*>/g,' ').split('\n').filter(function(l){return l.trim();})[0]||'';
  return '<div class="list-item" style="cursor:pointer" onclick="viewNote(\''+n.id+'\')"><div class="li-main"><div class="h">&#128221; '+esc(n.title||'Note')+'</div><div class="sub">'+esc(first).slice(0,64)+'</div></div><div class="chev">&#8250;</div></div>';
};
window.__docRow=function(d){
  var ic=(d.mime==='application/pdf')?'&#128196;':((/^image\//.test(d.mime||''))?'&#128444;&#65039;':'&#128206;');
  return '<div class="list-item" style="cursor:pointer" onclick="openDocById(\''+d.id+'\')"><div class="li-main"><div class="h">'+ic+' '+esc(d.title||'Document')+'</div><div class="sub">'+(d.is_card?'wallet card · ':'')+'tap to show full screen</div></div><div class="chev">&#8250;</div></div>';
};

/* documents live server-side; cache their titles once so search can reach them */
window.__docs=window.__docs||null;
window.__loadDocs=function(after){
  if(window.__docs||window.__docsLoading) { if(after)after(); return; }
  window.__docsLoading=true;
  try{ sb.from('documents').select('id,title,mime,is_card').order('title').then(function(r){
    window.__docs=(r&&r.data)||[]; window.__docsLoading=false; if(after)after();
  }); }catch(e){ window.__docs=[]; window.__docsLoading=false; if(after)after(); }
};
})();

/* ===== v100 · one search that reaches everything ===== */
(function(){
window.searchResults=function(q){
  var h='';
  var V=(D.vault_items||[]).filter(function(it){ return qmatch([it.title,it.body].join(' '),q); });
  var C=(D.contacts||[]).filter(function(c){ return qmatch([c.name,c.role,c.phone,c.email,c.notes].join(' '),q); });
  var N=(D.notes||[]).filter(function(n){ return qmatch([n.title,String(n.body||'').replace(/<[^>]*>/g,' ')].join(' '),q); });
  var T=(D.trips||[]).filter(function(t){ return qmatch([t.title,t.dest,t.notes,t.resv,t.town_info].join(' '),q); });
  var F=(D.flights||[]).filter(function(f){ return qmatch([f.from_code,f.to_code,f.airline,f.flight_no,f.conf].join(' '),q); });
  var I=(D.trip_items||[]).filter(function(i){ return qmatch([i.title,i.ref,i.address,i.notes].join(' '),q); });
  var G=(window.__docs||[]).filter(function(d){ return qmatch(d.title||'',q); });
  var total=V.length+C.length+N.length+T.length+F.length+I.length+G.length;
  h+='<div class="sect">'+total+' result'+(total!==1?'s':'')+'</div>';
  if(C.length) h+='<div class="sect">People &amp; numbers</div><div class="card">'+C.map(window.__contactRow).join('')+'</div>';
  if(V.length) h+='<div class="sect">Info</div><div class="card">'+V.map(function(it){return window.__infoRow(it,q);}).join('')+'</div>';
  if(N.length) h+='<div class="sect">Notes</div><div class="card">'+N.map(window.__noteRow).join('')+'</div>';
  if(G.length) h+='<div class="sect">Documents</div><div class="card">'+G.map(window.__docRow).join('')+'</div>';
  if(T.length) h+='<div class="sect">Trips</div><div class="card">'+T.map(function(t){ return '<div class="list-item" style="cursor:pointer" onclick="openTrip(\''+t.id+'\')"><div class="li-main"><div class="h">&#9992;&#65039; '+esc(t.title)+'</div><div class="sub">'+fmtD(t.start_date)+'</div></div><div class="chev">&#8250;</div></div>'; }).join('')+'</div>';
  if(F.length) h+='<div class="sect">Flights</div><div class="card">'+F.map(function(f){ return '<div class="list-item" style="cursor:pointer" onclick="openTrip(\''+f.trip_id+'\')"><div class="li-main"><div class="h">'+esc(f.from_code)+'&#8594;'+esc(f.to_code)+' '+esc(f.airline||'')+'</div><div class="sub">'+fmtD(f.fdate)+(f.conf?' · '+esc(f.conf):'')+'</div></div>'+(f.conf?'<button class="copybtn" onclick="event.stopPropagation();copy('+window.__jq(f.conf)+')">&#10696;</button>':'')+'</div>'; }).join('')+'</div>';
  if(I.length) h+='<div class="sect">Bookings</div><div class="card">'+I.map(function(i){ return '<div class="list-item" style="cursor:pointer" onclick="openTrip(\''+i.trip_id+'\')"><div class="li-main"><div class="h">'+kindMeta(i.kind)[1]+' '+esc(i.title||'')+'</div><div class="sub">'+fmtD(i.idate)+(i.ref?' · '+esc(i.ref):'')+'</div></div>'+(i.ref?'<button class="copybtn" onclick="event.stopPropagation();copy('+window.__jq(i.ref)+')">&#10696;</button>':'')+'</div>'; }).join('')+'</div>';
  if(!total) h+='<div class="card"><div class="mini">Nothing found for &ldquo;'+esc(q)+'&rdquo;.</div></div>';
  if(window.__docs===null) window.__loadDocs(function(){ try{ if(typeof homeResultsOnly==='function') homeResultsOnly(); }catch(e){} });
  return h;
};
/* the Info tab search should reach people & notes too */
window.infoResultsHTML=function(q){ return window.searchResults(q); };
})();

/* ===== v100 · Notes & numbers sheet ===== */
(function(){
window.__nq='';
function body(){
  var q=String(window.__nq||'').trim().toLowerCase();
  var ns=(D.notes||[]).slice().sort(function(a,b){ return String(b.updated_at||'').localeCompare(String(a.updated_at||'')); });
  var cs=(D.contacts||[]).slice().sort(function(a,b){ return (a.sort||0)-(b.sort||0)||String(a.name||'').localeCompare(String(b.name||'')); });
  var vs=[];
  if(q){
    ns=ns.filter(function(n){ return qmatch([n.title,String(n.body||'').replace(/<[^>]*>/g,' ')].join(' '),q); });
    cs=cs.filter(function(c){ return qmatch([c.name,c.role,c.phone,c.email,c.notes].join(' '),q); });
    vs=(D.vault_items||[]).filter(function(it){ return qmatch([it.title,it.body].join(' '),q); });
  }
  var h='';
  if(cs.length) h+='<div class="sect">People &amp; numbers</div><div class="card">'+cs.map(window.__contactRow).join('')+'</div>';
  if(vs.length) h+='<div class="sect">Info vault</div><div class="card">'+vs.map(function(it){return window.__infoRow(it,q);}).join('')+'</div>';
  h+='<div class="sect">Notes</div><div class="card">'+(ns.length?ns.map(function(n){
      var t=n.trip_id?(D.trips||[]).find(function(x){return x.id===n.trip_id;}):null;
      var first=String(n.body||'').replace(/<[^>]*>/g,' ').split('\n').filter(function(l){return l.trim();})[0]||'';
      return '<div class="list-item" style="cursor:pointer" onclick="viewNote(\''+n.id+'\')"><div class="li-main"><div class="h">'+esc(n.title||first||'Untitled')+'</div><div class="sub">'+(t?'&#9992;&#65039; '+esc(t.title)+' · ':'')+esc(first).slice(0,60)+'</div></div><div class="chev">&#8250;</div></div>';
    }).join(''):'<div class="mini">'+(q?'No notes match.':'No notes yet.')+'</div>')+'</div>';
  if(!q&&!cs.length) h+='<div class="mini" style="margin-top:8px">Passports, HN numbers and logins live in <b>Info</b>. Search above to reach them from here.</div>';
  return h;
}
window.__notesFilter=function(){ var b=document.getElementById('notesBody'); if(b) b.innerHTML=body(); };
window.openNotes=function(){
  openSheet('<h3>Notes &amp; numbers</h3>'
    +'<div class="searchbar"><span class="ic">&#128269;</span><input id="notesSearch" placeholder="Search notes, people, numbers…" value="'+esc(window.__nq)+'" oninput="window.__nq=this.value;window.__notesFilter()"><span class="ic" style="cursor:pointer" onclick="window.__nq=\'\';document.getElementById(\'notesSearch\').value=\'\';window.__notesFilter()">&#10005;</span></div>'
    +'<div id="notesBody">'+body()+'</div>'
    +'<button class="btn primary block" style="margin-top:12px" onclick="editNote(\'\')">+ New note</button>'
    +'<button class="btn ghost block" style="margin-top:8px" onclick="editContact()">+ New contact</button>');
};
})();

/* ===== v100 · contacts carry their notes (HN numbers, refs) ===== */
(function(){
var _rMore=window.rMore;
window.rMore=function(){
  _rMore();
  try{
    var v=document.getElementById('v-more'); if(!v) return;
    var card=v.querySelector('.card'); if(!card) return;
    var cs=(D.contacts||[]).slice().sort(function(a,b){ return (a.sort||0)-(b.sort||0)||String(a.name||'').localeCompare(String(b.name||'')); });
    card.innerHTML=cs.length?cs.map(window.__contactRow).join(''):'<div class="mini">No contacts yet.</div>';
  }catch(e){}
};
window.editContact=function(id){
  var c=id?((D.contacts||[]).find(function(x){return x.id===id;})||{}):{};
  openSheet('<h3>'+(id?'Edit contact':'New contact')+'</h3>'
    +'<label class="f">Name</label><input id="c_name" value="'+esc(c.name)+'">'
    +'<label class="f">Role</label><input id="c_role" value="'+esc(c.role)+'" placeholder="Lawyer / Hospital / Bank">'
    +'<label class="f">Phone</label><input id="c_phone" value="'+esc(c.phone)+'">'
    +'<label class="f">Email</label><input id="c_email" value="'+esc(c.email)+'">'
    +'<label class="f">Notes — reference numbers, HN, anything searchable</label><textarea id="c_notes" style="min-height:110px">'+esc(c.notes)+'</textarea>'
    +'<label class="f">Dropbox folder (optional)</label><input id="c_drop" value="'+esc(c.dropbox_path)+'" placeholder="/Documents/…">'
    +'<button class="btn primary block" style="margin-top:16px" onclick="saveContact(\''+(id||'')+'\')">Save</button>'
    +(id?'<button class="btn ghost block" style="margin-top:8px" onclick="delContact(\''+id+'\')">Delete</button>':''));
};
window.saveContact=async function(id){
  var name=el('c_name').value.trim(); if(!name){ toast('Add a name'); return; }
  await put('contacts',{id:id||undefined,name:name,role:el('c_role').value.trim(),phone:el('c_phone').value.trim(),
    email:el('c_email').value.trim(),notes:el('c_notes').value,dropbox_path:el('c_drop').value.trim()||null});
  closeSheet(); toast('Saved'); render();
};
})();

/* ===== v100 · inbox emails render as the sender wrote them ===== */
(function(){
function fmtDT(s){ try{ return new Date(s).toLocaleString('en-GB',{timeZone:'Asia/Bangkok',day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}); }catch(e){ return s||''; } }
window.openInboxEmail=async function(id){
  var res=await sb.from('inbox_emails').select('*').eq('id',id).single();
  if(res.error||!res.data){ toast('Could not load email'); return; }
  var m=res.data;
  var hasHtml=!!(m.body_html&&String(m.body_html).trim());
  var head='<h3>&#9993;&#65039; '+esc(m.subject||'(no subject)')+'</h3><div class="mini">'+esc(m.from_addr||'')+' · '+fmtDT(m.received_at)+'</div>';
  var pane=hasHtml
    ? '<iframe id="mailFrame" sandbox="allow-popups allow-popups-to-escape-sandbox" referrerpolicy="no-referrer" style="width:100%;height:60vh;border:1px solid var(--line);border-radius:12px;background:#fff;margin-top:10px"></iframe>'
      +'<button class="btn ghost sm" style="margin-top:8px" onclick="window.__mailPlain(\''+id+'\')">&#128196; Plain text</button>'
    : '<div style="white-space:pre-wrap;font-size:13.5px;margin-top:10px;max-height:55vh;overflow:auto">'+esc(m.body_text||'')+'</div>';
  openSheet(head+pane+'<div id="mailDocs" style="margin-top:12px"></div>'
    +'<div class="btn-row" style="margin-top:10px"><button class="btn ghost sm" onclick="openInbox()">&#8249; Inbox</button>'
    +'<button class="btn ghost sm" onclick="copy('+window.__jq(m.body_text||'')+')">&#10696; Copy text</button></div>');
  if(hasHtml){
    var f=document.getElementById('mailFrame');
    if(f) f.srcdoc='<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><base target="_blank"><style>html,body{margin:0;padding:10px;font:14px/1.5 -apple-system,system-ui,sans-serif;color:#222;word-break:break-word}img{max-width:100%;height:auto}table{max-width:100%}</style>'+String(m.body_html);
  }
  window.__mailCache=window.__mailCache||{}; window.__mailCache[id]=m;
  var dr=await sb.from('documents').select('id,title,mime').eq('email_id',id);
  var b=document.getElementById('mailDocs');
  if(b&&dr&&dr.data&&dr.data.length) b.innerHTML='<label class="f">Attachments</label>'+dr.data.map(function(d){ return window.__docRow(d); }).join('');
};
window.__mailPlain=function(id){
  var m=(window.__mailCache||{})[id]; if(!m) return;
  var f=document.getElementById('mailFrame'); if(!f) return;
  var d=document.createElement('div');
  d.style.cssText='white-space:pre-wrap;font-size:13.5px;margin-top:10px;max-height:55vh;overflow:auto';
  d.textContent=m.body_text||'(no plain text)';
  f.replaceWith(d);
};
})();

/* ===== v100 · wallet crypto — card numbers encrypted at rest ===== */
(function(){
var W=window.__W={mk:null,exp:0};
var SC=(window.crypto&&window.crypto.subtle)?window.crypto.subtle:null;
window.__wcrypto=!!SC;
function b64e(b){ var a=new Uint8Array(b),s='',i; for(i=0;i<a.length;i++) s+=String.fromCharCode(a[i]); return btoa(s); }
function b64d(s){ var bin=atob(String(s||'')),a=new Uint8Array(bin.length),i; for(i=0;i<bin.length;i++) a[i]=bin.charCodeAt(i); return a; }
function cat(a,b){ var o=new Uint8Array(a.length+b.length); o.set(a,0); o.set(b,a.length); return o; }
window.__b64e=b64e; window.__b64d=b64d;
var SALT_INFO='ajhub-wallet-v1';

function live(){ return W.mk && Date.now()<W.exp; }
window.__wLive=live;
function touch(){ W.exp=Date.now()+180000; }
window.__wLock=function(){ W.mk=null; W.exp=0; };

async function kekFromPin(pin,salt){
  var base=await SC.importKey('raw',new TextEncoder().encode(String(pin)),'PBKDF2',false,['deriveKey']);
  return SC.deriveKey({name:'PBKDF2',salt:salt,iterations:250000,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['wrapKey','unwrapKey']);
}
async function kekFromRaw(raw){
  return SC.importKey('raw',raw.slice(0,32),{name:'AES-GCM'},false,['wrapKey','unwrapKey']);
}
async function wrapMk(mk,kek){
  var iv=crypto.getRandomValues(new Uint8Array(12));
  var w=await SC.wrapKey('raw',mk,kek,{name:'AES-GCM',iv:iv});
  return b64e(cat(iv,new Uint8Array(w)));
}
async function unwrapMk(blob,kek){
  var raw=b64d(blob);
  return SC.unwrapKey('raw',raw.slice(12),kek,{name:'AES-GCM',iv:raw.slice(0,12)},{name:'AES-GCM',length:256},true,['encrypt','decrypt']);
}
window.__wEnc=async function(s){ touch(); var iv=crypto.getRandomValues(new Uint8Array(12));
  var ct=await SC.encrypt({name:'AES-GCM',iv:iv},W.mk,new TextEncoder().encode(String(s))); return b64e(cat(iv,new Uint8Array(ct))); };
window.__wDec=async function(b){ touch(); var raw=b64d(b);
  var pt=await SC.decrypt({name:'AES-GCM',iv:raw.slice(0,12)},W.mk,raw.slice(12)); return new TextDecoder().decode(pt); };

window.__wKeys=async function(){ try{ var r=await sb.from('wallet_keys').select('*'); return (r&&r.data)||[]; }catch(e){ return []; } };

/* --- biometric (WebAuthn PRF) --- */
function prfExt(){ return {prf:{eval:{first:new TextEncoder().encode(SALT_INFO)}}}; }
async function prfGet(credId){
  var pk={challenge:crypto.getRandomValues(new Uint8Array(32)),userVerification:'required',timeout:60000,extensions:prfExt()};
  if(credId) pk.allowCredentials=[{type:'public-key',id:b64d(credId)}];
  var a=await navigator.credentials.get({publicKey:pk});
  var r=a.getClientExtensionResults?a.getClientExtensionResults():{};
  if(!r.prf||!r.prf.results||!r.prf.results.first) throw new Error('This device did not return a biometric key (PRF unsupported).');
  return {raw:new Uint8Array(r.prf.results.first),id:b64e(a.rawId)};
}
window.__wBioAvailable=function(){ return !!(window.PublicKeyCredential&&navigator.credentials&&navigator.credentials.create); };
window.__wBioAdd=async function(){
  if(!live()) throw new Error('Unlock the wallet first.');
  var uidb=new TextEncoder().encode(String((window.USER&&USER.id)||'ajhub'));
  var cred=await navigator.credentials.create({publicKey:{
    challenge:crypto.getRandomValues(new Uint8Array(32)),
    rp:{name:'A+J Hub'},
    user:{id:uidb,name:(window.USER&&USER.email)||'aj@jjaj.info',displayName:'A+J Hub wallet'},
    pubKeyCredParams:[{type:'public-key',alg:-7},{type:'public-key',alg:-257}],
    authenticatorSelection:{authenticatorAttachment:'platform',userVerification:'required',residentKey:'preferred'},
    timeout:60000, extensions:{prf:{}}
  }});
  var id=b64e(cred.rawId);
  var got=await prfGet(id);
  var kek=await kekFromRaw(got.raw);
  var wrapped=await wrapMk(W.mk,kek);
  await sb.from('wallet_keys').upsert({id:'bio:'+got.id,wrapped:wrapped,cred_id:got.id,label:'Face ID / fingerprint'});
  try{ localStorage.setItem('aj_wbio',got.id); }catch(e){}
  return true;
};
window.__wBioUnlock=async function(){
  var rows=(await window.__wKeys()).filter(function(r){ return r.id.indexOf('bio:')===0; });
  if(!rows.length) throw new Error('No biometric key registered on this account.');
  var pref=null; try{ pref=localStorage.getItem('aj_wbio'); }catch(e){}
  var got=await prfGet(pref&&rows.some(function(r){return r.cred_id===pref;})?pref:rows[0].cred_id);
  var row=rows.find(function(r){ return r.cred_id===got.id; })||rows[0];
  var kek=await kekFromRaw(got.raw);
  W.mk=await unwrapMk(row.wrapped,kek); touch();
  try{ localStorage.setItem('aj_wbio',got.id); }catch(e){}
  return true;
};

/* --- PIN --- */
window.__wPinSetup=async function(pin){
  var salt=crypto.getRandomValues(new Uint8Array(16));
  var mk=await SC.generateKey({name:'AES-GCM',length:256},true,['encrypt','decrypt']);
  var kek=await kekFromPin(pin,salt);
  var wrapped=await wrapMk(mk,kek);
  var r=await sb.from('wallet_keys').upsert({id:'pin',salt:b64e(salt),wrapped:wrapped,label:'PIN'});
  if(r&&r.error) throw new Error(r.error.message);
  W.mk=mk; touch(); return true;
};
window.__wPinUnlock=async function(pin){
  var rows=await window.__wKeys();
  var row=rows.find(function(r){ return r.id==='pin'; });
  if(!row) throw new Error('No PIN set yet.');
  var kek=await kekFromPin(pin,b64d(row.salt));
  try{ W.mk=await unwrapMk(row.wrapped,kek); }catch(e){ throw new Error('Wrong PIN.'); }
  touch(); return true;
};
window.__wPinChange=async function(pin){
  if(!live()) throw new Error('Unlock first.');
  var salt=crypto.getRandomValues(new Uint8Array(16));
  var kek=await kekFromPin(pin,salt);
  var wrapped=await wrapMk(W.mk,kek);
  await sb.from('wallet_keys').upsert({id:'pin',salt:b64e(salt),wrapped:wrapped,label:'PIN'});
  return true;
};
})();

/* ===== v100 · Wallet UI — locked cards, biometric or PIN ===== */
(function(){
function mask(n){ var d=String(n||'').replace(/\D/g,''); return d.length>=4?('•••• '+d.slice(-4)):'••••'; }
window.__wCards=[]; window.__wPlain={};
function cardHTML(c,open){
  var val=open?(window.__wPlain[c.id]||'…'):(c.enc?(c.number||'••••'):String(c.number||''));
  var act=c.enc?('window.__wCopy(\''+c.id+'\')'):('copy('+window.__jq(c.number||'')+')');
  return '<div class="wcard" onclick="'+act+'"><div class="wc-t">'+(c.icon||'&#128179;')+' '+esc(c.title)+'</div>'
    +(c.subtitle?'<div class="wc-s">'+esc(c.subtitle)+'</div>':'')
    +'<div class="wc-n">'+esc(val)+'</div>'
    +'<div class="wc-c">'+(c.enc&&!open?'locked — unlock to reveal':'tap to copy')+'</div></div>';
}
window.__wCopy=async function(id){
  var c=window.__wCards.find(function(x){return x.id===id;}); if(!c) return;
  if(!c.enc){ copy(c.number||''); return; }
  if(!window.__wLive()){ window.__wUnlockUI(); return; }
  try{ copy(await window.__wDec(c.enc)); }catch(e){ toast('Could not decrypt'); }
};
window.openCards=async function(){
  openSheet('<h3>Wallet</h3><div id="walletBox"><div class="mini">Loading…</div></div>');
  try{
    var r=await Promise.all([
      sb.from('wallet_cards').select('*').order('sort'),
      sb.from('documents').select('id,title,mime,is_card').eq('is_card',true).order('title'),
      window.__wKeys()
    ]);
    window.__wCards=(r[0]&&r[0].data)||[];
    window.__wDocs=(r[1]&&r[1].data)||[];
    window.__wHasKey=r[2].some(function(k){ return k.id==='pin'||k.id.indexOf('bio:')===0; });
    window.__wHasBio=r[2].some(function(k){ return k.id.indexOf('bio:')===0; });
    window.__wPaint();
  }catch(e){ var b=document.getElementById('walletBox'); if(b) b.innerHTML='<div class="mini">Wallet unavailable offline.</div>'; }
};
window.__wPaint=function(){
  var b=document.getElementById('walletBox'); if(!b) return;
  var open=window.__wLive(), cards=window.__wCards||[], h='';
  var anyEnc=cards.some(function(c){ return !!c.enc; });
  var anyPlain=cards.some(function(c){ return !c.enc&&c.number; });
  if(anyEnc&&!open){
    h+='<div class="card" style="margin-bottom:10px"><div class="mini">&#128274; Card numbers are encrypted. Unlock to reveal or copy them.</div>'
      +'<div class="btn-row" style="margin-top:10px">'
      +(window.__wHasBio&&window.__wBioAvailable()?'<button class="btn primary" onclick="window.__wDoBio()">&#9757;&#65039; Face ID / fingerprint</button>':'')
      +'<button class="btn ghost" onclick="window.__wPinUI()">&#128273; PIN</button></div></div>';
  }
  h+=cards.length?cards.map(function(c){ return cardHTML(c,open); }).join(''):'<div class="mini">No cards yet.</div>';
  if(open) h+='<div class="btn-row" style="margin-top:10px"><button class="btn ghost sm" onclick="window.__wLock();window.__wPaint();toast(\'Locked\')">&#128274; Lock</button>'
    +(window.__wBioAvailable()?'<button class="btn ghost sm" onclick="window.__wAddBio()">&#9757;&#65039; '+(window.__wHasBio?'Re-add':'Add')+' Face ID</button>':'')
    +'<button class="btn ghost sm" onclick="window.__wPinUI(1)">&#128273; Change PIN</button></div>';
  if(!window.__wHasKey&&window.__wOfferLock) h+='<button class="btn primary block" style="margin-top:12px" onclick="window.__wSetupUI()">&#128274; Protect this wallet</button>';
  h+='<button class="btn ghost block" style="margin-top:8px" onclick="window.__wEditCard()">+ Add card</button>';
  if(anyPlain&&window.__wHasKey&&open) h+='<button class="btn ghost block" style="margin-top:8px" onclick="window.__wMigrate()">&#128274; Encrypt the remaining plain cards</button>';
  if(!window.__wHasKey) h+='<div class="mini" style="margin-top:14px;opacity:.6">Numbers are stored as typed — signing in to the app is the lock. <span style="text-decoration:underline;cursor:pointer" onclick="window.__wOfferLock=1;window.__wSetupUI()">Add a PIN on top</span> if you ever want one.</div>';
  var docs=window.__wDocs||[];
  if(docs.length) h+='<label class="f" style="margin-top:14px">Cards to show (PDF)</label>'+docs.map(function(d){ return window.__docRow(d); }).join('');
  b.innerHTML=h;
  if(open) (cards.filter(function(c){return c.enc;})).forEach(function(c){
    window.__wDec(c.enc).then(function(v){ window.__wPlain[c.id]=v;
      var bb=document.getElementById('walletBox'); if(bb&&window.__wLive()) window.__wRefreshVals(); }).catch(function(){});
  });
};
window.__wRefreshVals=function(){
  var b=document.getElementById('walletBox'); if(!b) return;
  var ns=b.querySelectorAll('.wcard .wc-n'), i;
  for(i=0;i<ns.length;i++){ var c=window.__wCards[i]; if(c&&c.enc&&window.__wPlain[c.id]) ns[i].textContent=window.__wPlain[c.id]; }
};
window.__wDoBio=async function(){ try{ await window.__wBioUnlock(); toast('Unlocked'); window.__wPaint(); }catch(e){ toast(String(e.message||e).slice(0,80)); } };
window.__wAddBio=async function(){ try{ await window.__wBioAdd(); window.__wHasBio=true; toast('Face ID added'); window.__wPaint(); }catch(e){ toast(String(e.message||e).slice(0,90)); } };
window.__wPinUI=function(change){
  openSheet('<h3>'+(change?'Change PIN':'Wallet PIN')+'</h3><label class="f">'+(change?'New PIN (6+ digits)':'Enter your PIN')+'</label>'
    +'<input id="wpin" type="password" inputmode="numeric" autocomplete="off">'
    +'<button class="btn primary block" style="margin-top:14px" onclick="window.__wPinGo('+(change?1:0)+')">'+(change?'Save':'Unlock')+'</button>'
    +'<button class="btn ghost block" style="margin-top:8px" onclick="openCards()">‹ Back to wallet</button>');
  setTimeout(function(){ var i=document.getElementById('wpin'); if(i) i.focus(); },120);
};
window.__wPinGo=async function(change){
  var p=(document.getElementById('wpin')||{}).value||'';
  try{
    if(change){ if(p.length<6){ toast('At least 6 digits'); return; } await window.__wPinChange(p); toast('PIN changed'); }
    else { await window.__wPinUnlock(p); toast('Unlocked'); }
    openCards();
  }catch(e){ toast(String(e.message||e).slice(0,80)); }
};
window.__wSetupUI=function(){
  openSheet('<h3>Protect this wallet</h3><div class="mini">Card numbers get encrypted on this device before they are saved. The server only ever stores the ciphertext — nobody without your PIN or your face can read them.</div>'
    +'<label class="f" style="margin-top:12px">Choose a PIN (6+ digits)</label><input id="wpin" type="password" inputmode="numeric" autocomplete="off">'
    +'<label class="f">Confirm</label><input id="wpin2" type="password" inputmode="numeric" autocomplete="off">'
    +'<button class="btn primary block" style="margin-top:14px" onclick="window.__wSetupGo()">Encrypt wallet</button>'
    +'<div class="mini" style="margin-top:10px">Lose the PIN and the numbers are gone — there is no reset. Add Face ID afterwards for one-tap unlock.</div>');
};
window.__wSetupGo=async function(){
  var a=(document.getElementById('wpin')||{}).value||'', b=(document.getElementById('wpin2')||{}).value||'';
  if(a.length<6){ toast('At least 6 digits'); return; }
  if(a!==b){ toast('PINs do not match'); return; }
  try{ await window.__wPinSetup(a); await window.__wMigrate(1); toast('Wallet encrypted'); openCards(); }
  catch(e){ toast(String(e.message||e).slice(0,90)); }
};
window.__wMigrate=async function(quiet){
  var cards=window.__wCards||[], i, n=0;
  for(i=0;i<cards.length;i++){
    var c=cards[i]; if(c.enc||!c.number) continue;
    var enc=await window.__wEnc(c.number);
    await sb.from('wallet_cards').update({enc:enc,number:mask(c.number)}).eq('id',c.id);
    window.__wPlain[c.id]=c.number; c.enc=enc; c.number=mask(c.number); n++;
  }
  if(!quiet){ toast(n?('Encrypted '+n+' card'+(n===1?'':'s')):'Nothing left to encrypt'); openCards(); }
  return n;
};
window.__wEditCard=function(id){
  var c=id?((window.__wCards||[]).find(function(x){return x.id===id;})||{}):{};
  openSheet('<h3>'+(id?'Edit card':'Add card')+'</h3>'
    +'<label class="f">Name</label><input id="wc_t" value="'+esc(c.title)+'" placeholder="e.g. HSBC Visa">'
    +'<label class="f">Subtitle</label><input id="wc_s" value="'+esc(c.subtitle)+'" placeholder="expiry, holder, anything">'
    +'<label class="f">Number '+(window.__wHasKey?'(encrypted before it leaves this phone)':'')+'</label><input id="wc_n" inputmode="numeric" placeholder="'+(id&&c.enc?'leave blank to keep':'')+'">'
    +'<label class="f">Icon</label><input id="wc_i" value="'+esc(c.icon||'💳')+'">'
    +'<button class="btn primary block" style="margin-top:14px" onclick="window.__wSaveCard(\''+(id||'')+'\')">Save</button>'
    +(id?'<button class="btn ghost block" style="margin-top:8px" onclick="window.__wDelCard(\''+id+'\')">Delete</button>':'')
    +'<button class="btn ghost block" style="margin-top:8px" onclick="openCards()">‹ Back to wallet</button>');
};
window.__wSaveCard=async function(id){
  var t=(document.getElementById('wc_t')||{}).value||''; if(!t.trim()){ toast('Add a name'); return; }
  var num=(document.getElementById('wc_n')||{}).value||'';
  var row={title:t.trim(),subtitle:((document.getElementById('wc_s')||{}).value||'').trim(),icon:((document.getElementById('wc_i')||{}).value||'💳').trim()};
  if(id) row.id=id;
  if(num.trim()){
    if(window.__wHasKey){
      if(!window.__wLive()){ toast('Unlock the wallet first'); window.__wPinUI(); return; }
      row.enc=await window.__wEnc(num.trim()); row.number=mask(num.trim());
    } else { row.number=num.trim(); }
  }
  try{ var r=await sb.from('wallet_cards').upsert(row); if(r&&r.error) throw new Error(r.error.message); toast('Saved'); openCards(); }
  catch(e){ toast(String(e.message||e).slice(0,90)); }
};
window.__wDelCard=async function(id){
  if(!confirm('Delete this card?')) return;
  await sb.from('wallet_cards').delete().eq('id',id); toast('Deleted'); openCards();
};
})();

/* ===== v101 · wallet unlock router — tapping a locked card asks for PIN/Face ID ===== */
(function(){
window.__wUnlockUI=function(){
  if(!window.__wHasKey){ window.__wSetupUI(); return; }
  if(window.__wHasBio&&window.__wBioAvailable()){ window.__wDoBio(); return; }
  window.__wPinUI(0);
};
})();

/* ===== v103 · Info rows show the actual numbers, not just the first line ===== */
(function(){
function phoneOf(l){ var m=String(l).match(/\+\d[\d\s().\-]{6,}\d/); return m?m[0]:''; }
window.__infoRow=function(it,q){
  q=String(q||'').trim().toLowerCase();
  var jqf=window.__jq;
  var lines=String(it.body||'').split('\n').map(function(s){return s.trim();}).filter(Boolean);
  var show, more;
  if(q){
    var m=lines.filter(function(l){ return l.toLowerCase().indexOf(q)>-1; });
    if(!m.length) m=lines;
    show=m.slice(0,4); more=m.length-show.length;
  } else { show=lines.slice(0,3); more=lines.length-show.length; }
  var body=show.map(function(l){
    var safe=esc(l);
    if(q){ try{ safe=safe.replace(new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig'),'<b style="background:#ffe08a;border-radius:3px;padding:0 2px">$1</b>'); }catch(e){} }
    var tel=phoneOf(l), act='';
    if(tel) act='<a href="tel:'+tel.replace(/[^\d+]/g,'')+'" onclick="event.stopPropagation()" style="text-decoration:none;padding:0 3px;font-size:14px">&#128222;</a>';
    return '<div style="display:flex;align-items:flex-start;gap:6px;margin-top:3px">'
      +'<span style="flex:1;min-width:0;white-space:normal;word-break:break-word">'+safe+'</span>'+act
      +'<span onclick="event.stopPropagation();copy('+jqf(l)+')" style="padding:0 3px;opacity:.5;cursor:pointer;font-size:14px">&#10696;</span></div>';
  }).join('');
  if(more>0) body+='<div style="opacity:.5;margin-top:3px">+'+more+' more&#8230;</div>';
  if(!body) body='<div style="opacity:.5">&#8212;</div>';
  return '<div class="list-item"><div class="li-main" onclick="viewInfo('+jqf(it.id)+')">'
    +'<div class="h">'+(it.is_secret?'&#128274; ':'')+esc(it.title)+'</div>'
    +'<div class="sub" style="white-space:normal;line-height:1.5;margin-top:3px">'+body+'</div></div></div>';
};
window.infoRow=function(it){ return window.__infoRow(it,''); };
})();


/* ===== v104 — information architecture cleanup =====================
   Fixes the three complaints: "can't find anything", "duplicates",
   "confusing menus".
   • Bottom nav: 5 labelled tabs — Home · Travel · Notes · Info · More
   • Header cut from 8 unlabelled glyphs to 2: one global Search + Inbox
   • Contacts/people live in ONE place (Info) — the duplicate lists in
     More and in the Notes sheet are gone
   • Trips + Flights merged into Travel
   • Calendar / F1 / News / Wallet become labelled rows inside More
   ================================================================= */
(function(){
'use strict';
function E(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function J(s){return JSON.stringify(String(s==null?'':s)).replace(/"/g,'&quot;');}

/* ---------- 0. capture the handlers that live on the old header ---------- */
var _openCal=null,_openF1=null;
try{ var _c=document.getElementById('hdrCal'); if(_c) _openCal=_c.onclick; }catch(e){}
try{ var _f=document.getElementById('hdrF1'); if(_f) _openF1=_f.onclick; }catch(e){}
window.__openCal=function(){ if(_openCal) _openCal.call(document.getElementById('hdrCal')||window); };
window.__openF1 =function(){ if(_openF1)  _openF1.call(document.getElementById('hdrF1')||window); };

/* ---------- 1. slim the header down to logo + search + inbox ---------- */
function slimHeader(){
  ['hdrTrips','hdrNews','hdrNotes','hdrCal','hdrWallet'].forEach(function(id){
    var e=document.getElementById(id);
    if(e){ e.style.display='none'; e.setAttribute('aria-hidden','true'); e.tabIndex=-1; }
  });
}
slimHeader(); setTimeout(slimHeader,900); setTimeout(slimHeader,2000);

/* ---------- 2. extra CSS ---------- */
var css=document.createElement('style');
css.textContent='.tab{padding:4px 5px!important}.tab .ic{font-size:20px!important}'
 +'.mrow .h{font-weight:700}.mrow .sub{color:var(--muted)}'
 +'.sect .add{float:right;font-weight:700;color:var(--teal);cursor:pointer;font-style:italic}';
document.head.appendChild(css);

/* ---------- 3. new view containers ---------- */
var main=document.querySelector('main.wrap');
function mkView(id){
  if(document.getElementById(id)||!main) return;
  var s=document.createElement('section'); s.className='view'; s.id=id;
  var foot=main.querySelector('.foot');
  if(foot) main.insertBefore(s,foot); else main.appendChild(s);
}
mkView('v-travel'); mkView('v-notes');

/* ---------- 4. five labelled tabs ---------- */
var nav=document.querySelector('nav.tabs .inner');
if(nav){
  nav.innerHTML=[['home','🏠','Home'],['travel','✈️','Travel'],
                 ['notes','📒','Notes'],['info','🔐','Info'],
                 ['more','⚙️','More']]
   .map(function(t){return '<button class="tab'+(t[0]===((typeof cur!=='undefined')?cur:'home')?' active':'')
     +'" data-v="'+t[0]+'"><span class="ic">'+t[1]+'</span>'+t[2]+'</button>';}).join('');
  Array.prototype.forEach.call(nav.querySelectorAll('.tab'),function(b){
    b.onclick=function(){ go(b.getAttribute('data-v')); };
  });
}

/* ---------- 5. shared row builders ---------- */
function fmtRange(t){ try{
  var a=t.start_date?fmtD(t.start_date):'';
  var b=(t.end_date&&t.end_date!==t.start_date)?(' — '+fmtShort(t.end_date)):'';
  return a+b; }catch(e){ return t.start_date||''; } }

function tripRow(t,n){
  return '<div class="list-item" style="cursor:pointer" onclick="openTrip(\''+t.id+'\')">'
   +'<div class="li-main"><div class="h">✈️ '+E(t.title)+'</div>'
   +'<div class="sub">'+E(fmtRange(t))+(n?' · <span style="color:#a23;font-weight:700">'+n+' to-do open</span>':'')+'</div></div>'
   +'<div class="chev">›</div></div>';
}
function flightRow(f){
  var tt=(D.trips||[]).find(function(x){return x.id===f.trip_id;});
  var sub=[fmtD(f.fdate),f.ftime,f.pax,tt?tt.title:''].filter(Boolean).join(' · ')+(f.conf?' · '+E(f.conf):'');
  return '<div class="list-item" style="cursor:pointer" onclick="flightActions(\''+f.id+'\')">'
   +'<div class="ava">✈️</div><div class="li-main">'
   +'<div class="h">'+E(f.from_code||'?')+' → '+E(f.to_code||'?')
   +' <span class="mini" style="font-weight:400">'+E(f.flight_no||'')+'</span></div>'
   +'<div class="sub">'+sub+'</div></div><div class="chev">›</div></div>';
}

/* to-do counts, fetched once and cached */
var TD={},TDdone=false;
function loadTD(cb){
  if(TDdone){ cb&&cb(); return; }
  try{ sb.from('trip_checklist').select('trip_id,status').then(function(r){
    (r.data||[]).forEach(function(c){ if(c.status!=='done'&&c.status!=='superseded'&&c.status!=='expired') TD[c.trip_id]=(TD[c.trip_id]||0)+1; });
    TDdone=true; cb&&cb();
  }); }catch(e){ TDdone=true; cb&&cb(); }
}

/* ---------- 6. TRAVEL — trips + flights in one place ---------- */
window.rTravel=function(){
  var v=document.getElementById('v-travel'); if(!v) return;
  var tk=new Date().toISOString().slice(0,10), t0=today();
  var trips=(D.trips||[]);
  var up=trips.filter(function(t){return t.start_date&&String(t.end_date||t.start_date).slice(0,10)>=tk;})
              .sort(function(a,b){return String(a.start_date).localeCompare(String(b.start_date));});
  var past=trips.filter(function(t){return t.start_date&&String(t.end_date||t.start_date).slice(0,10)<tk;})
              .sort(function(a,b){return String(b.start_date).localeCompare(String(a.start_date));});
  var fl=(D.flights||[]).slice().sort(function(a,b){return String(a.fdate||'9999').localeCompare(String(b.fdate||'9999'));});
  var fup=fl.filter(function(f){return parseD(f.fdate||'9999-12-31')>=t0;});
  var fpast=fl.filter(function(f){return parseD(f.fdate||'1900-01-01')<t0;}).reverse();

  var h='<div class="sect">Trips · '+up.length+'</div><div class="card">'
   +(up.length?up.map(function(t){return tripRow(t,TD[t.id]||0);}).join('')
             :'<div class="mini">No upcoming trips.</div>')+'</div>'
   +'<button class="btn ghost block" onclick="editTrip()">+ New trip</button>'
   +'<div class="sect">Flights · '+fup.length+'</div><div class="card">'
   +(fup.length?fup.map(flightRow).join(''):'<div class="mini">No upcoming flights.</div>')+'</div>';
  if(past.length||fpast.length){
    h+='<div class="mini" id="tvPastTog" style="margin-top:14px;color:var(--teal);cursor:pointer;font-weight:700">'
      +'Past · '+past.length+' trip'+(past.length===1?'':'s')+', '+fpast.length+' flight'+(fpast.length===1?'':'s')+' ›</div>'
      +'<div id="tvPast" style="display:none">'
      +(past.length?'<div class="sect">Past trips</div><div class="card">'+past.map(function(t){return tripRow(t,0);}).join('')+'</div>':'')
      +(fpast.length?'<div class="sect">Past flights</div><div class="card">'+fpast.map(flightRow).join('')+'</div>':'')
      +'</div>';
  }
  v.innerHTML=h;
  var tg=document.getElementById('tvPastTog');
  if(tg) tg.onclick=function(){ var l=document.getElementById('tvPast'); l.style.display=(l.style.display==='none')?'block':'none'; };
  if(!TDdone) loadTD(function(){ if(cur==='travel') window.rTravel(); });
};

/* ---------- 7. NOTES — notes only, no duplicated contacts ---------- */
var NQ='';
function noteList(){
  var q=NQ.trim().toLowerCase();
  var ns=(D.notes||[]).slice().sort(function(a,b){return String(b.updated_at||'').localeCompare(String(a.updated_at||''));});
  if(q) ns=ns.filter(function(n){
    return ((n.title||'')+' '+String(n.body||'').replace(/<[^>]*>/g,' ')).toLowerCase().indexOf(q)>-1; });
  return '<div class="sect">'+(q?ns.length+' result'+(ns.length===1?'':'s'):'All notes · '+ns.length)+'</div>'
   +'<div class="card">'+(ns.length?ns.map(window.__noteRow).join(''):'<div class="mini">No notes.</div>')+'</div>';
}
window.__nQ=function(s){ NQ=s; var b=document.getElementById('notesList'); if(b) b.innerHTML=noteList(); else window.rNotes(); };
window.rNotes=function(){
  var v=document.getElementById('v-notes'); if(!v) return;
  v.innerHTML='<div class="searchbar"><span class="ic">🔍</span>'
   +'<input id="notesQ" placeholder="Search notes…" value="'+E(NQ)+'" oninput="window.__nQ(this.value)">'
   +'<span class="ic" style="cursor:pointer" onclick="document.getElementById(\'notesQ\').value=\'\';window.__nQ(\'\')">✕</span></div>'
   +'<div id="notesList">'+noteList()+'</div>'
   +'<button class="btn primary block" style="margin-top:10px" onclick="editNote(\'\')">+ New note</button>';
};

/* ---------- 8. INFO — the single home for every number ---------- */
function contactsHTML(cs){
  return '<div class="sect">People &amp; numbers<span class="add" onclick="editContact()">+ add</span></div>'
   +'<div class="card">'+(cs.length?cs.map(window.__contactRow).join(''):'<div class="mini">No contacts yet.</div>')+'</div>';
}
var _rInfo=window.rInfo;
window.rInfo=function(){
  _rInfo();
  try{
    var im=document.getElementById('infoMain'); if(!im) return;
    var cs=(D.contacts||[]).slice().sort(function(a,b){
      return (a.sort||0)-(b.sort||0)||String(a.name||'').localeCompare(String(b.name||'')); });
    var d=document.createElement('div'); d.innerHTML=contactsHTML(cs);
    var anchor=im.querySelector('button.btn.ghost.block');
    if(anchor) im.insertBefore(d,anchor); else im.appendChild(d);
  }catch(e){}
};
/* the Info search now finds people too */
var _irh=window.infoResultsHTML;
window.infoResultsHTML=function(q){
  var h=_irh(q);
  try{
    var cs=(D.contacts||[]).filter(function(c){
      return qmatch([c.name,c.role,c.phone,c.email,c.notes].filter(Boolean).join(' '),q); });
    if(cs.length) h+='<div class="sect">People &amp; numbers · '+cs.length+'</div><div class="card">'
      +cs.map(window.__contactRow).join('')+'</div>';
  }catch(e){}
  return h;
};

/* ---------- 9. MORE — a labelled menu, not a junk drawer ---------- */
function mrow(icon,label,sub,fn){
  return '<div class="list-item mrow" style="cursor:pointer" onclick="'+fn+'">'
   +'<div class="li-main"><div class="h">'+icon+' '+E(label)+'</div><div class="sub">'+E(sub)+'</div></div>'
   +'<div class="chev">›</div></div>';
}
window.rMore=function(){
  var s=(D.settings&&D.settings[0])||{};
  var h='<div class="sect">Tools</div><div class="card">'
   +mrow('📅','Calendar','Agenda, week and month',"window.__openCal()")
   +mrow('💳','Wallet','Cards and documents',"openCards()")
   +mrow('🏎️','Formula 1','Next race, drivers, teams',"window.__openF1()")
   +mrow('📰','News','Telegraph and F1 headlines',"openNews()")
   +'</div>'
   +'<div class="sect">Names</div><div class="card">'
   +'<label class="f">Name 1</label><input id="n1" value="'+E(s.name1||'Adrian')+'">'
   +'<label class="f">Name 2</label><input id="n2" value="'+E(s.name2||'Jacqueline')+'">'
   +'<button class="btn primary block" style="margin-top:14px" onclick="saveNames()">Save</button></div>'
   +'<div class="sect">Account</div><div class="card">'
   +'<div class="mini">Signed in as '+E((typeof USER!=='undefined'&&USER&&USER.email)||'')+'. Same data on both phones.</div>'
   +'<button class="btn ghost block" style="margin-top:12px" onclick="changePw()">Change password</button>'
   +'<button class="btn ghost block" style="margin-top:8px" onclick="signOut()">Sign out</button></div>'
   +'<div class="sect">Install</div><div class="card"><div class="mini">'
   +'<b>Android (Chrome):</b> ⋮ → Install app. <b>iPhone (Safari):</b> Share → Add to Home Screen. '
   +'Works offline; syncs when back online.</div></div>'
   +'<div class="mini" style="text-align:center;margin-top:14px;color:var(--muted)">People and numbers now live in the '
   +'<b style="color:var(--teal);cursor:pointer" onclick="go(\'info\')">Info</b> tab.</div>';
  var v=document.getElementById('v-more'); if(v) v.innerHTML=h;
};

/* ---------- 10. ONE search that looks everywhere ---------- */
window.__find=function(q){
  var box=document.getElementById('findBody'); if(!box) return;
  q=String(q||'').trim();
  if(!q){ box.innerHTML='<div class="mini" style="padding:10px 2px">Searches notes, people, numbers, passports, trips and flights — everything in the app.</div>'; return; }
  var m=function(hay){ try{ return qmatch(hay,q); }catch(e){ return String(hay||'').toLowerCase().indexOf(q.toLowerCase())>-1; } };
  var h='',n=0;
  try{
    var cs=(D.contacts||[]).filter(function(c){return m([c.name,c.role,c.phone,c.email,c.notes].filter(Boolean).join(' '));});
    if(cs.length){ n+=cs.length; h+='<div class="sect">People &amp; numbers · Info</div><div class="card">'+cs.map(window.__contactRow).join('')+'</div>'; }
  }catch(e){}
  try{
    var vi=(D.vault_items||[]).filter(function(i){return m((i.title||'')+' '+(i.body||''));});
    if(vi.length){ n+=vi.length; h+='<div class="sect">Passports &amp; documents · Info</div><div class="card">'+vi.map(function(i){return window.infoRow(i);}).join('')+'</div>'; }
  }catch(e){}
  try{
    var ns=(D.notes||[]).filter(function(x){return m((x.title||'')+' '+String(x.body||'').replace(/<[^>]*>/g,' '));});
    if(ns.length){ n+=ns.length; h+='<div class="sect">Notes · Notes</div><div class="card">'+ns.map(window.__noteRow).join('')+'</div>'; }
  }catch(e){}
  try{
    var ts=(D.trips||[]).filter(function(t){return m([t.title,t.dest,t.notes,t.resv].filter(Boolean).join(' '));});
    if(ts.length){ n+=ts.length; h+='<div class="sect">Trips · Travel</div><div class="card">'+ts.map(function(t){return tripRow(t,0);}).join('')+'</div>'; }
  }catch(e){}
  try{
    var fs=(D.flights||[]).filter(function(f){return m([f.from_code,f.to_code,f.flight_no,f.airline,f.conf,f.pax,f.notes].filter(Boolean).join(' '));});
    if(fs.length){ n+=fs.length; h+='<div class="sect">Flights · Travel</div><div class="card">'+fs.map(flightRow).join('')+'</div>'; }
  }catch(e){}
  box.innerHTML=n?('<div class="mini" style="margin:8px 2px 2px">'+n+' result'+(n===1?'':'s')+'</div>'+h)
                 :'<div class="mini" style="padding:10px 2px">No matches for “'+E(q)+'”.</div>';
};
window.openFind=function(q){
  openSheet('<h3>🔍 Find anything</h3>'
   +'<div class="searchbar"><span class="ic">🔍</span>'
   +'<input id="findQ" placeholder="Notes, people, numbers, trips, flights…" value="'+E(q||'')+'" oninput="window.__find(this.value)">'
   +'<span class="ic" style="cursor:pointer" onclick="document.getElementById(\'findQ\').value=\'\';window.__find(\'\')">✕</span></div>'
   +'<div id="findBody"></div>');
  window.__find(q||'');
  setTimeout(function(){ var i=document.getElementById('findQ'); if(i){ try{i.focus();}catch(e){} } },140);
};
function bindSearch(){
  var b=document.getElementById('hdrSearch');
  if(b) b.onclick=function(){ document.body.classList.remove('searching'); window.openFind(''); };
}
bindSearch(); setTimeout(bindSearch,900); setTimeout(bindSearch,2000);

/* ---------- 11. old entry points now land on the new tabs ---------- */
window.openNotes=function(){ go('notes'); };
window.openTrips=function(){ go('travel'); };

/* ---------- 12. route the new views ---------- */
var _render=window.render;
window.render=function(){
  if(typeof cur!=='undefined'){
    if(cur==='travel'){ try{document.getElementById('fab').classList.add('hide');}catch(e){} return window.rTravel(); }
    if(cur==='notes') { try{document.getElementById('fab').classList.add('hide');}catch(e){} return window.rNotes(); }
  }
  return _render();
};
})();

/* ===== v105 — QUICK FILL =============================================
   Built for the split-screen workflow: app on the left, Chrome on the
   right. Open the site from here, then tap any value to copy it.
   Every field is read live from the vault, so nothing is duplicated.
   ===================================================================== */
(function(){
'use strict';
function E(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

/* ---------- css ---------- */
var st=document.createElement('style');
st.textContent='.ffrow{display:flex;align-items:center;gap:8px;padding:9px 10px;border-bottom:1px solid rgba(0,0,0,.07);cursor:pointer}'
 +'.ffrow:last-child{border-bottom:0}'
 +'.ffrow .l{flex:0 0 40%;font-size:12px;letter-spacing:.02em;color:var(--muted);text-transform:uppercase}'
 +'.ffrow .v{flex:1;font-weight:700;word-break:break-word;font-size:15px}'
 +'.ffrow .cp{opacity:.35;font-size:14px}'
 +'.ffrow.hit{background:rgba(16,150,120,.16)}'
 +'.ffchip{display:inline-block;padding:6px 11px;margin:0 6px 6px 0;border-radius:999px;border:1px solid var(--teal);'
 +'color:var(--teal);font-size:13px;font-weight:700;cursor:pointer;text-decoration:none}'
 +'.ffchip.on{background:var(--teal);color:#fff}'
 +'.ffgrp{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin:14px 2px 6px;font-weight:700}';
document.head.appendChild(st);

/* ---------- who does a line belong to ---------- */
function whose(s){
  s=' '+String(s||'')+' ';
  var aj=/adrian|\bAJ\b|\(AJ\)/i.test(s), jj=/jacqueline|\bjac\b|\bJJ\b|\(JJ\)/i.test(s);
  if(aj&&!jj) return 'aj';
  if(jj&&!aj) return 'jj';
  return '';
}
var URLRE=/https?:\/\/[^\s)]+/;

/* ---------- build the field list straight out of the vault ---------- */
function ffBuild(){
  var cats={}; (D.vault_categories||[]).forEach(function(c){ cats[c.id]=c; });
  var groups=[], links=[];
  (D.vault_items||[]).slice().sort(function(a,b){
    var ca=cats[a.category_id]||{}, cb=cats[b.category_id]||{};
    return (ca.sort||0)-(cb.sort||0)||(a.sort||0)-(b.sort||0)||String(a.title||'').localeCompare(String(b.title||''));
  }).forEach(function(it){
    var rows=[], lines=String(it.body||'').split(/\r?\n/), pend='';
    var nurl=(String(it.body||'').match(/https?:\/\//g)||[]).length;
    lines.forEach(function(ln){
      ln=ln.trim(); if(!ln) return;
      if(/^https?:\/\//.test(ln)){
        links.push({t:((nurl>1&&pend)?pend:it.title),u:ln,p:whose(pend)||whose(it.title)}); pend=''; return;
      }
      var mm=ln.match(/^([^:]{2,44}):\s*(.+)$/);
      if(mm&&URLRE.test(mm[2])){ links.push({t:mm[1].trim(),u:mm[2].match(URLRE)[0],p:whose(mm[1])||whose(it.title)}); pend=''; return; }
      if(mm){ rows.push({l:mm[1].trim(),v:mm[2].trim(),p:whose(mm[1])||whose(it.title)}); pend=''; return; }
      if(/:$/.test(ln)){ pend=ln.replace(/:$/,'').trim(); return; }
      pend='';
      if(ln.length<=72 && !/[.]$/.test(ln)) rows.push({l:'',v:ln,p:whose(ln)||whose(it.title)});
    });
    if(rows.length) groups.push({g:it.title,cat:(cats[it.category_id]||{}).name||'',rows:rows,p:whose(it.title)});
  });
  /* people & numbers from contacts, phone numbers are form fields too */
  var crows=(D.contacts||[]).filter(function(c){return c.phone||c.email;}).map(function(c){
    return {l:c.name,v:c.phone||c.email,p:''};
  });
  if(crows.length) groups.push({g:'Phone book',cat:'People & numbers',rows:crows,p:''});
  return {groups:groups,links:links};
}

/* ---------- state ---------- */
var FFQ='', FFP='';

function ffPaint(){
  var box=document.getElementById('ffBody'); if(!box) return;
  var d=ffBuild(), q=FFQ.trim().toLowerCase(), h='', n=0;

  /* site links */
  var seen={}, ls=d.links.filter(function(l){ if(seen[l.u]) return false; seen[l.u]=1; return true; });
  if(ls.length){
    h+='<div class="ffgrp">Open a site — then come back and tap to copy</div><div>'
      +ls.map(function(l){ return '<a class="ffchip" href="'+E(l.u)+'" target="_blank" rel="noopener">'+E(l.t)+' &#8599;</a>'; }).join('')
      +'</div>';
  }

  d.groups.forEach(function(g){
    var rows=g.rows.filter(function(r){
      if(FFP&&r.p&&r.p!==FFP) return false;
      if(FFP&&!r.p&&g.p&&g.p!==FFP) return false;
      if(!q) return true;
      return (g.g+' '+g.cat+' '+r.l+' '+r.v).toLowerCase().indexOf(q)>-1;
    });
    if(!rows.length) return;
    n+=rows.length;
    h+='<div class="ffgrp">'+E(g.g)+(g.cat?' <span style="opacity:.55">· '+E(g.cat)+'</span>':'')+'</div><div class="card" style="padding:0">'
      +rows.map(function(r){
        return '<div class="ffrow" data-v="'+E(r.v)+'"><div class="l">'+E(r.l||'—')+'</div>'
          +'<div class="v">'+E(r.v)+'</div><div class="cp">&#10697;</div></div>';
      }).join('')+'</div>';
  });
  if(!n) h+='<div class="mini" style="padding:16px 2px">Nothing matches “'+E(FFQ)+'”.</div>';
  box.innerHTML=h;
  Array.prototype.forEach.call(box.querySelectorAll('.ffrow'),function(r){
    r.onclick=function(){
      try{ copy(r.getAttribute('data-v')); }catch(e){}
      r.classList.add('hit'); setTimeout(function(){ r.classList.remove('hit'); },600);
    };
  });
}
window.__ffQ=function(s){ FFQ=s; ffPaint(); };
window.__ffP=function(p){
  FFP=p;
  Array.prototype.forEach.call(document.querySelectorAll('#ffWho .ffchip'),function(c){
    c.className='ffchip'+(c.getAttribute('data-p')===p?' on':'');
  });
  ffPaint();
};

window.openFill=function(){
  FFQ=''; FFP='';
  var s=(D.settings&&D.settings[0])||{};
  openSheet('<h3>&#129706; Quick fill</h3>'
   +'<div class="mini" style="margin:-4px 0 10px">Split the screen — this on the left, the form on the right. Tap any value to copy it.</div>'
   +'<div class="searchbar"><span class="ic">&#128269;</span>'
   +'<input id="ffQ" placeholder="passport, expiry, address, HN…" oninput="window.__ffQ(this.value)">'
   +'<span class="ic" style="cursor:pointer" onclick="document.getElementById(\'ffQ\').value=\'\';window.__ffQ(\'\')">&#10005;</span></div>'
   +'<div id="ffWho" style="margin:10px 0 2px">'
   +'<span class="ffchip on" data-p="" onclick="window.__ffP(\'\')">Both</span>'
   +'<span class="ffchip" data-p="aj" onclick="window.__ffP(\'aj\')">'+E(s.name1||'Adrian')+'</span>'
   +'<span class="ffchip" data-p="jj" onclick="window.__ffP(\'jj\')">'+E(s.name2||'Jacqueline')+'</span>'
   +'</div><div id="ffBody"></div>');
  ffPaint();
};

/* the old Wallet screen listed the same numbers again — it is now this */
window.openCards=function(){ window.openFill(); };

/* ---------- entry points ---------- */
/* More → Tools row */
var _rM=window.rMore;
if(_rM) window.rMore=function(){
  _rM();
  try{
    var v=document.getElementById('v-more'); if(!v) return;
    Array.prototype.forEach.call(v.querySelectorAll('.mrow'),function(r){
      if(/Wallet/.test(r.innerText||'')){
        r.setAttribute('onclick','openFill()');
        r.onclick=function(){ window.openFill(); };
        var hh=r.querySelector('.h'), ss=r.querySelector('.sub');
        if(hh) hh.innerHTML='&#129706; Quick fill';
        if(ss) ss.textContent='Every number, one tap to copy';
      }
    });
  }catch(e){}
};

/* Info tab — put it at the very top, that is where he looks */
var _rI=window.rInfo;
if(_rI) window.rInfo=function(){
  _rI();
  try{
    var im=document.getElementById('infoMain'); if(!im) return;
    if(document.getElementById('ffTop')) return;
    var d=document.createElement('div'); d.id='ffTop';
    d.innerHTML='<div class="card" style="cursor:pointer;display:flex;align-items:center;gap:10px" onclick="openFill()">'
      +'<div style="font-size:24px">&#129706;</div>'
      +'<div style="flex:1"><div style="font-weight:700">Quick fill</div>'
      +'<div class="mini">Passport, visa, address and HN numbers — tap to copy into a form</div></div>'
      +'<div class="chev">&#8250;</div></div>';
    im.insertBefore(d, im.firstChild);
  }catch(e){}
};
})();


/* ===== v107 — Calendar tab + dates-only trip editor =================
   1. Bottom nav gains Calendar: Home / Travel / Calendar / Notes / Info / More
      Calendar is a SHEET, not a view section, so its tab calls the captured
      header handler directly and must NOT go through go(), which looks up
      a non-existent #v-cal and would throw.
   2. Trip dates change far more often than anything else about a trip.
      Every trip row in Travel gets a date button opening a two-field
      dates-only sheet (+ shift the whole trip by a day), instead of
      making you walk the full editTrip form.
   ================================================================= */
(function(){
'use strict';
function E(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

/* ---------- 1. Calendar on the bottom bar ---------- */
function openCal(){
  if(typeof window.__openCal==='function'){ window.__openCal(); return; }
  var c=document.getElementById('hdrCal');
  if(c&&typeof c.onclick==='function'){ c.onclick.call(c); }
}
window.__calTab=openCal;

var css=document.createElement('style');
css.textContent='nav.tabs .inner .tab{padding:4px 3px!important;font-size:10.5px!important;letter-spacing:-.2px}'
 +'nav.tabs .inner .tab .ic{font-size:19px!important}'
 +'.tdbtn{margin-right:6px}';
document.head.appendChild(css);

var TABS=[['home','&#127968;','Home'],['travel','&#9992;&#65039;','Travel'],['cal','&#128197;','Calendar'],
          ['notes','&#128210;','Notes'],['info','&#128272;','Info'],['more','&#9881;&#65039;','More']];

function paintNav(){
  var nav=document.querySelector('nav.tabs .inner'); if(!nav) return;
  if(nav.getAttribute('data-v107')==='1' && nav.querySelectorAll('.tab').length===TABS.length) return;
  var active=(typeof cur!=='undefined')?cur:'home';
  nav.innerHTML=TABS.map(function(t){
    return '<button class="tab'+(t[0]===active?' active':'')+'" data-v="'+t[0]+'">'
     +'<span class="ic">'+t[1]+'</span>'+t[2]+'</button>';
  }).join('');
  Array.prototype.forEach.call(nav.querySelectorAll('.tab'),function(b){
    var v=b.getAttribute('data-v');
    b.onclick=function(){
      if(v==='cal'){ openCal(); return; }
      try{ go(v); }catch(e){}
    };
  });
  nav.setAttribute('data-v107','1');
}

/* ---------- 2. dates-only trip editor ---------- */
function addDays(s,n){
  if(!s) return s;
  var p=String(s).slice(0,10).split('-');
  var d=new Date(Date.UTC(+p[0],+p[1]-1,+p[2]));
  d.setUTCDate(d.getUTCDate()+n);
  return d.toISOString().slice(0,10);
}

window.__tdShift=function(n){
  var s=document.getElementById('td_s'), e=document.getElementById('td_e');
  if(s&&s.value) s.value=addDays(s.value,n);
  if(e&&e.value) e.value=addDays(e.value,n);
};

window.tripDates=function(id){
  var t=(D.trips||[]).find(function(x){return x.id===id;}); if(!t) return;
  var h='<h3>Trip dates</h3>'
   +'<div class="mini" style="margin:-8px 0 14px">'+E(t.title||'Trip')+'</div>'
   +'<div class="two">'
   +'<div><label class="f">Start</label><input id="td_s" type="date" value="'+E(String(t.start_date||'').slice(0,10))+'"></div>'
   +'<div><label class="f">End</label><input id="td_e" type="date" value="'+E(String(t.end_date||'').slice(0,10))+'"></div>'
   +'</div>'
   +'<div class="mini" style="margin-top:12px">Move the whole trip</div>'
   +'<div class="btn-row" style="margin-top:6px">'
   +'<button class="btn ghost" onclick="__tdShift(-1)">&minus; 1 day</button>'
   +'<button class="btn ghost" onclick="__tdShift(1)">+ 1 day</button>'
   +'</div>'
   +'<button class="btn primary block" style="margin-top:18px" id="td_save">Save dates</button>'
   +'<div class="mini" style="margin-top:10px;color:var(--muted)">Only the dates change &mdash; flights, documents and to-do list are untouched.</div>';
  openSheet(h);
  var btn=document.getElementById('td_save');
  if(btn) btn.onclick=function(){ window.__tdSave(id); };
};

window.__tdSave=function(id){
  var se=document.getElementById('td_s'), ee=document.getElementById('td_e');
  var s=se?se.value:'', e=ee?ee.value:'';
  if(!s){ toast('Give it a start date'); return; }
  if(e && e<s) e=s;
  sb.from('trips').update({start_date:s,end_date:e||s}).eq('id',id).then(function(r){
    if(r&&r.error){ toast('Could not save'); return; }
    var t=(D.trips||[]).find(function(x){return x.id===id;});
    if(t){ t.start_date=s; t.end_date=e||s; }
    try{ closeSheet(); }catch(err){}
    toast('Dates updated');
    try{ render(); }catch(err){}
    setTimeout(injectDateBtns,150);
  });
};

/* ---------- 3. put a date button on every trip row in Travel ---------- */
function injectDateBtns(){
  var v=document.getElementById('v-travel'); if(!v) return;
  Array.prototype.forEach.call(v.querySelectorAll('.list-item'),function(row){
    var oc=row.getAttribute('onclick')||'';
    var m=oc.match(/openTrip\('([^']+)'\)/);
    if(!m) return;
    if(row.querySelector('.tdbtn')) return;
    var b=document.createElement('button');
    b.className='btn ghost sm tdbtn';
    b.type='button';
    b.innerHTML='&#128197;';
    b.setAttribute('aria-label','Change trip dates');
    b.onclick=function(ev){ ev.stopPropagation(); ev.preventDefault(); window.tripDates(m[1]); };
    var chev=row.querySelector('.chev');
    if(chev) row.insertBefore(b,chev); else row.appendChild(b);
  });
}
window.__injectDateBtns=injectDateBtns;

if(typeof window.rTravel==='function'){
  var _rT=window.rTravel;
  window.rTravel=function(){
    var out=_rT.apply(this,arguments);
    try{ injectDateBtns(); }catch(e){}
    setTimeout(injectDateBtns,120);
    return out;
  };
}

function tick(){ paintNav(); injectDateBtns(); }
tick(); setTimeout(tick,600); setTimeout(tick,1500); setTimeout(tick,3000);
})();


/* ===== v108 — notes become trips; dates roll out ====================
   - HTML notes no longer leak style/script text into the list preview
   - "Make this a trip" on a note: name + dates prefilled from the note
     title, both editable; the note then lives on the trip only
   - Trip sheet gets Name / Dates / Delete
   - Changing trip dates rewrites the date range inside the attached
     note's title (plain script; no model call needed for this shape)
   ================================================================= */
(function(){
'use strict';
var Q=String.fromCharCode(39);
function E(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

function plain(body){
  var s=String(body||'');
  s=s.replace(/<(style|script|head)[\s\S]*?<\/\1>/gi,' ');
  s=s.replace(/<[^>]*>/g,' ');
  /* v126: decode ALL entities (&rarr; &middot; &ndash; &#8211; ...), not a
     hand-picked six — the road-trip note preview was showing them as text.
     Tags are already stripped, so a textarea decode is inert. */
  try{ var ta=document.createElement('textarea'); ta.innerHTML=s; s=ta.value; }
  catch(e){ s=s.replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&'); }
  return s.replace(/\s+/g,' ').trim();
}
function noteTitleOf(body){
  var m=String(body||'').match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m?plain(m[1]):'';
}
window.__notePlain=plain;

var MON=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
var MONFULL=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var RANGE=/(\d{1,2})\s*(?:st|nd|rd|th)?\s*(?:-|–|—|to)\s*(\d{1,2})\s*(?:st|nd|rd|th)?\s+([A-Za-z]{3,9})\.?(?:\s+(\d{2,4}))?/;
function ord(n){ n=+n; var s=['th','st','nd','rd'], v=n%100; return n+(s[(v-20)%10]||s[v]||s[0]); }
function monIdx(w){ return MON.indexOf(String(w||'').slice(0,3).toLowerCase()); }
function parseRange(txt){
  var m=String(txt||'').match(RANGE); if(!m) return null;
  var mi=monIdx(m[3]); if(mi<0) return null;
  var now=new Date(), yr=m[4]?(+m[4]<100?2000+ +m[4]:+m[4]):now.getFullYear();
  var d1=new Date(Date.UTC(yr,mi,+m[1])), d2=new Date(Date.UTC(yr,mi,+m[2]));
  if(!m[4] && d2 < new Date(Date.UTC(now.getFullYear(),now.getMonth(),now.getDate()-180))){
    yr++; d1=new Date(Date.UTC(yr,mi,+m[1])); d2=new Date(Date.UTC(yr,mi,+m[2]));
  }
  return {start:d1.toISOString().slice(0,10), end:d2.toISOString().slice(0,10), matched:m[0]};
}
function fmtRangeText(s,e){
  var a=String(s).slice(0,10).split('-'), b=String(e||s).slice(0,10).split('-');
  if(a[0]===b[0] && a[1]===b[1]) return ord(+a[2])+' - '+ord(+b[2])+' '+MONFULL[(+b[1])-1];
  return ord(+a[2])+' '+MONFULL[(+a[1])-1]+' - '+ord(+b[2])+' '+MONFULL[(+b[1])-1]+(a[0]===b[0]?'':' '+b[0].slice(2));
}
window.__parseRange=parseRange; window.__fmtRangeText=fmtRangeText;

function suggestTripName(title){
  var t=String(title||'').split('›').pop();
  if(t.indexOf('—')>-1) t=t.split('—').pop();
  t=t.replace(/^[\s—–-]+/,'');
  var m=t.match(RANGE); if(m) t=t.replace(m[0],'');
  t=t.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}️]/gu,'');
  t=t.replace(/[\s,;:—–-]+$/,'').replace(/^[\s,;:—–-]+/,'').trim();
  return t||'Trip';
}
window.__suggestTripName=suggestTripName;

function rollOutDates(tripId,s,e){
  var ns=(D.notes||[]).filter(function(n){return n.trip_id===tripId;});
  ns.forEach(function(n){
    var r=parseRange(n.title); if(!r) return;
    var nt=String(n.title).replace(r.matched, fmtRangeText(s,e));
    if(nt===n.title) return;
    sb.from('notes').update({title:nt}).eq('id',n.id).then(function(){ n.title=nt; });
  });
  return ns.length;
}
window.__rollOutDates=rollOutDates;

window.__tdSave=function(id){
  var se=document.getElementById('td_s'), ee=document.getElementById('td_e');
  var s=se?se.value:'', e=ee?ee.value:'';
  if(!s){ toast('Give it a start date'); return; }
  if(e && e<s) e=s;
  sb.from('trips').update({start_date:s,end_date:e||s}).eq('id',id).then(function(r){
    if(r&&r.error){ toast('Could not save'); return; }
    var t=(D.trips||[]).find(function(x){return x.id===id;});
    if(t){ t.start_date=s; t.end_date=e||s; }
    rollOutDates(id,s,e||s);
    try{ closeSheet(); }catch(err){}
    toast('Dates updated');
    try{ render(); }catch(err){}
    setTimeout(function(){ if(window.__injectDateBtns) window.__injectDateBtns(); },150);
  });
};

window.tripRename=function(id){
  var t=(D.trips||[]).find(function(x){return x.id===id;}); if(!t) return;
  openSheet('<h3>Trip name</h3>'
   +'<input id="tr_n" value="'+E(t.title||'')+'">'
   +'<button class="btn primary block" style="margin-top:16px" id="tr_save">Save name</button>');
  var b=document.getElementById('tr_save');
  if(b) b.onclick=function(){
    var v=(document.getElementById('tr_n')||{}).value||'';
    v=v.trim(); if(!v){ toast('Needs a name'); return; }
    sb.from('trips').update({title:v}).eq('id',id).then(function(){
      t.title=v; try{closeSheet();}catch(e){} toast('Renamed'); try{render();}catch(e){}
    });
  };
};

window.tripDelete=function(id){
  var t=(D.trips||[]).find(function(x){return x.id===id;}); if(!t) return;
  var nf=(D.flights||[]).filter(function(f){return f.trip_id===id;}).length;
  if(nf){ alert('This trip has '+nf+' flight'+(nf===1?'':'s')+'. Remove those in Travel first, so a real booking can never be lost by accident.'); return; }
  if(!confirm('Delete this trip? Any note attached goes back to Notes.')) return;
  var ns=(D.notes||[]).filter(function(n){return n.trip_id===id;});
  Promise.all(ns.map(function(n){
    return sb.from('notes').update({trip_id:null}).eq('id',n.id).then(function(){ n.trip_id=null; });
  })).then(function(){
    return sb.from('trip_items').delete().eq('trip_id',id);
  }).then(function(){
    return sb.from('trips').delete().eq('id',id);
  }).then(function(){
    D.trips=(D.trips||[]).filter(function(x){return x.id!==id;});
    try{closeSheet();}catch(e){}
    toast('Trip deleted');
    try{render();}catch(e){}
  });
};

window.noteToTrip=function(noteId){
  var n=(D.notes||[]).find(function(x){return x.id===noteId;}); if(!n) return;
  var r=parseRange(n.title)||parseRange(noteTitleOf(n.body))||{start:'',end:''};
  openSheet('<h3>Make this a trip</h3>'
   +'<div class="mini" style="margin:-8px 0 14px">It moves out of Notes and lives on the trip.</div>'
   +'<label class="f">Trip name</label><input id="nt_n" value="'+E(suggestTripName(n.title))+'">'
   +'<div class="two" style="margin-top:10px">'
   +'<div><label class="f">Start</label><input id="nt_s" type="date" value="'+E(r.start||'')+'"></div>'
   +'<div><label class="f">End</label><input id="nt_e" type="date" value="'+E(r.end||'')+'"></div>'
   +'</div>'
   +'<button class="btn primary block" style="margin-top:18px" id="nt_go">Create trip</button>'
   +'<div class="mini" style="margin-top:10px;color:var(--muted)">You can rename it or change the dates any time from the trip.</div>');
  var b=document.getElementById('nt_go');
  if(b) b.onclick=function(){
    var name=((document.getElementById('nt_n')||{}).value||'').trim()||suggestTripName(n.title);
    var s=(document.getElementById('nt_s')||{}).value||null;
    var e=(document.getElementById('nt_e')||{}).value||s;
    if(e&&s&&e<s) e=s;
    sb.from('trips').insert({title:name,start_date:s,end_date:e,category:'personal'}).select().then(function(res){
      var row=(res&&res.data&&res.data[0])||null;
      if(!row){ toast('Could not create the trip'); return; }
      D.trips=(D.trips||[]).concat([row]);
      return sb.from('notes').update({trip_id:row.id}).eq('id',n.id).then(function(){
        n.trip_id=row.id;
        try{closeSheet();}catch(err){}
        toast('Trip created');
        try{render();}catch(err){}
        setTimeout(function(){ try{ openTrip(row.id); }catch(err){} },260);
      });
    });
  };
};

var _viewNote=window.viewNote;
window.viewNote=function(id){
  var out=_viewNote?_viewNote(id):undefined;
  setTimeout(function(){
    try{
      var n=(D.notes||[]).find(function(x){return x.id===id;}); if(!n) return;
      var sheet=document.getElementById('sheet'); if(!sheet) return;
      if(sheet.querySelector('.n2t')) return;
      var b=document.createElement('button');
      b.className='btn ghost block n2t';
      b.style.marginTop='8px';
      b.type='button';
      if(n.trip_id){
        var t=(D.trips||[]).find(function(x){return x.id===n.trip_id;});
        b.innerHTML='&#9992;&#65039; Open trip'+(t?' &mdash; '+E(t.title):'');
        b.onclick=function(){ try{ openTrip(n.trip_id); }catch(e){} };
      }else{
        b.innerHTML='&#9992;&#65039; Make this a trip';
        b.onclick=function(){ window.noteToTrip(id); };
      }
      sheet.appendChild(b);
    }catch(e){}
  },80);
  return out;
};

window.__noteRow=function(n){
  var first=plain(n.body).slice(0,72);
  return '<div class="list-item" style="cursor:pointer" onclick="viewNote('+Q+n.id+Q+')">'
   +'<div class="li-main"><div class="h">&#128221; '+esc(n.title||'Note')+'</div>'
   +'<div class="sub">'+esc(first)+'</div></div><div class="chev">&#8250;</div></div>';
};

function injectTripEdit(id){
  var sheet=document.getElementById('sheet'); if(!sheet) return;
  if(sheet.querySelector('.tedit')) return;
  var d=document.createElement('div');
  d.className='btn-row tedit';
  d.style.marginTop='14px';
  d.innerHTML='<button class="btn ghost" type="button" data-a="name">&#9998; Name</button>'
   +'<button class="btn ghost" type="button" data-a="dates">&#128197; Dates</button>'
   +'<button class="btn ghost" type="button" data-a="del">&#128465; Delete</button>';
  Array.prototype.forEach.call(d.querySelectorAll('button'),function(b){
    b.onclick=function(){
      var a=b.getAttribute('data-a');
      if(a==='name') window.tripRename(id);
      else if(a==='dates') window.tripDates(id);
      else window.tripDelete(id);
    };
  });
  var h=sheet.querySelector('h3');
  if(h&&h.nextSibling) sheet.insertBefore(d,h.nextSibling); else sheet.appendChild(d);
  var ns=(D.notes||[]).filter(function(n){return n.trip_id===id;});
  if(ns.length && !sheet.querySelector('.tnotes')){
    var w=document.createElement('div');
    w.className='tnotes';
    w.innerHTML='<div class="sect">Notes</div><div class="card">'
     +ns.map(window.__noteRow).join('')+'</div>';
    sheet.appendChild(w);
  }
}
var _openTrip=window.openTrip;
window.openTrip=function(id){
  var out=_openTrip?_openTrip(id):undefined;
  setTimeout(function(){ try{ injectTripEdit(id); }catch(e){} },90);
  setTimeout(function(){ try{ injectTripEdit(id); }catch(e){} },320);
  return out;
};

var _rNotes=window.rNotes;
window.rNotes=function(){
  var keep=D.notes;
  try{ D.notes=(D.notes||[]).filter(function(n){return !n.trip_id;}); }catch(e){}
  var out=_rNotes?_rNotes():undefined;
  D.notes=keep;
  return out;
};
})();


/* ===== v109 — stop hiding things ====================================
   v108 moved a converted note OUT of the Notes list. That was wrong:
   the note vanished and the trip looked like it had eaten it.
   Notes now always stay in Notes, with a plane marker showing which
   trip they belong to, AND appear on the trip. Two doors, one room.
   Also: converting a note now rolls the chosen dates into the note
   title straight away, so the two can never disagree.
   ================================================================= */
(function(){
'use strict';
var Q=String.fromCharCode(39);

/* 1. Notes list: show everything again, mark trip-linked ones */
if(window.__rNotesUnhidden!==true){
  window.rNotes=window.__rNotesBase||window.rNotes;
}
window.__rNotesUnhidden=true;

window.__noteRow=function(n){
  var first=(window.__notePlain?window.__notePlain(n.body):'').slice(0,72);
  var t=n.trip_id?(D.trips||[]).find(function(x){return x.id===n.trip_id;}):null;
  var tag=t?'<span style="color:var(--teal);font-weight:700">&#9992;&#65039; '+esc(t.title)+'</span> &middot; ':'';
  return '<div class="list-item" style="cursor:pointer" onclick="viewNote('+Q+n.id+Q+')">'
   +'<div class="li-main"><div class="h">&#128221; '+esc(n.title||'Note')+'</div>'
   +'<div class="sub">'+tag+esc(first)+'</div></div><div class="chev">&#8250;</div></div>';
};

/* 2. converting a note also fixes the note title's date range */
var _n2t=window.noteToTrip;
window.noteToTrip=function(noteId){
  var out=_n2t?_n2t(noteId):undefined;
  setTimeout(function(){
    var b=document.getElementById('nt_go'); if(!b||b.__wrapped) return;
    b.__wrapped=true;
    var orig=b.onclick;
    b.onclick=function(){
      var s=(document.getElementById('nt_s')||{}).value||'';
      var e=(document.getElementById('nt_e')||{}).value||s;
      if(orig) orig.call(b);
      setTimeout(function(){
        var n=(D.notes||[]).find(function(x){return x.id===noteId;});
        if(n&&n.trip_id&&s&&window.__rollOutDates) window.__rollOutDates(n.trip_id,s,e||s);
      },700);
    };
  },120);
  return out;
};
})();


/* ===== v110 — F1: multi-driver compare overlay + per-race standings snapshot ===== */
;(function(){
  function E(s){ return (typeof esc==="function") ? esc(s) : (""+s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }
  function prof(rec){ return (rec && rec.drivers_profile) || {}; }
  function meta(rec){ var m={}; (rec.standings||[]).forEach(function(d){ m[d.driver]={color:d.color||"#888",num:d.num||"",team:d.team||""}; }); return m; }
  function tracked(rec){ var p=prof(rec); var out=[]; (rec.standings||[]).forEach(function(d){ if(p[d.driver] && Array.isArray(p[d.driver].points) && p[d.driver].points.length) out.push(d.driver); }); return out; }
  function getRec(){ try{ return f1Data(); }catch(e){ return (window.f1Data&&window.f1Data())||null; } }

  window.f1Compare = window.f1Compare || null;
  window.f1CompareView = function(rec){
    var names = tracked(rec);
    if(window.f1Compare===null) window.f1Compare = names.slice(0,3);
    var sel = window.f1Compare.filter(function(n){ return names.indexOf(n)>=0; });
    var m = meta(rec);
    var h = '<div class="sect">Compare drivers</div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px">';
    h += names.map(function(n){
      var i=names.indexOf(n), on=sel.indexOf(n)>=0, c=(m[n]&&m[n].color)||"#888";
      return '<button onclick="window.__f1Cmp('+i+')" style="border:1px solid '+(on?c:"var(--line)")+';background:'+(on?c:"#fff")+';color:'+(on?"#fff":"var(--ink2)")+';border-radius:999px;padding:5px 11px;font-family:var(--serif);font-size:12.5px;font-weight:700;cursor:pointer">'+E(n)+'</button>';
    }).join("");
    h += '</div>';
    if(!sel.length) return h+'<div class="mini" style="padding:8px">Pick one or more drivers above to overlay their seasons.</div>';
    h += '<div class="card">'+f1CompareChart(rec,sel,m)+'</div>';
    h += '<div class="mini" style="text-align:center;margin-top:6px;color:var(--muted2)">Cumulative points by round &middot; up to 5 drivers</div>';
    return h;
  };
  window.__f1Cmp = function(i){
    var rec=getRec(); if(!rec) return;
    var names=tracked(rec), n=names[i]; if(!n) return;
    if(window.f1Compare===null) window.f1Compare=names.slice(0,3);
    var k=window.f1Compare.indexOf(n);
    if(k>=0) window.f1Compare.splice(k,1);
    else { if(window.f1Compare.length>=5){ if(typeof toast==="function") toast("Up to 5 drivers"); return; } window.f1Compare.push(n); }
    window.renderF1Sheet();
  };
  function f1CompareChart(rec,sel,m){
    var p=prof(rec), lab=rec.points_rounds||[];
    var series=sel.map(function(n){ return {name:n,color:(m[n]&&m[n].color)||"#888",pts:(p[n].points||[])}; });
    var n=Math.max.apply(null, series.map(function(s){return s.pts.length;}).concat([lab.length,1]));
    var mx=1; series.forEach(function(s){ s.pts.forEach(function(v){ if(v>mx)mx=v; }); });
    var W=320,H=150,padL=8,padR=8,padT=8,padB=18;
    var X=function(i){ return padL+(n<=1?0:i*(W-padL-padR)/(n-1)); };
    var Y=function(v){ return H-padB-(v/mx)*(H-padT-padB); };
    var s='<svg viewBox="0 0 '+W+' '+H+'" style="width:100%;height:auto;display:block">';
    s+='<line x1="'+padL+'" y1="'+(H-padB)+'" x2="'+(W-padR)+'" y2="'+(H-padB)+'" stroke="#e2e8f2" stroke-width="1"/>';
    var step=n>8?2:1;
    for(var i=0;i<lab.length;i+=step){ s+='<text x="'+X(i).toFixed(1)+'" y="'+(H-5)+'" font-size="7" fill="#9aa6b8" text-anchor="middle">'+E(lab[i])+'</text>'; }
    series.forEach(function(se){
      var d=se.pts.map(function(v,i){ return (i?"L":"M")+X(i).toFixed(1)+","+Y(v).toFixed(1); }).join(" ");
      s+='<path d="'+d+'" fill="none" stroke="'+se.color+'" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>';
      var last=se.pts.length-1;
      if(last>=0) s+='<circle cx="'+X(last).toFixed(1)+'" cy="'+Y(se.pts[last]).toFixed(1)+'" r="2.6" fill="'+se.color+'"/>';
    });
    s+='</svg><div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:8px">';
    s+=series.map(function(se){ var v=se.pts.length?se.pts[se.pts.length-1]:0; return '<div style="display:flex;align-items:center;gap:6px"><span style="width:12px;height:3px;border-radius:2px;background:'+se.color+';display:inline-block"></span><span style="font-size:12px;font-weight:700">'+E(se.name)+'</span><span class="mini">'+v+'</span></div>'; }).join("");
    s+='</div>';
    return s;
  }

  window.f1SnapMode = window.f1SnapMode || "now";
  window.__f1SnapSet = function(x){ window.f1SnapMode = x ? "then" : "now"; window.renderF1Sheet(); };
  window.f1SnapBlock = function(rec,r){
    var round=r.round, lab=rec.points_rounds||[], idx=round-1, p=prof(rec), m=meta(rec);
    var mode=window.f1SnapMode||"now";
    var canThen=(idx>=0 && idx<lab.length);
    var thenOn=(mode==="then" && canThen);
    var rows;
    if(thenOn){
      var arr=[];
      Object.keys(p).forEach(function(nm){ var pts=p[nm].points; if(Array.isArray(pts)&&idx<pts.length) arr.push({driver:nm,pts:pts[idx]}); });
      arr.sort(function(a,b){ return b.pts-a.pts; });
      var curPos={}; (rec.standings||[]).forEach(function(d,i){ curPos[d.driver]=i+1; });
      rows=arr.map(function(x,i){
        var pos=i+1, c=(m[x.driver]&&m[x.driver].color)||"#888", cp=curPos[x.driver];
        var delta=(cp!=null)?(cp-pos):null, ar="";
        if(delta>0) ar='<span style="color:var(--ok);font-size:11px">&#9650;'+delta+'</span>';
        else if(delta<0) ar='<span style="color:var(--bad);font-size:11px">&#9660;'+(-delta)+'</span>';
        return '<div class="it-line"><span class="it-ic" style="width:20px;text-align:center;font-weight:800;color:var(--ink2)">'+pos+'</span><span style="width:4px;height:20px;border-radius:2px;background:'+c+';flex:0 0 auto;margin:0 8px"></span><div class="it-main"><b>'+E(x.driver)+'</b></div><div class="ag-tm" style="display:flex;gap:6px;align-items:center"><b>'+x.pts+'</b>'+ar+'</div></div>';
      }).join("");
    } else {
      rows=(rec.standings||[]).map(function(d){ var c=d.color||"#888"; return '<div class="it-line"><span class="it-ic" style="width:20px;text-align:center;font-weight:800;color:var(--ink2)">'+d.pos+'</span><span style="width:4px;height:20px;border-radius:2px;background:'+c+';flex:0 0 auto;margin:0 8px"></span><div class="it-main"><b>'+E(d.driver)+'</b></div><div class="ag-tm"><b>'+d.pts+'</b></div></div>'; }).join("");
    }
    var seg='<div class="seg" style="margin-bottom:8px"><button class="'+(!thenOn?"on":"")+'" onclick="window.__f1SnapSet(0)">Now</button><button class="'+(thenOn?"on":"")+'"'+(canThen?"":" disabled")+' onclick="window.__f1SnapSet(1)">After this race</button></div>';
    var title=thenOn?("Championship after R"+round):"Championship now";
    return '<div class="sect">Standings</div>'+seg+'<div class="card">'+rows+'</div><div class="mini" style="text-align:right;margin-top:2px;color:var(--muted2)">'+E(title)+'</div>';
  };
})();


/* ===== v110 — paste a booking, in the app ==========================
   AJ: WhatsApp confirmations only. Pasting into a Dropbox file on a
   phone is six taps and a file manager. This puts the paste box where
   he already is. Insert goes straight to inbox_emails, so it rides the
   SAME pipeline as email: rules -> AI (book|cancel|change|none) ->
   filed against the trip -> ticks the to-do it satisfies.
   ================================================================= */
(function(){
'use strict';
function E(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

window.pasteBooking=function(){
  var h='<h3>Paste a booking</h3>'
   +'<div class="mini" style="margin:-8px 0 12px">WhatsApp, SMS, anything. It gets read and filed like an email &mdash; booking, change or cancellation.</div>'
   +'<textarea id="pb_txt" style="width:100%;min-height:190px" placeholder="Long-press the message &rarr; Copy &rarr; paste here"></textarea>'
   +'<label class="f" style="margin-top:10px">Where from (optional)</label>'
   +'<input id="pb_who" placeholder="e.g. SmackOne, the ferry, restaurant">'
   +'<button class="btn primary block" style="margin-top:16px" id="pb_go">File it</button>'
   +'<div class="mini" id="pb_msg" style="margin-top:10px;color:var(--muted)">Nothing is guessed &mdash; if the dates are unclear it asks you instead.</div>';
  openSheet(h);
  var b=document.getElementById('pb_go');
  if(b) b.onclick=function(){
    var t=(document.getElementById('pb_txt')||{}).value||'';
    var who=((document.getElementById('pb_who')||{}).value||'').trim();
    var m=document.getElementById('pb_msg');
    if(t.trim().length<12){ if(m){m.textContent='Paste the message first.';} return; }
    b.disabled=true; if(m){m.textContent='Filing…';}
    sb.from('inbox_emails').insert({
      from_addr:'paste@app',
      subject:'Pasted'+(who?(': '+who):''),
      received_at:new Date().toISOString(),
      body_text:(who?('From: '+who+'\n\n'):'')+t
    }).then(function(r){
      if(r&&r.error){ b.disabled=false; if(m){m.textContent='Could not save — '+r.error.message;} return; }
      if(m){m.innerHTML='<b>Filed.</b> It is being read now &mdash; check the trip in a minute.';}
      if(typeof toast==='function') toast('Sent to be filed');
      setTimeout(function(){ try{closeSheet();}catch(e){} },1400);
    });
  };
};

function addPasteRow(){
  try{
    var box=document.getElementById('v-more'); if(!box) return;
    if(box.querySelector('.pbrow')) return;
    var card=box.querySelector('.card'); if(!card) return;
    var d=document.createElement('div');
    d.className='list-item mrow pbrow';
    d.style.cursor='pointer';
    d.innerHTML='<div class="li-main"><div class="h">&#128203; Paste a booking</div>'
      +'<div class="sub">WhatsApp or SMS confirmation &rarr; filed automatically</div></div>'
      +'<div class="chev">&#8250;</div>';
    d.onclick=function(){ window.pasteBooking(); };
    card.insertBefore(d, card.firstChild);
  }catch(e){}
}
var _rMore=window.rMore;
if(typeof _rMore==='function'){
  window.rMore=function(){ var o=_rMore.apply(this,arguments); setTimeout(addPasteRow,60); return o; };
}
setTimeout(addPasteRow,800); setTimeout(addPasteRow,2500);
})();


/* ===== v116 — the makeover, without touching the clocks ==============
   v113 restored: frosted glass, lighter type, pills, line-art tab icons.
   Everything v113 and v114 did to the CLOCKS is deliberately left out —
   the dials render themselves and are none of this layer's business.
   Presentation only. Append-only.
   =================================================================== */
(function(){
'use strict';

var CSS = [
':root{--ui:-apple-system,BlinkMacSystemFont,"SF Pro Text","SF Pro Display","Segoe UI",Inter,Roboto,"Helvetica Neue",Arial,sans-serif;',
'  --glass:rgba(255,255,255,.60);--glassline:rgba(255,255,255,.55);',
'  --blur:saturate(1.3) blur(20px);--shadow:0 2px 22px rgba(38,58,68,.08);--r:20px}',
'body,.btn,input,textarea,select,.tab,.chip,.seg button,.copybtn,.searchbar input{font-family:var(--ui)}',
'body{-webkit-font-smoothing:antialiased;letter-spacing:-.1px}',
'.brand h1,.brandc .bn,.hero h2,.th-title{font-family:var(--ui);font-weight:600;letter-spacing:-.4px}',
'.sect{font-weight:600;letter-spacing:1.6px;font-size:10.5px;color:var(--muted2)}',
'.sect .add{font-weight:500;font-style:normal;letter-spacing:0;text-transform:none;font-size:14px;color:var(--teal)}',
'.li-main .h,.it-main b,.wc-t,.cal-head b,.sheet h3{font-weight:600;letter-spacing:-.2px}',
'.sheet h3{font-size:21px}',

'.card,.cal,.tile,.searchbar,.wcard,.subbox,.hero,.trip-hero{',
'  background:var(--glass);',
'  -webkit-backdrop-filter:var(--blur);backdrop-filter:var(--blur);',
'  border:1px solid var(--glassline);border-radius:var(--r);box-shadow:var(--shadow)}',
'.card{padding:16px 18px}',
'.hero,.trip-hero{border-left:1px solid var(--glassline)}',
'.hero:before,.trip-hero:before{content:"";position:absolute;left:0;top:14px;bottom:14px;width:3px;border-radius:0 3px 3px 0;background:var(--teal)}',
'.trip-hero{position:relative}',
'.subbox{background:rgba(255,255,255,.5);border-radius:16px}',

'.hdrbar{background:rgba(240,244,246,.72);-webkit-backdrop-filter:var(--blur);backdrop-filter:var(--blur);border-bottom:1px solid rgba(255,255,255,.5)}',
'nav.tabs{background:rgba(255,255,255,.72);-webkit-backdrop-filter:saturate(1.4) blur(24px);backdrop-filter:saturate(1.4) blur(24px);border-top:1px solid rgba(255,255,255,.55);padding-top:9px}',

'nav.tabs .inner .tab{padding:2px 4px!important;font-size:10px!important;font-weight:500;letter-spacing:0;gap:5px;color:var(--muted)}',
'nav.tabs .inner .tab .ic{font-size:0!important;line-height:0;filter:none!important;display:block}',
'.tab .ic svg{width:23px;height:23px;display:block;stroke:currentColor;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}',
'.tab.active{color:var(--ink);font-weight:600}',
'.tab.active .ic svg{stroke-width:1.9}',

'.seg{background:rgba(190,200,206,.42);-webkit-backdrop-filter:var(--blur);backdrop-filter:var(--blur);border:0;border-radius:999px;padding:4px;gap:2px}',
'.seg button{border-radius:999px;font-weight:500;font-size:14px;padding:8px 6px;color:var(--ink2);letter-spacing:-.2px}',
'.seg button.on{background:var(--teal-d);color:#fff;font-weight:600;box-shadow:0 1px 4px rgba(0,0,0,.18)}',
'.chips{gap:0;background:rgba(190,200,206,.42);-webkit-backdrop-filter:var(--blur);backdrop-filter:var(--blur);border-radius:999px;padding:4px;display:inline-flex}',
'.chip{border:0;background:none;border-radius:999px;padding:7px 18px;font-weight:500;font-size:14px;color:var(--ink2)}',
'.chip.on{background:var(--teal-d);color:#fff;font-weight:600;box-shadow:0 1px 4px rgba(0,0,0,.18)}',

'.list-item{padding:14px 2px;border-bottom:1px solid rgba(120,140,150,.13);gap:13px}',
'.ava{border:0;background:rgba(255,255,255,.62);border-radius:12px;box-shadow:0 1px 5px rgba(38,58,68,.07)}',
'.li-main .h{font-size:16.5px;font-weight:500}',
'.li-main .sub{font-size:13.5px;color:var(--muted);margin-top:3px}',
'.chev{color:var(--muted2);font-weight:300}',
'.tile{border-radius:18px;padding:16px 10px}',
'.tile .t{font-weight:600;letter-spacing:-.2px}',
'.btn{border-radius:12px;font-weight:600;letter-spacing:-.2px}',
'.btn.primary{background:var(--teal-d)}',
'.btn.ghost{background:rgba(255,255,255,.66);-webkit-backdrop-filter:var(--blur);backdrop-filter:var(--blur);border:1px solid var(--glassline)}',
'.copybtn{background:rgba(255,255,255,.66);border:1px solid var(--glassline);border-radius:9px;font-weight:600}',
'.searchbar{border-radius:999px;padding:12px 18px}',
'.pill{font-weight:600;letter-spacing:-.1px}',

'.sheet{background:rgba(252,253,253,.92);-webkit-backdrop-filter:saturate(1.3) blur(30px);backdrop-filter:saturate(1.3) blur(30px);border-radius:26px 26px 0 0;border-color:var(--glassline)}',
'@media(min-width:1020px){.sheet{border-radius:26px}}',
'.scrim{background:rgba(40,50,58,.30);-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px)}',
'input,textarea,select{background:rgba(255,255,255,.75);border:1px solid var(--glassline);border-radius:13px}',
'.cal-cell.today{background:rgba(43,74,122,.10);border-color:rgba(43,74,122,.35);border-radius:10px}',
'.cal-cell{border-radius:10px}',
'.cl{background:rgba(255,255,255,.6);border-radius:5px}',
'.cl.trip{background:var(--teal);color:#fff}',
'.toast{border-radius:14px;background:rgba(26,26,26,.92);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);font-weight:500}',
'.fab{background:var(--teal-d);box-shadow:0 8px 22px rgba(29,51,87,.34);font-weight:300}',
'body::before{background-attachment:fixed;background-size:auto 100vh;background-repeat:repeat;background-position:center top} @media(max-width:700px){body::before{background-size:cover;background-repeat:repeat-y}}',
'.foot{font-style:normal;font-size:11.5px;letter-spacing:.3px}'
].join('\n');

var st=document.createElement('style');
st.id='v116css';
st.textContent=CSS;
document.head.appendChild(st);

var S='<svg viewBox="0 0 24 24" aria-hidden="true">';
var ICONS={
  home:   S+'<path d="M3.6 10.4 12 3.8l8.4 6.6"/><path d="M5.4 9.6V19a1.2 1.2 0 0 0 1.2 1.2h10.8A1.2 1.2 0 0 0 18.6 19V9.6"/><path d="M9.6 20.2v-5.6h4.8v5.6"/></svg>',
  travel: S+'<path d="M3.4 13.6 20.4 8.2a1.5 1.5 0 0 0-.9-2.8L4.2 9.1"/><path d="M3.4 13.6 8 15l2.6 4.4 1.9-.6-.7-4.8"/><path d="M4.6 19.9h14.8"/></svg>',
  cal:    S+'<rect x="3.4" y="5.2" width="17.2" height="15.4" rx="2.4"/><path d="M3.4 10h17.2M8 3.4v3.4M16 3.4v3.4"/><circle cx="8" cy="13.6" r=".9" fill="currentColor" stroke="none"/><circle cx="12" cy="13.6" r=".9" fill="currentColor" stroke="none"/><circle cx="16" cy="13.6" r=".9" fill="currentColor" stroke="none"/><circle cx="8" cy="17.2" r=".9" fill="currentColor" stroke="none"/><circle cx="12" cy="17.2" r=".9" fill="currentColor" stroke="none"/></svg>',
  notes:  S+'<rect x="4.2" y="3.4" width="15.6" height="17.2" rx="2.4"/><path d="M8 8.2h8M8 12h8M8 15.8h4.8"/></svg>',
  info:   S+'<circle cx="10" cy="8.4" r="3.6"/><path d="M3.8 20.2c0-3.4 2.8-5.8 6.2-5.8 1.3 0 2.5.35 3.5.96"/><path d="M17.6 14.4v5.8M14.7 17.3h5.8"/></svg>',
  more:   S+'<circle cx="6" cy="8" r="1.35" fill="currentColor" stroke="none"/><circle cx="12" cy="8" r="1.35" fill="currentColor" stroke="none"/><circle cx="18" cy="8" r="1.35" fill="currentColor" stroke="none"/><circle cx="6" cy="16" r="1.35" fill="currentColor" stroke="none"/><circle cx="12" cy="16" r="1.35" fill="currentColor" stroke="none"/><circle cx="18" cy="16" r="1.35" fill="currentColor" stroke="none"/></svg>'
};
ICONS.flights=ICONS.travel;
ICONS.trips=ICONS.travel;

function paintIcons(){
  var tabs=document.querySelectorAll('nav.tabs .tab');
  for(var i=0;i<tabs.length;i++){
    var b=tabs[i];
    var v=b.getAttribute('data-v')||'';
    var ic=b.querySelector('.ic');
    if(!ic) continue;
    if(ic.getAttribute('data-i116')===v) continue;
    var s=ICONS[v];
    if(!s) continue;
    ic.innerHTML=s;
    ic.setAttribute('data-i116',v);
  }
}
paintIcons();
setTimeout(paintIcons,150); setTimeout(paintIcons,600); setTimeout(paintIcons,1500); setTimeout(paintIcons,3000);
setInterval(paintIcons,900);

})();








/* ===== v121 — clocks: one deterministic owner ========================
   The aj4 layer rebuilt the clock row only when a MutationObserver +
   requestAnimationFrame chain happened to fire — that timing hole is
   the "old clocks flash then settle" AJ saw. enhance() is now exported
   as __ajEnhance and called directly after every rHome, synchronously,
   in the same paint. block() renders AJ's artwork faces via __jaBlock
   (patched at source in the aj4 layer), so the gold dual-timezone
   markup is never generated. The v62 white dials are hidden by CSS
   until the row is enhanced, so nothing wrong is ever visible.
   =================================================================== */
(function(){
'use strict';
var FACES={
 dark:{src:'/.netlify/images?url=%2Fdial-black.png&w=280&fm=webp&q=82', raw:'dial-black.png', scale:1.176, ink:'#c08768', edge:'#8f5c40', lume:'#f6ecdc'},
 light:{src:'/.netlify/images?url=%2Fdial-white.png&w=280&fm=webp&q=82', raw:'dial-white.png', scale:1.358, ink:'#1c1c1c', edge:'#000', lume:'#fff'}
};
var flip=0;

var css=document.createElement('style');
css.id='v121css';
css.textContent=[
'svg.ajsvg{display:none!important}',
'.clocks:not(.ajclocks) .clk{visibility:hidden}',   /* pre-enhance dials never flash */
'#dashRow{margin:4px 0 0!important;padding:0!important}',
'.ajclocks{display:flex!important;justify-content:center!important;align-items:flex-start!important;gap:64px!important;width:auto!important;padding:2px 0 0!important;margin:0!important}',
'.ajclocks .ajc{flex:0 0 auto!important;width:auto!important;min-width:0!important;margin:0!important;padding:0!important}',
'.jaface{position:relative;display:block;width:184px;height:184px;margin:0 auto;overflow:hidden;border-radius:50%;cursor:pointer}',
'.jaface .jaimg{position:absolute;left:50%;top:50%;width:100%;height:100%;transform:translate(-50%,-50%) scale(var(--fs,1))}',
'.jaface svg{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;filter:drop-shadow(0 1px 2px rgba(0,0,0,.35))}',
'.jacity{text-align:center;font-size:12.5px;letter-spacing:2.8px;font-weight:600;color:#333f47;margin-top:7px}',
'.ajt2{margin-top:1px}','.ajwx{margin-top:1px}',
'@media(max-width:700px){.ajclocks{gap:20px!important}.jaface{width:min(42vw,158px);height:min(42vw,158px)}}'
].join('\n');
document.head.appendChild(css);

function hands(f){
 return '<svg viewBox="0 0 120 120">'
 +'<g class="jh" transform="rotate(0 60 60)"><path d="M57.5 66 L57.5 41 L54.7 41 L60 30 L65.3 41 L62.5 41 L62.5 66 Z" fill="'+f.ink+'" stroke="'+f.edge+'" stroke-width=".5" stroke-linejoin="round"/><path d="M59 62 L59 42.5 L57.8 42.5 L60 37 L62.2 42.5 L61 42.5 L61 62 Z" fill="'+f.lume+'" opacity=".9"/></g>'
 +'<g class="jm" transform="rotate(0 60 60)"><path d="M58.2 66 L58.2 28 L55.9 28 L60 16 L64.1 28 L61.8 28 L61.8 66 Z" fill="'+f.ink+'" stroke="'+f.edge+'" stroke-width=".5" stroke-linejoin="round"/><path d="M59.3 62 L59.3 29.5 L58.2 29.5 L60 24 L61.8 29.5 L60.7 29.5 L60.7 62 Z" fill="'+f.lume+'" opacity=".9"/></g>'
 +'<circle cx="60" cy="60" r="2.6" fill="'+f.ink+'" stroke="'+f.edge+'" stroke-width=".5"/></svg>';
}

window.__jaBlock=function(M,pick){
 var f=(flip++ % 2===0)?FACES.dark:FACES.light;
 return '<div class="jaface" data-tz="'+M.tz+'" style="--fs:'+f.scale+'" '+pick+'>'
   +'<img class="jaimg" src="'+f.src+'" onerror="this.onerror=null;this.src=&#39;'+f.raw+'&#39;" alt="">'
   +hands(f)
   +'</div><div class="jacity">'+(M.label||'').toUpperCase()+'</div>';
};

function tickHands(){
 var faces=document.querySelectorAll('.jaface');
 for(var i=0;i<faces.length;i++){
  var d=faces[i];
  try{
   var tz=d.getAttribute('data-tz')||'Asia/Bangkok';
   var p=new Intl.DateTimeFormat('en-GB',{timeZone:tz,hour:'numeric',minute:'numeric',second:'numeric',hour12:false}).formatToParts(new Date());
   var v={}; for(var j=0;j<p.length;j++) v[p[j].type]=+p[j].value;
   var H=d.querySelector('.jh'), M2=d.querySelector('.jm');
   if(H)H.setAttribute('transform','rotate('+(((v.hour||0)%12)*30+(v.minute||0)*0.5)+' 60 60)');
   if(M2)M2.setAttribute('transform','rotate('+((v.minute||0)*6+(v.second||0)*0.1)+' 60 60)');
  }catch(e){}
 }
}
setInterval(tickHands,1000);

function build(){
 try{ if(typeof window.__ajEnhance==='function') window.__ajEnhance(); }catch(e){}
 tickHands();
}

/* one deterministic trigger: after every rHome, same paint */
if(typeof window.rHome==='function'){
 var _r=window.rHome;
 window.rHome=function(){
  flip=0;
  var out=_r.apply(this,arguments);
  try{
   var ss=document.querySelectorAll('#v-home .sect');
   for(var i=0;i<ss.length;i++){
    if(/^\s*past\s*$/i.test((ss[i].textContent||'').replace(/add/i,''))){
     var card=ss[i].nextElementSibling; if(card) card.remove(); ss[i].remove();
    }
   }
  }catch(e){}
  build();
  return out;
 };
}
/* boot: cover the first render that ran before this layer loaded */
build();
setTimeout(build,120); setTimeout(build,600); setTimeout(build,2000);
})();


/* ===== v122 — plumbing: fresh on focus, honest auth, quiet boot ======
   Audit findings fixed:
   1. Cold boot raced: app.js rendered before the dash layers loaded and
      threw ReferenceError (renderHomePager) on EVERY cold load — the
      first paint has been dying silently for weeks. app.js now guards
      those calls, and this layer re-renders once on arrival so the
      guarded first paint is completed properly.
   2. Stale on resume: a PWA brought back from the background showed
      yesterday's data until a manual reload. Now: refetch when the app
      regains visibility (throttled to once per minute) and every 5
      minutes while visible.
   3. Dead sessions: if the auth token refresh fails (long offline,
      revoked), the app used to sit there silently queueing writes
      forever. Now it listens for auth state and shows the sign-in
      screen when the session is truly gone.
   =================================================================== */
(function(){
'use strict';

/* 1. complete the boot render now every layer exists */
try{ if(typeof cur!=='undefined' && typeof render==='function') render(); }catch(e){}

/* 2. refresh on focus + every 5 min while visible */
var lastFetch=Date.now();
function refresh(reason){
 if(Date.now()-lastFetch<60000) return;
 lastFetch=Date.now();
 try{
  if(typeof loadData==='function'){
   Promise.resolve(loadData()).then(function(){
    try{ if(typeof flush==='function') flush(); }catch(e){}
    try{ if(typeof setSync==='function') setSync(); }catch(e){}
    try{ render(); }catch(e){}
   });
  }
 }catch(e){}
}
document.addEventListener('visibilitychange',function(){ if(!document.hidden) refresh('visible'); });
window.addEventListener('focus',function(){ refresh('focus'); });
setInterval(function(){ if(!document.hidden) refresh('interval'); },300000);

/* 3. react to auth state instead of dying quietly */
try{
 sb.auth.onAuthStateChange(function(event,session){
  try{
   if(event==='SIGNED_OUT' || (event==='TOKEN_REFRESHED' && !session)){
    var a=document.getElementById('auth'), s=document.getElementById('shell');
    if(a) a.classList.remove('hide');
    if(s) s.classList.add('hide');
   }
  }catch(e){}
 });
}catch(e){}
})();


/* ===== v124 — the trip sheet grows up ================================
   1. Edit pencils on the spot: title, dates, every flight, every item —
      no more hunting for the edit section (it stays, at the bottom).
   2. Itinerary: flights + stays + activities merged into one
      day-by-day list across the trip's date range, sorted by time —
      reservations in order, flights broken up by date.
   3. About the place: first Wikipedia paragraph + photo, fetched once
      when missing, saved into the trip row (works offline after that).
   4. Weather note: typical weather for the trip dates (last year's
      actuals for the same dates), computed once and saved.
   Wraps openTrip (7 earlier layers also wrap it — never replace).
   The original Flights/Items sections are folded away, not deleted:
   every entry they held appears in the itinerary, undated ones under
   their own heading. Nothing is hidden (D12).
   =================================================================== */
(function(){
'use strict';

var css=document.createElement('style');
css.id='v124css';
css.textContent=[
'.itn-day{margin:10px 0 2px;font-size:12px;letter-spacing:1.8px;font-weight:600;text-transform:uppercase;color:var(--muted)}',
'.itn-row{display:flex;align-items:flex-start;gap:9px;padding:7px 0 7px 2px;border-bottom:1px solid rgba(120,140,150,.12)}',
'.itn-row:last-child{border-bottom:0}',
'.itn-ic{flex:0 0 auto;font-size:16px;line-height:1.4}',
'.itn-main{flex:1;min-width:0;font-size:14.5px;line-height:1.35}',
'.itn-main b{font-weight:600}',
'.itn-main .mini{display:block;margin-top:1px}',
'.itn-pen{flex:0 0 auto;border:0;background:none;cursor:pointer;font-size:14px;opacity:.55;padding:2px 4px}',
'.itn-pen:active{opacity:1}',
'.itn-none{font-size:13px;color:var(--muted2);padding:4px 0 4px 2px;font-style:italic}',
'.abt{display:flex;gap:12px;margin:10px 0 4px;align-items:flex-start}',
'.abt img{width:118px;height:88px;object-fit:cover;border-radius:12px;flex:0 0 auto}',
'.abt .txt{flex:1;font-size:13.5px;line-height:1.5;color:var(--ink2)}',
'.hdr-pen{border:0;background:none;cursor:pointer;font-size:15px;opacity:.6;padding:2px 6px;vertical-align:middle}',
'.wx-note{font-size:13.5px;color:var(--ink2);margin:6px 0 2px}'
].join('\n');
document.head.appendChild(css);

function E(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function dshort(s){var d=parseD(s);return d?d.toLocaleDateString(undefined,{weekday:'short',day:'numeric',month:'short'}):'';}
function addD(s,n){var p=String(s).slice(0,10).split('-');var d=new Date(Date.UTC(+p[0],+p[1]-1,+p[2]));d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}

function rowHTML(ic,main,sub,pen){
  return '<div class="itn-row"><span class="itn-ic">'+ic+'</span>'
    +'<span class="itn-main">'+main+(sub?'<span class="mini">'+sub+'</span>':'')+'</span>'
    +'<button class="itn-pen" onclick="'+pen+'">&#9998;</button></div>';
}

function itineraryHTML(t){
  var id=t.id;
  var fls=D.flights.filter(function(f){return f.trip_id===id;});
  var its=D.trip_items.filter(function(i){return i.trip_id===id && (i.status||'active')==='active';});
  function entries(day){
    var out=[];
    fls.forEach(function(f){ if(String(f.fdate||'').slice(0,10)===day)
      out.push({tm:f.ftime||'99',h:rowHTML('&#9992;&#65039;',
        '<b>'+E(f.from_code||'?')+' &rarr; '+E(f.to_code||'?')+'</b>'
        +(f.conf?' &middot; <span class="copybtn" style="padding:1px 7px;font-size:12px" onclick="event.stopPropagation();copy(\''+E(f.conf)+'\')">'+E(f.conf)+'</span>':''),
        [f.ftime,f.airline,f.flight_no,f.pax].filter(Boolean).map(E).join(' &middot; '),
        'editFlight(\''+id+'\',\''+f.id+'\')')});});
    its.forEach(function(it){ var _s=String(it.idate||'').slice(0,10),_e=String(it.edate||it.idate||'').slice(0,10); if(_s<=day&&day<=_e){
      var km=(typeof kindMeta==='function')?kindMeta(it.kind):[it.kind,'&#128204;'];
      out.push({tm:it.itime||'98',h:rowHTML(km[1]||'&#128204;',
        '<b>'+E(it.title||'')+'</b>'+(it.ref?' &middot; <span class="copybtn" style="padding:1px 7px;font-size:12px" onclick="event.stopPropagation();copy(\''+E(it.ref)+'\')">'+E(it.ref)+'</span>':''),
        [it.itime,it.address].filter(Boolean).map(E).join(' &middot; '),
        'editItem(\''+id+'\',\''+it.id+'\')')});}});
    out.sort(function(a,b){return String(a.tm).localeCompare(String(b.tm));});
    return out.map(function(x){return x.h;}).join('');
  }
  var h='<label class="f">Itinerary</label>';
  var s=String(t.start_date||'').slice(0,10), e=String(t.end_date||t.start_date||'').slice(0,10);
  var placed={};
  if(s){
    var day=s, n=0;
    while(day<=e && n<32){
      var eh=entries(day);
      h+='<div class="itn-day">'+dshort(day)+'</div>';
      h+=eh||'<div class="itn-none">nothing booked</div>';
      if(eh) placed[day]=1;
      day=addD(day,1); n++;
    }
  }
  var stray='';
  fls.forEach(function(f){var d2=String(f.fdate||'').slice(0,10); if(!d2||d2<s||d2>e) stray+=rowHTML('&#9992;&#65039;','<b>'+E(f.from_code||'?')+' &rarr; '+E(f.to_code||'?')+'</b>',E([f.fdate,f.ftime].filter(Boolean).join(' ')),'editFlight(\''+id+'\',\''+f.id+'\')');});
  its.forEach(function(it){var d2=String(it.idate||'').slice(0,10); if(!d2||d2<s||d2>e) stray+=rowHTML('&#128204;','<b>'+E(it.title||'')+'</b>',E(it.idate||'no date'),'editItem(\''+id+'\',\''+it.id+'\')');});
  if(stray) h+='<div class="itn-day">Outside these dates</div>'+stray;
  h+='<div class="btn-row" style="margin-top:10px">'
    +'<button class="btn ghost sm" onclick="editFlight(\''+id+'\')">+ Flight</button>'
    +'<button class="btn ghost sm" onclick="editItem(\''+id+'\')">+ Stay / activity</button></div>';
  return h;
}

var busy={};
function placeName(t){
  var s=(t.dest||t.title||'').split('—')[0].split('=')[0].split('(')[0].split(',')[0].trim();
  return s.replace(/\s+\d.*$/,'').trim();
}
function enrich(t){
  if(!navigator.onLine || busy[t.id]) return;
  var jobs=[];
  var place=placeName(t);
  if(!place) return;
  if(!t.town_info){
    jobs.push(fetch('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(place)+'?redirect=true')
      .then(function(r){return r.ok?r.json():null;})
      .then(function(j){
        if(j&&j.extract&&j.type!=='disambiguation'){
          return {town_info:j.extract, about_img:(j.thumbnail&&j.thumbnail.source)||null};
        } return null;
      }).catch(function(){return null;}));
  }
  if(!t.weather_note && t.start_date){
    jobs.push(fetch('https://geocoding-api.open-meteo.com/v1/search?name='+encodeURIComponent(place)+'&count=1')
      .then(function(r){return r.ok?r.json():null;})
      .then(function(g){
        if(!(g&&g.results&&g.results[0])) return null;
        var la=g.results[0].latitude, lo=g.results[0].longitude;
        var s1=addD(String(t.start_date).slice(0,10),-365), e1=addD(String(t.end_date||t.start_date).slice(0,10),-365);
        return fetch('https://archive-api.open-meteo.com/v1/archive?latitude='+la+'&longitude='+lo
          +'&start_date='+s1+'&end_date='+e1
          +'&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto')
          .then(function(r){return r.ok?r.json():null;})
          .then(function(w){
            if(!(w&&w.daily&&w.daily.temperature_2m_max&&w.daily.temperature_2m_max.length)) return null;
            var mx=w.daily.temperature_2m_max, mn=w.daily.temperature_2m_min, pr=w.daily.precipitation_sum||[];
            var avg=function(a){return Math.round(a.reduce(function(x,y){return x+(y||0);},0)/a.length);};
            var wet=pr.filter(function(p){return (p||0)>=1;}).length;
            return {weather_note:'Usually around '+avg(mx)+'° days / '+avg(mn)+'° nights for these dates'
              +(pr.length?(' · rain on '+wet+' of '+pr.length+' days last year'):'')};
          });
      }).catch(function(){return null;}));
  }
  if(!jobs.length) return;
  busy[t.id]=1;
  Promise.all(jobs).then(function(rs){
    var patch={id:t.id}; var got=false;
    rs.forEach(function(r){ if(r){ got=true; Object.keys(r).forEach(function(k){ if(r[k]!=null) patch[k]=r[k]; }); }});
    if(!got) return;
    return put('trips',patch).then(function(){
      var sh=document.getElementById('scrim');
      if(sh&&sh.classList.contains('show')) window.openTrip(t.id);
    });
  }).catch(function(){});
}

var _prev=window.openTrip;
window.openTrip=function(id){
  _prev(id);
  try{
    var t=D.trips.find(function(x){return x.id===id;}); if(!t) return;
    var sheet=document.getElementById('sheet'); if(!sheet) return;

    var h3=sheet.querySelector('h3');
    if(h3&&!h3.querySelector('.hdr-pen'))
      h3.insertAdjacentHTML('beforeend',' <button class="hdr-pen" onclick="editTrip(\''+id+'\')">&#9998;</button>');
    var dm=h3&&h3.nextElementSibling;
    if(dm&&dm.classList.contains('mini')&&!dm.querySelector('.hdr-pen'))
      dm.insertAdjacentHTML('beforeend',' <button class="hdr-pen" style="font-size:13px" onclick="tripDates(\''+id+'\')">&#128197;</button>');

    var labels=sheet.querySelectorAll('label.f');
    var flLab=null, endBtn=null;
    labels.forEach(function(l){ if(/^Flights$/i.test(l.textContent.trim())) flLab=l; });
    if(flLab){
      sheet.querySelectorAll('button').forEach(function(b){
        var oc=b.getAttribute('onclick')||'';
        if(oc==="editItem('"+id+"')") endBtn=b;
      });
      var wrap=document.createElement('div');
      wrap.innerHTML=itineraryHTML(t);
      flLab.parentNode.insertBefore(wrap,flLab);
      if(endBtn){
        var nd=flLab;
        while(nd){
          var nx=nd.nextSibling;
          if(nd.nodeType===1 && nd.id!=='smackBtn') nd.style.display='none';
          else if(nd.nodeType===3) nd.textContent='';
          if(nd===endBtn) break;
          nd=nx;
        }
      }
    }

    if(t.town_info){
      var anchor=sheet.querySelector('.divider')||sheet.children[2];
      var abt=document.createElement('div');
      abt.innerHTML='<label class="f">About '+E(placeName(t))+'</label>'
        +'<div class="abt">'+(t.about_img?'<img src="'+E(t.about_img)+'" alt="">':'')
        +'<div class="txt">'+E(t.town_info)+'</div></div>'
        +(t.weather_note?'<div class="wx-note">&#127782;&#65039; '+E(t.weather_note)+'</div>':'');
      if(anchor&&anchor.parentNode) anchor.parentNode.insertBefore(abt,anchor.nextSibling);
      labels.forEach(function(l){
        var tc=l.textContent.trim();
        if(/^About the destination$/i.test(tc)||/^Weather$/i.test(tc)){
          l.style.display='none';
          if(l.nextElementSibling) l.nextElementSibling.style.display='none';
        }
      });
    }
    enrich(t);
  }catch(e){}
};
})();


/* ===== v125 — lean trip editor + one Add button ======================
   1. The Edit-trip screen shrinks to what a human edits: title,
      destination, type, dates, notes. Reservations/About/Weather
      textareas are gone — reservations live in the itinerary now
      (the two old trips that used the box had it folded into Notes),
      and About/Weather fill themselves. About stays reachable under
      "More" in case Wikipedia guessed the wrong town.
   2. "+ Flight" stops being the headline. One "+ Add to itinerary"
      button asks WHAT first — drive/ferry, stay, activity, ticket,
      flight — because a road trip is not a flight with extra steps.
      Picking a kind opens the normal item editor preset to it.
   =================================================================== */
(function(){
'use strict';

/* ---------- 1. lean editor ---------- */
window.editTrip=function(id){
  var t=id?D.trips.find(function(x){return x.id===id;}):{};
  if(!t) t={};
  function v(x){return (x==null?'':String(x)).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');}
  openSheet('<h3>'+(id?'Edit trip':'New trip')+'</h3>'
   +'<label class="f">Title</label><input id="e_title" value="'+v(t.title)+'" placeholder="e.g. Hua Hin =Thai riviera">'
   +'<label class="f">Destination</label><input id="e_dest" value="'+v(t.dest)+'">'
   +'<label class="f">Type</label><select id="e_cat"><option value="personal"'+((t.category||'personal')!=='business'?' selected':'')+'>Personal</option><option value="business"'+(t.category==='business'?' selected':'')+'>Business</option></select>'
   +'<div class="two"><div><label class="f">Start</label><input id="e_start" type="date" value="'+(t.start_date||'')+'"></div><div><label class="f">End</label><input id="e_end" type="date" value="'+(t.end_date||'')+'"></div></div>'
   +'<label class="f">Notes</label><textarea id="e_notes">'+v(t.notes)+'</textarea>'
   +'<details style="margin-top:12px"><summary class="mini" style="cursor:pointer">More — About the place &amp; weather (usually automatic)</summary>'
   +'<label class="f">About</label><textarea id="e_town">'+v(t.town_info)+'</textarea>'
   +'<label class="f">Weather note</label><input id="e_weather" value="'+v(t.weather_note)+'"></details>'
   +'<button class="btn primary block" style="margin-top:16px" onclick="__ajSaveTrip(\''+(id||'')+'\')">Save</button>');
};
window.__ajSaveTrip=function(id){
  var g=function(i){var e=document.getElementById(i);return e?e.value:'';};
  var row={id:id||undefined,
    title:(g('e_title')||'').trim()||'Untitled trip',
    dest:(g('e_dest')||'').trim(),
    category:g('e_cat')||'personal',
    start_date:g('e_start')||null,
    end_date:g('e_end')||null,
    notes:(g('e_notes')||'').trim(),
    town_info:(g('e_town')||'').trim(),
    weather_note:(g('e_weather')||'').trim()};
  put('trips',row).then(function(newId){
    try{toast('Saved');}catch(e){}
    try{ if(id){ window.openTrip(id); } else { closeSheet(); render(); } }catch(e){ try{render();}catch(_e){} }
  });
};

/* ---------- 2. one Add button with a kind chooser ---------- */
window.__ajAdd=function(id){
  openSheet('<h3>Add to itinerary</h3>'
   +'<div class="tile-grid" style="margin-top:6px">'
   +'<div class="tile" onclick="__ajAddKind(\''+id+'\',\'transport\',\'Ferry \')"><span class="ic">&#9972;</span><span class="t">Ferry</span></div>'
   +'<div class="tile" onclick="__ajAddKind(\''+id+'\',\'transport\',\'Drive \')"><span class="ic">&#128663;</span><span class="t">Drive / car</span></div>'
   +'<div class="tile" onclick="__ajAddKind(\''+id+'\',\'hotel\',\'\')"><span class="ic">&#127976;</span><span class="t">Stay</span></div>'
   +'<div class="tile" onclick="__ajAddKind(\''+id+'\',\'activity\',\'\')"><span class="ic">&#128506;&#65039;</span><span class="t">Activity</span></div>'
   +'<div class="tile" onclick="__ajAddKind(\''+id+'\',\'ticket\',\'\')"><span class="ic">&#127915;</span><span class="t">Ticket</span></div>'
   +'<div class="tile" onclick="editFlight(\''+id+'\')"><span class="ic">&#9992;&#65039;</span><span class="t">Flight</span></div>'
   +'</div>');
};
window.__ajAddKind=function(id,kind,stub){
  editItem(id);
  setTimeout(function(){
    var k=document.getElementById('i_kind'); if(k) k.value=kind;
    var ti=document.getElementById('i_title');
    if(ti&&stub&&!ti.value){ ti.value=stub; ti.focus(); }
  },60);
};

/* swap the v124 itinerary buttons for the single Add */
(function(){
  var mo=null;
  function fix(){
    var sheet=document.getElementById('sheet'); if(!sheet) return;
    sheet.querySelectorAll('.btn-row').forEach(function(rw){
      var b=rw.querySelector('button[onclick^="editFlight("]');
      var b2=rw.querySelector('button[onclick^="editItem("]');
      if(b&&b2&&!rw.getAttribute('data-aj125')){
        var m=(b.getAttribute('onclick')||'').match(/editFlight\('([^']+)'\)/);
        if(!m) return;
        rw.setAttribute('data-aj125','1');
        rw.innerHTML='<button class="btn primary sm" onclick="__ajAdd(\''+m[1]+'\')">+ Add to itinerary</button>';
      }
    });
  }
  var _p=window.openTrip;
  window.openTrip=function(id){ _p(id); try{fix();}catch(e){} };
})();
})();


/* ===== v116: boarding pass — travel-day ticket in the top bar (AJ 29 Jul 2026) ===== */
(function(){try{
var css=document.createElement('style');
css.textContent='#bpBtn{position:fixed;top:10px;left:50%;transform:translateX(-50%);z-index:60;background:var(--teal,#2b4a7a);color:#fff;border:none;border-radius:10px;padding:5px 13px;font-size:17px;box-shadow:0 4px 14px rgba(0,0,0,.28);cursor:pointer;display:none;animation:bpPulse 1.5s infinite}'
+'@keyframes bpPulse{0%,100%{transform:translateX(-50%) scale(1)}50%{transform:translateX(-50%) scale(1.12)}}'
+'#bpOv{position:fixed;inset:0;z-index:9999;background:#fff;display:none;flex-direction:column}#bpOv.on{display:flex}'
+'#bpOv iframe{flex:1;border:0;width:100%}'
+'#bpTop{padding:12px 14px;display:flex;justify-content:space-between;align-items:center;background:var(--teal,#2b4a7a);color:#fff;font-weight:bold;padding-top:calc(12px + env(safe-area-inset-top))}'
+'#bpTop button{background:rgba(255,255,255,.22);color:#fff;border:0;border-radius:8px;padding:7px 14px;font-size:15px}'
+'@media (min-width:900px){#bpBtn{top:12px}#bpOv{left:50%;margin-left:-260px;width:520px;right:auto;box-shadow:0 0 44px rgba(20,40,50,.3)}}';
document.head.appendChild(css);
var btn=document.createElement('button');btn.id='bpBtn';btn.type='button';btn.innerHTML='&#127915;';document.body.appendChild(btn);
var ov=document.createElement('div');ov.id='bpOv';document.body.appendChild(ov);
var wl=null;
function tdy(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function reWake(){if(document.visibilityState==='visible'&&ov.classList.contains('on')&&navigator.wakeLock&&navigator.wakeLock.request){navigator.wakeLock.request('screen').then(function(l){wl=l;}).catch(function(){});}}
document.addEventListener('visibilitychange',reWake);
var PS=[];
function sc(p,em){var px=String(p.pax||'').toUpperCase(); if(/^jj/i.test(em)) return /MRS|JACQUELINE/.test(px)?2:0; if(/^aj/i.test(em)) return /ADRIAN|\bMR\b(?!S)/.test(px)?2:0; return 0;}
function pdfLib(cb){ if(window.pdfjsLib){cb();return;} var s=document.createElement('script'); s.src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'; s.onload=function(){ try{ pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'; }catch(e){} cb(); }; s.onerror=function(){cb();}; document.head.appendChild(s); }
function renderDoc(p){ var body=document.getElementById('bpBody'); if(!body)return;
 sb.from('documents').select('content,mime').eq('id',p.doc_id).single().then(function(r){
  var d=r&&r.data; if(!d||!d.content){ body.innerHTML='<p style="padding:20px">Pass not found.</p>'; return; }
  var bin=atob(String(d.content).replace(/\s/g,'')); var arr=new Uint8Array(bin.length); for(var i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);
  pdfLib(function(){ if(!window.pdfjsLib){ body.innerHTML='<p style="padding:20px">Viewer failed to load — check signal and reopen.</p>'; return; }
   pdfjsLib.getDocument({data:arr}).promise.then(function(pdf){
    var n=Math.min(pdf.numPages,3), w=Math.min(window.innerWidth,520);
    var done=0; for(var pg=1;pg<=n;pg++)(function(pg){ pdf.getPage(pg).then(function(page){
     var vp1=page.getViewport({scale:1}); var sc=(w-8)/vp1.width; var vp=page.getViewport({scale:sc*2});
     var c=document.createElement('canvas'); c.width=vp.width; c.height=vp.height; c.style.width=(vp.width/2)+'px'; c.style.height=(vp.height/2)+'px'; c.style.margin='4px auto'; c.style.display='block'; c.style.background='#fff'; c.style.boxShadow='0 2px 10px rgba(0,0,0,.15)';
     body.appendChild(c);
     page.render({canvasContext:c.getContext('2d'),viewport:vp});
    }); })(pg);
   }).catch(function(){ body.innerHTML='<p style="padding:20px">Could not read the PDF.</p>'; });
  });
 });
}
function show(p){
 ov.innerHTML='<div id="bpTop"><span>&#127915; '+(p.flight_no||'')+' &middot; '+(p.pax||'')+' &middot; '+(p.conf||'')+'</span><span>'+(PS.length>1?'<button id="bpSw" type="button" style="background:rgba(255,255,255,.22);color:#fff;border:0;border-radius:8px;padding:7px 12px;font-size:15px;margin-right:8px">&#8646; other</button>':'')+'<button id="bpX" type="button">Done</button></span></div>'
 +'<div id="bpBody" style="flex:1;overflow:auto;-webkit-overflow-scrolling:touch;background:#eef1f3;padding:6px 0"></div>'
 +'<div style="padding:8px 14px 22px;font-size:13px;color:#555">'+(p.title?p.title+' &middot; ':'')+(p.url?'<a href="'+p.url+'" target="_blank" rel="noopener">airline copy</a> &middot; ':'')+'Screen stays awake while this is showing.</div>';
 ov.classList.add('on'); reWake();
 if(p.doc_id){ renderDoc(p); } else if(p.url){ document.getElementById('bpBody').innerHTML='<iframe src="'+p.url+'" style="width:100%;height:100%;border:0"></iframe>'; }
 var x=document.getElementById('bpX'); if(x)x.onclick=closeOv; var sw=document.getElementById('bpSw'); if(sw)sw.onclick=chooseUI;
}
function closeOv(){ov.classList.remove('on');ov.innerHTML='';if(wl){try{wl.release();}catch(e){}wl=null;}}
function init(){ if(typeof sb==='undefined'||!sb||!sb.from){setTimeout(init,800);return;}
 sb.from('boarding_passes').select('*').eq('pdate',tdy()).then(function(r){
   var ps=(r&&r.data)||[]; if(!ps.length) return;
   btn.style.display='block';
   PS=ps;
   try{ sb.auth.getUser().then(function(u){ var em=String((u&&u.data&&u.data.user&&u.data.user.email)||''); PS.sort(function(a,b){return sc(b,em)-sc(a,em);}); }); }catch(e){}
   btn.onclick=function(){ if(PS.length) show(PS[0]); };
 });
}
function chooseUI(){
 ov.innerHTML='<div id="bpTop"><span>&#127915; Boarding passes</span><button id="bpX" type="button">Done</button></div>'
  +'<div id="bpBody" style="flex:1;overflow:auto;padding:26px 18px;background:#eef1f3">'
  + PS.map(function(p,ix){ return '<button type="button" class="bpPick" data-ix="'+ix+'" style="display:block;width:100%;margin:10px 0;padding:18px;font-size:17px;border-radius:14px;border:1px solid #ccd;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.08);text-align:left">&#127915; '+(p.pax||'Pass '+(ix+1))+' &middot; '+(p.flight_no||'')+(p.conf?' &middot; '+p.conf:'')+'</button>'; }).join('')
  +'</div>';
 ov.classList.add('on'); reWake();
 var x=document.getElementById('bpX'); if(x)x.onclick=closeOv;
 Array.prototype.forEach.call(ov.querySelectorAll('.bpPick'),function(b){ b.onclick=function(){ show(PS[+b.getAttribute('data-ix')]); }; });
}
init();
}catch(e){}})();


/* ===== v138 — Notes: Hotels split out of Places + 2-level collapsible tree =====
   Titles use a path: "Hotels › The Siam › Walks", "Places › ...", "Travel › ...",
   "Wine". Top-level groups (Hotels, Places, Travel, Notes, ...) are collapsible,
   closed by default. Within a top group, if a second-level name (e.g. a hotel)
   has more than one note under it, that name becomes its own nested collapsible
   sub-group (also closed by default); if it only has one note, it's shown as a
   plain row. Flat titles without › group under "Notes". Rendering only — every
   note listed, nothing hidden permanently.
   =================================================================== */
(function(){
'use strict';
var css=document.createElement('style');
css.id='v127css';
css.textContent='.ngrp{font-size:22px;letter-spacing:.2px;font-weight:500;text-transform:none;color:#000;margin:20px 2px 7px;cursor:pointer;display:flex;align-items:center;gap:7px;user-select:none;opacity:1}'
 +'.ngrp .gchev{display:inline-block;transition:transform .15s;font-size:15px}'
 +'.ngrp.open .gchev{transform:rotate(90deg)}'
 +'.nsub{font-size:17.5px;letter-spacing:.2px;font-weight:500;text-transform:none;color:#111;margin:14px 2px 6px 14px;cursor:pointer;display:flex;align-items:center;gap:7px;user-select:none;opacity:1}'
 +'.nsub .gchev{display:inline-block;transition:transform .15s;font-size:14px}'
 +'.nsub.open .gchev{transform:rotate(90deg)}'
 +'.nbody.sub{margin-left:14px}';
document.head.appendChild(css);
function ngKey(s){ return 'ajhub_ng_'+s; }
function isOpen(label){ try{ return localStorage.getItem(ngKey(label))==='1'; }catch(e){ return false; } }
function setOpen(label,v){ try{ localStorage.setItem(ngKey(label), v?'1':'0'); }catch(e){} }
var __ngHost=null;
function __ngFindHost(v){
  var rows=[].slice.call(v.querySelectorAll('.list-item'));
  for(var i=0;i<rows.length;i++){
    var p=rows[i].parentNode, nested=false, w=p;
    while(w && w!==v){ if(w.classList && w.classList.contains('nbody')){ nested=true; break; } w=w.parentNode; }
    if(!nested) return p;
  }
  if(rows.length){
    var w2=rows[0].parentNode;
    while(w2 && w2.classList && w2.classList.contains('nbody')) w2=w2.parentNode;
    return w2;
  }
  return null;
}
function regroup(){
  var v=document.getElementById('v-notes');
  if(!v||!v.classList.contains('active')) return;
  var rows=[].slice.call(v.querySelectorAll('.list-item'));
  if(!rows.length) return;
  rows.forEach(function(r){
    var h=r.querySelector('.li-main .h');
    if(h && r.dataset.ajFull===undefined){ r.dataset.ajFull=h.textContent; }
  });
  if(!__ngHost || !v.contains(__ngHost)){ __ngHost=__ngFindHost(v); }
  if(!__ngHost) return;
  [].slice.call(v.querySelectorAll('.ngrp,.nsub,.nbody')).forEach(function(el){ el.remove(); });
  rows.forEach(function(r){ __ngHost.appendChild(r); });
  var host=__ngHost;
  var top={}, topOrder=[];
  rows.forEach(function(r){
    var h=r.querySelector('.li-main .h'); if(!h) return;
    var full=r.dataset.ajFull||h.textContent;
    var parts=full.replace(/^\S+\s+/,'').split('›').map(function(s){return s.trim();});
    var t=parts.length>1?parts[0]:'Notes';
    var mid=parts.length>1?parts[1]:null;
    var leaf=parts.length>2?parts.slice(2).join(' › '):(mid||parts[0]);
    h.textContent=leaf;
    if(!top[t]){ top[t]={mids:{},midOrder:[],flat:[]}; topOrder.push(t); }
    if(mid){
      if(!top[t].mids[mid]){ top[t].mids[mid]={rows:[]}; top[t].midOrder.push(mid); }
      top[t].mids[mid].rows.push(r);
    } else {
      top[t].flat.push(r);
    }
  });
  topOrder.sort(function(a,b){ if(a==='Notes')return 1; if(b==='Notes')return -1; return a.localeCompare(b); });
  topOrder.forEach(function(t){
    var grp=top[t];
    var total=grp.flat.length+grp.midOrder.reduce(function(n,m){return n+grp.mids[m].rows.length;},0);
    var hd=document.createElement('div'); hd.className='ngrp'+(isOpen(t)?' open':'');
    hd.innerHTML='<span class="gchev">›</span>'+t+' · '+total;
    var body=document.createElement('div'); body.className='nbody';
    body.style.display=isOpen(t)?'':'none';
    hd.onclick=function(){
      var o=!hd.classList.contains('open');
      hd.classList.toggle('open',o);
      body.style.display=o?'':'none';
      setOpen(t,o);
    };
    host.appendChild(hd);
    host.appendChild(body);
    grp.flat.forEach(function(r){ body.appendChild(r); });
    grp.midOrder.forEach(function(m){
      var mrows=grp.mids[m].rows;
      var mkey=t+' › '+m;
      var shd=document.createElement('div'); shd.className='nsub'+(isOpen(mkey)?' open':'');
      shd.innerHTML='<span class="gchev">›</span>'+m+' · '+mrows.length;
      var sbody=document.createElement('div'); sbody.className='nbody sub';
      sbody.style.display=isOpen(mkey)?'':'none';
      shd.onclick=function(){
        var o=!shd.classList.contains('open');
        shd.classList.toggle('open',o);
        sbody.style.display=o?'':'none';
        setOpen(mkey,o);
      };
      body.appendChild(shd);
      body.appendChild(sbody);
      mrows.forEach(function(r){ sbody.appendChild(r); });
    });
  });
}
if(typeof window.rNotes==='function'){
  var _r=window.rNotes;
  window.rNotes=function(){ var o=_r.apply(this,arguments); try{ regroup(); }catch(e){} return o; };
}
setInterval(function(){try{regroup();}catch(e){}},800);
})();


/* ===== v208: ✴ Ask Claude — full chat surface (streaming, markdown, threads, images).
   Replaces the v207 block. AJ 12 Aug 26: "create better version of claude interface". ===== */
(function(){try{
var CFG = (window.AJ_CONFIG||{});
var FN = (CFG.SUPABASE_URL||'') + '/functions/v1/ask';
var css=document.createElement('style');
css.textContent='#akBtn svg{display:block}'
+'#akOv{position:fixed;inset:0;z-index:9998;background:#f2f4f6;display:none;flex-direction:column;--akSurface:#fff;--akLine:#dfe5ea;--akText:#1b2733;--akMute:#8b95a1;--akBg:#f2f4f6;--akAccent:#7c5cff}'
+'#akOv.on{display:flex}'
+'@media (prefers-color-scheme: dark){#akOv{--akSurface:#1c2230;--akLine:#2e3849;--akText:#e8edf3;--akMute:#8794a5;--akBg:#131823;background:#131823;color:#e8edf3}}'
+'#akTop{padding:11px 12px;padding-top:calc(11px + env(safe-area-inset-top));display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#7c5cff,#b0227d);color:#fff;font-weight:bold;gap:8px;flex:0 0 auto}'
+'#akTop button{background:rgba(255,255,255,.22);color:#fff;border:0;border-radius:8px;padding:7px 12px;font-size:15px;white-space:nowrap}'
+'#akTop .akTitle{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:center;font-size:16px}'
+'#akBody{flex:1 1 auto;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:14px;display:flex;flex-direction:column;min-height:0;color:var(--akText)}'
+'#akSearch{width:100%;box-sizing:border-box;border:1px solid var(--akLine);background:var(--akSurface);color:var(--akText);border-radius:12px;padding:11px 13px;font-size:16px;margin-bottom:10px}'
+'.akRow{background:var(--akSurface);border:1px solid var(--akLine);border-radius:12px;padding:12px 14px;margin-bottom:9px;display:flex;justify-content:space-between;align-items:center;gap:8px}'
+'.akRow .t{font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;cursor:pointer}'
+'.akRow .d{color:var(--akMute);font-size:12px;white-space:nowrap}'
+'.akRow .ic{background:none;border:0;color:var(--akMute);font-size:15px;padding:4px 5px;line-height:1}'
+'#akNewBtn{display:block;width:100%;background:var(--akAccent);color:#fff;border:0;border-radius:12px;padding:14px;font-size:16px;font-weight:600;margin-bottom:12px}'
+'#akMsgs{flex:1 0 auto;display:flex;flex-direction:column;justify-content:flex-end}'
+'.akB{max-width:88%;margin:5px 0;padding:10px 14px;border-radius:16px;font-size:15px;line-height:1.5;word-break:break-word;position:relative}'
+'.akB.u{align-self:flex-end;background:var(--akAccent);color:#fff;border-bottom-right-radius:5px;white-space:pre-wrap}'
+'.akB.a{align-self:flex-start;background:var(--akSurface);border:1px solid var(--akLine);border-bottom-left-radius:5px;color:var(--akText)}'
+'.akB.err{border-color:#d9534f;color:#c9302c}'
+'.akB.think{color:var(--akMute);font-style:italic}'
+'.akB img.akShot{max-width:100%;border-radius:10px;margin:4px 0}'
+'.akB p{margin:.45em 0}.akB ul,.akB ol{margin:.45em 0;padding-left:1.25em}.akB li{margin:.15em 0}'
+'.akB h1,.akB h2,.akB h3{margin:.6em 0 .3em;font-size:1.06em;font-weight:700}'
+'.akB blockquote{margin:.4em 0;padding-left:.7em;border-left:3px solid var(--akLine);color:var(--akMute)}'
+'.akB code.i{background:rgba(127,127,127,.16);padding:1px 5px;border-radius:5px;font-size:.9em;font-family:ui-monospace,Menlo,Consolas,monospace}'
+'.akB table{border-collapse:collapse;font-size:.9em;margin:.4em 0;display:block;overflow-x:auto}'
+'.akB th,.akB td{border:1px solid var(--akLine);padding:4px 7px;text-align:left}'
+'.akCode{position:relative;background:#10141c;color:#e6edf3;border-radius:10px;margin:.5em 0;overflow:hidden}'
+'.akCode pre{margin:0;padding:11px 12px;overflow-x:auto;font-size:12.5px;line-height:1.45;font-family:ui-monospace,Menlo,Consolas,monospace}'
+'.akCode .cp{position:absolute;top:6px;right:6px;background:rgba(255,255,255,.14);color:#fff;border:0;border-radius:7px;padding:4px 9px;font-size:11px}'
+'.akActs{align-self:flex-start;display:flex;gap:6px;margin:0 0 8px 4px}'
+'.akActs button{background:none;border:1px solid var(--akLine);color:var(--akMute);border-radius:9px;padding:4px 10px;font-size:12px}'
+'#akFoot{flex:0 0 auto;background:var(--akBg);border-top:1px solid var(--akLine);padding:8px 12px;padding-bottom:calc(10px + env(safe-area-inset-bottom))}'
+'#akChips{margin-bottom:7px;white-space:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch}'
+'.akChip{display:inline-block;border:1px solid var(--akLine);background:var(--akSurface);color:var(--akText);border-radius:20px;padding:5px 12px;margin-right:6px;font-size:13px;cursor:pointer}'
+'.akChip.on{background:var(--akAccent);color:#fff;border-color:var(--akAccent)}'
+'#akThumbs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px}'
+'#akThumbs .th{position:relative}#akThumbs img{height:52px;width:52px;object-fit:cover;border-radius:8px;border:1px solid var(--akLine)}'
+'#akThumbs .x{position:absolute;top:-6px;right:-6px;background:#333;color:#fff;border:0;border-radius:50%;width:19px;height:19px;font-size:12px;line-height:19px;padding:0}'
+'#akInRow{display:flex;gap:8px;align-items:flex-end}'
+'#akClip{background:var(--akSurface);border:1px solid var(--akLine);color:var(--akMute);border-radius:12px;height:44px;width:42px;font-size:19px;flex:0 0 auto}'
+'#akIn{flex:1;box-sizing:border-box;min-height:44px;max-height:130px;border:1px solid var(--akLine);border-radius:14px;padding:11px 13px;font-size:16px;font-family:inherit;resize:none;background:var(--akSurface);color:var(--akText)}'
+'#akSend{background:#1f3a5f;color:#fff;border:0;border-radius:12px;padding:0 18px;height:44px;font-size:16px;font-weight:600;flex:0 0 auto}'
+'#akSend.stop{background:#c9302c}'
+'@media (min-width:900px){#akOv{left:50%;margin-left:-260px;width:520px;right:auto;box-shadow:0 0 44px rgba(20,40,50,.3)}}';
document.head.appendChild(css);

/* ---------- header button ---------- */
var btn=document.createElement('button');btn.id='akBtn';btn.className='hdr-ic';btn.type='button';btn.title='Ask Claude';btn.setAttribute('aria-label','Ask Claude');
btn.innerHTML='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D97757" stroke-width="2.3" stroke-linecap="round"><line x1="12" y1="2.6" x2="12" y2="8.2"/><line x1="12" y1="15.8" x2="12" y2="21.4"/><line x1="2.6" y1="12" x2="8.2" y2="12"/><line x1="15.8" y1="12" x2="21.4" y2="12"/><line x1="5.2" y1="5.2" x2="9.2" y2="9.2"/><line x1="14.8" y1="14.8" x2="18.8" y2="18.8"/><line x1="18.8" y1="5.2" x2="14.8" y2="9.2"/><line x1="9.2" y1="14.8" x2="5.2" y2="18.8"/></svg>';
(function seat(n){var s=document.getElementById('hdrSearch'); if(s&&s.parentNode){s.parentNode.insertBefore(btn,s);} else if((n||0)<40){setTimeout(function(){seat((n||0)+1);},500);} else {btn.style.cssText='position:fixed;top:10px;right:110px;z-index:60;background:none;border:none;cursor:pointer';document.body.appendChild(btn);} })(0);
var ov=document.createElement('div');ov.id='akOv';document.body.appendChild(ov);

var MODES=[['chat','💬 Chat'],['walk','🗺️ Walk'],['research','🔎 Research'],['note','📝 Note'],['contact','👤 Contact']];
var mode='chat', hard=false, chatId=null, chatTitle='', busy=false, allChats=[], pics=[], ctrl=null, lastUserText='';

function escT(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function ago(s){ try{ var ms=Date.now()-new Date(s).getTime(); var m=Math.floor(ms/60000); if(m<1)return 'now'; if(m<60)return m+'m'; var h=Math.floor(m/60); if(h<24)return h+'h'; return Math.floor(h/24)+'d'; }catch(e){ return ''; } }

/* ---------- tiny markdown renderer (safe: escapes first) ---------- */
function mdInline(s){
  s=s.replace(/`([^`\n]+)`/g,function(_,c){return '<code class="i">'+c+'</code>';});
  s=s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
  s=s.replace(/(^|[^*])\*([^*\n]+)\*/g,'$1<em>$2</em>');
  s=s.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
  s=s.replace(/(^|\s)(https?:\/\/[^\s<]+)/g,'$1<a href="$2" target="_blank" rel="noopener">$2</a>');
  return s;
}
function mdRender(src){
  var txt=escT(src||''), out=[], i, codes=[];
  // fenced code blocks -> placeholders
  txt=txt.replace(/```([a-zA-Z0-9+#-]*)\n?([\s\S]*?)(?:```|$)/g,function(_,lang,body){
    codes.push(body.replace(/\n$/,'')); return '@@CBK'+(codes.length-1)+'@@';
  });
  var lines=txt.split('\n'), listType=null, buf=[];
  function closeList(){ if(listType){ out.push('</'+listType+'>'); listType=null; } }
  function flushP(){ if(buf.length){ out.push('<p>'+mdInline(buf.join('<br>'))+'</p>'); buf=[]; } }
  for(i=0;i<lines.length;i++){
    var L=lines[i];
    var cm=L.match(/^@@CBK(\d+)@@$/);
    if(cm){ flushP(); closeList(); out.push('@@CBX'+cm[1]+'@@'); continue; }
    if(/^\s*$/.test(L)){ flushP(); closeList(); continue; }
    var h=L.match(/^(#{1,4})\s+(.*)$/);
    if(h){ flushP(); closeList(); out.push('<h3>'+mdInline(h[2])+'</h3>'); continue; }
    if(/^&gt;\s?/.test(L)){ flushP(); closeList(); out.push('<blockquote>'+mdInline(L.replace(/^&gt;\s?/,''))+'</blockquote>'); continue; }
    if(/^\s*([-*•])\s+/.test(L)){ flushP(); if(listType!=='ul'){closeList();out.push('<ul>');listType='ul';} out.push('<li>'+mdInline(L.replace(/^\s*[-*•]\s+/,''))+'</li>'); continue; }
    if(/^\s*\d+[.)]\s+/.test(L)){ flushP(); if(listType!=='ol'){closeList();out.push('<ol>');listType='ol';} out.push('<li>'+mdInline(L.replace(/^\s*\d+[.)]\s+/,''))+'</li>'); continue; }
    if(/^\s*\|.*\|\s*$/.test(L)){
      flushP(); closeList();
      var rows=[]; while(i<lines.length&&/^\s*\|.*\|\s*$/.test(lines[i])){ rows.push(lines[i]); i++; } i--;
      var html='<table>';
      rows.forEach(function(r,ri){
        if(/^\s*\|[\s:|-]+\|\s*$/.test(r)) return;
        var cells=r.replace(/^\s*\|/,'').replace(/\|\s*$/,'').split('|');
        html+='<tr>'+cells.map(function(c){ return (ri===0?'<th>':'<td>')+mdInline(c.trim())+(ri===0?'</th>':'</td>'); }).join('')+'</tr>';
      });
      out.push(html+'</table>'); continue;
    }
    buf.push(L);
  }
  flushP(); closeList();
  var html=out.join('');
  html=html.replace(/@@CBX(\d+)@@/g,function(_,n){
    return '<div class="akCode"><button class="cp" type="button">Copy</button><pre>'+codes[+n]+'</pre></div>';
  });
  return html;
}
function wireCopies(el){
  Array.prototype.forEach.call(el.querySelectorAll('.akCode .cp'),function(b){
    b.onclick=function(){
      var t=b.parentNode.querySelector('pre').innerText;
      var done=function(){ b.textContent='Copied'; setTimeout(function(){b.textContent='Copy';},1400); };
      if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done,done);
      else { var ta=document.createElement('textarea'); ta.value=t; document.body.appendChild(ta); ta.select(); try{document.execCommand('copy');}catch(e){} ta.remove(); done(); }
    };
  });
}

/* ---------- chrome ---------- */
function topBar(back,title){
 return '<div id="akTop">'+(back?'<button id="akBack" type="button">‹ Chats</button>':'<span style="width:64px"></span>')
  +'<span class="akTitle">'+escT(title||'✴ Ask Claude')+'</span><button id="akX" type="button">Done</button></div>';
}
function wireTop(onBack){
 var x=document.getElementById('akX'); if(x) x.onclick=function(){ stopGen(); ov.classList.remove('on'); };
 var bk=document.getElementById('akBack'); if(bk&&onBack) bk.onclick=function(){ stopGen(); onBack(); };
}

/* ---------- conversation list ---------- */
window.akShowList=function(){
 chatId=null; chatTitle=''; pics=[];
 ov.innerHTML=topBar(false,'✴ Ask Claude')+'<div id="akBody"><button id="akNewBtn" type="button">＋ New chat</button><input id="akSearch" type="search" placeholder="Search chats…"><div id="akChats" class="mini">Loading…</div></div>';
 wireTop();
 document.getElementById('akNewBtn').onclick=function(){ akShowThread(null,'New chat',[]); };
 document.getElementById('akSearch').oninput=function(){ paintChats(this.value); };
 sb.from('claude_chats').select('id,title,updated_at').order('updated_at',{ascending:false}).limit(200).then(function(r){
  if(r&&r.error){ var el=document.getElementById('akChats'); if(el) el.innerHTML='<div class="mini">Chats unavailable offline. <button id="akRetryList" class="akChip">Retry</button></div>'; var rb=document.getElementById('akRetryList'); if(rb) rb.onclick=akShowList; return; }
  allChats=(r&&r.data)||[]; paintChats('');
 });
};
function paintChats(filter){
 var el=document.getElementById('akChats'); if(!el) return;
 el.className='';
 var f=(filter||'').toLowerCase();
 var data=allChats.filter(function(c){ return !f || String(c.title||'').toLowerCase().indexOf(f)!==-1; });
 el.innerHTML = data.length ? data.map(function(c){
  return '<div class="akRow" data-id="'+c.id+'"><span class="t">'+escT(c.title||'Chat')+'</span><span class="d">'+ago(c.updated_at)+'</span>'
   +'<button class="ic ren" type="button" title="Rename">✎</button><button class="ic del" type="button" title="Delete">🗑</button></div>';
 }).join('') : '<div class="mini">'+(f?'No chats match.':'No chats yet — start one.')+'</div>';
 Array.prototype.forEach.call(el.querySelectorAll('.akRow'),function(row){
  var id=row.getAttribute('data-id');
  row.querySelector('.t').onclick=function(){ akShowThread(id, row.querySelector('.t').textContent, null); };
  row.querySelector('.ren').onclick=function(e){
   e.stopPropagation();
   var cur=row.querySelector('.t').textContent;
   var nt=window.prompt('Rename chat', cur);
   if(nt==null) return; nt=nt.trim(); if(!nt||nt===cur) return;
   row.querySelector('.t').textContent=nt;
   allChats.forEach(function(c){ if(c.id===id) c.title=nt; });
   sb.from('claude_chats').update({title:nt}).eq('id',id).then(function(){},function(){});
  };
  row.querySelector('.del').onclick=function(e){
   e.stopPropagation();
   if(!window.confirm('Delete this chat and its messages?')) return;
   row.remove();
   allChats=allChats.filter(function(c){ return c.id!==id; });
   sb.from('claude_messages').delete().eq('chat_id',id).then(function(){
    sb.from('claude_chats').delete().eq('id',id).then(function(){},function(){});
   },function(){});
  };
 });
}

/* ---------- thread ---------- */
function bubble(role,text,think){
 var b=document.createElement('div'); b.className='akB '+(role==='user'?'u':'a')+(think?' think':'');
 if(role==='user'){ b.textContent=text; } else { b.innerHTML=mdRender(text); wireCopies(b); }
 return b;
}
function footer(){
 return '<div id="akFoot"><div id="akChips">'+MODES.map(function(m){return '<span class="akChip'+(mode===m[0]?' on':'')+'" data-m="'+m[0]+'">'+m[1]+'</span>';}).join('')
  +'<span class="akChip'+(hard?' on':'')+'" data-m="__hard">🧠 Think hard</span></div>'
  +'<div id="akThumbs"></div>'
  +'<div id="akInRow"><button id="akClip" type="button" title="Attach image">📎</button>'
  +'<textarea id="akIn" placeholder="Message Claude…" rows="1"></textarea>'
  +'<button id="akSend" type="button">Send</button></div>'
  +'<input id="akFile" type="file" accept="image/*" multiple style="display:none"></div>';
}
function wireFooter(){
 Array.prototype.forEach.call(ov.querySelectorAll('.akChip'),function(c){c.onclick=function(){
  var m=c.getAttribute('data-m');
  if(m==='__hard'){hard=!hard;}else{mode=m;}
  Array.prototype.forEach.call(ov.querySelectorAll('.akChip'),function(cc){
   var mm=cc.getAttribute('data-m');
   cc.classList.toggle('on', mm==='__hard'?hard:(mode===mm));
  });
 };});
 var ta=document.getElementById('akIn');
 ta.oninput=function(){ ta.style.height='auto'; ta.style.height=Math.min(ta.scrollHeight,130)+'px'; };
 ta.onkeydown=function(e){ if(e.key==='Enter'&&!e.shiftKey&&window.innerWidth>=900){ e.preventDefault(); akSend(); } };
 ta.onfocus=function(){ setTimeout(scrollEnd,250); };
 document.getElementById('akSend').onclick=function(){ if(busy) stopGen(); else akSend(); };
 var clip=document.getElementById('akClip'), file=document.getElementById('akFile');
 clip.onclick=function(){ file.click(); };
 file.onchange=function(){ Array.prototype.forEach.call(file.files||[],addPic); file.value=''; };
}
function addPic(f){
 if(pics.length>=5) return;
 var fr=new FileReader();
 fr.onload=function(){
  var img=new Image();
  img.onload=function(){
   var max=1100, w=img.width, h=img.height, sc=Math.min(1,max/Math.max(w,h));
   var cv=document.createElement('canvas'); cv.width=Math.round(w*sc); cv.height=Math.round(h*sc);
   cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);
   var url=cv.toDataURL('image/jpeg',0.82);
   pics.push({media_type:'image/jpeg', data:url.split(',')[1], url:url});
   paintThumbs();
  };
  img.src=fr.result;
 };
 fr.readAsDataURL(f);
}
function paintThumbs(){
 var t=document.getElementById('akThumbs'); if(!t) return;
 t.innerHTML=pics.map(function(p,i){ return '<div class="th"><img src="'+p.url+'"><button class="x" type="button" data-i="'+i+'">×</button></div>'; }).join('');
 Array.prototype.forEach.call(t.querySelectorAll('.x'),function(b){ b.onclick=function(){ pics.splice(+b.getAttribute('data-i'),1); paintThumbs(); }; });
}
window.akShowThread=function(id,title,preloaded){
 chatId=id||null; chatTitle=title||'New chat'; pics=[];
 ov.innerHTML=topBar(true,chatTitle)+'<div id="akBody"><div id="akMsgs"></div></div>'+footer();
 wireTop(function(){ akShowList(); });
 wireFooter();
 var ms=document.getElementById('akMsgs');
 if(preloaded){ preloaded.forEach(function(m){ ms.appendChild(bubble(m.role,m.content)); }); scrollEnd(); }
 else if(chatId){
  ms.innerHTML='<div class="mini">Loading…</div>';
  sb.from('claude_messages').select('role,content,model,created_at').eq('chat_id',chatId).order('created_at',{ascending:true}).limit(200).then(function(r){
   ms.innerHTML='';
   if(r&&r.error){ ms.appendChild(errBubble('Could not load this thread.', function(){ akShowThread(id,title,null); })); return; }
   var d=((r&&r.data)||[]);
   d.forEach(function(m){ ms.appendChild(bubble(m.role,m.content)); });
   for(var k=d.length-1;k>=0;k--){ if(d[k].role==='user'){ lastUserText=d[k].content; break; } }
   addActions();
   scrollEnd();
  });
 }
 setTimeout(function(){ var ta=document.getElementById('akIn'); if(ta) ta.focus(); },150);
};
function errBubble(msg,retryFn){
 var b=document.createElement('div'); b.className='akB a err';
 b.innerHTML='<div>'+escT(msg)+'</div>';
 var r=document.createElement('button'); r.className='akChip'; r.type='button'; r.textContent='Retry'; r.style.marginTop='7px';
 r.onclick=function(){ b.remove(); retryFn(); };
 b.appendChild(r); return b;
}
function scrollEnd(){ var b=document.getElementById('akBody'); if(b) b.scrollTop=b.scrollHeight+9999; }

/* action row under the last assistant answer: Retry / Edit last */
function addActions(){
 var ms=document.getElementById('akMsgs'); if(!ms) return;
 Array.prototype.forEach.call(ms.querySelectorAll('.akActs'),function(n){n.remove();});
 if(!chatId) return;
 var bubbles=ms.querySelectorAll('.akB');
 if(!bubbles.length || !bubbles[bubbles.length-1].classList.contains('a')) return;
 var row=document.createElement('div'); row.className='akActs';
 row.innerHTML='<button type="button" data-a="retry">↻ Retry</button><button type="button" data-a="edit">✎ Edit last</button><button type="button" data-a="copy">⧉ Copy</button>';
 row.querySelector('[data-a="retry"]').onclick=function(){ doRetry(); };
 row.querySelector('[data-a="edit"]').onclick=function(){
  var ta=document.getElementById('akIn'); if(!ta) return;
  ta.value=lastUserText||''; ta.focus(); ta.oninput();
  ta.setAttribute('data-edit','1');
 };
 row.querySelector('[data-a="copy"]').onclick=function(){
  var t=bubbles[bubbles.length-1].innerText;
  if(navigator.clipboard) navigator.clipboard.writeText(t);
 };
 ms.appendChild(row);
}

/* ---------- send / stream ---------- */
function stopGen(){ if(ctrl){ try{ctrl.abort();}catch(e){} ctrl=null; } }
function setBusy(v){
 busy=v;
 var s=document.getElementById('akSend');
 if(s){ s.textContent=v?'Stop':'Send'; s.classList.toggle('stop',!!v); }
}
async function authHeaders(){
 var h={'Content-Type':'application/json','apikey':CFG.SUPABASE_KEY||''};
 try{ var s=await sb.auth.getSession(); var tk=s&&s.data&&s.data.session&&s.data.session.access_token; if(tk) h['Authorization']='Bearer '+tk; }catch(e){}
 return h;
}
async function saveAssistant(text,model){
 if(!chatId||!text) return;
 try{
  await sb.from('claude_messages').insert({chat_id:chatId,role:'assistant',content:text,model:model||null});
  await sb.from('claude_chats').update({updated_at:new Date().toISOString()}).eq('id',chatId);
 }catch(e){}
}
async function doRetry(){
 if(busy||!chatId) return;
 var ms=document.getElementById('akMsgs');
 Array.prototype.forEach.call(ms.querySelectorAll('.akActs'),function(n){n.remove();});
 var bubbles=ms.querySelectorAll('.akB');
 if(bubbles.length&&bubbles[bubbles.length-1].classList.contains('a')) bubbles[bubbles.length-1].remove();
 await streamTurn('', true);
}
window.akSend=function(){
 var ta=document.getElementById('akIn'); var q=(ta&&ta.value||'').trim();
 if(busy||!q) return;
 var isEdit = ta.getAttribute('data-edit')==='1';
 ta.removeAttribute('data-edit');
 ta.value=''; ta.style.height='auto';
 var ms=document.getElementById('akMsgs'); if(!ms) return;
 Array.prototype.forEach.call(ms.querySelectorAll('.akActs'),function(n){n.remove();});
 if(isEdit&&chatId){
  // drop the last user+assistant pair from the view and the store, then resend
  var bs=ms.querySelectorAll('.akB');
  for(var k=bs.length-1,removed=0;k>=0&&removed<2;k--){ bs[k].remove(); removed++; }
  sb.from('claude_messages').select('id,role,created_at').eq('chat_id',chatId).order('created_at',{ascending:false}).limit(2)
    .then(function(r){ ((r&&r.data)||[]).forEach(function(m){ sb.from('claude_messages').delete().eq('id',m.id).then(function(){},function(){}); }); },function(){});
 }
 lastUserText=q;
 var ub=bubble('user',q);
 if(pics.length){ pics.forEach(function(p){ var im=document.createElement('img'); im.className='akShot'; im.src=p.url; ub.appendChild(im); }); }
 ms.appendChild(ub);
 // non-chat modes keep the v4 one-shot contract
 if(mode!=='chat'){ oneShot(q); return; }
 streamTurn(q,false);
};
async function oneShot(q){
 var ms=document.getElementById('akMsgs');
 var th=bubble('assistant','✴ Thinking'+(hard?' hard':'')+'…',true); ms.appendChild(th); scrollEnd();
 setBusy(true);
 try{
  var r=await sb.functions.invoke('ask',{body:{q:q,type:mode,hard:hard}});
  var d=(r&&r.data)||{}; var out='';
  if(d.note_id) out='Saved to Notes: '+(d.title||'')+'\n\nOpen the Notes tab to read it. ('+(d.model||'')+')';
  else if(d.created) out='Contacts created: '+d.created.join(', ');
  else if(d.answer) out=d.answer+((d.filed&&d.filed.length)?'\n\n📋 Filed: '+d.filed.join(' · '):'');
  else out='Error: '+(d.error?JSON.stringify(d.error).slice(0,200):'no answer — try again.');
  th.classList.remove('think'); th.innerHTML=mdRender(out); wireCopies(th);
 }catch(e){
  th.remove(); ms.appendChild(errBubble('Could not reach the server. '+String(e&&e.message||e).slice(0,120), function(){ oneShot(q); }));
 }
 setBusy(false); scrollEnd();
}
async function streamTurn(q,isRetry){
 var ms=document.getElementById('akMsgs');
 var th=bubble('assistant','✴ Thinking'+(hard?' hard':'')+'…',true); ms.appendChild(th); scrollEnd();
 setBusy(true);
 var acc='', model='', gotAny=false;
 var sentPics=pics.slice(); pics=[]; paintThumbs();
 ctrl=new AbortController();
 try{
  var hdrs=await authHeaders();
  var payload={q:q,type:'chat',hard:hard,stream:true};
  if(chatId) payload.chat_id=chatId;
  if(isRetry) payload.retry=true;
  if(sentPics.length) payload.images=sentPics.map(function(p){return {media_type:p.media_type,data:p.data};});
  var res=await fetch(FN,{method:'POST',headers:hdrs,body:JSON.stringify(payload),signal:ctrl.signal});
  if(!res.ok||!res.body){ throw new Error('server '+res.status); }
  var reader=res.body.getReader(), dec=new TextDecoder(), buf='';
  while(true){
   var rr=await reader.read(); if(rr.done) break;
   buf+=dec.decode(rr.value,{stream:true});
   var idx;
   while((idx=buf.indexOf('\n\n'))!==-1){
    var chunk=buf.slice(0,idx); buf=buf.slice(idx+2);
    var evName='', dataLine='';
    chunk.split('\n').forEach(function(l){ if(l.indexOf('event: ')===0) evName=l.slice(7); else if(l.indexOf('data: ')===0) dataLine=l.slice(6); });
    if(!dataLine) continue;
    var d; try{ d=JSON.parse(dataLine); }catch(e){ continue; }
    if(evName==='meta'){
     model=d.model||'';
     if(d.chat_id&&!chatId){ chatId=d.chat_id; }
     if(d.title){ chatTitle=d.title; var t=ov.querySelector('.akTitle'); if(t) t.textContent=d.title; }
    } else if(evName==='delta'){
     if(!gotAny){ gotAny=true; th.classList.remove('think'); th.innerHTML=''; }
     acc+=d.t||'';
     th.innerHTML=mdRender(acc); scrollEnd();
    } else if(evName==='tool'){
     if(!gotAny){ th.textContent='✴ Working on it…'; }
    } else if(evName==='error'){
     acc+= (acc?'\n\n':'')+'⚠ '+String(d.detail&&(d.detail.message||JSON.stringify(d.detail))||'error').slice(0,220);
     th.classList.remove('think'); th.innerHTML=mdRender(acc);
    } else if(evName==='done'){
     if(d.filed&&d.filed.length){ acc+='\n\n📋 Filed to the maintenance queue: '+d.filed.join(' · '); th.innerHTML=mdRender(acc); }
    }
   }
  }
  th.classList.remove('think'); th.innerHTML=mdRender(acc||'(no answer)'); wireCopies(th);
  await saveAssistant(acc,model);
 }catch(e){
  var aborted = e && (e.name==='AbortError');
  if(aborted){
   th.classList.remove('think');
   acc = acc ? acc+'\n\n_(stopped)_' : '_(stopped)_';
   th.innerHTML=mdRender(acc); wireCopies(th);
   await saveAssistant(acc,model);
  } else {
   th.remove();
   ms.appendChild(errBubble('Could not reach Claude ('+String(e&&e.message||e).slice(0,90)+').', function(){ pics=sentPics; streamTurn(q,isRetry); }));
  }
 }
 ctrl=null; setBusy(false); addActions(); scrollEnd();
}

/* ---------- keyboard-safe layout (no viewport jump on mobile) ---------- */
(function(){
 var vv=window.visualViewport; if(!vv) return;
 function fit(){
  if(!ov.classList.contains('on')) { ov.style.height=''; ov.style.top=''; return; }
  ov.style.height=vv.height+'px';
  ov.style.top=(vv.offsetTop||0)+'px';
  ov.style.bottom='auto';
 }
 vv.addEventListener('resize',fit); vv.addEventListener('scroll',fit);
 window.akFitViewport=fit;
})();

btn.onclick=function(){ ov.classList.add('on'); if(window.akFitViewport) window.akFitViewport(); akShowList(); };
}catch(e){}})();

/* ===== v146: Timeline planner — horizontal diary with gaps visible (AJ, 1 Aug 2026) ===== */
(function(){try{
var CW=40, LW=84, DAYS=100, BACK=3;
var css=document.createElement('style');
css.textContent='#tlOv{position:fixed;inset:0;z-index:9997;background:#f2f4f6;display:none;flex-direction:column}#tlOv.on{display:flex}'
+'#tlTop{padding:10px 14px;padding-top:calc(10px + env(safe-area-inset-top));display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,#1f3a5f,#3a6ea5);color:#fff;font-weight:700}'
+'#tlTop button{background:rgba(255,255,255,.22);color:#fff;border:0;border-radius:8px;padding:6px 13px;font-size:15px}'
+'#tlScroll{flex:1;overflow:auto;-webkit-overflow-scrolling:touch;position:relative}'
+'.tlHead{position:sticky;top:0;z-index:5;background:#f2f4f6;border-bottom:1px solid #ccd3da}'
+'.tlMon{height:16px;position:relative;font-size:11px;color:#556;font-weight:700}'
+'.tlMon span{position:absolute;top:1px}'
+'.tlDayRow{height:30px;position:relative}'
+'.tlD{position:absolute;top:0;width:'+CW+'px;text-align:center;font-size:12px;color:#667}'
+'.tlD b{display:block;font-size:11px;color:#223}'
+'.tlD.wk{color:#b8894a}.tlD.today{color:#fff;background:#D97757;border-radius:8px}'
+'.tlRow{position:relative;height:58px;border-bottom:1px solid #e4e9ee}'
+'.tlLab{position:sticky;left:0;z-index:4;width:'+LW+'px;height:58px;line-height:58px;background:#f2f4f6;border-right:1px solid #ccd3da;font-size:13px;color:#445;padding-left:8px;box-sizing:border-box;float:left}'
+'.tlBlk{position:absolute;top:9px;height:40px;border-radius:9px;font-size:12.5px;color:#fff;overflow:hidden;white-space:nowrap;padding:0 8px;line-height:40px;box-shadow:0 1px 4px rgba(0,0,0,.18)}'
+'.tlGrid{position:absolute;top:0;bottom:0;width:1px;background:#e8edf1}'
+'.tlGrid.mon{background:#c9d3db}'
+'@media (min-width:900px){#tlOv{left:50%;margin-left:0;transform:translateX(-50%);width:min(96vw,1200px);right:auto;box-shadow:0 0 44px rgba(20,40,50,.3)}}';
document.head.appendChild(css);
var tbtn=document.createElement('button');tbtn.id='tlBtn';tbtn.className='hdr-ic';tbtn.type='button';tbtn.title='Planner';tbtn.setAttribute('aria-label','Planner');
tbtn.innerHTML='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="2.8" x2="8" y2="6.5"/><line x1="16" y1="2.8" x2="16" y2="6.5"/><line x1="6.5" y1="14" x2="11" y2="14"/><line x1="6.5" y1="17.5" x2="14" y2="17.5"/></svg>';
(function seat(n){var a=document.getElementById('akBtn'); if(a&&a.parentNode){a.parentNode.insertBefore(tbtn,a.nextSibling);} else if((n||0)<40){setTimeout(function(){seat((n||0)+1);},500);} })(0);
var ov=document.createElement('div');ov.id='tlOv';document.body.appendChild(ov);
function d0(){var d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-BACK);return d;}
function iso(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function di(s){var a=String(s).slice(0,10);var st=iso(d0());return Math.round((new Date(a)-new Date(st))/86400000);}
var MO=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var DL=['S','M','T','W','T','F','S'];
function blk(row,from,to,label,color,tid){
 var x1=Math.max(0,di(from)), x2=Math.min(DAYS-1,di(to||from));
 if(x2<0||x1>DAYS-1)return '';
 return '<div class="tlBlk" style="left:'+(LW+x1*CW+2)+'px;width:'+((x2-x1+1)*CW-5)+'px;background:'+color+'"'+(tid?' data-t="'+tid+'"':'')+' title="'+label.replace(/"/g,'')+'">'+label+'</div>';
}
function render(){
 var start=d0(), W=LW+DAYS*CW;
 var mon='',day='',grid='';
 for(var i=0;i<DAYS;i++){
  var d=new Date(start); d.setDate(d.getDate()+i);
  var isMon=d.getDay()===1, is1=d.getDate()===1, today=iso(d)===iso(new Date(new Date().setHours(0,0,0,0)));
  if(is1||i===0) mon+='<span style="left:'+(LW+i*CW+3)+'px">'+MO[d.getMonth()]+'</span>';
  day+='<div class="tlD'+(d.getDay()===0||d.getDay()===6?' wk':'')+(today?' today':'')+'" style="left:'+(LW+i*CW)+'px">'+DL[d.getDay()]+((isMon||is1||today)?'<b>'+d.getDate()+'</b>':'')+'</div>';
  grid+='<div class="tlGrid'+(isMon?' mon':'')+'" style="left:'+(LW+i*CW)+'px"></div>';
 }
 Promise.all([
  sb.from('trips').select('id,title,start_date,end_date').gte('end_date',iso(start)).order('start_date'),
  sb.from('trip_items').select('trip_id,kind,title,idate,edate,itime,status').gte('idate',iso(start)).eq('status','active'),
  sb.from('flights').select('trip_id,flight_no,from_code,to_code,fdate').gte('fdate',iso(start)).eq('archived',false)
 ]).then(function(r){
  var trips=(r[0].data||[]).filter(function(t){return !/merged/i.test(t.title||'');});
  var items=r[1].data||[], fls=r[2].data||[];
  var rTrip='',rHot='',rTrav='',rEv='';
  trips.forEach(function(t){rTrip+=blk(0,t.start_date,t.end_date,t.title,'#8fa8c4',t.id);});
  items.forEach(function(it){
   if(it.kind==='hotel')rHot+=blk(1,it.idate,it.edate,it.title,'#3a6ea5',it.trip_id);
   else if(it.kind==='transport')rTrav+=blk(2,it.idate,it.edate,'🚗 '+it.title,'#7a8a55',it.trip_id);
   else if(it.kind==='event')rEv+=blk(3,it.idate,it.edate,it.title,'#D97757',it.trip_id);
  });
  fls.forEach(function(f){rTrav+=blk(2,f.fdate,f.fdate,'🛫'+f.from_code+'→'+f.to_code,'#b0722a',f.trip_id);});
  ov.innerHTML='<div id="tlTop"><span>📆 Planner</span><button id="tlX" type="button">Done</button></div>'
  +'<div id="tlScroll"><div style="position:relative;width:'+W+'px;min-height:100%">'
  +'<div class="tlHead" style="width:'+W+'px"><div class="tlMon">'+mon+'</div><div class="tlDayRow">'+day+'</div></div>'
  +'<div class="tlRow">'+grid+'<div class="tlLab">Trips</div>'+rTrip+'</div>'
  +'<div class="tlRow">'+grid+'<div class="tlLab">🏨 Stay</div>'+rHot+'</div>'
  +'<div class="tlRow">'+grid+'<div class="tlLab">✈️🚗</div>'+rTrav+'</div>'
  +'<div class="tlRow">'+grid+'<div class="tlLab">🎪 Do</div>'+rEv+'</div>'
  +'</div></div>';
  document.getElementById('tlX').onclick=function(){ov.classList.remove('on');};
  Array.prototype.forEach.call(ov.querySelectorAll('.tlBlk[data-t]'),function(b){b.onclick=function(){try{ov.classList.remove('on');openTrip(b.getAttribute('data-t'));}catch(e){}};});
  var sc=ov.querySelector('#tlScroll'); sc.scrollLeft=Math.max(0,(BACK-1)*CW);
  if(window.__tlHost){ var host=window.__tlHost; window.__tlHost=null; ov.classList.remove('on'); host.innerHTML=''; sc.style.position='absolute'; sc.style.inset='0'; host.appendChild(sc); }
 });
}
tbtn.onclick=function(){window.__tlHost=null;ov.classList.add('on');render();};
window.__tlInline=function(host){ var old=host.querySelector('#tlScroll'); if(old)old.remove(); window.__tlHost=host; render(); };
}catch(e){}})();


/* ===== v147: notes headings — bigger than items, black (AJ, 1 Aug) ===== */
(function(){try{var s=document.createElement('style');
s.textContent='.ngrp{font-size:17px !important;color:#000 !important;opacity:1 !important;letter-spacing:.8px !important}'
+'.nsub{font-size:15px !important;color:#000 !important;opacity:1 !important;letter-spacing:.6px !important}';
document.head.appendChild(s);}catch(e){}})();


/* ===== v149: View source — drill from auto-created items to the email/document that made them (AJ, 1 Aug 2026) ===== */
(function(){try{
var css=document.createElement('style');
css.textContent='#svOv{position:fixed;inset:0;z-index:9999;background:#fff;display:none;flex-direction:column}#svOv.on{display:flex}'
+'#svTop{padding:12px 14px;padding-top:calc(12px + env(safe-area-inset-top));display:flex;justify-content:space-between;align-items:center;background:#3a3a36;color:#fff;font-weight:700;gap:10px}'
+'#svTop span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
+'#svTop button{background:rgba(255,255,255,.22);color:#fff;border:0;border-radius:8px;padding:7px 14px;font-size:15px;flex:none}'
+'#svBody{flex:1;overflow:auto;-webkit-overflow-scrolling:touch;background:#eef1f3}'
+'#svBody iframe{width:100%;height:100%;border:0;background:#fff}'
+'@media (min-width:900px){#svOv{left:50%;margin-left:-260px;width:520px;right:auto;box-shadow:0 0 44px rgba(20,40,50,.3)}}';
document.head.appendChild(css);
var ov=document.createElement('div');ov.id='svOv';document.body.appendChild(ov);
function close(){ov.classList.remove('on');ov.innerHTML='';}
function shell(title){ov.innerHTML='<div id="svTop"><span>📄 '+String(title||'Source').replace(/</g,'&lt;')+'</span><button id="svX" type="button">Done</button></div><div id="svBody"></div>';ov.classList.add('on');document.getElementById('svX').onclick=close;return document.getElementById('svBody');}
function pdfLib2(cb){ if(window.pdfjsLib){cb();return;} var s=document.createElement('script'); s.src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'; s.onload=function(){ try{ pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'; }catch(e){} cb(); }; s.onerror=function(){cb();}; document.head.appendChild(s); }
window.viewSource=function(table,id){
 if(table==='documents'){
  sb.from('documents').select('title,mime,content').eq('id',id).single().then(function(r){
   var d=r&&r.data; if(!d){shell('Not found');return;}
   var body=shell(d.title||'Document');
   var raw=String(d.content||'').replace(/\s/g,'');
   if(/pdf/i.test(d.mime||'')){
    var bin=atob(raw);var arr=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);
    pdfLib2(function(){ if(!window.pdfjsLib){body.innerHTML='<p style="padding:20px">Viewer failed to load.</p>';return;}
     pdfjsLib.getDocument({data:arr}).promise.then(function(pdf){
      var n=Math.min(pdf.numPages,6), w=Math.min(window.innerWidth,520);
      for(var pg=1;pg<=n;pg++)(function(pg){pdf.getPage(pg).then(function(page){
       var vp1=page.getViewport({scale:1});var sc=(w-8)/vp1.width;var vp=page.getViewport({scale:sc*2});
       var c=document.createElement('canvas');c.width=vp.width;c.height=vp.height;c.style.width=(vp.width/2)+'px';c.style.height=(vp.height/2)+'px';c.style.margin='4px auto';c.style.display='block';c.style.background='#fff';c.style.boxShadow='0 2px 10px rgba(0,0,0,.15)';
       body.appendChild(c);page.render({canvasContext:c.getContext('2d'),viewport:vp});
      });})(pg);
     }).catch(function(){body.innerHTML='<p style="padding:20px">Could not read the PDF.</p>';});
    });
   } else {
    var txt='';try{txt=decodeURIComponent(escape(atob(raw)));}catch(e){try{txt=atob(raw);}catch(e2){txt='(could not decode)';}}
    var f=document.createElement('iframe');f.setAttribute('sandbox','');body.appendChild(f);f.srcdoc=/html/i.test(d.mime||'')?txt:'<pre style="white-space:pre-wrap;font-family:inherit;padding:14px">'+txt.replace(/</g,'&lt;')+'</pre>';
   }
  });
 } else {
  sb.from('inbox_emails').select('subject,body_html,body_text').eq('id',id).single().then(function(r){
   var d=r&&r.data; if(!d){shell('Not found');return;}
   var body=shell(d.subject||'Email');
   var f=document.createElement('iframe');f.setAttribute('sandbox','');body.appendChild(f);
   f.srcdoc=d.body_html?d.body_html:'<pre style="white-space:pre-wrap;font-family:inherit;padding:14px">'+String(d.body_text||'').replace(/</g,'&lt;')+'</pre>';
  });
 }
};
function findSrc(it){
 if(!it)return null;
 if(it.source_table&&it.source_id)return {t:it.source_table,id:it.source_id};
 var m=/doc:([0-9a-f\-]{36})/.exec(it.notes||''); if(m)return {t:'documents',id:m[1]};
 return null;
}
function decorate(iid){
 try{
  var it=(D.trip_items||[]).find(function(x){return x.id===iid;});
  var src=findSrc(it); if(!src)return;
  setTimeout(function(){
   var sh=document.getElementById('sheet'); if(!sh||document.getElementById('svBtn'))return;
   var host=sh.querySelector('.inner')||sh;
   var b=document.createElement('button'); b.id='svBtn'; b.type='button'; b.className='btn ghost block'; b.style.marginTop='8px';
   b.textContent='📄 View source — '+(src.t==='documents'?'original document':'original email');
   b.onclick=function(){ viewSource(src.t,src.id); };
   host.appendChild(b);
  },300);
 }catch(e){}
}
if(window.editItem){ var _ei=window.editItem; window.editItem=function(a,b2){ var r=_ei.apply(this,arguments); decorate(b2||a); return r; }; }
else { var tries=0,tm=setInterval(function(){ if(window.editItem){ clearInterval(tm); var _e2=window.editItem; window.editItem=function(a,b2){ var r=_e2.apply(this,arguments); decorate(b2||a); return r; }; } else if(++tries>40) clearInterval(tm); },500); }
}catch(e){}})();


/* ===== v152: Trip view — the Wanderlog treatment (surprise for AJ, 2 Aug 2026) ===== */
(function(){try{
var css=document.createElement('style');
css.textContent='#tvOv{position:fixed;inset:0;z-index:9996;background:#f2f4f6;display:none;flex-direction:column}#tvOv.on{display:flex}'
+'#tvHero{background:linear-gradient(135deg,#1f3a5f,#3a6ea5);color:#fff;padding:16px 18px 14px;padding-top:calc(14px + env(safe-area-inset-top))}'
+'#tvHero .r1{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}'
+'#tvHero h2{margin:0;font-size:21px;line-height:1.25;font-weight:700}'
+'#tvHero .dates{opacity:.85;font-size:13.5px;margin-top:5px}'
+'#tvHero button{background:rgba(255,255,255,.22);color:#fff;border:0;border-radius:8px;padding:7px 14px;font-size:15px;flex:none}'
+'#tvBody{flex:1;overflow:auto;-webkit-overflow-scrolling:touch}'
+'#tvMap{height:250px;background:#dfe6ea}'
+'.tvWrap{padding:12px 14px 40px;max-width:680px;margin:0 auto}'
+'.tvDay{background:#fff;border:1px solid #dfe5ea;border-radius:14px;margin:12px 0;overflow:hidden;box-shadow:0 2px 8px rgba(20,40,50,.05)}'
+'.tvDayH{padding:10px 16px;font-weight:700;font-size:15px;color:#1f3a5f;background:#f7f9fa;border-bottom:1px solid #eef2f4;display:flex;justify-content:space-between}'
+'.tvDayH .dn{color:#98a3ab;font-weight:500}'
+'.tvIt{display:flex;align-items:center;gap:12px;padding:12px 14px;border-bottom:1px solid #f2f5f7;cursor:pointer}'
+'.tvIt:last-child{border-bottom:0}'
+'.tvPinL{width:26px;height:26px;border-radius:50%;background:#D97757;color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex:none}'
+'.tvPinL.mut{background:#b8c2c9}'
+'.tvMain{flex:1;min-width:0}'
+'.tvT{font-size:15.5px;color:#1c1c1a;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
+'.tvChips{margin-top:3px;display:flex;gap:6px;flex-wrap:wrap}'
+'.tvC{font-size:11.5px;color:#556;background:#eef2f4;border-radius:20px;padding:2px 9px}'
+'.tvC.nite{background:#e8f0e6;color:#3c5a34}.tvC.ref{background:#eae6f2;color:#4a3a6a}'
+'.tvPin{width:26px;height:26px;border-radius:50%;background:#D97757;color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.35)}'
+'.tvFoot{display:flex;gap:10px;margin-top:16px}'
+'.tvFoot button{flex:1;border:1px solid #ccd3da;background:#fff;border-radius:12px;padding:12px;font-size:14px;color:#445;cursor:pointer}'
+'@media (min-width:900px){#tvOv{left:50%;transform:translateX(-50%);width:min(96vw,1100px);right:auto;box-shadow:0 0 44px rgba(20,40,50,.3)}#tvMap{height:300px}}';
document.head.appendChild(css);
var ov=document.createElement('div');ov.id='tvOv';document.body.appendChild(ov);
function lcss(){if(document.getElementById('lfCss'))return;var l=document.createElement('link');l.id='lfCss';l.rel='stylesheet';l.href='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';document.head.appendChild(l);}
function ljs(cb){if(window.L){cb();return;}lcss();var s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';s.onload=cb;s.onerror=function(){cb();};document.head.appendChild(s);}
function fmtD(s){var d=new Date(String(s).slice(0,10));return d.toLocaleDateString(undefined,{weekday:'short',day:'numeric',month:'short'});}
function nights(a,b){return Math.round((new Date(String(b).slice(0,10))-new Date(String(a).slice(0,10)))/86400000);}
var KE={hotel:'🏨',boarding:'🎫',transport:'🚗',event:'🎪',flight:'✈️'};
var AIRP={USM:[9.5479,100.0623],BKK:[13.6900,100.7501],DMK:[13.9126,100.6068],KUL:[2.7456,101.7099],CNX:[18.7668,98.9626],HKT:[8.1132,98.3169],DXB:[25.2532,55.3657],LHR:[51.4700,-0.4543],LGW:[51.1537,-0.1821],MAN:[53.3654,-2.2728],SIN:[1.3644,103.9915],HKG:[22.3080,113.9185],MLE:[4.1918,73.5291],UTP:[12.6799,101.0050],KBV:[8.0956,98.9862],URT:[9.1325,99.1356],CEI:[19.9523,99.8829]};
function openTicket(conf,docs){
 function op(did){ ov.classList.remove('on'); ov.innerHTML=''; try{ viewSource('documents', did); }catch(e){} }
 var ids=String(docs||'').split(',').filter(Boolean);
 if(ids.length===1&&ids[0].length>=36){ op(ids[0]); return; }
 sb.from('documents').select('id,title,created_at').order('created_at',{ascending:false}).limit(200).then(function(r){
  var all=r.data||[]; var cand=[];
  ids.forEach(function(p){ var m=all.find(function(d){return String(d.id).indexOf(p)===0;}); if(m&&cand.indexOf(m)<0)cand.push(m); });
  if(!cand.length&&conf){ cand=all.filter(function(d){ return String(d.title||'').toUpperCase().indexOf(String(conf).toUpperCase())>=0; }); }
  if(!cand.length){ alert('No ticket document found'+(conf?' for '+conf:'')+'. Forward the e-ticket email to the app and it will attach itself.'); return; }
  if(cand.length===1){ op(cand[0].id); return; }
  var pick=document.createElement('div'); pick.style.cssText='position:fixed;inset:0;z-index:10001;background:rgba(20,30,40,.55);display:flex;align-items:center;justify-content:center;padding:24px';
  pick.innerHTML='<div style="background:#fff;border-radius:14px;max-width:440px;width:100%;padding:14px"><div style="font-weight:700;margin:2px 4px 8px;color:#1f3a5f">Which ticket?</div>'+cand.slice(0,6).map(function(d){return '<button type="button" data-d="'+d.id+'" style="display:block;width:100%;text-align:left;margin:6px 0;padding:12px;border:1px solid #ccd3da;border-radius:10px;background:#fff;font-size:14px;cursor:pointer">📄 '+String(d.title).replace(/</g,'&lt;')+'</button>';}).join('')+'</div>';
  document.body.appendChild(pick);
  pick.onclick=function(ev){ var b=ev.target.closest('button[data-d]'); document.body.removeChild(pick); if(b) op(b.getAttribute('data-d')); };
 });
}
function show(id){
 var t=(D.trips||[]).find(function(x){return x.id===id;}); if(!t)return;
 var its=(D.trip_items||[]).filter(function(i){return i.trip_id===id&&i.status!=='superseded'&&i.status!=='expired';});
 var fls=(D.flights||[]).filter(function(f){return f.trip_id===id&&!f.archived;});
 var entries=[];
 its.forEach(function(i){var dc=(i.source_table==='documents'&&i.source_id)?i.source_id:((String(i.notes||'').match(/doc[: ]([0-9a-f-]{8,36})/)||[])[1]||null);entries.push({d:String(i.idate).slice(0,10),tm:i.itime||'',ttl:i.title,em:KE[i.kind]||'📌',ref:i.ref,ed:i.edate?String(i.edate).slice(0,10):null,id:i.id,lat:i.lat,lng:i.lng,doc:dc});});
 fls.forEach(function(f){var ap=AIRP[f.to_code]||null;var ds=(String(f.notes||'').match(/doc:([0-9a-f\-]{8,36})/g)||[]).map(function(s){return s.slice(4);}).join(',');entries.push({d:String(f.fdate).slice(0,10),tm:f.ftime||'',ttl:(f.airline||'')+' '+(f.flight_no||'')+' · '+f.from_code+' → '+f.to_code,em:'✈️',ref:f.conf,fl:1,docs:ds,lat:ap&&ap[0],lng:ap&&ap[1]});});
 entries.sort(function(a,b){return (a.d+a.tm).localeCompare(b.d+b.tm);});
 var seq=0; entries.forEach(function(e){e.n=++seq;});
 var days={}; entries.forEach(function(e){(days[e.d]=days[e.d]||[]).push(e);});
 var allDays=[];(function(){var s=String(t.start_date||'').slice(0,10),en=String(t.end_date||'').slice(0,10);
  if(s&&en&&s<=en){var cur=new Date(s+'T00:00:00Z');for(var g=0;g<62;g++){var ds=cur.toISOString().slice(0,10);if(ds>en)break;allDays.push(ds);cur.setUTCDate(cur.getUTCDate()+1);}}
  Object.keys(days).forEach(function(d){if(allDays.indexOf(d)<0)allDays.push(d);});allDays.sort();})();
 var evs={};((window.D&&D.events)||[]).forEach(function(ev){var d=String(ev.edate||'').slice(0,10);if(d&&allDays.indexOf(d)>=0)(evs[d]=evs[d]||[]).push(ev);});
 function stayOn(d){var hh=its.filter(function(i){return i.kind==='hotel'&&i.edate&&String(i.idate).slice(0,10)<=d&&d<String(i.edate).slice(0,10);});return hh.length?hh[0]:null;}
 var nl=nights(t.start_date,t.end_date);
 var open=((D.trip_checklist||[]).filter(function(c){return c.trip_id===id&&c.status==='open';})).length;
 var h='<div id="tvHero"><div class="r1"><div><h2>'+String(t.title||'').replace(/</g,'&lt;')+'</h2><div class="dates">'+fmtD(t.start_date)+' — '+fmtD(t.end_date)+' · '+nl+' night'+(nl===1?'':'s')+(open?' · <span style="color:#ffd9c8">⚠ '+open+' to do</span>':' · ✓ all set')+'</div></div><button id="tvDocs" type="button">🎫 Docs</button> <button id="tvGo" type="button">🧭 Nav</button> <button id="tvX" type="button">Done</button></div></div>'
 +'<div id="tvBody"><div id="tvMap"></div><div class="tvWrap">';
 allDays.forEach(function(d){
  h+='<div class="tvDay"><div class="tvDayH"><span>'+fmtD(d)+'</span><span class="dn">Day '+(nights(t.start_date,d)+1)+'</span></div>';
  (evs[d]||[]).forEach(function(ev){h+='<div class="tvIt" style="cursor:default"><div class="tvPinL mut">'+(ev.icon||String.fromCodePoint(128197))+'</div><div class="tvMain"><div class="tvT">'+String(ev.title||'').replace(/</g,'&lt;')+'</div>'+(ev.notes?'<div class="tvChips"><span class="tvC">'+String(ev.notes).replace(/</g,'&lt;')+'</span></div>':'')+'</div></div>';});
  if(!(days[d]&&days[d].length)){var sh=stayOn(d);h+='<div class="tvIt" style="cursor:default;opacity:.85"><div class="tvPinL mut">'+String.fromCodePoint(127796)+'</div><div class="tvMain"><div class="tvT">'+(sh?String.fromCodePoint(127976)+' At '+String(sh.title||'').replace(/</g,'&lt;'):'Free day')+'</div><div class="tvChips"><span class="tvC">'+(sh?'no fixed plans':'nothing scheduled')+'</span></div></div></div>';}
  (days[d]||[]).forEach(function(e){
   h+='<div class="tvIt"'+(e.id?' data-i="'+e.id+'"':'')+(e.fl?' data-fc="'+(e.ref||'')+'" data-fdocs="'+(e.docs||'')+'"':'')+'><div class="tvPinL'+(e.lat?'':' mut')+'">'+e.n+'</div><div class="tvMain"><div class="tvT">'+e.em+' '+String(e.ttl||'').replace(/</g,'&lt;')+'</div><div class="tvChips">'
   +(e.tm?'<span class="tvC">'+e.tm+'</span>':'')
   +(e.ed&&e.ed>e.d?'<span class="tvC nite">→ '+fmtD(e.ed)+' · '+nights(e.d,e.ed)+' nights</span>':'')
   +(e.ref?'<span class="tvC ref">'+e.ref+'</span>':'')
   +'</div></div>'+(e.doc?'<button class="tvNav tvDoc" type="button" data-doc="'+e.doc+'">🎫</button>':'')+(e.lat&&e.lng?'<button class="tvNav" type="button" data-nav="'+e.lat+','+e.lng+'">🧭</button>':'')+'<div style="color:#c3ccd2">›</div></div>';
  });
  h+='</div>';
 });
 h+='<div class="tvFoot"><button id="tvClassic" type="button">⚙ Classic view</button></div></div></div>';
 ov.innerHTML=h; ov.classList.add('on');
 document.getElementById('tvX').onclick=function(){ov.classList.remove('on');ov.innerHTML='';};
 function navTo(ll){ window.open('https://www.google.com/maps/dir/?api=1&destination='+ll+'&travelmode=driving','_blank'); }
 var _go=document.getElementById('tvGo');
 if(_go){ if(!entries.some(function(e){return e.lat&&e.lng;})) _go.style.display='none';
  _go.onclick=function(){ var now=new Date(); var dk=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0'); var tk=String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
   var nx=entries.find(function(e){return e.lat&&e.lng&&(e.d>dk||(e.d===dk&&String(e.tm||'23:59')>=tk));})||entries.filter(function(e){return e.lat&&e.lng;}).pop();
   if(nx) navTo(nx.lat+','+nx.lng); };
 }
 Array.prototype.forEach.call(ov.querySelectorAll('.tvNav'),function(b){ b.onclick=function(ev){ ev.stopPropagation(); var dd=b.getAttribute('data-doc'); if(dd){ (window.ajOpenDoc||function(x){viewSource('documents',x);})(dd); return; } navTo(b.getAttribute('data-nav')); }; });
 var _dx=document.getElementById('tvDocs');
 if(_dx){ _dx.onclick=function(){
  sb.from('documents').select('id,title,mime,created_at').eq('trip_id',t.id).order('created_at').then(function(r){
   var ds=(r&&r.data)||[];
   if(!ds.length){ alert('No documents attached to this trip yet. Forward confirmations to the app inbox and they file themselves.'); return; }
   var pick=document.createElement('div'); pick.style.cssText='position:fixed;inset:0;z-index:10001;background:rgba(20,30,40,.55);display:flex;align-items:center;justify-content:center;padding:24px';
   pick.innerHTML='<div style="background:#fff;border-radius:14px;max-width:520px;width:100%;padding:14px;max-height:80vh;overflow:auto"><div style="font-weight:700;margin:2px 4px 10px;color:#1f3a5f">🎫 '+String(t.title||'Trip').replace(/</g,'&lt;')+' — documents</div>'+ds.map(function(d){return '<button type="button" data-d="'+d.id+'" style="display:block;width:100%;text-align:left;margin:6px 0;padding:13px;border:1px solid #ccd3da;border-radius:10px;background:#fff;font-size:14.5px;cursor:pointer">📄 '+String(d.title).replace(/</g,'&lt;')+'</button>';}).join('')+'<button type="button" data-x="1" style="display:block;width:100%;margin-top:8px;padding:11px;border:0;border-radius:10px;background:#eef2f4;font-size:14px;cursor:pointer">Close</button></div>';
   document.body.appendChild(pick);
   pick.onclick=function(ev){ var b=ev.target.closest('button[data-d]'); var x=ev.target.closest('button[data-x]'); if(b||x||ev.target===pick) document.body.removeChild(pick); if(b) (window.ajOpenDoc||function(x){viewSource('documents',x);})(b.getAttribute('data-d')); };
  });
 }; }
 document.getElementById('tvClassic').onclick=function(){ov.classList.remove('on');ov.innerHTML='';window.__tripClassic(id);};
 Array.prototype.forEach.call(ov.querySelectorAll('.tvIt[data-i]'),function(r){r.onclick=function(){ov.classList.remove('on');ov.innerHTML='';try{editItem(id,r.getAttribute('data-i'));}catch(e){}};});
 Array.prototype.forEach.call(ov.querySelectorAll('.tvIt[data-fc]'),function(r){r.onclick=function(){ openTicket(r.getAttribute('data-fc'), r.getAttribute('data-fdocs')); };});
 var pts=entries.filter(function(e){return e.lat&&e.lng;});
 var mapEl=document.getElementById('tvMap');
 if(!pts.length){mapEl.style.display='none';}
 else ljs(function(){ if(!window.L){mapEl.style.display='none';return;}
  var m=L.map(mapEl,{zoomControl:false,attributionControl:false});
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18}).addTo(m);
  var bb=[];
  pts.forEach(function(p){bb.push([p.lat,p.lng]);L.marker([p.lat,p.lng],{icon:L.divIcon({className:'',html:'<div class="tvPin">'+p.n+'</div>',iconSize:[26,26],iconAnchor:[13,13]})}).addTo(m);});
  m.fitBounds(bb,{padding:[36,36],maxZoom:13});
  setTimeout(function(){m.invalidateSize();},350);
 });
}
/* AJ-TODOFIX-20260823: v187 behaviour restored — trip tap = CLASSIC itinerary (To-do lists live there); Wanderlog map view stays reachable via window.__tripWander */
window.__tripWander=show;
if(window.openTrip){ window.__tripClassic=window.openTrip; }
else { var tr2=0,tm2=setInterval(function(){ if(window.openTrip&&!window.__tripClassic){ clearInterval(tm2); window.__tripClassic=window.openTrip; } else if(++tr2>40) clearInterval(tm2); },500); }
}catch(e){}})();


/* ===== v163 - digital departure-board clocks (AJ choice A, 4 Aug 2026) ===== */
(function(){
'use strict';
var st=document.createElement('style');
st.textContent='.clocks.ajclocks{background:linear-gradient(170deg,#ffffff,#f4f4f1)!important;border-radius:20px;padding:18px 12px 13px!important;box-shadow:0 10px 28px rgba(0,0,0,.13);flex-wrap:wrap!important;gap:0 24px!important;height:auto!important;min-height:0!important}'
+'.ajclocks .ajc.dg{flex:1 1 40%;min-width:150px;text-align:center}'
+'.ajclocks .dgcity{font-size:12px;letter-spacing:2.5px;color:#9a8a60;font-weight:600;margin-bottom:2px}'
+'.ajclocks .dgtime{font:200 clamp(44px,12vw,62px)/1.05 -apple-system,"Helvetica Neue",sans-serif;letter-spacing:-1px;color:#1d2433;font-variant-numeric:tabular-nums}'
+'.ajclocks .dgwx{margin-top:6px;font-size:14.5px;color:#5d6472;min-height:18px}'
+'.ajclocks .dgsub{margin-top:6px;font-size:11.5px;letter-spacing:1.5px;color:#8a815f}'
+'.ajclocks .dgsub .ajtime{color:#4c5464;font-variant-numeric:tabular-nums}'
+'.ajclocks .dgdate{flex:1 1 100%;order:-1;text-align:center;margin-bottom:12px;padding-bottom:11px;border-bottom:1px solid #d8d1bd;font-size:12.5px;color:#8a815f}'
+'.ajclocks .dgtrip{flex:1 1 100%;text-align:center;margin-top:12px;padding-top:11px;border-top:1px solid #d8d1bd;font-size:13.5px;color:#5d6472;min-height:19px}'
+'.ajclocks .dgtrip:empty{display:none}'
+'.dgtrip .tn{cursor:pointer;padding:0 14px;color:#9a8a60;font-weight:700;user-select:none;font-size:15px}'
+'.dgtrip .tlab{color:#9a8a60;letter-spacing:.6px;font-size:11.5px;text-transform:uppercase;margin-right:7px}'
+'#wline{display:none!important}';
document.head.appendChild(st);
function dgdate(){var dd=document.querySelector('.dgdate');if(dd){try{dd.textContent=new Date().toLocaleDateString('en-GB',{timeZone:'Asia/Bangkok',weekday:'long',day:'numeric',month:'long'});}catch(e){}}}
setInterval(dgdate,30000);setTimeout(dgdate,400);
document.addEventListener('visibilitychange',function(){if(!document.hidden)setTimeout(dgdate,200);});
})();


/* ===== v170 - real current location for the auto clock (4 Aug 2026) =====
   The old '@loc' used the device timezone, and ALL of Thailand is Asia/Bangkok,
   so the "current location" clock said Bangkok even on Samui. Now:
   home = Ko Samui; if a trip in the diary is running today, follow its
   destination (open-meteo geocode gives coords + timezone). No browser
   geolocation permission needed. */
(function(){
'use strict';
var HOME={label:'Ko Samui',tz:'Asia/Bangkok',lat:9.512,lon:100.014};
window.__ajLoc=window.__ajLoc||HOME;
function pd(s){if(!s)return null;var m=String(s).match(/(\d{4})-(\d{2})-(\d{2})/);return m?new Date(+m[1],+m[2]-1,+m[3]):null;}
function rekick(){try{var r=document.querySelector('.clocks');if(r){r.removeAttribute('data-aj4');}if(window.__ajEnhance)window.__ajEnhance(true);}catch(e){}}
function apply(loc){
  var cur=window.__ajLoc||{};
  if(cur.label===loc.label&&cur.tz===loc.tz)return;
  window.__ajLoc=loc;rekick();
}
function update(){
  try{
    var trips=(window.__ajTrips)||[];
    var now=new Date();now.setHours(0,0,0,0);
    var act=null;
    for(var i=0;i<trips.length;i++){
      var t=trips[i],s=pd(t.start_date),e=pd(t.end_date)||s;
      if(s&&s<=now&&e&&now<=e){act=t;break;}
    }
    if(!act||!act.dest){apply(HOME);return;}
    var name=String(act.dest).split(String.fromCharCode(8212))[0].split(',')[0].trim();
    if(/samui/i.test(name)){apply(HOME);return;}
    fetch('https://geocoding-api.open-meteo.com/v1/search?name='+encodeURIComponent(name)+'&count=1')
      .then(function(r){return r.json();})
      .then(function(j){var g=j.results&&j.results[0];
        if(g)apply({label:name,tz:g.timezone||'Asia/Bangkok',lat:g.latitude,lon:g.longitude});
        else apply(HOME);})
      .catch(function(){apply(HOME);});
  }catch(e){}
}
setTimeout(update,1500);
setInterval(update,600000);
document.addEventListener('visibilitychange',function(){if(!document.hidden)setTimeout(update,500);});
})();


/* ===== v172 - next-trip line inside the clock card, with < > browsing ===== */
(function(){
'use strict';
var idx=0, wxc={};
function pd(s){if(!s)return null;var m=String(s).match(/(\d{4})-(\d{2})-(\d{2})/);return m?new Date(+m[1],+m[2]-1,+m[3]):null;}
function fmt(d){try{return d.getDate()+' '+['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];}catch(e){return'';}}
function upcoming(){
  var now=new Date();now.setHours(0,0,0,0);
  return ((window.__ajTrips)||[])
    .filter(function(t){var e=pd(t.end_date)||pd(t.start_date);return t.dest&&e&&e>=now;})
    .sort(function(a,b){return (pd(a.start_date)||0)-(pd(b.start_date)||0);});
}
function wxFor(name,cb){
  if(wxc[name]!==undefined){cb(wxc[name]);return;}
  fetch('https://geocoding-api.open-meteo.com/v1/search?name='+encodeURIComponent(name)+'&count=1')
    .then(function(r){return r.json();})
    .then(function(j){var g=j.results&&j.results[0];if(!g)throw 0;
      return fetch('https://api.open-meteo.com/v1/forecast?latitude='+g.latitude+'&longitude='+g.longitude+'&current=temperature_2m,weather_code');})
    .then(function(r){return r.json();})
    .then(function(j){var IC={0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',51:'🌦️',61:'🌦️',63:'🌧️',65:'🌧️',80:'🌦️',81:'🌧️',95:'⛈️'};
      wxc[name]=Math.round(j.current.temperature_2m)+'° '+(IC[j.current.weather_code]||'');cb(wxc[name]);})
    .catch(function(){wxc[name]=null;cb(null);});
}
window.__ajTripNav=function(d){var n=upcoming().length;if(!n)return;idx=(idx+d+n)%n;render(true);};
function esc2(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');}
function render(force){
  var el=document.querySelector('.dgtrip'); if(!el)return;
  var list=upcoming();
  if(!list.length){if(el.innerHTML)el.innerHTML='';return;}
  if(idx>=list.length)idx=0;
  var t=list[idx];
  var name=String(t.dest).split(String.fromCharCode(8212))[0].split(',')[0].trim();
  var s=pd(t.start_date);
  var arrows=list.length>1;
  var html=(arrows?'<span class="tn" onclick="window.__ajTripNav(-1)">&#8249;</span>':'')
    +'<span class="tlab">'+(idx===0?'Next trip':(idx+1)+' of '+list.length)+'</span>'
    +'✈️ '+esc2(name)+(s?' · '+fmt(s):'')
    +'<span class="dgtwx" data-n="'+esc2(name)+'"></span>'
    +(arrows?'<span class="tn" onclick="window.__ajTripNav(1)">&#8250;</span>':'');
  if(force||el.getAttribute('data-k')!==name+idx){
    el.setAttribute('data-k',name+idx);el.innerHTML=html;
    var w=el.querySelector('.dgtwx');
    wxFor(name,function(v){if(v&&w&&w.isConnected)w.innerHTML=' · '+v;});
  }
}
function loadTrips(){
  try{
    var cfg=window.AJ_CONFIG,tok=null;
    try{var raw=localStorage.getItem('sb-mjkaoombokemhgaynjwf-auth-token');if(raw)tok=(JSON.parse(raw)||{}).access_token;}catch(e){}
    if(!cfg||!tok)return;
    fetch(cfg.SUPABASE_URL+'/rest/v1/trips?select=dest,start_date,end_date&order=start_date',
      {headers:{apikey:cfg.SUPABASE_KEY,Authorization:'Bearer '+tok}})
      .then(function(r){return r.json();})
      .then(function(j){if(Array.isArray(j))window.__ajTrips=j;render(false);})
      .catch(function(){});
  }catch(e){}
}
loadTrips();setInterval(loadTrips,300000);
document.addEventListener('visibilitychange',function(){if(!document.hidden)setTimeout(loadTrips,600);});
setTimeout(render,1800);
setInterval(function(){render(false);},2500);
})();


/* ===== v175: NEXT TRIP line on the clock card opens the trip itinerary (AJ, 8 Aug: "very hard to find") ===== */
(function(){try{
var st=document.createElement('style');st.textContent='.dgtrip{cursor:pointer}';document.head.appendChild(st);
document.addEventListener('click',function(ev){
 var el=ev.target&&ev.target.closest&&ev.target.closest('.dgtrip'); if(!el)return;
 if(ev.target.closest('.tn'))return; /* arrows keep cycling */
 var k=el.getAttribute('data-k')||''; var m=k.match(/^(.*?)(\d+)$/); var name=m?m[1]:k;
 var today=new Date().toISOString().slice(0,10);
 var list=((window.D&&D.trips)||[]).filter(function(t){return String(t.end_date||'')>=today;});
 var t=list.find(function(x){return String(x.dest||'').indexOf(name)===0||String(x.title||'').indexOf(name)===0;})||list.sort(function(a,b){return String(a.start_date).localeCompare(String(b.start_date));})[0];
 if(t&&window.openTrip){ try{ openTrip(t.id); }catch(e){} }
});
}catch(e){}})();


/* ===== v177: Navigate — trip rows + hero post the destination to Google Maps (AJ, 8 Aug: car/Chrome one-tap nav) ===== */
(function(){try{var s=document.createElement('style');
s.textContent='.tvNav{background:#eef2f4;border:1px solid #dfe5ea;border-radius:10px;padding:8px 11px;font-size:17px;flex:none;cursor:pointer;line-height:1}'
+'@media (orientation:landscape) and (max-height:620px){.tvNav{padding:10px 14px;font-size:19px}#tvGo{font-size:16px}}';
document.head.appendChild(s);}catch(e){}})();


/* ===== v179: Travel wallet on Home — during a trip, the tickets ARE the home screen (AJ, 8 Aug) ===== */
(function(){try{
var css=document.createElement('style');
css.textContent='#tixStrip{background:#fff;border:1px solid #dfe5ea;border-left:4px solid #D97757;border-radius:14px;padding:12px 14px;margin:10px 2px 12px}'
+'#tixStrip .th{font-size:11px;letter-spacing:2.6px;color:#8a6a3b;font-weight:700;margin:0 2px 9px}'
+'#tixStrip .tb{display:flex;flex-wrap:wrap;gap:9px}'
+'#tixStrip button{flex:1 1 46%;min-width:150px;display:flex;align-items:center;gap:10px;text-align:left;background:#f7f9fa;border:1px solid #dfe5ea;border-radius:12px;padding:13px 13px;font-size:15px;font-weight:600;color:#1f3a5f;cursor:pointer;line-height:1.25}'
+'#tixStrip button .big{font-size:21px;flex:none}'
+'#tixStrip button.next{background:#fdf3ee;border-color:#e8c4b2}'
+'#tixStrip .sub{display:block;font-size:11.5px;font-weight:400;color:#6c7a83;margin-top:2px}'
+'@media (orientation:landscape) and (max-height:620px){#tixStrip button{font-size:16.5px;padding:15px 15px}#tixStrip button .big{font-size:24px}}';
document.head.appendChild(css);

function pad(n){return String(n).padStart(2,'0');}
function dkey(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}

function gather(){
 if(!window.D||!D.trips) return null;
 var now=new Date(), tk=dkey(now), tm=pad(now.getHours())+':'+pad(now.getMinutes());
 var soon=dkey(new Date(now.getTime()+2*86400000));
 var trip=(D.trips||[]).find(function(t){ if(!t.start_date)return false;
  var a=String(t.start_date).slice(0,10), b=String(t.end_date||t.start_date).slice(0,10);
  return a<=soon && b>=tk; });
 if(!trip) return null;
 var out=[];
 (D.trip_items||[]).forEach(function(i){
  if(i.trip_id!==trip.id||i.status==='superseded'||i.status==='expired')return;
  var dc=(i.source_table==='documents'&&i.source_id)?i.source_id:((String(i.notes||'').match(/doc[: ]([0-9a-f-]{8,36})/)||[])[1]||null);
  if(!dc)return;
  var d=String(i.idate).slice(0,10), e=String(i.edate||i.idate).slice(0,10);
  out.push({doc:dc,t:i.title,d:d,tm:i.itime||'',live:(d<=tk&&tk<=e),ic:(i.kind==='hotel'?'🏨':i.kind==='ticket'?'🛥️':i.kind==='flight'||i.kind==='boarding'?'✈️':'🎫')});
 });
 (D.flights||[]).forEach(function(f){
  if(f.trip_id!==trip.id||f.archived)return;
  var ds=(String(f.notes||'').match(/doc:([0-9a-f-]{8,36})/)||[])[1]; if(!ds)return;
  out.push({doc:ds,t:(f.flight_no||'Flight')+' '+(f.from_code||'')+'→'+(f.to_code||''),d:String(f.fdate).slice(0,10),tm:f.ftime||'',live:String(f.fdate).slice(0,10)===tk,ic:'✈️'});
 });
 if(!out.length) return null;
 out.sort(function(a,b){return (a.d+(a.tm||'~')).localeCompare(b.d+(b.tm||'~'));});
 var nxt=out.find(function(x){return x.d>tk||(x.d===tk&&String(x.tm||'23:59')>=tm);})||out[out.length-1];
 var seen={},list=[];
 [nxt].concat(out).forEach(function(x){ if(seen[x.doc])return; seen[x.doc]=1; list.push(x); });
 return {trip:trip,list:list.slice(0,4),nextDoc:nxt.doc};
}

function fmt(x){ var dd=new Date(x.d+'T12:00:00');
 return dd.toLocaleDateString(undefined,{weekday:'short',day:'numeric'})+(x.tm?' · '+x.tm:''); }

function inject(){
 var v=document.getElementById('v-home'); if(!v) return;
 var old=document.getElementById('tixStrip'); if(old) old.remove();
 var g=gather(); if(!g) return;
 var box=document.createElement('div'); box.id='tixStrip';
 box.innerHTML='<div class="th">TICKETS — '+String(g.trip.title||'').replace(/</g,'&lt;').toUpperCase()+'</div><div class="tb">'
  +g.list.map(function(x){ return '<button type="button" data-doc="'+x.doc+'"'+(x.doc===g.nextDoc?' class="next"':'')+'><span class="big">'+x.ic+'</span><span>'+String(x.t).replace(/</g,'&lt;')+'<span class="sub">'+fmt(x)+(x.doc===g.nextDoc?' · up next':'')+'</span></span></button>'; }).join('')
  +'</div>';
 box.onclick=function(ev){ var b=ev.target.closest('button[data-doc]'); if(b) (window.ajOpenDoc||function(x){viewSource('documents',x);})(b.getAttribute('data-doc')); };
 v.insertBefore(box, v.firstChild);
}

var tries=0;
(function boot(){ tries++; if(window.D&&D.trips&&document.getElementById('v-home')){ inject(); } else if(tries<40){ setTimeout(boot,500); } })();
if(window.go){ var _go=window.go; window.go=function(x){ var r=_go.apply(this,arguments); try{ if(x==='home') setTimeout(inject,60); }catch(e){} return r; }; }
setInterval(function(){ try{ if(document.getElementById('v-home')&&document.getElementById('v-home').offsetParent!==null) inject(); }catch(e){} }, 120000);
}catch(e){}})();








/* ===== v202 (9 Aug 2026) — CONSOLIDATED home-row layer (replaces v191–v201). =====
   ROOT CAUSE of every dead map today: app.js declares `let D` — a lexical global —
   so window.D is UNDEFINED, and every layer since v191 read window.D → empty data →
   no item → no chip. This layer reads the bare lexical `D` (same script realm). */
(function(){
try{
  /* AJ-VERFIX-20260823: badge reads the REAL build from the verTag span — never hard-code again */
  var VER=(function(){try{var v=document.getElementById('verTag');if(v&&v.textContent)return v.textContent;}catch(e){} return 'v?';})();
  var AND=/android/i.test(navigator.userAgent||'');

  function _DATA(){ try{ if(typeof D!=='undefined'&&D) return D; }catch(e){} return window.D||{}; }
  function _item(id){ var L=_DATA().trip_items||[]; for(var i=0;i<L.length;i++){ if(L[i].id===id) return L[i]; } return null; }
  function _q(it){ return (it&&it.lat&&it.lng)?(it.lat+','+it.lng):((it&&it.address)||''); }
  function _norm(s){ return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim(); }
  var _SKIP={with:1,from:1,that:1,this:1,your:1,confirmation:1,reservation:1,booking:1,voucher:1};
  function _toks(s){ return _norm(s).split(' ').filter(function(w){ return w.length>=4 && !_SKIP[w]; }); }

  window.__docFor=function(it){
    var docs=(window.HOMEDOCS&&window.HOMEDOCS[it.trip_id])||[];
    if(!docs.length) return null;
    var i;
    if(it.ref){ var r=String(it.ref).toUpperCase();
      for(i=0;i<docs.length;i++){ if(String(docs[i].title||'').toUpperCase().indexOf(r)>=0) return docs[i]; } }
    var t=_toks(it.title); if(!t.length) return null;
    var best=null,bs=0;
    for(i=0;i<docs.length;i++){ var dt=_norm(docs[i].title), s=0;
      for(var j=0;j<t.length;j++){ if(dt.indexOf(t[j])>=0) s++; }
      if(s>bs){ bs=s; best=docs[i]; } }
    return bs>=2?best:null;
  };

  window.__ajMapOverlay=function(id){
    try{
      var it=_item(id); var q=_q(it); if(!q) return;
      var ov=document.getElementById('ajMapOv');
      if(!ov){
        ov=document.createElement('div'); ov.id='ajMapOv';
        ov.style.cssText='position:fixed;inset:0;z-index:2147483000;background:#0b1420;display:none;flex-direction:column';
        ov.innerHTML='<div style="display:flex;align-items:center;gap:10px;padding:10px 14px">'
          +'<b id="ajMapTitle" style="flex:1;color:#fff;font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></b>'
          +'<a id="ajMapNav" rel="noopener" style="color:#4dd0c4;text-decoration:none;font-weight:600;padding:6px 10px;border:1px solid #4dd0c4;border-radius:8px">Navigate &#9656;</a>'
          +'<span id="ajMapX" style="color:#fff;font-size:26px;padding:2px 10px;cursor:pointer">&#10005;</span></div>'
          +'<iframe id="ajMapFrame" style="flex:1;border:0;width:100%" allowfullscreen loading="eager" referrerpolicy="no-referrer-when-downgrade"></iframe>';
        document.body.appendChild(ov);
        document.getElementById('ajMapX').onclick=function(){ ov.style.display='none'; document.getElementById('ajMapFrame').src='about:blank'; };
      }
      document.getElementById('ajMapTitle').textContent=(it&&it.title)||'Map';
      var web='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q);
      document.getElementById('ajMapNav').href = AND
        ? ('intent://maps.google.com/maps?q='+encodeURIComponent(q)+'#Intent;scheme=https;package=com.google.android.apps.maps;S.browser_fallback_url='+encodeURIComponent(web)+';end')
        : web;
      document.getElementById('ajMapFrame').src='https://maps.google.com/maps?q='+encodeURIComponent(q)+'&z=15&output=embed';
      ov.style.display='flex';
    }catch(e){}
  };

  var _il=window.itemLine;
  function _homeLine(it){
    var html=_il(it);
    html=html.replace(/<button class="copybtn"[\s\S]*?<\/button>/,'');
    html=html.replace('<div class="it-line"','<div class="it-line" data-ii="'+it.id+'"');
    return html;
  }

  window.__ajDiag={w:0,r:0,d:0,c:0};
  function _itemByTitle(txt){
    var L=_DATA().trip_items||[]; txt=_norm(txt);
    if(!txt) return null;
    for(var i=0;i<L.length;i++){ if(_norm(L[i].title)===txt) return L[i]; }
    for(i=0;i<L.length;i++){ var t=_norm(L[i].title); if(t&&(t.indexOf(txt)===0||txt.indexOf(t)===0)) return L[i]; }
    return null;
  }
  function _wire(){
    try{
      var box=document.getElementById('homePager'); if(!box) return;
      var rows=box.querySelectorAll('.it-line');
      window.__ajDiag.r=rows.length;
      window.__ajDiag.d=box.querySelectorAll('.it-line[data-ii]').length;
      for(var n=0;n<rows.length;n++){ (function(el){
        var it=null, id=el.getAttribute('data-ii');
        if(id) it=_item(id);
        if(!it){ var bb=el.querySelector('b'); it=bb?_itemByTitle(bb.textContent):null; }
        if(!it) return;
        if(_q(it) && !el.querySelector('button[data-ajmap]')){
          var b=document.createElement('button');
          b.className='copybtn'; b.setAttribute('data-ajmap','1');
          b.style.cssText='padding:6px 10px'; b.innerHTML='&#128506; Map';
          (function(iid){ b.onclick=function(ev){ try{ev.stopPropagation();ev.preventDefault();}catch(e){} window.__ajMapOverlay(iid); }; })(it.id);
          el.appendChild(b);
        }
        var w=el.parentElement; if(!w||w.id==='homePager') return;
        var d=window.__docFor(it); if(!d) return;
        if(!w.__ajdoc){
          w.__ajdoc=true;
          w.onclick=function(ev){
            if(ev&&ev.target&&ev.target.closest&&ev.target.closest('button,a')) return;
            try{ window.openDocById(d.id); }catch(e){}
          };
          if(w.innerHTML.indexOf('tap to view')<0){
            var m=document.createElement('div');
            m.className='mini'; m.style.cssText='color:var(--teal);margin-top:-2px';
            m.innerHTML='&#128196; tap to view document';
            w.appendChild(m);
          }
        }
      })(rows[n]); }
      window.__ajDiag.c=box.querySelectorAll('button[data-ajmap]').length;
      var bd=document.getElementById('ajVerBadge');
      if(bd) bd.textContent=VER+' · r'+window.__ajDiag.r+' c'+window.__ajDiag.c+(window.__ajDiag.w?'':' !w');
    }catch(e){}
  }
  if(window.renderHomePager && window.itemLine){
    window.__ajDiag.w=1;
    var _rhp=window.renderHomePager;
    window.renderHomePager=function(){
      var prev=window.itemLine;
      window.itemLine=_homeLine;
      try{ _rhp.apply(this,arguments); } finally { window.itemLine=prev; }
      _wire();
    };
    try{ if(typeof cur!=='undefined'&&cur==='home') window.renderHomePager(); }catch(e){}
  }
  setTimeout(_wire,800); setInterval(_wire,4000);

  var _refreshing=false;
  window.__ajHardRefresh=function(){
    if(_refreshing) return; _refreshing=true;
    var done=false;
    function fin(){ if(done) return; done=true;
      try{ location.replace(location.pathname+'?r='+Date.now()); }
      catch(e){ try{ location.reload(); }catch(e2){} } }
    try{ if(navigator.serviceWorker&&navigator.serviceWorker.getRegistrations){
      navigator.serviceWorker.getRegistrations().then(function(rs){ rs.forEach(function(r){ try{ r.update(); }catch(e){} }); }); } }catch(e){}
    try{ if(window.caches&&caches.keys){ caches.keys().then(function(ks){ return Promise.all(ks.map(function(k){ return caches.delete(k); })); }).then(fin,fin); } else fin(); }catch(e){ fin(); }
    setTimeout(fin,1200);
  };

  function _badge(){
    try{
      if(document.getElementById('ajVerBadge')||!document.body) return;
      var b=document.createElement('div'); b.id='ajVerBadge';
      b.style.cssText='position:fixed;bottom:8px;right:8px;z-index:2147483001;background:rgba(15,25,35,.62);color:#fff;font:600 11px/1 -apple-system,Roboto,sans-serif;padding:4px 9px;border-radius:10px;letter-spacing:.4px;cursor:pointer;user-select:none';
      b.textContent=VER; b.title='tap to refresh';
      b.onclick=function(){ b.textContent='…'; window.__ajHardRefresh(); };
      document.body.appendChild(b);
    }catch(e){}
  }
  function _logo(){
    try{
      var l=document.querySelector('header.top .logo');
      if(!l||l.__ajr) return; l.__ajr=true;
      l.style.cursor='pointer';
      l.addEventListener('click',function(){ window.__ajHardRefresh(); });
    }catch(e){}
  }
  _badge(); _logo();
  setTimeout(function(){_badge();_logo();},1200);
  setTimeout(function(){_badge();_logo();},3500);
  setInterval(function(){_badge();_logo();},10000);

  function _check(){
    try{
      fetch('./sw.js?u='+Date.now(),{cache:'no-store'}).then(function(r){return r.text();}).then(function(t){
        var m=t.match(/ajhub-cloud-v(\d+)/); if(!m) return;
        if(parseInt(m[1],10)>parseInt(VER.slice(1),10)){
          /* v208 guard: reload at most ONCE per detected build — a sw/dash version mismatch must NEVER loop (12 Aug incident: sw v208 + dash v207 = infinite refresh) */
          var last=null; try{ last=sessionStorage.getItem('ajRelFor'); }catch(e){}
          if(last===m[1]) return;
          try{ sessionStorage.setItem('ajRelFor',m[1]); }catch(e){}
          try{ if(navigator.serviceWorker&&navigator.serviceWorker.getRegistration){ navigator.serviceWorker.getRegistration().then(function(reg){ if(reg) reg.update(); }); } }catch(e){}
          setTimeout(function(){ if(window.__ajDocOpen){ try{ sessionStorage.removeItem('ajRelFor'); }catch(e){} return; } location.reload(); },600);
        }
      }).catch(function(){});
    }catch(e){}
  }
  document.addEventListener('visibilitychange',function(){ if(document.visibilityState==='visible') _check(); });
  setInterval(_check,300000);
  setTimeout(_check,4000);
}catch(e){}
})();



/* ===== v205 (10 Aug 2026) — note pages: universal scroll fix, applied by the APP =====
   The v204 fix (map stops eating one-finger drags; page reports its height so the viewer
   stops letterboxing) was hand-written into the Hua Hin page only, so the other nine map
   pages still misbehaved. This moves it app-side: viewNote and the edit preview inject
   this bootstrap into every HTML note's srcdoc, so EXISTING pages and every page created
   from here on get it automatically, with no per-note code to remember.
   Generic by design — no Leaflet internals; it stops touch events reaching a locked map
   (restoring native page scroll) and reports document height to the viewer. */
(function(){
try{
  function AJ_NOTE_BOOT(){
  if(window.__ajBooted) return; window.__ajBooted=1;
  function ajH(){try{
    /* v210: measure BODY content height only. documentElement.scrollHeight is
       floored at the iframe viewport, so after the viewer grows the frame the
       page can never report a smaller number -> +24px feedback ratchet to the
       24000px cap = huge blank scroll. body height is auto = real content. */
    var b=document.body, h=0;
    if(b){ h=Math.max(b.scrollHeight||0, b.offsetHeight||0); }
    if(!h && document.documentElement) h=document.documentElement.scrollHeight||0;
    if(h&&parent&&parent!==window) parent.postMessage({__ajNoteH:h},'*');
  }catch(e){}}
  window.__ajH=ajH;
  window.addEventListener('load',ajH); window.addEventListener('resize',ajH);
  [80,300,700,1400,2500,4000].forEach(function(m){ setTimeout(ajH,m); });
  try{ if(window.ResizeObserver&&document.body) new ResizeObserver(ajH).observe(document.body); }catch(e){}
  try{ if(window.MutationObserver&&document.body) new MutationObserver(function(){ clearTimeout(window.__ajHT); window.__ajHT=setTimeout(ajH,120); }).observe(document.body,{childList:true,subtree:true}); }catch(e){}
  document.addEventListener('click',function(){ setTimeout(ajH,150); },true);

  var css=document.createElement('style');
  css.textContent='.leaflet-container{touch-action:pan-y !important}.leaflet-container.aj-un{touch-action:none !important}'
   +'.aj-pan{display:block;width:100%;margin:-2px 0 12px;padding:10px;border:1px solid #d9d3c7;border-radius:10px;background:#fff;color:#726e64;font-weight:700;font-size:12.5px;font-family:inherit;cursor:pointer}'
   +'.aj-pan.on{background:#1d3357;color:#fff;border-color:#1d3357}';
  (document.head||document.documentElement).appendChild(css);

  function guard(e){
    try{
      var t=e.target; if(!t||!t.closest) return;
      var mc=t.closest('.leaflet-container'); if(!mc) return;
      if(mc.className.indexOf('aj-un')>=0) return;
      if(t.closest('.leaflet-control,.leaflet-marker-icon,.leaflet-popup,a,button')) return;
      e.stopPropagation();
    }catch(err){}
  }
  ['touchstart','touchmove','pointerdown','mousedown'].forEach(function(ev){ document.addEventListener(ev,guard,true); });

  function addBtns(){
    try{
      var ms=document.querySelectorAll('.leaflet-container');
      for(var i=0;i<ms.length;i++){ (function(mc){
        if(mc.__ajBtn) return; mc.__ajBtn=1;
        var b=document.createElement('button'); b.type='button'; b.className='aj-pan';
        b.innerHTML='&#9995; Move the map';
        b.onclick=function(){
          if(mc.className.indexOf('aj-un')>=0){ mc.className=mc.className.replace(/\s*aj-un/,''); b.className='aj-pan'; b.innerHTML='&#9995; Move the map'; }
          else { mc.className+=' aj-un'; b.className='aj-pan on'; b.innerHTML='&#10003; Map unlocked &middot; tap to scroll the page again'; }
          setTimeout(ajH,80);
        };
        if(mc.parentNode) mc.parentNode.insertBefore(b, mc.nextSibling);
        setTimeout(ajH,120);
      })(ms[i]); }
    }catch(e){}
  }
  addBtns(); [300,900,2000,4000].forEach(function(m){ setTimeout(addBtns,m); });
  setInterval(addBtns,5000);
}
  var BOOT='('+AJ_NOTE_BOOT.toString()+')();';

  function inject(html){
    try{
      if(!html) return html;
      if(html.indexOf('__ajBooted')>=0) return html;
      var tag='<scr'+'ipt id="__ajBoot">'+BOOT+'<\/scr'+'ipt>';
      var i=html.lastIndexOf('</bo'+'dy>');
      if(i<0) i=html.lastIndexOf('</ht'+'ml>');
      return i<0 ? (html+tag) : (html.slice(0,i)+tag+html.slice(i));
    }catch(e){ return html; }
  }
  window.__ajInjectBoot=inject;

  function patchFrame(id){
    try{
      var f=document.getElementById(id); if(!f||f.__ajDone) return;
      var s=f.getAttribute('srcdoc'); if(s==null) s=f.srcdoc||'';
      if(!s) return;
      var out=inject(s);
      if(out!==s){ f.__ajDone=1; f.srcdoc=out; }
    }catch(e){}
  }

  function wrap(name,frameId){
    var orig=window[name]; if(typeof orig!=='function') return;
    window[name]=function(){
      var r=orig.apply(this,arguments);
      patchFrame(frameId);
      setTimeout(function(){ patchFrame(frameId); },0);
      setTimeout(function(){ patchFrame(frameId); },120);
      return r;
    };
  }
  wrap('viewNote','noteFrame');
  wrap('editNote','nt_preview');
}catch(e){}
})();


/* ===== v209 (12 Aug 2026) — in-app document viewer: THE "docs revert to front page" FIX =====
   Root cause: the shared opener openDocById built a blob URL and called window.open()
   (with a synthetic anchor .click() fallback). In the installed PWA BOTH are dead —
   the v192/v193 rule: only the DEFAULT action of a real user-tapped <a> navigates.
   So every doc tap = toast + nothing, and Android's relaunch lands on Home.
   Fix (D14b — one shared opener, never fails silently): openDocById now opens a
   fullscreen IN-APP overlay (same pattern as __ajMapOverlay). Images render inline,
   PDFs render via pdf.js from cdnjs, anything else says so honestly. The header has
   a real ⬇ Save anchor (blob href + download attr — a real tap, so it works) and ✕.
   Sets window.__ajDocOpen while open; the auto-updater defers its reload on that flag. */
(function(){
'use strict';
try{
  var PDFJS='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  var PDFWK='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  var _pdfReady=null;
  function _sb(){ return (typeof sb!=='undefined')?sb:window.sb; }
  function loadPdfjs(){
    if(window.pdfjsLib){ try{ if(!window.pdfjsLib.GlobalWorkerOptions.workerSrc) window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFWK; }catch(e){} return Promise.resolve(window.pdfjsLib); }
    if(_pdfReady) return _pdfReady;
    _pdfReady=new Promise(function(res,rej){
      var s=document.createElement('script'); s.src=PDFJS;
      s.onload=function(){ try{ window.pdfjsLib.GlobalWorkerOptions.workerSrc=PDFWK; }catch(e){} res(window.pdfjsLib); };
      s.onerror=function(){ _pdfReady=null; rej(new Error('pdf.js failed to load')); };
      document.head.appendChild(s);
    });
    return _pdfReady;
  }
  function ov(){
    var o=document.getElementById('ajDocOv');
    if(o) return o;
    o=document.createElement('div'); o.id='ajDocOv';
    o.style.cssText='position:fixed;inset:0;z-index:2147483002;background:#0b1420;display:none;flex-direction:column';
    o.innerHTML='<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;flex:0 0 auto">'
      +'<b id="ajDocTitle" style="flex:1;color:#fff;font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></b>'
      +'<a id="ajDocDl" rel="noopener" style="color:#4dd0c4;text-decoration:none;font-weight:600;padding:6px 10px;border:1px solid #4dd0c4;border-radius:8px;display:none">&#11015; Save</a>'
      +'<span id="ajDocX" style="color:#fff;font-size:26px;padding:2px 10px;cursor:pointer">&#10005;</span></div>'
      +'<div id="ajDocBody" style="flex:1;overflow:auto;-webkit-overflow-scrolling:touch;text-align:center;padding:0 0 24px"></div>';
    document.body.appendChild(o);
    document.getElementById('ajDocX').onclick=function(){ window.__ajDocClose(); };
    return o;
  }
  window.__ajDocClose=function(){
    var o=document.getElementById('ajDocOv'); if(!o) return;
    o.style.display='none'; window.__ajDocOpen=false;
    var b=document.getElementById('ajDocBody'); if(b) b.innerHTML='';
    if(o.__u){ try{ URL.revokeObjectURL(o.__u); }catch(e){} o.__u=null; }
  };
  function msg(html){ var b=document.getElementById('ajDocBody'); if(b) b.innerHTML='<div style="color:#cfe3e6;font-size:14px;line-height:1.5;padding:40px 24px">'+html+'</div>'; }
  window.openDocById=async function(id){
    var o=ov(); o.style.display='flex'; window.__ajDocOpen=true;
    document.getElementById('ajDocTitle').textContent='Loading\u2026';
    var dl=document.getElementById('ajDocDl'); dl.removeAttribute('href'); dl.removeAttribute('download'); dl.style.display='none';
    msg('Loading\u2026');
    var res; try{ res=await _sb().from('documents').select('title,mime,content').eq('id',id).single(); }catch(e){ res={error:e}; }
    if(!res||res.error||!res.data){
      document.getElementById('ajDocTitle').textContent='Document';
      msg('Could not load this document.<br><br>'+String((res&&res.error&&res.error.message)||'No data returned.')); return;
    }
    var d=res.data;
    document.getElementById('ajDocTitle').textContent=d.title||'Document';
    var bytes,blob,u;
    try{
      var s=atob(d.content); bytes=new Uint8Array(s.length);
      for(var i=0;i<s.length;i++) bytes[i]=s.charCodeAt(i);
      blob=new Blob([bytes],{type:d.mime||'application/octet-stream'});
      u=URL.createObjectURL(blob); if(o.__u){ try{ URL.revokeObjectURL(o.__u); }catch(e){} } o.__u=u;
    }catch(e){ msg('This document could not be decoded.'); return; }
    var isPdf=String(d.mime||'').indexOf('pdf')>=0;
    dl.href=u; dl.setAttribute('download',(d.title||'document')+(isPdf?'.pdf':'')); dl.style.display='';
    if(/^image\//.test(d.mime||'')){
      var body0=document.getElementById('ajDocBody'); body0.innerHTML='';
      var img=document.createElement('img'); img.src=u; img.style.cssText='max-width:100%;height:auto;display:block;margin:0 auto';
      body0.appendChild(img); return;
    }
    if(isPdf){
      msg('Rendering\u2026');
      try{
        var lib=await loadPdfjs();
        var pdf=await lib.getDocument({data:bytes}).promise;
        var body=document.getElementById('ajDocBody'); body.innerHTML='';
        var w=Math.min(body.clientWidth||window.innerWidth||390, 1100);
        for(var p=1;p<=pdf.numPages;p++){
          var page=await pdf.getPage(p);
          var v1=page.getViewport({scale:1});
          var scale=Math.max(1,(w-8)/v1.width)*((window.devicePixelRatio||1)>1?1.5:1);
          if(scale>3) scale=3;
          var vp=page.getViewport({scale:scale});
          var cv=document.createElement('canvas'); cv.width=vp.width; cv.height=vp.height;
          cv.style.cssText='width:min(100%,'+Math.round(w-8)+'px);height:auto;display:block;margin:6px auto;background:#fff;border-radius:4px';
          body.appendChild(cv);
          await page.render({canvasContext:cv.getContext('2d'),viewport:vp}).promise;
        }
        if(!pdf.numPages) msg('Empty PDF.<br><br>Use &#11015; Save above to open it in your PDF app.');
      }catch(e){ msg('Preview failed ('+String((e&&e.message)||'pdf.js error')+').<br><br>Use &#11015; Save above to open it in your PDF app.'); }
      return;
    }
    msg('No inline preview for this file type ('+String(d.mime||'unknown')+').<br><br>Use &#11015; Save above to open it.');
  };
}catch(e){}
})();


/* ===== v212 (21 Aug 2026) — IDEAS: "Make this a trip" now works on date-less notes =====
   Root cause: noteToTrip inserted a trip with NULL dates from the 60th-Year idea notes;
   every list in the app filters on start_date, so the new trip was INVISIBLE everywhere —
   the button looked dead. Fix (D-rules: no silent failures, no one-offs):
   1. noteToTrip replaced — dates now optional. No dates => category 'idea'.
   2. Travel gets an IDEAS 💡 section (any trip with no start_date or category 'idea').
      Tap = open its story note; 📅 = set dates.
   3. __tdSave wrapped — giving an idea dates graduates it: category -> 'personal',
      it moves into Trips automatically. */
(function(){
try{
  function E(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function esc(s){return E(s);}
  function ajIdeaList(){ return (D.trips||[]).filter(function(t){ return !t.start_date || t.category==='idea'; }); }

  window.noteToTrip=function(noteId){
    try{
      var n=(D.notes||[]).find(function(x){return x.id===noteId;}); if(!n){ toast('Note not found'); return; }
      var r=null; try{ r=window.__parseRange(n.title)||window.__parseRange(String(n.body||'').replace(/<[^>]*>/g,' ').slice(0,400)); }catch(e){}
      r=r||{start:'',end:''};
      openSheet('<h3>Make this a trip</h3>'
       +'<div class="mini" style="margin:-8px 0 14px">Leave the dates empty to file it under <b>Ideas 💡</b> in Travel — set dates later and it becomes a real trip.</div>'
       +'<label class="f">Trip name</label><input id="nt_n" value="'+E(window.__suggestTripName(n.title))+'">'
       +'<div class="two" style="margin-top:10px">'
       +'<div><label class="f">Start</label><input id="nt_s" type="date" value="'+E(r.start||'')+'"></div>'
       +'<div><label class="f">End</label><input id="nt_e" type="date" value="'+E(r.end||'')+'"></div>'
       +'</div>'
       +'<button class="btn primary block" style="margin-top:18px" id="nt_go">Create</button>');
      var sh=document.getElementById('sheet'); if(sh){ try{ sh.scrollTop=0; }catch(e){} }
      var b=document.getElementById('nt_go');
      if(b) b.onclick=function(){
        var name=((document.getElementById('nt_n')||{}).value||'').trim()||window.__suggestTripName(n.title)||'Trip';
        var s=(document.getElementById('nt_s')||{}).value||null;
        var e=(document.getElementById('nt_e')||{}).value||s;
        if(e&&s&&e<s) e=s;
        sb.from('trips').insert({title:name,start_date:s,end_date:e,category:s?'personal':'idea'}).select().then(function(res){
          var tr=(res&&res.data&&res.data[0])||null;
          if(!tr){ toast('Could not create the trip'+((res&&res.error&&res.error.message)?(' — '+res.error.message):'')); return; }
          D.trips=(D.trips||[]).concat([tr]);
          sb.from('notes').update({trip_id:tr.id}).eq('id',n.id).then(function(){
            n.trip_id=tr.id;
            try{closeSheet();}catch(err){}
            toast(s?'Trip created':'Filed under Ideas 💡 — see Travel');
            try{render();}catch(err){}
            if(s) setTimeout(function(){ try{ openTrip(tr.id); }catch(err){} },260);
          });
        }).catch(function(err){ toast('Could not create the trip — '+((err&&err.message)||'error')); });
      };
    }catch(e){ try{ toast('Make-a-trip failed: '+((e&&e.message)||e)); }catch(_e){} }
  };

  var _rT=window.rTravel;
  window.rTravel=function(){
    var out=_rT?_rT.apply(this,arguments):undefined;
    try{
      var v=document.getElementById('v-travel'); if(!v) return out;
      if(v.querySelector('#ajIdeas')) return out;
      var L=ajIdeaList();
      var h='<div class="sect" id="ajIdeas">Ideas 💡 · '+L.length+'</div><div class="card">';
      if(L.length){
        L.forEach(function(t){
          var note=(D.notes||[]).find(function(x){return x.trip_id===t.id;});
          var open = note ? 'viewNote(\''+note.id+'\')' : 'tripDates(\''+t.id+'\')';
          h+='<div class="list-item" style="cursor:pointer" onclick="'+open+'">'
           +'<div class="li-main"><div class="h">💡 '+esc(t.title||'Idea')+'</div>'
           +'<div class="sub">No dates yet — tap for the story</div></div>'
           +'<button class="btn ghost sm" type="button" style="flex:none" onclick="event.stopPropagation();tripDates(\''+t.id+'\')">📅</button>'
           +'<div class="chev">›</div></div>';
        });
      } else {
        h+='<div class="mini">No ideas filed yet. Open an idea note and tap “Make this a trip”.</div>';
      }
      h+='</div>';
      var btn=v.querySelector('button.btn.ghost.block');
      if(btn) btn.insertAdjacentHTML('afterend',h); else v.insertAdjacentHTML('beforeend',h);
    }catch(e){}
    return out;
  };

  var _tds=window.__tdSave;
  window.__tdSave=function(id){
    var t=(D.trips||[]).find(function(x){return x.id===id;});
    var wasIdea=!!(t&&(t.category==='idea'||!t.start_date));
    var r=_tds?_tds.apply(this,arguments):undefined;
    try{
      if(wasIdea){
        sb.from('trips').update({category:'personal'}).eq('id',id).then(function(){
          if(t) t.category='personal';
          try{render();}catch(e){}
          toast('Idea graduated to a trip ✈️');
        });
      }
    }catch(e){}
    return r;
  };
}catch(e){}
})();


/* ===== v214 (22 Aug 2026) — NEXT-TRIP TICKETS ON THE FRONT PAGE =====
   AJ report: latest tickets not one tap from the front. Root cause: the home
   "This week" page only surfaces flights within 7 days; further-out trips need
   two swipes. Spec (acid test) says: phone out, ticket on screen, two seconds.
   Fix: front page (page 0) now always carries a "🎫 Next trip" block — the next
   upcoming trip's flights, one tap straight to the e-ticket (docMatch by ref,
   trip-scoped, same rule as everywhere). Falls back to opening the trip if a
   doc isn't wired — never a dead tap. Own E/esc copies per v213 lesson. */
(function(){
try{
  function E(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function dmatch(docs,ref){ if(!ref||!docs) return null; var r=String(ref).toUpperCase(); for(var i=0;i<docs.length;i++){ if(String(docs[i].title||'').toUpperCase().indexOf(r)>=0) return docs[i]; } return null; }
  var _rhp=window.renderHomePager;
  window.renderHomePager=function(){
    var out=_rhp?_rhp.apply(this,arguments):undefined;
    try{
      if(window.homePage!==0) return out;
      var box=document.getElementById('homePager'); if(!box) return out;
      if(box.querySelector('#ajNextTix')) return out;
      var tk=new Date(); tk=tk.getFullYear()+'-'+String(tk.getMonth()+1).padStart(2,'0')+'-'+String(tk.getDate()).padStart(2,'0');
      var trips=(D.trips||[]).filter(function(t){ return t.start_date&&String(t.start_date).slice(0,10)>tk; })
        .sort(function(a,b){ return String(a.start_date).localeCompare(String(b.start_date)); });
      var t=trips[0]; if(!t) return out;
      var fls=(D.flights||[]).filter(function(f){ return f.trip_id===t.id&&!f.archived; })
        .sort(function(a,b){ return ((a.fdate||'')+' '+(a.ftime||'')).localeCompare((b.fdate||'')+' '+(b.ftime||'')); });
      if(!fls.length) return out;
      var docs=(window.HOMEDOCS&&window.HOMEDOCS[t.id])||[];
      var h='<div class="sect" id="ajNextTix" style="margin-top:12px">🎫 '+E(t.title)+' — tickets</div><div class="card">';
      fls.forEach(function(f){
        var d=dmatch(docs,f.conf);
        var tap=d?("openDocById('"+d.id+"')"):("openTrip('"+t.id+"')");
        h+='<div class="it-line" style="cursor:pointer" onclick="'+tap+'">'
         +'<span class="it-ic">✈️</span><div class="it-main">'
         +'<b>'+E((f.from_code||'')+' → '+(f.to_code||''))+' · '+E(f.flight_no||'')+'</b>'
         +'<span class="mini">'+E(String(f.fdate||'').slice(5))+' · '+E(f.ftime||'')+' · '+E(f.pax||'')
         +(d?' · <span style="color:var(--teal);font-weight:700">🎫 ticket</span>':'')+'</span>'
         +'</div></div>';
      });
      h+='</div>';
      box.insertAdjacentHTML('beforeend',h);
    }catch(e){}
    return out;
  };
}catch(e){}
})();


/* ===== v215 (22 Aug 2026) — MAKE-A-TRIP asks: "Suggest provisional flights?" =====
   AJ mandate: when creating a trip with dates, offer AI-suggested provisional
   flights (conf PROV, clearly marked not-booked) inserted automatically via the
   ask edge fn (Opus, db_write). Redefines noteToTrip (supersedes v212/v213
   version — same behaviour plus the checkbox). Own E/esc per v213 lesson. */
(function(){
try{
  function E(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  window.noteToTrip=function(noteId){
    try{
      var n=(D.notes||[]).find(function(x){return x.id===noteId;}); if(!n){ toast('Note not found'); return; }
      var r=null; try{ r=window.__parseRange(n.title)||window.__parseRange(String(n.body||'').replace(/<[^>]*>/g,' ').slice(0,400)); }catch(e){}
      r=r||{start:'',end:''};
      openSheet('<h3>Make this a trip</h3>'
       +'<div class="mini" style="margin:-8px 0 14px">Leave the dates empty to file it under <b>Ideas 💡</b> in Travel — set dates later and it becomes a real trip.</div>'
       +'<label class="f">Trip name</label><input id="nt_n" value="'+E(window.__suggestTripName(n.title))+'">'
       +'<div class="two" style="margin-top:10px">'
       +'<div><label class="f">Start</label><input id="nt_s" type="date" value="'+E(r.start||'')+'"></div>'
       +'<div><label class="f">End</label><input id="nt_e" type="date" value="'+E(r.end||'')+'"></div>'
       +'</div>'
       +'<label style="display:flex;align-items:center;gap:8px;margin-top:14px;font-size:14px"><input type="checkbox" id="nt_fl" checked> ✈️ Suggest provisional flights (needs dates)</label>'
       +'<button class="btn primary block" style="margin-top:16px" id="nt_go">Create</button>');
      var sh=document.getElementById('sheet'); if(sh){ try{ sh.scrollTop=0; }catch(e){} }
      var b=document.getElementById('nt_go');
      if(b) b.onclick=function(){
        var name=((document.getElementById('nt_n')||{}).value||'').trim()||window.__suggestTripName(n.title)||'Trip';
        var s=(document.getElementById('nt_s')||{}).value||null;
        var e=(document.getElementById('nt_e')||{}).value||s;
        var wantFl=!!((document.getElementById('nt_fl')||{}).checked);
        if(e&&s&&e<s) e=s;
        sb.from('trips').insert({title:name,start_date:s,end_date:e,category:s?'personal':'idea'}).select().then(function(res){
          var tr=(res&&res.data&&res.data[0])||null;
          if(!tr){ toast('Could not create the trip'+((res&&res.error&&res.error.message)?(' — '+res.error.message):'')); return; }
          D.trips=(D.trips||[]).concat([tr]);
          sb.from('notes').update({trip_id:tr.id}).eq('id',n.id).then(function(){
            n.trip_id=tr.id;
            try{closeSheet();}catch(err){}
            toast(s?'Trip created':'Filed under Ideas 💡 — see Travel');
            try{render();}catch(err){}
            if(s&&wantFl){
              toast('✈️ Working out flight suggestions…');
              sb.functions.invoke('ask',{body:{type:'answer',q:'Suggest the best realistic flights for the trip "'+name+'" ('+s+' to '+e+') for Adrian & Jacqueline from their Koh Samui base (USM; Bangkok Airways to BKK; low-cost China/regional directs often use DMK). Insert them into the flights table for that trip as PROVISIONAL: conf "PROV", pax "Both", notes beginning "PROVISIONAL — not booked." with honest caveats (approximate times, transfer needs, overnight stops where connections do not work). Use real airlines, real route days, real flight numbers where confident; leave ftime null when unsure. Then reply with a one-line summary of the chain.'}}).then(function(rr){
                var a=rr&&rr.data&&rr.data.answer; toast(a?('✈️ '+String(a).slice(0,120)):'✈️ Flight suggestions filed on the trip');
                try{ if(window.reloadData) reloadData(); else render(); }catch(err){}
              }).catch(function(){ toast('Flight suggestion failed — trip created fine'); });
            }
            if(s) setTimeout(function(){ try{ openTrip(tr.id); }catch(err){} },260);
          });
        }).catch(function(err){ toast('Could not create the trip — '+((err&&err.message)||'error')); });
      };
    }catch(e){ try{ toast('Make-a-trip failed: '+((e&&e.message)||e)); }catch(_e){} }
  };
}catch(e){}
})();


/* ===== v218 (23 Aug 2026) — TO-DO LIST INSIDE THE WANDERLOG TRIP VIEW =====
   AJ-TVTODO-20260823. AJ ruling: the Wanderlog view is the trip view; features
   must come WITH it, never be lost to it. This layer restores the tv view as the
   default trip-open and mounts the trip_checklist To-do card at the top of tvBody.
   Classic stays one tap away via the existing tvClassic button. */
(function(){
'use strict';
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function SB(){ try{ if(window.sb) return window.sb; }catch(e){} try{ return sb; }catch(e2){ return null; } }
var cur=null;
function row(r,dn){
  return '<div class="tvIt" data-td="'+r.id+'" data-st="'+(dn?'done':'open')+'">'
   +'<div class="tvPinL'+(dn?' mut':'')+'" style="font-size:15px">'+(dn?'\u2713':'\u25CB')+'</div>'
   +'<div class="tvMain"><div class="tvT" style="'+(dn?'text-decoration:line-through;color:#98a3ab;':'')+'white-space:normal">'+esc(r.label)+'</div>'
   +(r.due_date?'<div style="font-size:12px;color:#98a3ab">due '+esc(String(r.due_date).slice(0,10))+'</div>':'')
   +'</div><span data-tdx="'+r.id+'" style="color:#c5ced4;padding:4px 8px;font-size:15px">\u2715</span></div>';
}
function render(rows){
  var host=document.getElementById('tvTodoList'); if(!host) return;
  var open=rows.filter(function(r){return r.status!=='done';});
  var done=rows.filter(function(r){return r.status==='done';});
  var h='';
  open.forEach(function(r){ h+=row(r,false); });
  done.forEach(function(r){ h+=row(r,true); });
  h+='<div class="tvIt" id="tvTdAdd" style="color:#7a8792">\uFF0B Add to-do\u2026</div>';
  host.innerHTML=h;
  var hd=document.getElementById('tvTodoHead');
  if(hd) hd.innerHTML='To do <span class="dn">'+(open.length? open.length+' open':'all done \u2713')+'</span>';
  wire();
}
function load(){
  var s=SB(); if(!s||!cur) return;
  try{ s.from('trip_checklist').select('*').eq('trip_id',cur).order('created_at').then(function(r){
    if(!r.error) render((r.data||[]).filter(function(x){return x.status!=='superseded';}));
  }); }catch(e){}
}
function wire(){
  var host=document.getElementById('tvTodoList'); if(!host) return;
  host.onclick=function(ev){
    var x=ev.target.closest('[data-tdx]');
    if(x){ ev.stopPropagation(); if(!confirm('Remove this to-do?')) return;
      var s=SB(); if(s) s.from('trip_checklist').delete().eq('id',x.getAttribute('data-tdx')).then(load); return; }
    if(ev.target.closest('#tvTdAdd')){
      var lb=prompt('New to-do for this trip:'); if(!lb||!lb.trim()) return;
      var s2=SB(); if(s2) s2.from('trip_checklist').insert({trip_id:cur,kind:'custom',label:lb.trim(),source:'custom'}).then(load); return; }
    var r=ev.target.closest('[data-td]');
    if(r){ var ns=r.getAttribute('data-st')==='done'?'open':'done';
      var s3=SB(); if(s3) s3.from('trip_checklist').update({status:ns}).eq('id',r.getAttribute('data-td')).then(load); }
  };
}
function mount(id){
  cur=id; var tries=0;
  var iv=setInterval(function(){ tries++;
    var b=document.getElementById('tvBody');
    if(!b){ if(tries>40) clearInterval(iv); return; }
    clearInterval(iv);
    var w=document.getElementById('tvTodo');
    if(!w){ w=document.createElement('div'); w.id='tvTodo'; w.className='tvDay';
      w.innerHTML='<div class="tvDayH" id="tvTodoHead">To do</div><div id="tvTodoList"><div class="tvIt" style="color:#98a3ab">Loading\u2026</div></div>';
      b.insertBefore(w,b.firstChild);
    }
    load();
  },100);
}
if(window.__tripWander){
  window.openTrip=function(id){
    try{ window.__tripWander(id); mount(id); }
    catch(e){ try{ if(window.__tripClassic) window.__tripClassic(id); }catch(e2){} }
  };
}
})();


/* ===== v219 (23 Aug 2026) — REARCH PHASE 3: SERVER RENDER LIVE ON app.jjaj.info =====
   AJ-REARCH-LIVE-20260823. AJ order: one app, v2 live by morning, app must work.
   Strategy per rearchitect-v1 Phase 3, hardened: for home/travel/notes/info/more the
   legacy renderer paints FIRST (guaranteed working view), then the v2 `render` edge fn
   fragment is fetched with the user's token, sanity-checked, and swapped in — server-side
   truth in one round trip. Any failure = silent stay-on-legacy. Trip view is v218 client
   (same markup family as /render/trip). Kill switch: localStorage aj_v2_live='off' or
   window.ajV2('off'). Per-view auto-disable after 2 consecutive bad fragments. */
(function(){
'use strict';
function SB(){ try{ if(window.sb) return window.sb; }catch(e){} try{ return sb; }catch(e2){ return null; } }
var BASE='https://mjkaoombokemhgaynjwf.supabase.co/functions/v1/render/';
var APIKEY=(window.AJ_CONFIG&&window.AJ_CONFIG.SUPABASE_KEY)||'';
var MARK={home:'id="homePager"',travel:'+ New trip',notes:'id="notesList"',info:'id="infoMain"',more:'Signed in as'};
function on(){ try{ return localStorage.getItem('aj_v2_live')!=='off'; }catch(e){ return true; } }
function vOff(v){ try{ return localStorage.getItem('aj_v2_off_'+v)==='1'; }catch(e){ return false; } }
function fail(v){ try{ var k='aj_v2_fail_'+v, n=(+localStorage.getItem(k)||0)+1; localStorage.setItem(k,String(n)); if(n>=2) localStorage.setItem('aj_v2_off_'+v,'1'); }catch(e){} }
function ok(v){ try{ localStorage.removeItem('aj_v2_fail_'+v); }catch(e){} }
window.ajV2=function(m){ try{ if(m==='off'){ localStorage.setItem('aj_v2_live','off'); } else { localStorage.setItem('aj_v2_live','on'); ['home','travel','notes','info','more'].forEach(function(v){ localStorage.removeItem('aj_v2_off_'+v); localStorage.removeItem('aj_v2_fail_'+v); }); } if(window.toast) toast('v2 render '+(m==='off'?'OFF':'ON')); }catch(e){} };
function runScripts(box){
  try{
    var scripts=box.querySelectorAll('script');
    for(var i=0;i<scripts.length;i++){ try{ (new Function(scripts[i].textContent))(); }catch(e){} }
  }catch(e){}
}
function pull(view){
  if(!on()||vOff(view)) return;
  var s=SB(); if(!s||!s.auth) return;
  s.auth.getSession().then(function(r){
    var sess=r&&r.data&&r.data.session; if(!sess) return;
    return fetch(BASE+view,{headers:{'Authorization':'Bearer '+sess.access_token,'apikey':APIKEY}}).then(function(resp){
      if(!resp.ok) throw new Error('render '+view+' '+resp.status);
      return resp.text();
    }).then(function(html){
      if(!html||html.length<400||html.indexOf(MARK[view])<0){ fail(view); return; }
      var box=document.getElementById('v-'+view);
      if(!box||!box.classList.contains('active')) { ok(view); return; }
      box.innerHTML=html;
      runScripts(box);
      ok(view);
    });
  }).catch(function(e){ fail(view); });
}
function wrap(name,view){
  var prev=window[name];
  if(typeof prev!=='function') return;
  window[name]=function(){
    var out;
    try{ out=prev.apply(this,arguments); }catch(e){ throw e; }
    try{ pull(view); }catch(e){}
    return out;
  };
}
wrap('rHome','home');
wrap('rTravel','travel');
wrap('rNotes','notes');
wrap('rInfo','info');
wrap('rMore','more');
})();


/* ===== v219 — REARCH-CUTOVER-V2-20260823 (tab views served by render fn) =====
   Home/Travel/Notes/Info/More paint from the render edge fn: the legacy
   renderer paints instantly (zero function loss — all handlers, sheets,
   enhancers, and the v218 trip view with its To-do card stay live), then the
   server fragment swaps in behind it. Any error leaves the legacy paint.
   openTrip is NOT wrapped — trip view remains pure v218 (AJ-TVTODO).
   Kill-switch: localStorage.aj_rearch_off='1'  (set + reload to disable). */
(function(){
'use strict';
try{
  if(localStorage.getItem('aj_rearch_off')==='1') return;
  var BASE=(window.AJ_CONFIG&&AJ_CONFIG.SUPABASE_URL)+'/functions/v1/render';
  var SEQ={};
  function frag(path,cb,fail){
    try{
      sb.auth.getSession().then(function(r){
        var s=r&&r.data&&r.data.session; if(!s) return fail();
        fetch(BASE+'/'+path,{headers:{'Authorization':'Bearer '+s.access_token,'apikey':AJ_CONFIG.SUPABASE_KEY}})
          .then(function(res){ if(!res.ok) throw 0; return res.text(); })
          .then(cb).catch(fail);
      }).catch(fail);
    }catch(e){ fail(); }
  }
  function runScripts(el){
    el.querySelectorAll('script').forEach(function(old){
      var s=document.createElement('script'); s.textContent=old.textContent;
      old.parentNode.replaceChild(s,old);
    });
  }
  function cutover(name,elId,path){
    var legacy=window[name];
    if(typeof legacy!=='function') return;
    window[name]=function(){
      var v=document.getElementById(elId);
      if(!v){ legacy(); return; }
      legacy(); /* instant local paint — all legacy behaviour intact */
      var my=(SEQ[path]=(SEQ[path]||0)+1);
      frag(path,function(html){
        if(SEQ[path]!==my) return; /* stale response — a newer render ran */
        var v2=document.getElementById(elId);
        if(v2){ v2.innerHTML=html; runScripts(v2); }
      },function(){});
    };
  }
  cutover('rHome','v-home','home');
  cutover('rTravel','v-travel','travel');
  cutover('rNotes','v-notes','notes');
  cutover('rInfo','v-info','info');
  cutover('rMore','v-more','more');
}catch(e){ /* fail-safe: legacy behaviour untouched */ }
})();


/* ===== AJ-WALLETFIX-20260823 · Quick fill absorbs the full encrypted wallet (UIX audit C2) ===== */
(function(){
try{
  var _of=window.openFill;
  if(typeof _of!=='function') return;
  function ajwfLoad(){
    var host=document.getElementById('ffBody');
    if(!host||document.getElementById('walletBox')) return;
    /* AJ-WALLETFIX-b-20260823: sb is a top-level const (global lexical binding), not a window property */
    var SB=(typeof sb!=='undefined'&&sb)||window.sb||null;
    if(!SB||typeof window.__wPaint!=='function'||typeof window.__wKeys!=='function') return;
    var sec=document.createElement('div');
    sec.id='ajwfCards';
    sec.innerHTML='<div class="ffgrp">&#128179; Cards</div><div id="walletBox"><div class="mini">Loading…</div></div>';
    /* sibling AFTER #ffBody so ffPaint search re-renders never wipe it */
    if(host.parentNode) host.parentNode.appendChild(sec); else return;
    Promise.all([
      SB.from('wallet_cards').select('*').order('sort'),
      SB.from('documents').select('id,title,mime,is_card').eq('is_card',true).order('title'),
      window.__wKeys()
    ]).then(function(r){
      window.__wCards=(r[0]&&r[0].data)||[];
      window.__wDocs=(r[1]&&r[1].data)||[];
      window.__wHasKey=r[2].some(function(k){ return k.id==='pin'||k.id.indexOf('bio:')===0; });
      window.__wHasBio=r[2].some(function(k){ return k.id.indexOf('bio:')===0; });
      window.__wPaint();
    }).catch(function(){
      var b=document.getElementById('walletBox');
      if(b) b.innerHTML='<div class="mini">Wallet unavailable offline.</div>';
    });
  }
  window.openFill=function(){
    _of.apply(this,arguments);
    try{ ajwfLoad(); }catch(e){}
  };
  /* every legacy openCards() callback (PIN unlock, card edit "back", header icon) lands on the one canonical surface */
  window.openCards=function(){ window.openFill(); };
}catch(e){}
})();


/* ===== v222 (24 Aug 2026) — TRIP CARD CONSOLIDATION: STORY PAGE IS THE ONE TRIP CARD =====
   AJ-TRIPCARD-20260824. AJ ruling (ajqa-11): the story page (tripage HTML note in the
   note viewer) is the ONE canonical Trip Card. Jade tv overlay + classic itinerary retire
   from the UI (code stays dormant). This layer:
   1. openTrip -> resolves the trip's story note (notes.trip_id + title '^Travel ›', same
      as spine.js primaryNote) and opens it via viewNote. No story page yet -> falls back
      to the previous (v218 tv) view with a console marker. No auto-generation here.
   2. viewNote -> for HTML story notes with trip_id, re-issues the iframe srcdoc as the
      STORED body + an injected script/style (stored note HTML is never modified) adding
      two Card Tabs to the existing .tabs row: '✅ To-do' and '🎫 Tickets'.
   3. To-do tab = AJ-TVTODO logic ported (trip_checklist, superseded filtered, tap toggle,
      ✕ delete confirm, ＋ add). Tickets tab = flights + docs one-tap opens (D14), doc match
      by conf in documents.title (v179/v214 logic), every open via canonical openDocById.
   Iframe is sandboxed (allow-scripts, no allow-modals/same-origin) so confirm/prompt and
   ALL db work happen parent-side over a postMessage bridge. Kill switch:
   localStorage aj_tripcard='off'. */
(function(){
'use strict';
function SB(){ try{ if(sb) return sb; }catch(e){} try{ return window.sb||null; }catch(e2){ return null; } }
function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function on(){ try{ return localStorage.getItem('aj_tripcard')!=='off'; }catch(e){ return true; } }
function storyNote(tid){
  var ns=((typeof D!=='undefined'&&D&&D.notes)||[]).filter(function(n){ return n.trip_id===tid && /^\s*Travel\s*[›>]/.test(n.title||''); });
  return ns.length?ns[0]:null;
}

/* ---------- parent-side data for the two Card Tabs ---------- */
var curTrip=null, curFrame=null;
function frame(){ var f=document.getElementById('noteFrame'); if(f) curFrame=f; return curFrame; }
function send(msg){ var f=frame(); try{ if(f&&f.contentWindow) f.contentWindow.postMessage(msg,'*'); }catch(e){} }
function pushTodos(){
  var s=SB(); if(!s||!curTrip) return;
  try{ s.from('trip_checklist').select('*').eq('trip_id',curTrip).order('created_at').then(function(r){
    if(r&&!r.error) send({ajTc:'todos',rows:(r.data||[]).filter(function(x){return x.status!=='superseded';}).map(function(x){return {id:x.id,label:x.label,status:x.status,due:x.due_date?String(x.due_date).slice(0,10):null};})});
  }); }catch(e){}
}
function pushTickets(){
  var s=SB(); if(!s||!curTrip) return;
  try{ s.from('documents').select('id,title,mime').eq('trip_id',curTrip).then(function(r){
    var docs=(r&&r.data)||[];
    function match(conf){
      if(!conf) return null;
      var d=docs.find(function(x){ return x.title&&x.title.toUpperCase().indexOf(String(conf).toUpperCase())>=0; });
      return d?d.id:null;
    }
    var used={};
    var rows=[];
    var fls=((typeof D!=='undefined'&&D&&D.flights)||[]).filter(function(f){ return f.trip_id===curTrip&&!f.archived; })
      .sort(function(a,b){ return String(a.fdate||'').localeCompare(String(b.fdate||''))||String(a.ftime||'').localeCompare(String(b.ftime||'')); });
    fls.forEach(function(f){
      var did=match(f.conf); if(did) used[did]=1;
      rows.push({ic:'\u2708\uFE0F', t:(f.from_code||'?')+' \u2192 '+(f.to_code||'?')+' '+(f.flight_no||''),
        sub:[f.fdate,f.ftime,f.airline,f.conf?('ref '+f.conf):''].filter(Boolean).join(' \u00B7 '),
        doc:did, conf:f.conf||null});
    });
    docs.forEach(function(d){
      if(used[d.id]) return;
      var ic=(d.mime==='application/pdf')?'\uD83D\uDCC4':(/^image\//.test(d.mime||'')?'\uD83D\uDDBC\uFE0F':'\uD83D\uDCCE');
      rows.push({ic:ic, t:d.title||'Document', sub:'tap to show full screen', doc:d.id, conf:null});
    });
    send({ajTc:'tickets',rows:rows});
  }); }catch(e){}
}
window.addEventListener('message',function(ev){
  var m=ev&&ev.data; if(!m||!m.ajTc) return;
  var f=frame(); if(!f||ev.source!==f.contentWindow) return;
  var s=SB();
  if(m.ajTc==='ready'){ pushTodos(); pushTickets(); }
  else if(m.ajTc==='todoToggle'&&s){ s.from('trip_checklist').update({status:m.st==='done'?'open':'done'}).eq('id',m.id).then(pushTodos); }
  else if(m.ajTc==='todoDel'&&s){ if(confirm('Remove this to-do?')) s.from('trip_checklist').delete().eq('id',m.id).then(pushTodos); }
  else if(m.ajTc==='todoAdd'&&s){ var lb=prompt('New to-do for this trip:'); if(lb&&lb.trim()) s.from('trip_checklist').insert({trip_id:curTrip,kind:'custom',label:lb.trim(),source:'custom'}).then(pushTodos); }
  else if(m.ajTc==='openDoc'){ try{ openDocById(m.id); }catch(e){} }
  else if(m.ajTc==='noDoc'){ try{ toast(m.conf?('No ticket on file for '+m.conf):'No document on file'); }catch(e){} }
});

/* ---------- the script injected into the story-page iframe at VIEW time ---------- */
var INJ=[
'<style id="ajTcCss">',
'#ajTcTodo .ajTcRow,#ajTcTix .ajTcRow{display:flex;align-items:center;gap:10px;padding:10px 4px;border-bottom:1px solid rgba(0,0,0,.08);cursor:pointer;font-size:14px}',
'#ajTcTodo .ajTcRow .m,#ajTcTix .ajTcRow .m{flex:1;min-width:0}',
'#ajTcTodo .sub,#ajTcTix .sub{font-size:12px;color:#8a8a8a;margin-top:1px}',
'#ajTcTodo .dn .t{text-decoration:line-through;color:#98a3ab}',
'#ajTcTodo .x{color:#c5ced4;padding:4px 8px;font-size:15px}',
'.ajTcAdd{color:#7a8792;padding:10px 4px;cursor:pointer;font-size:14px}',
'</style>',
'<script id="ajTcJs">',
'(function(){',
'function ready(fn){ if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",fn); else fn(); }',
'ready(function(){',
'var tabs=document.querySelector(".tabs");',
'var sects=document.querySelectorAll(".sect");',
'var host=sects.length?sects[0].parentNode:document.body;',
'if(!tabs){ tabs=document.createElement("div"); tabs.className="tabs"; tabs.style.cssText="display:flex;flex-wrap:wrap;gap:7px;margin:12px 0 18px";',
'  if(sects.length) host.insertBefore(tabs,sects[0]); else document.body.insertBefore(tabs,document.body.firstChild); }',
'var HAD=sects.length>0;',
'function mkSect(id){ var d=document.createElement("div"); d.id=id; d.className="sect";',
'  if(!HAD) d.style.display="none";',
'  host.appendChild(d); return d; }',
'var pTodo=mkSect("ajTcTodo"), pTix=mkSect("ajTcTix");',
'function mkTab(lbl,id){ var b=document.createElement("button"); b.className="tab"; b.type="button"; b.textContent=lbl;',
'  b.onclick=function(){',
'    if(HAD&&typeof window.show==="function"){ try{ window.show(id,b); return; }catch(e){} }',
'    document.querySelectorAll(".sect").forEach(function(s){ s.classList.remove("on"); });',
'    document.querySelectorAll(".tab").forEach(function(t){ t.classList.remove("on"); });',
'    document.getElementById(id).classList.add("on"); b.classList.add("on");',
'    if(!HAD){ pTodo.style.display=(id==="ajTcTodo")?"block":"none"; pTix.style.display=(id==="ajTcTix")?"block":"none"; }',
'  };',
'  tabs.appendChild(b); return b; }',
'mkTab("\\u2705 To-do","ajTcTodo"); mkTab("\\uD83C\\uDFAB Tickets","ajTcTix");',
'var TD=[],TK=[];',
'function E(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }',
'function up(msg){ try{ parent.postMessage(msg,"*"); }catch(e){} }',
'function drawTodo(){',
'  var open=TD.filter(function(r){return r.status!=="done";}), done=TD.filter(function(r){return r.status==="done";});',
'  var h="<h2 style=\\"margin:6px 0 4px\\">\\u2705 To do"+(open.length?" \\u00B7 "+open.length+" open":" \\u2014 all done \\u2713")+"</h2>";',
'  open.concat(done).forEach(function(r){',
'    var dn=r.status==="done";',
'    h+="<div class=\\"ajTcRow"+(dn?" dn":"")+"\\" data-td=\\""+E(r.id)+"\\" data-st=\\""+(dn?"done":"open")+"\\">"',
'     +"<span>"+(dn?"\\u2713":"\\u25CB")+"</span><div class=\\"m\\"><div class=\\"t\\">"+E(r.label)+"</div>"',
'     +(r.due?"<div class=\\"sub\\">due "+E(r.due)+"</div>":"")+"</div>"',
'     +"<span class=\\"x\\" data-tdx=\\""+E(r.id)+"\\">\\u2715</span></div>";',
'  });',
'  h+="<div class=\\"ajTcAdd\\" id=\\"ajTcAdd\\">\\uFF0B Add to-do\\u2026</div>";',
'  pTodo.innerHTML=h;',
'}',
'function drawTix(){',
'  var h="<h2 style=\\"margin:6px 0 4px\\">\\uD83C\\uDFAB Tickets & paper</h2>";',
'  if(!TK.length) h+="<div class=\\"sub\\" style=\\"padding:8px 4px\\">No flights or documents on this trip yet.</div>";',
'  TK.forEach(function(r,i){',
'    h+="<div class=\\"ajTcRow\\" data-tk=\\""+i+"\\"><span>"+r.ic+"</span><div class=\\"m\\"><div class=\\"t\\">"+E(r.t)+"</div>"',
'     +"<div class=\\"sub\\">"+E(r.sub)+(r.doc?"":" \\u00B7 no document on file")+"</div></div><span style=\\"color:#c5ced4\\">\\u203A</span></div>";',
'  });',
'  pTix.innerHTML=h;',
'}',
'pTodo.addEventListener("click",function(ev){',
'  var x=ev.target.closest("[data-tdx]"); if(x){ ev.stopPropagation(); up({ajTc:"todoDel",id:x.getAttribute("data-tdx")}); return; }',
'  if(ev.target.closest("#ajTcAdd")){ up({ajTc:"todoAdd"}); return; }',
'  var r=ev.target.closest("[data-td]"); if(r) up({ajTc:"todoToggle",id:r.getAttribute("data-td"),st:r.getAttribute("data-st")});',
'});',
'pTix.addEventListener("click",function(ev){',
'  var r=ev.target.closest("[data-tk]"); if(!r) return;',
'  var k=TK[+r.getAttribute("data-tk")]; if(!k) return;',
'  if(k.doc) up({ajTc:"openDoc",id:k.doc}); else up({ajTc:"noDoc",conf:k.conf});',
'});',
'window.addEventListener("message",function(ev){',
'  var m=ev&&ev.data; if(!m||!m.ajTc) return;',
'  if(m.ajTc==="todos"){ TD=m.rows||[]; drawTodo(); }',
'  else if(m.ajTc==="tickets"){ TK=m.rows||[]; drawTix(); }',
'});',
'drawTodo(); drawTix();',
'up({ajTc:"ready"});',
'});',
'})();',
'<'+'/script>'
].join('\n');

/* ---------- viewNote wrapper: inject Card Tabs into the story iframe at view time ---------- */
var _vn=window.viewNote;
function ajTcCompose(b){
  /* v224: compose stored body + INJ; return null unless provably sound */
  try{
    if(typeof INJ!=='string'||INJ.indexOf('id="ajTcCss"')<0||INJ.indexOf('id="ajTcJs"')<0||INJ.indexOf('<'+'/script>')<0) return null;
    var i=b.lastIndexOf('</bo'+'dy>');
    var out=(i>=0)?(b.slice(0,i)+'\n'+INJ+'\n'+b.slice(i)):(b+'\n'+INJ);
    /* HARD FAIL-SAFE: the full original body must survive verbatim around the insertion */
    if(i>=0){ if(out.slice(0,i)!==b.slice(0,i)||out.slice(out.length-(b.length-i))!==b.slice(i)) return null; }
    else if(out.slice(0,b.length)!==b) return null;
    return out;
  }catch(e){ return null; }
}
window.viewNote=function(id){
  /* v225 ROOT-CAUSE FIX (tripcard-fix-v225): v224's deferred THIRD srcdoc write re-navigated
     #noteFrame after the sheet was already interactive; Chrome kept painting the new document
     (tabs visible) but input routing stayed on the dead prior srcdoc frame — every click inside
     the Trip Card was inert (injected tabs, native tabs, even Leaflet zoom). Fix: never rewrite
     srcdoc at all. Pre-compose stored body + INJ (+ __ajBoot via __ajInjectBoot) and swap it in
     as n.body only for the duration of the base viewNote call, so the fresh iframe gets exactly
     ONE srcdoc navigation with everything already inside (patchFrame then no-ops on the
     __ajBooted marker). The stored note HTML is never modified. */
  try{
    if(on()){
      var n=((typeof D!=='undefined'&&D&&D.notes)||[]).find(function(x){ return x.id===id; });
      if(n&&n.trip_id){
        var b=String(n.body||'');
        if(/<\s*(!doctype|html|script|iframe|div|style|table|svg)\b/i.test(b)){
          var composed=ajTcCompose(b);
          if(composed!==null){
            var full=composed;
            try{ if(typeof window.__ajInjectBoot==='function'){ var fb=window.__ajInjectBoot(composed); if(typeof fb==='string'&&fb.indexOf('id="ajTcJs"')>=0) full=fb; } }catch(eB){}
            curTrip=n.trip_id;
            var out2, orig=n.body;
            n.body=full;
            try{ out2=_vn?_vn.apply(this,arguments):undefined; }
            finally{ n.body=orig; }
            try{ var f=document.getElementById('noteFrame'); if(f){ curFrame=f; f.__ajDone=1; } }catch(eF){}
            return out2;
          }
        }
      }
    }
  }catch(e){}
  return _vn?_vn.apply(this,arguments):undefined;
};

/* ---------- openTrip wrapper: the story page IS the Trip Card ---------- */
var _ot=window.openTrip;
window.openTrip=function(id){
  if(!on()){ return _ot?_ot(id):undefined; }
  try{
    var pn=storyNote(id);
    if(pn){ return window.viewNote(pn.id); }
    console.info('AJ-TRIPCARD-20260824: no story page for trip '+id+' — falling back to v218 tv view');
  }catch(e){}
  return _ot?_ot(id):undefined;   /* dormant fallback only; tv/classic otherwise unreachable */
};
window.openTrip.__noteFirst=true;  /* stops spine.js hookTripToNote re-wrapping with its classic fallback */
})();
