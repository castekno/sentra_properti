import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Project } from '../types';
import { ClipboardCheck, MessageCircle, CalendarCheck, X } from 'lucide-react';

interface LiveActivityToastProps {
  projects: Project[];
  onSelectProject?: (project: Project) => void;
  onOpenConsultation?: () => void;
  isDbConnected?: boolean;
  isQuotaExceeded?: boolean;
}

// Koleksi 60+ Nama-nama Khas Indonesia dengan sensor suku kata privasi
const INDONESIAN_NAMES = [
  'Bpk. Ahmad Fa***',
  'Bpk. Ase***',
  'Ibu Rat***',
  'Bpk. Hen***',
  'Ibu Sri Rah***',
  'Bpk. Wah***',
  'Ibu Dia***',
  'Bpk. Ded***',
  'Ibu Nurhas***',
  'Bpk. Riz***',
  'Ibu May***',
  'Bpk. Bam***',
  'Ibu Rin***',
  'Bpk. Ilh***',
  'Ibu Fit***',
  'Bpk. Fai***',
  'Ibu Dew***',
  'Bpk. Agu***',
  'Ibu Cit***',
  'Bpk. Tri Wah***',
  'Ibu Ind***',
  'Bpk. Ek***',
  'Ibu Yul***',
  'Bpk. Faj***',
  'Ibu Tar***',
  'Bpk. Bay***',
  'Ibu Sit***',
  'Bpk. Dim***',
  'Bpk. Ari***',
  'Ibu Wul***',
  'Bpk. Jok***',
  'Bpk. Her***',
  'Ibu Lil***',
  'Bpk. Adi***',
  'Ibu Ann***',
  'Ibu Nov***',
  'Bpk. Rid***',
  'Ibu Des***',
  'Bpk. Pra***',
  'Ibu Ang***',
  'Bpk. Tau***',
  'Ibu Mar***',
  'Bpk. Gun***',
  'Ibu Mel***',
  'Bpk. Sya***',
  'Ibu Les***',
  'Bpk. Teg***',
  'Ibu Kus***',
  'Bpk. Bag***',
  'Ibu Put***',
  'Bpk. Dan***',
  'Ibu Meg***',
  'Bpk. Fir***',
  'Ibu Ast***',
  'Bpk. Muh***',
  'Ibu Lis***',
  'Bpk. Kur***',
  'Ibu Kar***',
  'Bpk. Ron***',
  'Ibu Suw***',
  'Bpk. Yud***',
  'Ibu Sal***',
];

// Kota calon konsumen: Palembang lebih dominan (75%), Banyuasin (25%)
const TARGET_CITIES = ['Palembang', 'Palembang', 'Palembang', 'Banyuasin'];

// Waktu relatif yang realistis dan ringkas
const RELATIVE_TIMES = [
  '4 mnt lalu',
  '7 mnt lalu',
  '12 mnt lalu',
  '16 mnt lalu',
  '25 mnt lalu',
  '33 mnt lalu',
  '45 mnt lalu',
  '1 jam lalu',
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
  isDbConnected = false,
  isQuotaExceeded = false,
}) => {
  const [currentToast, setCurrentToast] = useState<ToastData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissedPermanently] = useState(false);

  // Notifikasi HANYA diizinkan jika koneksi database aktif, kuota tidak habis, dan ada proyek nyata dari database
  const isEnabled = Boolean(isDbConnected) && !isQuotaExceeded && Array.isArray(projects) && projects.length > 0;

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

  // Ambil nama proyek dari database secara akurat tanpa dummy fallback
  const getRandomProject = useCallback((): { name: string; project?: Project } | null => {
    if (projects && projects.length > 0) {
      const valid = projects.filter((p) => ((p.name || (p as any).title) ?? '').trim().length > 0);
      if (valid.length > 0) {
        const p = valid[Math.floor(Math.random() * valid.length)];
        return { name: p.name || (p as any).title, project: p };
      }
    }
    return null;
  }, [projects]);

  // Generate data aktivitas baru (1 dari 3 aktivitas valid)
  const generateNewActivity = useCallback((): ToastData | null => {
    const projData = getRandomProject();
    if (!projData || !projData.name) return null;

    const activityTypes: ActivityType[] = ['consultation', 'whatsapp', 'survey'];
    const chosenType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const chosenCity = TARGET_CITIES[Math.floor(Math.random() * TARGET_CITIES.length)];
    const chosenTime = RELATIVE_TIMES[Math.floor(Math.random() * RELATIVE_TIMES.length)];
    const personName = getNextName();

    return {
      id: `${Date.now()}-${Math.random()}`,
      type: chosenType,
      name: personName,
      city: chosenCity,
      projectName: projData.name,
      projectObj: projData.project,
      timeAgo: chosenTime,
    };
  }, [getNextName, getRandomProject]);

  // Fungsi memunculkan notifikasi
  const showToast = useCallback(() => {
    if (isDismissedPermanently || !isEnabled) return;
    const newActivity = generateNewActivity();
    if (!newActivity) return;

    setCurrentToast(newActivity);
    setIsVisible(true);

    // Tampil selama 7 detik agar pembeli sempat membaca nama proyek & detail
    if (timeoutHideRef.current) clearTimeout(timeoutHideRef.current);
    timeoutHideRef.current = setTimeout(() => {
      setIsVisible(false);

      // Jeda 35 detik - 60 detik sebelum notifikasi berikutnya muncul
      const minSeconds = 35;
      const maxSeconds = 60;
      const randomSeconds = Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds;
      const nextDelayMs = randomSeconds * 1000;

      if (timeoutNextRef.current) clearTimeout(timeoutNextRef.current);
      timeoutNextRef.current = setTimeout(() => {
        showToast();
      }, nextDelayMs);
    }, 7000);
  }, [generateNewActivity, isDismissedPermanently, isEnabled]);

  // Siklus awal: Muncul pertama kali 8 detik setelah web dibuka jika database aktif
  useEffect(() => {
    if (!isEnabled) {
      setIsVisible(false);
      setCurrentToast(null);
      if (timeoutHideRef.current) clearTimeout(timeoutHideRef.current);
      if (timeoutNextRef.current) clearTimeout(timeoutNextRef.current);
      return;
    }

    nameDeckRef.current = shuffleArray(INDONESIAN_NAMES);

    const initialDelayTimer = setTimeout(() => {
      showToast();
    }, 8000);

    return () => {
      clearTimeout(initialDelayTimer);
      if (timeoutHideRef.current) clearTimeout(timeoutHideRef.current);
      if (timeoutNextRef.current) clearTimeout(timeoutNextRef.current);
    };
  }, [showToast, isEnabled]);

  // Tombol close manual
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    // Beri jeda 35 detik - 60 detik jika ditutup manual
    const minSeconds = 35;
    const maxSeconds = 60;
    const randomSeconds = Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds;
    const nextDelayMs = randomSeconds * 1000;

    if (timeoutNextRef.current) clearTimeout(timeoutNextRef.current);
    timeoutNextRef.current = setTimeout(() => {
      showToast();
    }, nextDelayMs);
  };

  // Klik pada toast untuk membuka proyek atau form secara mulus
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

  if (!isEnabled || !currentToast || isDismissedPermanently) return null;

  // Konfigurasi visual ringkas & kalimat alami sesuai aktivitas
  const getActivityConfig = () => {
    switch (currentToast.type) {
      case 'consultation':
        return {
          icon: <ClipboardCheck className="w-4 h-4 text-emerald-600 shrink-0" />,
          iconBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          dotColor: 'bg-emerald-500',
          actionText: 'baru saja mengajukan formulir konsultasi untuk',
        };
      case 'whatsapp':
        return {
          icon: <MessageCircle className="w-4 h-4 text-teal-600 shrink-0" />,
          iconBg: 'bg-teal-50 border-teal-200 text-teal-700',
          dotColor: 'bg-teal-500',
          actionText: 'baru saja menghubungi marketing terkait unit di',
        };
      case 'survey':
        return {
          icon: <CalendarCheck className="w-4 h-4 text-amber-600 shrink-0" />,
          iconBg: 'bg-amber-50 border-amber-200 text-amber-700',
          dotColor: 'bg-amber-500',
          actionText: 'baru saja menanyakan jadwal survey untuk',
        };
    }
  };

  const config = getActivityConfig();

  return (
    <div
      className={`fixed bottom-20 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-auto sm:w-[380px] sm:max-w-[calc(100vw-3rem)] z-40 transition-all duration-300 ease-out transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-3 scale-95 pointer-events-none'
      }`}
      onMouseEnter={() => {
        if (timeoutHideRef.current) clearTimeout(timeoutHideRef.current);
      }}
      onMouseLeave={() => {
        if (isVisible) {
          timeoutHideRef.current = setTimeout(() => {
            setIsVisible(false);
          }, 3500);
        }
      }}
    >
      <div
        onClick={handleClickToast}
        className="group relative bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 shadow-xl hover:shadow-2xl hover:border-emerald-300 transition-all duration-200 cursor-pointer overflow-hidden"
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-start gap-2.5">
          {/* Avatar Icon Ringkas dengan Titik Live Indicator */}
          <div className="relative mt-0.5 shrink-0">
            <div
              className={`w-8 h-8 rounded-xl border flex items-center justify-center shadow-2xs ${config.iconBg}`}
            >
              {config.icon}
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${config.dotColor} animate-pulse`}
            />
          </div>

          {/* Kalimat Alami Ringkas & Padat (Nama Proyek utuh tanpa tombol & tanpa pemotongan) */}
          <div className="flex-1 min-w-0 pr-1">
            <p className="text-xs text-slate-700 leading-snug break-words">
              <strong className="font-bold text-slate-900">{currentToast.name}</strong>{' '}
              dari <span className="font-semibold text-slate-800">{currentToast.city}</span>{' '}
              {config.actionText}{' '}
              <strong className="font-bold text-emerald-800">
                {currentToast.projectName}
              </strong>
              .{' '}
              <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap ml-0.5">
                {currentToast.timeAgo}
              </span>
            </p>
          </div>

          {/* Tombol Tutup Silang (X) Ringkas */}
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-700 p-1 -mr-1 -mt-1 rounded-md hover:bg-slate-100 transition-colors shrink-0"
            aria-label="Tutup notifikasi"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
