'use client'

import { useState } from 'react'
import { X, WarningCircle, Receipt, CheckCircle, ClockCounterClockwise } from '@phosphor-icons/react'
import { ticketService } from '@/services/ticketService'

function formatBRL(value) {
  return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function RefundModal({ ingresso, onClose }) {
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // O reembolso é por PEDIDO: o valor é a soma total do pedido, não de um
  // ingresso individual.
  const valorTotal = ingresso.orderTotal > 0 ? ingresso.orderTotal : ingresso.ticketPrice
  const refundStatus = ingresso.refundStatus

  function getRefundable() {
    return valorTotal > 0 && !['pending', 'refunding', 'completed'].includes(refundStatus)
  }

  function getInitialView() {
    if (refundStatus === 'pending' || refundStatus === 'refunding') return 'pending'
    if (refundStatus === 'completed') return 'completed'
    return 'form'
  }

  const [view, setView] = useState(getInitialView())

  async function requestRefund() {
    setSubmitting(true)
    setError('')
    try {
      await ticketService.refund(ingresso.id, reason.trim() || undefined)
      setView('done')
    } catch (e) {
      if (e?.code === 'conflict' || (e?.message || '').includes('pendente')) {
        setView('pending')
      } else {
        setError(e?.message || 'Não foi possível solicitar o reembolso. Tente novamente.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  function close() {
    if (!submitting) onClose()
  }

  let content

  if (view === 'pending') {
    content = (
      <>
        <div className="bg-[#FFF7E0] border border-[#F0B429]/40 rounded-[16px] p-4 flex items-start gap-3">
          <ClockCounterClockwise size={22} weight="fill" className="text-[#B98A00] shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <p className="font-body text-[13px] font-bold text-[#8a6500]">
              Reembolso em análise
            </p>
            <p className="font-body text-[13px] text-[#8a6500]/80 leading-relaxed">
              Já existe uma solicitação de <strong>{formatBRL(valorTotal)}</strong> do seu pedido
              esperando a aprovação do organizador. Você será avisado por e-mail quando for aprovado ou recusado.
            </p>
          </div>
        </div>
        <button onClick={onClose} className="w-full bg-[#0A0A0A] text-white font-bricolage text-[16px] font-extrabold uppercase py-3.5 rounded-full hover:opacity-90 transition-opacity">
          Entendi
        </button>
      </>
    )
  } else if (view === 'completed') {
    content = (
      <>
        <div className="bg-[#e9ffe5] border border-[#1BFF11]/40 rounded-[16px] p-4 flex items-start gap-3">
          <CheckCircle size={22} weight="fill" className="text-[#0f8f08] shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <p className="font-body text-[13px] font-bold text-[#0f8f08]">
              Reembolso aprovado
            </p>
            <p className="font-body text-[13px] text-[#0f8f08]/80 leading-relaxed">
              {formatBRL(valorTotal)} voltando para o Pix usado na compra.
              O prazo do banco pode levar até 10 dias úteis.
            </p>
          </div>
        </div>
        <button onClick={onClose} className="w-full bg-[#0A0A0A] text-white font-bricolage text-[16px] font-extrabold uppercase py-3.5 rounded-full hover:opacity-90 transition-opacity">
          Entendi
        </button>
      </>
    )
  } else if (view === 'done') {
    content = (
      <>
        <div className="bg-[#FFF7E0] border border-[#F0B429]/40 rounded-[16px] p-4 flex items-start gap-3">
          <Receipt size={22} weight="fill" className="text-[#B98A00] shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <p className="font-body text-[13px] font-bold text-[#8a6500]">
              Solicitação enviada
            </p>
            <p className="font-body text-[13px] text-[#8a6500]/80 leading-relaxed">
              Seu pedido de <strong>{formatBRL(valorTotal)}</strong> foi registrado e está esperando a
              aprovação do organizador. Você recebe um e-mail assim que for aprovado ou recusado.
            </p>
          </div>
        </div>
        <button onClick={onClose} className="w-full bg-[#0A0A0A] text-white font-bricolage text-[16px] font-extrabold uppercase py-3.5 rounded-full hover:opacity-90 transition-opacity">
          Entendi
        </button>
      </>
    )
  } else if (refundStatus === 'rejected' && !submitted) {
    content = (
      <>
        <div className="bg-[#ffe5e5] border border-[#FF2D2D]/30 rounded-[16px] p-4 flex items-start gap-3">
          <WarningCircle size={22} weight="fill" className="text-[#FF2D2D] shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <p className="font-body text-[13px] font-bold text-[#FF2D2D]">
              Solicitação recusada
            </p>
            <p className="font-body text-[13px] text-[#FF2D2D]/80 leading-relaxed">
              O organizador recusou o reembolso. Se quiser, você pode enviar uma nova solicitação.
            </p>
          </div>
        </div>
        <button
          onClick={() => { setSubmitted(false); setView('form') }}
          className="w-full bg-[#FF2D2D] text-white font-bricolage text-[16px] font-extrabold uppercase py-3.5 rounded-full hover:bg-red-600 transition-colors"
        >
          Solicitar novamente
        </button>
      </>
    )
  } else {
    content = (
      <>
        <p className="font-body text-[14px] text-[#5C5C52] leading-relaxed">
          Tem certeza que deseja solicitar o reembolso do seu pedido de{' '}
          <strong className="text-black">{formatBRL(valorTotal)}</strong> para{' '}
          <strong className="text-black">{ingresso.evento.nome}</strong>?
        </p>

        <div className="bg-[#ffe5e5] border border-[#FF2D2D]/30 rounded-[16px] p-4 flex items-start gap-3">
          <WarningCircle size={20} weight="fill" className="text-[#FF2D2D] shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <p className="font-body text-[13px] font-bold text-[#FF2D2D]">
              Análise do Organizador
            </p>
            <p className="font-body text-[13px] text-[#FF2D2D]/80 leading-relaxed">
              O pedido inteiro é reembolsado no Pix usado na compra após a aprovação.
              O valor pode levar até 10 dias úteis para voltar, pelo prazo do banco.
            </p>
          </div>
        </div>

        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Motivo (opcional)"
          rows={3}
          maxLength={500}
          className="w-full font-body text-[14px] text-[#0A0A0A] bg-[#F7F7F2] border border-[#E0E0D8] rounded-[16px] px-4 py-3 outline-none focus:border-[#0A0A0A] resize-none placeholder:text-[#9A9A8F]"
        />

        {error && (
          <p className="font-body text-[13px] text-[#FF2D2D] text-center">{error}</p>
        )}

        <button
          onClick={requestRefund}
          disabled={submitting}
          className="flex items-center justify-center gap-2 w-full bg-[#FF2D2D] text-white font-bricolage text-[16px] font-extrabold uppercase py-3.5 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Receipt size={18} weight="bold" />
          {submitting ? 'Enviando…' : 'Solicitar Reembolso'}
        </button>
      </>
    )
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={close}
    >
      <div
        className="bg-white rounded-[24px] p-6 w-full max-w-sm flex flex-col gap-5 animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between w-full">
          <h3 className="font-bricolage text-[20px] font-extrabold text-[#0A0A0A]">Reembolso</h3>
          <button onClick={close} disabled={submitting} className="w-8 h-8 rounded-full bg-[#F0F0EB] flex items-center justify-center hover:bg-[#E0E0D8] transition-colors disabled:opacity-50">
            <X size={15} weight="bold" color="#5C5C52" />
          </button>
        </div>

        {content}
      </div>
    </div>
  )
}