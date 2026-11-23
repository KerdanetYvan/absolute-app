# ANOMI

Application web d'information et de promotion des écoles d'animation : une base d'écoles consultable en liste et sur une carte, des articles éditoriaux, des commentaires et un espace d'administration.

> Projet scolaire. Le dossier technique (contexte, matrice décisionnelle, diagrammes de classes, de séquence et de cas d'utilisation) est dans [uml.md](./uml.md).

---

## Fonctionnalités

| Domaine | Détail |
| --- | --- |
| Écoles | Liste des écoles, fiche détaillée (adresse, filières, résumé, site) et carte interactive (Leaflet) |
| Articles | Lecture des articles par adresse lisible (`/article/[slug]`) ; rédaction avec un éditeur de texte riche (Lexical) côté administration |
| Commentaires | Les utilisateurs inscrits commentent les articles |
| Comptes | Inscription avec vérification de l'adresse e-mail, connexion, mot de passe oublié, profil modifiable |
| Administration | Tableau de bord pour gérer les articles, les écoles et les utilisateurs |

Trois profils d'utilisateurs sont prévus : visiteur (lecture libre), utilisateur inscrit (commentaires) et administrateur (gestion du contenu).

---

## Stack

| Couche | Technologie |
| --- | --- |
| Framework | Next.js 15 (App Router) + React 19 |
| Langage | TypeScript (modèles Mongoose en JavaScript) |
| Styles | Tailwind CSS v4 |
| Base de données | MongoDB, via Mongoose |
| Authentification | JWT (`jsonwebtoken`) et mots de passe hachés avec `bcrypt` |
| E-mails | Nodemailer (voir [docs/EMAIL_SETUP.md](./docs/EMAIL_SETUP.md)) |
| Carte | Leaflet + react-leaflet |
| Éditeur | Lexical |

Le front et l'API vivent dans le même projet Next.js : les routes d'API sont dans `app/api/`.

---

## Démarrage

Prérequis : Node.js et une base MongoDB accessible.

```bash
npm install
npm run dev        # http://localhost:3000
```

### Variables d'environnement

Créer un fichier `.env` à la racine (il n'est pas versionné) :

```env
MONGO_URI=mongodb://...        # adresse de la base MongoDB
DB_NAME=...                    # nom de la base
JWT_SECRET=...                 # secret de signature des jetons
NEXT_PUBLIC_BASE_URL=http://localhost:3000   # utilisé dans les liens des e-mails
```

### Commandes

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # ESLint
```

---

## Structure

```
app/
  api/               Routes d'API (articles, commentaires, écoles, utilisateurs, authentification)
  article/[slug]/    Lecture d'un article
  auth/              Connexion, inscription, vérification e-mail, mot de passe oublié
  dashboard/         Administration (articles, écoles, utilisateurs)
  ecoles/[id]/       Fiche d'une école
  ecoles-map/        Carte des écoles
  profile/           Profil et édition du profil
components/          Composants partagés (formulaires, liste d'écoles, carrousel…)
models/              Modèles Mongoose : article, commentaire, école, utilisateur
lib/                 Connexion MongoDB, utilitaires d'authentification, e-mails, données des écoles
```

---

## Documentation

- [uml.md](./uml.md) — dossier technique d'ANOMI (version PDF : [uml.pdf](./uml.pdf))
- [docs/EMAIL_SETUP.md](./docs/EMAIL_SETUP.md) — configuration de l'envoi d'e-mails
