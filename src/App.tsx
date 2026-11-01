import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/home/HomePage';
import { BlastFurnacePage } from './components/blast-furnace/BlastFurnacePage';
import { SupportingPlantsPage } from './components/supporting-plants/SupportingPlantsPage';
import { ApplicationsPage } from './components/applications/ApplicationsPage';
import { ConsultingPage } from './components/consulting/ConsultingPage';
import { KnowledgeCenterPage } from './components/knowledge/KnowledgeCenterPage';
import { NewsPage } from './components/news/NewsPage';
import { ContactPage } from './components/contact/ContactPage';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { ApplicationDetailModal } from './components/applications/ApplicationDetailModal';
import { LegalModal } from './components/legal/LegalModal';
import { api } from './services/api';
import { ApplicationItem, Announcement, Article, SiteSettings } from './types';

const MainApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [settings, setSettings] = useState<SiteSettings | undefined>(undefined);

  // Modals state
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | 'disclaimer' | null>(null);

  // Load global data on initial render
  useEffect(() => {
    Promise.all([
      api.getApplications(),
      api.getAnnouncements(),
      api.getArticles(),
      api.getSettings()
    ])
      .then(([appsRes, annRes, artRes, setRes]) => {
        setApplications(appsRes.applications);
        setAnnouncements(annRes.announcements);
        setArticles(artRes.articles);
        setSettings(setRes.settings);
      })
      .catch((err) => {
        console.error('Failed to load initial site metadata', err);
      });
  }, []);

  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequestConsulting = () => {
    setCurrentTab('consulting');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* Navigation Bar */}
      <Navbar currentTab={currentTab} onTabChange={handleNavigate} />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            applications={applications}
            announcements={announcements}
            articles={articles}
            onNavigate={handleNavigate}
            onRequestConsulting={handleRequestConsulting}
            onSelectApplication={(app) => setSelectedApp(app)}
          />
        )}

        {currentTab === 'blast-furnace' && (
          <BlastFurnacePage onRequestConsulting={handleRequestConsulting} />
        )}

        {currentTab === 'supporting-plants' && (
          <SupportingPlantsPage onRequestConsulting={handleRequestConsulting} />
        )}

        {currentTab === 'applications' && (
          <ApplicationsPage onRequestConsulting={handleRequestConsulting} />
        )}

        {currentTab === 'consulting' && <ConsultingPage />}

        {currentTab === 'knowledge' && (
          <KnowledgeCenterPage onRequestConsulting={handleRequestConsulting} />
        )}

        {currentTab === 'news' && <NewsPage onNavigate={handleNavigate} />}

        {currentTab === 'contact' && (
          <ContactPage
            settings={settings}
            onRequestConsulting={handleRequestConsulting}
          />
        )}

        {currentTab === 'user-dashboard' && (
          <UserDashboard
            onNavigate={handleNavigate}
            onRequestConsulting={handleRequestConsulting}
          />
        )}

        {currentTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Industrial Footer */}
      <Footer
        settings={settings}
        onNavigate={handleNavigate}
        onOpenLegal={(type) => setLegalModalType(type)}
      />

      {/* Modals */}
      <AuthModal />
      <ApplicationDetailModal
        application={selectedApp}
        onClose={() => setSelectedApp(null)}
        onRequestConsulting={handleRequestConsulting}
      />
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
