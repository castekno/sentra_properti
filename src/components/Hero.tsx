import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  KeyRound, 
  ArrowRight, 
  BadgePercent,
  CheckCircle2
} from 'lucide-react';
import { City, SiteSettings } from '../types';

interface HeroProps {
  settings: SiteSettings;
  cities?: City[];
  onSelectCity?: (cityId: string) => void;
  onSearchQuery?: (query: string, cityId: string) => void;
  onExploreProjects?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onExploreProjects,
}) => {
  return (
    <section id="home" className="relative pt-3 pb-8 md:pt-10 md:pb-24 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-amber-50/50 via-white to-slate-50"></div>
      
      {/* Subtle architectural background texture */}
      <div 
        className="absolute inset-0 -z-10 opacity-5 pointer-events-none bg-cover bg-center"
        style={{ backgroundImage: `url(${settings.heroBgImage})` }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-6 text-center lg:text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-amber-500/10 text-amber-900 border border-amber-400/40 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
              <span>{settings.heroBadge || 'Solusi Properti Terpercaya & Pengalaman'}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0B1E36] tracking-tight leading-tight sm:leading-[1] font-['Outfit',sans-serif] whitespace-pre-line">
              {settings.heroHeadline.split('Sentra Properti')[0]}
              <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 bg-clip-text text-transparent text-3xl sm:text-5xl lg:text-6xl">
                Sentra Properti
              </span>
              <span className="text-lg sm:text-2xl lg:text-3xl font-medium">
                {settings.heroHeadline.split('Sentra Properti')[1] || ''}
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-slate-600 text-xs sm:text-base sm:text-lg max-w-2xl leading-relaxed font-normal mx-auto lg:mx-0">
              {settings.heroSubheadline}
            </p>

            {/* Quick Benefits Bullet Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-3 pt-0.5 sm:pt-1 text-[11px] sm:text-xs md:text-sm font-semibold text-slate-700">
              <div className="flex items-center gap-1 sm:gap-1.5 bg-white/90 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border border-slate-200 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                <span>Sertifikat SHM Pecah</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 bg-white/90 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border border-slate-200 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                <span>Cash, Cash Bertahap, Cicilan InHouse atau BSI</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 bg-white/90 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border border-slate-200 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                <span>Free Biaya AJB, BPHTB & Notaris (S&K Berlaku)</span>
              </div>
            </div>

            {/* Key Trust Stats Pill Bar */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-3 pt-1 sm:pt-2">
              <div className="bg-white/80 p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-200/80 text-center shadow-xs">
                <p className="text-base sm:text-2xl font-black text-[#0B1E36]">{settings.statsExperienceYears}+ Tahun</p>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight">Pengalaman Terpercaya</p>
              </div>
              <div className="bg-white/80 p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-200/80 text-center shadow-xs">
                <p className="text-base sm:text-2xl font-black text-amber-600">{settings.statsTotalUnitsSold.toLocaleString('id-ID')}+</p>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight">Unit Rumah Terjual</p>
              </div>
              <div className="bg-white/80 p-2 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-200/80 text-center shadow-xs">
                <p className="text-base sm:text-2xl font-black text-emerald-600">{settings.statsSatisfactionRate}%</p>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight">Kepuasan Konsumen</p>
              </div>
            </div>

          </div>

          {/* Right Hero Visual Card Banner */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl border-2 sm:border-4 border-white bg-slate-900 aspect-[16/11] sm:aspect-[8/3] lg:aspect-[8/5] group">
              <img
                src={settings.heroBgImage && settings.heroBgImage.trim() !== '' ? settings.heroBgImage : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85'}
                alt="Sentra Properti Premium Housing"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.92]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E36]/95 via-[#0B1E36]/40 to-transparent"></div>

              {/* Bottom Card Summary */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 text-white space-y-1.5 sm:space-y-3">
                <div className="inline-block bg-white/20 backdrop-blur-md px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-semibold text-amber-300 border border-white/20">
                  Pilihan Eksklusif Sentra Properti
                </div>
                <h3 className="text-sm sm:text-xl lg:text-2xl font-bold leading-tight font-['Outfit',sans-serif]">
                  Temukan Cluster Idaman di Kota Pilihan Anda
                </h3>
                <p className="text-[11px] sm:text-sm text-slate-200 line-clamp-1 sm:line-clamp-2">
                  Dikelola langsung oleh developer pengalaman dengan fasilitas lengkap, one gate system, dan keamanan 24 jam.
                </p>

                <button
                  id="hero-explore-projects-btn"
                  onClick={onExploreProjects}
                  className="w-full flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-sm py-2 sm:py-3 rounded-lg sm:rounded-xl shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <span>Pilih Kota & Lihat Proyek</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            {/* Decorative Corner Floating Badge */}
            <div className="hidden sm:flex absolute -bottom-5 -left-5 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center font-bold">
                <KeyRound className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Serah Terima Tepat Waktu</p>
                <p className="text-[11px] text-slate-500">Legalitas Dijamin Aman</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
