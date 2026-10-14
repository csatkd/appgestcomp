/**
 * Utilitaires de validation et de sécurité pour DOJANG
 */

// ============================================
// VALIDATION DES ENTRÉES
// ============================================

/**
 * Nettoie une chaîne de caractères en supprimant les caractères dangereux
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Supprimer les balises HTML
    .replace(/javascript:/gi, '') // Supprimer les protocoles dangereux
    .replace(/on\w+\s*=/gi, '') // Supprimer les événements inline
    .slice(0, 500); // Limiter la longueur
}

/**
 * Valide une adresse email
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

/**
 * Valide un numéro de téléphone
 */
export function validatePhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const re = /^[+]?[\d\s-]{8,}$/;
  return re.test(phone.trim());
}

/**
 * Valide une année
 */
export function validateYear(year: number | string): { valid: boolean; error?: string } {
  const yearNum = typeof year === 'string' ? parseInt(year, 10) : year;
  
  if (isNaN(yearNum)) {
    return { valid: false, error: 'Année invalide' };
  }
  
  const currentYear = new Date().getFullYear();
  
  if (yearNum < 1950) {
    return { valid: false, error: 'Année trop ancienne (1950 min.)' };
  }
  
  if (yearNum > currentYear - 5) {
    return { valid: false, error: 'Âge minimum : 5 ans' };
  }
  
  return { valid: true };
}

/**
 * Valide un poids
 */
export function validateWeight(weight: number | string): { valid: boolean; error?: string } {
  const weightNum = typeof weight === 'string' ? parseFloat(weight) : weight;
  
  if (isNaN(weightNum)) {
    return { valid: false, error: 'Poids invalide' };
  }
  
  if (weightNum < 20 || weightNum > 200) {
    return { valid: false, error: 'Poids hors limites (20-200 kg)' };
  }
  
  if (weightNum < 30) {
    return { valid: false, error: 'Attention : poids très faible' };
  }
  
  return { valid: true };
}

/**
 * Valide un nom (prénom ou nom de famille)
 */
export function validateName(name: string): { valid: boolean; error?: string } {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Nom requis' };
  }
  
  const trimmed = name.trim();
  
  if (trimmed.length < 2) {
    return { valid: false, error: 'Nom trop court (2 caractères min.)' };
  }
  
  if (trimmed.length > 50) {
    return { valid: false, error: 'Nom trop long (50 caractères max.)' };
  }
  
  // Vérifier les caractères autorisés
  if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmed)) {
    return { valid: false, error: 'Caractères non autorisés' };
  }
  
  return { valid: true };
}

// ============================================
// VALIDATION DES FICHIERS
// ============================================

/**
 * Valide un fichier uploadé
 */
export function validateFile(
  file: File,
  allowedTypes: string[] = ['application/json', 'text/csv'],
  maxSize: number = 10 * 1024 * 1024 // 10 MB
): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'Aucun fichier sélectionné' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `Type de fichier non autorisé. Types acceptés : ${allowedTypes.join(', ')}` };
  }
  
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return { valid: false, error: `Fichier trop volumineux (max ${maxSizeMB} MB)` };
  }
  
  if (file.size === 0) {
    return { valid: false, error: 'Fichier vide' };
  }
  
  return { valid: true };
}

// ============================================
// RATE LIMITING
// ============================================

/**
 * Classe pour limiter le taux d'actions
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  /**
   * Vérifie si une action peut être effectuée
   */
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
  
  /**
   * Réinitialise les tentatives pour une clé
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }
  
  /**
   * Obtient le nombre de tentatives récentes
   */
  getAttempts(key: string, windowMs: number): number {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    return attempts.filter(t => now - t < windowMs).length;
  }
}

// Instance globale pour les actions de connexion
export const loginRateLimiter = new RateLimiter();

// Instance globale pour les actions sensibles
export const actionRateLimiter = new RateLimiter();

// ============================================
// TOKENS DE SÉCURITÉ
// ============================================

/**
 * Génère un token d'action sécurisé
 */
export function generateActionToken(): string {
  return crypto.randomUUID();
}

/**
 * Valide un token d'action
 */
export function validateActionToken(token: string): boolean {
  const storedToken = sessionStorage.getItem('action_token');
  return storedToken === token;
}

/**
 * Stocke un token d'action
 */
export function storeActionToken(token: string): void {
  sessionStorage.setItem('action_token', token);
}

/**
 * Supprime le token d'action
 */
export function clearActionToken(): void {
  sessionStorage.removeItem('action_token');
}

// ============================================
// CHIFFREMENT
// ============================================

/**
 * Hache une chaîne avec SHA-256
 */
export async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Chiffre des données avec AES-GCM
 */
export async function encryptData(data: string, key: string): Promise<string> {
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
  
  // Combiner IV et données chiffrées
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);
  
  return btoa(String.fromCharCode(...combined));
}

/**
 * Déchiffre des données avec AES-GCM
 */
export async function decryptData(encryptedData: string, key: string): Promise<string> {
  const decoder = new TextDecoder();
  const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
  
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(key),
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    data
  );
  
  return decoder.decode(decrypted);
}

// ============================================
// LOGGING DE SÉCURITÉ
// ============================================

/**
 * Log une action de sécurité
 */
export function logSecurityEvent(
  event: string,
  details: Record<string, any> = {},
  level: 'info' | 'warning' | 'error' = 'info'
): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    level,
    userAgent: navigator.userAgent,
    url: window.location.href,
  };
  
  // Log dans la console
  if (level === 'error') {
    console.error('[SECURITY]', logEntry);
  } else if (level === 'warning') {
    console.warn('[SECURITY]', logEntry);
  } else {
    console.info('[SECURITY]', logEntry);
  }
  
  // Stocker dans localStorage pour audit
  try {
    const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    logs.push(logEntry);
    
    // Garder seulement les 100 derniers logs
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }
    
    localStorage.setItem('security_logs', JSON.stringify(logs));
  } catch (error) {
    console.error('Erreur lors du stockage des logs:', error);
  }
}

/**
 * Récupère les logs de sécurité
 */
export function getSecurityLogs(): any[] {
  try {
    return JSON.parse(localStorage.getItem('security_logs') || '[]');
  } catch {
    return [];
  }
}

/**
 * Efface les logs de sécurité
 */
export function clearSecurityLogs(): void {
  localStorage.removeItem('security_logs');
}

// ============================================
// VALIDATION DES DONNÉES
// ============================================

/**
 * Valide les données d'un athlète
 */
export function validateAthleteData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.firstName) errors.push('Prénom requis');
  if (!data.lastName) errors.push('Nom requis');
  if (!data.gender || !['M', 'F'].includes(data.gender)) errors.push('Genre invalide');
  
  const yearValidation = validateYear(data.birthYear);
  if (!yearValidation.valid) errors.push(yearValidation.error || 'Année invalide');
  
  if (!data.club) errors.push('Club requis');
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Valide les données d'un sponsor
 */
export function validateSponsorData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.name) errors.push('Nom requis');
  if (!data.type) errors.push('Type requis');
  if (!data.level) errors.push('Niveau requis');
  if (!data.contact) errors.push('Contact requis');
  
  if (data.email && !validateEmail(data.email)) {
    errors.push('Email invalide');
  }
  
  if (data.phone && !validatePhone(data.phone)) {
    errors.push('Téléphone invalide');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================
// PROTECTION CSRF
// ============================================

/**
 * Génère un token CSRF
 */
export function generateCSRFToken(): string {
  const token = generateActionToken();
  sessionStorage.setItem('csrf_token', token);
  return token;
}

/**
 * Valide un token CSRF
 */
export function validateCSRFToken(token: string): boolean {
  const storedToken = sessionStorage.getItem('csrf_token');
  return storedToken === token;
}

// ============================================
// SÉCURITÉ DU LOCALSTORAGE
// ============================================

/**
 * Stocke des données de manière sécurisée
 */
export function secureSetItem(key: string, data: any): void {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error('Erreur de stockage:', error);
    logSecurityEvent('storage_error', { key, error }, 'error');
  }
}

/**
 * Récupère des données de manière sécurisée
 */
export function secureGetItem<T>(key: string): T | null {
  try {
    const serialized = localStorage.getItem(key);
    if (!serialized) return null;
    return JSON.parse(serialized);
  } catch (error) {
    console.error('Erreur de lecture:', error);
    logSecurityEvent('storage_error', { key, error }, 'error');
    return null;
  }
}

/**
 * Supprime des données de manière sécurisée
 */
export function secureRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Erreur de suppression:', error);
    logSecurityEvent('storage_error', { key, error }, 'error');
  }
}
