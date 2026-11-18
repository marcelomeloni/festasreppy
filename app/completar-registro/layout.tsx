import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Completar cadastro",
  description:
    "Complete seu cadastro na Reppy para liberar todos os recursos da sua conta, comprar ingressos e acompanhar seus eventos e receber novidades da sua cidade.",
  path: "/completar-registro",
  noindex: true,
});

export default function CompletarRegistroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
