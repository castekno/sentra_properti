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

import { City, Project, DocumentationItem, SiteSettings } from './types';
import { 
  fetchCities, 
  fetchProjects, 
  fetchDocumentation, 
  fetchSiteSettings
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

        if (isMounted) {
          if (cList && cList.length > 0) setCities(cList);
          if (pList && pList.length > 0) setProjects(pList);
          if (dList && dList.length > 0) setDocs(dList);
          if (sData) setSettings(sData);
        }
      } catch (err) {
        console.warn('Data loading error from Firebase Firestore:', err);
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
        />

        {/* 4. Keunggulan & Trust Factors */}
        <WhyChooseUs />

        {/* 5. Dokumentasi & Serah Terima */}
        <DocumentationSection
          items={docs}
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
