/* ===== v175 — SOURCE SPINE (root & branch interaction rewrite) =========
   Rule: TAP any listing -> the ORIGINAL document, full screen, one touch.
   Edit / copy / delete move to LONG-PRESS. Booth-clerk test applies.
   One read path: v_sources (entry_links rel='source').
   ===================================================================== */
(function(){
'use strict';
function SB(){ try{ if(typeof sb!=='undefined'&&sb) return sb; }catch(e){} return window.sb; }
function DD(){ try{ if(typeof D!=='undefined'&&D) return D; }catch(e){} return window.D||{}; }

/* ---------- source index: one query, cached ---------- */
var IDX=null, IDX_AT=0;
function loadIdx(cb){
  var now=Date.now();
  if(IDX && now-IDX_AT<60000){ cb(IDX); return; }
  try{
    SB().from('v_sources').select('*').then(function(r){
      if(!r.error && r.data){
        IDX={}; IDX_AT=Date.now();
        r.data.forEach(function(s){
          var k=s.entity_table+':'+s.entity_id;
          (IDX[k]=IDX[k]||[]).push(s);
        });
      }
      cb(IDX||{});
    });
  }catch(e){ cb(IDX||{}); }
}
window.__spineRefresh=function(){ IDX=null; };

/* ---------- open one source ---------- */
function openSrc(s){
  if(s.src_table==='documents'){
    if(window.openDocById) return openDocById(s.src_id);
    if(window.viewSource) return viewSource('documents', s.src_id);
  }
  if(s.src_table==='inbox_emails'){
    SB().from('inbox_emails').select('*').eq('id',s.src_id).single().then(function(r){
      if(r.error||!r.data) return;
      var m=r.data, esc=window.esc||function(x){return String(x==null?'':x).replace(/</g,'&lt;');};
      openSheet('<h3>&#9993;&#65039; '+esc(m.subject||'(no subject)')+'</h3>'
        +'<div class="mini">'+esc(m.from_addr||'')+'</div>'
        +'<div style="white-space:pre-wrap;font-size:13.5px;margin-top:10px;max-height:60vh;overflow:auto">'+esc(m.body_text||'')+'</div>');
    });
  }
}
function rank(s){ return s.kind==='pdf'?0 : s.kind==='image'?1 : s.kind==='file'?2 : 3; }

/* Tap -> original. No source -> fallback (the old behaviour). */
window.openOriginal=function(table,id,fallback){
  loadIdx(function(ix){
    var list=(ix[table+':'+id]||[]).slice().sort(function(a,b){return rank(a)-rank(b);});
    if(!list.length){ if(fallback) fallback(); return; }
    var docs=list.filter(function(s){return s.src_table==='documents';});
    if(docs.length===1 || (docs.length && docs[0].kind==='pdf' && docs.filter(function(d){return d.kind==='pdf';}).length===1)){
      openSrc(docs[0]); return;
    }
    if(list.length===1){ openSrc(list[0]); return; }
    /* several candidates: show them, biggest-first, plus details escape hatch */
    var esc=window.esc||function(x){return String(x==null?'':x).replace(/</g,'&lt;');};
    var h='<h3>&#128196; Originals</h3>';
    list.forEach(function(s,i){
      var ic=s.kind==='pdf'?'&#128196;':s.kind==='image'?'&#128444;':s.kind==='email'?'&#9993;&#65039;':'&#128441;';
      h+='<div class="list-item" style="cursor:pointer" onclick="window.__spineOpen('+i+')"><div class="li-main"><div class="h">'+ic+' '+esc(s.title||'(untitled)')+'</div><div class="sub">'+esc(s.kind)+(s.derived?' &middot; matched by reference':'')+'</div></div><div class="chev">&rsaquo;</div></div>';
    });
    if(fallback) h+='<button class="btn ghost block" style="margin-top:12px" onclick="window.__spineFb()">&#9881; Details / edit</button>';
    window.__spineList=list; window.__spineFbFn=fallback||null;
    window.__spineOpen=function(i){ openSrc(window.__spineList[i]); };
    window.__spineFb=function(){ if(window.__spineFbFn) window.__spineFbFn(); };
    openSheet(h);
  });
};

/* ---------- long-press detector (global, passive) ---------- */
window.__ajHold=false;
var _t=null;
document.addEventListener('pointerdown',function(){ window.__ajHold=false; clearTimeout(_t); _t=setTimeout(function(){ window.__ajHold=true; try{navigator.vibrate&&navigator.vibrate(10);}catch(e){} },500); },true);
document.addEventListener('pointerup',function(){ clearTimeout(_t); setTimeout(function(){ window.__ajHold=false; },400); },true);
document.addEventListener('pointercancel',function(){ clearTimeout(_t); },true);

/* ---------- trip itinerary rows (tvIt): tap -> original, hold -> edit ---------- */
document.addEventListener('click', function(ev){
  if(window.__ajHold) return;                      /* long-press keeps old behaviour */
  var r=ev.target.closest && ev.target.closest('.tvIt');
  if(!r) return;
  var iid=r.getAttribute('data-i'), fc=r.getAttribute('data-fc');
  if(iid){
    ev.stopPropagation(); ev.preventDefault();
    openOriginal('trip_items', iid, function(){ try{ itemActions(iid); }catch(e){} });
    return;
  }
  if(fc){
    var f=(DD().flights||[]).find(function(x){ return x.conf===fc && !x.archived; });
    if(f){
      ev.stopPropagation(); ev.preventDefault();
      openOriginal('flights', f.id, function(){ try{ flightActions(f.id); }catch(e){} });
    }
  }
  /* dead rows (calendar agenda/day lists rendered without any action):
     if the line names a flight conf or an item ref/title, tap -> original */
  var host=ev.target.closest && ev.target.closest('div');
  if(!host) return;
  var n=ev.target, hasHandler=false;
  for(var hop=0; n && hop<6; hop++){ if(n.getAttribute && (n.getAttribute('onclick')||n.__spineWired)){ hasHandler=true; break; } n=n.parentNode; }
  if(hasHandler) return;
  var txt=(host.innerText||'').slice(0,220);
  if(txt.length<4) return;
  var f=(DD().flights||[]).find(function(x){ return !x.archived && x.conf && x.conf.length>=5 && txt.indexOf(x.conf)>=0; });
  if(f){ ev.stopPropagation(); openOriginal('flights', f.id, function(){ try{ flightActions(f.id); }catch(e){} }); return; }
  var it=(DD().trip_items||[]).find(function(x){ return (x.ref && x.ref.length>=5 && txt.indexOf(x.ref)>=0) || (x.title && x.title.length>=6 && txt.indexOf(x.title)>=0); });
  if(it){ ev.stopPropagation(); openOriginal('trip_items', it.id, function(){ try{ itemActions(it.id); }catch(e){} }); }
}, true);

/* ---------- rewire the three action sheets ---------- */
function wire(){
  if(window.itemActions && !window.itemActions.__spined){
    var _ia=window.itemActions;
    window.itemActions=function(id){ if(window.__ajHold) return _ia(id); return openOriginal('trip_items',id,function(){_ia(id);}); };
    window.itemActions.__spined=true;
  }
  if(window.flightActions && !window.flightActions.__spined){
    var _fa=window.flightActions;
    window.flightActions=function(id){ if(window.__ajHold) return _fa(id); return openOriginal('flights',id,function(){_fa(id);}); };
    window.flightActions.__spined=true;
  }
  if(window.tripActions && !window.tripActions.__spined){
    var _ta=window.tripActions;
    window.tripActions=function(id){ if(window.__ajHold) return _ta(id); return window.openTrip(id); };
    window.tripActions.__spined=true;
  }
}
wire(); var wt=0, wtm=setInterval(function(){ wire(); if(++wt>40) clearInterval(wtm); },500);

/* ---------- ONE trip view: classic is the trip view again ---------- */
/* ---------- v189: DO NOW — rebuild a trip page from live bookings, in-app ---------- */
window.ajRebuildPage=function(tid){
  toast&&toast('Rebuilding page from live bookings…');
  fetch('https://mjkaoombokemhgaynjwf.supabase.co/functions/v1/tripage?key=a1523b175b0dabc406840920eee18bab106ca545d17c189d&trip='+encodeURIComponent(tid))
   .then(function(r){ return r.json().catch(function(){ return {ok:false}; }); })
   .then(function(j){
     if(j&&j.ok){
       toast&&toast('Page rebuilt');
       try{ SB().from('notes').select('*').eq('id',j.note_id).single().then(function(r){
         if(!r.error&&r.data){ var ns=DD().notes||[]; var ix2=ns.findIndex(function(n){return n.id===j.note_id;});
           if(ix2>=0) ns[ix2]=r.data; else ns.push(r.data);
           if(window.viewNote) viewNote(j.note_id);
         } }); }catch(e){}
     } else { toast&&toast('Rebuild failed — page untouched'); }
   }).catch(function(){ toast&&toast('Rebuild failed — page untouched'); });
};
function rebuildBtn(){
  var sh=document.getElementById('sheet'); if(!sh||sh.querySelector('.ajRebuild')) return;
  var h3=sh.querySelector('h3'); var txt=(h3&&h3.textContent)||'';
  var n=(DD().notes||[]).find(function(x){ return x.title && txt && x.title.indexOf(txt.slice(0,24))===0 && x.trip_id && /^\s*Travel\s*[›>]/.test(x.title); });
  /* fallback: any open Travel page matched by iframe/body marker */
  if(!n){ n=(DD().notes||[]).find(function(x){ return x.trip_id && /^\s*Travel\s*[›>]/.test(x.title||'') && sh.innerHTML.indexOf(x.id)>=0; }); }
  if(!n) return;
  var b=document.createElement('button'); b.type='button'; b.className='btn ghost block ajRebuild'; b.style.marginTop='8px';
  b.innerHTML='&#10227; Rebuild from live bookings';
  b.onclick=function(){ ajRebuildPage(n.trip_id); };
  sh.appendChild(b);
}
setInterval(rebuildBtn, 800);

/* ---------- v185: TICKETS and ITINERARY from everywhere (header, always) ---------- */
/* v190: one-tap Google Maps navigation from any row — tap the compass, keep everything else */
window.ajNav=function(q){ window.open('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q), '_blank'); };
function navBtn(q){ return '<div class="chev" style="padding:0 10px;font-size:19px" onclick="event.stopPropagation();ajNav(\''+String(q).replace(/'/g,'').replace(/"/g,'')+'\')">&#129517;</div>'; }
window.ajTickets=function(){
  var esc=window.esc||function(x){return String(x==null?'':x).replace(/</g,'&lt;');};
  var today=new Date().toISOString().slice(0,10);
  loadIdx(function(ix){
    var rows=[];
    (DD().flights||[]).forEach(function(f){ if(!f.archived && (f.fdate||'')>=today) rows.push({d:f.fdate,tm:f.ftime||'',ic:'&#9992;&#65039;',h:esc(f.from_code)+' &rarr; '+esc(f.to_code)+(f.pax?' &middot; '+esc(f.pax):''),t:'flights',id:f.id}); });
    (DD().trip_items||[]).forEach(function(i){ if((i.idate||'')>=today && i.status!=='cancelled') rows.push({d:i.idate,tm:i.itime||'',ic:'&#127915;',h:esc(i.title||''),t:'trip_items',id:i.id}); });
    rows=rows.filter(function(r){ return (ix[r.t+':'+r.id]||[]).length; });
    rows.sort(function(a,b){ return (a.d+a.tm)<(b.d+b.tm)?-1:1; });
    var h='<h3>&#127903;&#65039; Tickets</h3>';
    if(!rows.length) h+='<div class="mini">No ticketed bookings ahead.</div>';
    rows.slice(0,20).forEach(function(r,ri){
      var dd=new Date(r.d+'T00:00:00');
      h+='<div class="list-item" style="cursor:pointer" onclick="openOriginal(\''+r.t+'\',\''+r.id+'\')"><div class="li-main"><div class="h">'+r.ic+' '+r.h+'</div><div class="sub">'+dd.toLocaleDateString(undefined,{weekday:'short',day:'numeric',month:'short'})+(r.tm?' &middot; '+r.tm:'')+'</div></div>'+navBtn(r.h.replace(/&[a-z#0-9]+;/g,' '))+'<div class="chev">&#8250;</div></div>';
    });
    openSheet(h);
  });
};
window.ajItinerary=function(){
  var today=new Date().toISOString().slice(0,10);
  var ts=(DD().trips||[]).slice().filter(function(t){ return (t.end_date||t.start_date||'')>=today; });
  ts.sort(function(a,b){ return (a.start_date||'')<(b.start_date||'')?-1:1; });
  var cur=ts.find(function(t){ return (t.start_date||'')<=today; })||ts[0];
  if(!cur){ toast&&toast('No upcoming trip'); return; }
  if(window.__tripClassic) return window.__tripClassic(cur.id);   /* the full working itinerary */
  return window.openTrip(cur.id);
};
function hdrBtns(){
  var bar=document.querySelector('.hdrbar'); if(!bar||bar.querySelector('.ajTix')) return;
  function mk(cls,label,txt,fn){ var b=document.createElement('button'); b.className='hdr-ic '+cls; b.setAttribute('aria-label',label); b.style.fontSize='17px'; b.textContent=txt; b.onclick=fn; return b; }
  var ref=bar.firstChild&&bar.firstChild.nextSibling;
  bar.insertBefore(mk('ajTix','Tickets','\uD83C\uDFAB',function(){ajTickets();}), ref);
  bar.insertBefore(mk('ajItin','Itinerary','\uD83D\uDCCB',function(){ajItinerary();}), ref);
}
hdrBtns(); var hb=0, hbm=setInterval(function(){ hdrBtns(); if(++hb>60) clearInterval(hbm); },500);

/* ---------- v184: a trip whose real "view" is a road-trip note opens THAT, one tap ---------- */
function primaryNote(tid){
  var ns=(DD().notes||[]).filter(function(n){ return n.trip_id===tid && /^\s*Travel\s*[›>]/.test(n.title||''); });
  return ns.length?ns[0]:null;
}
function hookTripToNote(){
  if(window.openTrip && !window.openTrip.__noteFirst){
    var _ot=window.openTrip;
    window.openTrip=function(id){
      if(!window.__ajHold){
        var pn=primaryNote(id);
        if(pn && window.viewNote){ return viewNote(pn.id); }   /* the big page: map, route, stays, temples */
      }
      /* v187: Wanderlog overlay ripped out of the path. Classic (full itinerary,
         every row -> its ticket) IS the trip view. */
      return (window.__tripClassic||_ot)(id);                  /* long-press or no page: normal trip */
    };
    window.openTrip.__noteFirst=true;
  }
}
hookTripToNote(); var nt=0, ntm=setInterval(function(){ hookTripToNote(); if(++nt>40) clearInterval(ntm); },500);

function unfork(){
  /* v183: AJ keeps the big map view as THE trip view (single tap).
     Its rows now resolve to originals via the tvIt interceptor above,
     so no need to demote it. Classic stays reachable from inside it. */
  return;
  if(window.__tripClassic && !window.__unforked){
    window.__unforked=true;
    window.openTripMap=window.openTrip;             /* keep the map reachable */
    window.openTrip=function(id){
      window.__tripClassic(id);
      setTimeout(function(){
        try{
          var sh=document.getElementById('sheet'); if(!sh) return;
          if(sh.querySelector('.spineMapBtn')) return;
          var b=document.createElement('button');
          b.type='button'; b.className='btn ghost block spineMapBtn'; b.style.marginTop='8px';
          b.innerHTML='&#128506; Map view';
          b.onclick=function(){ try{closeSheet();}catch(e){} window.openTripMap(id); };
          sh.appendChild(b);
        }catch(e){}
      },400);
    };
  }
}
unfork(); var ut=0, utm=setInterval(function(){ unfork(); if(++ut>40) clearInterval(utm); },500);

/* ---------- notes join the household: related row on every note ---------- */
if(window.viewNote && !window.viewNote.__spined){
  var _vn=window.viewNote;
  window.viewNote=function(id){
    var r=_vn.apply(this,arguments);
    try{
      var n=(DD().notes||[]).find(function(x){return x.id===id;});
      if(!n===undefined||!n||!n.trip_id) return r;
      setTimeout(function(){
        var sh=document.getElementById('sheet'); if(!sh||sh.querySelector('.spineRel')) return;
        var esc=window.esc||function(x){return String(x==null?'':x).replace(/</g,'&lt;');};
        var box=document.createElement('div'); box.className='spineRel';
        var its=(DD().trip_items||[]).filter(function(i){return i.trip_id===n.trip_id;});
        var fls=(DD().flights||[]).filter(function(f){return f.trip_id===n.trip_id && !f.archived;});
        var h='<div class="mini" style="font-weight:800;color:var(--ink2);margin:14px 0 4px">Connected</div>';
        fls.slice(0,4).forEach(function(f){ h+='<div class="list-item" style="cursor:pointer" onclick="flightActions(\''+f.id+'\')"><div class="li-main"><div class="h">&#9992;&#65039; '+esc(f.from_code)+' &rarr; '+esc(f.to_code)+'</div></div><div class="chev">&rsaquo;</div></div>'; });
        its.slice(0,6).forEach(function(i){ h+='<div class="list-item" style="cursor:pointer" onclick="itemActions(\''+i.id+'\')"><div class="li-main"><div class="h">&#128278; '+esc(i.title||'')+'</div></div><div class="chev">&rsaquo;</div></div>'; });
        if(fls.length||its.length){ box.innerHTML=h; sh.appendChild(box); }
      },350);
    }catch(e){}
    return r;
  };
  window.viewNote.__spined=true;
}

/* ---------- Info lands on Quick fill ---------- */
if(window.go && !window.go.__spineInfo){
  var _go=window.go;
  window.go=function(v){
    var r=_go.apply(this,arguments);
    try{ if(v==='info' && window.openFill) setTimeout(function(){ openFill(); },120); }catch(e){}
    try{ if(v==='home') setTimeout(nextUp,200); }catch(e){}
    return r;
  };
  window.go.__spineInfo=true;
}

/* ---------- Itinerary, top of the bill: "Next up" strip on Home ---------- */
function nextUp(){
  try{
    var host=document.getElementById('v-home'); if(!host) return;
    var old=host.querySelector('.spineNext'); if(old) old.remove();
    var today=new Date().toISOString().slice(0,10);
    var esc=window.esc||function(x){return String(x==null?'':x).replace(/</g,'&lt;');};
    var rows=[];
    (DD().flights||[]).forEach(function(f){ if(!f.archived && f.fdate>=today) rows.push({d:f.fdate,tm:f.ftime||'',h:'&#9992;&#65039; '+esc(f.from_code)+' &rarr; '+esc(f.to_code),fn:"flightActions('"+f.id+"')"}); });
    (DD().trip_items||[]).forEach(function(i){ if(i.idate>=today && i.status!=='cancelled') rows.push({d:i.idate,tm:i.itime||'',h:'&#128278; '+esc(i.title||''),fn:"itemActions('"+i.id+"')"}); });
    rows.sort(function(a,b){ return (a.d+a.tm)<(b.d+b.tm)?-1:1; });
    if(!rows.length) return;
    var el=document.createElement('div'); el.className='spineNext card'; el.style.margin='8px 0 10px';
    var h='<div class="mini" style="font-weight:800;color:var(--ink2);padding:8px 10px 0">&#129517; Next up &middot; tap for the original</div>';
    rows.slice(0,3).forEach(function(x){
      var dd=new Date(x.d+'T00:00:00');
      h+='<div class="list-item" style="cursor:pointer" onclick="'+x.fn+'"><div class="li-main"><div class="h">'+x.h+'</div><div class="sub">'+dd.toLocaleDateString(undefined,{weekday:'short',day:'numeric',month:'short'})+(x.tm?' &middot; '+esc(x.tm):'')+'</div></div>'+navBtn(x.h.replace(/&[a-z#0-9]+;/g,' '))+'<div class="chev">&rsaquo;</div></div>';
    });
    el.innerHTML=h;
    host.insertBefore(el, host.firstChild);
  }catch(e){}
}
setTimeout(nextUp,900);
})();
