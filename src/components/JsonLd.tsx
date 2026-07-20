/**
 * Renders JSON-LD structured data as a <script> tag.
 * Safe for Server Components — no state, no effects.
 */
export function JsonLd({
  data,
  id,
}: {
  data: Record<string, unknown>;
  id?: string;
}) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
