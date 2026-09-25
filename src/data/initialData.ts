import { City, Project, DocumentationItem, SiteSettings } from '../types';

export const INITIAL_SETTINGS: SiteSettings = {
  companyName: 'Sentra Properti',
  companyTagline: 'Solusi Properti Terpercaya',
  heroHeadline: 'Wujudkan Rumah Impian Keluarga Bersama\nSentra Properti\nTanpa Riba dan Gharar',
  heroSubheadline: 'Pilihan proyek perumahan premium di lokasi paling strategis dengan legalitas 100% aman, fasilitas terlengkap, dan skema syariah: Cash, Cash Bertahap, Cicilan via Developer, atau Cicilan BSI.',
  heroBadge: 'Solusi Properti Terpercaya & Pengalaman',
  heroBgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85',
  
  whatsappNumber: '+62811715608',
  whatsappDefaultMessage: 'Halo Sentra Properti, saya tertarik untuk konsultasi dan informasi proyek perumahan.',
  phoneNumber: '+62 811 715 608',
  email: 'info@sentra-properti.com',
  officeAddress: 'Sentra Properti Hub, Citragrand City, Kota Palembang, Sumatera Selatan 30154',
  officeMapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127506.75!2d104.6865323!3d-2.9549673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0:0x0!2sKota%20Palembang%2C%20Sumatera%20Selatan!5e0!3m2!1sid!2sid',
  officeMapUrl: 'https://www.google.com/maps/place/Palembang,+Kota+Palembang,+Sumatera+Selatan/@-2.9547941,104.6805623,12z/data=!3m1!4b1!4m6!3m5!1s0x2e3b75e8fc27a3e3:0x3039d80b220d0c0!8m2!3d-2.9760735!4d104.7754307!16zL20vMDFjXzky?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D',
  workingHours: 'Senin - Minggu: 08:30 - 17:00 WIB (Survey Lokasi Siap Setiap Hari dengan Janji)',
  
  statsExperienceYears: 7,
  statsTotalUnitsSold: 750,
  statsCitiesCovered: 3,
  statsSatisfactionRate: 99,
  
  instagramUrl: 'https://www.instagram.com/sentra.properti.palembang?stkn=MXIya3B6NzExbzRuZA==',
  facebookUrl: 'https://www.facebook.com/share/1EdgiDUV8Q/',
  youtubeUrl: 'https://www.youtube.com/',
};

// Data dipindahkan sepenuhnya ke Firebase Firestore
// (Collection: dbproperti, Document: Database)
export const INITIAL_CITIES: City[] = [];

export const INITIAL_PROJECTS: Project[] = [];

export const INITIAL_DOCUMENTATION: DocumentationItem[] = [];


