import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  BadgePercent, 
  Award, 
  Landmark, 
  Sparkles, 
  KeyRound, 
  HeadphonesIcon 
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const advantages = [
    {
      icon: ShieldCheck,
      title: 'Legalitas 100% Aman & Terjamin',
      description: 'Seluruh proyek perumahan Sentra Properti berizin resmi dengan Sertifikat Hak Milik (SHM) sudah pecah per kavling dan PBG/IMB lengkap.',
    },
    {
      icon: MapPin,
      title: 'Lokasi Emas & Strategis',
      description: 'Dekat dengan stasiun LRT, pusat perbelanjaan, sekolah unggulan, dan rumah sakit terkemuka untuk kenyamanan mobilitas.',
    },
    {
      icon: Landmark,
      title: 'Cash, Cash Bertahap Atau Cicilan',
      description: 'Proses fleksibel dan bisa sesuai dengan keinginan, beberapa Perumahan menggunakan Cicilan BSI.',
    },
    {
      icon: Award,
      title: 'Kualitas Bangunan Standar Premium',
      description: 'Menggunakan material bangunan terbaik dengan desain fasad arsitektur modern minimalis yang berkelas.',
    },
    {
      icon: BadgePercent,
      title: 'Transparansi Biaya & Promo Menarik',
      description: 'Ada Program Free biaya BPHTB, AJB, BBN, dengan skema pembayaran syariah yang transparan tanpa biaya tersembunyi.',
    },
    {
      icon: HeadphonesIcon,
      title: 'Layanan Pendampingan Survey',
      description: 'Tim Property Advisor profesional siap melayani konsultasi gratis dan mendampingi kunjungan survey lokasi.',
    },
  ];

  return (
    <section className="py-8 sm:py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-[11px] sm:text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Mengapa Memilih Sentra Properti?</span>
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-[#0B1E36] font-['Outfit',sans-serif] tracking-tight">
            Standar Keunggulan Properti Terpercaya untuk Keluarga Anda
          </h2>
          <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
            Kami mengutamakan keamanan investasi, kenyamanan tempat tinggal, dan kemudahan proses kepemilikan rumah impian Anda.
          </p>
        </div>

        {/* Advantages 6-Box Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
          {advantages.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 p-3 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 hover:border-amber-400 hover:bg-amber-50/20 transition-all duration-300 shadow-xs hover:shadow-lg space-y-1.5 sm:space-y-3 group"
              >
                <div className="flex sm:flex-col items-center sm:items-start gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#0B1E36] text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center shrink-0 transition-colors shadow-sm">
                    <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-sm sm:text-lg font-bold text-[#0B1E36] font-['Outfit',sans-serif] leading-snug">
                    {item.title}
                  </h3>
                </div>
                <p className="text-[11px] sm:text-sm text-slate-600 leading-snug sm:leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
