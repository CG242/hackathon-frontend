/**
 * Service API pour communiquer avec le backend NestJS
 */

import { API_BASE_URL, getAuthHeaders } from './api-config';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  promo?: string;
  technologies?: string[];
  hackathonId: string;
}

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: 'USER' | 'ADMIN';
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface Hackathon {
  id: string;
  nom: string;
  description: string;
  dateDebut: Date | string;
  dateFin: Date | string;
  dateLimiteInscription: Date | string;
  status: 'UPCOMING' | 'ONGOING' | 'PAST';
  nombreInscriptions?: number;
  countdown?: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export interface Inscription {
  id: string;
  userId: string;
  hackathonId: string;
  promo?: string;
  technologies?: any;
  statut: 'VALIDE' | 'EN_ATTENTE' | 'REFUSE';
  createdAt: Date | string;
  user?: {
    id: string;
    email: string;
    nom: string;
    prenom: string;
  };
  hackathon?: {
    id: string;
    nom: string;
    description?: string;
    dateDebut?: Date | string;
    dateFin?: Date | string;
    status?: string;
  };
}

export interface Annonce {
  id: string;
  titre: string;
  contenu: string;
  cible: 'PUBLIC' | 'INSCRITS';
  sentAt?: Date | string;
  hackathonId?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  hackathon?: {
    id: string;
    nom: string;
  };
}

export interface DashboardStats {
  hackathon?: {
    id: string;
    nom: string;
    status: string;
  };
  totalInscrits: number; // Le backend retourne "totalInscrits" pas "totalInscriptions"
  inscriptionsAujourdhui?: number; // Optionnel, peut ne pas être retourné
  parPromo: Array<{ promo: string; count: number }>; // Le backend retourne un array
  parTechnologie: Array<{ technologie: string; count: number }>; // Le backend retourne un array
  inscriptionsParJour?: Array<{ date: string; count: number }>; // Optionnel
  message?: string; // Message optionnel si aucun hackathon actif
}

export interface ApiError {
  message: string;
  statusCode: number;
}

/**
 * Gestion des erreurs API
 */
const handleApiError = async (response: Response): Promise<never> => {
  let errorMessage = 'Une erreur est survenue';
  let errorData: any = {};
  
  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorData.error?.message || errorMessage;
    } else {
      const text = await response.text();
      errorMessage = text || response.statusText || errorMessage;
    }
  } catch (parseError) {
    errorMessage = response.statusText || 'Erreur lors de la lecture de la réponse';
  }
  
  const error: ApiError & { data?: any } = {
    message: errorMessage,
    statusCode: response.status,
    data: errorData,
  };
  
  // Ajouter les détails de l'erreur pour faciliter le débogage
  (error as any).response = response;
  (error as any).status = response.status;
  
  throw error;
};

/**
 * Effectue une requête API
 */
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = getAuthHeaders();
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return response.json();
  } catch (error: any) {
    // Améliorer la gestion des erreurs réseau
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Impossible de se connecter au serveur. Vérifiez que le backend est démarré.');
    }
    throw error;
  }
};

/**
 * API d'authentification
 */
export const authApi = {
  /**
   * Connexion
   */
  login: async (credentials: LoginDto): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Inscription (register crée aussi l'inscription au hackathon)
   */
  register: async (data: RegisterDto) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Récupérer le profil utilisateur
   */
  getProfile: async (): Promise<User> => {
    return apiRequest<User>('/auth/profile');
  },

  /**
   * Mettre à jour le profil
   */
  updateProfile: async (data: { nom?: string; prenom?: string }): Promise<User> => {
    return apiRequest<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Changer le mot de passe
   */
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    return apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

/**
 * API des hackathons
 */
export const hackathonApi = {
  /**
   * Récupérer le hackathon public actuel/à venir
   */
  getPublicHackathon: async (): Promise<Hackathon> => {
    return apiRequest<Hackathon>('/hackathons/public');
  },

  /**
   * Récupérer tous les hackathons disponibles pour inscription
   */
  getAvailableHackathons: async (): Promise<Hackathon[]> => {
    return apiRequest<Hackathon[]>('/hackathons/available');
  },

  /**
   * Récupérer les hackathons passés
   */
  getPastHackathons: async (page = 1, limit = 10, year?: number) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (year) params.append('year', year.toString());
    
    return apiRequest(`/hackathons/past?${params}`);
  },

  /**
   * Récupérer un hackathon par ID
   */
  getHackathonById: async (id: string): Promise<Hackathon> => {
    return apiRequest<Hackathon>(`/hackathons/${id}`);
  },

  /**
   * Créer un hackathon (Admin)
   */
  createHackathon: async (data: any): Promise<Hackathon> => {
    return apiRequest<Hackathon>('/hackathons', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Modifier un hackathon (Admin)
   */
  updateHackathon: async (id: string, data: any): Promise<Hackathon> => {
    return apiRequest<Hackathon>(`/hackathons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Supprimer un hackathon (Admin)
   */
  deleteHackathon: async (id: string) => {
    return apiRequest(`/hackathons/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * API des inscriptions
 */
export const inscriptionsApi = {
  /**
   * Récupérer mes inscriptions
   */
  getMyInscriptions: async (): Promise<Inscription[]> => {
    return apiRequest<Inscription[]>('/inscriptions/mes-inscriptions');
  },

  /**
   * Récupérer une inscription par ID
   */
  getInscriptionById: async (id: string): Promise<Inscription> => {
    return apiRequest<Inscription>(`/inscriptions/${id}`);
  },

  /**
   * Supprimer une inscription
   */
  deleteInscription: async (id: string) => {
    return apiRequest(`/inscriptions/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * API des annonces
 */
export const annoncesApi = {
  /**
   * Récupérer les annonces publiques
   */
  getPublicAnnonces: async (): Promise<Annonce[]> => {
    return apiRequest<Annonce[]>('/annonces/public');
  },

  /**
   * Récupérer les annonces pour inscrits
   */
  getAnnoncesInscrits: async (): Promise<Annonce[]> => {
    return apiRequest<Annonce[]>('/annonces/inscrits');
  },

  /**
   * Récupérer une annonce par ID
   */
  getAnnonceById: async (id: string): Promise<Annonce> => {
    return apiRequest<Annonce>(`/annonces/${id}`);
  },

  /**
   * Créer une annonce (Admin)
   */
  createAnnonce: async (data: {
    titre: string;
    contenu: string;
    cible: 'PUBLIC' | 'INSCRITS';
    hackathonId?: string;
  }): Promise<Annonce> => {
    return apiRequest<Annonce>('/admin/annonces', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Modifier une annonce (Admin)
   */
  updateAnnonce: async (id: string, data: {
    titre?: string;
    contenu?: string;
    cible?: 'PUBLIC' | 'INSCRITS';
    hackathonId?: string;
  }): Promise<Annonce> => {
    return apiRequest<Annonce>(`/annonces/admin/annonces/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Supprimer une annonce (Admin)
   */
  deleteAnnonce: async (id: string) => {
    return apiRequest(`/annonces/admin/annonces/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * API administrateur
 */
export const adminApi = {
  /**
   * Récupérer les statistiques du dashboard
   */
  getDashboard: async (): Promise<DashboardStats> => {
    return apiRequest<DashboardStats>('/admin/dashboard');
  },

  /**
   * Récupérer toutes les inscriptions (Admin uniquement)
   */
  getAllInscriptions: async (): Promise<Inscription[]> => {
    return apiRequest<Inscription[]>('/admin/inscriptions');
  },

  /**
   * Récupérer les métriques système
   */
  getMetrics: async () => {
    return apiRequest('/admin/monitoring/metrics');
  },

  /**
   * Récupérer les logs IA
   */
  getMonitoringLogs: async (page = 1, limit = 50, type?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (type) params.append('type', type);
    
    return apiRequest(`/admin/monitoring/logs?${params}`);
  },

  /**
   * Modifier une inscription (Admin uniquement)
   */
  updateInscription: async (id: string, data: { statut?: string; promo?: string; technologies?: any }): Promise<Inscription> => {
    return apiRequest<Inscription>(`/admin/inscriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Supprimer une inscription (Admin uniquement)
   */
  deleteInscription: async (id: string) => {
    return apiRequest(`/admin/inscriptions/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Récupérer tous les utilisateurs (Admin uniquement)
   */
  getAllUsers: async (): Promise<User[]> => {
    return apiRequest<User[]>('/admin/users');
  },

  /**
   * Modifier un utilisateur (Admin uniquement)
   */
  updateUser: async (id: string, data: { nom?: string; prenom?: string; email?: string; role?: string }): Promise<User> => {
    return apiRequest<User>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Supprimer un utilisateur (Admin uniquement)
   */
  deleteUser: async (id: string) => {
    return apiRequest(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * API des résultats
 */
export const resultatsApi = {
  /**
   * Récupérer les résultats publics du hackathon actuel
   */
  getPublicResultats: async () => {
    return apiRequest('/resultats/public');
  },

  /**
   * Récupérer les résultats d'un hackathon (Admin uniquement)
   */
  getResultats: async (hackathonId: string) => {
    return apiRequest(`/resultats/hackathon/${hackathonId}`);
  },

  /**
   * Publier le podium (Admin uniquement)
   */
  publishPodium: async (hackathonId: string, data: { premierPlace?: string; deuxiemePlace?: string; troisiemePlace?: string }) => {
    return apiRequest(`/resultats/hackathon/${hackathonId}/podium`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Publier les présélections (Admin uniquement)
   */
  publishPreselections: async (hackathonId: string, preselectionnes: string[]) => {
    return apiRequest(`/resultats/hackathon/${hackathonId}/preselections`, {
      method: 'POST',
      body: JSON.stringify({ preselectionnes }),
    });
  },

  /**
   * Dépublier le podium (Admin uniquement)
   */
  unpublishPodium: async (hackathonId: string) => {
    return apiRequest(`/resultats/hackathon/${hackathonId}/podium`, {
      method: 'DELETE',
    });
  },

  /**
   * Dépublier les présélections (Admin uniquement)
   */
  unpublishPreselections: async (hackathonId: string) => {
    return apiRequest(`/resultats/hackathon/${hackathonId}/preselections`, {
      method: 'DELETE',
    });
  },
};

/**
 * API IA
 */
export const aiApi = {
  /**
   * Analyser une inscription utilisateur (Admin)
   */
  analyzeInscription: async (userId: string) => {
    return apiRequest(`/ai/analyze-inscription/${userId}`, {
      method: 'POST',
    });
  },
};

