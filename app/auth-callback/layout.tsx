import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Autenticação",
  description:
    "Aguarde enquanto a Reppy finaliza sua autenticação e prepara o acesso à sua conta de eventos e ingressos em poucos segundos, com segurança e privacidade.",
  path: "/auth-callback",
  noindex: true,
});

export default function AuthCallbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
