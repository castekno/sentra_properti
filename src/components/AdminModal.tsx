import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  KeyRound, 
  Building2, 
  MapPin, 
  Image as ImageIcon, 
  Sliders, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  LogOut,
  Layers,
  Phone,
  Compass,
  Upload
} from 'lucide-react';
import { City, Project, DocumentationItem, SiteSettings, PropertyStatus, DocCategory } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  isAdmin: boolean;
  onClose: () => void;
  onLogin: (password: string) => boolean;
  onLogout: () => void;
  
  // Data
  cities: City[];
  projects: Project[];
  docs: DocumentationItem[];
  settings: SiteSettings;
  
  // Handlers
  onSaveCity: (city: Partial<City>) => Promise<void>;
  onDeleteCity: (id: string, name: string) => Promise<void>;
  
  onSaveProject: (project: Partial<Project>) => Promise<void>;
  onDeleteProject: (id: string, name: string) => Promise<void>;
  
  onSaveDoc: (doc: Partial<DocumentationItem>) => Promise<void>;
  onDeleteDoc: (id: string, title: string) => Promise<void>;
  
  onSaveSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  onResetData?: () => Promise<void>;

  // Trigger from outside to open edit specific item
  initialTab?: 'cities' | 'projects' | 'docs' | 'settings';
  editingCityItem?: City | null;
  editingProjectItem?: Project | null;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  isAdmin,
  onClose,
  onLogin,
  onLogout,
  cities,
  projects,
  docs,
  settings,
  onSaveCity,
  onDeleteCity,
  onSaveProject,
  onDeleteProject,
  onSaveDoc,
  onDeleteDoc,
  onSaveSettings,
  initialTab = 'projects',
  editingCityItem,
  editingProjectItem,
}) => {
  if (!isOpen) return null;

  // Login form state
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'cities' | 'projects' | 'docs' | 'settings'>(initialTab);

  // Status notification
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = onLogin(passwordInput);
    if (!success) {
      setLoginError('Password salah! Silakan coba lagi.');
    } else {
      setPasswordInput('');
      showNotification('Login admin berhasil!');
    }
  };

  // Helper to compress uploaded images to high-quality base64 for persistent Firestore storage
  const handleImageFileUpload = (file: File, callback: (dataUrl: string) => void) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 900;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        callback(dataUrl);
        showNotification('Foto berhasil dimuat!');
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // ---------------- CITY EDIT FORM STATE ----------------
  const [cityFormData, setCityFormData] = useState<Partial<City>>(
    editingCityItem || {
      name: '',
      province: 'DKI Jakarta & Sekitarnya',
      image: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=800&q=80',
      description: '',
      badge: '',
      featured: true,
    }
  );
  const [isEditingCity, setIsEditingCity] = useState<boolean>(!!editingCityItem);

  const handleOpenNewCity = () => {
    setCityFormData({
      name: '',
      province: '',
      image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80',
      description: '',
      badge: 'Baru',
      featured: false,
    });
    setIsEditingCity(true);
  };

  const handleSaveCitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityFormData.name) return;
    try {
      await onSaveCity({
        ...cityFormData,
        slug: cityFormData.slug || cityFormData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      });
      setIsEditingCity(false);
      showNotification('Data Kota berhasil disimpan!');
    } catch (err) {
      showNotification('Gagal menyimpan kota', 'error');
    }
  };

  // ---------------- PROJECT EDIT FORM STATE ----------------
  const default5Photos: [string, string, string, string, string] = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=85',
  ];

  const [projectFormData, setProjectFormData] = useState<Partial<Project>>(
    editingProjectItem || {
      cityId: cities[0]?.id || '',
      cityName: cities[0]?.name || '',
      name: '',
      tagline: 'Hunian Modern Strategis & Nyaman',
      developer: 'Sentra Land Development',
      type: 'Cluster Mewah 2 Lantai',
      price: 850000000,
      priceDisplay: 'Rp 850.000.000',
      installmentDisplay: 'Mulai Rp 4,5 Jt / bln',
      status: 'Ready Stock',
      address: '',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.28286902264!2d106.759478!3d-6.2297465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta!5e0!3m2!1sid!2sid',
      mapDirectionsUrl: '',
      shortDescription: '',
      fullDescription: '',
      specs: {
        surfaceArea: 72,
        buildingArea: 65,
        bedrooms: 3,
        bathrooms: 2,
        carports: 1,
        floors: 2,
        electricity: '2200 VA',
        water: 'PDAM Bersih',
        certificate: 'SHM (Sertifikat Hak Milik)',
        handoverEstimate: 'Ready Stock',
      },
      facilities: ['One Gate System', 'Security 24 Jam & CCTV', 'Taman Bermain Anak', 'Masjid Kawasan'],
      advantages: ['5 Menit ke Gerbang Tol', 'Dekat Pusat Perbelanjaan', 'Bebas Banjir'],
      photos: default5Photos,
      photoCaptions: [
        'Tampak Depan Fasad Modern',
        'Interior Ruang Tamu & Ruang Keluarga',
        'Kamar Tidur Utama Luas',
        'Dapur Bersih & Ruang Makan',
        'Fasilitas Gerbang Utama & One Gate',
      ],
      paymentSchemes: ['cash', 'bertahap', 'bsi'],
      minDpBertahapPercent: 50,
      maxTenorBertahapMonths: 24,
      featured: true,
    }
  );
  const [isEditingProject, setIsEditingProject] = useState<boolean>(!!editingProjectItem);

  const handleOpenNewProject = (defaultCityId?: string) => {
    const targetCity = cities.find(c => c.id === defaultCityId) || cities[0];
    setProjectFormData({
      cityId: targetCity ? targetCity.id : '',
      cityName: targetCity ? targetCity.name : '',
      name: '',
      tagline: 'Hunian Eksklusif dengan Akses Strategis',
      developer: 'Sentra Land Development',
      type: 'Cluster Mewah 2 Lantai',
      price: 950000000,
      priceDisplay: 'Rp 950.000.000',
      installmentDisplay: 'Mulai Rp 5,2 Jt / bln',
      status: 'Ready Stock',
      address: '',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127506.74996452285!2d104.68653229999999!3d-2.9549673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e3b75e8e858793b%3A0x3039d80b220cc30!2sKota%20Palembang%2C%20Sumatera%20Selatan!5e0!3m2!1sid!2sid!4v1700000000001!5m2!1sid!2sid',
      mapDirectionsUrl: '',
      shortDescription: 'Perumahan modern dengan spesifikasi premium dan legalitas aman.',
      fullDescription: 'Proyek perumahan terpadu persembahan Sentra Properti yang dirancang untuk memberikan kenyamanan, keamanan, dan nilai investasi jangka panjang optimal.',
      specs: {
        surfaceArea: 84,
        buildingArea: 75,
        bedrooms: 3,
        bathrooms: 2,
        carports: 2,
        floors: 2,
        electricity: '2200 VA',
        water: 'PDAM Bersih',
        certificate: 'SHM (Sertifikat Hak Milik)',
        handoverEstimate: 'Ready Stock',
      },
      facilities: ['One Gate System & CCTV 24 Jam', 'Clubhouse & Kolam Renang', 'Taman Bermain Anak', 'Masjid Kawasan'],
      advantages: ['Akses Tol 5 Menit', 'Dekat Stasiun & Pusat Perbelanjaan', 'Bebas Banjir'],
      photos: default5Photos,
      photoCaptions: [
        '1. Fasad Depan Modern',
        '2. Ruang Tamu & Ruang Keluarga',
        '3. Kamar Tidur Utama',
        '4. Dapur & Ruang Makan',
        '5. Fasilitas Gerbang Kawasan',
      ],
      paymentSchemes: ['cash', 'bertahap', 'bsi'],
      minDpBertahapPercent: 50,
      maxTenorBertahapMonths: 24,
      featured: true,
    });
    setIsEditingProject(true);
  };

  const handleSaveProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectFormData.name || !projectFormData.cityId) return;

    const matchedCity = cities.find(c => c.id === projectFormData.cityId);

    // Bersihkan foto: ambil hanya string valid tanpa duplikasi (maksimum 6 foto)
    const rawPhotos = (projectFormData.photos || [])
      .filter((url): url is string => typeof url === 'string' && url.trim() !== '');
    const cleanPhotos: string[] = [];
    for (const url of rawPhotos) {
      if (!cleanPhotos.includes(url.trim())) {
        cleanPhotos.push(url.trim());
      }
    }
    const finalPhotos = cleanPhotos.slice(0, 6);

    try {
      await onSaveProject({
        ...projectFormData,
        cityName: matchedCity ? matchedCity.name : projectFormData.cityName,
        slug: projectFormData.slug || projectFormData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        photos: finalPhotos.length > 0 ? finalPhotos : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85'],
      });
      setIsEditingProject(false);
      showNotification('Data Proyek Perumahan berhasil disimpan ke Firebase!');
    } catch (err) {
      showNotification('Gagal menyimpan proyek', 'error');
    }
  };

  // ---------------- DOCUMENTATION EDIT FORM STATE ----------------
  const [docFormData, setDocFormData] = useState<Partial<DocumentationItem>>({
    title: '',
    category: 'Serah Terima Kunci',
    date: 'Agustus 2026',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    description: '',
    location: 'Jakarta',
  });
  const [isEditingDoc, setIsEditingDoc] = useState<boolean>(false);

  const handleSaveDocSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFormData.title) return;
    try {
      await onSaveDoc(docFormData);
      setIsEditingDoc(false);
      showNotification('Dokumentasi berhasil disimpan!');
    } catch (err) {
      showNotification('Gagal menyimpan dokumentasi', 'error');
    }
  };

  // ---------------- SETTINGS EDIT FORM STATE ----------------
  const [settingsFormData, setSettingsFormData] = useState<SiteSettings>(settings);

  const handleSaveSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSaveSettings(settingsFormData);
      showNotification('Pengaturan Landing Page & Kontak berhasil diperbarui!');
    } catch (err) {
      showNotification('Gagal memperbarui pengaturan', 'error');
    }
  };

  return (
    <div 
      id="admin-modal-backdrop" 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div 
        id="admin-modal-card" 
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#0B1E36] text-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-['Outfit',sans-serif]">
                {isAdmin ? 'Panel Kontrol Admin Sentra Properti' : 'Login Admin Sentra Properti'}
              </h2>
              <p className="text-xs text-amber-200/80">
                {isAdmin
                  ? 'Kelola Kota, Proyek Perumahan, Dokumentasi, & Landing Page (Tersimpan di Firebase)'
                  : 'Masukkan password admin untuk mengelola isi landing page'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                id="admin-logout-action-btn"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}

            <button
              id="admin-close-modal-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Notification Banner */}
        {notification && (
          <div
            className={`px-6 py-2.5 text-xs font-bold flex items-center justify-between ${
              notification.type === 'success'
                ? 'bg-emerald-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Modal Body Content */}
        {!isAdmin ? (
          /* ================= LOGIN FORM ================= */
          <div className="p-8 sm:p-12 max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-700 border-2 border-amber-300 flex items-center justify-center mx-auto shadow-inner">
              <KeyRound className="w-8 h-8 text-amber-600" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#0B1E36] font-['Outfit',sans-serif]">
                Autentikasi User Admin
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Silakan masukkan password administrator untuk mengakses panel pengeditan landing page dan database Firebase.
              </p>
            </div>

            <form id="admin-login-form" onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Password Admin
                </label>
                <input
                  id="admin-password-input"
                  type="password"
                  required
                  placeholder="Masukkan password admin..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-slate-50 text-slate-900"
                />
              </div>

              {loginError && (
                <p className="text-xs font-semibold text-red-600 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </p>
              )}

              <button
                id="admin-submit-login-btn"
                type="submit"
                className="w-full py-3 px-4 bg-[#0B1E36] hover:bg-[#122b4d] text-amber-300 hover:text-amber-200 font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
              >
                Masuk ke Panel Admin
              </button>

            </form>
          </div>
        ) : (
          /* ================= LOGGED IN ADMIN DASHBOARD ================= */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Admin Tabs Bar */}
            <div className="bg-slate-100 border-b border-slate-200 px-6 pt-3 flex items-center gap-2 overflow-x-auto shrink-0">
              <button
                id="tab-btn-cities"
                onClick={() => {
                  setActiveTab('cities');
                  setIsEditingCity(false);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl font-bold text-xs sm:text-sm border-t border-x transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'cities'
                    ? 'bg-white text-[#0B1E36] border-slate-200 shadow-xs'
                    : 'bg-transparent text-slate-600 border-transparent hover:text-slate-900'
                }`}
              >
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>1. Kelola Kota ({cities.length})</span>
              </button>

              <button
                id="tab-btn-projects"
                onClick={() => {
                  setActiveTab('projects');
                  setIsEditingProject(false);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl font-bold text-xs sm:text-sm border-t border-x transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'projects'
                    ? 'bg-white text-[#0B1E36] border-slate-200 shadow-xs'
                    : 'bg-transparent text-slate-600 border-transparent hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>2. Kelola Proyek ({projects.length})</span>
              </button>

              <button
                id="tab-btn-docs"
                onClick={() => {
                  setActiveTab('docs');
                  setIsEditingDoc(false);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl font-bold text-xs sm:text-sm border-t border-x transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'docs'
                    ? 'bg-white text-[#0B1E36] border-slate-200 shadow-xs'
                    : 'bg-transparent text-slate-600 border-transparent hover:text-slate-900'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-amber-600" />
                <span>3. Dokumentasi ({docs.length})</span>
              </button>

              <button
                id="tab-btn-settings"
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-2xl font-bold text-xs sm:text-sm border-t border-x transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-white text-[#0B1E36] border-slate-200 shadow-xs'
                    : 'bg-transparent text-slate-600 border-transparent hover:text-slate-900'
                }`}
              >
                <Sliders className="w-4 h-4 text-amber-600" />
                <span>4. Pengaturan Teks & Kontak</span>
              </button>
            </div>

            {/* Tab Body Contents */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50">
              
              {/* ================= TAB 1: KELOLA KOTA ================= */}
              {activeTab === 'cities' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Daftar Kota (Hirarki Tingkat 1)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Kota dapat ditambahkan atau dihapus. Proyek perumahan akan dikelompokkan berdasarkan kota ini.
                      </p>
                    </div>

                    {!isEditingCity && (
                      <button
                        id="admin-create-city-btn"
                        onClick={handleOpenNewCity}
                        className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold shadow cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Kota Baru</span>
                      </button>
                    )}
                  </div>

                  {isEditingCity ? (
                    /* Edit / Add City Form */
                    <form onSubmit={handleSaveCitySubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h4 className="font-bold text-sm text-[#0B1E36]">
                          {cityFormData.id ? `Edit Kota: ${cityFormData.name}` : 'Tambah Kota Baru'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setIsEditingCity(false)}
                          className="text-xs text-slate-500 hover:text-slate-800"
                        >
                          Batal
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Nama Kota <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Bandung"
                            value={cityFormData.name || ''}
                            onChange={(e) => setCityFormData({ ...cityFormData, name: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Provinsi / Wilayah
                          </label>
                          <input
                            type="text"
                            placeholder="Contoh: Jawa Barat"
                            value={cityFormData.province || ''}
                            onChange={(e) => setCityFormData({ ...cityFormData, province: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Foto Thumbnail Kota (Upload / URL)
                          </label>
                          <div className="space-y-2">
                            <div className="flex gap-2 items-center">
                              <input
                                type="text"
                                placeholder="https://images.unsplash.com/... atau pilih file"
                                value={cityFormData.image || ''}
                                onChange={(e) => setCityFormData({ ...cityFormData, image: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900"
                              />
                              <label
                                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-all shrink-0"
                                title="Upload foto dari perangkat"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleImageFileUpload(file, (dataUrl) => {
                                        setCityFormData({ ...cityFormData, image: dataUrl });
                                      });
                                    }
                                  }}
                                />
                              </label>
                            </div>
                            {cityFormData.image && cityFormData.image.trim() !== '' ? (
                              <img
                                src={cityFormData.image}
                                alt="Preview Kota"
                                className="w-full h-24 object-cover rounded-xl border border-slate-200"
                              />
                            ) : null}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Badge Khusus (Opsional)
                          </label>
                          <input
                            type="text"
                            placeholder="Contoh: Paling Diminati / Udara Sejuk"
                            value={cityFormData.badge || ''}
                            onChange={(e) => setCityFormData({ ...cityFormData, badge: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Deskripsi Singkat Kota
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Deskripsi daya tarik kota untuk calon pembeli..."
                          value={cityFormData.description || ''}
                          onChange={(e) => setCityFormData({ ...cityFormData, description: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900"
                        ></textarea>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsEditingCity(false)}
                          className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-600"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#0B1E36] text-amber-300 rounded-xl text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Simpan Kota</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* City List Table */
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                          <tr>
                            <th className="p-3">Foto</th>
                            <th className="p-3">Nama Kota</th>
                            <th className="p-3">Provinsi</th>
                            <th className="p-3">Badge</th>
                            <th className="p-3 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {cities.map((c) => (
                            <tr key={c.id} className="hover:bg-slate-50/80">
                              <td className="p-3">
                                {c.image && c.image.trim() !== '' ? (
                                  <img src={c.image} alt={c.name} className="w-12 h-8 rounded-lg object-cover" />
                                ) : (
                                  <div className="w-12 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400">
                                    <Building2 className="w-4 h-4" />
                                  </div>
                                )}
                              </td>
                              <td className="p-3 font-bold text-slate-900">{c.name}</td>
                              <td className="p-3 text-slate-600">{c.province}</td>
                              <td className="p-3">
                                {c.badge && (
                                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-semibold text-[10px]">
                                    {c.badge}
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-right space-x-2">
                                <button
                                  onClick={() => {
                                    setCityFormData(c);
                                    setIsEditingCity(true);
                                  }}
                                  className="p-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100"
                                  title="Edit"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Hapus kota "${c.name}" beserta proyek di dalamnya?`)) {
                                      onDeleteCity(c.id, c.name);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ================= TAB 2: KELOLA PROYEK PERUMAHAN ================= */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Daftar Proyek Perumahan (Hirarki Tingkat 2)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Proyek berisi 5 foto utama, peta lokasi, detail spesifikasi, dan harga. Disimpan di Firebase Firestore.
                      </p>
                    </div>

                    {!isEditingProject && (
                      <button
                        id="admin-create-proj-btn"
                        onClick={() => handleOpenNewProject()}
                        className="flex items-center gap-1.5 bg-[#0B1E36] hover:bg-[#122b4d] text-amber-300 px-3.5 py-2 rounded-xl text-xs font-bold shadow cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Proyek Baru</span>
                      </button>
                    )}
                  </div>

                  {isEditingProject ? (
                    /* Project Add/Edit Form */
                    <form onSubmit={handleSaveProjectSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h4 className="font-bold text-sm text-[#0B1E36]">
                          {projectFormData.id ? `Edit Proyek: ${projectFormData.name}` : 'Tambah Proyek Perumahan Baru'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setIsEditingProject(false)}
                          className="text-xs text-slate-500 hover:text-slate-800"
                        >
                          Batal
                        </button>
                      </div>

                      {/* General Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Kota Induk <span className="text-red-500">*</span>
                          </label>
                          <select
                            required
                            value={projectFormData.cityId || ''}
                            onChange={(e) => {
                              const c = cities.find(x => x.id === e.target.value);
                              setProjectFormData({
                                ...projectFormData,
                                cityId: e.target.value,
                                cityName: c ? c.name : projectFormData.cityName,
                              });
                            }}
                            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 cursor-pointer"
                          >
                            {cities.map(c => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Nama Proyek / Cluster <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Grand Sentra Residence"
                            value={projectFormData.name || ''}
                            onChange={(e) => setProjectFormData({ ...projectFormData, name: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Status Properti
                          </label>
                          <select
                            value={projectFormData.status || 'Ready Stock'}
                            onChange={(e) => setProjectFormData({ ...projectFormData, status: e.target.value as PropertyStatus })}
                            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 cursor-pointer"
                          >
                            <option value="Ready Stock">Ready Stock</option>
                            <option value="Indent">Indent</option>
                            <option value="Promo Spesial">Promo Spesial</option>
                            <option value="Hot Deal">Hot Deal</option>
                            <option value="Sold Out">Sold Out</option>
                          </select>
                        </div>
                      </div>

                      {/* Pricing & Tagline */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Harga Angka (IDR) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            required
                            placeholder="850000000"
                            value={projectFormData.price || 0}
                            onChange={(e) => {
                              const p = Number(e.target.value);
                              setProjectFormData({
                                ...projectFormData,
                                price: p,
                                priceDisplay: `Rp ${p.toLocaleString('id-ID')}`,
                              });
                            }}
                            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Format Teks Harga Display
                          </label>
                          <input
                            type="text"
                            value={projectFormData.priceDisplay || ''}
                            onChange={(e) => setProjectFormData({ ...projectFormData, priceDisplay: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Estimasi Cicilan Display
                          </label>
                          <input
                            type="text"
                            placeholder="Mulai Rp 4,5 Jt / bln"
                            value={projectFormData.installmentDisplay || ''}
                            onChange={(e) => setProjectFormData({ ...projectFormData, installmentDisplay: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900"
                          />
                        </div>
                      </div>

                      {/* SKEMA PEMBAYARAN SYARIAH (CASH / CASH BERTAHAP / BSI) */}
                      <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <h5 className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                            <Sliders className="w-4 h-4 text-emerald-700" />
                            Pilihan Skema Pembayaran Syariah (Bisa Cash Saja, Bertahap, BSI, atau Ketiganya)
                          </h5>
                          <span className="text-[11px] text-emerald-800 font-semibold">Tersimpan di Firebase</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {/* Cash Keras */}
                          <label className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                            (projectFormData.paymentSchemes || ['cash', 'bertahap', 'bsi', 'developer']).includes('cash')
                              ? 'bg-white border-blue-400 shadow-xs'
                              : 'bg-slate-50/50 border-slate-200 opacity-60'
                          }`}>
                            <input
                              type="checkbox"
                              checked={(projectFormData.paymentSchemes || ['cash', 'bertahap', 'bsi', 'developer']).includes('cash')}
                              onChange={(e) => {
                                const cur = projectFormData.paymentSchemes || ['cash', 'bertahap', 'bsi', 'developer'];
                                const updated = e.target.checked
                                  ? [...cur, 'cash']
                                  : cur.filter(s => s !== 'cash');
                                setProjectFormData({
                                  ...projectFormData,
                                  paymentSchemes: updated.length > 0 ? updated : ['cash'],
                                });
                              }}
                              className="mt-0.5 accent-blue-600 rounded cursor-pointer"
                            />
                            <div>
                              <p className="text-xs font-bold text-slate-900">Cash</p>
                              <p className="text-[11px] text-slate-500">Pelunasan langsung / cash keras.</p>
                            </div>
                          </label>

                          {/* Cash Bertahap In-House */}
                          <label className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                            (projectFormData.paymentSchemes || ['cash', 'bertahap', 'bsi', 'developer']).includes('bertahap')
                              ? 'bg-white border-amber-500 shadow-xs'
                              : 'bg-slate-50/50 border-slate-200 opacity-60'
                          }`}>
                            <input
                              type="checkbox"
                              checked={(projectFormData.paymentSchemes || ['cash', 'bertahap', 'bsi', 'developer']).includes('bertahap')}
                              onChange={(e) => {
                                const cur = projectFormData.paymentSchemes || ['cash', 'bertahap', 'bsi', 'developer'];
                                const updated = e.target.checked
                                  ? [...cur, 'bertahap']
                                  : cur.filter(s => s !== 'bertahap');
                                setProjectFormData({
                                  ...projectFormData,
                                  paymentSchemes: updated.length > 0 ? updated : ['cash'],
                                });
                              }}
                              className="mt-0.5 accent-amber-600 rounded cursor-pointer"
                            />
                            <div>
                              <p className="text-xs font-bold text-slate-900">Cash Bertahap</p>
                              <p className="text-[11px] text-slate-500">Cicilan bertahap ke developer.</p>
                            </div>
                          </label>

                          {/* Bank BSI */}
                          <label className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                            (projectFormData.paymentSchemes || ['cash', 'bertahap', 'bsi', 'developer']).includes('bsi')
                              ? 'bg-white border-emerald-500 shadow-xs'
                              : 'bg-slate-50/50 border-slate-200 opacity-60'
                          }`}>
                            <input
                              type="checkbox"
                              checked={(projectFormData.paymentSchemes || ['cash', 'bertahap', 'bsi', 'developer']).includes('bsi')}
                              onChange={(e) => {
                                const cur = projectFormData.paymentSchemes || ['cash', 'bertahap', 'bsi', 'developer'];
                                const updated = e.target.checked
                                  ? [...cur, 'bsi']
                                  : cur.filter(s => s !== 'bsi');
                                setProjectFormData({
                                  ...projectFormData,
                                  paymentSchemes: updated.length > 0 ? updated : ['cash'],
                                });
                              }}
                              className="mt-0.5 accent-emerald-600 rounded cursor-pointer"
                            />
                            <div>
                              <p className="text-xs font-bold text-slate-900">Bank BSI</p>
                              <p className="text-[11px] text-slate-500">Pembiayaan syariah mitra Bank BSI.</p>
                            </div>
                          </label>

                          {/* Credit Developer */}
                          <label className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                            (projectFormData.paymentSchemes || ['cash', 'bertahap', 'bsi', 'developer']).includes('developer')
                              ? 'bg-white border-indigo-500 shadow-xs'
                              : 'bg-slate-50/50 border-slate-200 opacity-60'
                          }`}>
                            <input
                              type="checkbox"
                              checked={(projectFormData.paymentSchemes || ['cash', 'bertahap', 'bsi', 'developer']).includes('developer')}
                              onChange={(e) => {
                                const cur = projectFormData.paymentSchemes || ['cash', 'bertahap', 'bsi', 'developer'];
                                const updated = e.target.checked
                                  ? [...cur, 'developer']
                                  : cur.filter(s => s !== 'developer');
                                setProjectFormData({
                                  ...projectFormData,
                                  paymentSchemes: updated.length > 0 ? updated : ['cash'],
                                });
                              }}
                              className="mt-0.5 accent-indigo-600 rounded cursor-pointer"
                            />
                            <div>
                              <p className="text-xs font-bold text-slate-900">Credit Developer</p>
                              <p className="text-[11px] text-slate-500">Kredit internal langsung pengembang.</p>
                            </div>
                          </label>
                        </div>

                        {/* Pengaturan Khusus Cash Bertahap */}
                        {(projectFormData.paymentSchemes || ['cash', 'bertahap', 'bsi']).includes('bertahap') && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-amber-200">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                Ketentuan Uang Muka (DP) Minimal Bertahap (%)
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="10"
                                  max="90"
                                  step="5"
                                  value={projectFormData.minDpBertahapPercent ?? 50}
                                  onChange={(e) => setProjectFormData({
                                    ...projectFormData,
                                    minDpBertahapPercent: Math.max(10, Math.min(90, Number(e.target.value) || 50)),
                                  })}
                                  className="w-full px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs font-bold text-slate-900"
                                />
                                <span className="text-xs font-bold text-slate-600">%</span>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-1">Default 50% atau sesuai ketentuan developer.</p>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                Batas Maksimal Tenor Bertahap (Bulan)
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="6"
                                  max="60"
                                  step="6"
                                  value={projectFormData.maxTenorBertahapMonths ?? 24}
                                  onChange={(e) => setProjectFormData({
                                    ...projectFormData,
                                    maxTenorBertahapMonths: Math.max(6, Math.min(60, Number(e.target.value) || 24)),
                                  })}
                                  className="w-full px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs font-bold text-slate-900"
                                />
                                <span className="text-xs font-bold text-slate-600">Bln</span>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-1">Contoh: 12, 24, atau 36 bulan cicilan developer.</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* FOTO PROYEK (KAPASITAS MAKSIMAL 6 FOTO) */}
                      <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                            <ImageIcon className="w-4 h-4 text-amber-700" />
                            Foto Galeri Proyek (Maksimal 6 Foto - Tersimpan di Firebase & Detail Proyek)
                          </h5>
                          <span className="text-[11px] text-amber-800 font-semibold">Bisa Upload File atau Input URL</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                          {[0, 1, 2, 3, 4, 5].map((idx) => {
                            const photoLabels = [
                              '1. Fasad Depan',
                              '2. Ruang Tamu',
                              '3. Kamar Utama',
                              '4. Dapur/Makan',
                              '5. Fasilitas/Gerbang',
                              '6. Denah/Kawasan',
                            ];

                            const existingPhotosList = Array.isArray(projectFormData.photos) ? projectFormData.photos : [];
                            const photoUrl = existingPhotosList[idx] || '';

                            return (
                              <div key={idx} className="space-y-1.5 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                                <div className="flex items-center justify-between">
                                  <label className="block text-[10px] font-bold text-slate-700 truncate">
                                    {photoLabels[idx]}
                                  </label>
                                  {photoUrl ? (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = [...existingPhotosList];
                                        updated.splice(idx, 1);
                                        setProjectFormData({
                                          ...projectFormData,
                                          photos: updated,
                                        });
                                      }}
                                      className="text-[9px] text-red-600 hover:text-red-700 font-bold"
                                      title="Hapus foto ini"
                                    >
                                      Hapus
                                    </button>
                                  ) : null}
                                </div>
                                <div className="relative group">
                                  {photoUrl && photoUrl.trim() !== '' ? (
                                    <img
                                      src={photoUrl}
                                      alt={`Preview ${idx + 1}`}
                                      className="w-full h-20 object-cover rounded-lg bg-slate-100 border border-slate-100"
                                    />
                                  ) : (
                                    <div className="w-full h-20 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                                      <Building2 className="w-6 h-6" />
                                    </div>
                                  )}
                                  <label className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 rounded-lg cursor-pointer transition-all text-[10px] font-bold">
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>{photoUrl ? 'Ganti Foto' : 'Pilih Foto'}</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          handleImageFileUpload(file, (dataUrl) => {
                                            const updated = [...existingPhotosList];
                                            updated[idx] = dataUrl;
                                            setProjectFormData({
                                              ...projectFormData,
                                              photos: updated,
                                            });
                                          });
                                        }
                                      }}
                                    />
                                  </label>
                                </div>
                                <div className="flex gap-1 items-center">
                                  <input
                                    type="text"
                                    placeholder="URL / Base64 Foto..."
                                    value={photoUrl}
                                    onChange={(e) => {
                                      const updated = [...existingPhotosList];
                                      updated[idx] = e.target.value;
                                      setProjectFormData({
                                        ...projectFormData,
                                        photos: updated,
                                      });
                                    }}
                                    className="w-full px-2 py-1 bg-slate-50 rounded border border-slate-200 text-[9px]"
                                  />
                                  <label
                                    className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                                    title="Upload file foto dari perangkat"
                                  >
                                    <Upload className="w-3 h-3" />
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          handleImageFileUpload(file, (dataUrl) => {
                                            const updated = [...existingPhotosList];
                                            updated[idx] = dataUrl;
                                            setProjectFormData({
                                              ...projectFormData,
                                              photos: updated,
                                            });
                                          });
                                        }
                                      }}
                                    />
                                  </label>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Map & Address */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Alamat Lengkap Proyek
                          </label>
                          <input
                            type="text"
                            placeholder="Jl. Raya Utama No. 88..."
                            value={projectFormData.address || ''}
                            onChange={(e) => setProjectFormData({ ...projectFormData, address: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Google Maps Embed Iframe URL
                          </label>
                          <input
                            type="text"
                            placeholder="https://www.google.com/maps/embed?..."
                            value={projectFormData.mapEmbedUrl || ''}
                            onChange={(e) => setProjectFormData({ ...projectFormData, mapEmbedUrl: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900"
                          />
                        </div>
                      </div>

                      {/* Specifications Grid */}
                      <div className="border border-slate-200 p-4 rounded-2xl space-y-3 bg-slate-50/50">
                        <h5 className="font-bold text-xs text-slate-800">Spesifikasi Detail Bangunan</h5>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-1">Luas Tanah (m²)</label>
                            <input
                              type="number"
                              value={projectFormData.specs?.surfaceArea || 72}
                              onChange={(e) =>
                                setProjectFormData({
                                  ...projectFormData,
                                  specs: { ...projectFormData.specs!, surfaceArea: Number(e.target.value) },
                                })
                              }
                              className="w-full px-2 py-1.5 bg-white rounded-lg border border-slate-200 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-1">Luas Bangunan (m²)</label>
                            <input
                              type="number"
                              value={projectFormData.specs?.buildingArea || 65}
                              onChange={(e) =>
                                setProjectFormData({
                                  ...projectFormData,
                                  specs: { ...projectFormData.specs!, buildingArea: Number(e.target.value) },
                                })
                              }
                              className="w-full px-2 py-1.5 bg-white rounded-lg border border-slate-200 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-1">Kamar Tidur (KT)</label>
                            <input
                              type="number"
                              value={projectFormData.specs?.bedrooms || 3}
                              onChange={(e) =>
                                setProjectFormData({
                                  ...projectFormData,
                                  specs: { ...projectFormData.specs!, bedrooms: Number(e.target.value) },
                                })
                              }
                              className="w-full px-2 py-1.5 bg-white rounded-lg border border-slate-200 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-1">Kamar Mandi (KM)</label>
                            <input
                              type="number"
                              value={projectFormData.specs?.bathrooms || 2}
                              onChange={(e) =>
                                setProjectFormData({
                                  ...projectFormData,
                                  specs: { ...projectFormData.specs!, bathrooms: Number(e.target.value) },
                                })
                              }
                              className="w-full px-2 py-1.5 bg-white rounded-lg border border-slate-200 text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-1">Daya Listrik</label>
                            <input
                              type="text"
                              value={projectFormData.specs?.electricity || '2200 VA'}
                              onChange={(e) =>
                                setProjectFormData({
                                  ...projectFormData,
                                  specs: { ...projectFormData.specs!, electricity: e.target.value },
                                })
                              }
                              className="w-full px-2 py-1.5 bg-white rounded-lg border border-slate-200 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-1">Sumber Air</label>
                            <input
                              type="text"
                              value={projectFormData.specs?.water || 'PDAM Bersih'}
                              onChange={(e) =>
                                setProjectFormData({
                                  ...projectFormData,
                                  specs: { ...projectFormData.specs!, water: e.target.value },
                                })
                              }
                              className="w-full px-2 py-1.5 bg-white rounded-lg border border-slate-200 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-1">Legalitas / Sertifikat</label>
                            <input
                              type="text"
                              value={projectFormData.specs?.certificate || 'SHM (Sertifikat Hak Milik)'}
                              onChange={(e) =>
                                setProjectFormData({
                                  ...projectFormData,
                                  specs: { ...projectFormData.specs!, certificate: e.target.value },
                                })
                              }
                              className="w-full px-2 py-1.5 bg-white rounded-lg border border-slate-200 text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Descriptions */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Deskripsi Lengkap Proyek
                        </label>
                        <textarea
                          rows={3}
                          value={projectFormData.fullDescription || ''}
                          onChange={(e) => setProjectFormData({ ...projectFormData, fullDescription: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900"
                        ></textarea>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsEditingProject(false)}
                          className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-600"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#0B1E36] text-amber-300 rounded-xl text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Simpan Proyek</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Project Table */
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                          <tr>
                            <th className="p-3">Foto</th>
                            <th className="p-3">Nama Proyek</th>
                            <th className="p-3">Kota</th>
                            <th className="p-3">Harga</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {projects.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/80">
                              <td className="p-3">
                                {p.photos && p.photos[0] && p.photos[0].trim() !== '' ? (
                                  <img src={p.photos[0]} alt={p.name} className="w-12 h-8 rounded-lg object-cover" />
                                ) : (
                                  <div className="w-12 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400">
                                    <Building2 className="w-4 h-4" />
                                  </div>
                                )}
                              </td>
                              <td className="p-3 font-bold text-slate-900">{p.name}</td>
                              <td className="p-3 text-slate-600">{p.cityName}</td>
                              <td className="p-3 font-bold text-[#0B1E36]">{p.priceDisplay}</td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-semibold text-[10px]">
                                  {p.status}
                                </span>
                              </td>
                              <td className="p-3 text-right space-x-2">
                                <button
                                  onClick={() => {
                                    setProjectFormData(p);
                                    setIsEditingProject(true);
                                  }}
                                  className="p-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100"
                                  title="Edit"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Hapus proyek "${p.name}"?`)) {
                                      onDeleteProject(p.id, p.name);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ================= TAB 3: KELOLA DOKUMENTASI ================= */}
              {activeTab === 'docs' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Galeri Dokumentasi & Bukti Serah Terima
                      </h3>
                      <p className="text-xs text-slate-500">
                        Tambahkan foto serah terima kunci, progres proyek, atau event akad.
                      </p>
                    </div>

                    {!isEditingDoc && (
                      <button
                        onClick={() => {
                          setDocFormData({
                            title: '',
                            category: 'Serah Terima Kunci',
                            date: 'Agustus 2026',
                            imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
                            description: '',
                            location: 'Sentra Properti',
                          });
                          setIsEditingDoc(true);
                        }}
                        className="flex items-center gap-1.5 bg-[#0B1E36] hover:bg-[#122b4d] text-amber-300 px-3.5 py-2 rounded-xl text-xs font-bold shadow cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Dokumentasi</span>
                      </button>
                    )}
                  </div>

                  {isEditingDoc ? (
                    <form onSubmit={handleSaveDocSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                      <h4 className="font-bold text-sm text-[#0B1E36] border-b border-slate-100 pb-2">
                        {docFormData.id ? 'Edit Dokumentasi' : 'Tambah Foto Dokumentasi'}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Judul Dokumentasi</label>
                          <input
                            type="text"
                            required
                            placeholder="Serah Terima Kunci Unit..."
                            value={docFormData.title || ''}
                            onChange={(e) => setDocFormData({ ...docFormData, title: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                          <select
                            value={docFormData.category || 'Serah Terima Kunci'}
                            onChange={(e) => setDocFormData({ ...docFormData, category: e.target.value as DocCategory })}
                            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                          >
                            <option value="Serah Terima Kunci">Serah Terima Kunci</option>
                            <option value="Progress Pembangunan">Progress Pembangunan</option>
                            <option value="Akad Massal">Akad Massal</option>
                            <option value="Legalitas & Sertifikat">Legalitas & Sertifikat</option>
                            <option value="Event & Gathering">Event & Gathering</option>
                            <option value="Site Visit Proyek">Site Visit Proyek</option>
                            <option value="Lainnya">Lainnya</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">Foto Dokumentasi (Upload / URL)</label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              required
                              placeholder="URL atau pilih file..."
                              value={docFormData.imageUrl || ''}
                              onChange={(e) => setDocFormData({ ...docFormData, imageUrl: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                            />
                            <label
                              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-all shrink-0"
                              title="Upload foto dari perangkat"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleImageFileUpload(file, (dataUrl) => {
                                      setDocFormData({ ...docFormData, imageUrl: dataUrl });
                                    });
                                  }
                                }}
                              />
                            </label>
                          </div>
                          {docFormData.imageUrl && docFormData.imageUrl.trim() !== '' ? (
                            <img
                              src={docFormData.imageUrl}
                              alt="Preview Doc"
                              className="w-full h-24 object-cover rounded-xl mt-2 border border-slate-200"
                            />
                          ) : null}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Kegiatan</label>
                          <input
                            type="text"
                            placeholder="15 Juli 2026"
                            value={docFormData.date || ''}
                            onChange={(e) => setDocFormData({ ...docFormData, date: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Keterangan Singkat</label>
                        <textarea
                          rows={2}
                          value={docFormData.description || ''}
                          onChange={(e) => setDocFormData({ ...docFormData, description: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                        ></textarea>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsEditingDoc(false)}
                          className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-600"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#0B1E36] text-amber-300 rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Simpan Dokumentasi</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {docs.map((d) => (
                        <div key={d.id} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                          {d.imageUrl && d.imageUrl.trim() !== '' ? (
                            <img src={d.imageUrl} alt={d.title} className="w-16 h-12 rounded-xl object-cover shrink-0" />
                          ) : (
                            <div className="w-16 h-12 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold text-amber-700">{d.category}</span>
                            <h5 className="font-bold text-xs text-slate-900 truncate">{d.title}</h5>
                            <p className="text-[10px] text-slate-400">{d.date}</p>
                          </div>
                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus dokumentasi "${d.title}"?`)) {
                                onDeleteDoc(d.id, d.title);
                              }
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ================= TAB 4: PENGATURAN LANDING PAGE ================= */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Pengaturan Tampilan & Kontak Landing Page
                      </h3>
                      <p className="text-xs text-slate-500">
                        Ubah nomor WhatsApp melayang, hotline telepon, headline banner, dan informasi kantor.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveSettingsSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    {/* WhatsApp & Contact Config */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider bg-amber-50 p-2.5 rounded-xl flex items-center gap-2">
                        <Phone className="w-4 h-4 text-amber-600" />
                        Konfigurasi Kontak & Tombol WhatsApp Melayang
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Nomor WhatsApp (Floating Icon)
                          </label>
                          <input
                            type="text"
                            placeholder="6281298765432"
                            value={settingsFormData.whatsappNumber}
                            onChange={(e) => setSettingsFormData({ ...settingsFormData, whatsappNumber: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono"
                          />
                          <span className="text-[10px] text-slate-400">Gunakan format angka tanpa spasi/tanda + (contoh: 6281298765432)</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Nomor Telepon Hotline
                          </label>
                          <input
                            type="text"
                            value={settingsFormData.phoneNumber}
                            onChange={(e) => setSettingsFormData({ ...settingsFormData, phoneNumber: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Email Kantor
                          </label>
                          <input
                            type="email"
                            value={settingsFormData.email}
                            onChange={(e) => setSettingsFormData({ ...settingsFormData, email: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Alamat Kantor Pusat
                        </label>
                        <input
                          type="text"
                          value={settingsFormData.officeAddress}
                          onChange={(e) => setSettingsFormData({ ...settingsFormData, officeAddress: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Embed Iframe Google Maps Kantor
                          </label>
                          <input
                            type="text"
                            value={settingsFormData.officeMapEmbed || ''}
                            onChange={(e) => setSettingsFormData({ ...settingsFormData, officeMapEmbed: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900"
                            placeholder="https://www.google.com/maps/embed?..."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            URL Direct Google Maps Kantor
                          </label>
                          <input
                            type="text"
                            value={settingsFormData.officeMapUrl || ''}
                            onChange={(e) => setSettingsFormData({ ...settingsFormData, officeMapUrl: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900"
                            placeholder="https://www.google.com/maps/place/..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Headline Banner Config */}
                    <div className="space-y-4 pt-2">
                      <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider bg-amber-50 p-2.5 rounded-xl flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-amber-600" />
                        Teks Headline Banner Home
                      </h4>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Headline Utama
                        </label>
                        <input
                          type="text"
                          value={settingsFormData.heroHeadline}
                          onChange={(e) => setSettingsFormData({ ...settingsFormData, heroHeadline: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Sub-Headline Deskripsi
                        </label>
                        <textarea
                          rows={2}
                          value={settingsFormData.heroSubheadline}
                          onChange={(e) => setSettingsFormData({ ...settingsFormData, heroSubheadline: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900"
                        ></textarea>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#0B1E36] hover:bg-[#122b4d] text-amber-300 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Simpan Perubahan Pengaturan</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
