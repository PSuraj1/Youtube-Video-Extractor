import { e as createComponent, g as addAttribute, r as renderTemplate, n as renderHead, o as renderSlot, h as createAstro } from './astro/server_CzcP1_xN.mjs';
import 'piccolore';
import 'clsx';
/* empty css                          */

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title,
    description = "Fast, simple YouTube video and Shorts format extraction.",
    canonical = "https://youtubevideoextractor.com/",
    ogImage = "https://youtubevideoextractor.com/og-image.svg",
    lang = "en"
  } = Astro2.props;
  const locales = [
    ["en", "English", ""],
    ["es", "Espa\xF1ol", "/es/"],
    ["ja", "\u65E5\u672C\u8A9E", "/ja/"],
    ["fr", "Fran\xE7ais", "/fr/"],
    ["de", "Deutsch", "/de/"],
    ["pt", "Portugu\xEAs", "/pt/"],
    ["ko", "\uD55C\uAD6D\uC5B4", "/ko/"],
    ["it", "Italiano", "/it/"]
  ];
  return renderTemplate`<html${addAttribute(lang, "lang")}> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><meta name="description"${addAttribute(description, "content")}><meta name="theme-color" content="#4f8cff"><link rel="canonical"${addAttribute(canonical, "href")}>${locales.map(([code, _label, path]) => renderTemplate`<link rel="alternate"${addAttribute(code, "hreflang")}${addAttribute(`https://youtubevideoextractor.com${path}`, "href")}>`)}<link rel="alternate" hreflang="x-default" href="https://youtubevideoextractor.com/"><meta property="og:type" content="website"><meta property="og:site_name" content="YouTube Video Extractor"><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:url"${addAttribute(canonical, "content")}><meta property="og:image"${addAttribute(ogImage, "content")}><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="YouTube Video Extractor - fast, simple format extraction"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description"${addAttribute(description, "content")}><meta name="twitter:image"${addAttribute(ogImage, "content")}><title>${title}</title>${renderHead()}</head> <body>${renderSlot($$result, $$slots["default"])}</body></html>`;
}, "C:/Users/ssura/OneDrive/Documents/ChatGPT/Youtube Video Downloader/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
