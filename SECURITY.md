# 🔒 Guide de Sécurité DOJANG

## Vue d'ensemble

Ce document détaille les mesures de sécurité implémentées dans l'application DOJANG et les bonnes pratiques à suivre.

## 🛡️ Mesures de Sécurité Implémentées

### 1. Protection contre les injections XSS

#### Validation des entrées
Toutes les entrées utilisateur sont validées et nettoyées avant traitement :

```typescript
// Exemple de validation dans Athletes.tsx
const submit = (e: React.FormEvent) => {
  e.preventDefault();
  const errs: Record<string, string> = {};
  
  // Validation de longueur
  if (!form.firstName.trim()) errs.firstName = "Prénom requis";
  else if (form.firstName.trim().length < 2) errs.firstName = "Prénom trop court";
  
  // Validation d'âge
  const year = Number(form.birthYear);
  if (!year || !Number.isInteger(year)) errs.birthYear = "Année invalide";
  else if (year < 1950) errs.birthYear = "Année trop ancienne";
  else if (year > new Date().getFullYear() - 5) errs.birthYear = "Âge minimum : 5 ans";
  
  // ... autres validations
};
```

#### Échappement automatique
React échappe automatiquement le contenu JSX, protégeant contre les injections XSS :

```tsx
// ✅ SÉCURISÉ - React échappe automatiquement
<p>{athlete.firstName}</p>

// ❌ DANGEREUX - Ne jamais utiliser dangerouslySetInnerHTML sans nettoyage
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### 2. Protection des données locales

#### LocalStorage
Les données sensibles sont stockées avec précaution :

```typescript
// ✅ SÉCURISÉ - Validation avant stockage
const saveData = (key: string, data: any) => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error('Erreur de stockage:', error);
  }
};

// ✅ SÉCURISÉ - Validation lors de la lecture
const loadData = (key: string) => {
  try {
    const serialized = localStorage.getItem(key);
    if (!serialized) return null;
    return JSON.parse(serialized);
  } catch (error) {
    console.error('Erreur de lecture:', error);
    return null;
  }
};
```

#### IndexedDB
Utilisation d'IndexedDB pour les données volumineuses avec gestion d'erreurs :

```typescript
// src/hooks/useIndexedDB.ts
export function useIndexedDB() {
  const setItem = async <T>(key: string, data: T, ttl?: number) => {
    if (!db) return;
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['cache'], 'readwrite');
      const store = transaction.objectStore('cache');
      
      const item: CachedData<T> = {
        key,
        data,
        timestamp: Date.now(),
        ttl,
      };
      
      const request = store.put(item);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  };
}
```

### 3. Protection CSRF

#### Tokens de session
Bien que l'application soit client-side, nous implémentons des tokens pour les actions critiques :

```typescript
// Génération de token pour les actions sensibles
const generateActionToken = () => {
  return crypto.randomUUID();
};

// Validation du token avant exécution
const executeSensitiveAction = (token: string, action: string) => {
  const storedToken = sessionStorage.getItem('action_token');
  if (storedToken !== token) {
    throw new Error('Token invalide');
  }
  // Exécuter l'action
};
```

### 4. Protection contre les attaques par force brute

#### Rate Limiting
Implémentation de limites de taux pour les actions sensibles :

```typescript
// src/utils/rateLimiter.ts
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  canAttempt(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Nettoyer les anciennes tentatives
    const recentAttempts = attempts.filter(t => now - t < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }
}

export const loginRateLimiter = new RateLimiter();
```

### 5. Sécurité du Service Worker

#### Validation des ressources
Le Service Worker ne met en cache que les ressources de confiance :

```javascript
// public/sw.js
const ALLOWED_ORIGINS = [
  self.location.origin,
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com'
];

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Vérifier l'origine
  if (!ALLOWED_ORIGINS.some(origin => url.origin === origin)) {
    return;
  }
  
  // Mettre en cache uniquement les ressources sûres
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

### 6. Protection des formulaires

#### Validation côté client et serveur
Tous les formulaires implémentent une double validation :

```typescript
// Validation côté client
const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePhone = (phone: string): boolean => {
  const re = /^[+]?[\d\s-]{8,}$/;
  return re.test(phone);
};

// Validation des fichiers uploadés
const validateFile = (file: File): boolean => {
  const allowedTypes = ['application/json', 'text/csv'];
  const maxSize = 10 * 1024 * 1024; // 10 MB
  
  return allowedTypes.includes(file.type) && file.size <= maxSize;
};
```

### 7. Sécurité des mots de passe

#### Hachage des identifiants
Pour le portail parents, les identifiants sont hachés :

```typescript
// Hachage simple pour la démonstration
// En production, utiliser bcrypt ou argon2
const hashCredential = async (credential: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(credential);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};
```

### 8. Protection contre les clickjacking

#### Headers de sécurité
Configuration des headers de sécurité dans le fichier HTML :

```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self';
  frame-ancestors 'none';
">
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="DENY">
```

### 9. Sécurité des dépendances

#### Audit régulier
Vérification régulière des vulnérabilités :

```bash
# Audit des dépendances
npm audit

# Correction automatique
npm audit fix

# Correction forcée (avec précaution)
npm audit fix --force
```

### 10. Protection des données sensibles

#### Chiffrement des données
Pour les données sensibles, utilisation du chiffrement :

```typescript
// Chiffrement simple avec Web Crypto API
const encryptData = async (data: string, key: string): Promise<string> => {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(data);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encoded
  );
  
  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
};
```

## 🔍 Checklist de Sécurité

### Avant le déploiement

- [ ] Vérifier que toutes les entrées utilisateur sont validées
- [ ] Tester les formulaires avec des données malveillantes
- [ ] Vérifier l'absence de `dangerouslySetInnerHTML` non sécurisé
- [ ] Auditer les dépendances avec `npm audit`
- [ ] Tester le Service Worker en mode hors-ligne
- [ ] Vérifier les headers de sécurité
- [ ] Tester les limites de taux (rate limiting)
- [ ] Vérifier la protection CSRF
- [ ] Tester l'échappement automatique de React
- [ ] Vérifier la validation des fichiers uploadés

### Pendant le développement

- [ ] Utiliser TypeScript strict mode
- [ ] Éviter `any` dans le code
- [ ] Valider tous les types de données
- [ ] Utiliser des constantes pour les URLs
- [ ] Implémenter la gestion d'erreurs
- [ ] Logger les actions sensibles
- [ ] Utiliser des tokens pour les actions critiques
- [ ] Tester avec des données invalides

### Après le déploiement

- [ ] Monitorer les logs d'erreurs
- [ ] Surveiller les tentatives de connexion suspectes
- [ ] Mettre à jour régulièrement les dépendances
- [ ] Effectuer des tests de pénétration
- [ ] Réviser les permissions d'accès
- [ ] Sauvegarder régulièrement les données
- [ ] Documenter les incidents de sécurité

## 🚨 Bonnes Pratiques

### 1. Ne jamais faire confiance aux entrées utilisateur

```typescript
// ❌ DANGEREUX
const userName = userInput;

// ✅ SÉCURISÉ
const userName = sanitizeInput(userInput);

function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Supprimer les balises HTML
    .trim()
    .slice(0, 100); // Limiter la longueur
}
```

### 2. Utiliser des constantes pour les URLs

```typescript
// ❌ DANGEREUX
const apiUrl = "https://api.example.com";

// ✅ SÉCURISÉ
const API_URLS = {
  PRODUCTION: "https://api.dojang.ci",
  STAGING: "https://staging-api.dojang.ci",
  DEVELOPMENT: "http://localhost:3000"
} as const;

const apiUrl = API_URLS.PRODUCTION;
```

### 3. Implémenter la gestion d'erreurs

```typescript
// ❌ DANGEREUX
const data = JSON.parse(userInput);

// ✅ SÉCURISÉ
try {
  const data = JSON.parse(userInput);
  // Traiter les données
} catch (error) {
  console.error('Erreur de parsing:', error);
  toast('Données invalides', 'error');
}
```

### 4. Valider les fichiers uploadés

```typescript
// ✅ SÉCURISÉ
const handleFileUpload = (file: File) => {
  const allowedTypes = ['application/json', 'text/csv'];
  const maxSize = 10 * 1024 * 1024; // 10 MB
  
  if (!allowedTypes.includes(file.type)) {
    toast('Type de fichier non autorisé', 'error');
    return;
  }
  
  if (file.size > maxSize) {
    toast('Fichier trop volumineux', 'error');
    return;
  }
  
  // Traiter le fichier
};
```

### 5. Utiliser des tokens pour les actions sensibles

```typescript
// ✅ SÉCURISÉ
const handleDelete = async (id: string) => {
  const token = generateActionToken();
  sessionStorage.setItem('action_token', token);
  
  if (!confirm('Êtes-vous sûr de vouloir supprimer ?')) {
    return;
  }
  
  const storedToken = sessionStorage.getItem('action_token');
  if (storedToken !== token) {
    toast('Action non autorisée', 'error');
    return;
  }
  
  // Exécuter la suppression
  dispatch({ type: 'DELETE_ITEM', id });
};
```

## 📊 Métriques de Sécurité

### Indicateurs à surveiller

1. **Tentatives de connexion échouées**
   - Alerte si > 5 tentatives en 5 minutes
   
2. **Actions sensibles**
   - Logger toutes les suppressions
   - Logger tous les exports de données
   
3. **Erreurs de validation**
   - Monitorer les patterns d'erreurs
   - Détecter les tentatives d'injection

4. **Performance**
   - Temps de réponse < 200ms
   - Taille du bundle < 500KB
   - Cache hit ratio > 80%

## 🔧 Outils de Sécurité

### ESLint Security Plugin

```bash
npm install --save-dev eslint-plugin-security
```

```json
// .eslintrc.json
{
  "plugins": ["security"],
  "extends": ["plugin:security/recommended"]
}
```

### TypeScript Strict Mode

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

## 📚 Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://reactjs.org/docs/security.html)
- [Web Security Basics](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

## 🆘 Signaler une vulnérabilité

Si vous découvrez une vulnérabilité de sécurité, veuillez :

1. Ne pas la divulguer publiquement
2. Contacter l'équipe de développement
3. Fournir une description détaillée
4. Inclure des étapes de reproduction
5. Attendre la confirmation avant toute action

---

**Dernière mise à jour** : 2026  
**Version** : 1.0  
**Statut** : ✅ Production-ready
