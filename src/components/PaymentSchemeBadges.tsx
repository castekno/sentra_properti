import React, { useState } from 'react';
import { CreditCard, CheckCircle2, X, Info } from 'lucide-react';

export type PaymentSchemeType = 'cash' | 'bertahap' | 'bsi' | 'developer' | string;

interface PaymentSchemeBadgesProps {
  schemes?: PaymentSchemeType[];
  className?: string;
  badgeSize?: 'sm' | 'md';
}

interface SchemeConfig {
  id: string;
  label: string;
  title: string;
  pillClasses: string;
  iconClasses: string;
  modalTheme: {
    badgeBg: string;
    border: string;
    headerBg: string;
    titleColor: string;
  };
  description: string;
}

const SCHEME_CONFIGS: Record<string, SchemeConfig> = {
  cash: {
    id: 'cash',
    label: 'Cash',
    title: 'Skema Pembayaran Cash',
    pillClasses: 'border-blue-200 bg-blue-50/90 text-blue-600 hover:bg-blue-100/70',
    iconClasses: 'text-blue-600',
    modalTheme: {
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      border: 'border-blue-500',
      headerBg: 'from-blue-600 to-indigo-700',
      titleColor: 'text-blue-900',
    },
    description: 'Pelunasan langsung dalam waktu 14-30 hari. Dan akan mendapat promo sesuai dengan yang disepakati.',
  },
  bertahap: {
    id: 'bertahap',
    label: 'Cash Bertahap',
    title: 'Skema Pembayaran Cash Bertahap',
    pillClasses: 'border-amber-300 bg-amber-50/90 text-[#8a420b] hover:bg-amber-100/70',
    iconClasses: 'text-[#8a420b]',
    modalTheme: {
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-300',
      border: 'border-amber-500',
      headerBg: 'from-amber-600 to-amber-700',
      titleColor: 'text-amber-900',
    },
    description: 'Cicilan langsung inhouse ke developer tanpa bank. Tenor fleksibel 6 - 60 bulan (tergantung Cluster) dengan skema 0% bunga murni syariah tanpa denda dan sita.',
  },
  developer: {
    id: 'developer',
    label: 'Credit Developer',
    title: 'Skema Pembayaran Credit Developer',
    pillClasses: 'border-indigo-200 bg-indigo-50/90 text-indigo-700 hover:bg-indigo-100/70',
    iconClasses: 'text-indigo-600',
    modalTheme: {
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      border: 'border-indigo-500',
      headerBg: 'from-indigo-600 to-purple-700',
      titleColor: 'text-indigo-900',
    },
    description: 'Cicilan langsung inhouse ke developer tanpa BI checking dan proses perbankan rumit. Transaksi syariah langsung aman dan tenor bersahabat.',
  },
  bsi: {
    id: 'bsi',
    label: 'Bank BSI',
    title: 'Skema Pembiayaan Bank BSI',
    pillClasses: 'border-emerald-200 bg-emerald-50/90 text-emerald-700 hover:bg-emerald-100/70',
    iconClasses: 'text-emerald-600',
    modalTheme: {
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      border: 'border-emerald-500',
      headerBg: 'from-emerald-600 to-teal-700',
      titleColor: 'text-emerald-900',
    },
    description: 'Pembiayaan Griya BSI Hasanah (Bank Syariah Indonesia). Akad Murabahah / MMQ yang tenang, angsuran pasti tetap hingga lunas, dengan DP sesuai Program.',
  },
};

export const PaymentSchemeBadges: React.FC<PaymentSchemeBadgesProps> = ({
  schemes,
  className = '',
  badgeSize = 'md',
}) => {
  const [selectedScheme, setSelectedScheme] = useState<SchemeConfig | null>(null);

  // Normalize available schemes directly from database data without unsolicited injection
  const activeSchemes: string[] = React.useMemo(() => {
    if (!schemes || schemes.length === 0) {
      return ['cash', 'bertahap', 'bsi'];
    }
    
    // Strict mapping of schemes that actually exist in the project record
    const seen = new Set<string>();
    const result: string[] = [];

    for (const s of schemes) {
      if (!s) continue;
      const lower = s.toString().toLowerCase().trim();
      let key = lower;
      if (lower.includes('bertahap') || lower.includes('tempo')) key = 'bertahap';
      else if (lower.includes('bsi') || lower.includes('bank')) key = 'bsi';
      else if (lower.includes('dev') || lower.includes('credit') || lower.includes('inhouse')) key = 'developer';
      else if (lower.includes('cash') || lower.includes('keras')) key = 'cash';

      if (!seen.has(key)) {
        seen.add(key);
        result.push(key);
      }
    }

    return result.length > 0 ? result : ['cash', 'bertahap', 'bsi'];
  }, [schemes]);

  const sizeClasses = badgeSize === 'sm'
    ? 'px-2.5 py-1 text-xs gap-1.5'
    : 'px-3 py-1.5 text-xs sm:text-[13px] gap-1.5';

  const iconSize = badgeSize === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  const handleBadgeClick = (e: React.MouseEvent, config: SchemeConfig) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedScheme(config);
  };

  return (
    <>
      <div className={`space-y-2 ${className}`}>
        {/* Header with Card Icon */}
        <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-xs sm:text-sm">
          <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Skema Penjualan Tersedia:</span>
          <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">(Klik skema untuk detail)</span>
        </div>

        {/* Badges Container */}
        <div className="flex flex-wrap items-center gap-2">
          {activeSchemes.map((schemeKey) => {
            const config = SCHEME_CONFIGS[schemeKey] || {
              id: schemeKey,
              label: schemeKey,
              title: `Skema ${schemeKey}`,
              pillClasses: 'border-slate-200 bg-slate-50 text-slate-700',
              iconClasses: 'text-slate-600',
              modalTheme: {
                badgeBg: 'bg-slate-50 text-slate-700 border-slate-200',
                border: 'border-slate-400',
                headerBg: 'from-slate-700 to-slate-800',
                titleColor: 'text-slate-800',
              },
              description: 'Informasi skema pembayaran dapat dikonsultasikan langsung bersama tim marketing Sentra Properti.',
            };

            return (
              <button
                type="button"
                key={config.id}
                onClick={(e) => handleBadgeClick(e, config)}
                title="Klik untuk melihat penjelasan skema pembayaran"
                className={`inline-flex items-center font-bold rounded-lg border shadow-2xs transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] select-none ${sizeClasses} ${config.pillClasses}`}
              >
                <CheckCircle2 className={`${iconSize} ${config.iconClasses} shrink-0 stroke-[2.2]`} />
                <span>{config.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Popup Keterangan Skema Penjualan */}
      {selectedScheme && (
        <div 
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedScheme(null);
          }}
        >
          <div 
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className={`bg-gradient-to-r ${selectedScheme.modalTheme.headerBg} text-white p-5 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/20 backdrop-blur-xs">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-white/80 font-bold">Keterangan Skema Penjualan</p>
                  <h4 className="text-lg font-black font-['Outfit',sans-serif]">{selectedScheme.label}</h4>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedScheme(null);
                }}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${selectedScheme.modalTheme.badgeBg}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {selectedScheme.title}
                </span>
              </div>

              {/* Description Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 text-slate-800 text-sm leading-relaxed font-medium">
                <p>{selectedScheme.description}</p>
              </div>

              {/* Helpful Info Tip */}
              <div className="flex items-start gap-2 text-xs text-slate-500 bg-amber-50/70 p-3 rounded-xl border border-amber-200/70">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Ketentuan detail dan promo dapat dikonfirmasi langsung saat konsultasi atau survey lokasi.</span>
              </div>

              {/* Close Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedScheme(null);
                  }}
                  className="w-full py-2.5 px-4 bg-[#0B1E36] hover:bg-[#122b4d] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                >
                  Tutup Keterangan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

