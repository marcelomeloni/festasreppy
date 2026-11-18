import { Metadata } from "next";
import { notFound } from "next/navigation";
import OrganizerView from "@/components/organizador/OrganizerView";
import { pageMetadata } from "@/lib/seo";
import { organizerService } from "@/services/organizerService";

// ── SEO dinâmico ─────────────────────────────────────────────────────────────
export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;

  try {
    const { organizer } = await organizerService.getOrganizerDetail(slug);
    return pageMetadata({
      title: `${organizer.name} — Organizador de eventos`,
      description: `Confira os próximos eventos e contatos de ${organizer.name} na Reppy.`,
      path: `/organizador/${slug}`,
      images: organizer.bannerUrl ? [organizer.bannerUrl] : undefined,
    });
  } catch {
    return pageMetadata({
      title: "Organizador não encontrado",
      description: "Este organizador não está disponível.",
      path: `/organizador/${slug}`,
      noindex: true,
    });
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