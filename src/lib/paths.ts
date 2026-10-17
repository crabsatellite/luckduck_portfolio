import type { Lang } from "~/i18n/strings";

/** Site base without a trailing slash, e.g. "/luckduck_portfolio". */
export const base = import.meta.env.BASE_URL.replace(/\/+$/, "");

/** Internal link for a language: href("en", "/cases") -> "/luckduck_portfolio/en/cases". */
export const href = (lang: Lang, path = "/"): string => {
  const p = path === "/" ? "/" : path.replace(/\/+$/, "");
  const prefix = lang === "en" ? `${base}/en` : base;
  return p === "/" ? `${prefix}/` : `${prefix}${p}`;
};

/** Public asset URL under the site base. */
export const asset = (path: string): string => `${base}/${path.replace(/^\/+/, "")}`;

export const modThumb = (id: string): string => asset(`art/mods/${id}.png`);
