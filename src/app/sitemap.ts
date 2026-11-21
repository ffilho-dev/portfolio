import type { MetadataRoute } from "next";
import { caseStudies } from "@/data/cases";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/curriculo`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  const caseRoutes: MetadataRoute.Sitemap = caseStudies.map((item) => ({
    url: `${baseUrl}/cases/${item.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...caseRoutes];
}
