'use client'

import { useRef, useState } from 'react'
import { X, UploadSimple, Image, Trash } from '@phosphor-icons/react'

export default function AvatarUploadModal({ currentUrl, nome, onClose, onSave }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(currentUrl || null)
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [hovering, setHovering] = useState(false)

  // Controle para saber se houve alteração em relação ao estado inicial
  const hasChanged = file !== null || preview !== currentUrl

  function handleFile(f) {
    if (!f || !f.type.startsWith('image/')) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  function handleRemove(e) {
    e.stopPropagation()
    setPreview(null)
    setFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  // Permite salvar se o usuário escolheu um arquivo novo OU se ele removeu a foto que existia antes
  const canSave = hasChanged

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(10,10,10,0.52)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm bg-white rounded-[24px] p-6 flex flex-col gap-5"
        style={{ boxShadow: '0 32px 80px rgba(10,10,10,0.22)', animation: 'slideUp .25s cubic-bezier(.22,1,.36,1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-bricolage text-[20px] font-extrabold text-[#0A0A0A] leading-none">
            Foto de perfil
          </h2>
          <button
            onClick={onClose}
            className="size-8 rounded-full bg-[#F0F0EB] flex items-center justify-center hover:bg-[#E0E0D8] transition-colors"
          >
            <X size={14} weight="bold" className="text-[#5C5C52]" />
          </button>
        </div>

        {/* Drop zone */}
        <div
          onClick={() => !preview && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          className="relative w-full aspect-[4/5] flex flex-col items-center justify-center rounded-[16px] overflow-hidden transition-all select-none"
          style={{
            cursor: preview ? 'default' : 'pointer',
            background: dragging ? '#F0FFF0' : preview ? '#000' : hovering ? '#F0F0EB' : '#F7F7F2',
            border: dragging
              ? '2px dashed #1BFF11'
              : preview
                ? '1.5px solid #E0E0D8'
                : hovering
                  ? '2px dashed #9A9A8F'
                  : '2px dashed #E0E0D8',
          }}
        >
          {preview ? (
            <>
              <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-[.88]" />
              <div
                className="absolute inset-0 flex items-center justify-center gap-3 transition-opacity"
                style={{ background: 'rgba(0,0,0,0.38)', opacity: hovering ? 1 : 0, pointerEvents: hovering ? 'auto' : 'none' }}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] bg-white text-[12px] font-bold text-[#0A0A0A] hover:bg-[#F0F0EB] transition-colors"
                >
                  <Image size={13} weight="bold" /> Trocar
                </button>
                <button
                  onClick={handleRemove}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] bg-[#FF2D2D] text-[12px] font-bold text-white hover:bg-[#e02020] transition-colors"
                >
                  <Trash size={13} weight="bold" /> Remover
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div
                className="size-12 rounded-full flex items-center justify-center transition-colors"
                style={{ background: dragging ? 'rgba(27,255,17,0.15)' : '#E0E0D8', color: dragging ? '#0FD40A' : '#9A9A8F' }}
              >
                <UploadSimple size={22} weight="bold" />
              </div>
              <span className="font-body text-[13px] font-semibold" style={{ color: dragging ? '#0FD40A' : '#5C5C52' }}>
                {dragging ? 'Solte para adicionar' : 'Clique ou arraste uma foto'}
              </span>
              <span className="font-body text-[11px] text-[#9A9A8F]">JPG, PNG ou WEBP · máx. 5 MB</span>
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => { 
              // Agora a gente só chama o onClose lá dentro do AccountHero, para podermos manter o modal aberto enquanto faz o loading visual.
              onSave?.({ file, previewUrl: preview }) 
            }}
            disabled={!canSave}
            className="w-full py-3.5 rounded-[14px] font-body text-[14px] font-bold transition-all"
            style={{
              background: canSave ? '#0A0A0A' : '#E0E0D8',
              color: canSave ? '#1BFF11' : '#9A9A8F',
              cursor: canSave ? 'pointer' : 'not-allowed',
            }}
          >
            Salvar alteração
          </button>
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-[14px] font-body text-[14px] font-semibold text-[#0A0A0A] bg-[#F0F0EB] hover:bg-[#E0E0D8] transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(32px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}