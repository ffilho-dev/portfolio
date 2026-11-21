import { generateResumePdf } from "@/lib/pdf";

export const dynamic = "force-static";

/**
 * Serves the build-time generated ATS-friendly A4 resume PDF.
 */
export async function GET(): Promise<Response> {
  const bytes = await generateResumePdf();

  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="curriculo-francisco-fernandes.pdf"',
      "Content-Length": String(bytes.byteLength),
    },
  });
}
