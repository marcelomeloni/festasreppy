import { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventBanner } from "@/components/evento/EventBanner";
import { EventDetails } from "@/components/evento/EventDetails";
import { EventSidebar } from "@/components/evento/EventSidebar";
import { JsonLd } from "@/components/seo/JsonLd";
import { eventSchema, pageMetadata } from "@/lib/seo";
import { eventsService } from "@/services/eventsService";

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  try {
    const data = await eventsService.getEventDetail(slug);
    const title = data.event.title.trim() || "Evento";
    const description = data.event.description.trim();
    const summary = description
      ? `${description.slice(0, 150)}${description.length > 150 ? "..." : ""}`
      : `Confira ${title} na Reppy.`;

    return pageMetadata({
      title,
      description: summary,
      path: `/${slug}`,
      images: data.event.image_url ? [data.event.image_url] : undefined,
    });
  } catch {
    return pageMetadata({
      title: "Evento não encontrado",
      description: "Este evento não está disponível.",
      path: `/${slug}`,
      noindex: true,
    });
  }
}

export default async function EventoPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;

  let eventData;
  try {
    eventData = await eventsService.getEventDetail(slug);
  } catch {
    notFound();
  }

  const { event, categories, marketLots } = eventData;

  return (
    <main className="min-h-screen bg-off-white pb-20">
      <JsonLd data={eventSchema(event)} />
      <EventBanner
        imageUrl={event.image_url}
        title={event.title}
        date={event.date}
      />

      <div className="max-w-6xl mx-auto px-4 md:px-6 mt-8 md:mt-12 flex flex-col-reverse lg:flex-row gap-10">
        <EventDetails event={event} />

        <EventSidebar
          event={event}
          categories={categories}
          marketLots={marketLots}
          platformFee={event.platformFee}
        />
      </div>
    </main>
  );
}