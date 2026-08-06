/* ============================================================
   SALAD&CO — Navigation inter-applis
   Injecté dans chaque appli via une seule ligne dans le <head>.
   Ajoute : (1) un bouton « ← Applications » (retour au portail)
            (2) un lanceur flottant (grille de toutes les applis).
   Aucune dépendance, n'interfère pas avec le code existant.
   ------------------------------------------------------------
   Pour ajouter / renommer une appli : modifier SC_APPS ci-dessous.
   ============================================================ */
(function () {
  "use strict";

  // ---- Registre central des applications -------------------
  var SC_APPS = [
    { id:"hub",       name:"Accueil",   url:"index.html",             icon:"🏠", color:"#6cbe2e", desc:"Toutes les applications" },
    { id:"contrats",  name:"Contrats",  url:"contrats-saladco.html",  icon:"📄", color:"#2a78d6", desc:"Dashboard des contrats & échéances" },
    { id:"budget",    name:"Budget",    url:"budget-saladco.html",    icon:"📊", color:"#6d4aa7", desc:"Synthèse des budgets 2026" },
    { id:"heures",    name:"Heures",    url:"heures-saladco.html",    icon:"⏱️", color:"#e0821e", desc:"Pilotage des heures" },
    { id:"acces",     name:"Accès",     url:"acces-saladco.html",     icon:"🔑", color:"#6cbe2e", desc:"Gestion des accès" },
    { id:"passeport", name:"Passeport", url:"passeport-saladco.html", icon:"🪪", color:"#1b1d1a", desc:"Passeport & formation collaborateurs" },
    { id:"planning",  name:"Planning",  url:"planning-saladco.html",  icon:"📅", color:"#1f7a4d", desc:"Planning des équipes" },
    { id:"primes",    name:"Primes",    url:"primes-saladco.html",    icon:"🏆", color:"#2e7d32", desc:"Performance & primes" },
    { id:"levees",    name:"Levées",    url:"levees-saladco.html",    icon:"✅", color:"#0f9d8c", desc:"Levées de réserves" }
  ];

  var thisScript = document.currentScript ||
    (function(){ var s=document.getElementsByTagName("script"); return s[s.length-1]; })();
  var CURRENT = (thisScript && thisScript.getAttribute("data-app")) || "";
  // data-base : chemin vers la racine du site. "" pour les applis GitHub (à la racine),
  // ou l'URL absolue du hub pour les applis hébergées ailleurs (Netlify).
  var BASE = (thisScript && thisScript.getAttribute("data-base")) || "";

  function resolve(url){ return /^https?:/.test(url) ? url : BASE + url; }

  function css(href){
    var l=document.createElement("link"); l.rel="stylesheet"; l.href=resolve(href);
    document.head.appendChild(l);
  }
  css("assets/js/saladco-nav.css");

  function el(tag, attrs, html){
    var e=document.createElement(tag);
    if(attrs) for(var k in attrs){ if(k==="class") e.className=attrs[k]; else e.setAttribute(k,attrs[k]); }
    if(html!=null) e.innerHTML=html;
    return e;
  }

  function build(){
    if(document.getElementById("sc-fab")) return;

    // --- Bouton « ← Applications » (retour au portail) ---
    var back=el("a",{id:"sc-back","class":"sc-back",href:resolve("index.html"),"aria-label":"Retour aux applications"});
    back.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg><span class="sc-back-t">Applications</span>';
    document.body.appendChild(back);

    // --- Bouton flottant (FAB) : ouvre la grille ---
    var fab=el("button",{id:"sc-fab","class":"sc-fab","aria-label":"Changer d'application","title":"Applications Salad&Co"});
    fab.innerHTML='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z"/></svg>';
    document.body.appendChild(fab);

    // --- Overlay + feuille ---
    var overlay=el("div",{id:"sc-overlay","class":"sc-overlay","role":"dialog","aria-modal":"true","aria-label":"Applications Salad&Co"});
    var sheet=el("div",{"class":"sc-sheet"});

    var head=el("div",{"class":"sc-head"});
    head.appendChild(el("div",{"class":"sc-brand"},
      '<img class="sc-logo" src="'+resolve("assets/icons/icon-192.png")+'" alt="">Salad&amp;Co · Applications'));
    var closeBtn=el("button",{"class":"sc-close","aria-label":"Fermer"},"✕");
    head.appendChild(closeBtn);
    sheet.appendChild(head);

    var grid=el("div",{"class":"sc-grid"});
    SC_APPS.forEach(function(a){
      var isCur=(a.id===CURRENT);
      var card=el("a",{"class":"sc-app"+(isCur?" sc-current":""),href:resolve(a.url)});
      card.innerHTML=
        '<div class="sc-row">'+
          '<span class="sc-ic" style="background:'+a.color+'">'+a.icon+'</span>'+
          (isCur?'<span class="sc-badge">Vous êtes ici</span>':'')+
        '</div>'+
        '<div class="sc-nm">'+a.name+'</div>'+
        '<div class="sc-ds">'+a.desc+'</div>';
      grid.appendChild(card);
    });
    sheet.appendChild(grid);
    sheet.appendChild(el("div",{"class":"sc-foot"},"Salad&amp;Co · suite interne"));
    overlay.appendChild(sheet);
    document.body.appendChild(overlay);

    function open(){ overlay.classList.add("sc-open"); }
    function close(){ overlay.classList.remove("sc-open"); }
    fab.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", function(e){ if(e.target===overlay) close(); });
    document.addEventListener("keydown", function(e){ if(e.key==="Escape") close(); });
  }

  if(document.readyState==="loading")
    document.addEventListener("DOMContentLoaded", build);
  else build();

  // --- Service worker commun ---
  if("serviceWorker" in navigator && !BASE){
    window.addEventListener("load", function(){
      navigator.serviceWorker.register("sw.js").catch(function(){});
    });
  }
})();
