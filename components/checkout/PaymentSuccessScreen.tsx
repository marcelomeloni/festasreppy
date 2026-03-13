"use client";

import { SealCheck, Ticket, MapPin, Clock, CalendarBlank } from "@phosphor-icons/react";
import { CartPayload } from "@/services/checkoutService";

interface PaymentSuccessScreenProps {
  cart:          CartPayload;
  isLogged:      boolean;
  buyerEmail:    string;
  onGoToTickets: () => void;
  onGoToEvent:   () => void;
}

function formatEventDate(raw: string): string {
  // Aceita "YYYY-MM-DD", "DD/MM/YYYY" ou strings já formatadas
  const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (isoMatch) {
    const date = new Date(`${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}T12:00:00`)
    return date.toLocaleDateString("pt-BR", {
      weekday: "short",
      day:     "numeric",
      month:   "long",
    })
  }
  // Tenta DD/MM/YYYY
  const brMatch = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})/)
  if (brMatch) {
    const date = new Date(`${brMatch[3]}-${brMatch[2]}-${brMatch[1]}T12:00:00`)
    return date.toLocaleDateString("pt-BR", {
      weekday: "short",
      day:     "numeric",
      month:   "long",
    })
  }
  return raw
}



export default function PaymentSuccessScreen({
  cart,
  isLogged,
  buyerEmail,
  onGoToTickets,
  onGoToEvent,
}: PaymentSuccessScreenProps) {
  const ticketCount  = cart.items.reduce((sum, item) => sum + item.qty, 0)
  const totalPaid    = cart.grandTotal.toLocaleString("pt-BR", {
    style:    "currency",
    currency: "BRL",
  })
  const formattedDate = formatEventDate(cart.eventDate)
 

  return (
    <div className="animate-fadeUp flex flex-col gap-5 py-2">

      {/* ── Header: ícone + título ── */}
      <div className="flex flex-col items-center text-center gap-4 pt-2">

      

        {/* Headline */}
        <div>
          <p className="font-bricolage text-[11px] font-bold tracking-[0.18em] uppercase text-gray-400 mb-1">
            pagamento confirmado
          </p>
          <h2
            className="font-bricolage font-extrabold text-black leading-[0.95] tracking-tight"
            style={{ fontSize: "clamp(36px, 9vw, 48px)" }}
          >
            Tá confirmado.<br />
            <span className="text-primary">Aproveita.</span>
          </h2>
        </div>
      </div>

      {/* ── Card do ingresso ── */}
      <div className="bg-black rounded-[28px] overflow-hidden">

        {/* Faixa verde topo */}
        <div className="h-1 w-full bg-primary" />

        <div className="p-6">
          {/* Label */}
          <p className="font-bricolage text-[10px] font-bold tracking-[0.2em] uppercase text-gray-600 mb-3">
            seus ingressos
          </p>

          {/* Nome do evento */}
          <p
            className="font-bricolage font-extrabold text-white leading-tight mb-4"
            style={{ fontSize: "clamp(18px, 5vw, 22px)" }}
          >
            {cart.eventTitle}
          </p>

          {/* Infos do evento */}
          <div className="flex flex-col gap-2 mb-5">
            <div className="flex items-center gap-2">
              <CalendarBlank size={13} weight="bold" className="text-gray-600 shrink-0" />
              <span className="font-body text-[13px] text-gray-400 capitalize">
                {formattedDate}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={13} weight="bold" className="text-gray-600 shrink-0" />
              <span className="font-body text-[13px] text-gray-400">
                {cart.eventVenue}
              </span>
            </div>
          </div>

          {/* Divisor tracejado — estilo ticket */}
          <div className="relative flex items-center mb-5">
            <div className="absolute -left-6 w-5 h-5 rounded-full bg-off-white" />
            <div className="flex-1 border-t-2 border-dashed border-white/10" />
            <div className="absolute -right-6 w-5 h-5 rounded-full bg-off-white" />
          </div>

          {/* Linha inferior: qtd + valor */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket size={16} weight="fill" className="text-primary" />
              <span className="font-body text-[14px] font-semibold text-white">
                {ticketCount} ingresso{ticketCount !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="text-right">
              <p className="font-bricolage text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                pago
              </p>
              <p className="font-bricolage text-[18px] font-extrabold text-primary leading-none">
                {totalPaid}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Ingressos enviados por email ── */}
      <div
        className="flex items-start gap-3 rounded-[16px] px-4 py-3"
        style={{ background: "#F0F0EB" }}
      >
       
        <p className="font-body text-[13px] text-gray-600 leading-relaxed">
          Seus ingressos foram enviados para{" "}
          <span className="font-semibold text-black">{buyerEmail}</span>.{" "}
          Confira a caixa de spam se não aparecer em breve.
        </p>
      </div>

      {/* ── CTAs ── */}
      <div className="flex flex-col gap-3">
        {isLogged ? (
          <button
            onClick={onGoToTickets}
            className="w-full py-4 rounded-pill bg-primary text-black font-bricolage text-[15px] font-extrabold tracking-wide hover:bg-primary-dark transition-colors"
          >
            Ver meus ingressos
          </button>
        ) : (
          <>
            <button
              onClick={onGoToTickets}
              className="w-full py-4 rounded-pill bg-black text-white font-bricolage text-[15px] font-extrabold tracking-wide hover:bg-black/90 transition-colors"
            >
              Entre na sua conta para ver seus ingressos
            </button>
            <p className="text-center font-body text-[12px] text-gray-400">
              Seu ingresso também foi enviado pro seu e-mail.
            </p>
          </>
        )}
        <button
          onClick={onGoToEvent}
          className="w-full py-3.5 rounded-pill bg-transparent border-2 border-black text-black font-bricolage text-[14px] font-bold hover:bg-black hover:text-white transition-colors"
        >
          Voltar para o evento
        </button>
      </div>

    </div>
  )
}