import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Meus ingressos",
  description:
    "Acesse seus ingressos Reppy, QR Codes e detalhes dos eventos. Gerencie compras, transferências e revenda em poucos passos, direto pelo celular, com facilidade.",
  path: "/meus-ingressos",
  noindex: true,
});

export default function MeusIngressosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
