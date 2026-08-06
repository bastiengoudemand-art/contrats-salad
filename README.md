<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Salad&amp;Co — Applications</title>
<meta name="description" content="Portail des applications internes Salad&Co">
<link rel="manifest" href="manifest.webmanifest">
<meta name="theme-color" content="#1b1d1a">
<link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="assets/icons/icon-192.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Salad&Co">
<link rel="stylesheet" href="assets/css/saladco.css">
<style>
  *{box-sizing:border-box}
  html,body{margin:0}
  body{ font-family:var(--sc-font); color:var(--sc-text); background:var(--sc-paper);
    min-height:100vh; -webkit-font-smoothing:antialiased; }

  /* ---------- Connexion ---------- */
  .auth-wrap{ min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px;
    background:radial-gradient(120% 120% at 100% 0%, #2f6f1e 0%, var(--sc-ink) 60%); }
  .auth-box{ width:100%; max-width:400px; background:var(--sc-card); border-radius:20px; padding:28px 24px;
    box-shadow:0 20px 60px rgba(0,0,0,.35); }
  .auth-box .logo{ width:56px; height:56px; border-radius:15px; display:block; margin:0 auto 14px; }
  .auth-box h1{ font-size:20px; text-align:center; margin:0 0 4px; letter-spacing:-.3px; }
  .auth-box .sub{ text-align:center; color:var(--sc-text-2); font-size:13.5px; margin:0 0 20px; }
  .auth-box label{ display:block; font-size:12.5px; font-weight:700; color:var(--sc-text-2); margin:12px 2px 6px; }
  .auth-box input{ width:100%; padding:12px 13px; border:1px solid var(--sc-border); border-radius:11px;
    font-size:15px; background:var(--sc-paper); color:var(--sc-text); }
  .auth-box input:focus{ outline:none; border-color:var(--sc-green); }
  .auth-box button.main{ width:100%; margin-top:18px; padding:13px; border:none; border-radius:11px;
    background:var(--sc-green); color:#fff; font-size:15px; font-weight:700; cursor:pointer; }
  .auth-box button.main:hover{ background:var(--sc-green-d); }
  .auth-box button.main:disabled{ opacity:.6; cursor:default; }
  .auth-link{ display:block; text-align:center; margin-top:16px; font-size:12.5px; color:var(--sc-green-d);
    background:none; border:none; cursor:pointer; text-decoration:underline; width:100%; }
  .auth-msg{ margin-top:14px; font-size:13px; text-align:center; min-height:18px; }
  .auth-msg.err{ color:#c0392b; } .auth-msg.ok{ color:var(--sc-green-d); }
  .hidden{ display:none !important; }

  /* ---------- Portail ---------- */
  .hero{ background:radial-gradient(120% 120% at 100% 0%, #2f6f1e 0%, var(--sc-ink) 55%);
    color:#fff; padding:calc(26px + env(safe-area-inset-top)) 20px 30px; }
  .hero-in{ max-width:1040px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; }
  .brand{ display:flex; align-items:center; gap:14px; }
  .brand img{ width:50px; height:50px; border-radius:14px; box-shadow:0 6px 18px rgba(0,0,0,.35); }
  .brand h1{ font-size:22px; margin:0; letter-spacing:-.4px; font-weight:800; }
  .brand p{ margin:3px 0 0; font-size:13px; color:rgba(255,255,255,.75); }
  .userbox{ display:flex; align-items:center; gap:12px; font-size:13px; color:rgba(255,255,255,.9); }
  .userbox .who{ text-align:right; } .userbox .who b{ display:block; }
  .btn-out{ background:rgba(255,255,255,.14); border:1px solid rgba(255,255,255,.25); color:#fff;
    padding:8px 12px; border-radius:10px; font-size:12.5px; cursor:pointer; font-weight:600; }
  .btn-out:hover{ background:rgba(255,255,255,.24); }

  main{ max-width:1040px; margin:0 auto; padding:26px 20px 60px; }
  .section-t{ font-size:12.5px; text-transform:uppercase; letter-spacing:.6px; color:var(--sc-text-2);
    font-weight:700; margin:6px 4px 14px; }
  .grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(230px,1fr)); gap:16px; }
  .app{ position:relative; display:flex; flex-direction:column; gap:10px; text-decoration:none;
    background:var(--sc-card); border:1px solid var(--sc-border); border-radius:var(--sc-radius);
    padding:18px; color:var(--sc-text); box-shadow:var(--sc-shadow);
    transition:transform .14s ease, border-color .14s ease, box-shadow .14s ease; overflow:hidden; }
  .app::before{ content:""; position:absolute; left:0; top:0; bottom:0; width:4px; background:var(--ac,#6cbe2e); }
  .app:hover{ transform:translateY(-3px); border-color:var(--ac,#6cbe2e);
    box-shadow:0 2px 4px rgba(20,22,15,.06),0 16px 40px rgba(20,22,15,.14); }
  .app .top{ display:flex; align-items:flex-start; justify-content:space-between; gap:8px; }
  .app .ic{ width:50px; height:50px; border-radius:14px; display:flex; align-items:center; justify-content:center;
    font-size:25px; color:#fff; background:var(--ac,#6cbe2e); box-shadow:0 6px 16px rgba(20,22,15,.18); }
  .app .nm{ font-size:16.5px; font-weight:800; letter-spacing:-.3px; }
  .app .ds{ font-size:12.5px; color:var(--sc-text-2); line-height:1.4; }
  .app .go{ margin-top:auto; font-size:12.5px; font-weight:700; color:var(--ac,#6cbe2e); display:flex; align-items:center; gap:6px; }
  .badge{ font-size:10.5px; font-weight:800; padding:3px 9px; border-radius:20px; white-space:nowrap; }
  .badge.admin{ background:var(--sc-green-l); color:var(--sc-green-d); }
  .badge.consultant{ background:#eef1f5; color:#5b6472; }
  .badge.manager{ background:#e7f0fb; color:#2a6bb0; }
  .badge.local{ background:#fdf0e2; color:#b8730f; }
  .empty{ text-align:center; color:var(--sc-text-2); padding:40px 20px; }
  footer{ text-align:center; color:var(--sc-text-2); font-size:12px; padding:0 20px 40px; }
  .loading{ text-align:center; color:var(--sc-text-2); padding:60px 20px; }
</style>
</head>
<body>

<!-- ======================= CONNEXION ======================= -->
<div id="auth" class="auth-wrap">
  <div class="auth-box">
    <img class="logo" src="assets/icons/icon-192.png" alt="Salad&Co">
    <!-- Connexion -->
    <div id="view-login">
      <h1>Salad&amp;Co</h1>
      <p class="sub">Connectez-vous pour accéder à vos applications.</p>
      <label for="email">Adresse e-mail</label>
      <input id="email" type="email" autocomplete="email" placeholder="prenom.nom@saladandco.fr">
      <label for="pass">Mot de passe</label>
      <input id="pass" type="password" autocomplete="current-password" placeholder="••••••••">
      <button class="main" id="loginBtn">Se connecter</button>
      <button class="auth-link" id="toReset">Première connexion ou mot de passe oublié ?</button>
      <div class="auth-msg" id="loginMsg"></div>
    </div>
    <!-- Réinitialisation -->
    <div id="view-reset" class="hidden">
      <h1>Mot de passe</h1>
      <p class="sub">Entrez votre e-mail : vous recevrez un lien pour définir votre mot de passe.</p>
      <label for="resetEmail">Adresse e-mail</label>
      <input id="resetEmail" type="email" autocomplete="email" placeholder="prenom.nom@saladandco.fr">
      <button class="main" id="resetBtn">Envoyer le lien</button>
      <button class="auth-link" id="backLogin">← Retour à la connexion</button>
      <div class="auth-msg" id="resetMsg"></div>
    </div>
    <!-- Nouveau mot de passe (retour du lien e-mail) -->
    <div id="view-setpass" class="hidden">
      <h1>Nouveau mot de passe</h1>
      <p class="sub">Choisissez votre mot de passe.</p>
      <label for="newPass">Nouveau mot de passe</label>
      <input id="newPass" type="password" autocomplete="new-password" placeholder="Au moins 8 caractères">
      <button class="main" id="setpassBtn">Enregistrer</button>
      <div class="auth-msg" id="setpassMsg"></div>
    </div>
  </div>
</div>

<!-- ======================= PORTAIL ======================= -->
<div id="portal" class="hidden">
  <div class="hero">
    <div class="hero-in">
      <div class="brand">
        <img src="assets/icons/icon-192.png" alt="Salad&Co">
        <div><h1>Salad&amp;Co</h1><p>Suite d'applications internes</p></div>
      </div>
      <div class="userbox">
        <div class="who"><span>Connecté</span><b id="whoEmail"></b></div>
        <button class="btn-out" id="logoutBtn">Déconnexion</button>
      </div>
    </div>
  </div>
  <main>
    <div class="section-t">Vos applications</div>
    <div id="grid" class="grid"></div>
    <div id="gridEmpty" class="empty hidden">Aucune application ne vous est attribuée pour le moment.<br>Contactez un administrateur.</div>
    <div id="gridLoading" class="loading">Chargement de vos applications…</div>
  </main>
  <footer>Salad&amp;Co · suite interne · à installer sur l'écran d'accueil pour un accès rapide</footer>
</div>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
(function(){
  "use strict";
  var SUPABASE_URL = "https://wplolvjziqqvvcydvfxs.supabase.co";
  var SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbG9sdmp6aXFxdnZjeWR2ZnhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NTAwNzYsImV4cCI6MjEwMDEyNjA3Nn0.DD2sqXCHcVyETPxb78QiBzH21r73y2CAY5LdXCH5k9w";
  if(!window.supabase || !window.supabase.createClient){
    var lm=document.getElementById("loginMsg");
    if(lm){ lm.textContent="Impossible de charger le module de connexion. Vérifiez votre connexion et rechargez la page."; lm.className="auth-msg err"; }
    return;
  }
  var SB = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

  // Icône (valeur page_acl.icone) -> emoji + couleur
  var ICONS = {
    contrat:   {e:"📄", c:"#2a78d6"},
    budget:    {e:"📊", c:"#6d4aa7"},
    heures:    {e:"⏱️", c:"#e0821e"},
    prime:     {e:"🏆", c:"#2e7d32"},
    reserve:   {e:"✅", c:"#0f9d8c"},
    passeport: {e:"🪪", c:"#1b1d1a"},
    planning:  {e:"📅", c:"#1f7a4d"},
    acces:     {e:"🔑", c:"#6cbe2e"},
    lien:      {e:"🔑", c:"#6cbe2e"}
  };
  var $ = function(id){ return document.getElementById(id); };

  // ---------- Navigation entre vues de connexion ----------
  function showAuthView(v){
    ["view-login","view-reset","view-setpass"].forEach(function(id){ $(id).classList.add("hidden"); });
    $(v).classList.remove("hidden");
  }
  $("toReset").onclick   = function(){ showAuthView("view-reset"); };
  $("backLogin").onclick = function(){ showAuthView("view-login"); };

  // ---------- Connexion ----------
  $("loginBtn").onclick = async function(){
    var email = $("email").value.trim(), pass = $("pass").value;
    if(!email || !pass){ msg("loginMsg","Renseignez e-mail et mot de passe.","err"); return; }
    setBusy("loginBtn", true, "Connexion…");
    var r = await SB.auth.signInWithPassword({ email: email, password: pass });
    setBusy("loginBtn", false, "Se connecter");
    if(r.error){ msg("loginMsg", trad(r.error.message), "err"); return; }
    // onAuthStateChange s'occupe d'ouvrir le portail
  };
  $("pass").addEventListener("keydown", function(e){ if(e.key==="Enter") $("loginBtn").click(); });

  // ---------- Réinitialisation ----------
  $("resetBtn").onclick = async function(){
    var email = $("resetEmail").value.trim();
    if(!email){ msg("resetMsg","Entrez votre e-mail.","err"); return; }
    setBusy("resetBtn", true, "Envoi…");
    var r = await SB.auth.resetPasswordForEmail(email, { redirectTo: window.location.href });
    setBusy("resetBtn", false, "Envoyer le lien");
    if(r.error){ msg("resetMsg", trad(r.error.message), "err"); return; }
    msg("resetMsg","E-mail envoyé ✔ Consultez votre boîte de réception.","ok");
  };

  // ---------- Définir un nouveau mot de passe (retour du lien) ----------
  $("setpassBtn").onclick = async function(){
    var np = $("newPass").value;
    if(!np || np.length < 8){ msg("setpassMsg","Au moins 8 caractères.","err"); return; }
    setBusy("setpassBtn", true, "Enregistrement…");
    var r = await SB.auth.updateUser({ password: np });
    setBusy("setpassBtn", false, "Enregistrer");
    if(r.error){ msg("setpassMsg", trad(r.error.message), "err"); return; }
    msg("setpassMsg","Mot de passe enregistré ✔","ok");
  };

  // ---------- Déconnexion ----------
  $("logoutBtn").onclick = async function(){ await SB.auth.signOut(); location.reload(); };

  // ---------- Écoute de l'état d'authentification ----------
  SB.auth.onAuthStateChange(function(event, session){
    if(event === "PASSWORD_RECOVERY"){ openAuth(); showAuthView("view-setpass"); return; }
    if(session && session.user){ openPortal(session.user); }
    else { openAuth(); showAuthView("view-login"); }
  });
  // État initial
  SB.auth.getSession().then(function(res){
    var s = res.data.session;
    if(s && s.user) openPortal(s.user); else openAuth();
  });

  function openAuth(){ $("auth").classList.remove("hidden"); $("portal").classList.add("hidden"); }
  function openPortal(user){
    $("auth").classList.add("hidden");
    $("portal").classList.remove("hidden");
    $("whoEmail").textContent = user.email;
    loadApps(user.email);
  }

  // ---------- Chargement des applis autorisées ----------
  var renderSeq = 0;               // évite les rendus en double (onAuthStateChange peut se déclencher plusieurs fois)
  async function loadApps(email){
    var seq = ++renderSeq;
    $("gridEmpty").classList.add("hidden");
    $("gridLoading").classList.remove("hidden");
    // 1) droits de l'utilisateur
    var acc = await SB.from("onglet_access").select("onglet_id, role").eq("email", email);
    if(seq !== renderSeq) return;  // un rendu plus récent a démarré → on abandonne celui-ci
    if(acc.error){ $("gridLoading").textContent = "Erreur de chargement des droits."; return; }
    var rows = acc.data || [];
    if(!rows.length){ $("grid").innerHTML=""; $("gridLoading").classList.add("hidden"); $("gridEmpty").classList.remove("hidden"); return; }
    var roleById = {}; rows.forEach(function(r){ if(roleById[r.onglet_id]==null) roleById[r.onglet_id] = r.role; });
    var ids = Object.keys(roleById).map(Number);
    // 2) détails des applis
    var pa = await SB.from("page_acl").select("id, onglet, lien, etat, icone, ordre").in("id", ids).order("ordre");
    if(seq !== renderSeq) return;
    if(pa.error){ $("gridLoading").textContent = "Erreur de chargement des applications."; return; }
    $("gridLoading").classList.add("hidden");
    var frag = document.createDocumentFragment();
    (pa.data || []).forEach(function(app){ frag.appendChild(makeCard(app, roleById[app.id])); });
    $("grid").innerHTML = "";       // on ne vide qu'au dernier moment, une seule fois
    $("grid").appendChild(frag);
  }

  function makeCard(app, role){
    var ic = ICONS[app.icone] || ICONS.lien;
    var a = document.createElement("a");
    a.className = "app";
    a.style.setProperty("--ac", ic.c);
    a.href = app.lien || "#";
    if(/^https?:/.test(app.lien)) a.target = "_self";
    var roleClass = (role||"").toLowerCase();
    var badges = "";
    if(role) badges += '<span class="badge '+roleClass+'">'+role+'</span>';
    if(app.etat === "local") badges += ' <span class="badge local">Local</span>';
    a.innerHTML =
      '<div class="top">'+
        '<span class="ic" style="background:'+ic.c+'">'+ic.e+'</span>'+
        '<span style="display:flex;gap:6px">'+badges+'</span>'+
      '</div>'+
      '<div class="nm">'+esc(app.onglet)+'</div>'+
      '<div class="go">Ouvrir →</div>';
    return a;
  }

  // ---------- Utilitaires ----------
  function msg(id, t, cls){ var e=$(id); e.textContent=t; e.className="auth-msg "+(cls||""); }
  function setBusy(id, busy, label){ var b=$(id); b.disabled=busy; b.textContent=label; }
  function esc(s){ var d=document.createElement("div"); d.textContent=s==null?"":s; return d.innerHTML; }
  function trad(m){
    m = m || "";
    if(/Invalid login credentials/i.test(m)) return "E-mail ou mot de passe incorrect.";
    if(/Email not confirmed/i.test(m)) return "E-mail non confirmé.";
    if(/rate limit/i.test(m)) return "Trop de tentatives, réessayez plus tard.";
    return m;
  }

  if("serviceWorker" in navigator){
    window.addEventListener("load", function(){ navigator.serviceWorker.register("sw.js").catch(function(){}); });
  }
})();
</script>
</body>
</html>
