import { useEffect } from "react";
import { useLocation } from "react-router";

const DEFAULT_TITLE = "FilmZone - Cinema & Free Stream";
const DEFAULT_DESCRIPTION =
  "Discover trending movies and TV series, book cinema tickets, and stream for free on FilmZone.";
const DEFAULT_IMAGE = "https://filmzone-foundation-gen6.vercel.app/og-graph.png";
const BASE_URL = "https://filmzone-foundation-gen6.vercel.app";

const setMetaTag = (attrName, attrValue, content) => {
  if (!content) return;
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

const setCanonical = (href) => {
  if (!href) return;
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
};

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
}) {
  const location = useLocation();

  useEffect(() => {
    // 1. Title
    const formattedTitle = title
      ? title.includes("FilmZone")
        ? title
        : `${title} | FilmZone`
      : DEFAULT_TITLE;
    document.title = formattedTitle;

    // 2. Resolve URL and Image
    const canonicalUrl = url
      ? url.startsWith("http")
        ? url
        : `${BASE_URL}${url.startsWith("/") ? url : `/${url}`}`
      : `${BASE_URL}${location.pathname}${location.search || ""}`;

    const resolvedImage = image
      ? image.startsWith("http")
        ? image
        : `${BASE_URL}${image.startsWith("/") ? image : `/${image}`}`
      : DEFAULT_IMAGE;

    // 3. Standard Description
    setMetaTag("name", "description", description);

    // 4. Open Graph
    setMetaTag("property", "og:type", type);
    setMetaTag("property", "og:site_name", "FilmZone");
    setMetaTag("property", "og:title", formattedTitle);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag("property", "og:image", resolvedImage);
    setMetaTag("property", "og:image:secure_url", resolvedImage);
    setMetaTag("property", "og:image:alt", formattedTitle);
    setMetaTag("property", "og:locale", "en_US");

    if (publishedTime) {
      setMetaTag("property", "article:published_time", publishedTime);
    }
    if (modifiedTime) {
      setMetaTag("property", "og:updated_time", modifiedTime);
    }

    // 5. Twitter Card
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", formattedTitle);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", resolvedImage);

    // 6. Canonical
    setCanonical(canonicalUrl);

    // Cleanup on unmount (restore defaults when navigating away)
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title, description, image, url, type, publishedTime, modifiedTime, location]);

  return null;
}
