/* ================= A+J Hub — trips & info client (v2 refocus) ================= */
const CFG = window.AJ_CONFIG;
const sb = supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_KEY, {
  auth:{ persistSession:true, autoRefreshToken:true, detectSessionInUrl:true }
});
const TABLES = ['settings','trips','flights','trip_items','vault_categories','vault_items','contacts','deadlines','links','events','notes','f1_meta'];
let D = {}; TABLES.forEach(t=>D[t]=[]);
let USER=null, cacheKey='aj_cache';
let queue = JSON.parse(localStorage.getItem('aj_queue')||'[]');

/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const el = id => document.getElementById(id);
const esc = s => (s==null?'':String(s)).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const linkify = s => esc(s).replace(/(https?:\/\/[^\s]+)/g,'<a target="_blank" rel="noopener" href="$1">$1 ↗</a>').replace(/([\w.\-]+@[\w.\-]+\.[a-z]{2,})/gi,'<a href="mailto:$1">$1</a>');
const uid = () => (crypto.randomUUID?crypto.randomUUID():'x'+Date.now()+Math.random().toString(36).slice(2));
function toast(m){const t=el('toast');t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),1900);}
function today(){const d=new Date();return new Date(d.getFullYear(),d.getMonth(),d.getDate());}
function parseD(s){if(!s)return null;const p=String(s).slice(0,10).split('-');return new Date(+p[0],+p[1]-1,+p[2]);}
function daysTo(s){const d=parseD(s);if(!d)return null;return Math.round((d-today())/864e5);}
function iso(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function fmtD(s){const d=parseD(s);return d?d.toLocaleDateString(undefined,{weekday:'short',day:'numeric',month:'short',year:'numeric'}):'';}
function fmtShort(s){const d=parseD(s);return d?d.toLocaleDateString(undefined,{day:'numeric',month:'short'}):'';}
const DB_ROOT="https://www.dropbox.com/home";
const drop = p => DB_ROOT+"/"+String(p).replace(/^\/+/,'').split('/').map(encodeURIComponent).join('/');
function openDrop(p){window.open(drop(p),'_blank');}
function copy(txt){
  const fb=function(){try{const ta=document.createElement('textarea');ta.value=txt;ta.style.cssText='position:fixed;left:-9999px;top:0';document.body.appendChild(ta);ta.focus();ta.select();const ok=document.execCommand('copy');document.body.removeChild(ta);toast(ok?'Copied':'Copy blocked — long-press the text instead');}catch(e){toast('Copy blocked — long-press the text instead');}};
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(function(){toast('Copied');},fb);}else fb();
}
function gcal(title,dateStr,details,loc){
  const d=(dateStr||'').replace(/-/g,'');const nx=parseD(dateStr);let end=d;
  if(nx){const n=new Date(nx.getTime()+864e5);end=iso(n).replace(/-/g,'');}
  const q=new URLSearchParams({action:'TEMPLATE',text:title||'',dates:`${d}/${end}`,details:details||'',location:loc||''});
  return 'https://calendar.google.com/calendar/render?'+q.toString();
}

/* ---------- sync ---------- */
function setSync(){const dot=el('syncDot');const on=navigator.onLine;dot.className='dot '+(on?(queue.length?'off':'on'):'off');
  el('brandSub').textContent = navigator.onLine?(queue.length?`Syncing ${queue.length}…`:(D.settings[0]?.brand_sub||'Trips & Info')):'Offline · cached';}
window.addEventListener('online',()=>{setSync();flush();});
window.addEventListener('offline',setSync);
function cacheSave(){localStorage.setItem(cacheKey,JSON.stringify(D));}
function cacheLoad(){try{const c=JSON.parse(localStorage.getItem(cacheKey));if(c){D=c;return true;}}catch(e){}return false;}
async function loadData(){
  try{
    const res = await Promise.all(TABLES.map(t=>sb.from(t).select('*')));
    res.forEach((r,i)=>{ if(!r.error && r.data) D[TABLES[i]]=r.data; }); splitArchived();
    cacheSave();
  }catch(e){ cacheLoad(); }
}
function qadd(op){queue.push(op);localStorage.setItem('aj_queue',JSON.stringify(queue));setSync();}
async function flush(){
  if(!navigator.onLine||!queue.length)return;
  const pending=[...queue];
  for(const op of pending){
    try{
      if(op.type==='upsert') await sb.from(op.table).upsert(op.row);
      else if(op.type==='delete') await sb.from(op.table).delete().eq('id',op.id);
      queue=queue.filter(x=>x!==op);
    }catch(e){ break; }
  }
  localStorage.setItem('aj_queue',JSON.stringify(queue));setSync();
}
async function put(table,row){
  if(!row.id) row.id=uid();
  const arr=D[table];const i=arr.findIndex(x=>x.id===row.id);
  if(i>=0) arr[i]={...arr[i],...row}; else arr.push(row);
  cacheSave();
  const clean={...row}; if(clean.owner===undefined && USER) clean.owner=USER.id;
  try{ const {error}=await sb.from(table).upsert(clean); if(error) throw error; }
  catch(e){ qadd({type:'upsert',table,row:clean}); }
  setSync();
  return row.id;
}
async function del(table,id){
  D[table]=D[table].filter(x=>x.id!==id);cacheSave();
  try{ const {error}=await sb.from(table).delete().eq('id',id); if(error) throw error; }
  catch(e){ qadd({type:'delete',table,id}); }
  setSync();
}

/* ---------- auth ---------- */
function initAuth(){
  el('au_btn').onclick=doAuth;
  el('au_pass').addEventListener('keydown',e=>{if(e.key==='Enter')doAuth();});
}
async function doAuth(){
  const email=el('au_email').value.trim().toLowerCase(), pass=el('au_pass').value;
  if(!email||!pass){el('au_err').textContent='Enter email and password';return;}
  el('au_btn').textContent='…';el('au_err').textContent='';
  try{
    const res=await sb.auth.signInWithPassword({email,password:pass});
    if(res.error) throw res.error;
    await onLogin(res.data.user||res.data.session.user);
  }catch(e){ el('au_err').textContent=e.message||'Sign-in failed'; el('au_btn').textContent='Sign in'; }
}
async function onLogin(user){
  USER=user; cacheKey='aj_cache_'+user.id;
  el('auth').classList.add('hide'); el('shell').classList.remove('hide');
  cacheLoad(); render();
  await loadData(); flush(); setSync(); render();
}

/* ---------- nav ---------- */
let cur='home';
let popNav=false;
function go(v){
  if(!popNav){
    if(v==='home'){ if(history.state&&history.state.tab){ history.back(); return; } }
    else if(history.state&&history.state.tab){ history.replaceState({tab:v},''); }
    else { history.pushState({tab:v},''); }
  }
  cur=v;document.querySelectorAll('.view').forEach(e=>e.classList.remove('active'));el('v-'+v).classList.add('active');
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.v===v));
  el('fab').classList.toggle('hide',!(v==='home'||v==='info'));window.scrollTo(0,0);render();}
window.addEventListener('popstate',()=>{
  if(el('scrim').classList.contains('show')){ hideSheet(); return; }
  popNav=true; go('home'); popNav=false;
});
function render(){({home:rHome,info:rInfo,more:rMore,flights:rFlights}[cur]||rHome)();}

/* ================= HOME — trips & search ================= */
let homeQuery='';
let tripFilter='all';
function tripsSorted(){return [...D.trips].sort((a,b)=>(a.start_date||'9999').localeCompare(b.start_date||'9999'));}
function nextTrip(){const t=today();return tripsSorted().find(x=>x.start_date&&parseD(x.end_date||x.start_date)>=t);}
function tripText(t){const fls=D.flights.filter(f=>f.trip_id===t.id);const its=D.trip_items.filter(i=>i.trip_id===t.id);let s=[t.title,t.dest,[fmtD(t.start_date),(t.end_date&&t.end_date!==t.start_date?'— '+fmtD(t.end_date):'')].filter(Boolean).join(' ')].filter(Boolean).join(' · ');if(fls.length)s+='\n\nFlights:\n'+fls.map(f=>flightText(f)).join('\n');if(its.length)s+='\n\n'+its.map(i=>itemText(i)).join('\n');if(t.notes)s+='\n\n'+t.notes;return s;}
function tripActions(tid){const t=D.trips.find(x=>x.id===tid);if(!t)return;openSheet(`<h3>${esc(t.title)}</h3><div class="mini" style="margin-bottom:12px">${esc(t.dest||'')}${t.start_date?' · '+fmtD(t.start_date):''}${t.end_date&&t.end_date!==t.start_date?' — '+fmtShort(t.end_date):''}</div><button class="btn primary block" onclick="openTrip('${t.id}')">📂 Open trip</button><button class="btn ghost block" style="margin-top:8px" onclick="copy(${JSON.stringify(tripText(t)).replace(/"/g,'&quot;')})">📋 Copy all</button><button class="btn ghost block" style="margin-top:8px" onclick="editTrip('${t.id}')">✏️ Edit</button><button class="btn ghost block" style="margin-top:8px" onclick="delTrip('${t.id}')">🗑 Delete</button>`);}

function flightLine(f,withCopy){
  return `<div class="flight-line"><span class="code">${esc(f.from_code||'?')}</span><span class="arrow">→</span><span class="code">${esc(f.to_code||'?')}</span>
    <span class="mini">${[fmtShort(f.fdate),f.ftime,f.airline,f.flight_no,f.pax].filter(Boolean).join(' · ')}</span>
    ${withCopy&&f.conf?`<button class="copybtn" onclick="event.stopPropagation();copy('${esc(f.conf).replace(/'/g,"\\'")}')">${esc(f.conf)} ⧉</button>`:''}</div>`;
}
const KINDS=[['hotel','🏨','Stay'],['ticket','🎟️','Ticket'],['transport','🚗','Transport'],['activity','🗺️','Activity'],['note','📝','Note']];
function kindMeta(k){return KINDS.find(x=>x[0]===k)||KINDS[4];}
function itemLine(it){
  const km=kindMeta(it.kind);
  return `<div class="it-line"><span class="it-ic">${km[1]}</span><div class="it-main"><b>${esc(it.title||km[2])}</b>
    <span class="mini">${[fmtShort(it.idate),it.itime].filter(Boolean).join(' · ')}${it.address?' · '+esc(it.address):''}</span></div>
    ${it.ref?`<button class="copybtn" onclick="event.stopPropagation();copy('${esc(it.ref).replace(/'/g,"\\'")}')">${esc(it.ref)} ⧉</button>`:''}</div>`;
}

function rHome(){
  let h=`<div class="searchbar"><span class="ic">🔍</span><input id="homeSearch" placeholder="Search anything — passport, booking ref, hotel…" value="${esc(homeQuery)}" oninput="homeQuery=this.value;homeResultsOnly()"><span class="ic" style="cursor:pointer" onclick="homeQuery='';rHome()">✕</span></div>`;
  const q=homeQuery.trim().toLowerCase();
  h+=`<div id="homeResults">${q?searchResults(q):''}</div><div id="homeMain"${q?' style="display:none"':''}>`;
  h+=`<div class="chips">${[['all','All'],['personal','Personal'],['business','Business']].map(c=>`<button class="chip ${tripFilter===c[0]?'on':''}" onclick="tripFilter='${c[0]}';homePage=0;rHome()">${c[1]}</button>`).join('')}</div>`;
  h+=`<div id="homePager"></div>`;
  h+=calendarHTML();
  const t0=today();
  const past=tripsSorted().filter(x=>x.start_date&&(tripFilter==='all'||((x.category||'personal')===tripFilter))&&parseD(x.end_date||x.start_date)<t0).reverse();
  if(past.length){ h+=`<div class="sect">Past</div><div class="card">`; past.forEach(x=>{ h+=`<div class="list-item" onclick="tripActions('${x.id}')"><div class="li-main"><div class="h">${esc(x.title)}</div><div class="sub">${fmtD(x.start_date)}</div></div><div class="chev">›</div></div>`; }); h+=`</div>`; }
  h+=`</div>`;
  el('v-home').innerHTML=h;
  if(window.renderHomePager) window.renderHomePager();
  if(window.loadHomeDocs) window.loadHomeDocs(); else if(typeof loadHomeDocs==='function') loadHomeDocs();
}
function homeResultsOnly(){
  const q=homeQuery.trim().toLowerCase();
  const box=document.getElementById('homeResults');
  if(!box){rHome();return;}
  box.innerHTML=q?searchResults(q):'';
  const m=document.getElementById('homeMain'); if(m) m.style.display=q?'none':'';
  const d=document.getElementById('dashRow'); if(d) d.style.display=q?'none':'';
}
function qmatch(hay,q){const h=String(hay).toLowerCase();return q.toLowerCase().split(/\s+/).filter(Boolean).every(t=>h.includes(t));}
function searchResults(q){
  let h='';
  const vhits=D.vault_items.filter(it=>qmatch(it.title+' '+(it.body||''),q));
  const thits=D.trips.filter(t=>qmatch([t.title,t.dest,t.notes,t.resv,t.town_info].join(' '),q));
  const fhits=D.flights.filter(f=>qmatch([f.from_code,f.to_code,f.airline,f.flight_no,f.conf].join(' '),q));
  const ihits=D.trip_items.filter(i=>qmatch([i.title,i.ref,i.address,i.notes].join(' '),q));
  const total=vhits.length+thits.length+fhits.length+ihits.length;
  h+=`<div class="sect">${total} result${total!==1?'s':''}</div>`;
  if(vhits.length){h+=`<div class="card">`+vhits.map(infoRow).join('')+`</div>`;}
  if(thits.length){h+=`<div class="card">`+thits.map(t=>`<div class="list-item" onclick="openTrip('${t.id}')"><div class="li-main"><div class="h">✈️ ${esc(t.title)}</div><div class="sub">${fmtD(t.start_date)}</div></div><div class="chev">›</div></div>`).join('')+`</div>`;}
  if(fhits.length){h+=`<div class="card">`+fhits.map(f=>`<div class="list-item" onclick="openTrip('${f.trip_id}')"><div class="li-main"><div class="h">${esc(f.from_code)}→${esc(f.to_code)} ${esc(f.airline||'')}</div><div class="sub">${fmtD(f.fdate)}${f.conf?' · '+esc(f.conf):''}</div></div>${f.conf?`<button class="copybtn" onclick="event.stopPropagation();copy('${esc(f.conf).replace(/'/g,"\\'")}')">⧉</button>`:''}</div>`).join('')+`</div>`;}
  if(ihits.length){h+=`<div class="card">`+ihits.map(i=>`<div class="list-item" onclick="openTrip('${i.trip_id}')"><div class="li-main"><div class="h">${kindMeta(i.kind)[1]} ${esc(i.title||'')}</div><div class="sub">${fmtD(i.idate)}${i.ref?' · '+esc(i.ref):''}</div></div>${i.ref?`<button class="copybtn" onclick="event.stopPropagation();copy('${esc(i.ref).replace(/'/g,"\\'")}')">⧉</button>`:''}</div>`).join('')+`</div>`;}
  if(!total)h+=`<div class="card"><div class="mini">Nothing found for “${esc(homeQuery)}”.</div></div>`;
  return h;
}

let calRef=null;
function calendarHTML(){
  const base=calRef||today(); const y=base.getFullYear(),m=base.getMonth();
  const first=new Date(y,m,1), start=new Date(first); start.setDate(1-((first.getDay()+6)%7));
  const evByDay={};
  const mark=(ds,cls,txt)=>{if(!ds)return;const k=String(ds).slice(0,10);(evByDay[k]=evByDay[k]||[]).push({c:cls,t:txt||''});};
  D.trips.forEach(t=>{if(!t.start_date)return;let a=parseD(t.start_date),b=parseD(t.end_date||t.start_date);for(let d=new Date(a);d<=b;d.setDate(d.getDate()+1))mark(iso(d),'trip',t.title);});
  D.flights.forEach(f=>mark(f.fdate,'ev',(f.from_code||'')+'→'+(f.to_code||'')));
  D.trip_items.forEach(i=>mark(i.idate,'ev',i.title||kindMeta(i.kind)[2]));
  (D.events||[]).forEach(ev=>mark(ev.edate,'ev',(ev.icon?ev.icon+' ':'')+ev.title));
  const dow=['M','T','W','T','F','S','S'];
  let g=`<div class="cal"><div class="cal-head"><button class="cal-nav" onclick="calMove(-1)">‹</button><b>${base.toLocaleDateString(undefined,{month:'long',year:'numeric'})}</b><button class="cal-nav" onclick="calMove(1)">›</button></div><div class="cal-grid">`;
  dow.forEach(d=>g+=`<div class="cal-dow">${d}</div>`);
  const tk=iso(today());
  for(let i=0;i<42;i++){const d=new Date(start);d.setDate(start.getDate()+i);const k=iso(d);const dim=d.getMonth()!==m?'dim':'';const isT=k===tk?'today':'';
    const evs=evByDay[k]||[];
    const lab=evs.slice(0,2).map(e=>`<span class="cl ${e.c}">${esc(e.t)}</span>`).join('')+(evs.length>2?`<span class="cl more">+${evs.length-2} more</span>`:'');
    g+=`<div class="cal-cell ${dim} ${isT}" style="cursor:pointer" onclick="window.openDay&&openDay('${k}')"><span class="cd">${d.getDate()}</span>${lab?`<div class="cl-wrap">${lab}</div>`:''}</div>`;}
  g+=`</div></div>`;return g;
}
function calMove(n){const b=calRef||today();calRef=new Date(b.getFullYear(),b.getMonth()+n,1);rHome();}

/* ================= TRIP detail / edit ================= */
function openTrip(id){
  const t=D.trips.find(x=>x.id===id);if(!t)return;
  const fls=D.flights.filter(f=>f.trip_id===id).sort((a,b)=>(a.fdate||'').localeCompare(b.fdate||''));
  const items=D.trip_items.filter(i=>i.trip_id===id).sort((a,b)=>(a.idate||'').localeCompare(b.idate||''));
  const flH=fls.length?fls.map(f=>`<div class="subbox">${flightLine(f,true)}
     ${f.notes?`<div class="mini" style="margin-top:6px">${esc(f.notes)}</div>`:''}
     <button class="btn ghost sm" style="margin-top:8px" onclick="editFlight('${id}','${f.id}')">Edit</button></div>`).join(''):`<div class="mini">No flights yet.</div>`;
  const itH=items.length?items.map(it=>`<div class="subbox">${itemLine(it)}
      ${it.notes?`<div class="note-txt" style="margin-top:6px">${linkify(it.notes)}</div>`:''}
      <div class="btn-row" style="margin-top:8px">${it.url?`<a class="btn ghost sm" target="_blank" href="${esc(it.url)}">Open link</a>`:''}<button class="btn ghost sm" onclick="editItem('${id}','${it.id}')">Edit</button></div></div>`).join(''):`<div class="mini">No stays, tickets or activities yet.</div>`;
  openSheet(`<h3>${esc(t.title)}</h3><div class="mini">${esc(t.dest||'')} · ${t.start_date?fmtD(t.start_date):''}${t.end_date&&t.end_date!==t.start_date?' — '+fmtD(t.end_date):''}</div>
    <div class="divider"></div><label class="f">Flights</label>${flH}<button class="btn ghost sm" style="margin-top:8px" onclick="editFlight('${id}')">+ Add flight</button>${archFlightsHTML(id)}
    <label class="f" style="margin-top:16px">Stays · tickets · activities</label>${itH}<button class="btn ghost sm" style="margin-top:8px" onclick="editItem('${id}')">+ Add item</button>
    ${t.resv?`<label class="f">Reservations</label><div class="note-txt">${linkify(t.resv)}</div>`:''}
    ${t.weather_note?`<label class="f">Weather</label><div class="note-txt">${esc(t.weather_note)}</div>`:''}
    ${t.town_info?`<label class="f">About the destination</label><div class="note-txt">${linkify(t.town_info)}</div>`:''}
    ${t.notes?`<label class="f">Notes</label><div class="note-txt">${linkify(t.notes)}</div>`:''}
    <div class="divider"></div><div class="btn-row">
      <a class="btn ghost" target="_blank" href="${gcal(t.title,t.start_date,(t.notes||''),t.dest)}">📅 Add to Calendar</a></div>
    <div class="btn-row" style="margin-top:10px"><button class="btn ghost sm" onclick="editTrip('${id}')">✏️ Edit trip</button><button class="btn ghost sm" onclick="delTrip('${id}')">🗑 Delete</button></div>`);
}
function editTrip(id){
  const t=id?D.trips.find(x=>x.id===id):{};
  openSheet(`<h3>${id?'Edit trip':'New trip'}</h3>
    <label class="f">Title</label><input id="e_title" value="${esc(t.title)}" placeholder="e.g. Bangkok — JJ Hospital">
    <label class="f">Destination</label><input id="e_dest" value="${esc(t.dest)}">
    <label class="f">Type</label><select id="e_cat"><option value="personal" ${(t.category||'personal')!=='business'?'selected':''}>Personal</option><option value="business" ${t.category==='business'?'selected':''}>Business</option></select>
    <div class="two"><div><label class="f">Start</label><input id="e_start" type="date" value="${t.start_date||''}"></div><div><label class="f">End</label><input id="e_end" type="date" value="${t.end_date||''}"></div></div>
    <label class="f">Reservations</label><textarea id="e_resv" placeholder="Hotels, cars, appts…">${esc(t.resv)}</textarea>
    <label class="f">About the destination</label><textarea id="e_town" placeholder="The town is…">${esc(t.town_info)}</textarea>
    <label class="f">Weather note</label><input id="e_weather" value="${esc(t.weather_note)}">
    <label class="f">Notes</label><textarea id="e_notes">${esc(t.notes)}</textarea>
    <button class="btn primary block" style="margin-top:16px" onclick="saveTrip('${id||''}')">Save trip</button>`);
}
async function saveTrip(id){
  const row={id:id||undefined,title:el('e_title').value.trim()||'Untitled trip',dest:el('e_dest').value.trim(),category:el('e_cat').value,start_date:el('e_start').value||null,end_date:el('e_end').value||null,
    resv:el('e_resv').value.trim(),town_info:el('e_town').value.trim(),weather_note:el('e_weather').value.trim(),notes:el('e_notes').value.trim()};
  await put('trips',row);closeSheet();toast('Trip saved');render();
}
async function delTrip(id){if(!confirm('Delete this trip and its items?'))return;
  D.flights.filter(f=>f.trip_id===id).forEach(f=>del('flights',f.id));
  D.trip_items.filter(i=>i.trip_id===id).forEach(i=>del('trip_items',i.id));
  await del('trips',id);closeSheet();toast('Deleted');go('home');}
function editFlight(tid,fid){
  const f=fid?D.flights.find(x=>x.id===fid):{};
  openSheet(`<h3>${fid?'Edit flight':'Add flight'}</h3>
    <div class="two"><div><label class="f">From</label><input id="f_from" value="${esc(f.from_code)}" placeholder="USM"></div><div><label class="f">To</label><input id="f_to" value="${esc(f.to_code)}" placeholder="BKK"></div></div>
    <div class="two"><div><label class="f">Date</label><input id="f_date" type="date" value="${f.fdate||''}"></div><div><label class="f">Time</label><input id="f_time" value="${esc(f.ftime)}" placeholder="14:30"></div></div>
    <div class="two"><div><label class="f">Airline</label><input id="f_air" value="${esc(f.airline)}" placeholder="Bangkok Airways"></div><div><label class="f">Flight #</label><input id="f_no" value="${esc(f.flight_no)}" placeholder="PG172"></div></div>
    <label class="f">Booking ref</label><input id="f_conf" value="${esc(f.conf)}">
    <label class="f">Notes</label><textarea id="f_notes">${esc(f.notes)}</textarea>
    <button class="btn primary block" style="margin-top:16px" onclick="saveFlight('${tid}','${fid||''}')">Save</button>
    ${fid?`<button class="btn ghost block" style="margin-top:8px" onclick="archiveFlight('${tid}','${fid}')">📥 Archive (moved / cancelled)</button>`:''}${fid?`<button class="btn ghost block" style="margin-top:8px" onclick="delFlight('${tid}','${fid}')">Delete flight</button>`:''}`);
}
async function saveFlight(tid,fid){await put('flights',{id:fid||undefined,trip_id:tid,from_code:el('f_from').value.trim(),to_code:el('f_to').value.trim(),fdate:el('f_date').value||null,ftime:el('f_time').value.trim(),airline:el('f_air').value.trim(),flight_no:el('f_no').value.trim(),conf:el('f_conf').value.trim(),notes:el('f_notes').value.trim()});closeSheet();openTrip(tid);}
async function delFlight(tid,fid){await del('flights',fid);closeSheet();openTrip(tid);}
function splitArchived(){const all=D.flights||[];D.flights=all.filter(f=>!f.archived);D.flights_archived=all.filter(f=>f.archived);}
async function archiveFlight(tid,fid){const f=(D.flights||[]).find(x=>x.id===fid);if(!f){toast('Flight not found');return;}f.archived=true;D.flights=D.flights.filter(x=>x.id!==fid);(D.flights_archived=D.flights_archived||[]).push(f);cacheSave();try{const r=await sb.from('flights').update({archived:true}).eq('id',fid);if(r.error)throw r.error;}catch(e){qadd({type:'upsert',table:'flights',row:{...f}});}setSync();closeSheet();if(tid)openTrip(tid);toast('Flight archived');}
async function unarchiveFlight(tid,fid){const arr=D.flights_archived||[];const f=arr.find(x=>x.id===fid);if(!f)return;f.archived=false;D.flights_archived=arr.filter(x=>x.id!==fid);D.flights.push(f);cacheSave();try{const r=await sb.from('flights').update({archived:false}).eq('id',fid);if(r.error)throw r.error;}catch(e){qadd({type:'upsert',table:'flights',row:{...f}});}setSync();closeSheet();if(tid)openTrip(tid);else render();toast('Flight restored');}
function archFlightsHTML(id){const a=(D.flights_archived||[]).filter(f=>f.trip_id===id);if(!a.length)return '';return '<div class="mini" style="margin-top:12px;color:var(--muted2)">Archived flights</div>'+a.map(f=>`<div class="subbox" style="opacity:.55">${flightLine(f,false)}<button class="btn ghost sm" style="margin-top:8px" onclick="unarchiveFlight('${id}','${f.id}')">↩ Restore</button></div>`).join('');}
function editItem(tid,iid){
  const it=iid?D.trip_items.find(x=>x.id===iid):{kind:'hotel'};
  openSheet(`<h3>${iid?'Edit item':'Add item'}</h3>
    <label class="f">Type</label><select id="i_kind">${KINDS.map(k=>`<option value="${k[0]}" ${it.kind===k[0]?'selected':''}>${k[1]} ${k[2]}</option>`).join('')}</select>
    <label class="f">Title</label><input id="i_title" value="${esc(it.title)}" placeholder="e.g. Riva Surya Hotel / River cruise">
    <div class="two"><div><label class="f">Date</label><input id="i_date" type="date" value="${it.idate||''}"></div><div><label class="f">Time</label><input id="i_time" value="${esc(it.itime)}"></div></div>
    <label class="f">Booking ref</label><input id="i_ref" value="${esc(it.ref)}">
    <label class="f">Address</label><input id="i_addr" value="${esc(it.address)}">
    <label class="f">Link</label><input id="i_url" value="${esc(it.url)}" placeholder="https://…">
    <label class="f">Notes</label><textarea id="i_notes">${esc(it.notes)}</textarea>
    <button class="btn primary block" style="margin-top:16px" onclick="saveItem('${tid}','${iid||''}')">Save</button>
    ${iid?`<button class="btn ghost block" style="margin-top:8px" onclick="delItem('${tid}','${iid}')">Delete</button>`:''}`);
}
async function saveItem(tid,iid){await put('trip_items',{id:iid||undefined,trip_id:tid,kind:el('i_kind').value,title:el('i_title').value.trim(),idate:el('i_date').value||null,itime:el('i_time').value.trim(),ref:el('i_ref').value.trim(),address:el('i_addr').value.trim(),url:el('i_url').value.trim(),notes:el('i_notes').value.trim()});closeSheet();openTrip(tid);}
async function delItem(tid,iid){await del('trip_items',iid);closeSheet();openTrip(tid);}
function mdInline(s){s=String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');s=s.replace(/`([^`]+)`/g,'<code>$1</code>');s=s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');s=s.replace(/(^|[^*])\*([^*]+)\*/g,'$1<em>$2</em>');s=s.replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');s=s.replace(/(^|[\s(])((https?:\/\/)[^\s)]+)/g,'$1<a href="$2" target="_blank" rel="noopener">$2</a>');return s;}
function mdToHtml(src){const lines=String(src||'').replace(/\r/g,'').split('\n');let out='',i=0;while(i<lines.length){let ln=lines[i];if(/^\s*$/.test(ln)){i++;continue;}let m=ln.match(/^(#{1,4})\s+(.*)$/);if(m){const lvl=m[1].length;out+='<h'+lvl+'>'+mdInline(m[2])+'</h'+lvl+'>';i++;continue;}if(/^\s*---+\s*$/.test(ln)){out+='<hr>';i++;continue;}if(/\|/.test(ln)&&i+1<lines.length&&/-/.test(lines[i+1])&&/^\s*\|?[\s:|-]*\|[\s:|-]*$/.test(lines[i+1])){const header=ln.split('|').map(c=>c.trim());if(header.length&&header[0]==='')header.shift();if(header.length&&header[header.length-1]==='')header.pop();i+=2;let rows=[];while(i<lines.length&&/\|/.test(lines[i])&&!/^\s*$/.test(lines[i])){const cells=lines[i].split('|').map(c=>c.trim());if(cells.length&&cells[0]==='')cells.shift();if(cells.length&&cells[cells.length-1]==='')cells.pop();rows.push(cells);i++;}let t='<table><thead><tr>'+header.map(h=>'<th>'+mdInline(h)+'</th>').join('')+'</tr></thead><tbody>';rows.forEach(r=>{t+='<tr>'+r.map(c=>'<td>'+mdInline(c)+'</td>').join('')+'</tr>';});out+=t+'</tbody></table>';continue;}if(/^\s*[-*]\s+/.test(ln)){let items=[];while(i<lines.length&&/^\s*[-*]\s+/.test(lines[i])){items.push(lines[i].replace(/^\s*[-*]\s+/,''));i++;}out+='<ul>'+items.map(it=>'<li>'+mdInline(it)+'</li>').join('')+'</ul>';continue;}if(/^\s*\d+\.\s+/.test(ln)){let items=[];while(i<lines.length&&/^\s*\d+\.\s+/.test(lines[i])){items.push(lines[i].replace(/^\s*\d+\.\s+/,''));i++;}out+='<ol>'+items.map(it=>'<li>'+mdInline(it)+'</li>').join('')+'</ol>';continue;}let para=[ln];i++;while(i<lines.length&&!/^\s*$/.test(lines[i])&&!/^(#{1,4})\s/.test(lines[i])&&!/^\s*[-*]\s+/.test(lines[i])&&!/^\s*\d+\.\s+/.test(lines[i])&&!/^\s*---+\s*$/.test(lines[i])&&!/\|/.test(lines[i])){para.push(lines[i]);i++;}out+='<p>'+para.map(mdInline).join('<br>')+'</p>';}return out;}
function viewNote(id){const n=(D.notes||[]).find(x=>x.id===id);if(!n){openNotes();return;}const t=n.trip_id?D.trips.find(x=>x.id===n.trip_id):null;const _b=String(n.body||'');if(/<\s*(!doctype|html|script|iframe|div|style|table|svg)\b/i.test(_b)){openSheet('<h3>'+esc(n.title||'Note')+'</h3>'+(t?'<div class="mini" style="margin:-8px 0 10px">✈️ '+esc(t.title)+'</div>':'')+'<iframe id="noteFrame" sandbox="allow-scripts allow-popups" style="width:100%;height:72vh;border:1px solid var(--line);border-radius:12px;background:#fff"></iframe><button class="btn ghost block" style="margin-top:12px" onclick="editNote(\''+n.id+'\')">✏️ Edit</button>');var _f=document.getElementById('noteFrame');if(_f){_f.srcdoc=_b;if(!window.__ajNoteHListener){window.__ajNoteHListener=true;window.addEventListener('message',function(e){try{if(e&&e.data&&e.data.__ajNoteH){var fr=document.getElementById('noteFrame');if(fr){var h=Math.min(Math.max(e.data.__ajNoteH+24,300),24000);var cur=parseInt(fr.style.height,10)||0;if(Math.abs(h-cur)<16)return;fr.style.height=h+'px';void fr.offsetHeight;requestAnimationFrame(function(){fr.style.height=(h+1)+'px';requestAnimationFrame(function(){fr.style.height=h+'px';});});}}}catch(err){}});}}return;}const style='<style>.mdbody{font-size:15px;line-height:1.6;color:var(--ink2)}.mdbody h1{font-size:20px;color:var(--teal);margin:10px 0 4px}.mdbody h2{font-size:17px;color:var(--teal);margin:16px 0 4px}.mdbody h3{font-size:15px;margin:12px 0 3px}.mdbody p{margin:8px 0}.mdbody ul,.mdbody ol{margin:6px 0 6px 20px}.mdbody li{margin:3px 0}.mdbody a{color:var(--teal);font-weight:700;word-break:break-word}.mdbody table{border-collapse:collapse;width:100%;margin:8px 0;font-size:13.5px}.mdbody th{background:var(--teal);color:#fff;text-align:left;padding:5px 7px}.mdbody td{border-bottom:1px solid var(--line);padding:5px 7px;vertical-align:top}.mdbody hr{border:none;border-top:1px solid var(--line);margin:12px 0}.mdbody code{background:#f2efe9;padding:1px 5px;border-radius:4px;font-size:13px}</style>';openSheet(style+'<h3>'+esc(n.title||'Note')+'</h3>'+(t?'<div class="mini" style="margin:-8px 0 10px">✈️ '+esc(t.title)+'</div>':'')+'<div class="mdbody">'+mdToHtml(n.body)+'</div><button class="btn ghost block" style="margin-top:16px" onclick="editNote(\''+n.id+'\')">✏️ Edit</button>');}
function openNotes(){const ns=[...(D.notes||[])].sort((a,b)=>String(b.updated_at||'').localeCompare(String(a.updated_at||'')));let h=`<h3>Notes</h3>`;if(ns.length){h+='<div class="card">'+ns.map(n=>{const t=n.trip_id?D.trips.find(x=>x.id===n.trip_id):null;const first=(n.body||'').split('\n')[0];return `<div class="list-item" style="cursor:pointer" onclick="viewNote('${n.id}')"><div class="li-main"><div class="h">${esc(n.title||first||'Untitled')}</div><div class="sub">${t?'✈️ '+esc(t.title)+' · ':''}${esc(first).slice(0,60)}</div></div><div class="chev">›</div></div>`;}).join('')+'</div>';}else{h+='<div class="card"><div class="mini">No notes yet.</div></div>';}h+=`<button class="btn primary block" style="margin-top:8px" onclick="editNote('')">+ New note</button>`;openSheet(h);}
function editNote(id){const n=id?((D.notes||[]).find(x=>x.id===id)||{}):{};const isHtml=/^\s*(<!doctype|<html)/i.test(String(n.body||''));const ts=[...D.trips].sort((a,b)=>String(a.start_date||'9999').localeCompare(String(b.start_date||'9999')));const opts='<option value="">— No trip (general) —</option>'+ts.map(t=>`<option value="${t.id}" ${n.trip_id===t.id?'selected':''}>${esc(t.title)}</option>`).join('');
const segs=new Set(['Places','Research','Walks']);(D.notes||[]).forEach(x=>{const t=String(x.title||'');const i=t.indexOf('›');if(i>0)segs.add(t.slice(0,i).trim());});
const curTitle=String(n.title||'');const ci=curTitle.indexOf('›');const curCat=ci>0?curTitle.slice(0,ci).trim():'';const restTitle=ci>0?curTitle.slice(ci+1).trim():curTitle;
const catOpts='<option value="">— No category —</option>'+[...segs].sort().map(s=>`<option value="${esc(s)}" ${curCat===s?'selected':''}>${esc(s)}</option>`).join('')+'<option value="__new">+ New category…</option>';
openSheet(`<h3>${id?'Edit note':'New note'}</h3><label class="f">Category</label><select id="nt_cat" onchange="if(this.value==='__new'){var c=prompt('New category name');if(c){var o=document.createElement('option');o.value=c;o.text=c;this.add(o,this.options[this.options.length-1]);this.value=c;}else{this.value='';}}">${catOpts}</select><label class="f">Title</label><input id="nt_title" value="${esc(restTitle)}" placeholder="Note title"><label class="f">Attach to trip (optional)</label><select id="nt_trip">${opts}</select>${isHtml?`<label class="f">Page</label><div class="mini" style="margin:0 0 8px">This is a designed page — it is generated for you, so there is no code to edit. Change the title, category or trip above, or use ⟳ Rebuild from live bookings below to refresh the page itself.</div><iframe id="nt_preview" sandbox="allow-scripts allow-popups" style="width:100%;height:34vh;border:1px solid var(--line);border-radius:12px;background:#fff"></iframe>`:`<label class="f">Note</label><textarea id="nt_body" style="min-height:170px">${esc(n.body)}</textarea>`}<button class="btn primary block" style="margin-top:14px" onclick="saveNote('${id||''}')">Save</button>${id?`<button class="btn ghost block" style="margin-top:8px" onclick="delNote('${id}')">Delete</button>`:''}`);if(isHtml){var _pf=document.getElementById('nt_preview');if(_pf)_pf.srcdoc=String(n.body||'');}}
async function saveNote(id){let ttl=el('nt_title').value.trim();const catEl=el('nt_cat');const cat=catEl&&catEl.value&&catEl.value!=='__new'?catEl.value.trim():'';if(cat){ttl=cat+' › '+ttl;}const row={id:id||undefined,title:ttl,body:(function(){var e=el('nt_body');if(e)return e.value;var p=id?((D.notes||[]).find(x=>x.id===id)||{}):{};return p.body||'';})(),trip_id:el('nt_trip').value||null,updated_at:new Date().toISOString()};await put('notes',row);closeSheet();toast('Note saved');openNotes();}
async function delNote(id){await del('notes',id);closeSheet();toast('Deleted');openNotes();}
function flightText(f){return [`${f.from_code||'?'} → ${f.to_code||'?'}`,f.flight_no,[fmtD(f.fdate),f.ftime].filter(Boolean).join(' '),f.airline,f.pax,f.conf,f.notes].filter(Boolean).join(' · ');}
function itemText(it){return [it.title||kindMeta(it.kind)[2],[fmtD(it.idate),it.itime].filter(Boolean).join(' '),it.ref,it.address,it.notes].filter(Boolean).join(' · ');}
function flightActions(fid){const f=D.flights.find(x=>x.id===fid);if(!f)return;const t=D.trips.find(x=>x.id===f.trip_id);openSheet(`<h3>${esc(f.from_code||'?')} → ${esc(f.to_code||'?')} · ${esc(f.flight_no||'')}${f.pax?' · '+esc(f.pax):''}</h3><div class="note-txt" style="margin:6px 0 14px">${esc(flightText(f))}</div><button class="btn primary block" onclick="copy(${JSON.stringify(flightText(f)).replace(/"/g,'&quot;')})">📋 Copy all</button><button class="btn ghost block" style="margin-top:8px" onclick="editFlight('${f.trip_id}','${f.id}')">✏️ Edit</button><button class="btn ghost block" style="margin-top:8px" onclick="if(confirm('Delete this flight?'))delFlight('${f.trip_id}','${f.id}')">🗑 Delete</button>${t?`<button class="btn ghost block" style="margin-top:8px" onclick="openTrip('${f.trip_id}')">Open trip · ${esc(t.title)}</button>`:''}`);}
function itemActions(iid){const it=D.trip_items.find(x=>x.id===iid);if(!it)return;const t=D.trips.find(x=>x.id===it.trip_id);openSheet(`<h3>${esc(it.title||kindMeta(it.kind)[2])}</h3><div class="note-txt" style="margin:6px 0 14px">${esc(itemText(it))}</div><button class="btn primary block" onclick="copy(${JSON.stringify(itemText(it)).replace(/"/g,'&quot;')})">📋 Copy all</button><button class="btn ghost block" style="margin-top:8px" onclick="editItem('${it.trip_id}','${it.id}')">✏️ Edit</button><button class="btn ghost block" style="margin-top:8px" onclick="if(confirm('Delete this item?'))delItem('${it.trip_id}','${it.id}')">🗑 Delete</button>${t?`<button class="btn ghost block" style="margin-top:8px" onclick="openTrip('${it.trip_id}')">Open trip · ${esc(t.title)}</button>`:''}`);}

/* ================= INFO (vault) ================= */
let infoQuery='';
function rInfo(){
  const cats=[...D.vault_categories].sort((a,b)=>(a.sort||0)-(b.sort||0));
  let h=`<div class="searchbar"><span class="ic">🔍</span><input id="infoSearch" placeholder="Search passports, numbers, logins…" value="${esc(infoQuery)}" oninput="infoQuery=this.value;infoResultsOnly()"><span class="ic" style="cursor:pointer" onclick="infoQuery='';rInfo()">✕</span></div>`;
  const q=infoQuery.trim().toLowerCase();
  h+=`<div id="infoResults">${q?infoResultsHTML(q):''}</div><div id="infoMain"${q?' style="display:none"':''}>`;
  cats.forEach(g=>{const items=D.vault_items.filter(it=>it.category_id===g.id).sort((a,b)=>(a.sort||0)-(b.sort||0));
    if(!items.length)return;
    h+=`<div class="sect">${esc(g.name)}<span class="add" onclick="addInfo('${g.id}')">+ add</span></div><div class="card">`;
    h+=items.map(infoRow).join('');h+=`</div>`;});
  h+=`<button class="btn ghost block" onclick="addInfo()">+ Add info</button>
      <button class="btn ghost block" style="margin-top:8px" onclick="addCategory()">+ New category</button></div>`;
  el('v-info').innerHTML=h;
}
function infoResultsHTML(q){
  const hits=D.vault_items.filter(it=>qmatch(it.title+' '+(it.body||''),q));
  return `<div class="sect">${hits.length} result${hits.length!==1?'s':''}</div><div class="card">`+(hits.length?hits.map(infoRow).join(''):`<div class="mini">No matches.</div>`)+`</div>`;
}
function infoResultsOnly(){
  const q=infoQuery.trim().toLowerCase();
  const box=document.getElementById('infoResults');
  if(!box){rInfo();return;}
  box.innerHTML=q?infoResultsHTML(q):'';
  const m=document.getElementById('infoMain'); if(m) m.style.display=q?'none':'';
}
function infoRow(it){const first=(it.body||'').split('\n')[0];
  return `<div class="list-item"><div class="li-main" onclick="viewInfo('${it.id}')"><div class="h">${it.is_secret?'🔒 ':''}${esc(it.title)}</div><div class="sub">${esc(first).slice(0,60)||'—'}</div></div>
    <button class="copybtn" onclick="copy(${JSON.stringify((it.body||it.title)).replace(/"/g,'&quot;')})">⧉</button></div>`;
}
function lineVal(line){const i=line.indexOf(':');const v=(i>-1&&i<line.length-1)?line.slice(i+1):line;return v.trim();}
function viewInfo(id){const it=D.vault_items.find(x=>x.id===id);if(!it)return;
  const lines=(it.body||'').split('\n').filter(l=>l.trim());
  const body=lines.length?lines.map(l=>`<div class="kv-line"><span class="kv-text">${linkify(l)}</span><button class="copybtn" onclick="copy(${JSON.stringify(lineVal(l)).replace(/"/g,'&quot;')})">⧉</button></div>`).join(''):'—';
  openSheet(`<h3>${esc(it.title)}</h3>${body}
    <div class="btn-row" style="margin-top:18px"><button class="btn primary" onclick="copy(${JSON.stringify((it.body||'')).replace(/"/g,'&quot;')})">⧉ Copy all</button>
    <button class="btn ghost" onclick="editInfo('${id}')">✏️ Edit</button><button class="btn ghost" onclick="delInfo('${id}')">🗑</button></div>`);}
function addInfo(catId){
  const cats=D.vault_categories.map(g=>`<option value="${g.id}" ${g.id===catId?'selected':''}>${esc(g.name)}</option>`).join('');
  openSheet(`<h3>Add info</h3><label class="f">Category</label><select id="in_cat">${cats}</select>
    <label class="f">Title</label><input id="in_title" placeholder="e.g. Passport – Adrian">
    <label class="f">Details</label><textarea id="in_body" style="min-height:120px" placeholder="Numbers, dates, notes…"></textarea>
    <label class="f" style="display:flex;align-items:center;gap:8px;margin-top:14px"><input type="checkbox" id="in_secret" style="width:auto"> Mark as sensitive 🔒</label>
    <button class="btn primary block" style="margin-top:12px" onclick="saveInfo('')">Save</button>`);}
function editInfo(id){const it=D.vault_items.find(x=>x.id===id);
  const cats=D.vault_categories.map(g=>`<option value="${g.id}" ${g.id===it.category_id?'selected':''}>${esc(g.name)}</option>`).join('');
  openSheet(`<h3>Edit</h3><label class="f">Category</label><select id="in_cat">${cats}</select>
    <label class="f">Title</label><input id="in_title" value="${esc(it.title)}">
    <label class="f">Details</label><textarea id="in_body" style="min-height:120px">${esc(it.body)}</textarea>
    <label class="f" style="display:flex;align-items:center;gap:8px;margin-top:14px"><input type="checkbox" id="in_secret" style="width:auto" ${it.is_secret?'checked':''}> Mark as sensitive 🔒</label>
    <button class="btn primary block" style="margin-top:12px" onclick="saveInfo('${id}')">Save</button>`);}
async function saveInfo(id){const title=el('in_title').value.trim();if(!title){toast('Add a title');return;}
  await put('vault_items',{id:id||undefined,category_id:el('in_cat').value,title,body:el('in_body').value,is_secret:el('in_secret').checked});closeSheet();toast('Saved');render();}
async function delInfo(id){await del('vault_items',id);closeSheet();render();}
function addCategory(){openSheet(`<h3>New category</h3><label class="f">Name</label><input id="cat_name" placeholder="e.g. Insurance">
  <button class="btn primary block" style="margin-top:14px" onclick="saveCategory()">Add</button>`);}
async function saveCategory(){const n=el('cat_name').value.trim();if(!n)return;await put('vault_categories',{name:n,sort:D.vault_categories.length});closeSheet();render();}

/* ================= MORE ================= */
function rMore(){
  const s=D.settings[0]||{};
  let h=`<div class="sect">Contacts</div><div class="card">`;
  const cs=[...D.contacts].sort((a,b)=>(a.sort||0)-(b.sort||0));
  h+=cs.length?cs.map(c=>`<div class="list-item"><div class="li-main"><div class="h">${esc(c.name)}</div><div class="sub">${esc(c.role||'')}${c.phone?' · '+esc(c.phone):c.email?' · '+esc(c.email):''}</div></div>
    <div class="btn-row">${c.phone?`<a class="btn ghost sm" href="tel:${esc(c.phone)}">📞</a>`:''}${c.email?`<a class="btn ghost sm" href="mailto:${esc(c.email)}">✉️</a>`:''}<button class="btn ghost sm" onclick="editContact('${c.id}')">✏️</button></div></div>`).join(''):`<div class="mini">No contacts yet.</div>`;
  h+=`</div><button class="btn ghost block" onclick="editContact()">+ Add contact</button>
    <div class="sect">Names</div><div class="card">
    <label class="f">Name 1</label><input id="n1" value="${esc(s.name1||'Adrian')}"><label class="f">Name 2</label><input id="n2" value="${esc(s.name2||'Jacqueline')}">
    <button class="btn primary block" style="margin-top:14px" onclick="saveNames()">Save</button></div>
    <div class="sect">Account</div><div class="card"><div class="mini">Signed in as ${esc(USER?.email||'')}. Same data on both phones.</div>
    <button class="btn ghost block" style="margin-top:12px" onclick="changePw()">Change password</button>
    <button class="btn ghost block" style="margin-top:8px" onclick="signOut()">Sign out</button></div>
    <div class="sect">Install</div><div class="card"><div class="mini"><b>Android (Chrome):</b> ⋮ → Install app. <b>iPhone (Safari):</b> Share → Add to Home Screen. Works offline; syncs when back online.</div></div>`;
  el('v-more').innerHTML=h;
}
function editContact(id){const c=id?D.contacts.find(x=>x.id===id):{};
  openSheet(`<h3>${id?'Edit contact':'New contact'}</h3>
    <label class="f">Name</label><input id="c_name" value="${esc(c.name)}">
    <label class="f">Role</label><input id="c_role" value="${esc(c.role)}" placeholder="Lawyer / Doctor / Bank">
    <label class="f">Phone</label><input id="c_phone" value="${esc(c.phone)}">
    <label class="f">Email</label><input id="c_email" value="${esc(c.email)}">
    <button class="btn primary block" style="margin-top:16px" onclick="saveContact('${id||''}')">Save</button>
    ${id?`<button class="btn ghost block" style="margin-top:8px" onclick="delContact('${id}')">Delete</button>`:''}`);}
async function saveContact(id){await put('contacts',{id:id||undefined,name:el('c_name').value.trim(),role:el('c_role').value.trim(),phone:el('c_phone').value.trim(),email:el('c_email').value.trim()});closeSheet();toast('Saved');render();}
async function delContact(id){await del('contacts',id);closeSheet();render();}
async function saveNames(){const s=D.settings[0]||{id:uid()};s.name1=el('n1').value.trim();s.name2=el('n2').value.trim();await put('settings',{id:s.id,name1:s.name1,name2:s.name2,brand_sub:s.brand_sub||'Trips & Info'});applyBrand();toast('Saved');}
function changePw(){openSheet(`<h3>Change password</h3><label class="f">New password</label><input id="np" type="password"><button class="btn primary block" style="margin-top:14px" onclick="doChangePw()">Update</button>`);}
async function doChangePw(){const p=el('np').value;if(p.length<6){toast('Min 6 characters');return;}const {error}=await sb.auth.updateUser({password:p});toast(error?error.message:'Password updated');closeSheet();}
async function signOut(){await sb.auth.signOut();location.reload();}
function rFlights(){
  const t0=today();
  const all=[...D.flights].sort((a,b)=>String(a.fdate||'9999').localeCompare(String(b.fdate||'9999')));
  const up=all.filter(f=>parseD(f.fdate||'9999-12-31')>=t0);
  const past=all.filter(f=>parseD(f.fdate||'1900-01-01')<t0).reverse();
  const tt=id=>{const t=D.trips.find(x=>x.id===id);return t?t.title:'';};
  const rowF=f=>`<div class="list-item" style="cursor:pointer" onclick="flightActions('${f.id}')"><div class="ava">✈️</div><div class="li-main"><div class="h">${esc(f.from_code||'?')} → ${esc(f.to_code||'?')} <span class="mini" style="font-weight:400">${esc(f.flight_no||'')}</span></div><div class="sub">${[fmtD(f.fdate),f.ftime,f.pax,tt(f.trip_id)].filter(Boolean).join(' · ')}${f.conf?' · '+esc(f.conf):''}</div></div><div class="chev">›</div></div>`;
  let h=`<div class="sect">Upcoming flights · ${up.length}</div><div class="card">${up.length?up.map(rowF).join(''):'<div class="mini">No upcoming flights.</div>'}</div>`;
  if(past.length) h+=`<div class="sect">Past</div><div class="card">${past.map(rowF).join('')}</div>`;
  el('v-flights').innerHTML=h;
}

/* sheets */
function openSheet(html){el('sheet').innerHTML='<div class="grab"></div>'+html;el('scrim').classList.add('show');document.body.style.overflow='hidden';
  if(!(history.state&&history.state.sheet)) history.pushState({sheet:true,tab:history.state&&history.state.tab||null},'');}
function hideSheet(){el('scrim').classList.remove('show');document.body.style.overflow='';}
function closeSheet(){ if(history.state&&history.state.sheet){ history.back(); } else { hideSheet(); } }
el('scrim').addEventListener('click',e=>{if(e.target===el('scrim'))closeSheet();});
function applyBrand(){const s=D.settings[0]||{};el('brandName').textContent=`${(s.name1||'A').split(' ')[0]} + ${(s.name2||'J').split(' ')[0]}`;setSync();}

el('fab').onclick=()=>{if(cur==='home')editTrip();else if(cur==='info')addInfo(D.vault_categories[0]?.id);};
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>go(t.dataset.v));

/* ================= boot ================= */
(async function(){
  initAuth();
  const {data:{session}} = await sb.auth.getSession();
  if(session){ await onLogin(session.user); } else { el('au_email').value='aj@jjaj.info'; }
  if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
})();
window.addEventListener('load',()=>{ applyBrand&&applyBrand(); });
