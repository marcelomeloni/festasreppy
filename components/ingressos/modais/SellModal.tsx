'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' // 1. Adicione esta importação
import { X, Tag, WarningCircle, Trash } from '@phosphor-icons/react'
import { ticketService } from '@/services/ticketService'
import { MyTicket } from '@/services/myTicketsService'

interface SellModalProps {
  ingresso: MyTicket
  onClose: () => void
}

export default function SellModal({ ingresso, onClose }: SellModalProps) {
  const router = useRouter() // 2. Inicialize o router
  
  const isEditing = ingresso.isListed && !!ingresso.listingId

  const [displayValue, setDisplayValue] = useState(() => {
    if (isEditing && ingresso.listingPrice) {
      return ingresso.listingPrice.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    }
    return ''
  })
  const [rawValue, setRawValue]     = useState(isEditing ? (ingresso.listingPrice ?? 0) : 0)
  const [loading, setLoading]       = useState(false)
  const [deleting, setDeleting]     = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const loteAtual   = ingresso.currentBatchPrice ?? null
  const precoMaximo = loteAtual !== null ? loteAtual - 1.6 : null

  const handleMoneyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')

    if (!value) {
      setDisplayValue('')
      setRawValue(0)
      return
    }

    const numberValue = parseInt(value, 10) / 100
    setRawValue(numberValue)
    setDisplayValue(
      numberValue.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    )
  }

  const isTooHigh = precoMaximo !== null && rawValue > precoMaximo
  const isValid   = rawValue > 0 && !isTooHigh

 async function handleSubmit() {
    if (!isValid) return
    setLoading(true)
    setError(null)
    try {
      if (isEditing && ingresso.listingId) {
        await ticketService.updateListing(ingresso.listingId, rawValue)
      } else {
        await ticketService.createListing(ingresso.id, rawValue)
      }
      
      // Dá o F5 na página!
      window.location.reload() 
      
    } catch (err: any) {
      setError(err.message ?? 'Erro ao anunciar ingresso. Tente novamente.')
      setLoading(false) // Coloquei o false aqui pra ele não travar no loading se der erro
    }
  }

  async function handleDelete() {
    if (!ingresso.listingId) return
    setDeleting(true)
    setError(null)
    try {
      await ticketService.deleteListing(ingresso.listingId)
      
      // Dá o F5 na página!
      window.location.reload() 
      
    } catch (err: any) {
      setError(err.message ?? 'Erro ao remover anúncio. Tente novamente.')
      setDeleting(false) // Tira o loading do botão se der erro
      setConfirmDelete(false)
    } 
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[24px] p-6 sm:p-8 w-full max-w-sm flex flex-col gap-6 animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between w-full">
          <h3 className="font-bricolage text-[20px] sm:text-[24px] font-extrabold text-[#0A0A0A] tracking-tighter">
            {isEditing ? 'Gerenciar anúncio' : 'Vender ingresso'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F0F0EB] flex items-center justify-center hover:bg-[#E0E0D8] transition-colors"
          >
            <X size={15} weight="bold" color="#5C5C52" />
          </button>
        </div>

        <p className="font-body text-[15px] text-[#5C5C52] leading-relaxed">
          {isEditing ? 'Altere o preço ou remova seu anúncio do ' : 'Por quanto você quer anunciar seu ingresso do '}
          {isEditing
            ? <strong className="text-black">Reppy Market</strong>
            : <strong className="text-black">{ingresso.evento.nome}</strong>
          }
          {!isEditing && '?'}
        </p>

        {/* ── Input de valor ── */}
        <div className="flex flex-col gap-2">
          <label className="font-body text-[12px] font-bold text-[#9A9A8F] uppercase tracking-wider">
            Valor do anúncio
          </label>

          <div className={`flex items-center gap-2 border-b-2 transition-colors pb-2 ${
            isTooHigh ? 'border-[#FF2D2D]' : 'border-[#E0E0D8] focus-within:border-[#0A0A0A]'
          }`}>
            <span className={`font-bricolage text-[32px] font-extrabold ${isTooHigh ? 'text-[#FF2D2D]' : 'text-[#9A9A8F]'}`}>
              R$
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={displayValue}
              onChange={handleMoneyChange}
              placeholder="0,00"
              className={`w-full bg-transparent font-bricolage text-[36px] font-extrabold outline-none placeholder:text-[#E0E0D8] ${
                isTooHigh ? 'text-[#FF2D2D]' : 'text-[#0A0A0A]'
              }`}
            />
          </div>

          <div className="flex items-start justify-between mt-1 min-h-[20px]">
            {isTooHigh && precoMaximo !== null ? (
              <span className="font-body text-[12px] text-[#FF2D2D] font-bold flex items-center gap-1">
                <WarningCircle size={14} weight="bold" />
                Máximo permitido: R$ {precoMaximo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            ) : loteAtual !== null ? (
              <span className="font-body text-[12px] text-[#9A9A8F] font-medium">
                Lote atual: R$ {loteAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            ) : (
              <span />
            )}

            {isValid && (
              <span className="font-body text-[12px] text-[#1BFF11] font-bold">
                Você recebe 100%
              </span>
            )}
          </div>
        </div>

        {error && (
          <p className="font-body text-[12px] text-[#FF2D2D] text-center -mt-2">{error}</p>
        )}

        {/* ── Botão principal ── */}
        <button
          onClick={handleSubmit}
          disabled={!isValid || loading}
          className={`flex items-center justify-center gap-2 w-full font-bricolage text-[16px] font-extrabold uppercase py-4 rounded-full transition-all
            ${isValid && !loading
              ? 'bg-[#1BFF11] text-[#0A0A0A] hover:opacity-90 shadow-[4px_4px_0px_#0A0A0A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none cursor-pointer'
              : 'bg-[#F0F0EB] text-[#9A9A8F] cursor-not-allowed'}
          `}
        >
          <Tag size={20} weight="bold" />
          {loading
            ? isEditing ? 'Salvando...' : 'Anunciando...'
            : isEditing ? 'Salvar alterações' : 'Anunciar ingresso'
          }
        </button>

        {/* ── Remover anúncio (só no modo edição) ── */}
        {isEditing && (
          <>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center justify-center gap-2 w-full font-body text-[13px] font-semibold text-[#FF2D2D] py-2 hover:opacity-70 transition-opacity cursor-pointer"
              >
                <Trash size={15} weight="bold" />
                Remover anúncio
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="font-body text-[12px] text-[#5C5C52] text-center">
                  Tem certeza? Seu ingresso sai do Reppy Market.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 py-2.5 rounded-full border border-[#E0E0D8] font-body text-[13px] font-semibold text-[#5C5C52] hover:border-[#0A0A0A] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 py-2.5 rounded-full bg-[#FF2D2D] font-body text-[13px] font-semibold text-white hover:opacity-90 transition-opacity"
                  >
                    {deleting ? 'Removendo...' : 'Confirmar'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}