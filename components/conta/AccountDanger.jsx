'use client'

import { useState } from 'react'
import { SignOut, Trash, Warning, X } from '@phosphor-icons/react'

export default function AccountDanger({ onLogout, onDeleteAccount }) {
  const [showModal, setShowModal] = useState(false)

  function handleConfirmDelete() {
    setShowModal(false)
    onDeleteAccount()
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3.5 rounded-[16px] bg-white border-[1.5px] border-[#E0E0D8] hover:border-[#0A0A0A] transition-colors cursor-pointer text-left group"
        >
          <span className="size-9 rounded-[10px] bg-[#F0F0EB] flex items-center justify-center shrink-0 group-hover:bg-[#0A0A0A] transition-colors">
            <SignOut size={18} weight="bold" className="text-[#5C5C52] group-hover:text-white transition-colors" />
          </span>
          <span className="font-body text-[14px] font-semibold text-[#0A0A0A]">Sair da conta</span>
        </button>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-3 w-full px-4 py-3.5 rounded-[16px] bg-white border-[1.5px] border-[#E0E0D8] hover:border-[#FF2D2D] transition-colors cursor-pointer text-left group"
        >
          <span className="size-9 rounded-[10px] bg-[#F0F0EB] flex items-center justify-center shrink-0 group-hover:bg-[#FF2D2D] transition-colors">
            <Trash size={18} weight="bold" className="text-[#9A9A8F] group-hover:text-white transition-colors" />
          </span>
          <div className="flex flex-col">
            <span className="font-body text-[14px] font-semibold text-[#0A0A0A]">Excluir conta</span>
            <span className="font-body text-[12px] text-[#9A9A8F]">Essa ação não pode ser desfeita</span>
          </div>
        </button>
      </div>

      {/* Modal de confirmação */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(10,10,10,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-[24px] p-6 flex flex-col gap-5"
            style={{ boxShadow: '0 24px 64px rgba(10,10,10,0.18)' }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="size-11 rounded-[14px] bg-[#FF2D2D]/10 flex items-center justify-center shrink-0">
                <Warning size={22} weight="fill" className="text-[#FF2D2D]" />
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="size-8 rounded-full bg-[#F0F0EB] flex items-center justify-center hover:bg-[#E0E0D8] transition-colors"
              >
                <X size={14} weight="bold" className="text-[#5C5C52]" />
              </button>
            </div>

            {/* Copy */}
            <div>
              <h2 className="font-bricolage text-[22px] font-extrabold text-[#0A0A0A] leading-tight mb-1">
                Excluir sua conta?
              </h2>
              <p className="font-body text-[13px] text-[#5C5C52] leading-relaxed">
                Todos os seus dados, ingressos e histórico serão permanentemente removidos.
                Essa ação <span className="font-semibold text-[#0A0A0A]">não pode ser desfeita</span>.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleConfirmDelete}
                className="w-full py-3.5 rounded-[14px] font-body text-[14px] font-bold text-white transition-colors"
                style={{ background: '#FF2D2D' }}
                onMouseEnter={e => e.currentTarget.style.background = '#e02020'}
                onMouseLeave={e => e.currentTarget.style.background = '#FF2D2D'}
              >
                Sim, excluir minha conta
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3.5 rounded-[14px] font-body text-[14px] font-semibold text-[#0A0A0A] bg-[#F0F0EB] hover:bg-[#E0E0D8] transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}