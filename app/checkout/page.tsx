"use client"

import { useState, useMemo, useEffect, useRef, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { LockSimple, SealCheck, ArrowCounterClockwise } from "@phosphor-icons/react"

import EventSummary from "@/components/checkout/EventSummary"
import BuyerForm, { validateCPF } from "@/components/checkout/BuyerForm"
import OrderSummary from "@/components/checkout/OrderSummary"
import PixPayment from "@/components/checkout/PixPayment"
import CheckoutSubmitButton from "@/components/checkout/CheckoutSubmitButton"
import PaymentSuccessScreen from "@/components/checkout/PaymentSuccessScreen"

import { decodeCart, checkoutService, CartPayload } from "@/services/checkoutService"
import { ApiError } from "@/services/apiService"
import { useAuth } from "@/contexts/AuthContext"

interface FormData {
  nome:  string
  email: string
  cpf:   string
}

type FormTouched = Record<keyof FormData, boolean>
type FormErrors  = Partial<Record<keyof FormData, string>>

type CheckoutStep = "form" | "pix" | "expired" | "confirmed" | "paid"

const emailRe        = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const POLL_INTERVAL_MS = 3000

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {}
  if (!data.nome.trim() || data.nome.trim().split(" ").length < 2)
    errors.nome = "Informe seu nome completo"
  if (!data.email.trim())
    errors.email = "Informe seu e-mail"
  else if (!emailRe.test(data.email))
    errors.email = "E-mail inválido"
  if (!data.cpf.trim())
    errors.cpf = "Informe seu CPF"
  else if (!validateCPF(data.cpf))
    errors.cpf = "CPF inválido"
  return errors
}

const TRUST_BADGES = [
  { icon: LockSimple,          text: "Criptografado TLS"   },
  { icon: SealCheck,           text: "Compra garantida"    },
  { icon: ArrowCounterClockwise, text: "Política de reembolso" },
]

function cartToEventSummary(cart: CartPayload) {
  return {
    title:     cart.eventTitle,
    date:      cart.eventDate,
    time:      cart.eventTime,
    venue:     cart.eventVenue,
    organizer: cart.eventOrganizer,
  }
}

function cartToOrderSummaryBase(cart: CartPayload) {
  return {
    items: cart.items.map(i => ({
      id:       i.lotId,
      name:     i.lotTitle,
      quantity: i.qty,
      price:    Math.round(i.finalPrice * 100),
    })),
    subtotal:   Math.round(cart.subtotal  * 100),
    totalFees:  Math.round(cart.totalFee  * 100),
    total:      Math.round(cart.grandTotal * 100),
    discount:   0,
  }
}

function CheckoutContent() {
  const router = useRouter()
  const params = useSearchParams()
  const { user } = useAuth()

  const cart = useMemo<CartPayload | null>(() => {
    const raw = params.get("cart")
    return raw ? decodeCart(raw) : null
  }, [params])

  const isFree   = (cart?.grandTotal ?? 0) === 0
  const isLogged = !!user

  const [formData, setFormData] = useState<FormData>({
    nome:  user?.user_metadata?.full_name ?? "",
    email: user?.email ?? "",
    cpf:   "",
  })
  const [touched, setTouched] = useState<FormTouched>({ nome: false, email: false, cpf: false })
  const [loading, setLoading]               = useState(false)
  const [step, setStep]                     = useState<CheckoutStep>("form")
  const [pixData, setPixData]               = useState<{ code: string } | null>(null)
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null)
  const [appliedCoupon, setAppliedCoupon]   = useState<string | null>(null)
  const [discount, setDiscount]             = useState(0)          // ← em centavos
  const [confirmedEmail, setConfirmedEmail] = useState<string | null>(null)
  const [serverCPFError, setServerCPFError]     = useState<string | null>(null)
  const [serverEmailError, setServerEmailError] = useState<string | null>(null)

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (step !== "pix" || !currentOrderId) return

    pollingRef.current = setInterval(async () => {
      try {
        const { status } = await checkoutService.checkPixStatus(currentOrderId)
        if (status === "PAID") {
          clearInterval(pollingRef.current!)
          setStep("paid")
        } else if (status === "EXPIRED" || status === "CANCELLED") {
          clearInterval(pollingRef.current!)
          setStep("expired")
        }
      } catch {
        // Ignored intentionally for retry logic
      }
    }, POLL_INTERVAL_MS)

    return () => { if (pollingRef.current) clearInterval(pollingRef.current) }
  }, [step, currentOrderId])

  // ── orderSummary recalcula quando o desconto muda ─────────────────────────
  const orderSummary = useMemo(() => {
    if (!cart) return null
    const base = cartToOrderSummaryBase(cart)
    return {
      ...base,
      discount,
      total: Math.max(0, base.total - discount),
    }
  }, [cart, discount])

  const errors      = validate(formData)
  const isFormValid = Object.keys(errors).length === 0

  const handleChange = (field: keyof FormData, value: string) => {
    if (field === "cpf")   setServerCPFError(null)
    if (field === "email") setServerEmailError(null)
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleBlur = (field: keyof FormData) =>
    setTouched(prev => ({ ...prev, [field]: true }))

  async function handleCouponApply(code: string) {
    if (!cart) return { valid: false, message: "Carrinho inválido." }
    const result = await checkoutService.validateCoupon(cart.eventId, code)
    if (result.valid) {
      setAppliedCoupon(code)
      const subtotalCents = Math.round(cart.subtotal * 100)
      const d = result.discountType === "percentage"
        ? Math.round(subtotalCents * ((result.discountValue ?? 0) / 100))
        : Math.round((result.discountValue ?? 0) * 100)
      setDiscount(d)
    }
    return result
  }

  function handleCouponRemove() {
    setDiscount(0)
    setAppliedCoupon(null)
  }

  const handleSubmit = async () => {
    setTouched({ nome: true, email: true, cpf: true })
    if (!isFormValid || !cart) return

    setLoading(true)
    try {
      const order = await checkoutService.createOrder({
        eventId:    cart.eventId,
        couponCode: appliedCoupon ?? undefined,
        items:      cart.items.map(i => ({ lotId: i.lotId, qty: i.qty })),
        buyerName:  formData.nome,
        buyerEmail: formData.email,
        buyerCPF:   formData.cpf,
      })

      if (isFree) {
        if (isLogged) {
          router.push("/meus-ingressos")
        } else {
          setConfirmedEmail(order.confirmationEmail ?? formData.email)
          setStep("confirmed")
        }
        return
      }

      if (order.pixCode) {
        setCurrentOrderId(order.orderId)
        setPixData({ code: order.pixCode })
        setStep("pix")
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        if (err.code === "cpf_already_exists") {
          setServerCPFError(err.message)
        } else if (err.code === "email_already_exists") {
          setServerEmailError(err.message)
        } else {
          setServerCPFError("Erro ao processar pedido. Tente novamente.")
        }
      } else {
        setServerCPFError("Erro ao processar pedido. Tente novamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleExpired = () => {
    if (pollingRef.current) clearInterval(pollingRef.current)
    setStep("expired")
  }

  const handleReset = () => {
    if (pollingRef.current) clearInterval(pollingRef.current)
    setStep("form")
    setPixData(null)
    setCurrentOrderId(null)
    setServerCPFError(null)
    setServerEmailError(null)
    setTouched({ nome: false, email: false, cpf: false })
  }

  if (!cart || !orderSummary) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-[20px] font-extrabold text-black mb-2">
            Carrinho inválido.
          </p>
          <button onClick={() => router.back()} className="font-body text-sm text-gray-400 underline">
            Voltar
          </button>
        </div>
      </div>
    )
  }

  const displayErrors: FormErrors = {
    ...errors,
    cpf:   serverCPFError   ?? (touched.cpf   ? errors.cpf   : undefined),
    email: serverEmailError ?? (touched.email ? errors.email : undefined),
  }

  const displayTouched: FormTouched = {
    ...touched,
    cpf:   touched.cpf   || !!serverCPFError,
    email: touched.email || !!serverEmailError,
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {step !== "paid" && (
        <div className="mb-6 animate-fadeUp">
          <p className="text-xs font-display font-bold tracking-widest uppercase mb-1 text-gray-400">
            Finalizar compra
          </p>
          <h1 className="text-[32px] font-display font-extrabold leading-tight text-black">
            Seu ingresso está<br />
            <span className="text-primary">quase confirmado</span>
          </h1>
        </div>
      )}

      <div className="flex flex-col gap-4">

        {step === "paid" && (
          <PaymentSuccessScreen
            cart={cart}
            isLogged={isLogged}
            buyerEmail={formData.email}
            onGoToTickets={() => router.push(isLogged ? "/meus-ingressos" : "/login")}
            onGoToEvent={() => router.push(`/${cart.eventSlug}`)}
          />
        )}

        {(step === "form" || step === "pix") && (
          <div className="animate-fadeUp" style={{ animationDelay: "0.05s" }}>
            <EventSummary event={cartToEventSummary(cart)} />
          </div>
        )}

        {step === "confirmed" && confirmedEmail && (
          <div className="rounded-card-md border border-gray-200 bg-white p-8 text-center animate-fadeUp">
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mx-auto mb-4">
              <SealCheck size={24} weight="fill" className="text-primary" />
            </div>
            <p className="font-display text-[26px] font-extrabold text-black mb-2 leading-tight">
              Ingresso confirmado 🎉
            </p>
            <p className="font-body text-sm text-gray-600 mb-1">
              Enviamos seu ingresso para
            </p>
            <p className="font-body text-[15px] font-semibold text-black mb-6">
              {confirmedEmail}
            </p>
            <div className="rounded-[12px] px-4 py-3 text-left mb-2" style={{ background: "#F0F0EB" }}>
              <p className="font-body text-[12px] text-gray-600 leading-relaxed">
                Quer acessar seus ingressos pelo app e aproveitar tudo que a Reppy tem a oferecer?{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="font-semibold text-black underline"
                >
                  Crie sua conta ou faça login
                </button>
                {" "}— seu ingresso já vai estar lá.
              </p>
            </div>
          </div>
        )}

        {step === "expired" && (
          <div className="rounded-card-md border border-red p-6 text-center bg-red/5 animate-fadeUp">
            <p className="text-[28px] font-display font-extrabold mb-1 text-black">
              Código expirado
            </p>
            <p className="text-sm mb-5 text-gray-600">
              O tempo para pagamento acabou. Nenhum valor foi cobrado.
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-pill text-sm font-display font-bold bg-black text-white hover:bg-black/90 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {(step === "form" || step === "pix") && (
          <div className="flex flex-col gap-4 animate-fadeUp" style={{ animationDelay: "0.1s" }}>
            <div style={{
              opacity:       step === "pix" ? 0.6 : 1,
              pointerEvents: step === "pix" ? "none" : "auto",
              transition:    "opacity 0.3s",
            }}>
              <BuyerForm
                data={formData}
                onChange={handleChange}
                errors={displayErrors}
                touched={displayTouched}
                onBlur={handleBlur}
              />
            </div>

            <OrderSummary
              cart={orderSummary}
              onCouponApply={handleCouponApply}
              onCouponRemove={handleCouponRemove}
            />

            {step === "form" && (
              <CheckoutSubmitButton
                loading={loading}
                disabled={!isFormValid && Object.values(touched).some(Boolean)}
                total={orderSummary.total}
                isFree={isFree}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        )}

        {step === "pix" && pixData && (
          <div className="animate-fadeUp">
            <PixPayment
              pixData={pixData}
              onExpire={handleExpired}
              isVisible
            />
          </div>
        )}

        {step !== "confirmed" && step !== "paid" && (
          <div
            className="flex items-center justify-center gap-4 py-4 flex-wrap animate-fadeUp"
            style={{ animationDelay: "0.15s" }}
          >
            {TRUST_BADGES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-xs text-gray-400 font-body">
                <Icon size={14} weight="bold" />
                {text}
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-off-white font-body">
      <Suspense fallback={
        <div className="min-h-screen bg-off-white flex items-center justify-center">
          Carregando...
        </div>
      }>
        <CheckoutContent />
      </Suspense>
    </div>
  )
}