/**
 * Configuration de l'API backend
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Récupère le token d'authentification depuis le localStorage
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const parsed = JSON.parse(user);
      return parsed.access_token || null;
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * Récupère les headers pour les requêtes authentifiées
 */
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

