import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "sentrapropertidb",
  appId: "1:300320734132:web:7a505d754547c752c3dc62",
  apiKey: "AIzaSyCoCWtU9R2PE51C3-Mi6DAOUrO9xLR_Yck",
  authDomain: "sentrapropertidb.firebaseapp.com",
  firestoreDatabaseId: "spdb",
  storageBucket: "sentrapropertidb.firebasestorage.app",
  messagingSenderId: "300320734132",
};

// Daftar fallback jika suatu saat koneksi Firestore mengalami gangguan sementara
const FALLBACK_SLUGS = [
  'qeena-jeju-residence-ready-stock-',
  'mini-cluster-sultan-2',
  'rinjani-d-premiere-type-gardenia-50',
  'rinjani-d-premiere-type-sapphire-62',
  'hafiz-house-plaju',
  'sako-premier',
  'mini-sultan-cluster-pusri',
  'opi-barokah-estate',
  'ruko-sky-point-regency',
  'sky-point-regency',
  'easton-city-78',
  'easton-city-57',
  'villa-cendana-townhouse',
  'soetta-prime-residence',
  'tanah-kelapa-hijau-km12',
  'sukamto-house',
  'alya-harmoni-jambe',
  'sentosa-harmoni-residence',
  'vilamias-lematang-plaju',
  'villa-bukit-indah-type-haruka',
  'villa-bukit-indah-type-yumi',
];

function createProjectSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function fetchProjectSlugsFromFirestore(): Promise<string[]> {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || 'spdb');

    const slugs: string[] = [];
    const seen = new Set<string>();

    // 1. Ambil dari koleksi utama "dbproperti"
    const colSnap = await getDocs(collection(db, 'dbproperti'));
    let fallbackDocProjects: any[] | null = null;

    if (!colSnap.empty) {
      const items: { name: string; createdAt: number }[] = [];

      colSnap.forEach((d) => {
        if (d.id === 'Database' || d.id === 'database') {
          const data = d.data() as any;
          if (Array.isArray(data?.projects) && data.projects.length > 0) {
            fallbackDocProjects = data.projects;
          }
          return;
        }

        const item = d.data() as any;
        if (item && typeof item.name === 'string' && item.name.trim() !== '') {
          items.push({
            name: item.name.trim(),
            createdAt: typeof item.createdAt === 'number' ? item.createdAt : 0,
          });
        }
      });

      if (items.length > 0) {
        items.sort((a, b) => b.createdAt - a.createdAt);
        for (const item of items) {
          const slug = createProjectSlug(item.name);
          if (slug && !seen.has(slug)) {
            seen.add(slug);
            slugs.push(slug);
          }
        }
        return slugs;
      }

      if (fallbackDocProjects && fallbackDocProjects.length > 0) {
        for (const p of fallbackDocProjects) {
          if (p && typeof p.name === 'string' && p.name.trim() !== '') {
            const slug = createProjectSlug(p.name.trim());
            if (slug && !seen.has(slug)) {
              seen.add(slug);
              slugs.push(slug);
            }
          }
        }
        if (slugs.length > 0) return slugs;
      }
    }

    // 2. Fallback cek dokumen dbproperti/Database
    const mainDocSnap = await getDoc(doc(db, 'dbproperti', 'Database'));
    if (mainDocSnap.exists()) {
      const data = mainDocSnap.data() as any;
      const list = data?.projects || data?.INITIAL_PROJECTS || data?.properti || [];
      if (Array.isArray(list) && list.length > 0) {
        for (const p of list) {
          if (p && typeof p.name === 'string' && p.name.trim() !== '') {
            const slug = createProjectSlug(p.name.trim());
            if (slug && !seen.has(slug)) {
              seen.add(slug);
              slugs.push(slug);
            }
          }
        }
        if (slugs.length > 0) return slugs;
      }
    }
  } catch (error) {
    console.error('Error fetching projects for dynamic sitemap:', error);
  }

  return FALLBACK_SLUGS;
}

export default async function handler(req: any, res: any) {
  const baseUrl = 'https://sentraproperti.my.id';
  const projectSlugs = await fetchProjectSlugsFromFirestore();

  const urlEntries = [
    `  <url>\n    <loc>${baseUrl}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>`,
    ...projectSlugs.map((slug) => {
      const loc = escapeXml(`${baseUrl}/?proyek=${slug}`);
      return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>`;
    }),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries.join('\n')}\n</urlset>\n`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.setHeader('X-Robots-Tag', 'all');
  return res.status(200).send(xml);
}
