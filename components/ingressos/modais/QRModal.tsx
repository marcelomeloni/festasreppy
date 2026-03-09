'use client'

import { useEffect, useRef, useState } from 'react'
import { X, DownloadSimple } from '@phosphor-icons/react'
import QRCodeStyling from 'qr-code-styling'
import { MyTicket, myTicketsService } from '@/services/myTicketsService'

interface QRModalProps {
  ingresso: MyTicket
  onClose: () => void
}

const isMobile = () =>
  typeof navigator !== 'undefined' &&
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

// A4 a 96dpi: 794 × 1123px
const A4_WIDTH_PX  = 794
const A4_HEIGHT_PX = 1123

export default function QRModal({ ingresso, onClose }: QRModalProps) {
  const qrRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!qrRef.current || !ingresso.qrCode) return

    const qr = new QRCodeStyling({
      width: 192,
      height: 192,
      type: 'svg',
      data: ingresso.qrCode,
      dotsOptions: { color: '#0A0A0A', type: 'rounded' },
      cornersSquareOptions: { type: 'extra-rounded', color: '#0A0A0A' },
      cornersDotOptions: { type: 'dot', color: '#1BFF11' },
      backgroundOptions: { color: '#FFFFFF' },
      qrOptions: { errorCorrectionLevel: 'H' },
    })

    qrRef.current.innerHTML = ''
    qr.append(qrRef.current)
  }, [ingresso.qrCode])

  async function handleDownload() {
    try {
      setDownloading(true)
      setError(null)

      const response = await myTicketsService.fetchTicketHTML(ingresso.id)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const html = await response.text()

      const pdfBlob = await generatePDF(html)
      const fileName = `ingresso-${ingresso.qrCode}.pdf`

      if (isMobile() && typeof navigator.share === 'function') {
        const file = new File([pdfBlob], fileName, { type: 'application/pdf' })
        if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ files: [file], title: `Ingresso — ${ingresso.evento.nome}` })
            return
          } catch (e) {
            if (e instanceof Error && e.name === 'AbortError') return
          }
        }
      }

      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('handleDownload:', err)
      setError('Não foi possível gerar o PDF. Tente novamente.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[24px] p-6 w-full max-w-sm flex flex-col items-center gap-5 animate-in zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between w-full gap-3">
          <div className="min-w-0">
            <p className="font-bricolage text-[17px] font-extrabold text-[#0A0A0A] leading-tight truncate">
              {ingresso.evento.nome}
            </p>
            <p className="font-body text-[12px] text-[#9A9A8F] mt-0.5">
              {ingresso.evento.data} · {ingresso.evento.hora}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 w-8 h-8 rounded-full bg-[#F0F0EB] flex items-center justify-center hover:bg-[#E0E0D8] transition-colors"
          >
            <X size={15} weight="bold" color="#5C5C52" />
          </button>
        </div>

        <div className="w-52 h-52 bg-white rounded-[20px] border border-[#E0E0D8] flex items-center justify-center p-3 shadow-sm">
          <div ref={qrRef} />
        </div>

        <p className="font-body text-[11px] font-bold text-[#9A9A8F] tracking-[0.14em] uppercase">
          {ingresso.qrCode}
        </p>

        <p className="font-body text-[11px] text-[#9A9A8F] text-center leading-relaxed px-4 -mt-2">
          Apresente este QR Code na portaria.
        </p>

        {error && (
          <p className="font-body text-[12px] text-red-500 text-center">{error}</p>
        )}

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center justify-center gap-2 w-full bg-[#0A0A0A] text-white font-bricolage text-[16px] font-extrabold uppercase py-3.5 rounded-full hover:opacity-80 transition-opacity mt-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <DownloadSimple size={18} weight="bold" />
          {downloading ? 'Gerando PDF...' : 'Baixar Ingresso'}
        </button>
      </div>
    </div>
  )
}

async function generatePDF(html: string): Promise<Blob> {
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ])

  const container = document.createElement('div')
  container.style.cssText = [
    'position:fixed',
    'top:-99999px',
    'left:-99999px',
    `width:${A4_WIDTH_PX}px`,
    `height:${A4_HEIGHT_PX}px`,
    'background:#0A0A0A',
    'overflow:hidden',
  ].join(';')
  container.innerHTML = html
  document.body.appendChild(container)

  await document.fonts.ready
  await new Promise(r => setTimeout(r, 1500))

  const canvas = await html2canvas(container, {
    scale: 2,
    useCORS: true,
    allowTaint: false,
    backgroundColor: '#0A0A0A',
    logging: false,
    windowWidth: A4_WIDTH_PX,
    windowHeight: A4_HEIGHT_PX,
    width: A4_WIDTH_PX,
    height: A4_HEIGHT_PX,
  })

  document.body.removeChild(container)

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pageW, pageH)

  return pdf.output('blob')
}