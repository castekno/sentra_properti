import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  ChevronRight, 
  BedDouble, 
  Bath, 
  Maximize2, 
  Layers, 
  Compass, 
  Sparkles, 
  Check, 
  SlidersHorizontal,
  Search,
  ArrowRight,
  Info
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
  settings,
  selectedCityId,
  searchQuery = '',
  onClearSearch,
  onSelectCity,
  onOpenProjectDetail,
  isDbError = false,
}) => {
  // Local project filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Kategori');
  const [selectedProjectName, setSelectedProjectName] = useState<string>('all');
  const [selectedScheme, setSelectedScheme] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'lowest' | 'highest'>('newest');

  // Available unique project names from database
  const availableProjectNames = useMemo(() => {
    return Array.from(new Set(projects.map((p) => p.name).filter(Boolean))).sort();
  }, [projects]);

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

    // Filter by Nama Proyek picklist
    if (selectedProjectName !== 'all') {
      list = list.filter((p) => p.name === selectedProjectName);
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
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    }

    return list;
  }, [projects, selectedCityId, searchQuery, selectedCategory, selectedProjectName, selectedScheme, sortBy, cities]);

  const handleCityCardClick = (cityId: string) => {
    onSelectCity(cityId);
    // Smooth scroll down to the projects section
    const el = document.getElementById('housing-projects-grid-anchor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="kota" className="py-16 md:py-24 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* ================= HIRARKI 1: PILIH KOTA ================= */}
        <div id="city-hierarchy-header" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold mb-2">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Hirarki Properti Berdasarkan Wilayah</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1E36] font-['Outfit',sans-serif] tracking-tight">
                Pilih Kota Lokasi Properti
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-1 max-w-2xl">
                Klik salah satu kota di bawah ini untuk melihat daftar proyek perumahan unggulan Sentra Properti di wilayah tersebut.
              </p>
            </div>
          </div>

          {/* City Cards Grid */}
          {cities.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-10 text-center space-y-3">
              <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
              <p className="text-slate-600 font-semibold text-sm">
                {isDbError ? 'Terjadi Gangguan pada koneksi database' : 'Belum ada data kota lokasi properti di database.'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cities.map((city) => {
                  const isSelected = selectedCityId === city.id;
                  const projectCount = cityProjectCounts[city.id] || 0;

                  return (
                    <div
                      key={city.id}
                      id={`city-card-${city.id}`}
                      onClick={() => handleCityCardClick(city.id)}
                      className={`group relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
                        isSelected
                          ? 'border-amber-500 ring-4 ring-amber-400/30 shadow-2xl scale-[1.02]'
                          : 'border-slate-200/90 hover:border-amber-400 shadow-md hover:shadow-xl hover:-translate-y-1'
                      }`}
                    >
                      {/* City Thumbnail Photo */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                        {city.image && city.image.trim() !== '' ? (
                          <img
                            src={city.image}
                            alt={`Properti di ${city.name}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-[0.88]"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                            <Building2 className="w-12 h-12 opacity-50" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E36]/90 via-[#0B1E36]/30 to-transparent"></div>

                        {/* Top Badges */}
                        <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                          {city.badge ? (
                            <span className="px-2.5 py-1 rounded-full bg-amber-500/95 text-slate-950 font-bold text-[10px] uppercase tracking-wider shadow">
                              {city.badge}
                            </span>
                          ) : (
                            <span></span>
                          )}

                          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white font-bold text-xs border border-white/20">
                            {projectCount} Proyek Aktif
                          </span>
                        </div>

                        {/* City Info on Card Bottom */}
                        <div className="absolute bottom-3 inset-x-3 text-white space-y-1">
                          <p className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">
                            {city.province}
                          </p>
                          <h3 className="text-xl font-bold font-['Outfit',sans-serif] flex items-center justify-between">
                            <span>{city.name}</span>
                            <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                          </h3>
                        </div>
                      </div>

                      {/* City Description Footer */}
                      <div className="p-4 bg-slate-50/90 flex items-center justify-between text-xs text-slate-600">
                        <p className="line-clamp-1 flex-1 font-medium">{city.description}</p>
                      </div>

                      {/* Active Indicator Bar */}
                      {isSelected && (
                        <div className="h-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* ================= HIRARKI 2: PROYEK PERUMAHAN PER KOTA ================= */}
        <div id="housing-projects-grid-anchor" className="space-y-6 pt-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold mb-2">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {activeCity ? `Daftar Proyek di ${activeCity.name}` : 'Semua Proyek Perumahan Sentra Properti'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0B1E36] font-['Outfit',sans-serif] tracking-tight">
                {activeCity ? `Proyek Pilihan di ${activeCity.name}` : 'Katalog Seluruh Proyek Perumahan'}
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Klik pada foto / kartu proyek untuk membuka <strong>Detail Lengkap, Foto Utama, & Spesifikasi</strong>.
              </p>
            </div>
          </div>

          {/* Project Filtering & Search Bar */}
          <div className="bg-slate-50 p-2.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 space-y-2 sm:space-y-3.5 shadow-xs">
            {/* Filter Kategori: Tombol Pilihan */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 pb-2 sm:pb-3 border-b border-slate-200/80">
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
                      onClick={() => setSelectedCategory(cat)}
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
                {(selectedCategory !== 'Semua Kategori' || selectedProjectName !== 'all' || selectedScheme !== 'all' || searchQuery.trim() !== '') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('Semua Kategori');
                      setSelectedProjectName('all');
                      setSelectedScheme('all');
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
              <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-2.5">
                {/* Picklist Nama Proyek */}
                <div className="flex items-center justify-between sm:justify-start gap-1.5 bg-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl border border-slate-200 text-xs shadow-2xs">
                  <span className="font-semibold text-slate-500 shrink-0 text-[11px] sm:text-xs">Nama Proyek:</span>
                  <select
                    id="filter-project-name-select"
                    value={selectedProjectName}
                    onChange={(e) => setSelectedProjectName(e.target.value)}
                    className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer text-xs max-w-[170px] sm:max-w-[180px] truncate"
                  >
                    <option value="all">Semua Nama Proyek</option>
                    {availableProjectNames.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>

                {/* Picklist Skema Bayar */}
                <div className="flex items-center justify-between sm:justify-start gap-1.5 bg-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl border border-slate-200 text-xs shadow-2xs">
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
                <div className="flex items-center justify-between sm:justify-start gap-1.5 bg-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl border border-slate-200 text-xs shadow-2xs">
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

                <span className="text-[11px] sm:text-xs font-bold text-slate-600 bg-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl border border-slate-200 shrink-0 text-center">
                  {filteredProjects.length} Proyek Ditemukan
                </span>
              </div>
            </div>
          </div>

          {/* ================= HIRARKI 3: PROYEK PERUMAHAN PHOTO CARDS GRID ================= */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-300 p-8 space-y-4">
              <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
              {isDbError && projects.length === 0 ? (
                <p className="text-slate-600 font-semibold text-sm">Terjadi Gangguan pada koneksi database</p>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-slate-700">Belum Ada Proyek Sesuai Pencarian</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Silakan ganti kata kunci pencarian atau pilih kota lain untuk melihat proyek yang tersedia.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  id={`project-card-${project.id}`}
                  onClick={() => onOpenProjectDetail(project)}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col cursor-pointer"
                >
                  {/* Main Primary Photo & Badges */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    {project.photos && project.photos[0] && project.photos[0].trim() !== '' ? (
                      <img
                        src={project.photos[0]}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                        <Building2 className="w-12 h-12 opacity-50" />
                      </div>
                    )}

                    {/* Photo Count Badge (Kiri Atas Foto: Sesuai jumlah data foto di database) */}
                    {(() => {
                      const validList = (project.photos || []).filter((p) => typeof p === 'string' && p.trim() !== '');
                      const uniqueCount = new Set(validList).size;
                      return uniqueCount > 0 ? (
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold shadow-xs">
                            {uniqueCount} Foto
                          </span>
                        </div>
                      ) : null;
                    })()}

                    {/* City Tag */}
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#0B1E36] font-bold text-xs shadow flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-600" />
                        {project.cityName}
                      </span>
                    </div>

                    {/* Bottom Gradient Over Title */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <p className="text-[11px] text-amber-300 font-semibold">{project.type}</p>
                      <h3 className="text-lg font-bold font-['Outfit',sans-serif] leading-tight truncate">
                        {project.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body Specs */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    
                    {/* Price */}
                    <div className="border-b border-slate-100 pb-3">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Harga Mulai Dari</p>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xl font-black text-[#0B1E36] font-['Outfit',sans-serif]">
                          {project.priceDisplay}
                        </span>
                      </div>
                    </div>

                    {/* Quick Specs Grid */}
                    <div className="grid grid-cols-4 gap-2 text-center text-xs py-1">
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <Maximize2 className="w-3.5 h-3.5 text-amber-600 mx-auto mb-1" />
                        <p className="font-bold text-slate-800">{project.specs.surfaceArea}m²</p>
                        <p className="text-[9px] text-slate-400">LT</p>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <Maximize2 className="w-3.5 h-3.5 text-amber-600 mx-auto mb-1" />
                        <p className="font-bold text-slate-800">{project.specs.buildingArea}m²</p>
                        <p className="text-[9px] text-slate-400">LB</p>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <BedDouble className="w-3.5 h-3.5 text-amber-600 mx-auto mb-1" />
                        <p className="font-bold text-slate-800">{project.specs.bedrooms} KT</p>
                        <p className="text-[9px] text-slate-400">Kamar</p>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <Bath className="w-3.5 h-3.5 text-amber-600 mx-auto mb-1" />
                        <p className="font-bold text-slate-800">{project.specs.bathrooms} KM</p>
                        <p className="text-[9px] text-slate-400">Toilet</p>
                      </div>
                    </div>

                    {/* Address snippet */}
                    <p className="text-xs text-slate-500 line-clamp-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{project.address}</span>
                    </p>

                    {/* Payment Scheme Badges Indicator */}
                    <div className="pt-2 border-t border-slate-100">
                      <PaymentSchemeBadges schemes={project.paymentSchemes} badgeSize="sm" />
                    </div>

                    {/* Action Button */}
                    <div className="pt-2 flex items-center justify-between gap-2">
                      <button
                        id={`btn-open-detail-${project.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenProjectDetail(project);
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-[#0B1E36] group-hover:bg-amber-500 group-hover:text-slate-950 text-amber-300 py-2.5 px-4 rounded-xl font-bold text-xs transition-all duration-200 shadow-sm cursor-pointer"
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
