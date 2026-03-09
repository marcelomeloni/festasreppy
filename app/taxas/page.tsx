// app/taxas/page.jsx

import TaxasClient from "./TaxasClient";

export const metadata = {
  title: "Taxas",
  description:
    "Reppy cobra 7% de taxa a partir de R$15. Sem mensalidade, sem mínimo abusivo, sem surpresa. Compare com as outras plataformas e veja quanto você economiza.",
  keywords: [
    "taxa ingresso universitário",
    "plataforma venda ingressos barata",
    "menor taxa venda de ingressos",
    "reppy taxas",
    "vender ingresso festa universitária",
    "comparar taxa sympla cheers eventiza",
  ],
  openGraph: {
    title: "Reppy — 7% de taxa. A menor do mercado.",
    description:
      "Compare a taxa da Reppy com as outras plataformas. Veja quanto você economiza em cada evento.",
    url: "https://reppy.com.br/taxas",
    siteName: "Reppy",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reppy — 7% de taxa. A menor do mercado.",
    description: "Compare e veja quanto você economiza usando a Reppy.",
  },
  alternates: {
    canonical: "https://reppy.com.br/taxas",
  },
};

export default function TaxasPage() {
  return <TaxasClient />;
}