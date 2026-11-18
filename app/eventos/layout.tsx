import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Eventos e festas universitárias perto de você",
  description:
    "Encontre festas, baladas e eventos universitários perto de você. Filtre por cidade e data, compare ingressos e garanta seu lugar na Reppy, sem complicação.",
  path: "/eventos",
});

export default function EventosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
