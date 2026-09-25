import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Project } from '../types';
import { ClipboardCheck, MessageCircle, CalendarCheck, X, Sparkles, Home } from 'lucide-react';

interface LiveActivityToastProps {
  projects: Project[];
  onSelectProject?: (project: Project) => void;
  onOpenConsultation?: () => void;
}

// Koleksi Nama-nama Khas Indonesia (Sensor Privasi Bpk/Ibu)
const INDONESIAN_NAMES = [
  'Bpk. Hendra S.***',
  'Ibu Ratna W.***',
  'Bpk. Ahmad Fauzi***',
  'Ibu Sri Rahayu***',
  'Bpk. Wahyu P.***',
  'Ibu Dian A.***',
  'Bpk. Dedi Kurniawan***',
  'Ibu Nurhasanah***',
  'Bpk. Rizky Pratama***',
  'Ibu Maya Sari***',
  'Bpk. Bambang S.***',
  'Ibu Rina Kusuma***',
  'Bpk. Ilham Hidayat***',
  'Ibu Fitriani***',
  'Bpk. Faisal M.***',
  'Ibu Dewi Lestari***',
  'Bpk. Agus Triyono***',
  'Ibu Citra Dewi***',
  'Bpk. Tri Wahyudi***',
  'Ibu Indah Permata***',
  'Bpk. Eko Prasetyo***',
  'Ibu Yuliana Sari***',
  'Bpk. Fajar Nugraha***',
  'Ibu Tari Kusuma***',
  'Bpk. Bayu Anggoro***',
  'Ibu Siti Maryam***',
  'Bpk. Heri Setiawan***',
  'Ibu Lilis Suryani***',
  'Bpk. Aditya Pratama***',
  'Ibu Annisa Putri***',
  'Bpk. Dimas Wardana***',
  'Ibu Novita Sari***',
  'Bpk. Arif Gunawan***',
  'Ibu Wulandari***',
];

// Kota konsumen yang diprioritaskan: Palembang lebih sering (75%), Banyuasin (25%)
// Prabumulih dan Muara Enim tidak dimasukkan
const TARGET_CITIES = ['Palembang', 'Palembang', 'Palembang', 'Banyuasin'];

// Variasi waktu relatif yang natural
const RELATIVE_TIMES = [
  '3 menit yang lalu',
  '7 menit yang lalu',
  '12 menit yang lalu',
  '19 menit yang lalu',
  '27 menit yang lalu',
  '38 menit yang lalu',
  '45 menit yang lalu',
];

type ActivityType = 'consultation' | 'whatsapp' | 'survey';

interface ToastData {
  id: string;
  type: ActivityType;
  name: string;
  city: string;
  projectName: string;
  projectObj?: Project;
  timeAgo: string;
}

// Fisher-Yates Shuffle untuk menjamin urutan acak tanpa repetisi
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const LiveActivityToast: React.FC<LiveActivityToastProps> = ({
  projects,
  onSelectProject,
  onOpenConsultation,
}) => {
  const [currentToast, setCurrentToast] = useState<ToastData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissedPermanently, setIsDismissedPermanently] = useState(false);
  const [, setIsPaused] = useState(false);

  // Deck nama yang di-shuffle agar nama tidak berulang selama sesi berlangsung
  const nameDeckRef = useRef<string[]>([]);
  const timeoutHideRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutNextRef = useRef<NodeJS.Timeout | null>(null);

  // Ambil nama berikutnya dari deck tanpa pengulangan
  const getNextName = useCallback((): string => {
    if (nameDeckRef.current.length === 0) {
      nameDeckRef.current = shuffleArray(INDONESIAN_NAMES);
    }
    return nameDeckRef.current.pop() || 'Calon Pembeli';
  }, []);

  // Ambil nama proyek dari database secara akurat
  const getRandomProject = useCallback((): { name: string; project?: Project } => {
    if (projects && projects.length > 0) {
      const valid = projects.filter((p) => ((p.name || (p as any).title) ?? '').trim().length > 0);
      if (valid.length > 0) {
        const p = valid[Math.floor(Math.random() * valid.length)];
        return { name: p.name || (p as any).title, project: p };
      }
    }
    // Fallback nama proyek Sentra Properti
    const fallbackProjects = [
      'Grand Sentra Harmoni',
      'Sentra Sukajadi',
      'Graha Sentra Asri',
      'Sentra Hills Residence',
    ];
    const name = fallbackProjects[Math.floor(Math.random() * fallbackProjects.length)];
    return { name };
  }, [projects]);

  // Generate data aktivitas baru (1 dari 3 aktivitas valid)
  const generateNewActivity = useCallback((): ToastData => {
    const activityTypes: ActivityType[] = ['consultation', 'whatsapp', 'survey'];
    const chosenType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const chosenCity = TARGET_CITIES[Math.floor(Math.random() * TARGET_CITIES.length)];
    const chosenTime = RELATIVE_TIMES[Math.floor(Math.random() * RELATIVE_TIMES.length)];
    const { name: projName, project: projObj } = getRandomProject();
    const personName = getNextName();

    return {
      id: `${Date.now()}-${Math.random()}`,
      type: chosenType,
      name: personName,
      city: chosenCity,
      projectName: projName,
      projectObj: projObj,
      timeAgo: chosenTime,
    };
  }, [getNextName, getRandomProject]);

  // Fungsi memunculkan notifikasi
  const showToast = useCallback(() => {
    if (isDismissedPermanently) return;
    const newActivity = generateNewActivity();
    setCurrentToast(newActivity);
    setIsVisible(true);

    // Tampil selama 7 detik agar pembeli sempat membaca nama proyek & detail
    if (timeoutHideRef.current) clearTimeout(timeoutHideRef.current);
    timeoutHideRef.current = setTimeout(() => {
      setIsVisible(false);

      // Jeda 22 - 32 detik sebelum notifikasi berikutnya muncul
      const nextDelay = Math.floor(Math.random() * 10000) + 22000;
      if (timeoutNextRef.current) clearTimeout(timeoutNextRef.current);
      timeoutNextRef.current = setTimeout(() => {
        showToast();
      }, nextDelay);
    }, 7000);
  }, [generateNewActivity, isDismissedPermanently]);

  // Siklus awal: Muncul pertama kali 8 detik setelah web dibuka
  useEffect(() => {
    nameDeckRef.current = shuffleArray(INDONESIAN_NAMES);

    const initialDelayTimer = setTimeout(() => {
      showToast();
    }, 8000);

    return () => {
      clearTimeout(initialDelayTimer);
      if (timeoutHideRef.current) clearTimeout(timeoutHideRef.current);
      if (timeoutNextRef.current) clearTimeout(timeoutNextRef.current);
    };
  }, [showToast]);

  // Tombol close manual
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    // Beri jeda 50 detik jika ditutup manual
    if (timeoutNextRef.current) clearTimeout(timeoutNextRef.current);
    timeoutNextRef.current = setTimeout(() => {
      showToast();
    }, 50000);
  };

  // Klik pada toast untuk membuka proyek atau form
  const handleClickToast = () => {
    if (!currentToast) return;
    if (currentToast.projectObj && onSelectProject) {
      onSelectProject(currentToast.projectObj);
    } else if (onOpenConsultation) {
      onOpenConsultation();
    } else {
      const el = document.getElementById('hubungi-kami');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  if (!currentToast || isDismissedPermanently) return null;

  // Konfigurasi visual berdasarkan 3 jenis aktivitas nyata
  const getActivityConfig = () => {
    switch (currentToast.type) {
      case 'consultation':
        return {
          icon: <ClipboardCheck className="w-5 h-5 text-emerald-600 shrink-0" />,
          badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          indicatorColor: 'bg-emerald-500',
          title: 'Konsultasi Terkirim',
          actionVerb: 'mengajukan formulir konsultasi untuk:',
          mobileVerb: 'Konsultasi unit',
          highlightBg: 'bg-emerald-50/80 border-emerald-200/90 text-emerald-950',
          homeIconColor: 'text-emerald-600',
        };
      case 'whatsapp':
        return {
          icon: <MessageCircle className="w-5 h-5 text-teal-600 shrink-0" />,
          badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
          indicatorColor: 'bg-teal-500',
          title: 'Tanya via WhatsApp',
          actionVerb: 'menghubungi marketing terkait unit:',
          mobileVerb: 'Tanya marketing unit',
          highlightBg: 'bg-teal-50/80 border-teal-200/90 text-teal-950',
          homeIconColor: 'text-teal-600',
        };
      case 'survey':
        return {
          icon: <CalendarCheck className="w-5 h-5 text-amber-600 shrink-0" />,
          badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
          indicatorColor: 'bg-amber-500',
          title: 'Jadwal Survey Lokasi',
          actionVerb: 'menanyakan jadwal survey lokasi:',
          mobileVerb: 'Cek jadwal survey',
          highlightBg: 'bg-amber-50/80 border-amber-200/90 text-amber-950',
          homeIconColor: 'text-amber-600',
        };
    }
  };

  const config = getActivityConfig();

  return (
    <>
      {/* ============================================================== */}
      {/* 1. DESKTOP / NORMAL MODE (sm ke atas)                          */}
      {/* Posisi: Melayang di kiri bawah (bottom-6 left-6)              */}
      {/* ============================================================== */}
      <div
        className={`hidden sm:block fixed bottom-6 left-6 z-40 w-[390px] max-w-[calc(100vw-3rem)] transition-all duration-500 ease-out transform ${
          isVisible
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        }`}
        onMouseEnter={() => {
          setIsPaused(true);
          if (timeoutHideRef.current) clearTimeout(timeoutHideRef.current);
        }}
        onMouseLeave={() => {
          setIsPaused(false);
          if (isVisible) {
            timeoutHideRef.current = setTimeout(() => {
              setIsVisible(false);
            }, 3500);
          }
        }}
      >
        <div
          onClick={handleClickToast}
          className="group relative bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-xl hover:shadow-2xl hover:border-emerald-400 transition-all duration-200 cursor-pointer overflow-hidden"
          role="alert"
          aria-live="polite"
        >
          {/* Subtle Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 opacity-90" />

          <div className="flex items-start gap-3.5">
            {/* Icon Avatar */}
            <div className="relative mt-0.5 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-xs">
                {config.icon}
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${config.indicatorColor} animate-pulse`}
              />
            </div>

            {/* Main Content Body */}
            <div className="flex-1 min-w-0">
              {/* Header: Badge & Relative Time */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${config.badgeColor}`}
                >
                  {config.title}
                </span>
                <span className="text-[11px] text-slate-400 font-medium shrink-0">
                  {currentToast.timeAgo}
                </span>
              </div>

              {/* Consumer Info & Action Verb */}
              <p className="text-xs text-slate-600 leading-snug">
                <strong className="font-bold text-slate-800">{currentToast.name}</strong> dari{' '}
                <span className="font-semibold text-emerald-800">{currentToast.city}</span>{' '}
                {config.actionVerb}
              </p>

              {/* NAMA PROYEK: Selalu utuh & tampil menonjol (Tanpa Terpotong) */}
              <div
                className={`mt-2 flex items-center gap-2 px-3 py-1.5 rounded-xl border ${config.highlightBg} transition-all duration-200 group-hover:shadow-xs`}
              >
                <Home className={`w-4 h-4 ${config.homeIconColor} shrink-0`} />
                <span className="text-xs font-bold leading-tight break-words text-slate-900">
                  {currentToast.projectName}
                </span>
              </div>

              {/* Footer hint */}
              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 group-hover:text-emerald-800">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Klik untuk lihat detail & konsultasi</span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-700 p-1 -mr-1 -mt-1 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. MOBILE MODE (< sm)                                          */}
      {/* Posisi: Melayang di bottom-20 left-3 right-3                   */}
      {/* Jauh di atas tombol Konsul kanan bawah agar tidak bertabrakan  */}
      {/* ============================================================== */}
      <div
        className={`sm:hidden fixed bottom-20 left-3 right-3 z-40 max-w-sm mx-auto transition-all duration-300 ease-out transform ${
          isVisible
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-3 scale-95 pointer-events-none'
        }`}
      >
        <div
          onClick={handleClickToast}
          className="relative bg-white/98 backdrop-blur-md border border-slate-200/90 shadow-xl rounded-2xl p-3 active:bg-slate-50 transition-all duration-150 cursor-pointer overflow-hidden"
          role="alert"
          aria-live="polite"
        >
          {/* Left Color Accent Bar */}
          <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-emerald-500 via-teal-500 to-amber-500" />

          <div className="flex items-start gap-2.5 pl-1.5">
            {/* Icon Avatar Compact */}
            <div className="relative shrink-0 mt-0.5">
              <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                {config.icon}
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${config.indicatorColor}`}
              />
            </div>

            {/* Content Mobile Compact & Utuh */}
            <div className="flex-1 min-w-0 pr-1">
              {/* Row 1: Name + City & Time */}
              <div className="flex items-center justify-between gap-1 text-[11px] leading-tight mb-1">
                <span className="font-bold text-slate-800">
                  {currentToast.name}{' '}
                  <span className="font-normal text-slate-500">({currentToast.city})</span>
                </span>
                <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                  {currentToast.timeAgo}
                </span>
              </div>

              {/* Row 2: Action & NAMA PROYEK (Ditampilkan Utuh Tanpa Truncate) */}
              <div className="text-[11px] text-slate-600 leading-snug">
                <span>{config.mobileVerb}: </span>
                <span className="font-bold text-emerald-800 break-words underline decoration-emerald-300 decoration-2 underline-offset-2">
                  {currentToast.projectName}
                </span>
              </div>
            </div>

            {/* Close Mobile Button */}
            <button
              onClick={handleClose}
              className="text-slate-400 active:text-slate-700 p-1 -mr-1 -mt-1 rounded-md hover:bg-slate-100 shrink-0"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
