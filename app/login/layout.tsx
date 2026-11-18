import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Entrar ou criar conta",
  description:
    "Entre ou crie sua conta Reppy para descobrir eventos universitários, salvar ingressos e acompanhar suas festas favoritas perto de você e receber novidades.",
  path: "/login",
  noindex: true,
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
