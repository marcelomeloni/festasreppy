'use client'

import { useState, useEffect } from 'react'
import {
  CurrencyCircleDollar,
  CheckCircle,
  WarningCircle,
  SpinnerGap,
  Tag,
  Clock,
  LockSimple,
} from '@phosphor-icons/react'
import { userService, type UpdatePixKeyPayload } from '@/services/userService'
import { marketSellerService, type MySaleItem, type SalesSummary } from '@/services/marketSellerService'

const PIX_KEY_TYPES = [
  { value: 'cpf',    label: 'CPF',             placeholder: '000.000.000-00' },
  { value: 'email',  label: 'E-mail',           placeholder: 'seu@email.com' },
  { value: 'phone',  label: 'Telefone',         placeholder: '(11) 99999-9999' },
  { value: 'random', label: 'Chave aleatória',  placeholder: 'Cole sua chave aleatória' },
]

const ESCROW_LABEL: Record<string, string> = {
  pending:  'Aguardando',
  held:     'Liberado',
  released: 'Sacado',
  cancelled:'Cancelado',
  refunded: 'Reembolsado',
}

const ESCROW_COLOR: Record<string, string> = {
  pending:  'text-yellow-600 bg-yellow-50 border-yellow-200',
  held:     'text-blue-600 bg-blue-50 border-blue-200',
  released: 'text-green-600 bg-green-50 border-green-200',
  cancelled:'text-gray-500 bg-gray-50 border-gray-200',
  refunded: 'text-red-600 bg-red-50 border-red-200',
}

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const formatDate = (iso: string) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

interface AccountPixKeyProps {
  userId:         string
  initialPixKey:  string
  initialKeyType: string
  onSaved:        (payload: UpdatePixKeyPayload) => void
}

export default function AccountPixKey({
  userId,
  initialPixKey,
  initialKeyType,
  onSaved,
}: AccountPixKeyProps) {
  const [pixKey,     setPixKey]     = useState(initialPixKey ?? '')
  const [pixKeyType, setPixKeyType] = useState(initialKeyType || 'cpf')
  const [saving,     setSaving]     = useState(false)
  const [pixError,   setPixError]   = useState<string | null>(null)
  const [pixSuccess, setPixSuccess] = useState(false)

  const [sales,         setSales]         = useState<MySaleItem[]>([])
  const [summary,       setSummary]       = useState<SalesSummary | null>(null)
  const [salesLoading,  setSalesLoading]  = useState(true)
  
  const [withdrawing,     setWithdrawing]     = useState(false)
  const [withdrawError,   setWithdrawError]   = useState<string | null>(null)
  const [withdrawSuccess, setWithdrawSuccess] = useState(false)

  const selectedType = PIX_KEY_TYPES.find((t) => t.value === pixKeyType)

  useEffect(() => {
    fetchSales()
  }, [])

  async function fetchSales() {
    try {
      const res = await marketSellerService.getMySales()
      setSales(res.sales)
      setSummary(res.summary)
    } catch {
      setSales([])
      setSummary(null)
    } finally {
      setSalesLoading(false)
    }
  }

  async function handleSavePixKey() {
    if (!pixKey.trim()) return
    setSaving(true)
    setPixError(null)
    setPixSuccess(false)
    try {
      await userService.updatePixKey(userId, { pixKey: pixKey.trim(), pixKeyType })
      onSaved({ pixKey: pixKey.trim(), pixKeyType })
      setPixSuccess(true)
      setTimeout(() => setPixSuccess(false), 3000)
    } catch (err: unknown) {
      setPixError(err instanceof Error ? err.message : 'Erro ao salvar chave PIX.')
    } finally {
      setSaving(false)
    }
  }

  async function handleWithdraw() {
    setWithdrawing(true)
    setWithdrawError(null)
    setWithdrawSuccess(false)
    try {
      await marketSellerService.withdraw()
      setWithdrawSuccess(true)
      await fetchSales()
      setTimeout(() => setWithdrawSuccess(false), 5000)
    } catch (err: unknown) {
      setWithdrawError(err instanceof Error ? err.message : 'Erro ao processar saque.')
    } finally {
      setWithdrawing(false)
    }
  }

  const hasSales = sales.length > 0

  return (
    <section className="bg-white rounded-[20px] border-[1.5px] border-[#E0E0D8] p-6 flex flex-col gap-6">

      <div>
        <div className="flex items-center gap-2 mb-1">
          <CurrencyCircleDollar size={16} weight="bold" className="text-primary-dark" />
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A9A8F]">
            Reppy Market
          </p>
        </div>
        <p className="font-body text-[13px] text-[#5C5C52]">
          Gerencie suas vendas e configure sua chave PIX para saque.
        </p>
      </div>

      {summary && (summary.totalWithdrawable > 0 || summary.totalPending > 0 || summary.totalReleased > 0) && (
        <div className="bg-[#0A0A0A] rounded-[20px] p-5 flex flex-col gap-5 shadow-lg">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="flex flex-col gap-1">
              <span className="font-body text-[11px] font-bold uppercase tracking-widest text-[#9A9A8F]">
                Disponível para saque
              </span>
              <span className="font-bricolage text-[36px] font-black text-white leading-none tracking-tight">
                {formatBRL(summary.totalWithdrawable)}
              </span>
            </div>
            {summary.totalPending > 0 && (
              <div className="flex flex-col gap-1 text-right">
                <span className="font-body text-[10px] font-bold uppercase tracking-widest text-[#5C5C52]">
                  Aguardando
                </span>
                <span className="font-bricolage text-[18px] font-bold text-[#E0E0D8] leading-none">
                  {formatBRL(summary.totalPending)}
                </span>
              </div>
            )}
          </div>

          {summary.totalWithdrawable > 0 && (
            <button
              onClick={handleWithdraw}
              disabled={withdrawing}
              className={`w-full py-3.5 rounded-full font-bricolage font-extrabold text-[15px] uppercase tracking-wide transition-all ${
                withdrawing
                  ? 'bg-white/10 text-white/50 cursor-not-allowed'
                  : 'bg-primary text-black hover:bg-primary-dark hover:scale-[1.02] shadow-[0_0_20px_rgba(27,255,17,0.3)]'
              }`}
            >
              {withdrawing ? 'Processando...' : 'Sacar Saldo Total'}
            </button>
          )}

          {withdrawSuccess && (
            <div className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1BFF11]/10 rounded-[12px] border border-[#1BFF11]/20">
              <CheckCircle size={16} weight="fill" className="text-primary-dark" />
              <span className="font-body text-[13px] font-bold text-primary-dark">
                PIX enviado com sucesso!
              </span>
            </div>
          )}

          {withdrawError && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 rounded-[12px] border border-red-500/20">
              <WarningCircle size={16} weight="fill" className="text-red-400 shrink-0" />
              <span className="font-body text-[13px] font-medium text-red-400">
                {withdrawError}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <p className="font-bricolage font-extrabold text-[13px] uppercase tracking-wide text-black">
          Suas vendas
        </p>

        {salesLoading ? (
          <div className="flex items-center justify-center py-6">
            <SpinnerGap size={24} weight="bold" className="animate-spin text-[#9A9A8F]" />
          </div>
        ) : !hasSales ? (
          <div className="flex items-center gap-3 px-4 py-4 border-2 border-dashed border-[#E0E0D8] rounded-[16px]">
            <Tag size={18} className="text-[#9A9A8F] shrink-0" />
            <p className="font-body text-[13px] text-[#9A9A8F]">
              Você ainda não vendeu nenhum ingresso no mercado.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 carousel-scroll">
            {sales.map((sale) => (
              <div
                key={sale.transactionId}
                className="border-[1.5px] border-[#E0E0D8] rounded-[16px] p-4 flex flex-col gap-3 transition-colors hover:border-[#9A9A8F]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-0.5">
                    <p className="font-bricolage font-extrabold text-[14px] text-black leading-tight">
                      {sale.eventTitle}
                    </p>
                    <p className="font-body text-[12px] text-[#5C5C52]">
                      {sale.lotTitle} · {formatDate(sale.eventDate)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                      ESCROW_COLOR[sale.escrowStatus] ?? 'text-gray-500 bg-gray-50 border-gray-200'
                    }`}
                  >
                    {ESCROW_LABEL[sale.escrowStatus] ?? sale.escrowStatus}
                  </span>
                </div>

                <div className="flex items-center justify-between font-body text-[13px]">
                  <span className="text-[#5C5C52]">Valor líquido</span>
                  <span className="font-extrabold text-black font-bricolage text-[16px] tracking-tight">
                    {formatBRL(sale.netAmount)}
                  </span>
                </div>

                {sale.escrowStatus === 'held' && !sale.canWithdraw && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#F7F7F2] rounded-[8px] mt-1">
                    <LockSimple size={12} className="text-[#9A9A8F] shrink-0" />
                    <p className="font-body text-[11px] text-[#5C5C52] leading-tight">
                      {sale.withdrawBlock}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-px bg-[#E0E0D8]" />

      <div className="flex flex-col gap-3">
        <p className="font-bricolage font-extrabold text-[13px] uppercase tracking-wide text-black">
          Chave PIX para recebimento
        </p>

        {pixError && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-[12px]">
            <WarningCircle size={14} className="text-red-500 shrink-0" />
            <p className="font-body text-[13px] text-red-600">{pixError}</p>
          </div>
        )}
        {pixSuccess && (
          <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-[12px]">
            <CheckCircle size={14} className="text-green-600 shrink-0" />
            <p className="font-body text-[13px] text-green-700">Chave PIX salva!</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {PIX_KEY_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setPixKeyType(t.value)}
              className={`px-3 py-1.5 rounded-full font-body text-[12px] font-semibold border transition-all ${
                pixKeyType === t.value
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-[#5C5C52] border-[#E0E0D8] hover:border-black'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={pixKey}
          onChange={(e) => setPixKey(e.target.value)}
          placeholder={selectedType?.placeholder ?? ''}
          className="w-full px-4 py-3 rounded-[12px] border-[1.5px] border-[#E0E0D8] font-body text-[14px] text-black placeholder:text-[#9A9A8F] focus:outline-none focus:border-black transition-colors"
        />

        <button
          onClick={handleSavePixKey}
          disabled={saving || !pixKey.trim()}
          className={`w-full py-3 rounded-full font-bricolage font-extrabold text-[14px] uppercase tracking-wide transition-all ${
            saving || !pixKey.trim()
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-transparent'
              : 'bg-white text-black border-2 border-black shadow-[3px_3px_0px_#0A0A0A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#0A0A0A]'
          }`}
        >
          {saving ? 'Salvando...' : 'Salvar chave PIX'}
        </button>

        <div className="flex items-start gap-2 mt-1">
          <Clock size={13} className="text-[#9A9A8F] shrink-0 mt-0.5" />
          <p className="font-body text-[11px] text-[#9A9A8F]">
            Saques disponíveis 48h antes do evento ou após 7 dias da venda confirmada.
          </p>
        </div>
      </div>

    </section>
  )
}