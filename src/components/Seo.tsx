import { useEffect } from "react";
import { DEFAULT_OG_IMAGE_URL, SALON_NAME, getSiteUrl } from "@/constants/salon";

type SeoProps = {
  title: string;
  description: string;
  /** Path only, e.g. `/gallery` */
  path?: string;
  /** Absolute image URL for OG/Twitter */
  ogImage?: string;
  noIndex?: boolean;
};

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function Seo({ title, description, path = "", ogImage, noIndex }: SeoProps) {
  useEffect(() => {
    const base = getSiteUrl().replace(/\/$/, "");
    const normalizedPath = path.startsWith("/") ? path : path ? `/${path}` : "";
    const url =
      normalizedPath === "" || normalizedPath === "/"
        ? base
        : `${base}${normalizedPath}`;
    const absoluteImage =
      ogImage?.startsWith("http") === true ? ogImage : DEFAULT_OG_IMAGE_URL;

    document.title = title.includes(SALON_NAME) ? title : `${title} | ${SALON_NAME}`;

    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", absoluteImage);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", absoluteImage);

    let theme = document.querySelector('meta[name="theme-color"]');
    if (!theme) {
      theme = document.createElement("meta");
      theme.setAttribute("name", "theme-color");
      document.head.appendChild(theme);
    }
    theme.setAttribute("content", "#1a0b1f");

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = url;

    if (noIndex) {
      upsertMeta("name", "robots", "noindex, nofollow");
    } else {
      upsertMeta("name", "robots", "index, follow");
    }
  }, [title, description, path, ogImage, noIndex]);

  return null;
}
