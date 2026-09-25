import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  updateDoc,
  Firestore
} from 'firebase/firestore';
import { City, Project, DocumentationItem, SiteSettings, InquiryFormData } from '../types';
import { INITIAL_CITIES, INITIAL_PROJECTS, INITIAL_DOCUMENTATION, INITIAL_SETTINGS } from '../data/initialData';

// Konfigurasi Firebase dari spesifikasi pengguna
export const firebaseConfig = {
  projectId: "sentrapropertidb",
  appId: "1:300320734132:web:7a505d754547c752c3dc62",
  apiKey: "AIzaSyCoCWtU9R2PE51C3-Mi6DAOUrO9xLR_Yck",
  authDomain: "sentrapropertidb.firebaseapp.com",
  firestoreDatabaseId: "spdb",
  storageBucket: "sentrapropertidb.firebasestorage.app",
  messagingSenderId: "300320734132",
  measurementId: "",
  oAuthClientId: "",
  recaptchaSiteKey: ""
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Inisialisasi Firestore secara eksplisit ke database "spdb"
// Jangan pernah memanggil getFirestore(app) tanpa nama database "spdb" karena proyek sentrapropertidb
// menggunakan database kustom "spdb" dan tidak memiliki database "(default)".
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "spdb");
const primaryDb = db;

// Helper eksekusi database menggunakan instance Firestore target "spdb"
async function executeWithDb<T>(action: (targetDb: Firestore) => Promise<T>): Promise<T | null> {
  try {
    const res = await action(db);
    if (res !== null && res !== undefined) {
      return res;
    }
  } catch (err) {
    console.warn('Query ke database Firestore spdb gagal atau offline:', err);
  }
  return null;
}

// Local storage backup keys
const STORAGE_KEYS = {
  CITIES: 'sentra_properti_cities_v2',
  PROJECTS: 'sentra_properti_projects_v2',
  DOCS: 'sentra_properti_docs_v2',
  SETTINGS: 'sentra_properti_settings_v2',
};

function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
}

// Helper untuk mengekstrak array data dari berbagai kemungkinan format field di Firestore
function extractListFromDoc(data: any, keys: string[]): any[] | null {
  if (!data || typeof data !== 'object') return null;
  for (const k of keys) {
    if (Array.isArray(data[k]) && data[k].length > 0) {
      return data[k];
    }
    if (data[k] && typeof data[k] === 'object' && !Array.isArray(data[k])) {
      const vals = Object.values(data[k]);
      if (vals.length > 0 && typeof vals[0] === 'object') {
        return vals;
      }
    }
  }
  return null;
}

export const FALLBACK_CITY_IMAGE = 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80';
export const FALLBACK_PROJECT_IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
export const FALLBACK_DOC_IMAGE = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';

export function ensureValidImageUrl(url: any, fallback: string): string {
  if (typeof url === 'string' && url.trim() !== '') {
    return url.trim();
  }
  return fallback;
}

// ==========================================
// 1. CITIES (KOTA LOKASI PROPERTI) CRUD
// Koleksi Utama: "dbcities"
// ==========================================
export async function fetchCities(): Promise<City[]> {
  const result = await executeWithDb<City[]>(async (targetDb) => {
    // 1. PRIORITAS UTAMA: Koleksi "dbcities"
    try {
      const snap = await getDocs(collection(targetDb, 'dbcities'));
      if (!snap.empty) {
        const citiesMap = new Map<string, City>();
        
        snap.forEach((d) => {
          const data = d.data() as any;
          if (d.id === 'cities_list' && Array.isArray(data.cities)) {
            data.cities.forEach((c: any, idx: number) => {
              if (c && (c.id || c.name)) {
                const cid = c.id || `city-${idx}`;
                if (!citiesMap.has(cid)) {
                  citiesMap.set(cid, {
                    id: cid,
                    name: c.name || '',
                    province: c.province || '',
                    slug: c.slug || (c.name ? c.name.toLowerCase().replace(/\s+/g, '-') : cid),
                    image: ensureValidImageUrl(c.coverImage || c.image || c.photoUrl, FALLBACK_CITY_IMAGE),
                    description: c.description || '',
                    featured: Boolean(c.featured),
                    order: c.order ?? idx,
                    badge: c.badge || '',
                  });
                }
              }
            });
          } else if (data && (data.name || data.id)) {
            const cid = data.id || d.id;
            const existing = citiesMap.get(cid);
            citiesMap.set(cid, {
              id: cid,
              name: data.name || existing?.name || '',
              province: data.province || existing?.province || '',
              slug: data.slug || existing?.slug || (data.name ? data.name.toLowerCase().replace(/\s+/g, '-') : cid),
              image: ensureValidImageUrl(data.coverImage || data.image || data.photoUrl || existing?.image, FALLBACK_CITY_IMAGE),
              description: data.description || existing?.description || '',
              featured: data.featured !== undefined ? Boolean(data.featured) : (existing?.featured ?? false),
              order: data.order ?? existing?.order ?? 0,
              badge: data.badge || existing?.badge || '',
            });
          }
        });

        const list = Array.from(citiesMap.values());
        if (list.length > 0) {
          list.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
          setLocal(STORAGE_KEYS.CITIES, list);
          return list;
        }
      }
    } catch (e) {
      console.warn('Fetch dbcities collection failed:', e);
    }

    // 2. Fallback: Koleksi "cities"
    try {
      const colSnap = await getDocs(collection(targetDb, 'cities'));
      if (!colSnap.empty) {
        const cities: City[] = [];
        colSnap.forEach((d) => {
          const data = d.data() as any;
          cities.push({
            ...data,
            id: d.id,
            image: ensureValidImageUrl(data.coverImage || data.image, FALLBACK_CITY_IMAGE),
          });
        });
        cities.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
        setLocal(STORAGE_KEYS.CITIES, cities);
        return cities;
      }
    } catch {}

    // 3. Fallback: Dokumen dbproperti/Database
    try {
      const mainDocSnap = await getDoc(doc(targetDb, 'dbproperti', 'Database'));
      if (mainDocSnap.exists()) {
        const d = mainDocSnap.data();
        const list = extractListFromDoc(d, ['cities', 'INITIAL_CITIES', 'Cities', 'kota']);
        if (list && list.length > 0) {
          const formatted: City[] = list.map((c: any, idx: number) => ({
            id: c.id || `city-${idx}`,
            name: c.name || '',
            province: c.province || '',
            slug: c.slug || (c.name ? c.name.toLowerCase().replace(/\s+/g, '-') : `city-${idx}`),
            image: ensureValidImageUrl(c.coverImage || c.image, FALLBACK_CITY_IMAGE),
            description: c.description || '',
            featured: Boolean(c.featured),
            order: c.order ?? idx,
            badge: c.badge || '',
          }));
          formatted.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
          setLocal(STORAGE_KEYS.CITIES, formatted);
          return formatted;
        }
      }
    } catch {}

    return null;
  });

  if (result && result.length > 0) {
    return result;
  }

  const localCities = getLocal<City[]>(STORAGE_KEYS.CITIES, []);
  const finalCities = localCities.length > 0 ? localCities : INITIAL_CITIES;
  if (localCities.length === 0 && INITIAL_CITIES.length > 0) {
    setLocal(STORAGE_KEYS.CITIES, INITIAL_CITIES);
  }
  return finalCities;
}

export async function addCity(city: Omit<City, 'id'> & { id?: string }): Promise<City> {
  const newId = city.id || `city-${Date.now()}`;
  const fullCity: City = {
    ...city,
    id: newId,
    image: ensureValidImageUrl(city.image, FALLBACK_CITY_IMAGE),
    order: city.order ?? Date.now(),
  };

  const current = getLocal<City[]>(STORAGE_KEYS.CITIES, []);
  const updated = [...current.filter(c => c.id !== newId), fullCity];
  setLocal(STORAGE_KEYS.CITIES, updated);

  const cityPayload = {
    ...fullCity,
    coverImage: fullCity.image,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  // 1. Simpan ke koleksi dbcities dokumen individual
  try {
    await setDoc(doc(primaryDb, 'dbcities', newId), cityPayload, { merge: true });
  } catch (e) {
    console.warn('Sync addCity to dbcities error:', e);
  }

  // 2. Update dokumen aggregate cities_list di dbcities
  try {
    await setDoc(doc(primaryDb, 'dbcities', 'cities_list'), { cities: updated, updatedAt: Date.now() }, { merge: true });
  } catch {}

  // 3. Simpan ke koleksi cities & dbproperti/Database untuk kompatibilitas
  try {
    await setDoc(doc(primaryDb, 'cities', newId), fullCity, { merge: true });
  } catch {}
  try {
    await setDoc(doc(primaryDb, 'dbproperti', 'Database'), { cities: updated }, { merge: true });
  } catch {}

  return fullCity;
}

export async function updateCity(id: string, updates: Partial<City>): Promise<City> {
  const current = getLocal<City[]>(STORAGE_KEYS.CITIES, []);
  let updatedCity: City | null = null;
  const sanitizedUpdates = {
    ...updates,
    ...(updates.image !== undefined ? { image: ensureValidImageUrl(updates.image, FALLBACK_CITY_IMAGE), coverImage: ensureValidImageUrl(updates.image, FALLBACK_CITY_IMAGE) } : {}),
    updatedAt: Date.now(),
  };

  const updated = current.map(c => {
    if (c.id === id) {
      updatedCity = { ...c, ...sanitizedUpdates };
      return updatedCity;
    }
    return c;
  });
  setLocal(STORAGE_KEYS.CITIES, updated);

  // 1. Update di koleksi dbcities
  try {
    await setDoc(doc(primaryDb, 'dbcities', id), sanitizedUpdates, { merge: true });
  } catch (e) {
    console.warn('Sync updateCity to dbcities error:', e);
  }

  // 2. Update cities_list di dbcities
  try {
    await setDoc(doc(primaryDb, 'dbcities', 'cities_list'), { cities: updated, updatedAt: Date.now() }, { merge: true });
  } catch {}

  // 3. Update koleksi cities & dbproperti/Database
  try {
    await updateDoc(doc(primaryDb, 'cities', id), sanitizedUpdates);
  } catch {}
  try {
    await setDoc(doc(primaryDb, 'dbproperti', 'Database'), { cities: updated }, { merge: true });
  } catch {}

  return updatedCity || ({ ...sanitizedUpdates, id } as City);
}

export async function deleteCity(id: string): Promise<boolean> {
  const current = getLocal<City[]>(STORAGE_KEYS.CITIES, []);
  const filtered = current.filter(c => c.id !== id);
  setLocal(STORAGE_KEYS.CITIES, filtered);

  // 1. Hapus dari koleksi dbcities
  try {
    await deleteDoc(doc(primaryDb, 'dbcities', id));
  } catch (e) {
    console.warn('Sync deleteCity from dbcities error:', e);
  }

  // 2. Update cities_list di dbcities
  try {
    await setDoc(doc(primaryDb, 'dbcities', 'cities_list'), { cities: filtered, updatedAt: Date.now() }, { merge: true });
  } catch {}

  // 3. Hapus dari koleksi cities & dbproperti/Database
  try {
    await deleteDoc(doc(primaryDb, 'cities', id));
  } catch {}
  try {
    await setDoc(doc(primaryDb, 'dbproperti', 'Database'), { cities: filtered }, { merge: true });
  } catch {}

  // Hapus proyek terkait kota ini
  const currentProj = getLocal<Project[]>(STORAGE_KEYS.PROJECTS, []);
  const remainingProj = currentProj.filter(p => p.cityId !== id);
  setLocal(STORAGE_KEYS.PROJECTS, remainingProj);

  return true;
}

// ==========================================
// 2. PROJECTS (PROYEK PERUMAHAN) CRUD
// Koleksi Utama: "dbproperti"
// ==========================================

// Normalisasi struktur data Project agar selalu lengkap dan valid dari Firestore
export function normalizeProjectData(p: any, idx = 0, docId?: string): Project {
  const id = p.id || docId || `proj-${idx}-${Date.now()}`;
  
  // Format foto proyek dinamis sesuai data database tanpa duplikasi
  let photos: string[] = [];

  if (Array.isArray(p.photos) && p.photos.length > 0) {
    const list = p.photos
      .filter((url: any) => typeof url === 'string' && url.trim() !== '')
      .map((url: string) => url.trim());
    
    // Hilangkan duplikasi foto yang sama (preserve order)
    for (const url of list) {
      if (!photos.includes(url)) {
        photos.push(url);
      }
    }
  } else if (p.image && typeof p.image === 'string' && p.image.trim() !== '') {
    photos = [p.image.trim()];
  } else if (p.imageUrl && typeof p.imageUrl === 'string' && p.imageUrl.trim() !== '') {
    photos = [p.imageUrl.trim()];
  }

  // Fallback default hanya jika sama sekali tidak ada foto di database
  if (photos.length === 0) {
    photos = ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];
  }

  const rawPrice = typeof p.price === 'number' ? p.price : Number(p.price || 0);

  // Resolusi nama kota dari cityId jika belum terisi
  let resolvedCityName = p.cityName || '';
  if (!resolvedCityName) {
    if (p.cityId === 'city-1788086167332') {
      resolvedCityName = 'Palembang Kota';
    } else if (p.cityId === 'city-1788089738559') {
      resolvedCityName = 'Banyuasin';
    } else {
      resolvedCityName = 'Palembang Kota';
    }
  }

  return {
    id,
    cityId: p.cityId || 'city-1788086167332',
    cityName: resolvedCityName,
    name: p.name || 'Proyek Perumahan',
    slug: p.slug || (p.name ? p.name.toLowerCase().replace(/\s+/g, '-') : id),
    tagline: p.tagline || (p.address ? `Hunian Nyaman di ${p.address}` : 'Hunian Syariah Nyaman & Berkah'),
    developer: p.developer || 'Sentra Land Development',
    type: p.type || p.category || 'Cluster Minimalis Modern',
    price: rawPrice,
    priceDisplay: p.priceDisplay || (rawPrice ? `Rp ${rawPrice.toLocaleString('id-ID')}` : 'Hubungi Kami'),
    installmentDisplay: p.installmentDisplay || '',
    status: p.status || 'Ready Stock',
    address: p.address || 'Palembang, Sumatera Selatan',
    mapEmbedUrl: p.mapEmbedUrl || p.mapUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127506.74996452285!2d104.68653229999999!3d-2.9549673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e3b75e8e858793b%3A0x3039d80b220cc30!2sKota%20Palembang%2C%20Sumatera%20Selatan!5e0!3m2!1sid!2sid!4v1700000000001!5m2!1sid!2sid',
    mapDirectionsUrl: p.mapDirectionsUrl || p.mapUrl || '',
    coordinates: p.coordinates || { lat: -2.9549, lng: 104.6865 },
    shortDescription: p.shortDescription || p.description || '',
    fullDescription: p.fullDescription || p.description || '',
    specs: {
      surfaceArea: p.specs?.surfaceArea || p.landArea || p.surfaceArea || 90,
      buildingArea: p.specs?.buildingArea || p.buildingArea || 60,
      bedrooms: p.specs?.bedrooms || p.bedrooms || 2,
      bathrooms: p.specs?.bathrooms || p.bathrooms || 1,
      carports: p.specs?.carports || p.carports || 1,
      floors: p.specs?.floors || p.floors || 1,
      electricity: p.specs?.electricity || (p.electricity ? `${p.electricity} VA` : '1300 VA'),
      water: p.specs?.water || p.waterSource || 'PDAM / Sumur Bor',
      certificate: p.specs?.certificate || p.certificate || 'SHM (Sertifikat Hak Milik)',
      handoverEstimate: p.specs?.handoverEstimate || 'Siap Huni',
    },
    facilities: Array.isArray(p.facilities) && p.facilities.length > 0 
      ? p.facilities 
      : ['One Gate System', 'Security 24 Jam', 'Musholla Kawasan', 'Taman Bermain'],
    advantages: Array.isArray(p.strategicPoints) && p.strategicPoints.length > 0
      ? p.strategicPoints
      : (Array.isArray(p.advantages) && p.advantages.length > 0 
          ? p.advantages 
          : ['Lokasi Strategis Bebas Banjir', 'Akses Mudah ke Fasilitas Publik']),
    photos,
    photoCaptions: Array.isArray(p.photoCaptions) && p.photoCaptions.length > 0
      ? p.photoCaptions.slice(0, photos.length)
      : photos.map((_, i) => `Foto ${i + 1} - ${p.name || 'Proyek'}`),
    paymentSchemes: Array.isArray(p.paymentSchemes) && p.paymentSchemes.length > 0
      ? p.paymentSchemes
      : (Array.isArray(p.schemes) && p.schemes.length > 0
          ? p.schemes
          : (Array.isArray(p.skemaPembayaran) && p.skemaPembayaran.length > 0
              ? p.skemaPembayaran
              : (Array.isArray(p.skema) && p.skema.length > 0
                  ? p.skema
                  : (typeof p.paymentScheme === 'string' && p.paymentScheme ? [p.paymentScheme] : ['cash', 'bertahap', 'bsi'])))),
    minDpBertahapPercent: p.minDpBertahapPercent ?? 50,
    maxTenorBertahapMonths: p.maxTenorBertahapMonths ?? 24,
    featured: Boolean(p.featured),
    brochureUrl: p.brochureUrl || '',
    virtualTourUrl: p.virtualTourUrl || '',
    marketingPhone: p.marketingPhone || '',
    marketingWhatsApp: p.marketingWhatsApp || '',
    createdAt: p.createdAt || Date.now(),
    updatedAt: p.updatedAt || Date.now(),
  };
}

export async function fetchProjects(): Promise<Project[]> {
  const result = await executeWithDb<Project[]>(async (targetDb) => {
    // 1. PRIORITAS UTAMA: Koleksi "dbproperti"
    try {
      const colDbProp = await getDocs(collection(targetDb, 'dbproperti'));
      if (!colDbProp.empty) {
        const projects: Project[] = [];
        let fallbackDocProjects: any[] | null = null;

        colDbProp.forEach((d) => {
          if (d.id === 'Database' || d.id === 'database') {
            const data = d.data() as any;
            if (Array.isArray(data.projects) && data.projects.length > 0) {
              fallbackDocProjects = data.projects;
            }
            return;
          }
          const item = d.data() as any;
          if (item && (item.name || item.price !== undefined || item.address || item.cityId)) {
            projects.push(normalizeProjectData(item, undefined, d.id));
          }
        });

        if (projects.length > 0) {
          projects.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
          setLocal(STORAGE_KEYS.PROJECTS, projects);
          return projects;
        }

        if (fallbackDocProjects && fallbackDocProjects.length > 0) {
          const formatted = fallbackDocProjects.map((p: any, idx: number) => normalizeProjectData(p, idx));
          setLocal(STORAGE_KEYS.PROJECTS, formatted);
          return formatted;
        }
      }
    } catch (e) {
      console.warn('Fetch dbproperti collection failed:', e);
    }

    // 2. Fallback: Dokumen "Database" di Koleksi "dbproperti"
    try {
      const mainDocSnap = await getDoc(doc(targetDb, 'dbproperti', 'Database'));
      if (mainDocSnap.exists()) {
        const d = mainDocSnap.data();
        const list = extractListFromDoc(d, ['projects', 'INITIAL_PROJECTS', 'Projects', 'properti', 'proyek']);
        if (list && list.length > 0) {
          const formatted: Project[] = list.map((p: any, idx: number) => normalizeProjectData(p, idx));
          formatted.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
          setLocal(STORAGE_KEYS.PROJECTS, formatted);
          return formatted;
        }
      }
    } catch {}

    // 3. Fallback: Koleksi "projects"
    try {
      const colSnap = await getDocs(collection(targetDb, 'projects'));
      if (!colSnap.empty) {
        const projects: Project[] = [];
        colSnap.forEach((d) => projects.push(normalizeProjectData(d.data(), undefined, d.id)));
        projects.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
        setLocal(STORAGE_KEYS.PROJECTS, projects);
        return projects;
      }
    } catch {}

    return null;
  });

  if (result && result.length > 0) {
    return result;
  }

  const cached = getLocal<Project[]>(STORAGE_KEYS.PROJECTS, []);
  const projList = cached.length > 0 ? cached : INITIAL_PROJECTS;
  if (cached.length === 0 && INITIAL_PROJECTS.length > 0) {
    setLocal(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  }
  return projList.map((p, idx) => normalizeProjectData(p, idx));
}

export async function addProject(project: Omit<Project, 'id'> & { id?: string }): Promise<Project> {
  const newId = project.id || `proj-${Date.now()}`;
  const fullProject: Project = {
    ...project,
    id: newId,
    createdAt: project.createdAt || Date.now(),
    updatedAt: Date.now(),
  };

  const current = getLocal<Project[]>(STORAGE_KEYS.PROJECTS, []);
  const updated = [fullProject, ...current.filter(p => p.id !== newId)];
  setLocal(STORAGE_KEYS.PROJECTS, updated);

  const flatPayload = {
    id: newId,
    name: fullProject.name,
    cityId: fullProject.cityId,
    cityName: fullProject.cityName,
    price: fullProject.price,
    address: fullProject.address,
    landArea: fullProject.specs?.surfaceArea || 90,
    buildingArea: fullProject.specs?.buildingArea || 60,
    bedrooms: fullProject.specs?.bedrooms || 2,
    bathrooms: fullProject.specs?.bathrooms || 1,
    carports: fullProject.specs?.carports || 1,
    floors: fullProject.specs?.floors || 1,
    electricity: fullProject.specs?.electricity || '1300 VA',
    waterSource: fullProject.specs?.water || 'PDAM',
    certificate: fullProject.specs?.certificate || 'SHM',
    strategicPoints: fullProject.advantages || [],
    facilities: fullProject.facilities || [],
    photos: fullProject.photos || [],
    status: fullProject.status,
    category: fullProject.type,
    description: fullProject.fullDescription || fullProject.shortDescription,
    mapUrl: fullProject.mapDirectionsUrl || fullProject.mapEmbedUrl,
    featured: fullProject.featured,
    paymentSchemes: fullProject.paymentSchemes || ['cash', 'bertahap', 'bsi'],
    specs: fullProject.specs,
    createdAt: fullProject.createdAt,
    updatedAt: fullProject.updatedAt,
  };

  // 1. Simpan ke koleksi dbproperti dokumen individual
  try {
    await setDoc(doc(primaryDb, 'dbproperti', newId), flatPayload, { merge: true });
  } catch (e) {
    console.warn('Sync addProject to dbproperti error:', e);
  }

  // 2. Sync ke dbproperti/Database doc & projects collection
  try {
    await setDoc(doc(primaryDb, 'dbproperti', 'Database'), { projects: updated }, { merge: true });
  } catch {}
  try {
    await setDoc(doc(primaryDb, 'projects', newId), fullProject, { merge: true });
  } catch {}

  return fullProject;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
  const updatedData = { ...updates, updatedAt: Date.now() };
  const current = getLocal<Project[]>(STORAGE_KEYS.PROJECTS, []);
  let updatedProj: Project | null = null;
  const updated = current.map(p => {
    if (p.id === id) {
      updatedProj = { ...p, ...updatedData };
      return updatedProj;
    }
    return p;
  });
  setLocal(STORAGE_KEYS.PROJECTS, updated);

  const flatUpdate: any = {
    ...updatedData,
    ...(updates.name ? { name: updates.name } : {}),
    ...(updates.cityId ? { cityId: updates.cityId } : {}),
    ...(updates.cityName ? { cityName: updates.cityName } : {}),
    ...(updates.price !== undefined ? { price: updates.price } : {}),
    ...(updates.address ? { address: updates.address } : {}),
    ...(updates.specs?.surfaceArea !== undefined ? { landArea: updates.specs.surfaceArea } : {}),
    ...(updates.specs?.buildingArea !== undefined ? { buildingArea: updates.specs.buildingArea } : {}),
    ...(updates.specs?.bedrooms !== undefined ? { bedrooms: updates.specs.bedrooms } : {}),
    ...(updates.specs?.bathrooms !== undefined ? { bathrooms: updates.specs.bathrooms } : {}),
    ...(updates.specs?.carports !== undefined ? { carports: updates.specs.carports } : {}),
    ...(updates.specs?.floors !== undefined ? { floors: updates.specs.floors } : {}),
    ...(updates.specs?.electricity !== undefined ? { electricity: updates.specs.electricity } : {}),
    ...(updates.specs?.water !== undefined ? { waterSource: updates.specs.water } : {}),
    ...(updates.specs?.certificate !== undefined ? { certificate: updates.specs.certificate } : {}),
    ...(updates.advantages ? { strategicPoints: updates.advantages } : {}),
    ...(updates.facilities ? { facilities: updates.facilities } : {}),
    ...(updates.photos ? { photos: updates.photos } : {}),
    ...(updates.type ? { category: updates.type } : {}),
    ...(updates.fullDescription || updates.shortDescription ? { description: updates.fullDescription || updates.shortDescription } : {}),
    ...(updates.mapDirectionsUrl || updates.mapEmbedUrl ? { mapUrl: updates.mapDirectionsUrl || updates.mapEmbedUrl } : {}),
    updatedAt: Date.now(),
  };

  // 1. Update di koleksi dbproperti
  try {
    await setDoc(doc(primaryDb, 'dbproperti', id), flatUpdate, { merge: true });
  } catch (e) {
    console.warn('Sync updateProject to dbproperti error:', e);
  }

  // 2. Sync ke dbproperti/Database & projects
  try {
    await setDoc(doc(primaryDb, 'dbproperti', 'Database'), { projects: updated }, { merge: true });
  } catch {}
  try {
    await setDoc(doc(primaryDb, 'projects', id), updatedData, { merge: true });
  } catch {}

  return updatedProj || ({ ...updates, id } as Project);
}

export async function deleteProject(id: string): Promise<boolean> {
  const current = getLocal<Project[]>(STORAGE_KEYS.PROJECTS, []);
  const filtered = current.filter(p => p.id !== id);
  setLocal(STORAGE_KEYS.PROJECTS, filtered);

  // 1. Hapus dari koleksi dbproperti
  try {
    await deleteDoc(doc(primaryDb, 'dbproperti', id));
  } catch (e) {
    console.warn('Sync deleteProject from dbproperti error:', e);
  }

  // 2. Sync ke dbproperti/Database & projects
  try {
    await setDoc(doc(primaryDb, 'dbproperti', 'Database'), { projects: filtered }, { merge: true });
  } catch {}
  try {
    await deleteDoc(doc(primaryDb, 'projects', id));
  } catch {}

  return true;
}

// ==========================================
// 3. DOCUMENTATION (DOKUMENTASI) CRUD
// Koleksi Utama: "dbdocumentation"
// ==========================================
export async function fetchDocumentation(): Promise<DocumentationItem[]> {
  const result = await executeWithDb<DocumentationItem[]>(async (targetDb) => {
    // 1. PRIORITAS UTAMA: Cek Koleksi "dbdocumentation"
    try {
      const colSnap = await getDocs(collection(targetDb, 'dbdocumentation'));
      if (!colSnap.empty) {
        const docs: DocumentationItem[] = [];
        colSnap.forEach((d) => {
          const item = d.data() as any;
          docs.push({
            id: item.id || d.id,
            title: item.title || 'Dokumentasi Sentra Properti',
            category: item.category || 'Lainnya',
            date: item.date || 'Terbaru',
            imageUrl: ensureValidImageUrl(item.photoUrl || item.imageUrl || item.image, FALLBACK_DOC_IMAGE),
            description: item.caption || item.description || '',
            location: item.location || 'Palembang',
            order: item.order ?? 0,
          });
        });
        docs.sort((a, b) => (b.date > a.date ? 1 : -1));
        setLocal(STORAGE_KEYS.DOCS, docs);
        return docs;
      }
    } catch (e) {
      console.warn('Fetch dbdocumentation collection failed:', e);
    }

    // 2. Fallback: Cek Dokumen dbproperti/Database
    try {
      const mainDocSnap = await getDoc(doc(targetDb, 'dbproperti', 'Database'));
      if (mainDocSnap.exists()) {
        const d = mainDocSnap.data();
        const list = extractListFromDoc(d, ['documentation', 'INITIAL_DOCUMENTATION', 'docs', 'dokumentasi']);
        if (list && list.length > 0) {
          const formatted: DocumentationItem[] = list.map((item: any, idx: number) => ({
            id: item.id || `doc-${idx}`,
            title: item.title || 'Dokumentasi Sentra Properti',
            category: item.category || 'Lainnya',
            date: item.date || 'Terbaru',
            imageUrl: ensureValidImageUrl(item.photoUrl || item.imageUrl || item.image, FALLBACK_DOC_IMAGE),
            description: item.caption || item.description || '',
            location: item.location || 'Palembang',
            order: item.order ?? idx,
          }));
          formatted.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
          setLocal(STORAGE_KEYS.DOCS, formatted);
          return formatted;
        }
      }
    } catch {}

    // 3. Fallback: Cek Koleksi "documentation"
    try {
      const colSnap = await getDocs(collection(targetDb, 'documentation'));
      if (!colSnap.empty) {
        const docs: DocumentationItem[] = [];
        colSnap.forEach((d) => {
          const data = d.data() as any;
          docs.push({
            ...data,
            id: d.id,
            imageUrl: ensureValidImageUrl(data.photoUrl || data.imageUrl || data.image, FALLBACK_DOC_IMAGE),
            description: data.caption || data.description || '',
          });
        });
        docs.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
        setLocal(STORAGE_KEYS.DOCS, docs);
        return docs;
      }
    } catch {}

    return null;
  });

  if (result && result.length > 0) {
    return result;
  }

  const localDocs = getLocal<DocumentationItem[]>(STORAGE_KEYS.DOCS, []);
  const finalDocs = localDocs.length > 0 ? localDocs : INITIAL_DOCUMENTATION;
  if (localDocs.length === 0 && INITIAL_DOCUMENTATION.length > 0) {
    setLocal(STORAGE_KEYS.DOCS, INITIAL_DOCUMENTATION);
  }
  return finalDocs;
}

export async function addDocumentation(docItem: Omit<DocumentationItem, 'id'> & { id?: string }): Promise<DocumentationItem> {
  const newId = docItem.id || `doc-${Date.now()}`;
  const fullDoc: DocumentationItem = {
    ...docItem,
    id: newId,
    imageUrl: ensureValidImageUrl(docItem.imageUrl, FALLBACK_DOC_IMAGE),
    order: docItem.order || Date.now(),
  };

  const current = getLocal<DocumentationItem[]>(STORAGE_KEYS.DOCS, []);
  const updated = [fullDoc, ...current.filter(d => d.id !== newId)];
  setLocal(STORAGE_KEYS.DOCS, updated);

  const docPayload = {
    id: newId,
    title: fullDoc.title,
    category: fullDoc.category,
    date: fullDoc.date,
    photoUrl: fullDoc.imageUrl,
    imageUrl: fullDoc.imageUrl,
    caption: fullDoc.description,
    description: fullDoc.description,
    location: fullDoc.location || 'Palembang',
    order: fullDoc.order,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  // 1. Simpan ke koleksi dbdocumentation
  try {
    await setDoc(doc(primaryDb, 'dbdocumentation', newId), docPayload, { merge: true });
  } catch (e) {
    console.warn('Sync addDocumentation to dbdocumentation error:', e);
  }

  // 2. Sync ke dbproperti/Database & documentation
  try {
    await setDoc(doc(primaryDb, 'dbproperti', 'Database'), { documentation: updated }, { merge: true });
  } catch {}
  try {
    await setDoc(doc(primaryDb, 'documentation', newId), docPayload, { merge: true });
  } catch {}

  return fullDoc;
}

export async function updateDocumentation(id: string, updates: Partial<DocumentationItem>): Promise<DocumentationItem> {
  const current = getLocal<DocumentationItem[]>(STORAGE_KEYS.DOCS, []);
  let updatedDocItem: DocumentationItem | null = null;
  const sanitizedUpdates = {
    ...updates,
    ...(updates.imageUrl !== undefined ? { imageUrl: ensureValidImageUrl(updates.imageUrl, FALLBACK_DOC_IMAGE), photoUrl: ensureValidImageUrl(updates.imageUrl, FALLBACK_DOC_IMAGE) } : {}),
    ...(updates.description !== undefined ? { caption: updates.description, description: updates.description } : {}),
    updatedAt: Date.now(),
  };
  const updated = current.map(d => {
    if (d.id === id) {
      updatedDocItem = { ...d, ...sanitizedUpdates };
      return updatedDocItem;
    }
    return d;
  });
  setLocal(STORAGE_KEYS.DOCS, updated);

  // 1. Update di koleksi dbdocumentation
  try {
    await setDoc(doc(primaryDb, 'dbdocumentation', id), sanitizedUpdates, { merge: true });
  } catch (e) {
    console.warn('Sync updateDocumentation to dbdocumentation error:', e);
  }

  // 2. Sync ke dbproperti/Database & documentation
  try {
    await setDoc(doc(primaryDb, 'dbproperti', 'Database'), { documentation: updated }, { merge: true });
  } catch {}
  try {
    await setDoc(doc(primaryDb, 'documentation', id), sanitizedUpdates, { merge: true });
  } catch {}

  return updatedDocItem || ({ ...sanitizedUpdates, id } as DocumentationItem);
}

export async function deleteDocumentation(id: string): Promise<boolean> {
  const current = getLocal<DocumentationItem[]>(STORAGE_KEYS.DOCS, []);
  const filtered = current.filter(d => d.id !== id);
  setLocal(STORAGE_KEYS.DOCS, filtered);

  // 1. Hapus dari koleksi dbdocumentation
  try {
    await deleteDoc(doc(primaryDb, 'dbdocumentation', id));
  } catch (e) {
    console.warn('Sync deleteDocumentation from dbdocumentation error:', e);
  }

  // 2. Sync ke dbproperti/Database & documentation
  try {
    await setDoc(doc(primaryDb, 'dbproperti', 'Database'), { documentation: filtered }, { merge: true });
  } catch {}
  try {
    await deleteDoc(doc(primaryDb, 'documentation', id));
  } catch {}

  return true;
}

// ==========================================
// 4. SITE SETTINGS CRUD
// ==========================================
export async function fetchSiteSettings(): Promise<SiteSettings> {
  const result = await executeWithDb<SiteSettings>(async (targetDb) => {
    // 1. Cek Document dbproperti/Database -> field settings
    try {
      const mainDocSnap = await getDoc(doc(targetDb, 'dbproperti', 'Database'));
      if (mainDocSnap.exists()) {
        const d = mainDocSnap.data();
        if (d.settings || d.SiteSettings || d.pengaturan) {
          const s = (d.settings || d.SiteSettings || d.pengaturan) as Partial<SiteSettings>;
          const merged: SiteSettings = {
            ...INITIAL_SETTINGS,
            ...s,
            heroBgImage: ensureValidImageUrl(s.heroBgImage, INITIAL_SETTINGS.heroBgImage),
            officeMapEmbed: ensureValidImageUrl(s.officeMapEmbed, INITIAL_SETTINGS.officeMapEmbed),
          };
          setLocal(STORAGE_KEYS.SETTINGS, merged);
          return merged;
        }
      }
    } catch {}

    // 2. Cek collection settings / general
    try {
      const docRef = doc(targetDb, 'settings', 'general');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as Partial<SiteSettings>;
        const merged: SiteSettings = {
          ...INITIAL_SETTINGS,
          ...data,
          heroBgImage: ensureValidImageUrl(data.heroBgImage, INITIAL_SETTINGS.heroBgImage),
          officeMapEmbed: ensureValidImageUrl(data.officeMapEmbed, INITIAL_SETTINGS.officeMapEmbed),
        };
        setLocal(STORAGE_KEYS.SETTINGS, merged);
        return merged;
      }
    } catch {}

    return null;
  });

  if (result) return result;
  return getLocal<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
}

export async function updateSiteSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = getLocal<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  const merged: SiteSettings = { ...current, ...updates };
  setLocal(STORAGE_KEYS.SETTINGS, merged);

  try {
    await setDoc(doc(primaryDb, 'dbproperti', 'Database'), { settings: merged }, { merge: true });
  } catch (e) {
    console.warn('Sync updateSiteSettings to dbproperti/Database error:', e);
  }

  try {
    await setDoc(doc(primaryDb, 'settings', 'general'), merged, { merge: true });
  } catch {}

  return merged;
}

// ==========================================
// 5. INQUIRY SUBMISSIONS
// ==========================================
export async function submitInquiry(data: InquiryFormData): Promise<boolean> {
  const newId = `inq-${Date.now()}`;
  const fullData: InquiryFormData = {
    ...data,
    createdAt: Date.now(),
  };

  try {
    await setDoc(doc(primaryDb, 'inquiries', newId), fullData);
    return true;
  } catch (e) {
    console.warn('Firestore submitInquiry error:', e);
    const existing = getLocal<InquiryFormData[]>('sentra_inquiries', []);
    setLocal('sentra_inquiries', [fullData, ...existing]);
    return true;
  }
}
