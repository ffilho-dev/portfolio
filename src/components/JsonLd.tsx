import { type JsonLdDocument, serializeJsonLd } from "@/lib/structured-data";

interface JsonLdProps {
  readonly data: JsonLdDocument;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
