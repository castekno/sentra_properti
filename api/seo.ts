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

function createSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function findProjectBySlug(slug: string): Promise<any | null> {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || 'spdb');

    const colSnap = await getDocs(collection(db, 'dbproperti'));
    let fallbackList: any[] = [];

    if (!colSnap.empty) {
      for (const d of colSnap.docs) {
        if (d.id === 'Database' || d.id === 'database') {
          const data = d.data() as any;
          if (Array.isArray(data?.projects)) fallbackList = data.projects;
          continue;
        }
        const item = d.data() as any;
        if (item && typeof item.name === 'string') {
          const itemSlug = item.slug || createSlug(item.name);
          if (itemSlug === slug || createSlug(item.name) === slug || d.id === slug) {
            return { ...item, id: d.id };
          }
        }
      }
    }

    for (const p of fallbackList) {
      if (p && typeof p.name === 'string') {
        if (p.slug === slug || createSlug(p.name) === slug || p.id === slug) {
          return p;
        }
      }
    }

    const mainDocSnap = await getDoc(doc(db, 'dbproperti', 'Database'));
    if (mainDocSnap.exists()) {
      const data = mainDocSnap.data() as any;
      const list = data?.projects || data?.INITIAL_PROJECTS || [];
      for (const p of list) {
        if (p && typeof p.name === 'string') {
          if (p.slug === slug || createSlug(p.name) === slug || p.id === slug) {
            return p;
          }
        }
      }
    }
  } catch (err) {
    console.error('Error finding project in api/seo:', err);
  }
  return null;
}

export default async function handler(req: any, res: any) {
  const baseUrl = 'https://sentraproperti.my.id';
  const rawSlug = typeof req.query?.proyek === 'string' ? req.query.proyek.trim().toLowerCase() : '';

  try {
    // Ambil template index.html statis dari deployment
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'sentraproperti.my.id';
    const origin = `${protocol}://${host}`;

    const htmlRes = await fetch(`${origin}/index.html`);
    let html = await htmlRes.text();

    if (rawSlug) {
      const p = await findProjectBySlug(rawSlug);
      if (p) {
        const slug = createSlug(p.name);
        const projectUrl = `${baseUrl}/?proyek=${slug}`;
        const category = p.type || p.category || 'Rumah';
        const cityName = p.cityName || (p.cityId === 'city-1788089738559' ? 'Banyuasin' : 'Palembang Kota');
        const cityClean = cityName.replace(/\s+Kota$/i, '');
        const locArea = p.location || p.lokasi || p.address || cityClean;
        const rawPrice = Number(p.price || 0);

        const priceText =
          rawPrice >= 1000000000
            ? `Rp ${(rawPrice / 1000000000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} Miliar`
            : rawPrice >= 1000000
            ? `Rp ${Math.round(rawPrice / 1000000).toLocaleString('id-ID')} Juta`
            : p.priceDisplay || 'Hubungi Kami';

        const bedrooms = p.specs?.bedrooms ?? p.bedrooms ?? 2;
        const surfaceArea = p.specs?.surfaceArea ?? p.landArea ?? p.surfaceArea ?? 90;
        const buildingArea = p.specs?.buildingArea ?? p.buildingArea ?? 60;
        const status = p.status || 'Ready Stock';

        // Format Title & Description Persis Gaya Pinhome
        const seoTitle = `Dijual ${category} ${p.name} di ${locArea} ${cityClean} - Sentra Properti`;
        const specsPart =
          bedrooms > 0
            ? `dengan ${bedrooms} kamar tidur serta luas tanah ${surfaceArea} m² (LB ${buildingArea} m²)`
            : `dengan luas tanah ${surfaceArea} m²`;
        const seoDesc = `${category} ${specsPart} di perumahan komersil & syariah (${status}) di ${p.address ? `${p.address}, ` : ''}${locArea}, ${cityClean} harga ${priceText}. Legalitas SHM aman bersama Sentra Properti.`;

        const rawImg = (Array.isArray(p.photos) && p.photos[0]) || p.mainImage || p.image || '/logos.png';
        const fullImgUrl = rawImg.startsWith('http') ? rawImg : `${baseUrl}${rawImg.startsWith('/') ? '' : '/'}${rawImg}`;

        const breadcrumbAndItemSchema = {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'BreadcrumbList',
              'itemListElement': [
                {
                  '@type': 'ListItem',
                  'position': 1,
                  'name': 'Sentra Properti',
                  'item': `${baseUrl}/`,
                },
                {
                  '@type': 'ListItem',
                  'position': 2,
                  'name': cityName,
                  'item': `${baseUrl}/#kota`,
                },
                {
                  '@type': 'ListItem',
                  'position': 3,
                  'name': locArea,
                  'item': projectUrl,
                },
              ],
            },
            {
              '@type': 'SingleFamilyResidence',
              'name': seoTitle,
              'description': seoDesc,
              'url': projectUrl,
              'image': fullImgUrl,
              'numberOfRooms': bedrooms,
              'floorSize': {
                '@type': 'QuantitativeValue',
                'value': surfaceArea,
                'unitCode': 'MTK',
              },
              'address': {
                '@type': 'PostalAddress',
                'streetAddress': p.address || locArea,
                'addressLocality': locArea,
                'addressRegion': cityName,
                'addressCountry': 'ID',
              },
              'offers': {
                '@type': 'Offer',
                'price': rawPrice,
                'priceCurrency': 'IDR',
                'availability': 'https://schema.org/InStock',
                'url': projectUrl,
              },
            },
          ],
        };

        // Ganti Title, Meta Description, Canonical, OpenGraph, dan Twitter Card di HTML sebelum dikirim ke Googlebot / Browser
        html = html
          .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(seoTitle)}</title>`)
          .replace(
            /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
            `<meta name="description" content="${escapeHtml(seoDesc)}" />`
          )
          .replace(
            /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
            `<link rel="canonical" href="${escapeHtml(projectUrl)}" />`
          )
          .replace(
            /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
            `<meta property="og:url" content="${escapeHtml(projectUrl)}" />`
          )
          .replace(
            /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
            `<meta property="og:title" content="${escapeHtml(seoTitle)}" />`
          )
          .replace(
            /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
            `<meta property="og:description" content="${escapeHtml(seoDesc)}" />`
          )
          .replace(
            /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
            `<meta property="og:image" content="${escapeHtml(fullImgUrl)}" />`
          )
          .replace(
            /<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/?>/i,
            `<meta name="twitter:url" content="${escapeHtml(projectUrl)}" />`
          )
          .replace(
            /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
            `<meta name="twitter:title" content="${escapeHtml(seoTitle)}" />`
          )
          .replace(
            /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
            `<meta name="twitter:description" content="${escapeHtml(seoDesc)}" />`
          )
          .replace(
            /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
            `<meta name="twitter:image" content="${escapeHtml(fullImgUrl)}" />`
          )
          .replace(
            '</head>',
            `<script id="ssr-project-schema" type="application/ld+json">${JSON.stringify(breadcrumbAndItemSchema)}</script>\n  </head>`
          );
      }
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=3600');
    return res.status(200).send(html);
  } catch (err) {
    console.error('Fallback error in api/seo:', err);
    return res.redirect(302, '/index.html');
  }
}
