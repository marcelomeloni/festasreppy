import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Finalizar compra de ingresso",
  description:
    "Finalize a compra do seu ingresso com pagamento seguro via PIX e receba o QR Code na hora para entrar no evento sem fila, com praticidade e suporte rápido.",
  path: "/checkout",
  noindex: true,
});

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
