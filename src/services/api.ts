import {
  UserProfile,
  ApplicationItem,
  ConsultationRequest,
  Article,
  Announcement,
  SiteSettings,
  AdminStats
} from '../types';

const TOKEN_KEY = 'itds_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Auth
  async register(body: {
    fullName: string;
    companyName: string;
    email: string;
    mobile: string;
    designation: string;
    password: string;
  }): Promise<{ message: string; token: string; user: UserProfile }> {
    const res = await request<{ message: string; token: string; user: UserProfile }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body)
    });
    setStoredToken(res.token);
    return res;
  },

  async login(body: { email: string; password: string }): Promise<{ message: string; token: string; user: UserProfile }> {
    const res = await request<{ message: string; token: string; user: UserProfile }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body)
    });
    setStoredToken(res.token);
    return res;
  },

  async getMe(): Promise<{ user: UserProfile }> {
    return request<{ user: UserProfile }>('/api/auth/me');
  },

  async updateProfile(body: Partial<UserProfile>): Promise<{ message: string; user: UserProfile }> {
    return request<{ message: string; user: UserProfile }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  logout(): void {
    setStoredToken(null);
  },

  // Applications
  async getApplications(): Promise<{ applications: ApplicationItem[] }> {
    return request<{ applications: ApplicationItem[] }>('/api/applications');
  },

  async getApplication(id: string): Promise<{ application: ApplicationItem }> {
    return request<{ application: ApplicationItem }>(`/api/applications/${id}`);
  },

  async createApplication(data: Partial<ApplicationItem>): Promise<{ application: ApplicationItem }> {
    return request<{ application: ApplicationItem }>('/api/admin/applications', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateApplication(id: string, data: Partial<ApplicationItem>): Promise<{ application: ApplicationItem }> {
    return request<{ application: ApplicationItem }>(`/api/admin/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteApplication(id: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/admin/applications/${id}`, {
      method: 'DELETE'
    });
  },

  // Consultations
  async submitConsultation(data: {
    fullName: string;
    companyName: string;
    designation: string;
    email: string;
    mobile: string;
    plantLocation: string;
    plantType: string;
    consultingTopic: string;
    problemDescription: string;
    currentOperatingParameters: string;
    expectedImprovement: string;
    preferredMethod: string;
    attachments: { name: string; size: number; type: string; dataUrl?: string }[];
  }): Promise<{ message: string; referenceId: string; consultation: any }> {
    return request<{ message: string; referenceId: string; consultation: any }>('/api/consultations', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async trackConsultation(refId: string): Promise<{ consultation: Partial<ConsultationRequest> }> {
    return request<{ consultation: Partial<ConsultationRequest> }>(`/api/consultations/track/${encodeURIComponent(refId)}`);
  },

  async getMyConsultations(): Promise<{ consultations: ConsultationRequest[] }> {
    return request<{ consultations: ConsultationRequest[] }>('/api/consultations/my');
  },

  async getAllConsultations(): Promise<{ consultations: ConsultationRequest[] }> {
    return request<{ consultations: ConsultationRequest[] }>('/api/admin/consultations');
  },

  async updateConsultationStatus(
    id: string,
    data: { status: string; adminNotes?: string }
  ): Promise<{ message: string; consultation: ConsultationRequest }> {
    return request<{ message: string; consultation: ConsultationRequest }>(`/api/admin/consultations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  // Articles
  async getArticles(): Promise<{ articles: Article[] }> {
    return request<{ articles: Article[] }>('/api/articles');
  },

  async createArticle(data: Partial<Article>): Promise<{ article: Article }> {
    return request<{ article: Article }>('/api/admin/articles', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateArticle(id: string, data: Partial<Article>): Promise<{ article: Article }> {
    return request<{ article: Article }>(`/api/admin/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteArticle(id: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/admin/articles/${id}`, {
      method: 'DELETE'
    });
  },

  // Announcements
  async getAnnouncements(): Promise<{ announcements: Announcement[] }> {
    return request<{ announcements: Announcement[] }>('/api/announcements');
  },

  async createAnnouncement(data: Partial<Announcement>): Promise<{ announcement: Announcement }> {
    return request<{ announcement: Announcement }>('/api/admin/announcements', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateAnnouncement(id: string, data: Partial<Announcement>): Promise<{ announcement: Announcement }> {
    return request<{ announcement: Announcement }>(`/api/admin/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteAnnouncement(id: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/api/admin/announcements/${id}`, {
      method: 'DELETE'
    });
  },

  // Settings & Contact
  async getSettings(): Promise<{ settings: SiteSettings }> {
    return request<{ settings: SiteSettings }>('/api/settings');
  },

  async updateSettings(data: Partial<SiteSettings>): Promise<{ settings: SiteSettings }> {
    return request<{ settings: SiteSettings }>('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async sendContact(data: {
    name: string;
    company: string;
    email: string;
    phone: string;
    inquiryType: string;
    message: string;
  }): Promise<{ message: string }> {
    return request<{ message: string }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getAdminStats(): Promise<AdminStats> {
    return request<AdminStats>('/api/admin/stats');
  }
};
