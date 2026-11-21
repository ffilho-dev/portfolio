import { PDFDocument, type PDFFont, type PDFPage, rgb, StandardFonts } from "pdf-lib";
import { caseStudies } from "@/data/cases";
import { profile } from "@/data/profile";
import { publicProjects } from "@/data/projects";
import { aiPillars, skillGroups } from "@/data/skills";
import { getSiteUrl } from "@/lib/site";

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const MARGIN_TOP = 38;
const MARGIN_BOTTOM = 38;
const MARGIN_LEFT = 42;
const MARGIN_RIGHT = 42;
const CONTENT_WIDTH = A4_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

const COLOR_INK = rgb(15 / 255, 23 / 255, 42 / 255);
const COLOR_MUTED = rgb(51 / 255, 65 / 255, 85 / 255);
const COLOR_ACCENT = rgb(15 / 255, 76 / 255, 92 / 255);
const COLOR_RULE = rgb(203 / 255, 213 / 255, 225 / 255);

const SYMBOL_REPLACEMENTS: Readonly<Record<string, string>> = {
  "\u2192": "->",
  "\u21B3": "-",
  "\u2022": "-",
  "\u201C": '"',
  "\u201D": '"',
  "\u2018": "'",
  "\u2019": "'",
  "\u2013": "-",
  "\u2014": "-",
  "\u2026": "...",
  "\u00A0": " ",
  "\t": " ",
};

const WIN_ANSI_EXTRA_CODEPOINTS = new Set<number>([
  338, 339, 352, 353, 376, 381, 382, 402, 710, 732, 8218, 8222, 8224, 8225,
  8240, 8249, 8250, 8364, 8482,
]);

type TextTone = "ink" | "muted" | "accent";

interface ResumeLineSpec {
  readonly text: string;
  readonly bold?: boolean;
  readonly size: number;
  readonly tone: TextTone;
  readonly lineHeight: number;
  readonly spaceBefore?: number;
}

interface ResumeBlock {
  readonly lines: readonly ResumeLineSpec[];
  readonly spaceAfter: number;
}

interface ResumeSection {
  readonly heading: string;
  readonly blocks: readonly ResumeBlock[];
  readonly keepTogether?: boolean;
}

interface ResumeDocumentModel {
  readonly name: string;
  readonly title: string;
  readonly metaLines: readonly string[];
  readonly sections: readonly ResumeSection[];
}

function isSupportedWinAnsiCodePoint(codePoint: number): boolean {
  if (codePoint === 10) return true; // newline
  if (codePoint >= 32 && codePoint <= 126) return true;
  if (codePoint >= 161 && codePoint <= 255 && codePoint !== 173) return true;
  return WIN_ANSI_EXTRA_CODEPOINTS.has(codePoint);
}

/**
 * Normalizes non-WinAnsi punctuation/symbols to ASCII equivalents and strips
 * unsupported code points while preserving Portuguese diacritics.
 */
export function sanitizePdfText(input: string): string {
  const normalized = input.normalize("NFC").replace(/\r\n?/g, "\n");
  let mapped = "";

  for (const ch of normalized) {
    const replacement = SYMBOL_REPLACEMENTS[ch];
    if (replacement !== undefined) {
      mapped += replacement;
      continue;
    }

    const codePoint = ch.codePointAt(0);
    if (codePoint !== undefined && isSupportedWinAnsiCodePoint(codePoint)) {
      mapped += ch;
    }
  }

  return mapped;
}

function isPublicSiteUrl(url: string): boolean {
  return !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(url);
}

function buildResumeDocumentModel(): ResumeDocumentModel {
  const { contact, education, featuredCertification } = profile;
  const siteUrl = getSiteUrl();

  const contactLinePrimary = sanitizePdfText(
    `WhatsApp: ${contact.whatsappDisplay} | E-mail: ${contact.email}`,
  );
  const contactLineLinks = sanitizePdfText(
    `LinkedIn: ${contact.linkedinUrl} | GitHub: ${contact.githubUrl}${
      isPublicSiteUrl(siteUrl) ? ` | Portfólio: ${siteUrl}` : ""
    }`,
  );

  const metaLines = [
    sanitizePdfText(`${profile.location} | ${profile.availability}`),
    contactLinePrimary,
    contactLineLinks,
  ];

  const sections: ResumeSection[] = [
    {
      heading: sanitizePdfText("Resumo profissional"),
      blocks: [
        {
          lines: [
            {
              text: sanitizePdfText(profile.resumeSummary),
              size: 8.8,
              tone: "ink",
              lineHeight: 11.8,
            },
          ],
          spaceAfter: 4,
        },
      ],
    },
    {
      heading: sanitizePdfText("Experiência profissional"),
      blocks: profile.experiences.map((exp, index) => ({
        lines: [
          {
            text: sanitizePdfText(`${exp.company} - ${exp.role}`),
            bold: true,
            size: 9,
            tone: "ink",
            lineHeight: 11.5,
          },
          {
            text: sanitizePdfText(
              exp.location ? `${exp.period} | ${exp.location}` : exp.period,
            ),
            size: 8.2,
            tone: "muted",
            lineHeight: 10.8,
            spaceBefore: 1,
          },
          {
            text: sanitizePdfText(exp.summary),
            size: 8.6,
            tone: "ink",
            lineHeight: 11.4,
            spaceBefore: 1.5,
          },
        ],
        spaceAfter: index === profile.experiences.length - 1 ? 3 : 5.5,
      })),
    },
    {
      heading: sanitizePdfText("Destaques técnicos em produção"),
      blocks: caseStudies.map((study, index) => ({
        lines: [
          {
            text: sanitizePdfText(study.title),
            bold: true,
            size: 8.9,
            tone: "ink",
            lineHeight: 11.3,
          },
          {
            text: sanitizePdfText(
              `${study.period} | ${study.role} | Stack: ${study.stack.join(", ")}`,
            ),
            size: 8.1,
            tone: "muted",
            lineHeight: 10.6,
            spaceBefore: 1,
          },
          {
            text: sanitizePdfText(study.summary),
            size: 8.5,
            tone: "ink",
            lineHeight: 11.2,
            spaceBefore: 1.5,
          },
        ],
        spaceAfter: index === caseStudies.length - 1 ? 3 : 5,
      })),
    },
    {
      heading: sanitizePdfText("Competências técnicas e fluxo com IA"),
      keepTogether: true,
      blocks: [
        ...skillGroups.map((group) => ({
          lines: [
            {
              text: sanitizePdfText(
                `${group.category}: ${group.items.join(", ")}`,
              ),
              size: 8.5,
              tone: "ink" as const,
              lineHeight: 11.2,
            },
          ],
          spaceAfter: 2.5,
        })),
        {
          lines: [
            {
              text: sanitizePdfText(
                `IA aplicada à engenharia: ${aiPillars.map((p) => p.title).join("; ")}.`,
              ),
              size: 8.5,
              tone: "muted",
              lineHeight: 11.2,
              spaceBefore: 1,
            },
          ],
          spaceAfter: 3,
        },
      ],
    },
    {
      heading: sanitizePdfText("Projetos públicos selecionados"),
      blocks: publicProjects.map((project, index) => ({
        lines: [
          {
            text: sanitizePdfText(
              `${project.name}${
                project.isLegacyAccount
                  ? ` (${project.legacyNote ?? "conta anterior"})`
                  : ""
              } - ${project.stack.join(", ")}`,
            ),
            bold: true,
            size: 8.6,
            tone: "ink",
            lineHeight: 11.2,
          },
          {
            text: sanitizePdfText(
              `${project.description} ${
                project.liveUrl ? `Em produção: ${project.liveUrl} | ` : ""
              }Código: ${project.repoUrl}`,
            ),
            size: 8.3,
            tone: "muted",
            lineHeight: 10.8,
            spaceBefore: 1,
          },
        ],
        spaceAfter: index === publicProjects.length - 1 ? 3 : 4,
      })),
    },
    {
      heading: sanitizePdfText("Formação acadêmica e idiomas"),
      keepTogether: true,
      blocks: [
        {
          lines: [
            {
              text: sanitizePdfText(
                `${education.institution} - ${education.degree}`,
              ),
              bold: true,
              size: 8.8,
              tone: "ink",
              lineHeight: 11.4,
            },
            {
              text: sanitizePdfText(
                `${education.period} | Idiomas: ${profile.languages.join(", ")}`,
              ),
              size: 8.4,
              tone: "muted",
              lineHeight: 11,
              spaceBefore: 1,
            },
          ],
          spaceAfter: 3,
        },
      ],
    },
    {
      heading: sanitizePdfText("Certificações"),
      keepTogether: true,
      blocks: [
        {
          lines: [
            {
              text: sanitizePdfText(
                `${featuredCertification.title} - ${featuredCertification.issuer} (${featuredCertification.hours}h, emitido em ${featuredCertification.issuedAt})`,
              ),
              bold: true,
              size: 8.8,
              tone: "ink",
              lineHeight: 11.4,
            },
            {
              text: sanitizePdfText(
                `Verificação: ${featuredCertification.verifyUrl}`,
              ),
              size: 8.2,
              tone: "accent",
              lineHeight: 10.8,
              spaceBefore: 1,
            },
            {
              text: sanitizePdfText(
                `Módulos (${featuredCertification.modules.length}): ${featuredCertification.modules.join(", ")}.`,
              ),
              size: 8.2,
              tone: "muted",
              lineHeight: 10.8,
              spaceBefore: 1.5,
            },
          ],
          spaceAfter: 4,
        },
        {
          lines: [
            {
              text: sanitizePdfText(
                `Outras certificações: ${profile.otherCertifications.join(", ")}.`,
              ),
              size: 8.4,
              tone: "ink",
              lineHeight: 11,
            },
          ],
          spaceAfter: 2,
        },
      ],
    },
  ];

  return {
    name: sanitizePdfText(profile.name),
    title: sanitizePdfText(profile.title),
    metaLines,
    sections,
  };
}

/**
 * Returns the complete sanitized plain-text representation rendered into the
 * resume PDF for NDA confidentiality verification and completeness testing.
 */
export function buildResumeText(): string {
  const doc = buildResumeDocumentModel();
  const output: string[] = [doc.name, doc.title, ...doc.metaLines];

  for (const section of doc.sections) {
    output.push("", section.heading);
    for (const block of section.blocks) {
      for (const line of block.lines) {
        output.push(line.text);
      }
    }
  }

  return output.join("\n");
}

function splitOversizedToken(
  token: string,
  font: PDFFont,
  fontSize: number,
  maxWidth: number,
): string[] {
  const chunks: string[] = [];
  let current = "";

  for (const ch of token) {
    const candidate = current + ch;
    if (current.length > 0 && font.widthOfTextAtSize(candidate, fontSize) > maxWidth) {
      chunks.push(current);
      current = ch;
    } else {
      current = candidate;
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

function wrapTextToWidth(
  text: string,
  font: PDFFont,
  fontSize: number,
  maxWidth: number,
): string[] {
  const paragraphs = text.split("\n");
  const lines: string[] = [];

  for (const paragraph of paragraphs) {
    const words = paragraph.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      continue;
    }

    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
        current = candidate;
        continue;
      }

      if (current) {
        lines.push(current);
        current = "";
      }

      if (font.widthOfTextAtSize(word, fontSize) <= maxWidth) {
        current = word;
      } else {
        const parts = splitOversizedToken(word, font, fontSize, maxWidth);
        lines.push(...parts.slice(0, -1));
        current = parts[parts.length - 1] ?? "";
      }
    }

    if (current) {
      lines.push(current);
    }
  }

  return lines;
}

function resolveColor(tone: TextTone) {
  switch (tone) {
    case "accent":
      return COLOR_ACCENT;
    case "muted":
      return COLOR_MUTED;
    case "ink":
      return COLOR_INK;
  }
}

interface PreparedLine {
  readonly wrapped: readonly string[];
  readonly spec: ResumeLineSpec;
}

interface PreparedBlock {
  readonly lines: readonly PreparedLine[];
  readonly totalHeight: number;
  readonly spaceAfter: number;
}

function prepareBlock(
  block: ResumeBlock,
  regularFont: PDFFont,
  boldFont: PDFFont,
): PreparedBlock {
  let totalHeight = 0;
  const preparedLines: PreparedLine[] = [];

  for (const spec of block.lines) {
    const font = spec.bold ? boldFont : regularFont;
    const wrapped = wrapTextToWidth(spec.text, font, spec.size, CONTENT_WIDTH);
    totalHeight += (spec.spaceBefore ?? 0) + wrapped.length * spec.lineHeight;
    preparedLines.push({ wrapped, spec });
  }

  return {
    lines: preparedLines,
    totalHeight,
    spaceAfter: block.spaceAfter,
  };
}

/**
 * Generates an ATS-friendly selectable A4 PDF resume directly from typed
 * `src/data/*` modules using `pdf-lib` standard Type 1 fonts.
 */
export async function generateResumePdf(): Promise<Uint8Array> {
  const model = buildResumeDocumentModel();
  const pdfDoc = await PDFDocument.create();

  pdfDoc.setTitle(sanitizePdfText(`${model.name} - Currículo (${model.title})`));
  pdfDoc.setAuthor(model.name);
  pdfDoc.setSubject(sanitizePdfText(`${model.title} - Currículo Técnico`));
  pdfDoc.setKeywords([
    "Desenvolvedor FullStack",
    "Java",
    "Spring Boot",
    "PostgreSQL",
    "React",
    "Next.js",
    "TypeScript",
  ]);
  pdfDoc.setCreator("ffilho.dev (pdf-lib)");

  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page: PDFPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  let cursorY = A4_HEIGHT - MARGIN_TOP;

  const ensureSpace = (neededHeight: number) => {
    if (cursorY < A4_HEIGHT - MARGIN_TOP && cursorY - neededHeight < MARGIN_BOTTOM) {
      page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      cursorY = A4_HEIGHT - MARGIN_TOP;
    }
  };

  const drawBlock = (prepared: PreparedBlock) => {
    for (const item of prepared.lines) {
      if (item.spec.spaceBefore) {
        cursorY -= item.spec.spaceBefore;
      }
      const font = item.spec.bold ? boldFont : regularFont;
      const color = resolveColor(item.spec.tone);

      for (const textLine of item.wrapped) {
        if (cursorY - item.spec.size < MARGIN_BOTTOM) {
          page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
          cursorY = A4_HEIGHT - MARGIN_TOP;
        }
        page.drawText(textLine, {
          x: MARGIN_LEFT,
          y: cursorY - item.spec.size,
          size: item.spec.size,
          font,
          color,
        });
        cursorY -= item.spec.lineHeight;
      }
    }
    cursorY -= prepared.spaceAfter;
  };

  // Top accent hairline rule
  page.drawLine({
    start: { x: MARGIN_LEFT, y: cursorY },
    end: { x: A4_WIDTH - MARGIN_RIGHT, y: cursorY },
    thickness: 1.5,
    color: COLOR_ACCENT,
  });
  cursorY -= 8;

  // Name & title
  page.drawText(model.name, {
    x: MARGIN_LEFT,
    y: cursorY - 17,
    size: 17,
    font: boldFont,
    color: COLOR_INK,
  });
  cursorY -= 21;

  page.drawText(model.title, {
    x: MARGIN_LEFT,
    y: cursorY - 10.5,
    size: 10.5,
    font: boldFont,
    color: COLOR_ACCENT,
  });
  cursorY -= 15.5;

  // Header metadata & contact lines
  for (const metaLine of model.metaLines) {
    const wrapped = wrapTextToWidth(metaLine, regularFont, 8.3, CONTENT_WIDTH);
    for (const line of wrapped) {
      page.drawText(line, {
        x: MARGIN_LEFT,
        y: cursorY - 8.3,
        size: 8.3,
        font: regularFont,
        color: COLOR_MUTED,
      });
      cursorY -= 11;
    }
  }

  cursorY -= 4;
  page.drawLine({
    start: { x: MARGIN_LEFT, y: cursorY },
    end: { x: A4_WIDTH - MARGIN_RIGHT, y: cursorY },
    thickness: 0.75,
    color: COLOR_RULE,
  });
  cursorY -= 10;

  // Sections
  const sectionHeadingSize = 9.8;
  const sectionHeadingBlockHeight = 19;

  for (let sIndex = 0; sIndex < model.sections.length; sIndex += 1) {
    const section = model.sections[sIndex];
    const preparedBlocks = section.blocks.map((block) =>
      prepareBlock(block, regularFont, boldFont),
    );
    const firstBlockHeight = preparedBlocks[0]?.totalHeight ?? 0;
    const allBlocksHeight = preparedBlocks.reduce(
      (sum, block) => sum + block.totalHeight + block.spaceAfter,
      0,
    );
    const requiredHeight = section.keepTogether
      ? sectionHeadingBlockHeight + allBlocksHeight
      : sectionHeadingBlockHeight + firstBlockHeight;

    // Keep section heading attached to at least its first entry block (or whole compact section).
    ensureSpace(requiredHeight);

    page.drawText(section.heading, {
      x: MARGIN_LEFT,
      y: cursorY - sectionHeadingSize,
      size: sectionHeadingSize,
      font: boldFont,
      color: COLOR_ACCENT,
    });
    cursorY -= 12.5;

    page.drawLine({
      start: { x: MARGIN_LEFT, y: cursorY },
      end: { x: A4_WIDTH - MARGIN_RIGHT, y: cursorY },
      thickness: 0.6,
      color: COLOR_RULE,
    });
    cursorY -= 6.5;

    for (let bIndex = 0; bIndex < preparedBlocks.length; bIndex += 1) {
      const prepared = preparedBlocks[bIndex];
      if (bIndex > 0) {
        ensureSpace(prepared.totalHeight);
      }
      drawBlock(prepared);
    }

    if (sIndex < model.sections.length - 1) {
      cursorY -= 4;
    }
  }

  return pdfDoc.save();
}
