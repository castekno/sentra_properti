import React, { useState } from 'react';
import { MessageCircle, X, Send, PhoneCall, CheckCheck, CalendarCheck } from 'lucide-react';
import { SiteSettings } from '../types';

interface FloatingWhatsAppProps {
  settings: SiteSettings;
  activeProjectName?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  settings,
  activeProjectName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  
  const defaultText = activeProjectName
    ? `Halo Sentra Properti, saya tertarik dan ingin konsultasi mengenai proyek *${activeProjectName}*. Mohon info ketersediaan unit, brosur, dan jadwal survey lokasi.`
    : (settings.whatsappDefaultMessage || 'Halo Sentra Properti, saya tertarik dengan informasi proyek perumahan. Mohon bantuan konsultasi.');

  const handleOpenWhatsApp = (customMessageText?: string) => {
    const textToSend = customMessageText || customMsg || defaultText;
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(textToSend)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleScrollToConsultation = () => {
    const formElement = document.getElementById('hubungi-kami');
    const nameInput = document.getElementById('inquiry-name-input') as HTMLInputElement | null;
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        if (nameInput) {
          nameInput.focus();
          nameInput.classList.add('ring-4', 'ring-amber-400');
          setTimeout(() => {
            nameInput.classList.remove('ring-4', 'ring-amber-400');
          }, 1500);
        }
      }, 500);
    }
  };

  return (
    <>
      {/* Mobile Floating Konsul Button (Bukan WA) */}
      <div className="sm:hidden fixed bottom-5 right-5 z-50">
        <button
          id="floating-mobile-konsul-btn"
          onClick={handleScrollToConsultation}
          className="group relative flex items-center gap-2 bg-gradient-to-r from-[#0B1E36] to-[#142f53] active:from-[#142f53] text-amber-300 px-3.5 py-3 rounded-full shadow-2xl border-2 border-amber-400/90 active:scale-95 transition-all duration-200 cursor-pointer"
          aria-label="Konsultasi Properti"
        >
          <span className="absolute -inset-1 rounded-full bg-amber-400 opacity-30 animate-ping pointer-events-none"></span>
          <CalendarCheck className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-xs font-bold text-white tracking-wide">Konsul</span>
          <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full border border-[#0B1E36] shrink-0"></span>
        </button>
      </div>

      {/* Desktop Floating WhatsApp Container */}
      <div id="floating-whatsapp-container" className="hidden sm:flex fixed bottom-6 right-6 z-50 flex-col items-end">
        {/* Quick Chat Popover */}
        {isOpen && (
          <div 
            id="wa-quick-chat-modal"
            className="mb-4 w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-4 text-white flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-white/20 border-2 border-white flex items-center justify-center font-bold text-white shadow-inner">
                    <MessageCircle className="w-6 h-6 text-white fill-white/30" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-emerald-700 rounded-full"></span>
                </div>
                <div>
                  <h4 className="font-bold text-base tracking-tight leading-tight">Sentra Properti Official</h4>
                  <p className="text-xs text-emerald-100 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                    Online • Siap Melayani Konsultasi
                  </p>
                </div>
              </div>
              <button
                id="close-wa-popover-btn"
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Tutup chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body Simulation */}
            <div className="p-4 bg-[#ECE5DD]/40 max-h-[300px] overflow-y-auto space-y-3">
              <div className="bg-white p-3.5 rounded-2xl rounded-tl-sm shadow-sm border border-slate-200/60 text-slate-800 text-sm max-w-[90%]">
                <p className="font-semibold text-xs text-emerald-700 mb-1">Customer Advisor Sentra Properti</p>
                <p className="text-xs leading-relaxed text-slate-700">
                  Halo! Selamat datang di <strong>Sentra Properti</strong>. Ada yang bisa kami bantu seputar pilihan perumahan syariah, skema Cash / Cash Bertahap, Cicilan BSI, atau jadwal survey lokasi?
                </p>
                <span className="block text-[10px] text-slate-400 text-right mt-1.5 flex items-center justify-end gap-1">
                  Baru saja <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                </span>
              </div>

              {activeProjectName && (
                <div className="bg-amber-50/90 border border-amber-200/80 p-2.5 rounded-xl text-xs text-amber-900 flex items-center justify-between gap-2">
                  <div>
                    <p className="font-bold text-amber-800">Proyek Sedang Dilihat:</p>
                    <p className="truncate text-slate-700 font-medium">{activeProjectName}</p>
                  </div>
                  <button
                    id="wa-send-active-proj-btn"
                    onClick={() => handleOpenWhatsApp()}
                    className="shrink-0 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition-colors"
                  >
                    Tanya Ini
                  </button>
                </div>
              )}

              {/* Quick Prompts */}
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pilih Pertanyaan Cepat:</p>
                <button
                  id="wa-quick-survey-btn"
                  onClick={() => handleOpenWhatsApp('Halo Sentra Properti, saya ingin menjadwalkan survey lokasi proyek perumahan pada akhir pekan ini. Mohon info PIC Marketing.')}
                  className="w-full text-left text-xs bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 p-2 rounded-xl border border-slate-200/80 hover:border-emerald-300 transition-all font-medium flex items-center justify-between"
                >
                  <span>🗓️ Booking Jadwal Survey Lokasi</span>
                  <Send className="w-3 h-3 text-emerald-600 opacity-60" />
                </button>
                <button
                  id="wa-quick-pricelist-btn"
                  onClick={() => handleOpenWhatsApp('Halo Sentra Properti, boleh minta e-Brosur dan Pricelist lengkap untuk proyek rumah siap huni?')}
                  className="w-full text-left text-xs bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 p-2 rounded-xl border border-slate-200/80 hover:border-emerald-300 transition-all font-medium flex items-center justify-between"
                >
                  <span>📑 Minta e-Brosur & Pricelist Lengkap</span>
                  <Send className="w-3 h-3 text-emerald-600 opacity-60" />
                </button>
                <button
                  id="wa-quick-kpr-btn"
                  onClick={() => handleOpenWhatsApp('Halo Sentra Properti, saya ingin konsultasi skema syariah: Cash, Cash Bertahap ke Developer, atau Cicilan Syariah BSI.')}
                  className="w-full text-left text-xs bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 p-2 rounded-xl border border-slate-200/80 hover:border-emerald-300 transition-all font-medium flex items-center justify-between"
                >
                  <span>🕌 Konsultasi Cash, Bertahap & BSI</span>
                  <Send className="w-3 h-3 text-emerald-600 opacity-60" />
                </button>
              </div>
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
              <input
                id="wa-custom-msg-input"
                type="text"
                placeholder="Tulis pesan Anda..."
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleOpenWhatsApp();
                }}
                className="flex-1 text-xs px-3.5 py-2.5 rounded-full bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800"
              />
              <button
                id="wa-send-custom-msg-btn"
                onClick={() => handleOpenWhatsApp()}
                className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shrink-0 transition-colors shadow-md hover:scale-105 active:scale-95"
                aria-label="Kirim ke WhatsApp"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Floating Button Main */}
        <button
          id="floating-whatsapp-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-2.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20bd5a] hover:to-[#0e7569] text-white px-4 py-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white/80 cursor-pointer"
          aria-label="Chat WhatsApp Sentra Properti"
        >
          {/* Animated Ripple Pulse */}
          <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-40 animate-ping pointer-events-none"></span>

          <MessageCircle className="w-7 h-7 fill-white text-[#128C7E] shrink-0" />
          
          <div className="text-left hidden sm:block">
            <p className="text-[10px] font-medium leading-none text-emerald-100 uppercase tracking-wider">Konsultasi Gratis</p>
            <p className="text-sm font-bold leading-tight">Chat WhatsApp</p>
          </div>

          {/* Online Indicator */}
          <span className="w-3 h-3 bg-amber-300 border-2 border-emerald-900 rounded-full shrink-0 shadow"></span>
        </button>
      </div>
    </>
  );
};
