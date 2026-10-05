'use client'

import { useState } from 'react'
import { InstagramLogo, Check, LockSimple, IdentificationCard, Phone, CalendarBlank } from '@phosphor-icons/react'
import type { UserProfile } from '@/services/userService'

function Field({ label, id, type = 'text', value, onChange, placeholder, hint, icon }: {
  label: string; id: string; type?: string; value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string; hint?: string
  icon?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-body text-[12px] font-semibold text-[#5C5C52] uppercase tracking-[0.08em]">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A9A8F] pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={id} type={type} value={value} onChange={onChange} placeholder={placeholder}
          className={`w-full font-body text-[15px] font-medium text-[#0A0A0A] placeholder-[#C0C0B8] bg-white border-[1.5px] border-[#E0E0D8] rounded-[12px] ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 outline-none focus:border-[#0A0A0A] transition-colors duration-150`}
        />
      </div>
      {hint && <p className="font-body text-[12px] text-[#9A9A8F]">{hint}</p>}
    </div>
  )
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-body text-[12px] font-semibold text-[#5C5C52] uppercase tracking-[0.08em]">{label}</label>
      <div className="flex items-center justify-between bg-[#F0F0EB] border-[1.5px] border-[#E0E0D8] rounded-[12px] px-4 py-3">
        <span className="font-body text-[15px] font-medium text-[#9A9A8F] truncate">{value || '—'}</span>
        <LockSimple size={15} className="text-[#C0C0B8] shrink-0 ml-3" />
      </div>
    </div>
  )
}

function maskCPF(value: string): string {
  let v = value.replace(/\D/g, '').slice(0, 11)
  v = v.replace(/(\d{3})(\d)/, '$1.$2')
  v = v.replace(/(\d{3})(\d)/, '$1.$2')
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  return v
}

function maskPhone(value: string): string {
  let v = value.replace(/\D/g, '').slice(0, 11)
  if (v.length > 2) v = v.replace(/^(\d{2})(\d)/g, '($1) $2')
  if (v.length > 7) v = v.replace(/(\d)(\d{4})$/, '$1-$2')
  return v
}

function maskDate(value: string): string {
  let v = value.replace(/\D/g, '').slice(0, 8)
  v = v.replace(/(\d{2})(\d)/, '$1/$2')
  v = v.replace(/(\d{2})(\d)/, '$1/$2')
  return v
}

function toISO(dataBR: string): string {
  const parts = dataBR.split('/')
  if (parts.length !== 3) return ''
  const [d, m, y] = parts
  if (!d || !m || !y) return ''
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
}

function formatDateBR(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return ''
  return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`
}

interface AccountFormProps {
  usuario: UserProfile
  onSave?: (payload: {
    fullName:  string
    phone:     string
    instagram: string
    cpf?:      string
    birthDate?: string
  }) => Promise<void>
}

export default function AccountForm({ usuario, onSave }: AccountFormProps) {
  const incomplete = !usuario.cpf?.trim() || !usuario.phone?.trim() || !usuario.birthDate?.trim()

  const [form, setForm] = useState({
    fullName:    usuario.fullName  ?? '',
    instagram:   usuario.instagram ?? '',
    cpf:         usuario.cpf       ?? '',
    phone:       usuario.phone     ?? '',
    birthDateBR: usuario.birthDate ? formatDateBR(usuario.birthDate) : '',
  })
  const [saved, setSaved] = useState(false)
  const [dirty, setDirty] = useState(false)

  function handleChange(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value
      if (field === 'cpf') value = maskCPF(value)
      if (field === 'phone') value = maskPhone(value)
      if (field === 'birthDateBR') value = maskDate(value)
      setForm(f => ({ ...f, [field]: value }))
      setDirty(true)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!dirty) return
    const payload: {
      fullName:  string
      phone:     string
      instagram: string
      cpf?:      string
      birthDate?: string
    } = {
      fullName:  form.fullName,
      phone:     incomplete ? form.phone : usuario.phone,
      instagram: form.instagram,
    }
    if (incomplete) {
      if (form.cpf) payload.cpf = form.cpf
      if (form.birthDateBR) {
        const iso = toISO(form.birthDateBR)
        if (iso) payload.birthDate = iso
      }
    }
    await onSave?.(payload)
    setSaved(true); setDirty(false)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field label="Nome" id="fullName" value={form.fullName} onChange={handleChange('fullName')} placeholder="Seu nome" />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="instagram" className="font-body text-[12px] font-semibold text-[#5C5C52] uppercase tracking-[0.08em]">
          Instagram
          <span className="normal-case text-[#9A9A8F] font-normal tracking-normal ml-1.5">— aparece no Reppy Radar</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A9A8F] pointer-events-none">
            <InstagramLogo size={17} weight="fill" />
          </span>
          <input
            id="instagram" type="text" value={form.instagram} onChange={handleChange('instagram')} placeholder="@seuuser"
            className="w-full font-body text-[15px] font-medium text-[#0A0A0A] placeholder-[#C0C0B8] bg-white border-[1.5px] border-[#E0E0D8] rounded-[12px] pl-10 pr-4 py-3 outline-none focus:border-[#0A0A0A] transition-colors"
          />
        </div>
      </div>

      <div className="h-px bg-[#E0E0D8] my-1" />

      <div className="flex flex-col gap-3">
        <p className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-[#C0C0B8]">Dados pessoais</p>
        {incomplete ? (
          <>
            <Field
              label="CPF"
              id="cpf"
              value={form.cpf}
              onChange={handleChange('cpf')}
              placeholder="000.000.000-00"
              icon={<IdentificationCard size={18} />}
            />
            <Field
              label="Telefone"
              id="phone"
              value={form.phone}
              onChange={handleChange('phone')}
              placeholder="(00) 00000-0000"
              icon={<Phone size={18} />}
            />
            <Field
              label="Data de nascimento"
              id="birthDateBR"
              value={form.birthDateBR}
              onChange={handleChange('birthDateBR')}
              placeholder="DD/MM/AAAA"
              icon={<CalendarBlank size={18} />}
            />
          </>
        ) : (
          <>
            <ReadonlyField label="CPF" value={usuario.cpf} />
            <ReadonlyField label="Telefone" value={usuario.phone} />
            <ReadonlyField label="Data de nascimento" value={formatDateBR(usuario.birthDate)} />
          </>
        )}
        <ReadonlyField label="Email" value={usuario.email} />
      </div>

      <div className="pt-1">
        <button
          type="submit" disabled={!dirty}
          className={`inline-flex items-center gap-2 font-body text-[14px] font-semibold px-6 py-[11px] rounded-full border-none transition-all duration-200
            ${saved ? 'bg-[#1BFF11] text-[#0A0A0A] cursor-default'
              : dirty ? 'bg-[#0A0A0A] text-white hover:opacity-80 cursor-pointer'
              : 'bg-[#F0F0EB] text-[#C0C0B8] cursor-not-allowed'}`}
        >
          {saved && <Check size={16} weight="bold" />}
          {saved ? 'Salvo' : 'Salvar alterações'}
        </button>
      </div>
    </form>
  )
}