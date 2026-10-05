'use client'

import { useState } from 'react'
import { X, Warning } from '@phosphor-icons/react'
import { ticketService } from '@/services/ticketService'
import { MyTicket } from '@/services/myTicketsService'
import { ApiError } from '@/services/apiService'
import { maskCPF, unmaskCPF, validateCPF } from '@/lib/authHelpers'

interface TransferModalProps {
  ingresso: MyTicket
  onClose: () => void
  /** Chamado depois que a transferência é confirmada, para o pai remover
   *  o card da lista sem recarregar a página inteira. */
  onTransferred?: () => void
}

type Step = 'form' | 'confirm'

export default function TransferModal({ ingresso, onClose, onTransferred }: TransferModalProps) {
  const [step, setStep]     = useState<Step>('form')
  const [cpf, setCpf]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  function handleCpfChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCpf(maskCPF(e.target.value))
    setError(null)
  }

  // 11 dígitos com dígito verificador válido. O backend também confere,
  // mas esperar o usuário chegar no fim dos 11 dígitos para tomar 400 é
  // o tipo de erro que faz ele desconfiar do formulário inteiro.
  const digits = unmaskCPF(cpf)
  const isValid = digits.length === 11 && validateCPF(cpf)

  const canSubmit = step === 'confirm' ? !loading : isValid && !loading

  async function handleSubmit() {
    if (!canSubmit) return

    if (step === 'form') {
      setError(null)
      setStep('confirm')
      return
    }

    try {
      setLoading(true)
      setError(null)
      await ticketService.transfer(ingresso.id, digits)
      // Não usa window.location.reload(): o callback deixa o pai atualizar
      // a lista e o modal some, sem recarregar CSS, imagens e o resto do app.
      onTransferred?.()
      onClose()
    } catch (err) {
      // ApiError já carrega a mensagem que o backend mandou em { error }.
      const message = err instanceof ApiError
        ? err.message
        : 'Erro ao transferir ingresso. Tente novamente.'
      setError(message)
      setStep('form')
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
          <h3 className="font-bricolage text-[20px] font-extrabold text-[#0A0A0A]">
            {step === 'form' ? 'Transferir Ingresso' : 'Confirmar Transferência'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F0F0EB] flex items-center justify-center hover:bg-[#E0E0D8] transition-colors"
          >
            <X size={15} weight="bold" color="#5C5C52" />
          </button>
        </div>

        {step === 'form' ? (
          <>
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
                autoComplete="off"
                className="w-full bg-[#F0F0EB] border border-[#E0E0D8] rounded-[12px] px-4 py-3 font-body text-[16px] font-bold text-[#0A0A0A] outline-none focus:border-[#1BFF11] transition-colors placeholder:font-medium"
              />
              {digits.length === 11 && !validateCPF(cpf) && (
                <p className="font-body text-[12px] text-[#FF2D2D] -mt-1">
                  Esse CPF não é válido. Confira os números.
                </p>
              )}
            </div>

            {error && <p className="font-body text-[12px] text-[#FF2D2D] -mt-2">{error}</p>}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`w-full font-bricolage text-[16px] font-extrabold uppercase py-4 rounded-full transition-all mt-2
                ${canSubmit
                  ? 'bg-[#1BFF11] text-[#0A0A0A] hover:opacity-90 shadow-[4px_4px_0px_#0A0A0A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none cursor-pointer'
                  : 'bg-[#F0F0EB] text-[#9A9A8F] border-2 border-transparent cursor-not-allowed'
                }
              `}
            >
              Continuar
            </button>
          </>
        ) : (
          <>
            <div className="flex gap-3 items-start bg-[#F0F0EB] rounded-[16px] p-4">
              <Warning size={20} weight="fill" color="#0A0A0A" className="shrink-0 mt-0.5" />
              <p className="font-body text-[13px] text-[#0A0A0A] leading-relaxed">
                O ingresso vai para <strong>{cpf}</strong> e <strong>sai da sua conta</strong>.
                O QR Code atual será invalidado na hora.
              </p>
            </div>

            <p className="font-body text-[12px] text-[#9A9A8F] leading-relaxed -mt-2">
              A pessoa precisa ter cadastro na Reppy com esse CPF. Ela recebe um e-mail avisando
              e confere em Meus Ingressos.
            </p>

            {error && <p className="font-body text-[12px] text-[#FF2D2D] -mt-2">{error}</p>}

            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => { setStep('form'); setError(null) }}
                disabled={loading}
                className="flex-1 font-bricolage text-[15px] font-extrabold uppercase py-4 rounded-full bg-[#F0F0EB] text-[#5C5C52] hover:bg-[#E0E0D8] transition-colors cursor-pointer disabled:opacity-50"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`flex-[2] font-bricolage text-[16px] font-extrabold uppercase py-4 rounded-full transition-all
                  ${canSubmit
                    ? 'bg-[#1BFF11] text-[#0A0A0A] hover:opacity-90 shadow-[4px_4px_0px_#0A0A0A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none cursor-pointer'
                    : 'bg-[#F0F0EB] text-[#9A9A8F] border-2 border-transparent cursor-not-allowed'
                  }
                `}
              >
                {loading ? 'Transferindo...' : 'Confirmar'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}