import React, { useState } from 'react';
import { 
  CheckCircle, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  Image as ImageIcon,
  X,
  FileCheck
} from 'lucide-react';
import { DocumentationItem, DocCategory } from '../types';

interface DocumentationSectionProps {
  items: DocumentationItem[];
}

export const DocumentationSection: React.FC<DocumentationSectionProps> = ({
  items,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [zoomedItem, setZoomedItem] = useState<DocumentationItem | null>(null);

  const categories = React.useMemo(() => {
    const defaultCats = [
      'Serah Terima Kunci',
      'Progress Pembangunan',
      'Akad Massal',
      'Legalitas & Sertifikat',
      'Site Visit Proyek',
      'Lainnya',
    ];
    const itemCats = items.map((i) => i.category).filter(Boolean);
    const combined = Array.from(new Set([...itemCats, ...defaultCats]));
    return combined.filter(cat => items.some(i => i.category === cat) || cat === 'Serah Terima Kunci' || cat === 'Progress Pembangunan');
  }, [items]);

  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter((item) => item.category === selectedCategory);

  return (
    <section id="dokumentasi" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
              <FileCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Transparansi & Bukti Nyata</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1E36] font-['Outfit',sans-serif] tracking-tight">
              Galeri Dokumentasi & Serah Terima
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1 max-w-2xl">
              Bukti komitmen dan profesionalisme Sentra Properti: Progres pembangunan nyata, akad jual beli syariah lancar, dan serah terima kunci tepat waktu kepada ribuan keluarga.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="doc-filter-all"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#0B1E36] text-amber-400 shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
            }`}
          >
            Semua ({items.length})
          </button>

          {categories.map((cat) => {
            const count = items.filter((i) => i.category === cat).length;
            return (
              <button
                key={cat}
                id={`doc-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0B1E36] text-amber-400 shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Documentation Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-slate-300 space-y-3">
            <ImageIcon className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-slate-600 font-semibold text-sm">Belum ada foto dokumentasi di database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                id={`doc-item-${item.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Photo */}
                <div 
                  className="relative aspect-[16/10] overflow-hidden bg-slate-900 cursor-pointer"
                  onClick={() => setZoomedItem(item)}
                >
                  {item.imageUrl && item.imageUrl.trim() !== '' ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                      <ImageIcon className="w-12 h-12 opacity-50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>

                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0B1E36]/90 backdrop-blur-xs text-amber-300 text-[10px] font-extrabold uppercase tracking-wider">
                    {item.category}
                  </span>

                  {/* Tulisan DOKUMENTASI di Kanan Atas Foto */}
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                    DOKUMENTASI
                  </span>

                  <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 text-white text-[10px] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    {item.date}
                  </span>
                </div>

                {/* Text Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    {item.location && (
                      <span className="flex items-center gap-1 truncate max-w-[70%]">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </span>
                    )}

                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        id={`zoom-doc-${item.id}`}
                        onClick={() => setZoomedItem(item)}
                        className="text-xs font-bold text-amber-700 hover:text-amber-900 cursor-pointer"
                      >
                        Lihat Foto
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Photo Lightbox Modal */}
      {zoomedItem && (
        <div
          id="doc-lightbox-modal"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setZoomedItem(null)}
        >
          <div
            className="bg-slate-900 text-white max-w-3xl w-full rounded-3xl overflow-hidden border border-slate-700 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-slate-800/80 flex items-center justify-between border-b border-slate-700">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/20 px-2.5 py-0.5 rounded-full">
                  {zoomedItem.category}
                </span>
                <h3 className="text-base font-bold mt-1">{zoomedItem.title}</h3>
              </div>
              <button
                id="close-lightbox-btn"
                onClick={() => setZoomedItem(null)}
                className="p-2 rounded-full hover:bg-slate-700 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 pt-0">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-black">
                {zoomedItem.imageUrl && zoomedItem.imageUrl.trim() !== '' ? (
                  <img
                    src={zoomedItem.imageUrl}
                    alt={zoomedItem.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-400">
                    <ImageIcon className="w-16 h-16 opacity-50" />
                  </div>
                )}
                {/* Badge DOKUMENTASI Kanan Atas Foto */}
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black uppercase tracking-wider shadow-md">
                  DOKUMENTASI
                </span>
              </div>

              <div className="mt-4 p-3 bg-slate-800/50 rounded-xl space-y-1">
                <p className="text-xs text-slate-300 leading-relaxed">{zoomedItem.description}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>{zoomedItem.location || 'Sentra Properti'}</span>
                  <span>{zoomedItem.date}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
