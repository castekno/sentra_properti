// Google Analytics 4 (GA4) Silent Event Tracking Helper
// Measurement ID: G-0C7382JLL3

export const GA_MEASUREMENT_ID = 'G-0C7382JLL3';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function sendGtagEvent(eventName: string, params?: Record<string, unknown>): void {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  } catch {
    // Abaikan error jika skrip analitik diblokir oleh ad-blocker browser pengguna
  }
}

export function trackProjectView(project: {
  id: string;
  name: string;
  cityName?: string;
  type?: string;
  price?: number;
  promoPrice?: number;
  slug?: string;
}): void {
  const effectivePrice =
    project.promoPrice && project.promoPrice > 0 ? project.promoPrice : project.price || 0;
  const slug = project.slug || project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  sendGtagEvent('page_view', {
    page_title: `${project.name} - Sentra Properti`,
    page_location: `${window.location.origin}/?proyek=${slug}`,
    page_path: `/?proyek=${slug}`,
  });

  sendGtagEvent('view_item', {
    currency: 'IDR',
    value: effectivePrice,
    items: [
      {
        item_id: project.id,
        item_name: project.name,
        item_category: project.type || 'Properti',
        item_variant: project.cityName || 'Palembang',
        price: effectivePrice,
      },
    ],
  });
}

export function trackWhatsAppClick(source: string, projectName?: string): void {
  sendGtagEvent('whatsapp_click', {
    event_category: 'engagement',
    source,
    project_name: projectName || 'Umum',
  });
}

export function trackInquirySubmit(projectName?: string): void {
  sendGtagEvent('generate_lead', {
    event_category: 'conversion',
    method: 'contact_form',
    project_name: projectName || 'Semua Proyek',
  });
}
