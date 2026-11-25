import type { Metadata } from "next";
import { profile } from "@/data/profile";

const DEFAULT_SITE_URL = "https://ffilho.dev";

export const SITE_NAME = `${profile.name} (${profile.handle})`;
export const SITE_LOCALE = "pt_BR";
export const SITE_LAST_MODIFIED = "2026-11-25";
export const SITE_DESCRIPTION = `Portfólio técnico de ${profile.name} (${profile.handle}): mais de 6 anos em desenvolvimento de software, atuando em produção com Java, Spring Boot e PostgreSQL, além de React, Next.js, TypeScript e fluxo diário com IA.`;
export const CURRICULO_DESCRIPTION = `Currículo profissional de ${profile.name} — ${profile.title}. Experiência em Java EE, Spring Boot, PostgreSQL, React, Next.js, TypeScript e fluxo com IA.`;
export const OPEN_GRAPH_IMAGE_ALT = `${profile.name} — ${profile.title}`;
export const OPEN_GRAPH_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: OPEN_GRAPH_IMAGE_ALT,
} as const;

export interface PageMetadataOptions {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly openGraphType?: "website" | "article" | "profile";
  readonly openGraphTitle?: string;
  readonly openGraphDescription?: string;
}

export function normalizeUrl(rawUrl: string): string {
  return rawUrl.trim().replace(/\/+$/, "");
}

/**
 * Resolves the canonical site base URL from environment variables.
 */
export function getSiteUrl(
  env: Record<string, string | undefined> = process.env,
): string {
  const publicUrl = env.NEXT_PUBLIC_SITE_URL
    ? normalizeUrl(env.NEXT_PUBLIC_SITE_URL)
    : "";
  if (publicUrl) {
    return publicUrl;
  }

  if (env.VERCEL_ENV === "production") {
    return DEFAULT_SITE_URL;
  }

  const vercelUrl = env.VERCEL_URL ? normalizeUrl(env.VERCEL_URL) : "";
  if (vercelUrl) {
    return /^https?:\/\//i.test(vercelUrl)
      ? vercelUrl
      : `https://${vercelUrl}`;
  }

  return DEFAULT_SITE_URL;
}

/**
 * Formats an external profile URL into a concise display label without scheme or trailing slash.
 */
export function formatDisplayUrl(url: string): string {
  return url
    .trim()
    .replace(/^https?:\/\/(www\.)?/i, "")
    .replace(/\/+$/, "");
}

/**
 * Normalizes a label into an ASCII slug suitable for DOM element IDs.
 */
export function slugifyId(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/**
 * Builds route metadata that preserves canonical URL, locale, siteName,
 * OpenGraph image, and summary_large_image Twitter card across child routes.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  openGraphType = "website",
  openGraphTitle,
  openGraphDescription,
}: PageMetadataOptions): Metadata {
  const resolvedOgTitle = openGraphTitle ?? `${title} — ${profile.name}`;
  const resolvedOgDescription = openGraphDescription ?? description;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: openGraphType,
      locale: SITE_LOCALE,
      url: path,
      siteName: SITE_NAME,
      title: resolvedOgTitle,
      description: resolvedOgDescription,
      images: [OPEN_GRAPH_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedOgTitle,
      description: resolvedOgDescription,
      images: [OPEN_GRAPH_IMAGE.url],
    },
  };
}
