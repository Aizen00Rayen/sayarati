# 🚗 سيارتي · SAYARATI

> منصة رقمية تربط وكالات كراء السيارات بالعملاء — بحث، مقارنة، حجز إلكتروني وإدارة كاملة.
>
> Plateforme numérique connectant les agences de location de voitures et les clients — recherche, comparaison, réservation en ligne et gestion complète.

Bilingue **عربي / Français** (RTL + LTR) · **React + Vite** · **HeroUI v3** · **Supabase** · déployable sur **Cloudflare Pages**.

---

## ✨ Fonctionnalités / المميزات

- 🔎 **Recherche & filtres** — par ville, catégorie, transmission, carburant, prix.
- ⚖️ **Comparateur** — jusqu'à 3 voitures côte à côte.
- ⚡ **Réservation en ligne** — calcul automatique du prix selon les dates.
- ⭐ **Agences & avis** — pages agences avec notes et commentaires.
- 🌐 **Bilingue** — arabe (RTL) et français, bascule instantanée.
- 🛠️ **3 espaces / 3 rôles** :
  - **Client** : réservations, suivi, annulation.
  - **Agence** : création d'agence, gestion des voitures (CRUD), gestion des réservations.
  - **Admin** : modération des agences, gestion des rôles utilisateurs, vue globale (voitures, réservations, revenus).

## 🧱 Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React 19, Vite 6, React Router |
| UI | HeroUI v3 (`@heroui/react` + `@heroui/styles`), Tailwind CSS v4 |
| i18n | i18next / react-i18next |
| Backend | Supabase (Postgres, Auth, Row Level Security) |
| Hébergement | Cloudflare Pages |

---

## 🚀 Démarrage local

```bash
npm install
cp .env.example .env      # les valeurs du projet de démo sont déjà incluses
npm run dev
```

Variables d'environnement (`.env`) :

```
VITE_SUPABASE_URL=https://gyfgdcebmaehonxcabmy.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_v-WTWCbkQHByquJaVS96lg_iVBtp3MD
```

> ℹ️ La clé `publishable` est conçue pour être exposée côté navigateur ; l'accès aux données est protégé par les **politiques RLS** de Supabase.

---

## 🗄️ Configuration de la base de données (à faire une seule fois)

Ouvrez le **Supabase Dashboard → SQL Editor** de votre projet et exécutez, dans l'ordre :

1. **`supabase/schema.sql`** — tables, fonctions, triggers et politiques de sécurité (RLS).
2. **`supabase/seed.sql`** — comptes de démonstration + agences, voitures et avis d'exemple.

### 👤 Comptes de démonstration créés par le seed

| Rôle | Email | Mot de passe |
|---|---|---|
| **Admin** | `admin@sayarati.tn` | `Admin@123` |
| **Agence** | `agency@sayarati.tn` | `Agency@123` |
| **Agence 2** | `agency2@sayarati.tn` | `Agency@123` |
| **Client** | `client@sayarati.tn` | `Client@123` |

La page de connexion propose des boutons « comptes de démonstration » qui pré-remplissent ces identifiants.

> Vous pouvez aussi créer un compte depuis la page **Inscription** (Client ou Agence). Le rôle est appliqué automatiquement via un trigger `handle_new_user`. Pour promouvoir un compte en **admin** manuellement :
> ```sql
> update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'votre@email.com');
> ```

---

## ☁️ Déploiement sur Cloudflare Pages

1. Poussez ce dépôt sur GitHub (déjà fait sur la branche `claude/sayarati-platform-prototype-g5vr2z`).
2. Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Sélectionnez le dépôt et configurez :
   - **Framework preset** : `Vite`
   - **Build command** : `npm run build`
   - **Build output directory** : `dist`
4. **Settings → Environment variables** — ajoutez :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Déployez. Le fichier `public/_redirects` (`/* /index.html 200`) gère le routage SPA.

> N'oubliez pas d'ajouter l'URL Cloudflare Pages dans **Supabase → Authentication → URL Configuration** (Site URL / Redirect URLs).

---

## 📁 Structure

```
src/
├── components/        # Navbar, Footer, CarCard, CompareBar, ui atoms, dash atoms
├── context/           # AuthContext (session + rôle), CompareContext
├── i18n/              # ar.json, fr.json, config RTL/LTR
├── lib/               # supabase client, constants/helpers
├── pages/             # Home, Cars, CarDetail, Agencies, AgencyDetail, Login, Register
│   └── dashboard/     # UserDashboard, AgencyDashboard, AdminDashboard
├── App.jsx            # routes + protection par rôle
└── main.jsx
supabase/
├── schema.sql         # tables + RLS + triggers
└── seed.sql           # comptes démo + données d'exemple
```

---

🇹🇳 Fait avec fierté en Tunisie.
