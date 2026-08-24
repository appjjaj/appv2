/* ===== REARCH-CUTOVER-V1-20260823 — Phase 3 strangler (Home + Travel) =====
   Home and Travel now paint from the render edge fn (server-side truth):
   legacy renderer paints instantly (zero loss), server fragment swaps in
   behind. Trip overlay stays legacy until Phase 4 islands (map+handlers).
   Kill-switch: localStorage.aj_rearch_off='1'. */
(function(){
'use strict';
try{
  if(localStorage.getItem('aj_rearch_off')==='1') return;
  var BASE=(window.AJ_CONFIG&&AJ_CONFIG.SUPABASE_URL)+'/functions/v1/render';
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
  function swap(el,html){
    el.innerHTML=html;
    /* innerHTML-injected <script> tags are inert — re-create them so the
       fragment's clock/weather hydrator runs */
    el.querySelectorAll('script').forEach(function(old){
      var s=document.createElement('script'); s.textContent=old.textContent;
      old.parentNode.replaceChild(s,old);
    });
  }
  function cutover(name,elId,path){
    var legacy=window[name];
    window[name]=function(){
      var v=document.getElementById(elId);
      if(!v){ if(legacy) legacy(); return; }
      if(legacy) legacy(); /* instant local paint, zero loss */
      frag(path,function(html){
        var v2=document.getElementById(elId);
        if(v2) swap(v2,html);
      },function(){ /* fetch failed: legacy paint already on screen */ });
    };
  }
  cutover('rTravel','v-travel','travel');
  cutover('rHome','v-home','home');
}catch(e){ /* fail-safe: legacy behaviour untouched */ }
})();
