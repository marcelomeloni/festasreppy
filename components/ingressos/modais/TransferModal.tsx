'use client'

import { useState } from 'react'
import { X } from '@phosphor-icons/react'
import { ticketService } from '@/services/ticketService'
import { MyTicket } from '@/services/myTicketsService'

interface TransferModalProps {
  ingresso: MyTicket
  onClose: () => void
}

export default function TransferModal({ ingresso, onClose }: TransferModalProps) {
  const [cpf, setCpf]         = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')

    if (value.length > 11) value = value.substring(0, 11)

    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')

    setCpf(value)
    setError(null)
  }

  const isValid = cpf.length === 14

  async function handleSubmit() {
    if (!isValid) return
    try {
      setLoading(true)
      setError(null)
      await ticketService.transfer(ingresso.id, cpf)
      onClose()
      window.location.reload()

    } catch (err: any) {
      setError(err.message ?? 'Erro ao transferir ingresso. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[24px] p-6 w-full max-w-sm flex flex-col gap-5 animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between w-full">
          <h3 className="font-bricolage text-[20px] font-extrabold text-[#0A0A0A]">Transferir Ingresso</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F0F0EB] flex items-center justify-center hover:bg-[#E0E0D8] transition-colors">
            <X size={15} weight="bold" color="#5C5C52" />
          </button>
        </div>

        <p className="font-body text-[14px] text-[#5C5C52]">
          Digite o CPF do destinatário para enviar o ingresso de{' '}
          <strong className="text-black">{ingresso.evento.nome}</strong>.
        </p>

        <div className="flex flex-col gap-2">
          <label className="font-body text-[12px] font-bold text-[#9A9A8F] uppercase tracking-wider">
            CPF do destinatário
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={cpf}
            onChange={handleCpfChange}
            maxLength={14}
            placeholder="000.000.000-00"
            className="w-full bg-[#F0F0EB] border border-[#E0E0D8] rounded-[12px] px-4 py-3 font-body text-[16px] font-bold text-[#0A0A0A] outline-none focus:border-[#1BFF11] transition-colors placeholder:font-medium"
          />
        </div>

        {error && (
          <p className="font-body text-[12px] text-[#FF2D2D] -mt-2">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!isValid || loading}
          className={`w-full font-bricolage text-[16px] font-extrabold uppercase py-4 rounded-full transition-all mt-2
            ${isValid && !loading
              ? 'bg-[#1BFF11] text-[#0A0A0A] hover:opacity-90 shadow-[4px_4px_0px_#0A0A0A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none cursor-pointer'
              : 'bg-[#F0F0EB] text-[#9A9A8F] border-2 border-transparent cursor-not-allowed'
            }
          `}
        >
          {loading ? 'Transferindo...' : 'Confirmar Transferência'}
        </button>
      </div>
    </div>
  )
}