import { profile } from "@/data/profile";
import { skillGroups } from "@/data/skills";
import type { CaseStudy } from "@/data/types";
import {
  CURRICULO_DESCRIPTION,
  getSiteUrl,
  normalizeUrl,
  SITE_DESCRIPTION,
  SITE_LAST_MODIFIED,
  SITE_NAME,
} from "@/lib/site";

export interface JsonLdDocument {
  readonly "@context": "https://schema.org";
  readonly "@graph": readonly Record<string, unknown>[];
}

const SITE_LANGUAGE = "pt-BR";

function parsePostalAddress(location: string): Record<string, string> | string {
  const match = location.match(/^([^,]+),\s*([A-Z]{2})\s*[—-]\s*(.+)$/);
  if (!match) {
    return location;
  }

  const [, locality, region, rawCountry] = match;
  const country = rawCountry.trim();

  return {
    "@type": "PostalAddress",
    addressLocality: locality.trim(),
    addressRegion: region.trim(),
    addressCountry: country.toLowerCase() === "brasil" ? "BR" : country,
  };
}

function resolveBaseUrl(baseUrl?: string): string {
  return normalizeUrl(baseUrl ?? getSiteUrl());
}

/**
 * Serializes a JSON-LD object safely for inline <script type="application/ld+json">,
 * escaping characters that could terminate the script block or break JS line parsers.
 */
export function serializeJsonLd(
  data: JsonLdDocument | Record<string, unknown>,
): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/**
 * Builds the Home JSON-LD graph connecting WebSite, ProfilePage, and Person
 * exclusively from the typed portfolio data layer.
 */
export function buildHomeJsonLd(baseUrl?: string): JsonLdDocument {
  const url = resolveBaseUrl(baseUrl);
  const currentExperience = profile.experiences.find((exp) =>
    /atual/i.test(exp.period),
  );
  const personNode: Record<string, unknown> = {
    "@type": "Person",
    "@id": `${url}/#person`,
    name: profile.name,
    alternateName: profile.handle,
    url: `${url}/`,
    jobTitle: profile.title,
    description: profile.bio,
    email: `mailto:${profile.contact.email}`,
    sameAs: [profile.contact.githubUrl, profile.contact.linkedinUrl],
    address: parsePostalAddress(profile.location),
    knowsAbout: skillGroups.flatMap((group) => group.items),
    knowsLanguage: SITE_LANGUAGE,
  };

  if (currentExperience) {
    personNode.worksFor = {
      "@type": "Organization",
      name: currentExperience.company,
    };
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url: `${url}/`,
        name: SITE_NAME,
        alternateName: profile.handle,
        description: SITE_DESCRIPTION,
        inLanguage: SITE_LANGUAGE,
        author: { "@id": `${url}/#person` },
      },
      {
        "@type": "ProfilePage",
        "@id": `${url}/#profilepage`,
        url: `${url}/`,
        name: `${profile.name} — ${profile.title}`,
        description: SITE_DESCRIPTION,
        inLanguage: SITE_LANGUAGE,
        dateModified: SITE_LAST_MODIFIED,
        isPartOf: { "@id": `${url}/#website` },
        mainEntity: { "@id": `${url}/#person` },
      },
      personNode,
    ],
  };
}

/**
 * Builds JSON-LD structured data for the web resume route (/curriculo).
 */
export function buildCurriculoJsonLd(baseUrl?: string): JsonLdDocument {
  const url = resolveBaseUrl(baseUrl);
  const pageUrl = `${url}/curriculo`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${pageUrl}#profilepage`,
        url: pageUrl,
        name: `Currículo — ${profile.name}`,
        description: CURRICULO_DESCRIPTION,
        inLanguage: SITE_LANGUAGE,
        dateModified: SITE_LAST_MODIFIED,
        isPartOf: { "@id": `${url}/#website` },
        mainEntity: {
          "@type": "Person",
          "@id": `${url}/#person`,
          name: profile.name,
          alternateName: profile.handle,
          url: `${url}/`,
          jobTitle: profile.title,
          description: profile.resumeSummary,
          sameAs: [profile.contact.githubUrl, profile.contact.linkedinUrl],
        },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: profile.name,
            item: `${url}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Currículo",
            item: pageUrl,
          },
        ],
      },
    ],
  };
}

/**
 * Builds TechArticle and BreadcrumbList JSON-LD for each anonymized case study route.
 */
export function buildCaseStudyJsonLd(
  study: CaseStudy,
  baseUrl?: string,
): JsonLdDocument {
  const url = resolveBaseUrl(baseUrl);
  const pageUrl = `${url}/cases/${study.slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${pageUrl}#article`,
        url: pageUrl,
        headline: study.title,
        description: study.summary,
        about: study.domain,
        keywords: study.stack.join(", "),
        inLanguage: SITE_LANGUAGE,
        dateModified: SITE_LAST_MODIFIED,
        author: {
          "@type": "Person",
          "@id": `${url}/#person`,
          name: profile.name,
          url: `${url}/`,
        },
        isPartOf: { "@id": `${url}/#website` },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": pageUrl,
        },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: profile.name,
            item: `${url}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Estudos de caso",
            item: `${url}/#cases`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: study.shortTitle,
            item: pageUrl,
          },
        ],
      },
    ],
  };
}
