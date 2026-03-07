'use client'

import { useState } from 'react'
import { InstagramLogo, Check, LockSimple } from '@phosphor-icons/react'

function Field({ label, id, type = 'text', value, onChange, placeholder, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-body text-[12px] font-semibold text-[#5C5C52] uppercase tracking-[0.08em]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full font-body text-[15px] font-medium text-[#0A0A0A] placeholder-[#C0C0B8] bg-white border-[1.5px] border-[#E0E0D8] rounded-[12px] px-4 py-3 outline-none focus:border-[#0A0A0A] transition-colors duration-150"
      />
      {hint && <p className="font-body text-[12px] text-[#9A9A8F]">{hint}</p>}
    </div>
  )
}

function ReadonlyField({ label, value }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-body text-[12px] font-semibold text-[#5C5C52] uppercase tracking-[0.08em]">
        {label}
      </label>
      <div className="flex items-center justify-between bg-[#F0F0EB] border-[1.5px] border-[#E0E0D8] rounded-[12px] px-4 py-3">
        <span className="font-body text-[15px] font-medium text-[#9A9A8F] truncate">{value}</span>
        <LockSimple size={15} className="text-[#C0C0B8] shrink-0 ml-3" />
      </div>
    </div>
  )
}

export default function AccountForm({ usuario, onSave }) {
  const [form, setForm] = useState({
    nome:           usuario.nome ?? '',
    instagram:      usuario.instagram ?? '',
    dataNascimento: usuario.dataNascimento ?? '',
  })
  const [saved, setSaved] = useState(false)
  const [dirty, setDirty] = useState(false)

  function handleChange(field) {
    return (e) => {
      setForm(f => ({ ...f, [field]: e.target.value }))
      setDirty(true)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!dirty) return
    await onSave?.(form)
    setSaved(true)
    setDirty(false)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* Editáveis */}
      <Field
        label="Nome"
        id="nome"
        value={form.nome}
        onChange={handleChange('nome')}
        placeholder="Seu nome"
      />

      {/* Instagram com ícone */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="instagram" className="font-body text-[12px] font-semibold text-[#5C5C52] uppercase tracking-[0.08em]">
          Instagram
          <span className="normal-case text-[#9A9A8F] font-normal tracking-normal ml-1.5">
            · aparece no Reppy Radar
          </span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A9A8F] pointer-events-none">
            <InstagramLogo size={17} weight="fill" />
          </span>
          <input
            id="instagram"
            type="text"
            value={form.instagram}
            onChange={handleChange('instagram')}
            placeholder="@seuuser"
            className="w-full font-body text-[15px] font-medium text-[#0A0A0A] placeholder-[#C0C0B8] bg-white border-[1.5px] border-[#E0E0D8] rounded-[12px] pl-10 pr-4 py-3 outline-none focus:border-[#0A0A0A] transition-colors"
          />
        </div>
      </div>

      <Field
        label="Data de nascimento"
        id="dataNascimento"
        type="date"
        value={form.dataNascimento}
        onChange={handleChange('dataNascimento')}
      />

      {/* Divider */}
      <div className="h-px bg-[#E0E0D8] my-1" />

      {/* Somente leitura */}
      <div className="flex flex-col gap-3">
        <p className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-[#C0C0B8]">
          Não editável
        </p>
        <ReadonlyField label="Email"    value={usuario.email}    />
        <ReadonlyField label="Telefone" value={usuario.telefone} />
        <ReadonlyField label="CPF"      value={usuario.cpf}      />
      </div>

      {/* Submit */}
      <div className="pt-1">
        <button
          type="submit"
          disabled={!dirty}
          className={`
            inline-flex items-center gap-2 font-body text-[14px] font-semibold
            px-6 py-[11px] rounded-full border-none transition-all duration-200
            ${saved
              ? 'bg-[#1BFF11] text-[#0A0A0A] cursor-default'
              : dirty
                ? 'bg-[#0A0A0A] text-white hover:opacity-80 cursor-pointer'
                : 'bg-[#F0F0EB] text-[#C0C0B8] cursor-not-allowed'
            }
          `}
        >
          {saved && <Check size={16} weight="bold" />}
          {saved ? 'Salvo' : 'Salvar alterações'}
        </button>
      </div>

    </form>
  )
}