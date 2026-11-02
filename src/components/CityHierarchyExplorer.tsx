import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  ChevronRight, 
  BedDouble, 
  Bath, 
  Maximize2, 
  Layers, 
  Search,
  ArrowRight
} from 'lucide-react';
import { City, Project, SiteSettings } from '../types';
import { PaymentSchemeBadges } from './PaymentSchemeBadges';

export const CATEGORY_OPTIONS = [
  'Semua Kategori',
  'Rumah',
  'Ruko',
  'Kosan',
  'Tanah Kavling',
  'Tanah Kebun',
  'Tanah Tambang',
] as const;

interface CityHierarchyExplorerProps {
  cities: City[];
  projects: Project[];
  settings: SiteSettings;
  selectedCityId: string | null;
  searchQuery?: string;
  onClearSearch?: () => void;
  onSelectCity: (cityId: string | null) => void;
  onOpenProjectDetail: (project: Project) => void;
  isDbError?: boolean;
}

export const CityHierarchyExplorer: React.FC<CityHierarchyExplorerProps> = ({
  cities,
  projects,
  selectedCityId,
  searchQuery = '',
  onClearSearch,
  onSelectCity,
  onOpenProjectDetail,
  isDbError = false,
}) => {
  // Local project filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Kategori');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedScheme, setSelectedScheme] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'lowest' | 'highest'>('newest');

  // Count projects per city
  const cityProjectCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    cities.forEach((c) => (counts[c.id] = 0));
    projects.forEach((p) => {
      if (counts[p.cityId] !== undefined) {
        counts[p.cityId] = (counts[p.cityId] || 0) + 1;
      } else {
        const matched = cities.find(
          (c) => c.name.toLowerCase() === p.cityName?.toLowerCase()
        );
        if (matched) {
          counts[matched.id] = (counts[matched.id] || 0) + 1;
        }
      }
    });
    return counts;
  }, [cities, projects]);

  // Selected city object
  const activeCity = useMemo(() => {
    if (!selectedCityId || selectedCityId === 'all') return null;
    return cities.find((c) => c.id === selectedCityId) || null;
  }, [selectedCityId, cities]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    let list = [...projects];

    // Filter by city if specific city selected
    if (selectedCityId && selectedCityId !== 'all') {
      const activeC = cities.find((c) => c.id === selectedCityId);
      list = list.filter(
        (p) =>
          p.cityId === selectedCityId ||
          (activeC && p.cityName?.toLowerCase() === activeC.name?.toLowerCase())
      );
    }

    // Filter by search keyword from Navbar
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.cityName.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          (p.developer && p.developer.toLowerCase().includes(q))
      );
    }

    // Filter by Kategori (Tombol pilihan)
    if (selectedCategory !== 'Semua Kategori') {
      const catLower = selectedCategory.toLowerCase();
      list = list.filter((p) => {
        const typeStr = (p.type || '').toLowerCase();
        const catStr = ((p as any).category || '').toLowerCase();
        const nameStr = (p.name || '').toLowerCase();

        if (catLower === 'rumah') {
          return (
            catStr.includes('rumah') ||
            typeStr.includes('rumah') ||
            typeStr.includes('cluster') ||
            typeStr.includes('villa') ||
            typeStr.includes('residence') ||
            typeStr.includes('hunian') ||
            (!typeStr.includes('ruko') && !typeStr.includes('kos') && !typeStr.includes('kavling') && !typeStr.includes('kebun') && !typeStr.includes('tambang'))
          );
        } else if (catLower === 'ruko') {
          return typeStr.includes('ruko') || catStr.includes('ruko') || nameStr.includes('ruko') || typeStr.includes('toko');
        } else if (catLower === 'kosan') {
          return typeStr.includes('kos') || catStr.includes('kos') || nameStr.includes('kos') || typeStr.includes('kost');
        } else if (catLower === 'tanah kavling') {
          return typeStr.includes('kavling') || catStr.includes('kavling') || nameStr.includes('kavling') || (typeStr.includes('tanah') && !typeStr.includes('kebun') && !typeStr.includes('tambang'));
        } else if (catLower === 'tanah kebun') {
          return typeStr.includes('kebun') || catStr.includes('kebun') || nameStr.includes('kebun');
        } else if (catLower === 'tanah tambang') {
          return typeStr.includes('tambang') || catStr.includes('tambang') || nameStr.includes('tambang');
        }
        return typeStr.includes(catLower) || catStr.includes(catLower) || nameStr.includes(catLower);
      });
    }

    // Filter by Rentang Harga picklist
    if (selectedPriceRange !== 'all') {
      list = list.filter((p) => {
        const price = Number(p.price) || 0;
        if (selectedPriceRange === 'under_300') return price < 300000000;
        if (selectedPriceRange === '300_500') return price >= 300000000 && price <= 500000000;
        if (selectedPriceRange === 'above_500') return price > 500000000;
        return true;
      });
    }

    // Filter by Skema Bayar picklist
    if (selectedScheme !== 'all') {
      list = list.filter((p) => {
        const schemes = p.paymentSchemes || ['cash', 'bertahap', 'bsi'];
        return schemes.some((s) => {
          const lower = s.toLowerCase();
          if (selectedScheme === 'cash') return lower.includes('cash') || lower.includes('keras');
          if (selectedScheme === 'bertahap') return lower.includes('bertahap') || lower.includes('tempo');
          if (selectedScheme === 'developer') return lower.includes('dev') || lower.includes('credit');
          if (selectedScheme === 'bsi') return lower.includes('bsi') || lower.includes('bank');
          return lower === selectedScheme;
        });
      });
    }

    // Helper untuk menentukan urutan prioritas kategori:
    // 1. Rumah, 2. Ruko, 3. Kosan, 4. Tanah Kavling, 5. Tanah Kebun, 6. Tanah Tambang
    const getCategoryPriority = (p: Project): number => {
      const typeStr = (p.type || '').toLowerCase();
      const catStr = ((p as any).category || '').toLowerCase();
      const nameStr = (p.name || '').toLowerCase();

      if (typeStr.includes('ruko') || catStr.includes('ruko') || nameStr.includes('ruko') || typeStr.includes('toko')) {
        return 2; // Ruko
      }
      if (typeStr.includes('kos') || catStr.includes('kos') || nameStr.includes('kos') || typeStr.includes('kost')) {
        return 3; // Kosan
      }
      if (typeStr.includes('tambang') || catStr.includes('tambang') || nameStr.includes('tambang')) {
        return 6; // Tanah Tambang
      }
      if (typeStr.includes('kebun') || catStr.includes('kebun') || nameStr.includes('kebun')) {
        return 5; // Tanah Kebun
      }
      if (
        typeStr.includes('kavling') ||
        catStr.includes('kavling') ||
        nameStr.includes('kavling') ||
        typeStr.includes('tanah') ||
        catStr.includes('tanah') ||
        nameStr.includes('tanah')
      ) {
        return 4; // Tanah Kavling
      }
      return 1; // Rumah
    };

    // Sorting
    if (sortBy === 'lowest') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'highest') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      });
    } else if (sortBy === 'newest') {
      list.sort((a, b) => {
        if (selectedCategory === 'Semua Kategori') {
          const catDiff = getCategoryPriority(a) - getCategoryPriority(b);
          if (catDiff !== 0) return catDiff;
        }
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    }

    return list;
  }, [projects, selectedCityId, searchQuery, selectedCategory, selectedPriceRange, selectedScheme, sortBy, cities]);

  const handleCityCardClick = (cityId: string) => {
    if (selectedCityId === cityId) {
      onSelectCity(null);
      return;
    }
    onSelectCity(cityId);
    const el = document.getElementById('housing-projects-grid-anchor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="kota" className="py-8 sm:py-12 md:py-16 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        
        {/* ================= HIRARKI 1: PILIH KOTA (COMPACT) ================= */}
        <div id="city-hierarchy-header" className="space-y-3.5 sm:space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-100 pb-3 sm:pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-[11px] font-bold mb-1.5">
                <MapPin className="w-3 h-3 text-amber-600" />
                <span>Hirarki Properti Berdasarkan Wilayah</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0B1E36] font-['Outfit',sans-serif] tracking-tight">
                Pilih Kota Lokasi Properti
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-0.5 max-w-2xl">
                Klik salah satu kota di bawah ini untuk memfilter proyek perumahan di wilayah tersebut.
              </p>
            </div>

            {selectedCityId && selectedCityId !== 'all' && (
              <button
                type="button"
                onClick={() => onSelectCity(null)}
                className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition-colors cursor-pointer shrink-0"
              >
                Tampilkan Semua Kota ({projects.length})
              </button>
            )}
          </div>

          {/* Compact City Cards Grid (2 Columns on Mobile so it doesn't eat vertical scroll) */}
          {cities.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-2">
              <Building2 className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-slate-600 font-semibold text-xs sm:text-sm">
                {isDbError ? 'Terjadi Gangguan pada koneksi database' : 'Belum ada data kota lokasi properti di database.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
              {cities.map((city) => {
                const isSelected = selectedCityId === city.id;
                const projectCount = cityProjectCounts[city.id] || 0;

                return (
                  <div
                    key={city.id}
                    id={`city-card-${city.id}`}
                    onClick={() => handleCityCardClick(city.id)}
                    className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
                      isSelected
                        ? 'border-amber-500 ring-2 sm:ring-4 ring-amber-400/30 shadow-lg scale-[1.01]'
                        : 'border-slate-200/90 hover:border-amber-400 shadow-xs hover:shadow-md hover:-translate-y-0.5'
                    }`}
                  >
                    {/* Compact City Thumbnail Banner */}
                    <div className="relative h-24 sm:h-32 overflow-hidden bg-slate-900">
                      {city.image && city.image.trim() !== '' ? (
                        <img
                          src={city.image}
                          alt={`Properti di ${city.name}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-[0.82]"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                          <Building2 className="w-8 h-8 opacity-50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E36]/95 via-[#0B1E36]/40 to-black/20"></div>

                      {/* Top Badges */}
                      <div className="absolute top-2 inset-x-2.5 flex items-center justify-between gap-1">
                        {city.badge ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/95 text-slate-950 font-bold text-[9px] sm:text-[10px] uppercase tracking-wider shadow truncate">
                            {city.badge}
                          </span>
                        ) : (
                          <span></span>
                        )}

                        <span className="px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-xs text-white font-bold text-[10px] sm:text-xs border border-white/20 shrink-0">
                          {projectCount} Proyek
                        </span>
                      </div>

                      {/* City Info on Card Bottom */}
                      <div className="absolute bottom-2 inset-x-2.5 text-white">
                        <p className="text-[9px] sm:text-[10px] font-semibold text-amber-300 uppercase tracking-wider truncate">
                          {city.province}
                        </p>
                        <h3 className="text-sm sm:text-lg font-bold font-['Outfit',sans-serif] flex items-center justify-between leading-tight">
                          <span className="truncate">{city.name}</span>
                          <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform shrink-0" />
                        </h3>
                      </div>
                    </div>

                    {/* Active Indicator Bar */}
                    {isSelected && (
                      <div className="h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600"></div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ================= HIRARKI 2: PROYEK PERUMAHAN PER KOTA ================= */}
        <div id="housing-projects-grid-anchor" className="space-y-4 sm:space-y-5 pt-2">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-slate-200 pb-3 sm:pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-bold mb-1.5">
                <Building2 className="w-3 h-3 text-emerald-600" />
                <span>
                  {activeCity ? `Daftar Proyek di ${activeCity.name}` : 'Semua Proyek Perumahan Sentra Properti'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0B1E36] font-['Outfit',sans-serif] tracking-tight">
                {activeCity ? `Proyek Pilihan di ${activeCity.name}` : 'Katalog Seluruh Proyek Perumahan'}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
                Klik pada foto / kartu proyek untuk membuka <strong>Detail Lengkap, Foto Utama, & Spesifikasi</strong>.
              </p>
            </div>
          </div>

          {/* Project Filtering & Search Bar */}
          <div className="bg-slate-50 p-2.5 sm:p-4 rounded-2xl border border-slate-200/90 space-y-2 sm:space-y-3 shadow-xs">
            {/* Filter Kategori: Tombol Pilihan */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 pb-2 sm:pb-2.5 border-b border-slate-200/80">
              <span className="text-xs font-bold text-slate-700 shrink-0 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>Kategori :</span>
              </span>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                {CATEGORY_OPTIONS.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        if (cat === 'Semua Kategori') {
                          setSortBy('newest');
                        }
                      }}
                      className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#0B1E36] text-amber-300 shadow-xs ring-2 ring-amber-400/40'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-100/80'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}

                {/* Reset Filters button if any is applied */}
                {(selectedCategory !== 'Semua Kategori' || selectedPriceRange !== 'all' || selectedScheme !== 'all' || searchQuery.trim() !== '' || selectedCityId) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('Semua Kategori');
                      setSelectedPriceRange('all');
                      setSelectedScheme('all');
                      onSelectCity(null);
                      if (onClearSearch) onClearSearch();
                      setSortBy('newest');
                    }}
                    className="px-2 py-1 sm:px-2.5 sm:py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Filter Picklists Row */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center justify-between">
              {/* Active Search Indicator (if searched from Navbar) */}
              {searchQuery.trim() ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-amber-50 text-amber-900 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border border-amber-300 text-[11px] sm:text-xs font-semibold">
                    <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600" />
                    <span>Hasil pencarian: &quot;{searchQuery}&quot;</span>
                    {onClearSearch && (
                      <button
                        onClick={onClearSearch}
                        className="ml-1 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                        title="Hapus pencarian"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ) : <div />}

              {/* Picklists & Total */}
              <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-2">
                {/* Picklist Rentang Harga */}
                <div className="flex items-center justify-between sm:justify-start gap-1.5 bg-white px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border border-slate-200 text-xs shadow-2xs">
                  <span className="font-semibold text-slate-500 shrink-0 text-[11px] sm:text-xs">Rentang Harga:</span>
                  <select
                    id="filter-price-range-select"
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer text-xs"
                  >
                    <option value="all">Semua Harga</option>
                    <option value="under_300">Di Bawah Rp 300 Juta</option>
                    <option value="300_500">Rp 300 Juta – Rp 500 Juta</option>
                    <option value="above_500">Di Atas Rp 500 Juta</option>
                  </select>
                </div>

                {/* Picklist Skema Bayar */}
                <div className="flex items-center justify-between sm:justify-start gap-1.5 bg-white px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border border-slate-200 text-xs shadow-2xs">
                  <span className="font-semibold text-slate-500 shrink-0 text-[11px] sm:text-xs">Skema Bayar:</span>
                  <select
                    id="filter-scheme-select"
                    value={selectedScheme}
                    onChange={(e) => setSelectedScheme(e.target.value)}
                    className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer text-xs"
                  >
                    <option value="all">Semua Skema</option>
                    <option value="cash">Cash</option>
                    <option value="bertahap">Cash Bertahap (0%)</option>
                    <option value="developer">Credit Developer</option>
                    <option value="bsi">Bank BSI</option>
                  </select>
                </div>

                {/* Picklist Urutkan : */}
                <div className="flex items-center justify-between sm:justify-start gap-1.5 bg-white px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border border-slate-200 text-xs shadow-2xs">
                  <span className="font-semibold text-slate-500 shrink-0 text-[11px] sm:text-xs">Urutkan:</span>
                  <select
                    id="filter-sort-by-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer text-xs"
                  >
                    <option value="newest">Terbaru Ditambahkan</option>
                    <option value="oldest">Terlama Ditambahkan</option>
                    <option value="lowest">Harga Terendah</option>
                    <option value="highest">Harga Tertinggi</option>
                  </select>
                </div>

                <span className="text-[11px] sm:text-xs font-bold text-slate-600 bg-white px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border border-slate-200 shrink-0 text-center">
                  {filteredProjects.length} Proyek Ditemukan
                </span>
              </div>
            </div>
          </div>

          {/* ================= HIRARKI 3: PROYEK PERUMAHAN PHOTO CARDS GRID (COMPACT) ================= */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6 space-y-3">
              <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
              {isDbError && projects.length === 0 ? (
                <p className="text-slate-600 font-semibold text-sm">Terjadi Gangguan pada koneksi database</p>
              ) : (
                <>
                  <h3 className="text-base font-bold text-slate-700">Belum Ada Proyek Sesuai Filter</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Silakan sesuaikan filter rentang harga, kategori, atau pilih kota lain untuk melihat proyek yang tersedia.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  id={`project-card-${project.id}`}
                  onClick={() => onOpenProjectDetail(project)}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer"
                >
                  {/* Main Primary Photo & Badges */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                    {project.photos && project.photos[0] && project.photos[0].trim() !== '' ? (
                      <img
                        src={project.photos[0]}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                        <Building2 className="w-10 h-10 opacity-50" />
                      </div>
                    )}

                    {/* Photo Count Badge */}
                    {(() => {
                      const validList = (project.photos || []).filter((p) => typeof p === 'string' && p.trim() !== '');
                      const uniqueCount = new Set(validList).size;
                      return uniqueCount > 0 ? (
                        <div className="absolute top-2.5 left-2.5">
                          <span className="px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-xs text-white text-[10px] font-semibold shadow-xs">
                            {uniqueCount} Foto
                          </span>
                        </div>
                      ) : null;
                    })()}

                    {/* City Tag */}
                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-[#0B1E36] font-bold text-[11px] shadow flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-600" />
                        {project.cityName}
                      </span>
                    </div>

                    {/* Bottom Gradient Over Title */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-2.5 left-3.5 right-3.5 text-white">
                      <p className="text-[10px] text-amber-300 font-semibold leading-tight">{project.type}</p>
                      <h3 className="text-base sm:text-lg font-bold font-['Outfit',sans-serif] leading-tight truncate">
                        {project.name}
                      </h3>
                    </div>
                  </div>

                  {/* Compact Card Body Specs */}
                  <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
                    
                    {/* Row 1: Price & Location Compact */}
                    <div className="space-y-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Harga Mulai
                        </span>
                        <span className="text-lg sm:text-xl font-black text-[#0B1E36] font-['Outfit',sans-serif] leading-none">
                          {project.priceDisplay}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 line-clamp-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                        <span className="truncate">{project.address}</span>
                      </p>
                    </div>

                    {/* Row 2: 1-Line Horizontal Inline Specs (LT, LB, KT, KM) */}
                    <div className="flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100 text-[11px] text-slate-700">
                      <span className="flex items-center gap-1 font-bold" title="Luas Tanah">
                        <Maximize2 className="w-3 h-3 text-amber-600 shrink-0" />
                        <span>LT {project.specs.surfaceArea}m²</span>
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="flex items-center gap-1 font-bold" title="Luas Bangunan">
                        <Maximize2 className="w-3 h-3 text-amber-600 shrink-0" />
                        <span>LB {project.specs.buildingArea}m²</span>
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="flex items-center gap-1 font-bold" title="Kamar Tidur">
                        <BedDouble className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{project.specs.bedrooms} KT</span>
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="flex items-center gap-1 font-bold" title="Kamar Mandi">
                        <Bath className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{project.specs.bathrooms} KM</span>
                      </span>
                    </div>

                    {/* Row 3: Compact Payment Scheme Badges + Action Button */}
                    <div className="pt-1 border-t border-slate-100 space-y-2">
                      <PaymentSchemeBadges schemes={project.paymentSchemes} badgeSize="sm" compact />

                      <button
                        id={`btn-open-detail-${project.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenProjectDetail(project);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 bg-[#0B1E36] group-hover:bg-amber-500 group-hover:text-slate-950 text-amber-300 py-2 px-3.5 rounded-xl font-bold text-xs transition-all duration-200 shadow-xs cursor-pointer"
                      >
                        <span>Lihat Detail Proyek</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
