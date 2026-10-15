# 🔌 API REST Publique - DOJANG

## Vue d'ensemble

L'API REST publique de DOJANG permet l'intégration avec des systèmes externes, l'automatisation des processus et l'accès programmatique aux données de compétition.

**Base URL** : `https://api.dojang.ci/v1`

---

## 🔐 Authentification

### API Key

Toutes les requêtes API nécessitent une clé API dans le header :

```http
Authorization: Bearer YOUR_API_KEY
```

### Obtenir une clé API

1. Connectez-vous à votre compte DOJANG
2. Allez dans **Administration** → **API Keys**
3. Cliquez sur **Générer une nouvelle clé**
4. Copiez et sauvegardez votre clé (elle ne sera affichée qu'une seule fois)

### Permissions

Les clés API peuvent avoir différents niveaux de permission :
- `read` : Lecture seule
- `write` : Lecture et écriture
- `admin` : Accès complet

---

## 📡 Endpoints

### Athlètes

#### Lister tous les athlètes
```http
GET /athletes
```

**Paramètres de requête** :
- `page` (int) : Numéro de page (défaut: 1)
- `limit` (int) : Nombre d'éléments par page (défaut: 50, max: 100)
- `club` (string) : Filtrer par club
- `category` (string) : Filtrer par catégorie
- `status` (string) : Filtrer par statut (inscrit, pesé, forfait)

**Réponse** :
```json
{
  "data": [
    {
      "id": "ath-123",
      "firstName": "Adama",
      "lastName": "KONÉ",
      "gender": "M",
      "birthYear": 2001,
      "club": "Taekwondo Club d'Abidjan",
      "license": "FITKD-26-1001",
      "weight": 64.2,
      "category": "M-68",
      "status": "pesé",
      "createdAt": "2026-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 127,
    "totalPages": 3
  }
}
```

#### Obtenir un athlète spécifique
```http
GET /athletes/{id}
```

**Réponse** :
```json
{
  "id": "ath-123",
  "firstName": "Adama",
  "lastName": "KONÉ",
  "gender": "M",
  "birthYear": 2001,
  "club": "Taekwondo Club d'Abidjan",
  "license": "FITKD-26-1001",
  "weight": 64.2,
  "category": "M-68",
  "status": "pesé",
  "statistics": {
    "totalMatches": 15,
    "wins": 12,
    "losses": 3,
    "winRate": 80.0,
    "ranking": 5
  },
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-03-10T14:20:00Z"
}
```

#### Créer un athlète
```http
POST /athletes
```

**Corps de la requête** :
```json
{
  "firstName": "Seydou",
  "lastName": "TRAORÉ",
  "gender": "M",
  "birthYear": 1999,
  "club": "INJS Abidjan",
  "license": "FITKD-26-1002"
}
```

**Réponse** : `201 Created`

---

### Clubs

#### Lister tous les clubs
```http
GET /clubs
```

**Paramètres de requête** :
- `page` (int) : Numéro de page
- `limit` (int) : Nombre d'éléments par page
- `city` (string) : Filtrer par ville
- `region` (string) : Filtrer par région

**Réponse** :
```json
{
  "data": [
    {
      "id": "club-1",
      "name": "Taekwondo Club d'Abidjan",
      "city": "Abidjan",
      "region": "Lagunes",
      "president": "M. Kouamé",
      "email": "contact@tkd-abidjan.ci",
      "phone": "+225 27 22 33 44 55",
      "address": "Cocody, Abidjan",
      "athleteCount": 45,
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 8,
    "totalPages": 1
  }
}
```

---

### Compétitions

#### Lister toutes les compétitions
```http
GET /competitions
```

**Paramètres de requête** :
- `status` (string) : Filtrer par statut (brouillon, active, terminee, archivee)
- `type` (string) : Filtrer par type (locale, nationale, internationale)

**Réponse** :
```json
{
  "data": [
    {
      "id": "comp-1",
      "name": "Championnat National FITKD 2026",
      "type": "nationale",
      "status": "active",
      "organizerId": "org-1",
      "startDate": "2026-03-14",
      "endDate": "2026-03-16",
      "venue": "Palais des Sports — Treichville, Abidjan",
      "arenas": 3,
      "createdAt": "2026-01-15T10:00:00Z",
      "updatedAt": "2026-03-10T14:20:00Z"
    }
  ]
}
```

#### Obtenir une compétition spécifique
```http
GET /competitions/{id}
```

**Réponse** :
```json
{
  "id": "comp-1",
  "name": "Championnat National FITKD 2026",
  "type": "nationale",
  "status": "active",
  "organizerId": "org-1",
  "organizer": {
    "id": "org-1",
    "name": "Fédération Ivoirienne de Taekwondo",
    "email": "contact@fitkd.ci"
  },
  "startDate": "2026-03-14",
  "endDate": "2026-03-16",
  "venue": "Palais des Sports — Treichville, Abidjan",
  "arenas": 3,
  "statistics": {
    "totalAthletes": 127,
    "totalClubs": 8,
    "totalMatches": 85,
    "completedMatches": 42
  },
  "createdAt": "2026-01-15T10:00:00Z",
  "updatedAt": "2026-03-10T14:20:00Z"
}
```

---

### Matchs

#### Lister tous les matchs
```http
GET /matches
```

**Paramètres de requête** :
- `competitionId` (string) : Filtrer par compétition
- `categoryId` (string) : Filtrer par catégorie
- `status` (string) : Filtrer par statut (attente, pret, encours, termine)
- `arenaId` (string) : Filtrer par aire

**Réponse** :
```json
{
  "data": [
    {
      "id": "match-1",
      "categoryId": "M-68",
      "round": 1,
      "index": 0,
      "athleteA": {
        "id": "ath-1",
        "firstName": "Adama",
        "lastName": "KONÉ"
      },
      "athleteB": {
        "id": "ath-2",
        "firstName": "Seydou",
        "lastName": "TRAORÉ"
      },
      "scoreA": 12,
      "scoreB": 8,
      "gamjeomA": 1,
      "gamjeomB": 0,
      "winner": "a",
      "status": "termine",
      "arenaId": "arena-1",
      "scheduledTime": "2026-03-15T14:00:00Z",
      "startedAt": "2026-03-15T14:02:00Z",
      "endedAt": "2026-03-15T14:15:00Z"
    }
  ]
}
```

#### Obtenir un match spécifique
```http
GET /matches/{id}
```

**Réponse** :
```json
{
  "id": "match-1",
  "categoryId": "M-68",
  "category": {
    "id": "M-68",
    "label": "Hommes −68 kg"
  },
  "round": 1,
  "roundName": "Quart de finale",
  "index": 0,
  "athleteA": {
    "id": "ath-1",
    "firstName": "Adama",
    "lastName": "KONÉ",
    "club": "Taekwondo Club d'Abidjan",
    "ranking": 5
  },
  "athleteB": {
    "id": "ath-2",
    "firstName": "Seydou",
    "lastName": "TRAORÉ",
    "club": "INJS Abidjan",
    "ranking": 8
  },
  "scoreA": 12,
  "scoreB": 8,
  "gamjeomA": 1,
  "gamjeomB": 0,
  "winner": "a",
  "status": "termine",
  "arenaId": "arena-1",
  "arena": {
    "id": "arena-1",
    "name": "Aire 1"
  },
  "scheduledTime": "2026-03-15T14:00:00Z",
  "startedAt": "2026-03-15T14:02:00Z",
  "endedAt": "2026-03-15T14:15:00Z",
  "referees": [
    {
      "id": "ref-1",
      "firstName": "Ibrahim",
      "lastName": "KONÉ",
      "role": "central"
    }
  ]
}
```

---

### Résultats

#### Obtenir les résultats d'une compétition
```http
GET /competitions/{id}/results
```

**Réponse** :
```json
{
  "competitionId": "comp-1",
  "categories": [
    {
      "categoryId": "M-68",
      "categoryLabel": "Hommes −68 kg",
      "podium": {
        "gold": {
          "id": "ath-1",
          "firstName": "Adama",
          "lastName": "KONÉ",
          "club": "Taekwondo Club d'Abidjan"
        },
        "silver": {
          "id": "ath-2",
          "firstName": "Seydou",
          "lastName": "TRAORÉ",
          "club": "INJS Abidjan"
        },
        "bronze": [
          {
            "id": "ath-3",
            "firstName": "Wilfried",
            "lastName": "AKA",
            "club": "Bouaké TKD Académie"
          },
          {
            "id": "ath-4",
            "firstName": "Moussa",
            "lastName": "DIABATÉ",
            "club": "Yamoussoukro Taekwondo"
          }
        ]
      }
    }
  ],
  "clubRanking": [
    {
      "rank": 1,
      "club": "Taekwondo Club d'Abidjan",
      "gold": 3,
      "silver": 2,
      "bronze": 4,
      "points": 29
    },
    {
      "rank": 2,
      "club": "INJS Abidjan",
      "gold": 2,
      "silver": 3,
      "bronze": 2,
      "points": 23
    }
  ]
}
```

---

### Sponsors

#### Lister tous les sponsors
```http
GET /sponsors
```

**Paramètres de requête** :
- `level` (string) : Filtrer par niveau (or, argent, bronze)
- `status` (string) : Filtrer par statut (actif, en_attente, expire)

**Réponse** :
```json
{
  "data": [
    {
      "id": "sponsor-1",
      "name": "Orange Côte d'Ivoire",
      "type": "principal",
      "level": "or",
      "logo": "https://example.com/logo.png",
      "website": "https://www.orange.ci",
      "contact": "M. Koné Ibrahim",
      "email": "partenariat@orange.ci",
      "phone": "+225 27 20 40 50 60",
      "startDate": "2026-01-01",
      "endDate": "2026-12-31",
      "status": "actif",
      "amount": 15000000,
      "visibility": ["site_web", "tv", "affiches", "maillots", "stand", "reseaux_sociaux", "presse"]
    }
  ]
}
```

---

### Classement ELO

#### Obtenir le classement des athlètes
```http
GET /ranking
```

**Paramètres de requête** :
- `category` (string) : Filtrer par catégorie
- `limit` (int) : Nombre d'éléments (défaut: 50, max: 100)

**Réponse** :
```json
{
  "data": [
    {
      "rank": 1,
      "athleteId": "ath-1",
      "firstName": "Adama",
      "lastName": "KONÉ",
      "club": "Taekwondo Club d'Abidjan",
      "category": "M-68",
      "rating": 1247,
      "matches": 15,
      "wins": 12,
      "losses": 3,
      "winRate": 80.0,
      "trend": "up"
    },
    {
      "rank": 2,
      "athleteId": "ath-2",
      "firstName": "Seydou",
      "lastName": "TRAORÉ",
      "club": "INJS Abidjan",
      "category": "M-68",
      "rating": 1198,
      "matches": 18,
      "wins": 14,
      "losses": 4,
      "winRate": 77.8,
      "trend": "stable"
    }
  ]
}
```

---

## 🔔 Webhooks

### Configuration des Webhooks

Vous pouvez configurer des webhooks pour recevoir des notifications en temps réel :

```http
POST /webhooks
```

**Corps de la requête** :
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["match.completed", "athlete.registered", "result.published"],
  "secret": "your_webhook_secret"
}
```

### Événements disponibles

- `match.completed` : Un match est terminé
- `athlete.registered` : Un nouvel athlète est inscrit
- `athlete.weighed` : Un athlète a été pesé
- `bracket.generated` : Un tirage au sort a été généré
- `result.published` : Un résultat a été publié
- `claim.submitted` : Une réclamation a été soumise
- `claim.resolved` : Une réclamation a été résolue

### Format des payloads

```json
{
  "event": "match.completed",
  "timestamp": "2026-03-15T14:15:00Z",
  "data": {
    "matchId": "match-1",
    "categoryId": "M-68",
    "winner": "a",
    "scoreA": 12,
    "scoreB": 8
  }
}
```

---

## 📚 SDKs

### JavaScript/TypeScript

```bash
npm install @dojang/sdk
```

```typescript
import { DojangClient } from '@dojang/sdk';

const client = new DojangClient({
  apiKey: 'YOUR_API_KEY',
  baseUrl: 'https://api.dojang.ci/v1'
});

// Lister les athlètes
const athletes = await client.athletes.list({
  club: 'Taekwondo Club d\'Abidjan',
  limit: 10
});

// Obtenir un athlète spécifique
const athlete = await client.athletes.get('ath-123');

// Créer un athlète
const newAthlete = await client.athletes.create({
  firstName: 'Seydou',
  lastName: 'TRAORÉ',
  gender: 'M',
  birthYear: 1999,
  club: 'INJS Abidjan'
});
```

### Python

```bash
pip install dojang-sdk
```

```python
from dojang import DojangClient

client = DojangClient(
    api_key='YOUR_API_KEY',
    base_url='https://api.dojang.ci/v1'
)

# Lister les athlètes
athletes = client.athletes.list(club='Taekwondo Club d\'Abidjan', limit=10)

# Obtenir un athlète spécifique
athlete = client.athletes.get('ath-123')

# Créer un athlète
new_athlete = client.athletes.create(
    first_name='Seydou',
    last_name='TRAORÉ',
    gender='M',
    birth_year=1999,
    club='INJS Abidjan'
)
```

---

## ⚠️ Limites de taux

- **100 requêtes par minute** par clé API
- **1000 requêtes par heure** par clé API
- **10000 requêtes par jour** par clé API

Headers de réponse :
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1647350400
```

---

## 🐛 Codes d'erreur

| Code | Description |
|------|-------------|
| 400 | Requête invalide |
| 401 | Non authentifié |
| 403 | Permission refusée |
| 404 | Ressource non trouvée |
| 429 | Trop de requêtes (rate limit) |
| 500 | Erreur serveur |

**Format des erreurs** :
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Le paramètre 'category' est invalide",
    "details": {
      "field": "category",
      "value": "invalid-category"
    }
  }
}
```

---

## 📖 Exemples d'utilisation

### Exemple 1 : Intégration avec un site web de club

```javascript
// Afficher les prochains matchs du club
async function displayUpcomingMatches(clubName) {
  const athletes = await fetch(`https://api.dojang.ci/v1/athletes?club=${encodeURIComponent(clubName)}`, {
    headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
  }).then(r => r.json());
  
  const athleteIds = athletes.data.map(a => a.id);
  
  const matches = await fetch(`https://api.dojang.ci/v1/matches?status=pret`, {
    headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
  }).then(r => r.json());
  
  const clubMatches = matches.data.filter(m => 
    athleteIds.includes(m.athleteA.id) || athleteIds.includes(m.athleteB.id)
  );
  
  return clubMatches;
}
```

### Exemple 2 : Synchronisation avec un système externe

```javascript
// Synchroniser les résultats avec un système de ranking externe
async function syncResults() {
  const results = await fetch('https://api.dojang.ci/v1/competitions/comp-1/results', {
    headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
  }).then(r => r.json());
  
  // Envoyer les résultats au système externe
  await fetch('https://external-ranking-system.com/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(results)
  });
}
```

### Exemple 3 : Notification en temps réel

```javascript
// Configurer un webhook pour les notifications
async function setupWebhook() {
  await fetch('https://api.dojang.ci/v1/webhooks', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url: 'https://your-app.com/webhook',
      events: ['match.completed', 'result.published'],
      secret: 'your_webhook_secret'
    })
  });
}

// Recevoir les notifications
app.post('/webhook', (req, res) => {
  const { event, data } = req.body;
  
  if (event === 'match.completed') {
    console.log(`Match terminé: ${data.matchId}`);
    // Envoyer une notification, mettre à jour une base de données, etc.
  }
  
  res.status(200).send('OK');
});
```

---

## 📞 Support

- **Documentation** : https://docs.dojang.ci/api
- **Email** : api-support@dojang.ci
- **Forum** : https://forum.dojang.ci/api

---

**Version** : 1.0  
**Dernière mise à jour** : 2026  
**Statut** : ✅ Production-ready
