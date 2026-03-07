import { Metadata } from "next";
import { notFound } from "next/navigation";
import OrganizerView from "@/components/organizador/OrganizerView";
import { organizerService } from "@/services/organizerService";

// ── SEO dinâmico ─────────────────────────────────────────────────────────────
export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;

  try {
    const { organizer } = await organizerService.getOrganizerDetail(slug);
    return {
      title: organizer.name,
      description: `Confira os próximos eventos e contatos de ${organizer.name} na Reppy.`,
      openGraph: {
        title: `${organizer.name} | Reppy`,
        description: `Confira os próximos eventos e contatos de ${organizer.name}.`,
        images: organizer.bannerUrl ? [organizer.bannerUrl] : [],
      },
    };
  } catch {
    return {
      title: "Organizador não encontrado | Reppy",
      description: "Este organizador não está disponível.",
    };
  }
}

// ── PÁGINA ───────────────────────────────────────────────────────────────────
export default async function OrganizerPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;

  let data;
  try {
    data = await organizerService.getOrganizerDetail(slug);
  } catch {
    notFound();
  }

  const { organizer, events } = data;

  // Adapta o shape da API para o shape que os componentes já esperam
  const organizadorProps = {
    nome:      organizer.name,
    bannerUrl: organizer.bannerUrl || null,
    avatarUrl: organizer.logoUrl   || null,
    cidade:    organizer.city      || null,
    seguidores: organizer.followers,
    isFollowing: organizer.isFollowing || false,
    slug:      organizer.slug,
    contatos: {
      instagram: organizer.instagram || null,
      email:     organizer.email     || null,
      whatsapp:  organizer.whatsapp  || null,
    },
    links: organizer.links ?? [],
  };

  return (
    <main className="min-h-screen bg-[#F7F7F2] max-w-[900px] mx-auto pb-20">
      <OrganizerView organizador={organizadorProps} eventos={events} />
    </main>
  );
}