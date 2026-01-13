import { getApiBaseUrl, getAuthHeaders, getAuthToken } from './api-config';

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
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface Hackathon {
  id: string;
  nom: string;
  description?: string;
  dateDebut: Date | string;
  dateFin: Date | string;
  dateLimiteInscription?: Date | string;
  status: 'UPCOMING' | 'ONGOING' | 'PAST';
  registrationGoal?: number;
  currentRegistrations?: number;
  inscriptionOuverte?: boolean;
}

export interface Inscription {
  id: string;
  statut: 'EN_ATTENTE' | 'VALIDE' | 'REFUSE';
  promo?: string | null;
  createdAt: Date | string;
  technologies?: {
    classe?: string;
  };
  user?: User;
  hackathonId: string;
}

export interface Annonce {
  id: string;
  titre: string;
  contenu: string;
  cible: 'PUBLIC' | 'INSCRITS';
  hackathonId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResultatsResponse {
  hackathonId: string | null;
  podiumPublie: boolean;
  preselectionsPubliees: boolean;
  premierPlace?: string | null;
  deuxiemePlace?: string | null;
  troisiemePlace?: string | null;
  preselectionnes: string[];
  documentPreselectionsName?: string | null;
  documentPreselectionsUrl?: string | null;
  hasPreselectionsDocument?: boolean;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role?: string;
  user: {
    id: string;
    email: string;
    nom: string;
    prenom: string;
  };
}

export interface Team {
  id: string;
  nom: string;
  description?: string;
  projetNom?: string;
  hackathonId: string;
  createdAt: string;
  updatedAt: string;
  members: TeamMember[];
}

const handleApiError = async (response: Response) => {
  let message = `${response.status} - ${response.statusText || 'Erreur'}`;
  try {
    const data = await response.json();
    if (data?.message) message = `${response.status} - ${data.message}`;
    else if (Array.isArray(data?.errors) && data.errors.length > 0) {
      message = data.errors.map((err: any) => err.message || err).join(', ');
    }
  } catch {
    // ignore parse errors
  }
  throw new Error(message);
};

const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${getApiBaseUrl()}${endpoint}`;
  const headers = getAuthHeaders();

  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
  };

  const response = await fetch(url, requestOptions);
  if (!response.ok) {
    await handleApiError(response);
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json();
};

const fetchWithToken = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) await handleApiError(response);
  return response;
};

export const authApi = {
  login: (credentials: LoginDto) =>
    apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  register: (payload: RegisterDto) =>
    apiRequest<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getProfile: () => apiRequest<User>('/auth/profile'),
  updateProfile: (data: { nom?: string; prenom?: string }) =>
    apiRequest<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const hackathonApi = {
  // Le backend expose les hackathons sous le préfixe /hackathons
  getPublicHackathon: () => apiRequest<Hackathon>('/hackathons/public'),
  getAllHackathons: () => apiRequest<Hackathon[]>('/hackathons'),
  updateHackathon: (id: string, data: Partial<Hackathon>) =>
    apiRequest<Hackathon>(`/hackathons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

export const adminApi = {
  getProfile: () => apiRequest<User>('/admin/profile'),
  updateProfile: (data: { nom?: string; prenom?: string; email?: string; currentPassword?: string; newPassword?: string }) =>
    apiRequest<User>('/admin/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  getAllInscriptions: () => apiRequest<Inscription[]>('/admin/inscriptions'),
  updateInscription: (id: string, data: Partial<Inscription>) =>
    apiRequest(`/admin/inscriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteInscription: (id: string) =>
    apiRequest(`/admin/inscriptions/${id}`, {
      method: 'DELETE',
    }),
  getAllUsers: () => apiRequest<User[]>('/admin/users'),
  updateUser: (id: string, data: { nom?: string; prenom?: string; email?: string }) =>
    apiRequest<User>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteUser: (id: string) =>
    apiRequest(`/admin/users/${id}`, {
      method: 'DELETE',
    }),
};

export const inscriptionsApi = {
  getMyInscriptions: () => apiRequest<Inscription[]>('/inscriptions/mes-inscriptions'),
  getAllInscriptions: () => apiRequest<Inscription[]>('/admin/inscriptions'),
  updateInscription: (id: string, data: Partial<Inscription>) =>
    apiRequest(`/admin/inscriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteInscription: (id: string) =>
    apiRequest(`/admin/inscriptions/${id}`, {
      method: 'DELETE',
    }),
};

export const annoncesApi = {
  getPublicAnnonces: () => apiRequest<Annonce[]>('/annonces'),
  getAnnoncesInscrits: () => apiRequest<Annonce[]>('/annonces/inscrits'),
  getAllAnnonces: () => apiRequest<Annonce[]>('/annonces/admin/all'),
  createAnnonce: (data: { titre: string; contenu: string; cible: 'PUBLIC' | 'INSCRITS'; hackathonId?: string }) =>
    apiRequest<Annonce>('/annonces/admin/annonces', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateAnnonce: (id: string, data: Partial<Annonce>) =>
    apiRequest<Annonce>(`/annonces/admin/annonces/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteAnnonce: (id: string) =>
    apiRequest(`/annonces/admin/annonces/${id}`, {
      method: 'DELETE',
    }),
};

export const resultatsApi = {
  getPublicResultats: async (): Promise<ResultatsResponse> => {
    const response = await fetch(`${getApiBaseUrl()}/resultats/public`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) await handleApiError(response);
    const data = await response.json();
    const documentUrl =
      data.hasPreselectionsDocument && data.hackathonId
        ? `${getApiBaseUrl()}/resultats/hackathon/${data.hackathonId}/preselections/document`
        : null;
    return {
      ...data,
      documentPreselectionsName: data.documentPreselectionsName || null,
      documentPreselectionsUrl: documentUrl,
    };
  },
  getResultats: (hackathonId: string) => apiRequest(`/resultats/hackathon/${hackathonId}`),
  publishPodium: (hackathonId: string, data: { premierPlace?: string; deuxiemePlace?: string; troisiemePlace?: string }) =>
    apiRequest(`/resultats/hackathon/${hackathonId}/podium`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  publishPreselections: (hackathonId: string, preselectionnes: string[]) =>
    apiRequest(`/resultats/hackathon/${hackathonId}/preselections`, {
      method: 'POST',
      body: JSON.stringify({ preselectionnes }),
    }),
  unpublishPodium: (hackathonId: string) =>
    apiRequest(`/resultats/hackathon/${hackathonId}/podium`, { method: 'DELETE' }),
  unpublishPreselections: (hackathonId: string) =>
    apiRequest(`/resultats/hackathon/${hackathonId}/preselections`, { method: 'DELETE' }),
  uploadPreselectionsDocument: async (hackathonId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${getApiBaseUrl()}/resultats/hackathon/${hackathonId}/preselections/document`, {
      method: 'POST',
      headers: {
        ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
      },
      body: formData,
    });
    if (!response.ok) await handleApiError(response);
    return response.json();
  },
  downloadPreselectionsDocument: (hackathonId: string) =>
    fetchWithToken(`${getApiBaseUrl()}/resultats/hackathon/${hackathonId}/preselections/document`).then((res) => res.blob()),
  deletePreselectionsDocument: (hackathonId: string) =>
    apiRequest(`/resultats/hackathon/${hackathonId}/preselections/document`, { method: 'DELETE' }),
  generateInscriptionsListPdf: async (hackathonId: string) => {
    const response = await fetch(`${getApiBaseUrl()}/resultats/hackathon/${hackathonId}/inscriptions/liste-pdf`, {
      method: 'GET',
      headers: {
        ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
      },
    });
    if (!response.ok) await handleApiError(response);
    return response.blob();
  },
};

export const teamsApi = {
  getPublicTeams: () => apiRequest<Team[]>('/teams/public'),
  getTeamsByHackathon: (hackathonId: string) => apiRequest<Team[]>(`/teams/hackathon/${hackathonId}`),
  getTeamById: (teamId: string) => apiRequest<Team>(`/teams/${teamId}`),
  createTeam: (hackathonId: string, data: { nom: string; description?: string; projetNom?: string }) =>
    apiRequest<Team>(`/teams/hackathon/${hackathonId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTeam: (teamId: string, data: { nom?: string; description?: string; projetNom?: string }) =>
    apiRequest<Team>(`/teams/${teamId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteTeam: (teamId: string) =>
    apiRequest<void>(`/teams/${teamId}`, {
      method: 'DELETE',
    }),
  addMemberToTeam: (teamId: string, userId: string, role?: string) =>
    apiRequest(`/teams/${teamId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId, role }),
    }),
  removeMemberFromTeam: (teamId: string, userId: string) =>
    apiRequest(`/teams/${teamId}/members/${userId}`, {
      method: 'DELETE',
    }),
};

export const aiApi = {
  analyzeInscription: (userId: string) =>
    apiRequest(`/ai/analyze-inscription/${userId}`, {
      method: 'POST',
    }),
};
 