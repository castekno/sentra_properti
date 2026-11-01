import { City, Project, DocumentationItem, SiteSettings } from "../types";

export const INITIAL_SETTINGS: SiteSettings = {
  "companyName": "Sentra Properti",
  "companyTagline": "Solusi Properti Terpercaya",
  "heroHeadline": "Wujudkan Rumah Impian Keluarga Bersama\nSentra Properti\nTanpa Riba dan Gharar",
  "heroSubheadline": "Pilihan proyek perumahan premium di lokasi paling strategis dengan legalitas 100% aman, fasilitas terlengkap, dan skema syariah: Cash, Cash Bertahap, Cicilan via Developer, atau Cicilan BSI.",
  "heroBadge": "Solusi Properti Terpercaya & Pengalaman",
  "heroBgImage": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85",
  "whatsappNumber": "+62811715608",
  "whatsappDefaultMessage": "Halo Sentra Properti, saya tertarik untuk konsultasi dan informasi proyek perumahan.",
  "phoneNumber": "+62 811 715 608",
  "email": "info@sentra-properti.com",
  "officeAddress": "Sentra Properti Hub, Citragrand City, Kota Palembang, Sumatera Selatan 30154",
  "officeMapEmbed": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127506.75!2d104.6865323!3d-2.9549673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0:0x0!2sKota%20Palembang%2C%20Sumatera%20Selatan!5e0!3m2!1sid!2sid",
  "officeMapUrl": "https://www.google.com/maps/place/Palembang,+Kota+Palembang,+Sumatera+Selatan/@-2.9547941,104.6805623,12z/data=!3m1!4b1!4m6!3m5!1s0x2e3b75e8fc27a3e3:0x3039d80b220d0c0!8m2!3d-2.9760735!4d104.7754307!16zL20vMDFjXzky?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D",
  "workingHours": "Senin - Minggu: 08:30 - 17:00 WIB (Survey Lokasi Siap Setiap Hari dengan Janji)",
  "statsExperienceYears": 7,
  "statsTotalUnitsSold": 750,
  "statsCitiesCovered": 3,
  "statsSatisfactionRate": 99,
  "instagramUrl": "https://www.instagram.com/sentra.properti.palembang?stkn=MXIya3B6NzExbzRuZA==",
  "facebookUrl": "https://www.facebook.com/share/1EdgiDUV8Q/",
  "youtubeUrl": "https://www.youtube.com/"
};

export const INITIAL_CITIES: City[] = [
  {
    "id": "city-1788086167332",
    "name": "Palembang Kota",
    "province": "Sumatera Selatan",
    "slug": "palembang-kota",
    "image": "/catalog/city-1788086167332.jpg",
    "description": "Kota Palembang adalah ibu kota Provinsi Sumatra Selatan yang merupakan kota tertua di Indonesia dan terkenal dengan ikon Jembatan Ampera di atas Sungai Musi.",
    "featured": false,
    "order": 0,
    "badge": ""
  },
  {
    "id": "city-1788089738559",
    "name": "Banyuasin",
    "province": "Sumatera Selatan",
    "slug": "banyuasin",
    "image": "/catalog/city-1788089738559.jpg",
    "description": "Banyuasin adalah kabupaten di Provinsi Sumatera Selatan, Indonesia. Kabupaten ini merupakan pemekaran dari Kabupaten Musi Banyuasin",
    "featured": false,
    "order": 1,
    "badge": ""
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    "id": "proj-1793513359732",
    "cityId": "city-1788086167332",
    "cityName": "Palembang Kota",
    "name": "Qeena Jeju Residence (Ready Stock)",
    "slug": "qeena-jeju-residence-ready-stock-",
    "tagline": "Hunian Nyaman di Jl. Tanjung Barangan",
    "developer": "Sentra Land Development",
    "type": "Rumah",
    "price": 550000000,
    "priceDisplay": "Rp 550.000.000",
    "installmentDisplay": "",
    "status": "Tersedia",
    "address": "Jl. Tanjung Barangan",
    "locationAddress": "Jl. Tanjung Barangan",
    "mapEmbedUrl": "https://maps.app.goo.gl/8yy59LqhzP9X72Pb6",
    "mapDirectionsUrl": "https://maps.app.goo.gl/8yy59LqhzP9X72Pb6",
    "coordinates": {
      "lat": -2.9549,
      "lng": 104.6865
    },
    "shortDescription": "Project hunian eksklusif dengan lokasi prima, dan nilai investasi tinggi.",
    "fullDescription": "Project hunian eksklusif dengan lokasi prima, dan nilai investasi tinggi.",
    "description": "Project hunian eksklusif dengan lokasi prima, dan nilai investasi tinggi.",
    "mainImage": "/catalog/proj-1793513359732-0.jpg",
    "specs": {
      "surfaceArea": 275,
      "buildingArea": 64,
      "bedrooms": 2,
      "bathrooms": 1,
      "carports": 2,
      "floors": 1,
      "electricity": "1.300 Watt VA",
      "water": "PDAM",
      "certificate": "SHM (Sertifikat Hak Milik)",
      "handoverEstimate": "Siap Huni"
    },
    "facilities": [
      "Row Jalan 6 Meter"
    ],
    "advantages": [
      "Dekat Sekolah & Mart",
      "Dekat Masjid"
    ],
    "photos": [
      "/catalog/proj-1793513359732-0.jpg",
      "/catalog/proj-1793513359732-1.jpg",
      "/catalog/proj-1793513359732-2.jpg"
    ],
    "photoCaptions": [
      "Foto 1 - Qeena Jeju Residence (Ready Stock)",
      "Foto 2 - Qeena Jeju Residence (Ready Stock)",
      "Foto 3 - Qeena Jeju Residence (Ready Stock)"
    ],
    "paymentSchemes": [
      "Cash",
      "Cash Bertahap",
      "Bank BSI"
    ],
    "minDpBertahapPercent": 50,
    "maxTenorBertahapMonths": 24,
    "featured": false,
    "brochureUrl": "",
    "virtualTourUrl": "",
    "marketingPhone": "",
    "marketingWhatsApp": "",
    "createdAt": 1793513359732,
    "updatedAt": 1793520501348
  },
  {
    "id": "proj-1793508974764",
    "cityId": "city-1788086167332",
    "cityName": "Palembang Kota",
    "name": "Mini Cluster Sultan 2",
    "slug": "mini-cluster-sultan-2",
    "tagline": "Hunian Nyaman di Jln. Lebak Jaya 3",
    "developer": "Sentra Land Development",
    "type": "Rumah",
    "price": 475000000,
    "priceDisplay": "Rp 475.000.000",
    "installmentDisplay": "",
    "status": "Tersedia",
    "address": "Jln. Lebak Jaya 3",
    "locationAddress": "Jln. Lebak Jaya 3",
    "mapEmbedUrl": "https://maps.app.goo.gl/u8ntP5GsvwvyjN5b7?g_st=ic",
    "mapDirectionsUrl": "https://maps.app.goo.gl/u8ntP5GsvwvyjN5b7?g_st=ic",
    "coordinates": {
      "lat": -2.9549,
      "lng": 104.6865
    },
    "shortDescription": "Project hunian eksklusif dengan lokasi prima, dan nilai investasi tinggi.",
    "fullDescription": "Project hunian eksklusif dengan lokasi prima, dan nilai investasi tinggi.",
    "description": "Project hunian eksklusif dengan lokasi prima, dan nilai investasi tinggi.",
    "mainImage": "/catalog/proj-1793508974764-0.jpg",
    "specs": {
      "surfaceArea": 99,
      "buildingArea": 55,
      "bedrooms": 2,
      "bathrooms": 1,
      "carports": 1,
      "floors": 1,
      "electricity": "1.300 Watt VA",
      "water": "PDAM",
      "certificate": "SHM (Sertifikat Hak Milik)",
      "handoverEstimate": "Siap Huni"
    },
    "facilities": [
      "Pinggir Jalan",
      "Row Jalan 8 Meter"
    ],
    "advantages": [
      "Dekat Sekolah",
      "Dekat Masjid"
    ],
    "photos": [
      "/catalog/proj-1793508974764-0.jpg",
      "/catalog/proj-1793508974764-1.jpg"
    ],
    "photoCaptions": [
      "Foto 1 - Mini Cluster Sultan 2",
      "Foto 2 - Mini Cluster Sultan 2"
    ],
    "paymentSchemes": [
      "Cash",
      "Cash Bertahap"
    ],
    "minDpBertahapPercent": 50,
    "maxTenorBertahapMonths": 24,
    "featured": false,
    "brochureUrl": "",
    "virtualTourUrl": "",
    "marketingPhone": "",
    "marketingWhatsApp": "",
    "createdAt": 1793508974764,
    "updatedAt": 1793520713267
  },
  {
    "id": "proj-1791422817799",
    "cityId": "city-1788086167332",
    "cityName": "Palembang Kota",
    "name": "Rinjani D'Premiere Type Gardenia 50",
    "slug": "rinjani-d-premiere-type-gardenia-50",
    "tagline": "Hunian Nyaman di Jl. Mahameru plaju",
    "developer": "Sentra Land Development",
    "type": "Rumah",
    "price": 760000000,
    "priceDisplay": "Rp 760.000.000",
    "installmentDisplay": "",
    "status": "Tersedia",
    "address": "Jl. Mahameru plaju",
    "locationAddress": "Jl. Mahameru plaju",
    "mapEmbedUrl": "https://maps.app.goo.gl/DHBNzQREwKhkmPA89?g_st=ac",
    "mapDirectionsUrl": "https://maps.app.goo.gl/DHBNzQREwKhkmPA89?g_st=ac",
    "coordinates": {
      "lat": -2.9549,
      "lng": 104.6865
    },
    "shortDescription": "Project hunian eksklusif dengan lokasi prima, dan nilai investasi tinggi.",
    "fullDescription": "Project hunian eksklusif dengan lokasi prima, dan nilai investasi tinggi.",
    "description": "Project hunian eksklusif dengan lokasi prima, dan nilai investasi tinggi.",
    "mainImage": "/catalog/proj-1791422817799-0.jpg",
    "specs": {
      "surfaceArea": 130,
      "buildingArea": 50,
      "bedrooms": 2,
      "bathrooms": 1,
      "carports": 1,
      "floors": 1,
      "electricity": "1.300 Watt VA",
      "water": "PDAM",
      "certificate": "SHM (Sertifikat Hak Milik)",
      "handoverEstimate": "Siap Huni"
    },
    "facilities": [
      "Row Jalan 6 Meter"
    ],
    "advantages": [
      "Dekat Masjid",
      "Dekat Sekolah",
      "Dekat Universitas",
      "Dekat ke Stasiun KRL",
      "Dekat Mall",
      "Dekat Sarana Olah Raga"
    ],
    "photos": [
      "/catalog/proj-1791422817799-0.jpg",
      "/catalog/proj-1791422817799-1.jpg"
    ],
    "photoCaptions": [
      "Foto 1 - Rinjani D'Premiere Type Gardenia 50",
      "Foto 2 - Rinjani D'Premiere Type Gardenia 50"
    ],
    "paymentSchemes": [
      "Cash",
      "Cash Bertahap"
    ],
    "minDpBertahapPercent": 50,
    "maxTenorBertahapMonths": 24,
    "featured": false,
    "brochureUrl": "",
    "virtualTourUrl": "",
    "marketingPhone": "",
    "marketingWhatsApp": "",
    "createdAt": 1791422817799,
    "updatedAt": 1791706580626
  },
  {
    "id": "proj-1791422290644",
    "cityId": "city-1788086167332",
    "cityName": "Palembang Kota",
    "name": "Rinjani D'Premiere type Sapphire 62",
    "slug": "rinjani-d-premiere-type-sapphire-62",
    "tagline": "Hunian Nyaman di Jalan Mahameru Plaju",
    "developer": "Sentra Land Development",
    "type": "Rumah",
    "price": 875000000,
    "priceDisplay": "Rp 875.000.000",
    "installmentDisplay": "",
    "status": "Tersedia",
    "address": "Jalan Mahameru Plaju",
    "locationAddress": "Jalan Mahameru Plaju",
    "mapEmbedUrl": "https://maps.app.goo.gl/DHBNzQREwKhkmPA89?g_st=ac",
    "mapDirectionsUrl": "https://maps.app.goo.gl/DHBNzQREwKhkmPA89?g_st=ac",
    "coordinates": {
      "lat": -2.9549,
      "lng": 104.6865
    },
    "shortDescription": "Project hunian eksklusif dengan lokasi prima, dan nilai investasi tinggi.",
    "fullDescription": "Project hunian eksklusif dengan lokasi prima, dan nilai investasi tinggi.",
    "description": "Project hunian eksklusif dengan lokasi prima, dan nilai investasi tinggi.",
    "mainImage": "/catalog/proj-1791422290644-0.jpg",
    "specs": {
      "surfaceArea": 130,
      "buildingArea": 62,
      "bedrooms": 3,
      "bathrooms": 2,
      "carports": 1,
      "floors": 2,
      "electricity": "2.200 Watt VA",
      "water": "PDAM",
      "certificate": "SHM (Sertifikat Hak Milik)",
      "handoverEstimate": "Siap Huni"
    },
    "facilities": [
      "Row Jalan 6 Meter"
    ],
    "advantages": [
      "Dekat Masjid",
      "Dekat Sekolah",
      "Dekat Universitas",
      "Dekat ke Stasiun KRL",
      "Dekat Mall",
      "Dekat Sarana Olah Raga"
    ],
    "photos": [
      "/catalog/proj-1791422290644-0.jpg",
      "/catalog/proj-1791422290644-1.jpg"
    ],
    "photoCaptions": [
      "Foto 1 - Rinjani D'Premiere type Sapphire 62",
      "Foto 2 - Rinjani D'Premiere type Sapphire 62"
    ],
    "paymentSchemes": [
      "Cash",
      "Cash Bertahap"
    ],
    "minDpBertahapPercent": 50,
    "maxTenorBertahapMonths": 24,
    "featured": false,
    "brochureUrl": "",
    "virtualTourUrl": "",
    "marketingPhone": "",
    "marketingWhatsApp": "",
    "createdAt": 1791422290644,
    "updatedAt": 1791706605881
  },
  {
    "id": "proj-1791159955168",
    "cityId": "city-1788086167332",
    "cityName": "Palembang Kota",
    "name": "Hafiz House Plaju",
    "slug": "hafiz-house-plaju",
    "tagline": "Hunian Nyaman di Jln. Pertahanan Plaju",
    "developer": "Sentra Land Development",
    "type": "Rumah",
    "price": 299000000,
    "priceDisplay": "Rp 299.000.000",
    "installmentDisplay": "",
    "status": "Tersedia",
    "address": "Jln. Pertahanan Plaju",
    "locationAddress": "Jln. Pertahanan Plaju",
    "mapEmbedUrl": "https://maps.app.goo.gl/LZHNt7KT1oWywq2x8",
    "mapDirectionsUrl": "https://maps.app.goo.gl/LZHNt7KT1oWywq2x8",
    "coordinates": {
      "lat": -2.9549,
      "lng": 104.6865
    },
    "shortDescription": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "fullDescription": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "description": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "mainImage": "/catalog/proj-1791159955168-0.jpg",
    "specs": {
      "surfaceArea": 90,
      "buildingArea": 30,
      "bedrooms": 2,
      "bathrooms": 1,
      "carports": 1,
      "floors": 1,
      "electricity": "1.300 Watt VA",
      "water": "PDAM",
      "certificate": "SHM (Sertifikat Hak Milik)",
      "handoverEstimate": "Siap Huni"
    },
    "facilities": [
      "Row Jalan 6 Meter"
    ],
    "advantages": [
      "DekatMasjid",
      "10 Menit ke Stasiun KRL",
      "Dekat Sekolah & Mall"
    ],
    "photos": [
      "/catalog/proj-1791159955168-0.jpg"
    ],
    "photoCaptions": [
      "Foto 1 - Hafiz House Plaju"
    ],
    "paymentSchemes": [
      "Cash"
    ],
    "minDpBertahapPercent": 50,
    "maxTenorBertahapMonths": 24,
    "featured": false,
    "brochureUrl": "",
    "virtualTourUrl": "",
    "marketingPhone": "",
    "marketingWhatsApp": "",
    "createdAt": 1791159955168,
    "updatedAt": 1791696393349
  },
  {
    "id": "proj-1791159596600",
    "cityId": "city-1788086167332",
    "cityName": "Palembang Kota",
    "name": "Sako Premier",
    "slug": "sako-premier",
    "tagline": "Hunian Nyaman di Jl. Siaran Sako",
    "developer": "Sentra Land Development",
    "type": "Rumah",
    "price": 399000000,
    "priceDisplay": "Rp 399.000.000",
    "installmentDisplay": "",
    "status": "Tersedia",
    "address": "Jl. Siaran Sako",
    "locationAddress": "Jl. Siaran Sako",
    "mapEmbedUrl": "https://maps.app.goo.gl/uPraEV25hp7AJ8uf7?g_st=awb",
    "mapDirectionsUrl": "https://maps.app.goo.gl/uPraEV25hp7AJ8uf7?g_st=awb",
    "coordinates": {
      "lat": -2.9549,
      "lng": 104.6865
    },
    "shortDescription": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "fullDescription": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "description": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "mainImage": "/catalog/proj-1791159596600-0.jpg",
    "specs": {
      "surfaceArea": 99,
      "buildingArea": 40,
      "bedrooms": 2,
      "bathrooms": 1,
      "carports": 1,
      "floors": 1,
      "electricity": "2.200 Watt VA",
      "water": "PDAM",
      "certificate": "SHM (Sertifikat Hak Milik)",
      "handoverEstimate": "Siap Huni"
    },
    "facilities": [
      "Row Jalan 6 Meter"
    ],
    "advantages": [
      "Dekat Masjid",
      "Dekat Sekolah & Mall"
    ],
    "photos": [
      "/catalog/proj-1791159596600-0.jpg"
    ],
    "photoCaptions": [
      "Foto 1 - Sako Premier"
    ],
    "paymentSchemes": [
      "Cash",
      "Cash Bertahap"
    ],
    "minDpBertahapPercent": 50,
    "maxTenorBertahapMonths": 24,
    "featured": false,
    "brochureUrl": "",
    "virtualTourUrl": "",
    "marketingPhone": "",
    "marketingWhatsApp": "",
    "createdAt": 1791159596600,
    "updatedAt": 1791328682768
  },
  {
    "id": "proj-1791158857570",
    "cityId": "city-1788086167332",
    "cityName": "Palembang Kota",
    "name": "Mini Sultan Cluster Pusri",
    "slug": "mini-sultan-cluster-pusri",
    "tagline": "Hunian Nyaman di Jln H. Azhari Pusri",
    "developer": "Sentra Land Development",
    "type": "Rumah",
    "price": 415000000,
    "priceDisplay": "Rp 415.000.000",
    "installmentDisplay": "",
    "status": "Tersedia",
    "address": "Jln H. Azhari Pusri",
    "locationAddress": "Jln H. Azhari Pusri",
    "mapEmbedUrl": "https://maps.app.goo.gl/ggo9GAt2My4EkxwC8?g_st=ic",
    "mapDirectionsUrl": "https://maps.app.goo.gl/ggo9GAt2My4EkxwC8?g_st=ic",
    "coordinates": {
      "lat": -2.9549,
      "lng": 104.6865
    },
    "shortDescription": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "fullDescription": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "description": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "mainImage": "/catalog/proj-1791158857570-0.jpg",
    "specs": {
      "surfaceArea": 120,
      "buildingArea": 50,
      "bedrooms": 2,
      "bathrooms": 1,
      "carports": 1,
      "floors": 1,
      "electricity": "2.200 Watt VA",
      "water": "PDAM",
      "certificate": "SHM (Sertifikat Hak Milik)",
      "handoverEstimate": "Siap Huni"
    },
    "facilities": [
      "Row Jalan 6 Meter"
    ],
    "advantages": [
      "Dekat Sekolah & Mall"
    ],
    "photos": [
      "/catalog/proj-1791158857570-0.jpg",
      "/catalog/proj-1791158857570-1.jpg"
    ],
    "photoCaptions": [
      "Foto 1 - Mini Sultan Cluster Pusri",
      "Foto 2 - Mini Sultan Cluster Pusri"
    ],
    "paymentSchemes": [
      "Cash",
      "Cash Bertahap"
    ],
    "minDpBertahapPercent": 50,
    "maxTenorBertahapMonths": 24,
    "featured": false,
    "brochureUrl": "",
    "virtualTourUrl": "",
    "marketingPhone": "",
    "marketingWhatsApp": "",
    "createdAt": 1791158857570,
    "updatedAt": 1791328836801
  },
  {
    "id": "proj-1791158282110",
    "cityId": "city-1788086167332",
    "cityName": "Palembang Kota",
    "name": "OPI Barokah Estate",
    "slug": "opi-barokah-estate",
    "tagline": "Hunian Nyaman di Jln. Ogan Permata Indah OPI",
    "developer": "Sentra Land Development",
    "type": "Rumah",
    "price": 499000000,
    "priceDisplay": "Rp 499.000.000",
    "installmentDisplay": "",
    "status": "Tersedia",
    "address": "Jln. Ogan Permata Indah OPI",
    "locationAddress": "Jln. Ogan Permata Indah OPI",
    "mapEmbedUrl": "https://maps.app.goo.gl/QWeHPD1eHzV9Uwt47",
    "mapDirectionsUrl": "https://maps.app.goo.gl/QWeHPD1eHzV9Uwt47",
    "coordinates": {
      "lat": -2.9549,
      "lng": 104.6865
    },
    "shortDescription": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "fullDescription": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "description": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "mainImage": "/catalog/proj-1791158282110-0.jpg",
    "specs": {
      "surfaceArea": 120,
      "buildingArea": 30,
      "bedrooms": 1,
      "bathrooms": 1,
      "carports": 1,
      "floors": 1,
      "electricity": "2.200 Watt VA",
      "water": "PDAM",
      "certificate": "SHM (Sertifikat Hak Milik)",
      "handoverEstimate": "Siap Huni"
    },
    "facilities": [
      "Masjid",
      "Row Jalan 6 Meter"
    ],
    "advantages": [
      "5 Menit ke Stasiun KRL",
      "Dekat Sekolah & Mall"
    ],
    "photos": [
      "/catalog/proj-1791158282110-0.jpg",
      "/catalog/proj-1791158282110-1.jpg"
    ],
    "photoCaptions": [
      "Foto 1 - OPI Barokah Estate",
      "Foto 2 - OPI Barokah Estate"
    ],
    "paymentSchemes": [
      "Cash",
      "Cash Bertahap"
    ],
    "minDpBertahapPercent": 50,
    "maxTenorBertahapMonths": 24,
    "featured": false,
    "brochureUrl": "",
    "virtualTourUrl": "",
    "marketingPhone": "",
    "marketingWhatsApp": "",
    "createdAt": 1791158282110,
    "updatedAt": 1791158282111
  },
  {
    "id": "proj-1790576460444",
    "cityId": "city-1788086167332",
    "cityName": "Palembang Kota",
    "name": "Ruko Sky Point Regency",
    "slug": "ruko-sky-point-regency",
    "tagline": "Hunian Nyaman di Jl. Lebung Permai Palembang",
    "developer": "Sentra Land Development",
    "type": "Ruko",
    "price": 900000000,
    "priceDisplay": "Rp 900.000.000",
    "installmentDisplay": "",
    "status": "Tersedia",
    "address": "Jl. Lebung Permai Palembang",
    "locationAddress": "Jl. Lebung Permai Palembang",
    "mapEmbedUrl": "https://maps.app.goo.gl/D3nNYDCZw4Sur7tT9?g_st=aw",
    "mapDirectionsUrl": "https://maps.app.goo.gl/D3nNYDCZw4Sur7tT9?g_st=aw",
    "coordinates": {
      "lat": -2.9549,
      "lng": 104.6865
    },
    "shortDescription": "Project ruko eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "fullDescription": "Project ruko eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "description": "Project ruko eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "mainImage": "/catalog/proj-1790576460444-0.jpg",
    "specs": {
      "surfaceArea": 92,
      "buildingArea": 97,
      "bedrooms": 2,
      "bathrooms": 2,
      "carports": 1,
      "floors": 2,
      "electricity": "1.300 Watt VA",
      "water": "Air Artetis",
      "certificate": "SHM (Sertifikat Hak Milik)",
      "handoverEstimate": "Siap Huni"
    },
    "facilities": [
      "Row Jalan 12 Meter"
    ],
    "advantages": [
      "10 Menit ke Stasiun KRL",
      "20 Menit ke Bandara SMB II"
    ],
    "photos": [
      "/catalog/proj-1790576460444-0.jpg"
    ],
    "photoCaptions": [
      "Foto 1 - Ruko Sky Point Regency"
    ],
    "paymentSchemes": [
      "Cash",
      "Cash Bertahap"
    ],
    "minDpBertahapPercent": 50,
    "maxTenorBertahapMonths": 24,
    "featured": false,
    "brochureUrl": "",
    "virtualTourUrl": "",
    "marketingPhone": "",
    "marketingWhatsApp": "",
    "createdAt": 1790576460447,
    "updatedAt": 1791329055836
  },
  {
    "id": "proj-1790475167150",
    "cityId": "city-1788086167332",
    "cityName": "Palembang Kota",
    "name": "Sky Point Regency",
    "slug": "sky-point-regency",
    "tagline": "Hunian Nyaman di Jl. Raya Barangan Talang Kelapa dekat CGC",
    "developer": "Sentra Land Development",
    "type": "Rumah",
    "price": 700000000,
    "priceDisplay": "Rp 700.000.000",
    "installmentDisplay": "",
    "status": "Tersedia",
    "address": "Jl. Raya Barangan Talang Kelapa dekat CGC",
    "locationAddress": "Jl. Raya Barangan Talang Kelapa dekat CGC",
    "mapEmbedUrl": "https://maps.app.goo.gl/qctHYFN4o7ZrZp3c8",
    "mapDirectionsUrl": "https://maps.app.goo.gl/qctHYFN4o7ZrZp3c8",
    "coordinates": {
      "lat": -2.9549,
      "lng": 104.6865
    },
    "shortDescription": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "fullDescription": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "description": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "mainImage": "/catalog/proj-1790475167150-0.jpg",
    "specs": {
      "surfaceArea": 78,
      "buildingArea": 78,
      "bedrooms": 3,
      "bathrooms": 2,
      "carports": 1,
      "floors": 2,
      "electricity": "2.200 Watt VA",
      "water": "Air Artetis",
      "certificate": "SHM (Sertifikat Hak Milik)",
      "handoverEstimate": "Siap Huni"
    },
    "facilities": [
      "One Gate System",
      "CCTV 24 Jam",
      "Row Jalan 8 Meter"
    ],
    "advantages": [
      "15 Menit ke Stasiun KRL",
      "20 Menit ke Bandara SMB II",
      "Dekat Masjid",
      "Dekat Sekolah",
      "Dekat Pasar"
    ],
    "photos": [
      "/catalog/proj-1790475167150-0.jpg"
    ],
    "photoCaptions": [
      "Foto 1 - Sky Point Regency"
    ],
    "paymentSchemes": [
      "Cash",
      "Cash Bertahap"
    ],
    "minDpBertahapPercent": 50,
    "maxTenorBertahapMonths": 24,
    "featured": false,
    "brochureUrl": "",
    "virtualTourUrl": "",
    "marketingPhone": "",
    "marketingWhatsApp": "",
    "createdAt": 1790475167151,
    "updatedAt": 1791329079340
  },
  {
    "id": "proj-1789964589266",
    "cityId": "city-1788086167332",
    "cityName": "Palembang Kota",
    "name": "Easton City 78",
    "slug": "easton-city-78",
    "tagline": "Hunian Nyaman di Tanjung Barangan Palembang",
    "developer": "Sentra Land Development",
    "type": "Rumah",
    "price": 649000000,
    "priceDisplay": "Rp 649.000.000",
    "installmentDisplay": "",
    "status": "Tersedia",
    "address": "Tanjung Barangan Palembang",
    "locationAddress": "Tanjung Barangan Palembang",
    "mapEmbedUrl": "https://maps.app.goo.gl/ytT1mREQiksGt4gP6",
    "mapDirectionsUrl": "https://maps.app.goo.gl/ytT1mREQiksGt4gP6",
    "coordinates": {
      "lat": -2.9549,
      "lng": 104.6865
    },
    "shortDescription": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "fullDescription": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "description": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "mainImage": "/catalog/proj-1789964589266-0.jpg",
    "specs": {
      "surfaceArea": 78,
      "buildingArea": 78,
      "bedrooms": 3,
      "bathrooms": 2,
      "carports": 1,
      "floors": 2,
      "electricity": "1.300 Watt VA",
      "water": "PDAM",
      "certificate": "SHM (Sertifikat Hak Milik)",
      "handoverEstimate": "Siap Huni"
    },
    "facilities": [
      "One Gate System",
      "Row Jalan 8 Meter"
    ],
    "advantages": [
      "Dekat Sekolah & Mini Market"
    ],
    "photos": [
      "/catalog/proj-1789964589266-0.jpg"
    ],
    "photoCaptions": [
      "Foto 1 - Easton City 78"
    ],
    "paymentSchemes": [
      "Cash",
      "Bank BSI",
      "Credit Developer"
    ],
    "minDpBertahapPercent": 50,
    "maxTenorBertahapMonths": 24,
    "featured": false,
    "brochureUrl": "",
    "virtualTourUrl": "",
    "marketingPhone": "",
    "marketingWhatsApp": "",
    "createdAt": 1789964589272,
    "updatedAt": 1789988318347
  },
  {
    "id": "proj-1789963570184",
    "cityId": "city-1788086167332",
    "cityName": "Palembang Kota",
    "name": "Easton City 57",
    "slug": "easton-city-57",
    "tagline": "Hunian Nyaman di Tanjung Barangan Palembang",
    "developer": "Sentra Land Development",
    "type": "Rumah",
    "price": 549000000,
    "priceDisplay": "Rp 549.000.000",
    "installmentDisplay": "",
    "status": "Tersedia",
    "address": "Tanjung Barangan Palembang",
    "locationAddress": "Tanjung Barangan Palembang",
    "mapEmbedUrl": "https://maps.app.goo.gl/ytT1mREQiksGt4gP6",
    "mapDirectionsUrl": "https://maps.app.goo.gl/ytT1mREQiksGt4gP6",
    "coordinates": {
      "lat": -2.9549,
      "lng": 104.6865
    },
    "shortDescription": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "fullDescription": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "description": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "mainImage": "/catalog/proj-1789963570184-0.jpg",
    "specs": {
      "surfaceArea": 78,
      "buildingArea": 57,
      "bedrooms": 3,
      "bathrooms": 2,
      "carports": 1,
      "floors": 2,
      "electricity": "1.300 Watt VA",
      "water": "PDAM",
      "certificate": "SHM (Sertifikat Hak Milik)",
      "handoverEstimate": "Siap Huni"
    },
    "facilities": [
      "One Gate System",
      "Row Jalan 8 Meter"
    ],
    "advantages": [
      "Dekat Sekolah & Minimarket"
    ],
    "photos": [
      "/catalog/proj-1789963570184-0.jpg"
    ],
    "photoCaptions": [
      "Foto 1 - Easton City 57"
    ],
    "paymentSchemes": [
      "Cash",
      "Bank BSI",
      "Credit Developer"
    ],
    "minDpBertahapPercent": 50,
    "maxTenorBertahapMonths": 24,
    "featured": false,
    "brochureUrl": "",
    "virtualTourUrl": "",
    "marketingPhone": "",
    "marketingWhatsApp": "",
    "createdAt": 1789963570187,
    "updatedAt": 1789988340749
  },
  {
    "id": "proj-1789961527059",
    "cityId": "city-1788086167332",
    "cityName": "Palembang Kota",
    "name": "Villa Cendana Townhouse",
    "slug": "villa-cendana-townhouse",
    "tagline": "Hunian Nyaman di Talang Kelapa Palembang",
    "developer": "Sentra Land Development",
    "type": "Rumah",
    "price": 625000000,
    "priceDisplay": "Rp 625.000.000",
    "installmentDisplay": "",
    "status": "Tersedia",
    "address": "Talang Kelapa Palembang",
    "locationAddress": "Talang Kelapa Palembang",
    "mapEmbedUrl": "https://maps.app.goo.gl/DMZs6XLMcZP8Jr9X7?g_st=awb",
    "mapDirectionsUrl": "https://maps.app.goo.gl/DMZs6XLMcZP8Jr9X7?g_st=awb",
    "coordinates": {
      "lat": -2.9549,
      "lng": 104.6865
    },
    "shortDescription": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "fullDescription": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "description": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "mainImage": "/catalog/proj-1789961527059-0.jpg",
    "specs": {
      "surfaceArea": 78,
      "buildingArea": 65,
      "bedrooms": 3,
      "bathrooms": 2,
      "carports": 1,
      "floors": 1,
      "electricity": "1.300 Watt VA",
      "water": "PDAM",
      "certificate": "SHM (Sertifikat Hak Milik)",
      "handoverEstimate": "Siap Huni"
    },
    "facilities": [
      "One Gate System",
      "Row Jalan 6 Meter"
    ],
    "advantages": [
      "Dekat Gerbang Klinik",
      "15 Menit ke Stasiun KRL",
      "25 Menit ke Bandara",
      "Dekat Sekolah",
      "Dekat Pasar",
      "Dekat Mini Market",
      "Dekat Klinik"
    ],
    "photos": [
      "/catalog/proj-1789961527059-0.jpg"
    ],
    "photoCaptions": [
      "Foto 1 - Villa Cendana Townhouse"
    ],
    "paymentSchemes": [
      "Cash",
      "Credit Developer"
    ],
    "minDpBertahapPercent": 50,
    "maxTenorBertahapMonths": 24,
    "featured": false,
    "brochureUrl": "",
    "virtualTourUrl": "",
    "marketingPhone": "",
    "marketingWhatsApp": "",
    "createdAt": 1789961527060,
    "updatedAt": 1791329247066
  },
  {
    "id": "proj-1789959910514",
    "cityId": "city-1788086167332",
    "cityName": "Palembang Kota",
    "name": "Soetta Prime Residence",
    "slug": "soetta-prime-residence",
    "tagline": "Hunian Nyaman di Jln. Sukasari Talang Kelapa Soekarno Hatta Palembang",
    "developer": "Sentra Land Development",
    "type": "Rumah",
    "price": 675000000,
    "priceDisplay": "Rp 675.000.000",
    "installmentDisplay": "",
    "status": "Tersedia",
    "address": "Jln. Sukasari Talang Kelapa Soekarno Hatta Palembang",
    "locationAddress": "Jln. Sukasari Talang Kelapa Soekarno Hatta Palembang",
    "mapEmbedUrl": "https://maps.app.goo.gl/ewYqHk7pKzxrjFP87",
    "mapDirectionsUrl": "https://maps.app.goo.gl/ewYqHk7pKzxrjFP87",
    "coordinates": {
      "lat": -2.9549,
      "lng": 104.6865
    },
    "shortDescription": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "fullDescription": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "description": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "mainImage": "/catalog/proj-1789959910514-0.jpg",
    "specs": {
      "surfaceArea": 78,
      "buildingArea": 78,
      "bedrooms": 3,
      "bathrooms": 2,
      "carports": 1,
      "floors": 2,
      "electricity": "1.300 Watt VA",
      "water": "PDAM",
      "certificate": "SHM (Sertifikat Hak Milik)",
      "handoverEstimate": "Siap Huni"
    },
    "facilities": [
      "One Gate System",
      "Row Jalan 6 Meter"
    ],
    "advantages": [
      "10 Menit ke Stasiun KRL",
      "15 Menit Ke Bandara"
    ],
    "photos": [
      "/catalog/proj-1789959910514-0.jpg"
    ],
    "photoCaptions": [
      "Foto 1 - Soetta Prime Residence"
    ],
    "paymentSchemes": [
      "Cash",
      "Credit Developer"
    ],
    "minDpBertahapPercent": 50,
    "maxTenorBertahapMonths": 24,
    "featured": false,
    "brochureUrl": "",
    "virtualTourUrl": "",
    "marketingPhone": "",
    "marketingWhatsApp": "",
    "createdAt": 1789959910514,
    "updatedAt": 1789960115057
  },
  {
    "id": "proj-1789107916729",
    "cityId": "city-1788086167332",
    "cityName": "Palembang Kota",
    "name": "Tanah Kelapa Hijau KM12",
    "slug": "tanah-kelapa-hijau-km12",
    "tagline": "Hunian Nyaman di Jln. Kelapa Hijau AMD km12",
    "developer": "Sentra Land Development",
    "type": "Tanah Kavling",
    "price": 1200000000,
    "priceDisplay": "Rp 1.200.000.000",
    "installmentDisplay": "",
    "status": "Tersedia",
    "address": "Jln. Kelapa Hijau AMD km12",
    "locationAddress": "Jln. Kelapa Hijau AMD km12",
    "mapEmbedUrl": "https://maps.app.goo.gl/1oA1q8JoAC4PgEHN8?g_st=iw",
    "mapDirectionsUrl": "https://maps.app.goo.gl/1oA1q8JoAC4PgEHN8?g_st=iw",
    "coordinates": {
      "lat": -2.9549,
      "lng": 104.6865
    },
    "shortDescription": "Tanah Keras siap Bangun",
    "fullDescription": "Tanah Keras siap Bangun",
    "description": "Tanah Keras siap Bangun",
    "mainImage": "/catalog/proj-1789107916729-0.jpg",
    "specs": {
      "surfaceArea": 1176,
      "buildingArea": 60,
      "bedrooms": 2,
      "bathrooms": 1,
      "carports": 1,
      "floors": 1,
      "electricity": "Tanpa Listrik VA",
      "water": "PDAM",
      "certificate": "SPH",
      "handoverEstimate": "Siap Huni"
    },
    "facilities": [
      "One Gate System",
      "Security 24 Jam",
      "Musholla Kawasan",
      "Taman Bermain"
    ],
    "advantages": [
      "Dekat Pasar Km12"
    ],
    "photos": [
      "/catalog/proj-1789107916729-0.jpg",
      "/catalog/proj-1789107916729-1.jpg",
      "/catalog/proj-1789107916729-2.jpg"
    ],
    "photoCaptions": [
      "Foto 1 - Tanah Kelapa Hijau KM12",
      "Foto 2 - Tanah Kelapa Hijau KM12",
      "Foto 3 - Tanah Kelapa Hijau KM12"
    ],
    "paymentSchemes": [
      "Cash"
    ],
    "minDpBertahapPercent": 50,
    "maxTenorBertahapMonths": 24,
    "featured": false,
    "brochureUrl": "",
    "virtualTourUrl": "",
    "marketingPhone": "",
    "marketingWhatsApp": "",
    "createdAt": 1789107916730,
    "updatedAt": 1789369629751
  },
  {
    "id": "proj-1788170779884",
    "cityId": "city-1788086167332",
    "cityName": "Palembang Kota",
    "name": "Sukamto House",
    "slug": "sukamto-house",
    "tagline": "Hunian Nyaman di Jl. R Sukamto lorong Masjid",
    "developer": "Sentra Land Development",
    "type": "Rumah",
    "price": 500000000,
    "priceDisplay": "Rp 500.000.000",
    "installmentDisplay": "",
    "status": "Tersedia",
    "address": "Jl. R Sukamto lorong Masjid",
    "locationAddress": "Jl. R Sukamto lorong Masjid",
    "mapEmbedUrl": "https://maps.app.goo.gl/28jcAktYJkhqsccq7?g_st=iw",
    "mapDirectionsUrl": "https://maps.app.goo.gl/28jcAktYJkhqsccq7?g_st=iw",
    "coordinates": {
      "lat": -2.9549,
      "lng": 104.6865
    },
    "shortDescription": "Project hunian eksklusif dengan lokasi prima, dan nilai investasi tinggi.",
    "fullDescription": "Project hunian eksklusif dengan lokasi prima, dan nilai investasi tinggi.",
    "description": "Project hunian eksklusif dengan lokasi prima, dan nilai investasi tinggi.",
    "mainImage": "/catalog/proj-1788170779884-0.jpg",
    "specs": {
      "surfaceArea": 120,
      "buildingArea": 50,
      "bedrooms": 2,
      "bathrooms": 2,
      "carports": 1,
      "floors": 1,
      "electricity": "1.300 Watt VA",
      "water": "PDAM",
      "certificate": "AJB (Akte Jual Beli)",
      "handoverEstimate": "Siap Huni"
    },
    "facilities": [
      "Row Jalan 6 Meter"
    ],
    "advantages": [
      "Dekat Sekolah & Mall",
      "Dekat Masjid",
      "Dekat Sekolah"
    ],
    "photos": [
      "/catalog/proj-1788170779884-0.jpg",
      "/catalog/proj-1788170779884-1.jpg",
      "/catalog/proj-1788170779884-2.jpg"
    ],
    "photoCaptions": [
      "Foto 1 - Sukamto House",
      "Foto 2 - Sukamto House",
      "Foto 3 - Sukamto House"
    ],
    "paymentSchemes": [
      "Cash",
      "Cash Bertahap"
    ],
    "minDpBertahapPercent": 50,
    "maxTenorBertahapMonths": 24,
    "featured": false,
    "brochureUrl": "",
    "virtualTourUrl": "",
    "marketingPhone": "",
    "marketingWhatsApp": "",
    "createdAt": 1788170779884,
    "updatedAt": 1789369667293
  },
  {
    "id": "proj-1788170233161",
    "cityId": "city-1788086167332",
    "cityName": "Palembang Kota",
    "name": "Alya Harmoni Jambe",
    "slug": "alya-harmoni-jambe",
    "tagline": "Hunian Nyaman di Jl. AMD Talang Jambe",
    "developer": "Sentra Land Development",
    "type": "Rumah",
    "price": 499000000,
    "priceDisplay": "Rp 499.000.000",
    "installmentDisplay": "",
    "status": "Tersedia",
    "address": "Jl. AMD Talang Jambe",
    "locationAddress": "Jl. AMD Talang Jambe",
    "mapEmbedUrl": "https://maps.app.goo.gl/Bm1PBtjx7mNA3nrf8?g_st=ic",
    "mapDirectionsUrl": "https://maps.app.goo.gl/Bm1PBtjx7mNA3nrf8?g_st=ic",
    "coordinates": {
      "lat": -2.9549,
      "lng": 104.6865
    },
    "shortDescription": "Project hunian eksklusif dengan lokasi prima, dan nilai investasi tinggi.",
    "fullDescription": "Project hunian eksklusif dengan lokasi prima, dan nilai investasi tinggi.",
    "description": "Project hunian eksklusif dengan lokasi prima, dan nilai investasi tinggi.",
    "mainImage": "/catalog/proj-1788170233161-0.jpg",
    "specs": {
      "surfaceArea": 120,
      "buildingArea": 55,
      "bedrooms": 2,
      "bathrooms": 1,
      "carports": 1,
      "floors": 1,
      "electricity": "1.300 Watt VA",
      "water": "PDAM",
      "certificate": "SHM (Sertifikat Hak Milik)",
      "handoverEstimate": "Siap Huni"
    },
    "facilities": [
      "One Gate System",
      "Row Jalan 6 Meter"
    ],
    "advantages": [
      "Dekat Mart",
      "Dekat Masjid",
      "Dekat Sekolah"
    ],
    "photos": [
      "/catalog/proj-1788170233161-0.jpg",
      "/catalog/proj-1788170233161-1.jpg",
      "/catalog/proj-1788170233161-2.jpg",
      "/catalog/proj-1788170233161-3.jpg"
    ],
    "photoCaptions": [
      "Foto 1 - Alya Harmoni Jambe",
      "Foto 2 - Alya Harmoni Jambe",
      "Foto 3 - Alya Harmoni Jambe",
      "Foto 4 - Alya Harmoni Jambe"
    ],
    "paymentSchemes": [
      "Cash"
    ],
    "minDpBertahapPercent": 50,
    "maxTenorBertahapMonths": 24,
    "featured": false,
    "brochureUrl": "",
    "virtualTourUrl": "",
    "marketingPhone": "",
    "marketingWhatsApp": "",
    "createdAt": 1788170233162,
    "updatedAt": 1791329439014
  },
  {
    "id": "proj-1788167404972",
    "cityId": "city-1788086167332",
    "cityName": "Palembang Kota",
    "name": "Sentosa Harmoni Residence",
    "slug": "sentosa-harmoni-residence",
    "tagline": "Hunian Nyaman di Jl. Sentosa Plaju",
    "developer": "Sentra Land Development",
    "type": "Rumah",
    "price": 350000000,
    "priceDisplay": "Rp 350.000.000",
    "installmentDisplay": "",
    "status": "Tersedia",
    "address": "Jl. Sentosa Plaju",
    "locationAddress": "Jl. Sentosa Plaju",
    "mapEmbedUrl": "https://maps.app.goo.gl/YZq9x8G4suiTqsgp7?g_st=aw",
    "mapDirectionsUrl": "https://maps.app.goo.gl/YZq9x8G4suiTqsgp7?g_st=aw",
    "coordinates": {
      "lat": -2.9549,
      "lng": 104.6865
    },
    "shortDescription": "Project hunian eksklusif dengan lokasi prima, dan nilai investasi tinggi.",
    "fullDescription": "Project hunian eksklusif dengan lokasi prima, dan nilai investasi tinggi.",
    "description": "Project hunian eksklusif dengan lokasi prima, dan nilai investasi tinggi.",
    "mainImage": "/catalog/proj-1788167404972-0.jpg",
    "specs": {
      "surfaceArea": 84,
      "buildingArea": 36,
      "bedrooms": 1,
      "bathrooms": 1,
      "carports": 1,
      "floors": 1,
      "electricity": "1.300 Watt VA",
      "water": "PDAM",
      "certificate": "SHM (Sertifikat Hak Milik)",
      "handoverEstimate": "Siap Huni"
    },
    "facilities": [
      "One Gate System",
      "Row Jalan 6 Meter"
    ],
    "advantages": [
      "Dekat Masjid",
      "Dekat Pasar",
      "Dekat Mall"
    ],
    "photos": [
      "/catalog/proj-1788167404972-0.jpg",
      "/catalog/proj-1788167404972-1.jpg"
    ],
    "photoCaptions": [
      "Foto 1 - Sentosa Harmoni Residence",
      "Foto 2 - Sentosa Harmoni Residence"
    ],
    "paymentSchemes": [
      "Cash"
    ],
    "minDpBertahapPercent": 50,
    "maxTenorBertahapMonths": 24,
    "featured": false,
    "brochureUrl": "",
    "virtualTourUrl": "",
    "marketingPhone": "",
    "marketingWhatsApp": "",
    "createdAt": 1788167404972,
    "updatedAt": 1791329568589
  },
  {
    "id": "proj-1788164922510",
    "cityId": "city-1788086167332",
    "cityName": "Palembang Kota",
    "name": "Vilamias Lematang Plaju",
    "slug": "vilamias-lematang-plaju",
    "tagline": "Hunian Nyaman di Jl. Lematang Plaju",
    "developer": "Sentra Land Development",
    "type": "Rumah",
    "price": 499000000,
    "priceDisplay": "Rp 499.000.000",
    "installmentDisplay": "",
    "status": "Tersedia",
    "address": "Jl. Lematang Plaju",
    "locationAddress": "Jl. Lematang Plaju",
    "mapEmbedUrl": "https://maps.app.goo.gl/6hVVJGEJ3a5ZJp6a7?g_st=aw",
    "mapDirectionsUrl": "https://maps.app.goo.gl/6hVVJGEJ3a5ZJp6a7?g_st=aw",
    "coordinates": {
      "lat": -2.9549,
      "lng": 104.6865
    },
    "shortDescription": "Project hunian eksklusif dengan lokasi prima, dan nilai investasi tinggi.",
    "fullDescription": "Project hunian eksklusif dengan lokasi prima, dan nilai investasi tinggi.",
    "description": "Project hunian eksklusif dengan lokasi prima, dan nilai investasi tinggi.",
    "mainImage": "/catalog/proj-1788164922510-0.jpg",
    "specs": {
      "surfaceArea": 97,
      "buildingArea": 36,
      "bedrooms": 2,
      "bathrooms": 1,
      "carports": 1,
      "floors": 1,
      "electricity": "1.300 Watt VA",
      "water": "PDAM",
      "certificate": "SHM (Sertifikat Hak Milik)",
      "handoverEstimate": "Siap Huni"
    },
    "facilities": [
      "One Gate System",
      "Row Jalan 6 Meter"
    ],
    "advantages": [
      "Dekat Sekolah",
      "Dekat Masjid",
      "Dekat Kampus"
    ],
    "photos": [
      "/catalog/proj-1788164922510-0.jpg",
      "/catalog/proj-1788164922510-1.jpg"
    ],
    "photoCaptions": [
      "Foto 1 - Vilamias Lematang Plaju",
      "Foto 2 - Vilamias Lematang Plaju"
    ],
    "paymentSchemes": [
      "Cash"
    ],
    "minDpBertahapPercent": 50,
    "maxTenorBertahapMonths": 24,
    "featured": false,
    "brochureUrl": "",
    "virtualTourUrl": "",
    "marketingPhone": "",
    "marketingWhatsApp": "",
    "createdAt": 1788164922514,
    "updatedAt": 1791329722749
  },
  {
    "id": "proj-1788161977693",
    "cityId": "city-1788086167332",
    "cityName": "Palembang Kota",
    "name": "Villa Bukit Indah Type Haruka",
    "slug": "villa-bukit-indah-type-haruka",
    "tagline": "Hunian Nyaman di Jl. Bukit Baru Palembang",
    "developer": "Sentra Land Development",
    "type": "Rumah",
    "price": 765000000,
    "priceDisplay": "Rp 765.000.000",
    "installmentDisplay": "",
    "status": "Tersedia",
    "address": "Jl. Bukit Baru Palembang",
    "locationAddress": "Jl. Bukit Baru Palembang",
    "mapEmbedUrl": "https://maps.app.goo.gl/yZ3woH8V9JXzn5Bg9",
    "mapDirectionsUrl": "https://maps.app.goo.gl/yZ3woH8V9JXzn5Bg9",
    "coordinates": {
      "lat": -2.9549,
      "lng": 104.6865
    },
    "shortDescription": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "fullDescription": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "description": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "mainImage": "/catalog/proj-1788161977693-0.jpg",
    "specs": {
      "surfaceArea": 90,
      "buildingArea": 65,
      "bedrooms": 3,
      "bathrooms": 1,
      "carports": 1,
      "floors": 2,
      "electricity": "1.300 Watt VA",
      "water": "PDAM",
      "certificate": "SHM (Sertifikat Hak Milik)",
      "handoverEstimate": "Siap Huni"
    },
    "facilities": [
      "One Gate System",
      "Masjid",
      "Taman Hijau",
      "Row Jalan 8 Meter"
    ],
    "advantages": [
      "Dekat RS Permata",
      "Superindo",
      "UNSRI",
      "Masjid",
      "Sekolah"
    ],
    "photos": [
      "/catalog/proj-1788161977693-0.jpg",
      "/catalog/proj-1788161977693-1.jpg",
      "/catalog/proj-1788161977693-2.jpg"
    ],
    "photoCaptions": [
      "Foto 1 - Villa Bukit Indah Type Haruka",
      "Foto 2 - Villa Bukit Indah Type Haruka",
      "Foto 3 - Villa Bukit Indah Type Haruka"
    ],
    "paymentSchemes": [
      "Cash",
      "Cash Bertahap",
      "Bank BSI"
    ],
    "minDpBertahapPercent": 50,
    "maxTenorBertahapMonths": 24,
    "featured": false,
    "brochureUrl": "",
    "virtualTourUrl": "",
    "marketingPhone": "",
    "marketingWhatsApp": "",
    "createdAt": 1788161977693,
    "updatedAt": 1789369769946
  },
  {
    "id": "proj-1788141828834",
    "cityId": "city-1788086167332",
    "cityName": "Palembang Kota",
    "name": "Villa Bukit Indah type Yumi",
    "slug": "villa-bukit-indah-type-yumi",
    "tagline": "Hunian Nyaman di Jl. Bukit Baru Palembang",
    "developer": "Sentra Land Development",
    "type": "Rumah",
    "price": 510000000,
    "priceDisplay": "Rp 510.000.000",
    "installmentDisplay": "",
    "status": "Tersedia",
    "address": "Jl. Bukit Baru Palembang",
    "locationAddress": "Jl. Bukit Baru Palembang",
    "mapEmbedUrl": "https://maps.app.goo.gl/yZ3woH8V9JXzn5Bg9",
    "mapDirectionsUrl": "https://maps.app.goo.gl/yZ3woH8V9JXzn5Bg9",
    "coordinates": {
      "lat": -2.9549,
      "lng": 104.6865
    },
    "shortDescription": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "fullDescription": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "description": "Project hunian eksklusif dengan lokasi prima, keamanan 24 jam, dan nilai investasi tinggi.",
    "mainImage": "/catalog/proj-1788141828834-0.jpg",
    "specs": {
      "surfaceArea": 90,
      "buildingArea": 45,
      "bedrooms": 2,
      "bathrooms": 1,
      "carports": 1,
      "floors": 1,
      "electricity": "1300 Watt VA",
      "water": "PDAM",
      "certificate": "SHM (Sertifikat Hak Milik)",
      "handoverEstimate": "Siap Huni"
    },
    "facilities": [
      "One Gate System",
      "Masjid",
      "Taman Hijau",
      "Row Jalan 6 Meter"
    ],
    "advantages": [
      "Dekat RS Permata",
      "Superindo",
      "UNSRI",
      "Masjid",
      "Sekolah"
    ],
    "photos": [
      "/catalog/proj-1788141828834-0.jpg",
      "/catalog/proj-1788141828834-1.jpg",
      "/catalog/proj-1788141828834-2.jpg"
    ],
    "photoCaptions": [
      "Foto 1 - Villa Bukit Indah type Yumi",
      "Foto 2 - Villa Bukit Indah type Yumi",
      "Foto 3 - Villa Bukit Indah type Yumi"
    ],
    "paymentSchemes": [
      "Cash",
      "Cash Bertahap",
      "Bank BSI",
      "Credit Developer"
    ],
    "minDpBertahapPercent": 50,
    "maxTenorBertahapMonths": 24,
    "featured": false,
    "brochureUrl": "",
    "virtualTourUrl": "",
    "marketingPhone": "",
    "marketingWhatsApp": "",
    "createdAt": 1788141828834,
    "updatedAt": 1789369756111
  }
];

export const INITIAL_DOCUMENTATION: DocumentationItem[] = [
  {
    "id": "doc-1788428039067-1x4fyk",
    "title": "Unit di Ortensia Regensi Plaju",
    "category": "Site Visit Proyek",
    "date": "2026-04-23",
    "imageUrl": "/catalog/doc-1788428039067-1x4fyk.jpg",
    "description": "Unit Milik Konsumen yang sudah selesai di Ortensia Regensi Plaju",
    "location": "Palembang",
    "order": 0
  },
  {
    "id": "doc-1788576251193-uep00q",
    "title": "Unit Yumi Villa Bukit Indah",
    "category": "Progress Bangun",
    "date": "2026-02-10",
    "imageUrl": "/catalog/doc-1788576251193-uep00q.jpg",
    "description": "Unit Milik Konsumen yang telah selesai di Villa Bukit Indah",
    "location": "Palembang",
    "order": 0
  },
  {
    "id": "doc-1788418824623-np327z",
    "title": "Unit Kaniya House",
    "category": "Site Visit Proyek",
    "date": "2024-06-04",
    "imageUrl": "/catalog/doc-1788418824623-np327z.jpg",
    "description": "Unit-unit milik konsumen yang sudah selesai di Kaniya House",
    "location": "Palembang",
    "order": 0
  },
  {
    "id": "doc-1788418491968-xpgq67",
    "title": "Unit di Kelapa Hujau Talang Kelapa",
    "category": "Lainnya",
    "date": "2023-07-10",
    "imageUrl": "/catalog/doc-1788418491968-xpgq67.jpg",
    "description": "Unit milik konsumen yang sudah selesai di Kelapa Hujau Talang Kelapa",
    "location": "Palembang",
    "order": 0
  },
  {
    "id": "doc-1788416972724-kxegse",
    "title": "Unit d Cluster Mutiara Plaju",
    "category": "Lainnya",
    "date": "2023-07-01",
    "imageUrl": "/catalog/doc-1788416972724-kxegse.jpg",
    "description": "Unit Milik Konsumen di Cluster Mutiara Plaju",
    "location": "Palembang",
    "order": 0
  },
  {
    "id": "doc-1788418175275-s98xle",
    "title": "Unit di Grand Oase Village",
    "category": "Site Visit Proyek",
    "date": "2023-06-20",
    "imageUrl": "/catalog/doc-1788418175275-s98xle.jpg",
    "description": "Unit milik konsumen yang sudah selesai di Grand Oase Village",
    "location": "Palembang",
    "order": 0
  },
  {
    "id": "doc-1788417614202-dckpdo",
    "title": "Unit Bangunan di Alesha Residence 2",
    "category": "Lainnya",
    "date": "2023-06-17",
    "imageUrl": "/catalog/doc-1788417614202-dckpdo.jpg",
    "description": "Unit milik konsumen yang sudah selesai di Alesha Residence 2",
    "location": "Palembang",
    "order": 0
  },
  {
    "id": "doc-1788417718942-6afwf8",
    "title": "Unit di Fella Residence Tahap 2",
    "category": "Lainnya",
    "date": "2023-02-13",
    "imageUrl": "/catalog/doc-1788417718942-6afwf8.jpg",
    "description": "Unit milik Konsumen yang telah selesai di Fella Residence Tahap 2",
    "location": "Palembang",
    "order": 0
  },
  {
    "id": "doc-1788417885603-48zey6",
    "title": "Unit di Pesona Asy Syifa Barangan",
    "category": "Site Visit Proyek",
    "date": "2023-01-18",
    "imageUrl": "/catalog/doc-1788417885603-48zey6.jpg",
    "description": "Unit Milik Konsumen yang telah Selesai di Pesona Asy Syifa Barangan",
    "location": "Palembang",
    "order": 0
  },
  {
    "id": "doc-1788418002271-btxh66",
    "title": "Unit di Praja Gupta",
    "category": "Lainnya",
    "date": "2022-12-20",
    "imageUrl": "/catalog/doc-1788418002271-btxh66.jpg",
    "description": "Unit Milik Konsumen yang sudah selesai di Cluster Praja Gupta",
    "location": "Palembang",
    "order": 0
  },
  {
    "id": "doc-1788417512868-yarfxs",
    "title": "Pembangunan Unit di Alesha Residence 1",
    "category": "Progress Bangun",
    "date": "2022-12-02",
    "imageUrl": "/catalog/doc-1788417512868-yarfxs.jpg",
    "description": "Progress Pembangunan unit milik konsumen di Alesha Residence 1",
    "location": "Palembang",
    "order": 0
  },
  {
    "id": "doc-1788416123366-20drgo",
    "title": "Bangunan Fella Residence Kalidoni",
    "category": "Lainnya",
    "date": "2022-06-29",
    "imageUrl": "/catalog/doc-1788416123366-20drgo.jpg",
    "description": "Bangunan yang telah selesai dibangun di Fella Residence Kalidoni",
    "location": "Palembang",
    "order": 0
  },
  {
    "id": "doc-1788416447813-qvj6jy",
    "title": "Unit di Cluster Istimewa Km12",
    "category": "Lainnya",
    "date": "2022-06-21",
    "imageUrl": "/catalog/doc-1788416447813-qvj6jy.jpg",
    "description": "Rumah Konsumen yang sudah selesai di Cluster Istimewa Km12",
    "location": "Palembang",
    "order": 0
  },
  {
    "id": "doc-1",
    "title": "Shofiyah Premiere Plaju",
    "category": "Lainnya",
    "date": "2022-06-20",
    "imageUrl": "/catalog/doc-1.jpg",
    "description": "Salah satu Bangunan yang sudah selesai dengan konsep design suka-suka di Shofiyah Premiere Plaju.",
    "location": "Palembang",
    "order": 0
  },
  {
    "id": "doc-1788416282403-rhvhwb",
    "title": "Rumah di Alfarizi Residence Kalidoni",
    "category": "Lainnya",
    "date": "2022-06-02",
    "imageUrl": "/catalog/doc-1788416282403-rhvhwb.jpg",
    "description": "Rumah Konsumen yang telah selesai di Alfarizi Residence Kalidoni.",
    "location": "Palembang",
    "order": 0
  },
  {
    "id": "doc-1788417128812-ts0wqg",
    "title": "Unit di Shofiyah Residence 4",
    "category": "Lainnya",
    "date": "2022-05-20",
    "imageUrl": "/catalog/doc-1788417128812-ts0wqg.jpg",
    "description": "Unit Milik Konsumen yang telah Selesai di Shofiyah Residence 4",
    "location": "Palembang",
    "order": 0
  },
  {
    "id": "doc-1788417261214-o6abb5",
    "title": "Unit di Shofiyah Srimas Plaju",
    "category": "Lainnya",
    "date": "2022-05-10",
    "imageUrl": "/catalog/doc-1788417261214-o6abb5.jpg",
    "description": "Unit Milik Konsumen yang sudah selesai di Shofiyah Srimas Plaju",
    "location": "Palembang",
    "order": 0
  },
  {
    "id": "doc-1788418336469-ss1og4",
    "title": "Unit di Griya Cemara 2",
    "category": "Site Visit Proyek",
    "date": "2022-02-09",
    "imageUrl": "/catalog/doc-1788418336469-ss1og4.jpg",
    "description": "Unit milik konsumen yang sudah selesai di Griya Cemara 2",
    "location": "Palembang",
    "order": 0
  }
];
