import React, { useState, useMemo } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  Building2,
  ExternalLink
} from 'lucide-react';
import { City, Project, SiteSettings, InquiryFormData } from '../types';
import { submitInquiry } from '../lib/firebase';

interface ContactSectionProps {
  settings: SiteSettings;
  cities: City[];
  projects: Project[];
  selectedProjectForSurvey?: Project | null;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  settings,
  cities,
  projects,
  selectedProjectForSurvey,
}) => {
  // Extract project names matching the filter picklist
  const availableProjectNames = useMemo(() => {
    const names = Array.from(new Set(projects.map((p) => p.name.trim()))).filter(Boolean);
    names.sort();
    return names;
  }, [projects]);

  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    phone: '',
    email: '',
    preferredCity: '',
    preferredProject: selectedProjectForSurvey ? selectedProjectForSurvey.name : '',
    budgetRange: '',
    surveyDate: '',
    message: selectedProjectForSurvey ? `Saya tertarik dengan proyek ${selectedProjectForSurvey.name}` : '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setIsSubmitting(true);
    try {
      await submitInquiry(formData);
      setSubmittedSuccess(true);

      // Open WhatsApp with compiled structured message
      const waText = `Halo Tim Sentra Properti, saya ingin booking survey / konsultasi:
- *Nama*: ${formData.name}
- *No. Telepon/WA*: ${formData.phone}
- *Email*: ${formData.email || '-'}
- *Proyek Diminati*: ${formData.preferredProject || 'Semua Proyek / Rekomendasi'}
- *Rencana Tanggal Survey*: ${formData.surveyDate || 'Segera'}
- *Pesan*: ${formData.message || 'Mohon dibantu informasi brosur & promo.'}`;

      const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(waText)}`;
      setTimeout(() => {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }, 500);

    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="hubungi-kami" className="py-16 md:py-24 bg-slate-100/70 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
            <MessageCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>Layanan Konsultasi & Survey Lokasi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1E36] font-['Outfit',sans-serif] tracking-tight">
            Hubungi Kami & Jadwalkan Survey Lokasi
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Tim Sentra Properti siap mendampingi kunjungan lokasi dan memberikan simulasi skema Cash, Cash Bertahap, atau Cicilan BSI terbaik tanpa dipungut biaya.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200/90">
            {submittedSuccess ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Permintaan Terkirim!</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Terima kasih <strong>{formData.name}</strong>. Tim Customer Advisor Sentra Properti akan segera menghubungi Anda via WhatsApp di nomor <strong>{formData.phone}</strong>.
                </p>
                <button
                  id="reset-form-btn"
                  onClick={() => setSubmittedSuccess(false)}
                  className="px-6 py-2.5 bg-[#0B1E36] text-amber-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Kirim Pertanyaan Lain
                </button>
              </div>
            ) : (
              <form id="contact-inquiry-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-[#0B1E36] font-['Outfit',sans-serif]">
                    Formulir Konsultasi Properti
                  </h3>
                  <p className="text-xs text-slate-500">Isi data di bawah ini untuk terhubung langsung dengan konsultan kami</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="inquiry-name-input"
                      type="text"
                      required
                      placeholder="Contoh: Bpk. Satio"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nomor WhatsApp / HP <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="inquiry-phone-input"
                      type="tel"
                      required
                      placeholder="Contoh: 081234567890"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Proyek yang Diminati
                    </label>
                    <select
                      id="inquiry-proj-select"
                      value={formData.preferredProject}
                      onChange={(e) => setFormData({ ...formData, preferredProject: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    >
                      <option value="">Semua Nama Proyek / Rekomendasi</option>
                      {availableProjectNames.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Rencana Tanggal Survey
                    </label>
                    <input
                      id="inquiry-date-input"
                      type="date"
                      value={formData.surveyDate}
                      onChange={(e) => setFormData({ ...formData, surveyDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pesan / Kebutuhan Khusus
                  </label>
                  <textarea
                    id="inquiry-message-input"
                    rows={3}
                    placeholder="Contoh: Mohon info promo DP 0% dan jadwal survey hari Sabtu..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  ></textarea>
                </div>

                <button
                  id="inquiry-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{isSubmitting ? 'Mengirim Data...' : 'Kirim & Lanjut Chat WhatsApp'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Office Info & Embed Map */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-[#0B1E36] text-white p-6 sm:p-7 rounded-3xl shadow-xl space-y-6">
              <div>
                <h3 className="text-xl font-bold font-['Outfit',sans-serif] text-amber-300">
                  Kantor Sentra Properti
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Solusi Properti Terpercaya untuk Masa Depan Keluarga Anda
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-200">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Alamat Kantor Pusat</p>
                    <p className="text-slate-300 leading-relaxed">{settings.officeAddress}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Telepon & WhatsApp</p>
                    <p className="text-slate-300">{settings.phoneNumber} / {settings.whatsappNumber}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Email Resmi</p>
                    <p className="text-slate-300">{settings.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Jam Operasional & Survey</p>
                    <p className="text-slate-300">{settings.workingHours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map of Head Office */}
            <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200 aspect-[16/10] bg-slate-200 relative group">
              <iframe
                id="office-google-map-iframe"
                src={(settings.officeMapEmbed && settings.officeMapEmbed.trim() !== '') ? settings.officeMapEmbed.trim() : "https://maps.app.goo.gl/aYyv8q7LZD3FJ6pu9"}
                title="Peta Lokasi Kantor Sentra Properti"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <a
                id="office-map-direct-link"
                href={settings.officeMapUrl || "https://maps.app.goo.gl/aYyv8q7LZD3FJ6pu9"}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 bg-white/95 hover:bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all border border-slate-200"
              >
                <span>Buka di Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
