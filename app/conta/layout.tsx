import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Minha conta",
  description:
    "Gerencie seu perfil, preferências e dados da sua conta Reppy em um só lugar, com acesso rápido aos seus ingressos e eventos, com praticidade e segurança.",
  path: "/conta",
  noindex: true,
});

export default function ContaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
