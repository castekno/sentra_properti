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

  // Sinkronisasi Judul Halaman, Meta Description, Canonical, dan Schema Breadcrumb ala Pinhome ketika proyek dibuka/ditutup
  useEffect(() => {
    const baseUrl = 'https://sentraproperti.my.id';
    const canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const metaDescEl = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    const ogTitleEl = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
    const ogDescEl = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
    const ogUrlEl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement | null;
    const ogImageEl = document.querySelector('meta[property="og:image"]') as HTMLMetaElement | null;
    const twTitleEl = document.querySelector('meta[name="twitter:title"]') as HTMLMetaElement | null;
    const twDescEl = document.querySelector('meta[name="twitter:description"]') as HTMLMetaElement | null;

    const projectSchemaId = 'google-active-project-schema';
    let projectSchemaEl = document.getElementById(projectSchemaId) as HTMLScriptElement | null;

    if (activeDetailProject) {
      const p = activeDetailProject;
      const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const projectUrl = `${baseUrl}/?proyek=${slug}`;
      const category = p.type || 'Rumah';
      const cityClean = (p.cityName || 'Palembang').replace(/\s+Kota$/i, '');
      const locArea = p.location || p.address || cityClean;

      // Format Harga singkat (misal Rp 550 Juta atau Rp 550.000.000)
      const priceText =
        p.price >= 1000000000
          ? `Rp ${(p.price / 1000000000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} Miliar`
          : p.price >= 1000000
          ? `Rp ${Math.round(p.price / 1000000).toLocaleString('id-ID')} Juta`
          : p.priceDisplay || 'Hubungi Kami';

      // Judul ala Pinhome: "Dijual Rumah Qeena Jeju Residence di Tanjung Barangan Palembang - Sentra Properti"
      const seoTitle = `Dijual ${category} ${p.name} di ${locArea} ${cityClean} - Sentra Properti`;

      // Deskripsi ala Pinhome: "Rumah dengan 2 kamar tidur serta luas tanah 275 m² di perumahan Ready Stock di Tanjung Barangan, Palembang harga Rp 550 Juta."
      const specsPart =
        p.specs?.bedrooms && p.specs.bedrooms > 0
          ? `dengan ${p.specs.bedrooms} kamar tidur serta luas tanah ${p.specs?.surfaceArea || 90} m² (LB ${p.specs?.buildingArea || 60} m²)`
          : `dengan luas tanah ${p.specs?.surfaceArea || 90} m²`;
      const seoDesc = `${category} ${specsPart} di perumahan komersil & syariah (${p.status || 'Ready Stock'}) di ${p.address ? `${p.address}, ` : ''}${locArea}, ${cityClean} harga ${priceText}. Legalitas SHM aman bersama Sentra Properti.`;

      document.title = seoTitle;
      window.history.replaceState(null, '', `?proyek=${slug}`);

      if (canonicalEl) canonicalEl.href = projectUrl;
      if (metaDescEl) metaDescEl.content = seoDesc;
      if (ogTitleEl) ogTitleEl.content = seoTitle;
      if (ogDescEl) ogDescEl.content = seoDesc;
      if (ogUrlEl) ogUrlEl.content = projectUrl;
      if (twTitleEl) twTitleEl.content = seoTitle;
      if (twDescEl) twDescEl.content = seoDesc;

      const rawImg = p.photos?.[0] || p.mainImage || '';
      const fullImgUrl = rawImg.startsWith('http') ? rawImg : `${baseUrl}${rawImg.startsWith('/') ? '' : '/'}${rawImg}`;
      if (ogImageEl && rawImg) ogImageEl.content = fullImgUrl;

      // Suntikkan Schema BreadcrumbList (untuk menampilkan sentraproperti.my.id › Palembang Kota › Bukit Baru) + SingleFamilyResidence
      if (!projectSchemaEl) {
        projectSchemaEl = document.createElement('script');
        projectSchemaEl.id = projectSchemaId;
        projectSchemaEl.type = 'application/ld+json';
        document.head.appendChild(projectSchemaEl);
      }

      const activeSchema = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Sentra Properti',
                'item': `${baseUrl}/`,
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': p.cityName || 'Palembang Kota',
                'item': `${baseUrl}/#kota`,
              },
              {
                '@type': 'ListItem',
                'position': 3,
                'name': locArea,
                'item': projectUrl,
              },
            ],
          },
          {
            '@type': 'SingleFamilyResidence',
            'name': seoTitle,
            'description': seoDesc,
            'url': projectUrl,
            'image': fullImgUrl,
            'numberOfRooms': p.specs?.bedrooms || 2,
            'floorSize': {
              '@type': 'QuantitativeValue',
              'value': p.specs?.surfaceArea || 90,
              'unitCode': 'MTK',
            },
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': p.address || locArea,
              'addressLocality': locArea,
              'addressRegion': p.cityName || 'Palembang',
              'addressCountry': 'ID',
            },
            'offers': {
              '@type': 'Offer',
              'price': p.price || 0,
              'priceCurrency': 'IDR',
              'availability': 'https://schema.org/InStock',
              'url': projectUrl,
            },
          },
        ],
      };
      projectSchemaEl.text = JSON.stringify(activeSchema);
    } else {
      const defaultTitle = 'Sentra Properti - Solusi Properti Terpercaya | Rumah Subsidi & Komersil Palembang';
      const defaultDesc =
        'Platform resmi Sentra Properti (sentraproperti.my.id). Informasi perumahan subsidi dan komersil terpercaya di Palembang & sekitarnya dengan skema syariah & legalitas 100% aman.';

      document.title = defaultTitle;
      if (canonicalEl) canonicalEl.href = `${baseUrl}/`;
      if (metaDescEl) metaDescEl.content = defaultDesc;
      if (ogTitleEl) ogTitleEl.content = defaultTitle;
      if (ogDescEl) ogDescEl.content = defaultDesc;
      if (ogUrlEl) ogUrlEl.content = `${baseUrl}/`;
      if (twTitleEl) twTitleEl.content = defaultTitle;
      if (twDescEl) twDescEl.content = defaultDesc;
      if (projectSchemaEl) projectSchemaEl.remove();

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
