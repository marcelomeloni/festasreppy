// app/taxas/page.jsx

import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata, serviceSchema } from "@/lib/seo";
import TaxasClient from "./TaxasClient";

export const metadata = pageMetadata({
  title: "Taxas de ingressos",
  description:
    "Reppy cobra as menores taxas do mercado. Sem mensalidade, sem mínimo abusivo, sem surpresa. Compare com as outras plataformas e veja quanto você economiza.",
  path: "/taxas",
});

export default function TaxasPage() {
  return (
    <>
      <JsonLd data={serviceSchema} />
      <TaxasClient />
    </>
  );
}
