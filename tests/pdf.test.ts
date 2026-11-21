import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";
import { buildResumeText, generateResumePdf, sanitizePdfText } from "@/lib/pdf";
import { GET } from "@/app/curriculo.pdf/route";
import { assertNoConfidentialContent } from "./confidentiality-guard";

describe("resume PDF generator", () => {
  it("normalizes non-WinAnsi symbols safely while preserving Portuguese diacritics", () => {
    expect(sanitizePdfText("Ação → Próximo ↳ “ok”")).toBe('Ação -> Próximo - "ok"');
    expect(sanitizePdfText("Item • ‘aspas’ – travessão — fim… 🚀")).toBe(
      "Item - 'aspas' - travessão - fim... ",
    );
    expect(sanitizePdfText("áàâãéêíóôõúç ÁÀÂÃÉÊÍÓÔÕÚÇ")).toBe(
      "áàâãéêíóôõúç ÁÀÂÃÉÊÍÓÔÕÚÇ",
    );
  });

  it("includes key factual career info and zero confidential patterns in generated PDF text", () => {
    const text = buildResumeText();
    expect(text).toContain("Francisco Fernandes");
    expect(text).toContain("Desenvolvedor FullStack");
    expect(text).toContain("Macau");
    expect(text).toContain("presencial");
    expect(text).toContain("ESIG Software");
    expect(text).toContain("Quark Tecnologia");
    expect(text).toContain("Turing Tecnologia");
    expect(text).toContain("Yank Solutions");
    expect(text).toContain("Salinor");
    expect(text).toContain("UFERSA");
    expect(text).toContain("2027");
    expect(text).toContain("Inglês");
    expect(text).toContain("curso.dev");
    expect(text).toContain("81h");
    expect(text).toContain("https://curso.dev/certificados/19acb84f-0036-43b6-bc20-fc39d7e4fa29");
    expect(text).toContain("Backend e Dados");
    expect(text).toContain("Frontend e Web");
    expect(text).toContain("Qualidade, Infra e IA");
    expect(text).toContain("Em produção:");
    expect(text).not.toContain("Live:");

    assertNoConfidentialContent(text);
  });

  it("generates a valid multi-section A4 PDF from real src/data without encoding errors", async () => {
    const bytes = await generateResumePdf();
    const header = Buffer.from(bytes.slice(0, 5)).toString("ascii");
    expect(header).toBe("%PDF-");

    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBeGreaterThanOrEqual(1);
    expect(doc.getPageCount()).toBeLessThanOrEqual(2);
    expect(doc.getTitle()).toContain("Francisco Fernandes");

    const firstPage = doc.getPage(0);
    const { width, height } = firstPage.getSize();
    expect(width).toBeCloseTo(595.28, 1);
    expect(height).toBeCloseTo(841.89, 1);
  });

  it("serves /curriculo.pdf with PDF content-type and attachment filename", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/pdf");
    expect(res.headers.get("content-disposition")).toContain(
      "curriculo-francisco-fernandes.pdf",
    );
    const buf = new Uint8Array(await res.arrayBuffer());
    expect(Buffer.from(buf.slice(0, 5)).toString("ascii")).toBe("%PDF-");
  });
});
