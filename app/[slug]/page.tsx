import { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventBanner } from "@/components/evento/EventBanner";
import { EventDetails } from "@/components/evento/EventDetails";
import { EventSidebar } from "@/components/evento/EventSidebar";
import { eventsService } from "@/services/eventsService";

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  try {
    const data = await eventsService.getEventDetail(slug);
    return {
      title: `${data.event.title} | Reppy`,
      description: data.event.description.substring(0, 150) + "...",
    };
  } catch {
    return {
      title: "Evento não encontrado | Reppy",
      description: "Este evento não está disponível.",
    };
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
      <EventBanner imageUrl={event.image_url} />

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