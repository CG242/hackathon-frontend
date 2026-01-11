/**
 * Configuration de l'API backend
 */
export const getApiBaseUrl = (): string => {
  // Priorité: variable d'env (utile en prod / déploiement)
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;

  // En local, si on navigue via IP LAN (ex: http://192.168.x.x:9002),
  // on vise le backend sur le même host.
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:3000`;
  }

  // Fallback SSR/dev
  return 'http://localhost:3000';
};

/**
 * Récupère le token d'authentification depuis le localStorage
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('user');
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
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

