'use client'

import Link from 'next/link'
import { CalendarBlank, MapPin, Clock } from '@phosphor-icons/react'

function EventCard({ evento }) {
  const isPast = evento.status === 'encerrado'

  return (
    <Link
      href={`/${evento.slug}`}
      className={`block rounded-[20px] overflow-hidden border-[1.5px] border-[#E0E0D8] bg-white no-underline transition-all duration-200 hover:-translate-y-[3px] hover:shadow-[0_12px_32px_rgba(10,10,10,0.08)] hover:border-[#0A0A0A] ${isPast ? 'opacity-50' : ''}`}
    >
      {/* Thumb */}
      <div className="relative w-full aspect-video overflow-hidden bg-[#111]">
        {evento.imagemUrl ? (
          <img
            src={evento.imagemUrl}
            alt={evento.nome}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#111] flex items-center justify-center text-[32px]">
            🎉
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />

        {isPast && (
          <span className="absolute top-[10px] left-[10px] font-body text-[11px] font-bold text-white bg-[#9A9A8F] px-[10px] py-1 rounded-full">
            Encerrado
          </span>
        )}
      </div>

      {/* Body */}
      <div className="px-4 pt-[14px] pb-4">
        <p className="flex items-center gap-1 font-body text-[11px] font-semibold text-[#9A9A8F] uppercase tracking-[0.06em] mb-[5px]">
          <CalendarBlank size={12} weight="fill" />
          {evento.data}
          {evento.hora && (
            <>
              <span className="mx-0.5">·</span>
              <Clock size={12} weight="fill" />
              {evento.hora}
            </>
          )}
        </p>
        <h3 className="font-bricolage text-[17px] font-extrabold text-[#0A0A0A] tracking-tight leading-[1.2] mb-1.5">
          {evento.nome}
        </h3>
        {evento.local && (
          <p className="flex items-center gap-1 font-body text-[12px] text-[#5C5C52]">
            <MapPin size={12} weight="fill" />
            {evento.local}
          </p>
        )}
      </div>
    </Link>
  )
}

export default function OrganizerEventos({ eventos }) {
  if (!eventos || eventos.length === 0) {
    return (
      <div className="text-center py-16 px-6">
        <span className="text-[40px]">🎉</span>
        <p className="font-bricolage text-[20px] font-extrabold text-[#0A0A0A] mt-4 mb-1.5">
          Nenhum evento ainda.
        </p>
        <p className="font-body text-sm text-[#9A9A8F]">
          Quando rolar, aparece aqui.
        </p>
      </div>
    )
  }

  const proximos = eventos.filter(e => e.status !== 'encerrado')
  const passados  = eventos.filter(e => e.status === 'encerrado')

  return (
    <div className="px-6 py-7 flex flex-col gap-9">
      {proximos.length > 0 && (
        <section>
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A9A8F] mb-4">
            Próximos
          </p>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
            {proximos.map(e => <EventCard key={e.id} evento={e} />)}
          </div>
        </section>
      )}

      {passados.length > 0 && (
        <section>
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-[#C0C0B8] mb-4">
            Passados
          </p>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
            {passados.map(e => <EventCard key={e.id} evento={e} />)}
          </div>
        </section>
      )}
    </div>
  )
}