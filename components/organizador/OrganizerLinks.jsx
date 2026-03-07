'use client'

import { InstagramLogo, WhatsappLogo, EnvelopeSimple, Link as LinkIcon, ArrowUpRight } from '@phosphor-icons/react'

const ICON_MAP = {
  instagram: <InstagramLogo size={20} weight="fill" />,
  whatsapp:  <WhatsappLogo  size={20} weight="fill" />,
  email:     <EnvelopeSimple size={20} weight="fill" />,
  site:      <LinkIcon size={20} weight="bold" />,
}

function LinkItem({ item }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-[14px] px-[18px] py-4 bg-white rounded-[16px] border-[1.5px] border-[#E0E0D8] no-underline transition-all duration-150 hover:border-[#0A0A0A] hover:translate-x-1 hover:shadow-[0_4px_16px_rgba(10,10,10,0.06)] group"
    >
      <span className="shrink-0 size-10 rounded-[12px] bg-[#F0F0EB] flex items-center justify-center text-[#0A0A0A]">
        {ICON_MAP[item.tipo] ?? <LinkIcon size={20} weight="bold" />}
      </span>
      <span className="flex-1 font-body text-[15px] font-semibold text-[#0A0A0A]">
        {item.label}
      </span>
      <span className="text-[#9A9A8F] group-hover:text-[#0A0A0A] transition-colors">
        <ArrowUpRight size={16} weight="bold" />
      </span>
    </a>
  )
}

export default function OrganizerLinks({ links, contatos }) {
  const contatoItems = []
  if (contatos?.instagram) contatoItems.push({ tipo: 'instagram', label: contatos.instagram, url: `https://instagram.com/${contatos.instagram.replace('@', '')}` })
  if (contatos?.whatsapp)  contatoItems.push({ tipo: 'whatsapp',  label: contatos.whatsapp,  url: `https://wa.me/55${contatos.whatsapp.replace(/\D/g, '')}` })
  if (contatos?.email)     contatoItems.push({ tipo: 'email',     label: contatos.email,     url: `mailto:${contatos.email}` })

  const hasLinks    = links && links.length > 0
  const hasContatos = contatoItems.length > 0

  if (!hasLinks && !hasContatos) {
    return (
      <div className="text-center py-16 px-6">
        <p className="font-body text-sm text-[#9A9A8F]">Nenhum link por aqui.</p>
      </div>
    )
  }

  return (
    <div className="px-6 py-7 flex flex-col gap-8 max-w-[560px]">
      {hasContatos && (
        <section>
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A9A8F] mb-3">
            Contato
          </p>
          <div className="flex flex-col gap-2">
            {contatoItems.map((item, i) => <LinkItem key={i} item={item} />)}
          </div>
        </section>
      )}

      {hasLinks && (
        <section>
          {hasContatos && (
            <p className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A9A8F] mb-3">
              Outros links
            </p>
          )}
          <div className="flex flex-col gap-2">
            {links.map((item, i) => <LinkItem key={i} item={item} />)}
          </div>
        </section>
      )}
    </div>
  )
}