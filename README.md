# Text Justify API

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green.svg)](https://www.mongodb.com/)
[![Jest](https://img.shields.io/badge/Jest-29.x-red.svg)](https://jestjs.io/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Une API REST en Node.js / TypeScript pour justifier un texte selon les règles typographiques, avec authentification par token et limitation de quota journalier. Déployée publiquement pour démonstration.

---

## Objectif

Fournir une API REST capable de justifier un texte passé en paramètre, chaque ligne ayant exactement **80 caractères** (espaces compris).

---

## Fonctionnalités principales

| Fonctionnalité | Description |
|----------------|-------------|
| **Justification du texte** | Retourne un texte justifié à 80 caractères par ligne. |
| **Authentification par token** | Chaque utilisateur obtient un token via `/api/token`. |
| **Rate limit journalier** | Limite à 80 000 mots/jour pour chaque token sur `/api/justify`. |
| **Erreur 402** | Si le quota est dépassé. |
| **Déploiement public** | Accessible en ligne sur Render. |

---

## Architecture du projet
```
src/
├── __tests__/
│   ├── auth.test.ts         # Tests du middleware d'auth
│   ├── setup.ts             # Setup global des tests
│   └── token.test.ts        # Tests de l'endpoint /api/token
│
├── middlewares/
│   ├── auth.ts              # Vérification / Création du token
│   └── rateLimit.ts         # Gestion du quota journalier
│
├── models/
│   ├── RateLimit.ts         # Modèle de rate limit
│   └── Token.ts             # Modèle de token utilisateur
│
├── routes/
│   ├── justify.ts           # Endpoint /api/justify
│   └── token.ts             # Endpoint /api/token
│
├── utils/
│   └── justifyText.ts       # Fonction de justification (sans lib externe)
│
├── index.ts                # Point d'entrée principal
└── swagger.ts              # Définition Swagger (API docs)

```

---

## Endpoints

### `POST /api/token`

**Description** : Génère un token unique à partir d'une adresse e-mail.

**Body** :
```json
{
  "email": "foo@bar.com"
}
```

**Réponse** :
```json
{
  "token": "votre_token_unique"
}
```

---

### `POST /api/justify`

**Description** : Retourne le texte justifié à 80 caractères par ligne.

**Headers** :
```
Content-Type: text/plain
Authorization: Bearer <votre_token>
```

**Body** :
```
Votre texte à justifier...
```

**Réponse** :
```
Texte justifié avec des lignes de 80 caractères...
```

**Erreur 402** :
```json
{
  "error": "Limite journalière de 80 000 mots atteinte. Passer à la version payante."
}
```

## Technologies

- **Node.js** - Runtime JavaScript
- **TypeScript** - Typage statique
- **Express** - Framework web minimaliste
- **MongoDB + Mongoose** - Base de données NoSQL
- **Jest** - Framework de tests

---

## Tests

Tests inclus pour :
- ✅ Endpoint `/api/token`
- ✅ Middleware auth
- ... à compléter

**Lancer les tests** :
```bash
npm test
```

**Couverture des tests** :
```bash
npm run test:coverage
```

---

## Installation locale

### Prérequis
- Node.js >= 18
- MongoDB (local ou cloud)
- npm ou yarn

### Étapes

1. **Cloner le dépôt**
```bash
git clone https://github.com/PierreTDX/text-justify-api.git
cd text-justify-api
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**

Créer un fichier `.env` à la racine :
```env
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@tictactrip-justify.hhxhivm.mongodb.net/dbname?retryWrites=true&w=majority
```

4. **Lancer en développement**
```bash
npm run dev
```

5. **Lancer en production**
```bash
npm run build
npm start
```

---

## Déploiement

L'API est déployée sur **Render**.

**Lien public** : [https://text-justify-api-ptdx.onrender.com/](https://text-justify-api-ptdx.onrender.com/)

### Variables d'environnement requises
- `MONGODB_URI` : URI de connexion MongoDB
- `PORT` : Port du serveur (optionnel, par défaut 3000)
- `NODE_ENV` : `production`

---

## Contraintes respectées

✅ Justification manuelle **sans librairie externe**  
✅ Lignes de **80 caractères**  
✅ Authentification par **token**  
✅ Rate limit **80 000 mots / jour**  
✅ Déploiement **public**  
✅ TypeScript **structuré et testé**

---

## Documentation API

La documentation Swagger est disponible à l'endpoint `/api-docs` une fois l'API lancée.

---

## Auteur

**Pierre Tondeux**

🔗 GitHub : [@PierreTDX](https://github.com/PierreTDX)  
📧 Email : pierre.tondeux@gmail.com  
💼 LinkedIn : [Pierre Tondeux](https://linkedin.com/in/pierre-tondeux)

---


**Made with ❤️ and TypeScript**