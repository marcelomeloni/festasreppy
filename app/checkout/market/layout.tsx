import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Comprar ingresso de revenda",
  description:
    "Compre ingressos de revenda com segurança na Reppy, finalize o pagamento via PIX e receba o QR Code do seu evento na hora, direto no celular, e suporte rápido.",
  path: "/checkout/market",
  noindex: true,
});

export default function CheckoutMarketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
