export interface City {
  id: string;
  name: string;
  province: string;
  slug: string;
  image: string;
  description: string;
  featured?: boolean;
  order?: number;
  badge?: string;
}

export type PropertyStatus = 'Ready Stock' | 'Indent' | 'Hot Deal' | 'Promo Spesial' | 'Sold Out' | 'Under Construction';

export interface ProjectSpecs {
  surfaceArea: number; // Luas Tanah (m2)
  buildingArea: number; // Luas Bangunan (m2)
  bedrooms: number; // Kamar Tidur
  bathrooms: number; // Kamar Mandi
  carports: number; // Carport
  floors: number; // Jumlah Lantai
  electricity: string; // Daya Listrik (e.g. "2200 VA")
  water: string; // Sumber Air (e.g. "PDAM / Sumur Bor")
  certificate: string; // Sertifikat (e.g. "SHM (Sertifikat Hak Milik)", "HGB")
  handoverEstimate?: string; // Estimasi Serah Terima
}

export interface Project {
  id: string;
  cityId: string;
  cityName: string;
  name: string;
  slug: string;
  tagline: string;
  developer: string;
  type: string; // e.g. "Cluster Mewah", "Rumah Minimalis Modern", "Townhouse 2 Lantai"
  price: number; // in IDR
  priceDisplay: string; // e.g. "Rp 850.000.000"
  installmentDisplay: string; // e.g. "Mulai Rp 4,2 Jt / bln"
  status: PropertyStatus;
  
  // Location & Map
  address: string;
  mapEmbedUrl: string; // Embed Google Maps iframe URL
  mapDirectionsUrl?: string; // Direct Google Maps Link
  coordinates?: {
    lat: number;
    lng: number;
  };
  
  // Details & Descriptions
  shortDescription: string;
  fullDescription: string;
  specs: ProjectSpecs;
  facilities: string[]; // e.g. ["One Gate System", "Security 24 Jam & CCTV", "Clubhouse", "Kolam Renang", "Taman Bermain Anak", "Smart Home System"]
  advantages: string[]; // e.g. ["5 Menit ke Pintu Tol", "Dekat Stasiun LRT/KRL", "Bebas Banjir", "Dekat Pusat Perbelanjaan & Sekolah"]
  
  // Photos List (Dinamis sesuai database masing-masing proyek)
  photos: string[];
  photoCaptions?: string[]; // Captions for each photo
  
  // Payment Schemes Options (Cash, Cash Bertahap, Bank BSI, Credit Developer)
  paymentSchemes?: ('cash' | 'bertahap' | 'bsi' | 'developer' | string)[];
  minDpBertahapPercent?: number; // Minimum Down Payment (%) for Cash Bertahap (default 50 or custom developer rule)
  maxTenorBertahapMonths?: number; // Maximum tenor for Cash Bertahap in months (e.g. 12, 24, 36)
  
  // Marketing & Extras
  featured?: boolean;
  brochureUrl?: string;
  virtualTourUrl?: string;
  marketingPhone?: string;
  marketingWhatsApp?: string;
  createdAt: number;
  updatedAt: number;
}

export type DocCategory = 'Serah Terima Kunci' | 'Progress Pembangunan' | 'Akad Massal' | 'Event & Gathering' | 'Legalitas & Sertifikat' | 'Site Visit Proyek' | 'Lainnya' | string;

export interface DocumentationItem {
  id: string;
  title: string;
  category: DocCategory;
  date: string;
  imageUrl: string;
  description: string;
  location?: string;
  order?: number;
}

export interface SiteSettings {
  companyName: string;
  companyTagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroBadge: string;
  heroBgImage: string;
  
  whatsappNumber: string; // e.g. "6281234567890" (no +, no spaces)
  whatsappDefaultMessage: string;
  phoneNumber: string;
  email: string;
  officeAddress: string;
  officeMapEmbed: string;
  officeMapUrl?: string;
  workingHours: string;
  
  statsExperienceYears: number;
  statsTotalUnitsSold: number;
  statsCitiesCovered: number;
  statsSatisfactionRate: number;
  
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
}

export interface InquiryFormData {
  name: string;
  phone: string;
  email: string;
  preferredCity: string;
  preferredProject: string;
  budgetRange: string;
  surveyDate?: string;
  message: string;
  createdAt?: number;
}
