# Suite Salad&Co — applications internes

Portail unifié regroupant les applications internes Salad&Co (contrats, accès,
passeport, planning, primes, levées). Toutes partagent le même backend Supabase.

## Structure du dépôt

```
/
├── index.html                  ← Hub d'accueil (portail / lanceur d'applications)
├── manifest.webmanifest        ← PWA du hub « Salad&Co »
├── sw.js                       ← Service worker commun (réseau d'abord)
│
├── contrats-saladco.html       ← Dashboard Contrats   (ancien index.html)
├── acces-saladco.html          ← Gestion des accès
├── passeport-saladco.html      ← Passeport collaborateur
├── planning-saladco.html       ← Planning des équipes
├── primes-saladco.html         ← Performance & primes
├── levees-saladco.html         ← Levées de réserves   (version la plus récente)
├── budget-saladco.html         ← Synthèse des Budgets 2026  (rapatrié de Netlify)
├── heures-saladco.html         ← Pilotage des Heures        (rapatrié de Netlify)
│
├── assets/
│   ├── css/
│   │   └── saladco.css         ← Charte commune (couleurs, polices, tokens de marque)
│   ├── js/
│   │   ├── saladco-nav.js      ← Lanceur d'applications injecté dans chaque appli
│   │   └── saladco-nav.css     ← Styles du lanceur
│   ├── icons/                  ← Icônes PWA (par défaut + planning)
│   └── manifests/              ← Un manifest PWA par application
│
├── archive/                    ← Anciennes versions conservées (non servies)
│   ├── levees-ancienne-v1.html
│   └── levees-ancienne-v2.html
│
└── README.md
```

## Navigation entre applications

Chaque application charge `assets/js/saladco-nav.js`, qui ajoute un **bouton
flottant « Applications »** en bas à droite de l'écran. Un appui ouvre une
grille de toutes les applis ; l'application courante y est mise en évidence.
Le hub (`index.html`) est le point d'entrée central.

## Ajouter ou renommer une application

Un seul endroit à modifier : la liste `SC_APPS` en haut de
`assets/js/saladco-nav.js` (et, pour la carte du portail, la liste `APPS` dans
`index.html`). Ajouter ensuite dans chaque nouvelle appli, avant `</head>` :

```html
<link rel="stylesheet" href="assets/css/saladco.css">
<link rel="manifest" href="assets/manifests/MONAPP.webmanifest">
<meta name="theme-color" content="#6cbe2e">
<script defer src="assets/js/saladco-nav.js" data-app="MONAPP"></script>
```

## Charte visuelle

Les tokens de marque (vert Salad&Co `#6cbe2e`, encre `#1b1d1a`, polices, rayons,
ombres) sont centralisés dans `assets/css/saladco.css`. Chaque application
conserve sa **couleur d'identité** (code couleur : Contrats bleu, Accès vert,
Planning vert foncé, etc.), reprise à l'identique sur les cartes du hub et dans
le lanceur, pour un système cohérent et lisible.

## Changements de nommage (à noter)

- L'ancien `index.html` (Dashboard Contrats) est renommé **`contrats-saladco.html`**.
  La racine du site (`/`) affiche désormais le **hub**.
- `levees-saladco.html` correspond à l'ancienne version `levees-saladco_2_1.html`
  (la plus complète). Les versions `_2` et originale sont dans `archive/`.
- Les URLs des autres applis (accès, passeport, planning, primes, levées) sont
  **inchangées** — les raccourcis déjà installés continuent de fonctionner.
