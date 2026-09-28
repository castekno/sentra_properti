import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CityHierarchyExplorer } from './components/CityHierarchyExplorer';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { WhyChooseUs } from './components/WhyChooseUs';
import { DocumentationSection } from './components/DocumentationSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { LiveActivityToast } from './components/LiveActivityToast';

import { City, Project, DocumentationItem, SiteSettings } from './types';
import { 
  fetchCities, 
  fetchProjects, 
  fetchDocumentation, 
  fetchSiteSettings,
  getFirestoreConnectionStatus
} from './lib/firebase';
import { 
  INITIAL_CITIES, 
  INITIAL_PROJECTS, 
  INITIAL_DOCUMENTATION, 
  INITIAL_SETTINGS 
} from './data/initialData';

export default function App() {
  // Main Data States with initial fallbacks
  const [cities, setCities] = useState<City[]>(INITIAL_CITIES);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [docs, setDocs] = useState<DocumentationItem[]>(INITIAL_DOCUMENTATION);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Firestore DB connection and quota states
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState<boolean>(false);
  const [hasDbError, setHasDbError] = useState<boolean>(false);

  // Selected City Filter & Navigation
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Project for Detail Modal (5 photos, map, specs)
  const [activeDetailProject, setActiveDetailProject] = useState<Project | null>(null);
  const [surveyTargetProject, setSurveyTargetProject] = useState<Project | null>(null);

  // Load Data from Firebase Firestore (spdb) on Mount
  useEffect(() => {
    let isMounted = true;
    async function loadFirebaseData() {
      try {
        setIsLoading(true);
        const [cList, pList, dList, sData] = await Promise.all([
          fetchCities(),
          fetchProjects(),
          fetchDocumentation(),
          fetchSiteSettings(),
        ]);

        const dbStatus = getFirestoreConnectionStatus();

        if (isMounted) {
          setIsQuotaExceeded(dbStatus.isQuotaExceeded);
          setHasDbError(dbStatus.hasError || dbStatus.isQuotaExceeded || !dbStatus.isConnected);
          // Hanya aktif jika terhubung ke database tanpa error/kuota habis dan memiliki data proyek nyata
          const isRealDbAvailable = dbStatus.isConnected && !dbStatus.isQuotaExceeded && Boolean(pList && pList.length > 0);
          setIsDbConnected(isRealDbAvailable);

          if (cList && cList.length > 0) setCities(cList);
          if (pList && pList.length > 0) setProjects(pList);
          if (dList && dList.length > 0) setDocs(dList);
          if (sData) setSettings(sData);
        }
      } catch (err) {
        console.warn('Data loading error from Firebase Firestore:', err);
        if (isMounted) {
          setHasDbError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadFirebaseData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Indikator gangguan database (offline, kuota habis, atau koneksi gagal)
  const isDbError = isQuotaExceeded || hasDbError || !isDbConnected;

  // Sinkronisasi SEO Structured Data (ItemList RealEstateListing) saat projects termuat dari database
  useEffect(() => {
    if (!projects || projects.length === 0) return;

    // Periksa deep link ?proyek=slug dari URL (agar tautan spesifik rumah bisa langsung terbuka)
    const params = new URLSearchParams(window.location.search);
    const targetSlug = params.get('proyek');
    if (targetSlug && !activeDetailProject) {
      const matched = projects.find(
        (p) =>
          p.id === targetSlug ||
          p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === targetSlug
      );
      if (matched) {
        setActiveDetailProject(matched);
      }
    }

    // Suntikkan Schema.org terstruktur untuk Google Search Console & Googlebot
    const scriptId = 'google-realestate-items';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const itemsSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'Daftar Perumahan Sentra Properti',
      'url': 'https://sentraproperti.my.id/#properti',
      'itemListElement': projects.map((p, idx) => ({
        '@type': 'ListItem',
        'position': idx + 1,
        'item': {
          '@type': 'SingleFamilyResidence',
          'name': p.name,
          'description': p.shortDescription || p.description,
          'image': p.mainImage,
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': p.cityName || 'Palembang',
            'streetAddress': p.locationAddress || p.cityName
          },
          'offers': {
            '@type': 'Offer',
            'price': p.price,
            'priceCurrency': 'IDR',
            'availability': 'https://schema.org/InStock',
            'url': `https://sentraproperti.my.id/?proyek=${encodeURIComponent(p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}`
          }
        }
      }))
    };

    scriptEl.text = JSON.stringify(itemsSchema);
  }, [projects]);

  // Sinkronisasi Judul Halaman dan URL ketika modal detail proyek dibuka/ditutup
  useEffect(() => {
    if (activeDetailProject) {
      const slug = activeDetailProject.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      document.title = `${activeDetailProject.name} - Sentra Properti`;
      window.history.replaceState(null, '', `?proyek=${slug}`);
    } else {
      document.title = 'Sentra Properti - Solusi Properti Terpercaya | Rumah Subsidi & Komersil Palembang';
      if (window.location.search.includes('proyek=')) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, [activeDetailProject]);

  // Navigation Smooth Scroll
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white antialiased">
      {/* 1. Navbar */}
      <Navbar
        settings={settings}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim()) {
            const el = document.getElementById('kota');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        }}
      />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero
          settings={settings}
          cities={cities}
          onSelectCity={(cId) => {
            setSelectedCityId(cId);
            handleNavigate('kota');
          }}
          onExploreProjects={() => handleNavigate('kota')}
        />

        {/* 3. Hirarki Properti: Kota -> Proyek Perumahan -> Detail Modal */}
        <CityHierarchyExplorer
          cities={cities}
          projects={projects}
          settings={settings}
          selectedCityId={selectedCityId}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          onSelectCity={(cId) => setSelectedCityId(cId)}
          onOpenProjectDetail={(project) => setActiveDetailProject(project)}
          isDbError={isDbError}
        />

        {/* 4. Keunggulan & Trust Factors */}
        <WhyChooseUs />

        {/* 5. Dokumentasi & Serah Terima */}
        <DocumentationSection
          items={docs}
          isDbError={isDbError}
        />

        {/* 6. Hubungi Kami & Booking Survey */}
        <ContactSection
          settings={settings}
          cities={cities}
          projects={projects}
          selectedProjectForSurvey={surveyTargetProject}
        />
      </main>

      {/* 7. Footer */}
      <Footer
        settings={settings}
        cities={cities}
        onNavigate={handleNavigate}
        onSelectCity={(cId) => setSelectedCityId(cId)}
      />

      {/* 8. Floating WhatsApp Button (Sticky bottom right across all scrolls) */}
      <FloatingWhatsApp
        settings={settings}
        activeProjectName={activeDetailProject?.name}
      />

      {/* 8.1. Live Activity Popups / Toast Notification (Mobile & Desktop) */}
      <LiveActivityToast
        projects={projects}
        isDbConnected={isDbConnected}
        isQuotaExceeded={isQuotaExceeded}
        onSelectProject={(proj) => setActiveDetailProject(proj)}
        onOpenConsultation={() => handleNavigate('hubungi-kami')}
      />

      {/* 9. Project Detail Modal (5 Primary Photos, Map, Full Specs, Sharia Payment Calc) */}
      <ProjectDetailModal
        project={activeDetailProject}
        settings={settings}
        onClose={() => setActiveDetailProject(null)}
        onOpenBookingSurvey={(proj) => {
          setSurveyTargetProject(proj);
          handleNavigate('hubungi-kami');
        }}
      />
    </div>
  );
}
