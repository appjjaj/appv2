/* ================= A+J Hub — shell.js (REARCH Phase 1, DARK) =================
   MARKER: REARCH-SHELL-V1-20260823
   Thin always-loaded shell per project_docs rearchitect-v1:
   auth · header · 5-tab nav · fragment loader (cache-then-refresh) · sw glue.
   Views come from the `render` edge fn as complete HTML fragments.
   Routes not yet migrated show a NOT-MIGRATED notice (Phase 3 wires legacy fallback).
   ============================================================================ */
(function(){
'use strict';
const CFG = window.AJ_CONFIG;
const sb = supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_KEY, {
  auth:{ persistSession:true, autoRefreshToken:true, detectSessionInUrl:true }
});
window.__shellSB = sb;
const $ = s => document.querySelector(s);
const el = id => document.getElementById(id);
const VIEWS = ['home','travel','cal','notes','info','more'];
const RENDER_BASE = CFG.SUPABASE_URL + '/functions/v1/render';
let CURRENT = 'home';

/* ---------- toast ---------- */
function toast(m){const t=el('toast');if(!t)return;t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),1900);}
window.toast = window.toast || toast;

/* ---------- fragment cache (localStorage, per-view) ---------- */
const CK = v => 'aj_frag_' + v;
function cachedFrag(v){ try{ return localStorage.getItem(CK(v)); }catch(e){ return null; } }
function cacheFrag(v,html){ try{ localStorage.setItem(CK(v), html); }catch(e){} }

/* ---------- fragment loader: paint cached instantly, refresh in background ---------- */
async function fetchFrag(view){
  const { data:{ session } } = await sb.auth.getSession();
  if(!session) throw new Error('no session');
  const r = await fetch(RENDER_BASE + '/' + view, {
    headers:{ 'Authorization':'Bearer '+session.access_token, 'apikey':CFG.SUPABASE_KEY }
  });
  if(!r.ok) throw new Error('render '+view+' → '+r.status);
  return await r.text();
}
async function loadView(view, opts){
  opts = opts||{};
  CURRENT = view;
  VIEWS.forEach(v=>{ const s=el('v2-'+v); if(s) s.classList.toggle('active', v===view); });
  document.querySelectorAll('nav.tabs .tab').forEach(b=>b.classList.toggle('active', b.dataset.v===view));
  const box = el('v2-'+view); if(!box) return;
  const cached = cachedFrag(view);
  if(cached && !box.dataset.painted){ box.innerHTML = cached; box.dataset.painted='1'; }
  if(!cached && !box.dataset.painted){ box.innerHTML = '<div class="spinner"></div>'; }
  try{
    const html = await fetchFrag(view);
    if(CURRENT===view){ box.innerHTML = html; box.dataset.painted='1'; }
    cacheFrag(view, html);
  }catch(e){
    if(!cached){
      box.innerHTML = '<div class="card"><b>'+view+'</b><div class="mini" style="margin-top:6px">Not migrated yet — served by the render fn in Phase 2/3. ('+String(e.message||e).replace(/[<>]/g,'')+')</div></div>';
    }
  }
}
window.shellGo = loadView;
/* legacy-compatible router name so fragments can call go('view') */
window.go = window.go || function(v){ loadView(v); };

/* REARCH-SHELL-V1b-20260823: shims so served fragments' onclicks work in the shell */
async function loadSub(view, path){
  CURRENT = view;
  const box = el('v2-'+view); if(!box) return;
  box.innerHTML = '<div class="spinner"></div>';
  VIEWS.forEach(v=>{ const s=el('v2-'+v); if(s) s.classList.toggle('active', v===view); });
  try{
    const html = await fetchFrag(path);
    box.innerHTML = html; box.dataset.painted='1';
  }catch(e){ box.innerHTML = '<div class="card"><div class="mini">Error: '+String(e.message||e).replace(/[<>]/g,'')+'</div></div>'; }
}
window.openTrip = function(id){ loadSub('travel', 'trip/'+id); };
window.openDocById = function(id){ window.ajOpenDoc(id); };
window.rHome = function(){ const b=el('v2-home'); if(b){ b.dataset.painted=''; } loadView('home'); };
document.addEventListener('click', function(ev){
  const doc = ev.target.closest && ev.target.closest('[data-doc]');
  if(doc && doc.classList.contains('tvDoc')){ ev.stopPropagation(); window.ajOpenDoc(doc.dataset.doc); return; }
  const nav = ev.target.closest && ev.target.closest('[data-nav]');
  if(nav){ ev.stopPropagation(); window.open('https://www.google.com/maps/dir/?api=1&destination='+nav.dataset.nav,'_blank'); return; }
  if(ev.target.id==='tvX'){ const b=el('v2-travel'); if(b){ b.dataset.painted=''; } loadView('travel'); return; }
});

/* REARCH-SHELL-V1c-20260823: safe stubs for not-yet-migrated legacy fns (hdrbar/fragment onclicks) */
['openFind','openInbox','akShowList','openCards','openNews','pasteBooking','openNotes','viewNote','tripDates','editTrip','flightActions','itemActions','weatherCard','__ajpickOpen','__ajTripNav','__hp','__hpGo','openSheet','openDay','calMove'].forEach(fn=>{ if(!window[fn]) window[fn]=function(){ if(window.toast) toast('Not migrated yet'); }; });

/* ---------- one shared doc opener (D14) — never fails silently ---------- */
window.ajOpenDoc = async function(id){
  try{
    const { data, error } = await sb.from('documents').select('id,title,url,mime').eq('id', id).single();
    if(error || !data) throw new Error(error?error.message:'not found');
    if(data.url){ window.open(data.url, '_blank'); return; }
    throw new Error('document has no url');
  }catch(e){
    toast('Document error: '+(e.message||e));
  }
};

/* ---------- auth ---------- */
async function signIn(){
  const em=el('au_email').value.trim(), pw=el('au_pass').value;
  el('au_err').textContent='';
  const { error } = await sb.auth.signInWithPassword({ email:em, password:pw });
  if(error){ el('au_err').textContent=error.message; return; }
  boot();
}
async function boot(){
  const { data:{ session } } = await sb.auth.getSession();
  if(!session){ el('auth').classList.remove('hide'); el('shell2').classList.add('hide'); return; }
  el('auth').classList.add('hide'); el('shell2').classList.remove('hide');
  const dot=el('syncDot'); if(dot) dot.classList.add('on');
  loadView(CURRENT);
}

/* ---------- wire up ---------- */
document.addEventListener('DOMContentLoaded', function(){
  const b=el('au_btn'); if(b) b.onclick=signIn;
  const p=el('au_pass'); if(p) p.addEventListener('keydown',e=>{ if(e.key==='Enter') signIn(); });
  document.querySelectorAll('nav.tabs .tab').forEach(t=>{ t.onclick=()=>loadView(t.dataset.v); });
  const hs=el('hdrSearch'); if(hs) hs.onclick=()=>loadView('more');
  boot();
});

/* ---------- sw glue (network-first sw.js, same as live) ---------- */
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{ navigator.serviceWorker.register('sw.js').catch(()=>{}); });
}
})();
