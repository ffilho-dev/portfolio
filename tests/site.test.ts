import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
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

describe("favicon assets (>F_ terminal prompt)", () => {
  it("defines the >F_ terminal prompt geometry and Zinc/Petróleo/Âmbar adaptive palette in src/app/icon.svg", () => {
    const svg = readFileSync(
      resolve(process.cwd(), "src/app/icon.svg"),
      "utf8",
    );

    expect(svg).toContain('viewBox="0 0 32 32"');
    expect(svg).toContain("@media (prefers-color-scheme: dark)");
    expect(svg).toContain("#0F4C5C");
    expect(svg).toContain("#A5F3FC");
    expect(svg).toContain("#FFFFFF");
    expect(svg).toContain("#09090B");
    expect(svg).toContain("#E09F3E");
    expect(svg).toContain("#FAFAFA");
    expect(svg).not.toContain("#161B22");

    // Chevron >, letter F, and terminal cursor _
    expect(svg).toContain("M5.5 11L11.5 16L5.5 21");
    expect(svg).toContain("M15 9H24V12.5H18.5V15H23V18.5H18.5V23H15V9Z");
    expect(svg).toContain('width="5.5" height="3"');
  });

  it("provides a valid multi-resolution (16x16 and 32x32, 32-bpp) src/app/favicon.ico updated from the legacy FF icon", () => {
    const ico = readFileSync(resolve(process.cwd(), "src/app/favicon.ico"));

    // ICONDIR header: reserved=0, type=1 (ICO), count=2
    expect(ico.readUInt16LE(0)).toBe(0);
    expect(ico.readUInt16LE(2)).toBe(1);
    expect(ico.readUInt16LE(4)).toBe(2);

    // Entry 1: 16x16, 32 bpp
    expect(ico.readUInt8(6)).toBe(16);
    expect(ico.readUInt8(7)).toBe(16);
    expect(ico.readUInt16LE(12)).toBe(32);

    // Entry 2: 32x32, 32 bpp
    expect(ico.readUInt8(22)).toBe(32);
    expect(ico.readUInt8(23)).toBe(32);
    expect(ico.readUInt16LE(28)).toBe(32);

    // Must not be the legacy FF favicon.ico
    const sha256 = createHash("sha256").update(ico).digest("hex");
    expect(sha256).not.toBe(
      "9927e12ae2ff0f40dafe91bba02c206691a9cde426f19631658822ca4a754c30",
    );
  });
});
