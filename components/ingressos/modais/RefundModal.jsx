'use client'

import { X, WarningCircle, Receipt } from '@phosphor-icons/react'

export default function RefundModal({ ingresso, onClose }) {
  const isRefundable = true;
  const valorIngresso = 40.00; 

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
          <h3 className="font-bricolage text-[20px] font-extrabold text-[#0A0A0A]">Reembolso</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F0F0EB] flex items-center justify-center hover:bg-[#E0E0D8] transition-colors">
            <X size={15} weight="bold" color="#5C5C52" />
          </button>
        </div>
        
        {isRefundable ? (
          <>
            <p className="font-body text-[14px] text-[#5C5C52] leading-relaxed">
              Tem certeza que deseja solicitar o reembolso do seu ingresso para <strong className="text-black">{ingresso.evento.nome}</strong>?
            </p>

            <div className="bg-[#ffe5e5] border border-[#FF2D2D]/30 rounded-[16px] p-4 flex items-start gap-3">
              <WarningCircle size={20} weight="fill" className="text-[#FF2D2D] shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <p className="font-body text-[13px] font-bold text-[#FF2D2D]">
                  Análise do Organizador
                </p>
                <p className="font-body text-[13px] text-[#FF2D2D]/80 leading-relaxed">
                  O pedido vai para análise. Compras feitas há menos de 7 dias são estornadas em até 48h.
                </p>
              </div>
            </div>

            <button className="flex items-center justify-center gap-2 w-full bg-[#FF2D2D] text-white font-bricolage text-[16px] font-extrabold uppercase py-3.5 rounded-full hover:bg-red-600 transition-colors mt-2">
              <Receipt size={18} weight="bold" />
              Solicitar Reembolso
            </button>
          </>
        ) : (
          <>
             <div className="bg-[#F0F0EB] rounded-[16px] p-4 flex flex-col items-center text-center gap-2">
                <WarningCircle size={32} className="text-[#9A9A8F]" />
                <p className="font-body text-[14px] font-bold text-[#0A0A0A]">
                  Fora do prazo
                </p>
                <p className="font-body text-[13px] text-[#5C5C52]">
                  O prazo para reembolso deste ingresso expirou. Mas você ainda pode transferi-lo ou vendê-lo no Reppy Market!
                </p>
             </div>
             <button onClick={onClose} className="w-full bg-[#0A0A0A] text-white font-bricolage text-[16px] font-extrabold uppercase py-3.5 rounded-full hover:opacity-90 transition-opacity mt-2">
              Entendi
            </button>
          </>
        )}
      </div>
    </div>
  )
}