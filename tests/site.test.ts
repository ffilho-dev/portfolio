import { describe, expect, it } from "vitest";
import {
  buildPageMetadata,
  formatDisplayUrl,
  getSiteUrl,
  slugifyId,
} from "@/lib/site";

describe("site metadata and url helpers", () => {
  it("uses NEXT_PUBLIC_SITE_URL and strips trailing slash", () => {
    expect(getSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://ffilho.dev/" })).toBe(
      "https://ffilho.dev",
    );
  });

  it("prefixes VERCEL_URL with https in preview or non-production environments", () => {
    expect(
      getSiteUrl({ VERCEL_ENV: "preview", VERCEL_URL: "portfolio-ffilho.vercel.app" }),
    ).toBe("https://portfolio-ffilho.vercel.app");
    expect(getSiteUrl({ VERCEL_URL: "portfolio-ffilho.vercel.app" })).toBe(
      "https://portfolio-ffilho.vercel.app",
    );
  });

  it("uses https://ffilho.dev in production and as default fallback", () => {
    expect(
      getSiteUrl({ VERCEL_ENV: "production", VERCEL_URL: "portfolio-ffilho.vercel.app" }),
    ).toBe("https://ffilho.dev");
    expect(getSiteUrl({})).toBe("https://ffilho.dev");
  });

  it("formats display URLs cleanly without scheme, www, or trailing slash", () => {
    expect(
      formatDisplayUrl("https://www.linkedin.com/in/francisco-filho-41793411a/"),
    ).toBe("linkedin.com/in/francisco-filho-41793411a");
  });

  it("slugifies labels into lowercase ASCII DOM identifiers", () => {
    expect(slugifyId("ffilho-dev/portfolio")).toBe("ffilho-dev-portfolio");
  });

  it("builds child metadata with OpenGraph image and summary_large_image Twitter card", () => {
    const meta = buildPageMetadata({
      title: "Currículo",
      description: "Resumo",
      path: "/curriculo",
      openGraphType: "profile",
    });
    expect(meta.alternates?.canonical).toBe("/curriculo");
    expect(meta.openGraph?.locale).toBe("pt_BR");
    expect(meta.openGraph?.images).toEqual([
      expect.objectContaining({ url: "/opengraph-image", width: 1200, height: 630 }),
    ]);
    expect(meta.twitter).toEqual(
      expect.objectContaining({
        card: "summary_large_image",
        images: ["/opengraph-image"],
      }),
    );
  });
});
