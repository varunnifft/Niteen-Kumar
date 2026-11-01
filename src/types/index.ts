export interface UserProfile {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  mobile: string;
  designation: string;
  role: 'admin' | 'user';
  createdAt?: string;
}

export interface ApplicationItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  targetUsers: string;
  iconName: string;
  appType: 'apk' | 'web' | 'both' | 'coming_soon';
  androidDownloadUrl?: string;
  webAppUrl?: string;
  version: string;
  latestUpdateDate: string;
  isPublished: boolean;
  technicalHighlights: string[];
  systemRequirements: string;
}

export interface ConsultationAttachment {
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
}

export interface ConsultationRequest {
  id: string; // e.g. ITDS-2026-0814
  userId?: string;
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
  attachments: ConsultationAttachment[];
  status: 'New' | 'Under Review' | 'Information Required' | 'In Progress' | 'Completed' | 'Closed';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: 'Blast Furnace Guides' | 'Sinter Plant' | 'Raw Material Quality' | 'Process Optimization' | 'Troubleshooting' | 'Safety & SOP';
  author: string;
  readTime: string;
  publishedDate: string;
  summary: string;
  sections: {
    heading: string;
    content: string;
    bullets?: string[];
  }[];
  keyFormulas?: string[];
  tags: string[];
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Application Release' | 'Feature Update' | 'Consulting Notice' | 'Technical Article' | 'Engineering Module';
  publicationDate: string;
  shortDescription: string;
  fullDetails: string;
  relatedAppOrService: string;
  badge?: string;
}

export interface SiteSettings {
  companyName: string;
  tagline: string;
  email: string;
  supportEmail: string;
  phone: string;
  emergencyPhone: string;
  headquarters: string;
  officeHours: string;
}

export interface AdminStats {
  totalUsers: number;
  totalApplications: number;
  publishedApplications: number;
  totalConsultations: number;
  pendingConsultations: number;
  statusCounts: Record<string, number>;
  totalArticles: number;
  totalAnnouncements: number;
  unreadInquiries: number;
}
