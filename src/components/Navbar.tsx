import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Phone, 
  ShieldCheck, 
  Building2, 
  MapPin, 
  Image as ImageIcon, 
  MessageSquare,
  Search
} from 'lucide-react';
import { Logo } from './Logo';
import { SiteSettings } from '../types';

interface NavbarProps {
  settings: SiteSettings;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  activeSection,
  onNavigate,
  searchQuery = '',
  onSearchChange = (_query: string) => {},
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Building2 },
    { id: 'kota', label: 'Kota', icon: MapPin },
    { id: 'dokumentasi', label: 'Dokumentasi', icon: ImageIcon },
    { id: 'hubungi-kami', label: 'Hubungi Kami', icon: MessageSquare },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const handleWhatsAppContact = () => {
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent('Halo Sentra Properti, saya ingin konsultasi proyek perumahan.')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Top Banner Notice (Optional Microbar) */}
      <div id="top-announcement-bar" className="bg-[#0A192F] text-amber-300 text-xs py-1.5 px-4 hidden md:block border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-200">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Legalitas 100% Aman • SHM Pecah Per Kavling
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">
              Jam Layanan: {settings.workingHours}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <button
              id="topbar-call-btn"
              onClick={handleWhatsAppContact}
              className="hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>Hotline Marketing: {settings.phoneNumber}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        id="main-navbar-header"
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-slate-200/80'
            : 'bg-white py-4 border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className="cursor-pointer focus:outline-none shrink-0"
          >
            <Logo size="md" />
          </a>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="search-input-desktop"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari nama project, kota, kavling, ruko, kosan..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-amber-500 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                  title="Hapus pencarian"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav id="desktop-nav-menu" className="hidden lg:flex items-center gap-1.5 bg-slate-50/80 p-1.5 rounded-full border border-slate-200/80 shadow-inner">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#0B1E36] text-amber-400 shadow-sm'
                      : 'text-slate-700 hover:text-[#0B1E36] hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              id="navbar-wa-cta-btn"
              onClick={handleWhatsAppContact}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Hubungi Marketing</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          id="mobile-nav-drawer" 
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="bg-white w-full rounded-t-3xl p-6 shadow-2xl space-y-6 animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <Logo size="sm" />
              <button
                id="mobile-drawer-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search Bar */}
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="search-input-mobile"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setMobileMenuOpen(false);
                    handleNavClick('kota');
                  }
                }}
                placeholder="Cari nama project, kota, kavling, ruko, kosan..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-100/90 focus:bg-white border border-slate-200 focus:border-amber-500 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                  title="Hapus pencarian"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl font-semibold text-sm transition-all ${
                      isActive
                        ? 'bg-[#0B1E36] text-amber-400 shadow'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 space-y-3">
              <button
                id="mobile-contact-wa-btn"
                onClick={() => {
                  handleWhatsAppContact();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold py-3 rounded-xl shadow"
              >
                <Phone className="w-4 h-4" />
                <span>Konsultasi WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
