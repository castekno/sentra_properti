import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  ArrowUp, 
  Building2, 
  Instagram, 
  Facebook, 
  Youtube 
} from 'lucide-react';
import { Logo } from './Logo';
import { City, SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
  cities: City[];
  onNavigate: (sectionId: string) => void;
  onSelectCity: (cityId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  cities,
  onNavigate,
  onSelectCity,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-[#071322] text-white pt-16 pb-12 border-t-4 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-4 space-y-5">
            <Logo size="lg" variant="light" />
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              Sentra Properti adalah agen dan pengembang properti syariah terpercaya yang berkomitmen menghadirkan perumahan berkualitas, legalitas aman 100%, serta skema pembayaran syariah (Cash, Cash Bertahap, Cicilan via Developer dan Cicilan BSI) yang mudah dan transparan di kota-kota strategis Indonesia.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Legalitas & SHM Terjamin
              </span>
            </div>
          </div>

          {/* Col 2: Menu Navigasi */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider font-['Outfit',sans-serif]">
              Menu Utama
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 font-medium">
              <li>
                <button
                  id="footer-nav-home"
                  onClick={() => onNavigate('home')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-kota"
                  onClick={() => onNavigate('kota')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Pilihan Kota & Properti
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-dok"
                  onClick={() => onNavigate('dokumentasi')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Dokumentasi & Serah Terima
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-kontak"
                  onClick={() => onNavigate('hubungi-kami')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Hubungi Kami & Survey
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Kota Pilihan */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider font-['Outfit',sans-serif]">
              Pilihan Kota
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              {cities.map((city) => (
                <button
                  key={city.id}
                  id={`footer-city-${city.id}`}
                  onClick={() => {
                    onSelectCity(city.id);
                    onNavigate('kota');
                  }}
                  className="text-left hover:text-amber-400 truncate transition-colors py-1 cursor-pointer"
                >
                  • {city.name}
                </button>
              ))}
            </div>
          </div>

          {/* Col 4: Kontak Kantor */}
          <div className="lg:col-span-3 space-y-4 text-xs sm:text-sm text-slate-300">
            <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider font-['Outfit',sans-serif]">
              Kontak Resmi
            </h4>
            
            <p className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{settings.officeAddress}</span>
            </p>

            <p className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{settings.phoneNumber}</span>
            </p>

            <p className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{settings.email}</span>
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={settings.instagramUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center transition-colors"
                aria-label="Instagram Sentra Properti"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.facebookUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center transition-colors"
                aria-label="Facebook Sentra Properti"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={settings.youtubeUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center transition-colors"
                aria-label="YouTube Sentra Properti"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Admin Link & Back To Top */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <p>© {new Date().getFullYear()} Sentra Properti - Solusi Properti Terpercaya. Hak Cipta Dilindungi.</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              id="footer-scroll-top-btn"
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-white/10 hover:bg-amber-500 hover:text-slate-950 text-white transition-colors cursor-pointer"
              title="Kembali ke atas"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
