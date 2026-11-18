"use client";

import { useState } from "react";
import {
  CalendarBlank,
  MapPin,
  ShareNetwork,
  InstagramLogo,
  WarningCircle,
  IdentificationCard,
  ArrowCounterClockwise,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { EventData } from "@/services/eventsService";
import {
  cleanText,
  getEventDateLabel,
  getEventInitials,
  getEventLocationPresentation,
  getEventTitle,
  UNKNOWN_DATE_LABEL,
} from "@/lib/eventDisplay";

const DOC_LABELS: Record<string, string> = {
  rg: "RG",
  cnh: "CNH",
  passaporte: "Passaporte",
  matricula: "Matricula universitaria",
  cpf: "CPF",
};

function formatDoc(doc: string): string {
  return DOC_LABELS[doc.toLowerCase()] ?? doc;
}

function OrganizerAvatar({
  logoUrl,
  name,
  initials,
}: {
  logoUrl: string;
  name: string;
  initials: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (logoUrl && failedSrc !== logoUrl) {
    return (
      <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-[#E0E0D8]">
        <Image
          src={logoUrl}
          alt={`Logo de ${name}`}
          width={56}
          height={56}
          className="w-full h-full object-cover"
          onError={() => setFailedSrc(logoUrl)}
        />
      </div>
    );
  }

  return (
    <div className="w-14 h-14 bg-[#0A0A0A] rounded-full flex items-center justify-center shrink-0">
      <span className="text-[#1BFF11] font-bricolage font-bold text-[14px]">
        {initials}
      </span>
    </div>
  );
}

interface EventDetailsProps {
  event: EventData;
}

export function EventDetails({ event }: EventDetailsProps) {
  const title = getEventTitle(event.title);
  const dateLabel = getEventDateLabel(event.date);
  const dateIsPlaceholder = dateLabel === UNKNOWN_DATE_LABEL;
  const location = getEventLocationPresentation(event);
  const description = cleanText(event.description);
  const instagram = cleanText(event.instagram);

  const policies = event.policies ?? {};
  const minAge = cleanText(policies.minAge) || "Não informada";
  const refundPolicy =
    cleanText(policies.refundPolicy) ||
    "Cancelamentos sujeitos à política do organizador e da plataforma.";
  const requiredDocs: string[] = Array.isArray(policies.requiredDocs)
    ? policies.requiredDocs.filter((doc) => cleanText(doc).length > 0)
    : [];

  const organizerName = cleanText(event.organizer?.name);
  const organizerSlug = cleanText(event.organizer?.slug);
  const organizerLogo = cleanText(event.organizer?.logoUrl);
  const orgInitials = getEventInitials(organizerName);

  const instagramUrl = instagram
    ? instagram.includes("instagram.com")
      ? instagram
      : `https://instagram.com/${instagram.replace(/^@/, "")}`
    : "";

  const organizerCard = (
    <div className="flex items-center justify-between bg-[#F0F0EB] border border-[#E0E0D8] rounded-[20px] p-5 transition-colors">
      <div className="flex items-center gap-4">
        <OrganizerAvatar
          logoUrl={organizerLogo}
          name={organizerName}
          initials={orgInitials}
        />

        <div>
          <h3 className="font-bricolage text-[20px] font-extrabold text-[#0A0A0A] leading-[1]">
            {organizerName}
          </h3>
          <p className="font-body text-[12px] text-[#9A9A8F] font-bold uppercase tracking-[1px] mt-1">
            Entidade Organizadora
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 lg:max-w-[65%] flex flex-col gap-10">
      <div>
        <h1 className="font-bricolage text-[40px] md:text-[56px] font-extrabold text-[#0A0A0A] uppercase tracking-tighter leading-[0.9] mb-6">
          {title}
        </h1>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <CalendarBlank
              size={24}
              weight="bold"
              className="text-[#0A0A0A] shrink-0"
            />
            <span
              className={`font-body text-[16px] font-medium ${
                dateIsPlaceholder ? "text-[#9A9A8F]" : "text-[#5C5C52]"
              }`}
            >
              {dateLabel}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <MapPin
              size={24}
              weight="fill"
              className={`shrink-0 ${
                location.hasLocation ? "text-[#1BFF11]" : "text-[#9A9A8F]"
              }`}
            />
            {location.hasLocation ? (
              <span className="font-body text-[16px] font-medium text-[#5C5C52] underline decoration-[#E0E0D8] underline-offset-4 hover:text-[#0A0A0A] transition-colors cursor-pointer">
                {location.label}
              </span>
            ) : (
              <span className="font-body text-[16px] font-medium text-[#9A9A8F]">
                {location.label}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-8">
          <button
            type="button"
            className="flex items-center gap-2 border border-[#E0E0D8] bg-transparent px-5 py-2.5 rounded-full hover:bg-[#E0E0D8] transition-all text-[#0A0A0A]"
          >
            <ShareNetwork size={20} weight="bold" />
          </button>

          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-[#E0E0D8] bg-transparent px-5 py-2.5 rounded-full hover:bg-[#E0E0D8] transition-all text-[#0A0A0A]"
            >
              <InstagramLogo size={20} weight="bold" />
            </a>
          )}
        </div>
      </div>

      <hr className="border-t border-[#E0E0D8]" />

      {description && (
        <section>
          <h2 className="font-bricolage text-[24px] font-extrabold uppercase text-[#0A0A0A] tracking-tighter mb-4">
            Descrição
          </h2>
          <div className="font-body text-[16px] text-[#5C5C52] whitespace-pre-line leading-relaxed font-medium">
            {description}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-bricolage text-[24px] font-extrabold uppercase text-[#0A0A0A] tracking-tighter mb-4">
          Onde vai ser?
        </h2>

        {location.mapQuery ? (
          <>
            <div className="w-full h-64 bg-[#F0F0EB] rounded-t-[20px] border border-[#E0E0D8] overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(location.mapQuery)}&t=m&z=15&output=embed&iwloc=near`}
              />
            </div>

            <div className="bg-[#F7F7F2] border border-t-0 border-[#E0E0D8] rounded-b-[20px] p-5">
              {location.venueName && (
                <h3 className="font-bricolage text-[18px] font-extrabold text-[#0A0A0A]">
                  {location.venueName}
                </h3>
              )}
              {location.addressLines.length > 0 && (
                <p className="font-body text-[14px] text-[#5C5C52] leading-relaxed mt-1">
                  {location.addressLines.map((line, index) => (
                    <span key={line}>
                      {line}
                      {index < location.addressLines.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="bg-[#F7F7F2] border border-[#E0E0D8] rounded-[20px] p-6 flex items-start gap-3">
            <MapPin
              size={22}
              weight="fill"
              className="text-[#9A9A8F] shrink-0 mt-0.5"
            />
            <div>
              <h3 className="font-bricolage text-[18px] font-extrabold text-[#0A0A0A]">
                Local ainda não divulgado
              </h3>
              <p className="font-body text-[14px] text-[#5C5C52] leading-relaxed mt-1">
                O organizador ainda não informou o endereço do evento. Fique de olho
                nesta página para novidades.
              </p>
            </div>
          </div>
        )}
      </section>

      <section>
        <h2 className="font-bricolage text-[24px] font-extrabold uppercase text-[#0A0A0A] tracking-tighter mb-4">
          Políticas do Evento
        </h2>

        <div className="bg-[#F0F0EB] border border-[#E0E0D8] rounded-[24px] p-6 flex flex-col gap-6">
          <div>
            <h3 className="font-body text-[12px] text-[#9A9A8F] font-bold mb-2 uppercase tracking-[2px]">
              Faixa Etária
            </h3>
            <div className="flex items-center gap-2 text-[#0A0A0A] font-body text-[16px] font-semibold">
              <WarningCircle
                size={20}
                weight="fill"
                className="text-[#FF2D2D] shrink-0"
              />
              {minAge}
            </div>
          </div>

          {requiredDocs.length > 0 && (
            <div>
              <h3 className="font-body text-[12px] text-[#9A9A8F] font-bold mb-3 uppercase tracking-[2px]">
                Documentos Aceitos na Entrada
              </h3>
              <div className="flex flex-wrap gap-2">
                {requiredDocs.map((doc) => (
                  <span
                    key={doc}
                    className="flex items-center gap-1.5 bg-white border border-[#E0E0D8] rounded-full px-3 py-1.5 font-body text-[13px] font-semibold text-[#0A0A0A]"
                  >
                    <IdentificationCard
                      size={14}
                      weight="bold"
                      className="text-[#5C5C52]"
                    />
                    {formatDoc(doc)}
                  </span>
                ))}
              </div>
            </div>
          )}

          <hr className="border-t border-[#E0E0D8]" />

          <div>
            <h3 className="font-body text-[12px] text-[#9A9A8F] font-bold mb-2 uppercase tracking-[2px]">
              Cancelamento
            </h3>
            <div className="flex items-start gap-2">
              <ArrowCounterClockwise
                size={18}
                weight="bold"
                className="text-[#5C5C52] shrink-0 mt-0.5"
              />
              <p className="text-[#5C5C52] font-body text-[16px] leading-relaxed">
                {refundPolicy}
              </p>
            </div>
          </div>
        </div>
      </section>

      {organizerName && (
        <section>
          <h2 className="font-bricolage text-[24px] font-extrabold uppercase text-[#0A0A0A] tracking-tighter mb-4">
            Organizador
          </h2>

          {organizerSlug ? (
            <Link href={`/organizador/${organizerSlug}`} className="block">
              {organizerCard}
            </Link>
          ) : (
            organizerCard
          )}
        </section>
      )}
    </div>
  );
}
