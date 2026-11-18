import type { Metadata } from "next";

export const SITE_URL = "https://reppy.app.br";
export const SITE_NAME = "Reppy";
export const DEFAULT_OG_IMAGE = "/og-image.png";
export const ORGANIZADORES_URL = "https://organizadores.reppy.app.br";
export const CONTACT_EMAIL = "reppybr@gmail.com";
export const HOME_DESCRIPTION =
  "Descubra festas, baladas e eventos universitários perto de você. Compre ingressos com segurança e viva a vida social da sua cidade na Reppy, com praticidade.";

export function canonical(path: string): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return `${SITE_URL}/${clean}${clean ? "/" : ""}`;
}

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  noindex?: boolean;
  images?: string[];
};

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  noindex = false,
  images,
}: PageMetadataOptions): Metadata {
  const url = canonical(path);
  const ogImages = images?.length
    ? images.map((image) => ({ url: image }))
    : [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${title} — ${SITE_NAME}`,
        },
      ];

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "pt_BR",
      type,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.map((image) => image.url),
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  legalName: "Reppy Tecnologia LTDA",
  taxID: "69.775.590/0001-20",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    "@id": `${SITE_URL}/#logo`,
    url: `${SITE_URL}/icon.svg`,
  },
  email: CONTACT_EMAIL,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua Pais Leme, 215 - Conj 1713",
    addressLocality: "São Paulo",
    addressRegion: "SP",
    postalCode: "05424-150",
    addressCountry: "BR",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: CONTACT_EMAIL,
    contactType: "customer service",
    availableLanguage: ["pt-BR"],
  },
};

export const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: "pt-BR",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/taxas/#service`,
  name: "Taxas Reppy",
  description:
    "Reppy cobra 8% de taxa a partir de R$11, sem mensalidade e sem mínimo abusivo.",
  provider: { "@id": `${SITE_URL}/#organization` },
  areaServed: { "@type": "Country", name: "Brasil" },
  serviceType: "Plataforma de venda de ingressos",
  offers: {
    "@type": "Offer",
    priceSpecification: {
      "@type": "PriceSpecification",
      price: "8",
      priceCurrency: "BRL",
      description: "8% para ingressos acima de R$10",
    },
  },
};

export function webPageSchema({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonical(path)}#webpage`,
    name: title,
    description,
    url: canonical(path),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "pt-BR",
  };
}

export function eventSchema(event: {
  slug: string;
  title: string;
  description: string;
  date: string;
  image_url?: string;
  locationName?: string;
  address?: {
    street?: string;
    number?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    neighborhood?: string;
  };
  organizer?: { name?: string };
}) {
  const address = event.address ?? {};
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `${canonical(event.slug)}#event`,
    name: event.title,
    description: event.description,
    startDate: event.date,
    image: event.image_url || `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    location: {
      "@type": "Place",
      name: event.locationName || event.title,
      address: {
        "@type": "PostalAddress",
        streetAddress: [address.street, address.number]
          .filter(Boolean)
          .join(", "),
        addressLocality: address.city || "",
        addressRegion: address.state || "",
        postalCode: address.zipCode || "",
        addressCountry: "BR",
      },
    },
    organizer: {
      "@type": "Organization",
      name: event.organizer?.name || SITE_NAME,
    },
  };
}
