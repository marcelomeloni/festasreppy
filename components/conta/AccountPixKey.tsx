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
import { marketSellerService, type MySaleItem } from '@/services/marketSellerService'

const PIX_KEY_TYPES = [
  { value: 'cpf',    label: 'CPF',             placeholder: '000.000.000-00' },
  { value: 'email',  label: 'E-mail',           placeholder: 'seu@email.com' },
  { value: 'phone',  label: 'Telefone',         placeholder: '(11) 99999-9999' },
  { value: 'random', label: 'Chave aleatória',  placeholder: 'Cole sua chave aleatória' },
]

const ESCROW_LABEL: Record<string, string> = {
  pending:  'Aguardando pagamento',
  held:     'Pagamento recebido',
  released: 'Saque realizado',
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
  const [salesLoading,  setSalesLoading]  = useState(true)
  const [withdrawing,   setWithdrawing]   = useState<string | null>(null)
  const [withdrawError, setWithdrawError] = useState<string | null>(null)
  const [withdrawDone,  setWithdrawDone]  = useState<string | null>(null)

  const selectedType = PIX_KEY_TYPES.find((t) => t.value === pixKeyType)

  useEffect(() => {
    marketSellerService.getMySales()
      .then((res) => setSales(res.sales))
      .catch(() => setSales([]))
      .finally(() => setSalesLoading(false))
  }, [])

  async function handleSavePixKey() {
    if (!pixKey.trim()) return
    setSaving(true); setPixError(null); setPixSuccess(false)
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

  async function handleWithdraw(transactionId: string) {
    setWithdrawing(transactionId); setWithdrawError(null); setWithdrawDone(null)
    try {
      await marketSellerService.withdraw(transactionId)
      setWithdrawDone(transactionId)
      setSales((prev) =>
        prev.map((s) =>
          s.transactionId === transactionId
            ? { ...s, escrowStatus: 'released', canWithdraw: false }
            : s
        )
      )
    } catch (err: unknown) {
      setWithdrawError(err instanceof Error ? err.message : 'Erro ao sacar.')
    } finally {
      setWithdrawing(null)
    }
  }

  const hasSales = sales.length > 0

  return (
    <section className="bg-white rounded-[20px] border-[1.5px] border-[#E0E0D8] p-6 flex flex-col gap-6">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <CurrencyCircleDollar size={16} weight="bold" className="text-primary" />
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A9A8F]">
            Reppy Market
          </p>
        </div>
        <p className="font-body text-[13px] text-[#5C5C52]">
          Gerencie suas vendas e configure sua chave PIX para saque.
        </p>
      </div>

      {/* Vendas */}
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
          <>
            {withdrawError && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-[12px]">
                <WarningCircle size={14} className="text-red-500 shrink-0" />
                <p className="font-body text-[13px] text-red-600">{withdrawError}</p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {sales.map((sale) => (
                <div
                  key={sale.transactionId}
                  className="border-[1.5px] border-[#E0E0D8] rounded-[16px] p-4 flex flex-col gap-3"
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
                    <span className="text-[#5C5C52]">Você recebe</span>
                    <span className="font-extrabold text-black font-bricolage text-[18px]" style={{ letterSpacing: '-0.5px' }}>
                      {formatBRL(sale.netAmount)}
                    </span>
                  </div>

                  {sale.escrowStatus === 'held' && (
                    sale.canWithdraw ? (
                      <button
                        onClick={() => handleWithdraw(sale.transactionId)}
                        disabled={withdrawing === sale.transactionId}
                        className={`w-full py-2.5 rounded-full font-bricolage font-extrabold text-[13px] uppercase tracking-wide transition-all ${
                          withdrawing === sale.transactionId
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-primary text-black border-2 border-black shadow-[3px_3px_0px_#0A0A0A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#0A0A0A]'
                        }`}
                      >
                        {withdrawing === sale.transactionId
                          ? 'Processando...'
                          : `Sacar ${formatBRL(sale.netAmount)}`}
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-2.5 bg-[#F7F7F2] rounded-[12px]">
                        <LockSimple size={13} className="text-[#9A9A8F] shrink-0" />
                        <p className="font-body text-[12px] text-[#5C5C52]">
                          {sale.withdrawBlock}
                        </p>
                      </div>
                    )
                  )}

                  {withdrawDone === sale.transactionId && (
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-green-50 border border-green-200 rounded-[12px]">
                      <CheckCircle size={13} className="text-green-600 shrink-0" />
                      <p className="font-body text-[12px] text-green-700">Saque enviado para sua chave PIX!</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Divisor */}
      <div className="h-px bg-[#E0E0D8]" />

      {/* Chave PIX */}
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
          className={`w-full py-3 rounded-full font-bricolage font-extrabold text-[15px] uppercase tracking-wide transition-all ${
            saving || !pixKey.trim()
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-primary text-black border-2 border-black shadow-[3px_3px_0px_#0A0A0A] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#0A0A0A]'
          }`}
        >
          {saving ? 'Salvando...' : 'Salvar chave PIX'}
        </button>

        <div className="flex items-start gap-2">
          <Clock size={13} className="text-[#9A9A8F] shrink-0 mt-0.5" />
          <p className="font-body text-[11px] text-[#9A9A8F]">
            Saques disponíveis 48h antes do evento ou após 7 dias da venda confirmada.
          </p>
        </div>
      </div>

    </section>
  )
}