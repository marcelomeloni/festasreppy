import Script from "next/script";

function serialize(item: unknown): string {
  return JSON.stringify(item).replace(/</g, "\\u003c");
}

function idFor(content: string): string {
  let hash = 0;
  for (let index = 0; index < content.length; index += 1) {
    hash = (hash * 31 + content.charCodeAt(index)) | 0;
  }
  return `jsonld-${Math.abs(hash).toString(36)}`;
}

export function JsonLd({ data }: { data: unknown | unknown[] }) {
  const items = Array.isArray(data) ? data : [data];

  return (
    <>
      {items.map((item) => {
        const content = serialize(item);
        return (
          <Script
            key={idFor(content)}
            id={idFor(content)}
            type="application/ld+json"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );
      })}
    </>
  );
}
