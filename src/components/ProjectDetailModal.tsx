import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  BedDouble, 
  Bath, 
  Car, 
  Maximize2, 
  Zap, 
  Droplets, 
  FileText, 
  Calendar, 
  Layers, 
  Check, 
  MessageCircle, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  Share2,
  Building2
} from 'lucide-react';
import { Project, SiteSettings } from '../types';
import { PaymentSchemeBadges } from './PaymentSchemeBadges';

interface ProjectDetailModalProps {
  project: Project | null;
  settings: SiteSettings;
  onClose: () => void;
  onOpenBookingSurvey: (project: Project) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  settings,
  onClose,
  onOpenBookingSurvey,
}) => {
  if (!project) return null;

  // Active Photo Index
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${project.name} - Sentra Properti`,
        text: `Lihat proyek ${project.name} di ${project.cityName}: ${project.tagline}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Daftar label skema pembayaran yang benar-benar aktif pada proyek ini
  const activeSchemeLabels = React.useMemo(() => {
    const rawSchemes = project?.paymentSchemes;
    if (!rawSchemes || !Array.isArray(rawSchemes) || rawSchemes.length === 0) {
      return [];
    }

    const labels: string[] = [];
    for (const s of rawSchemes) {
      if (!s) continue;
      const lower = s.toString().toLowerCase().trim();
      let label = '';
      if (lower.includes('bertahap') || lower.includes('tempo')) {
        label = 'Cash Bertahap';
      } else if (lower.includes('bsi') || lower.includes('bank')) {
        label = 'Cicilan BSI';
      } else if (lower.includes('dev') || lower.includes('credit') || lower.includes('inhouse')) {
        label = 'Credit Developer';
      } else if (lower.includes('cash') || lower.includes('keras')) {
        label = 'Cash';
      } else {
        label = s.toString().trim();
      }

      if (label && !labels.includes(label)) {
        labels.push(label);
      }
    }

    return labels;
  }, [project?.paymentSchemes]);

  const handleWhatsAppInquiry = () => {
    const cleanNumber = (project.marketingWhatsApp || settings.whatsappNumber).replace(/[^0-9]/g, '');
    const schemeText = activeSchemeLabels.length > 0
      ? ` (${activeSchemeLabels.join(' / ')})`
      : '';
    const message = `Halo Sentra Properti, saya sangat berminat dengan proyek *${project.name}* di *${project.cityName}* (${project.priceDisplay}). Mohon informasi skema pembayaran${schemeText} dan jadwal survey lokasi.`;
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const validPhotos: string[] = React.useMemo(() => {
    if (!project?.photos) return ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];
    const filtered = (Array.isArray(project.photos) ? project.photos : [])
      .filter((p): p is string => typeof p === 'string' && p.trim() !== '');
    const unique: string[] = [];
    for (const url of filtered) {
      if (!unique.includes(url)) {
        unique.push(url);
      }
    }
    // Maksimum 6 foto sesuai kapasitas galeri proyek
    const capped = unique.slice(0, 6);
    return capped.length > 0
      ? capped
      : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];
  }, [project?.photos]);

  const photoCount = validPhotos.length;
  const safeActiveIdx = activePhotoIdx < photoCount ? activePhotoIdx : 0;

  const currentCaption = (project.photoCaptions && project.photoCaptions[safeActiveIdx])
    ? project.photoCaptions[safeActiveIdx]
    : `Foto ${safeActiveIdx + 1} - ${project.name}`;

  return (
    <div 
      id="project-detail-modal-backdrop" 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 lg:p-6"
      onClick={onClose}
    >
      <div 
        id="project-detail-modal-card"
        className="bg-white w-full max-w-5xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] sm:max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar (Compact on Mobile) */}
        <div className="bg-[#0B1E36] text-white px-3.5 py-2.5 sm:px-6 sm:py-4 flex items-center justify-between gap-2 shrink-0 border-b border-amber-500/30">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-amber-500 text-slate-950 font-black text-[10px] sm:text-xs rounded-full uppercase tracking-wider shrink-0">
              {project.status}
            </span>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-xl font-bold font-['Outfit',sans-serif] leading-snug truncate">
                {project.name}
              </h2>
              <p className="text-[11px] sm:text-xs text-amber-200/90 flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{project.cityName} • {project.developer}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              id="modal-share-btn"
              onClick={handleShare}
              title="Bagikan Proyek"
              className="p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            {isCopied && (
              <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-md">
                Tersalin!
              </span>
            )}
            <button
              id="modal-close-btn"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-7 flex-1">
          
          {/* ================= 1. FOTO UTAMA PROJECT ================= */}
          <div id="project-photos-section" className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-base font-bold text-slate-900 flex items-center gap-1.5 sm:gap-2">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-500"></span>
                <span>Foto Proyek ({photoCount} Foto)</span>
              </h3>
              {photoCount > 1 && (
                <span className="text-[10px] sm:text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full">
                  Foto {safeActiveIdx + 1} / {photoCount}
                </span>
              )}
            </div>

            {/* Main Stage Active Photo */}
            <div 
              onClick={() => setIsLightboxOpen(true)}
              className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 aspect-[16/9] max-h-[215px] sm:max-h-none w-full shadow-md group cursor-pointer"
            >
              {validPhotos[safeActiveIdx] ? (
                <img
                  id={`project-photo-main-${safeActiveIdx}`}
                  src={validPhotos[safeActiveIdx]}
                  alt={`${project.name} - ${currentCaption}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                  <Building2 className="w-12 h-12 sm:w-16 sm:h-16 opacity-50" />
                </div>
              )}

              {/* Prev / Next Arrows - Only show if more than 1 photo */}
              {photoCount > 1 && (
                <>
                  <button
                    id="photo-prev-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : photoCount - 1));
                    }}
                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 p-1.5 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-transform hover:scale-110 active:scale-95 cursor-pointer z-10"
                    aria-label="Foto Sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  <button
                    id="photo-next-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhotoIdx((prev) => (prev < photoCount - 1 ? prev + 1 : 0));
                    }}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1.5 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-transform hover:scale-110 active:scale-95 cursor-pointer z-10"
                    aria-label="Foto Selanjutnya"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </>
              )}

              {/* Caption & HD Click Overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-2 sm:p-4 text-white flex items-center justify-between gap-2">
                <p className="text-[11px] sm:text-sm font-semibold tracking-wide flex items-center gap-1.5 min-w-0">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-400 shrink-0"></span>
                  <span className="truncate">{currentCaption}</span>
                </p>

                {/* Tulisan Kuning Kanan Bawah Foto Utama */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLightboxOpen(true);
                  }}
                  className="text-yellow-400 hover:text-yellow-300 font-bold text-[10px] sm:text-sm flex items-center gap-1 shrink-0 bg-black/60 hover:bg-black/80 backdrop-blur-xs px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-yellow-400/50 shadow-sm transition-all cursor-pointer"
                >
                  <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-400" />
                  <span className="hidden xs:inline">Klik foto untuk perbesar (HD)</span>
                  <span className="xs:hidden">Perbesar (HD)</span>
                </button>
              </div>
            </div>

            {/* Thumbnails Grid */}
            {photoCount > 0 && (
              <div className="grid grid-cols-6 gap-1.5 sm:gap-2.5">
                {validPhotos.map((photoUrl, idx) => (
                  <button
                    key={idx}
                    id={`photo-thumb-btn-${idx}`}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative rounded-lg sm:rounded-xl overflow-hidden aspect-[4/3] max-h-12 sm:max-h-20 w-full border-2 transition-all duration-200 cursor-pointer ${
                      safeActiveIdx === idx
                        ? 'border-amber-500 ring-2 ring-amber-400/80 shadow-sm scale-95'
                        : 'border-slate-200/80 bg-slate-100 opacity-75 hover:opacity-100 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={photoUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[8px] sm:text-[10px] font-bold px-1 py-0.2 rounded">
                      #{idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ================= 2. PRICE & KEY HIGHLIGHTS ================= */}
          <div className="bg-amber-50/60 p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-amber-200/80 space-y-2.5 sm:space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-4">
              <div className="space-y-0.5">
                <p className="text-[10px] sm:text-xs font-semibold text-amber-800 uppercase tracking-wider">Harga Penawaran Spesial</p>
                <h3 className="text-xl sm:text-3xl font-black text-[#0B1E36] font-['Outfit',sans-serif] leading-tight">
                  {project.priceDisplay}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-600 flex items-center gap-1 pt-0.5">
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 shrink-0" />
                  <span>{project.address}</span>
                </p>
              </div>

              {/* Desktop Direct CTA Buttons (On mobile these are neatly unified in the sticky bottom bar) */}
              <div className="hidden md:flex items-center gap-2.5 justify-end shrink-0">
                <button
                  id="modal-wa-direct-btn"
                  onClick={handleWhatsAppInquiry}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm py-2.5 px-5 rounded-xl shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Tanya Marketing</span>
                </button>

                <button
                  id="modal-survey-direct-btn"
                  onClick={() => {
                    onOpenBookingSurvey(project);
                    onClose();
                  }}
                  className="flex items-center justify-center gap-2 bg-[#0B1E36] hover:bg-[#122b4d] text-amber-300 font-bold text-sm py-2.5 px-5 rounded-xl shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Survey Lokasi</span>
                </button>
              </div>
            </div>

            {/* Skema Penjualan Tersedia Badges */}
            <div className="pt-2 sm:pt-3 border-t border-amber-200/80">
              <PaymentSchemeBadges schemes={project.paymentSchemes} badgeSize="sm" />
            </div>
          </div>

          {/* ================= 3. DETAIL SPESIFIKASI PROYEK ================= */}
          <div id="project-specs-section" className="space-y-2.5 sm:space-y-4">
            <h3 className="text-sm sm:text-lg font-bold text-[#0B1E36] flex items-center gap-1.5 sm:gap-2">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
              <span>Spesifikasi Bangunan & Unit</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3.5">
              <div className="bg-slate-50 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200/80 flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Maximize2 className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight">Luas Tanah (LT)</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">{project.specs.surfaceArea} m²</p>
                </div>
              </div>

              <div className="bg-slate-50 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200/80 flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Maximize2 className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight">Luas Bangunan (LB)</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">{project.specs.buildingArea} m²</p>
                </div>
              </div>

              <div className="bg-slate-50 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200/80 flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <BedDouble className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight">Kamar Tidur (KT)</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">{project.specs.bedrooms} Kamar</p>
                </div>
              </div>

              <div className="bg-slate-50 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200/80 flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Bath className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight">Kamar Mandi (KM)</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">{project.specs.bathrooms} Kamar</p>
                </div>
              </div>

              <div className="bg-slate-50 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200/80 flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Car className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight">Carport</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">{project.specs.carports} Mobil</p>
                </div>
              </div>

              <div className="bg-slate-50 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200/80 flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Zap className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight">Daya Listrik</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">{project.specs.electricity}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200/80 flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Droplets className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight">Sumber Air</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{project.specs.water}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-200/80 flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight">Legalitas</p>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{project.specs.certificate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= 4. DESKRIPSI & FASILITAS PROYEK ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8">
            <div className="lg:col-span-7 space-y-2.5 sm:space-y-4">
              <h3 className="text-sm sm:text-lg font-bold text-[#0B1E36] flex items-center gap-1.5 sm:gap-2">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                <span>Deskripsi Lengkap Proyek</span>
              </h3>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2 sm:space-y-3 font-normal">
                <p className="font-semibold text-slate-800">{project.tagline}</p>
                <p>{project.fullDescription}</p>
              </div>

              {/* Keunggulan Lokasi */}
              {project.advantages && project.advantages.length > 0 && (
                <div className="pt-1 sm:pt-2 space-y-1.5 sm:space-y-2">
                  <h4 className="text-[11px] sm:text-xs font-bold text-slate-800 uppercase tracking-wider">Keunggulan & Aksesibilitas Lokasi:</h4>
                  <ul className="space-y-1 sm:space-y-1.5">
                    {project.advantages.map((adv, i) => (
                      <li key={i} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 space-y-2.5 sm:space-y-4">
              <h3 className="text-sm sm:text-lg font-bold text-[#0B1E36] flex items-center gap-1.5 sm:gap-2">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                <span>Fasilitas Perumahan</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-1 gap-1.5 sm:gap-2">
                {project.facilities.map((fac, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm font-medium text-slate-800">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-500 shrink-0"></span>
                    <span>{fac}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Modal Sticky Footer Action (Unified & Compact on Mobile) */}
        <div className="p-2.5 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 sm:gap-4 shrink-0">
          <div className="hidden sm:block">
            <p className="text-xs text-slate-500">Tertarik dengan {project.name}?</p>
            <p className="text-sm font-bold text-slate-900">Konsultasi Gratis & Jadwalkan Survey</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              id="modal-footer-close-btn"
              onClick={onClose}
              className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-100 text-xs sm:text-sm cursor-pointer shrink-0"
            >
              Tutup
            </button>

            <button
              id="modal-footer-survey-btn"
              onClick={() => {
                onOpenBookingSurvey(project);
                onClose();
              }}
              className="flex items-center justify-center gap-1.5 bg-[#0B1E36] hover:bg-[#122b4d] text-amber-300 font-bold text-xs sm:text-sm py-2 sm:py-2.5 px-3.5 sm:px-5 rounded-xl shadow transition-all cursor-pointer shrink-0"
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Survey Lokasi</span>
            </button>

            <button
              id="modal-footer-wa-btn"
              onClick={handleWhatsAppInquiry}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs sm:text-sm py-2 sm:py-2.5 px-4 sm:px-6 rounded-xl shadow transition-all cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Chat WhatsApp</span>
            </button>
          </div>
        </div>

      </div>

      {/* ================= FULL SCREEN LIGHTBOX / POPUP HD FOTO ================= */}
      {isLightboxOpen && validPhotos[safeActiveIdx] && (
        <div 
          id="photo-lightbox-modal"
          className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-md flex flex-col justify-between animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Lightbox Header */}
          <div 
            className="p-4 sm:p-6 flex items-center justify-between text-white bg-gradient-to-b from-black/80 to-transparent z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">{project.name}</p>
              <h4 className="text-sm sm:text-base font-bold text-white line-clamp-1">{currentCaption}</h4>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-300 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-xs">
                Foto {safeActiveIdx + 1} dari {photoCount}
              </span>
              <button
                id="close-lightbox-btn"
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all hover:scale-110 active:scale-95 cursor-pointer"
                aria-label="Tutup Tampilan Penuh"
                title="Tutup (ESC)"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Lightbox Main Image Stage */}
          <div 
            className="flex-1 relative flex items-center justify-center p-2 sm:p-6 overflow-hidden select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              id="lightbox-hd-image"
              src={validPhotos[safeActiveIdx]}
              alt={`${project.name} - ${currentCaption}`}
              className="max-h-[80vh] max-w-[95vw] object-contain rounded-xl shadow-2xl transition-all"
            />

            {/* Prev / Next Arrows in Lightbox */}
            {photoCount > 1 && (
              <>
                <button
                  id="lightbox-prev-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : photoCount - 1));
                  }}
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-amber-500 hover:text-slate-950 text-white transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
                  aria-label="Foto Sebelumnya"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  id="lightbox-next-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePhotoIdx((prev) => (prev < photoCount - 1 ? prev + 1 : 0));
                  }}
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-amber-500 hover:text-slate-950 text-white transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
                  aria-label="Foto Selanjutnya"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Lightbox Bottom Thumbnail Bar */}
          <div 
            className="p-3 sm:p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-2 overflow-x-auto z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {validPhotos.map((photoUrl, idx) => (
              <button
                key={idx}
                id={`lightbox-thumb-${idx}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIdx(idx);
                }}
                className={`w-14 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                  safeActiveIdx === idx
                    ? 'border-yellow-400 scale-105 shadow-md ring-2 ring-yellow-400/50'
                    : 'border-white/20 opacity-50 hover:opacity-100 hover:border-white/50'
                }`}
              >
                <img src={photoUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
