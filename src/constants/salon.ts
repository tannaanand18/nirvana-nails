/** Single source of truth for salon branding & contact (update for your studio). */
export const SALON_NAME = "Nirvana Nails";

export const WHATSAPP_E164 = "919512267420"; // digits only, country code without +
export const INSTAGRAM_HANDLE = "nirvana_nails0409";

/** Used for Open Graph / canonical when VITE_SITE_URL is unset */
export const SITE_URL_FALLBACK = "https://nirvananails.com";

export const SALON_HOURS = "Daily • 10:00 AM – 8:00 PM";

export const SALON_ADDRESS =
  "Rajkot, Gujarat, India — exact studio location shared when you book.";

export const SALON_PHONE_DISPLAY = "+91 95122 67420";

export function getSiteUrl(): string {
  const v = import.meta.env.VITE_SITE_URL;
  if (typeof v === "string" && v.trim()) return v.replace(/\/$/, "");
  if (typeof window !== "undefined" && window.location?.origin)
    return window.location.origin;
  return SITE_URL_FALLBACK;
}

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(message)}`;
}

export function instagramProfileUrl(): string {
  return `https://instagram.com/${INSTAGRAM_HANDLE}`;
}

/** Default Open Graph / Twitter image (replace with your hosted asset when ready). */
export const DEFAULT_OG_IMAGE_URL =
  "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1200&h=630&fit=crop&auto=format&q=80";
