import type { MetadataRoute } from "next";
import { caseStudies } from "@/data/cases";
import { getSiteUrl, SITE_LAST_MODIFIED } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/curriculo`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  const caseRoutes: MetadataRoute.Sitemap = caseStudies.map((item) => ({
    url: `${baseUrl}/cases/${item.slug}`,
    lastModified: SITE_LAST_MODIFIED,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...caseRoutes];
}
