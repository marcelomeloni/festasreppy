"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LockSimple, SealCheck, ArrowCounterClockwise, Tag } from "@phosphor-icons/react";

import BuyerForm, { validateCPF } from "@/components/checkout/BuyerForm";
import PixPayment from "@/components/checkout/PixPayment";

import {
  decodeMarketCart,
  marketCheckoutService,
  MarketCartPayload,
  MARKET_PLATFORM_FEE,
} from "@/services/marketCheckoutService";
import { ApiError } from "@/services/apiService";
import { useAuth } from "@/contexts/AuthContext";

interface FormData {
  nome:  string;
  email: string;
  cpf:   string;
}

type FormTouched = Record<keyof FormData, boolean>;
type FormErrors  = Partial<Record<keyof FormData, string>>;
type Step        = "form" | "pix" | "expired" | "confirmed" | "paid";

const emailRe          = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const POLL_INTERVAL_MS = 3000;

const TRUST_BADGES = [
  { icon: LockSimple,            text: "Criptografado TLS"    },
  { icon: SealCheck,             text: "Compra garantida"     },
  { icon: ArrowCounterClockwise, text: "Política de reembolso" },
];

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.nome.trim() || data.nome.trim().split(" ").length < 2)
    errors.nome = "Informe seu nome completo";
  if (!data.email.trim())
    errors.email = "Informe seu e-mail";
  else if (!emailRe.test(data.email))
    errors.email = "E-mail inválido";
  if (!data.cpf.trim())
    errors.cpf = "Informe seu CPF";
  else if (!validateCPF(data.cpf))
    errors.cpf = "CPF inválido";
  return errors;
}

function MarketOrderSummary({ cart }: { cart: MarketCartPayload }) {
  return (
    <div className="rounded-[20px] border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-[13px] font-bold text-primary shrink-0">
          2
        </div>
        <h3 className="font-bricolage text-[16px] font-bold text-black">
          Resumo do pedido
        </h3>
      </div>

      <div className="flex items-start justify-between gap-4 p-4 rounded-[14px] bg-gray-100 border border-gray-200 mb-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg shrink-0">
            <Tag size={14} weight="bold" className="text-black" />
          </span>
          <div>
            <p className="font-bricolage font-extrabold text-black text-[14px] uppercase leading-tight">
              {cart.lotTitle}
            </p>
            <p className="font-body text-[11px] text-gray-400 mt-0.5">
              {cart.categoryName} · {cart.eventTitle}
            </p>
          </div>
        </div>
        <span className="font-bricolage font-extrabold text-black text-[18px] shrink-0">
          {formatBRL(cart.sellerPrice)}
        </span>
      </div>

      <div className="h-px bg-gray-200 mb-4" />

      <div className="flex flex-col gap-2 mb-4">
        <div className="flex justify-between font-body text-[13px]">
          <span className="text-gray-400">Ingresso</span>
          <span className="text-black">{formatBRL(cart.sellerPrice)}</span>
        </div>
        <div className="flex justify-between font-body text-[13px]">
          <span className="text-gray-400">Taxa de transferência</span>
          <span className="text-black">{formatBRL(cart.platformFee)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center px-4 py-3 rounded-[12px] bg-black mb-3">
        <span className="font-bricolage font-bold text-[14px] text-off-white">Total</span>
        <span className="font-bricolage font-extrabold text-[20px] text-primary">
          {formatBRL(cart.total)}
        </span>
      </div>

      <div className="flex items-center gap-2 px-3 py-2 rounded-[10px] bg-gray-100">
        <svg width="16" height="16" viewBox="0 0 512 512" fill="none">
          <path
            d="M342.1 35.8c-24.6-24.6-57.4-38.2-92.2-38.2-34.8 0-67.6 13.6-92.2 38.2L35.8 157.7C11.2 182.3-2.4 215.1-2.4 249.9s13.6 67.6 38.2 92.2l121.9 121.9c24.6 24.6 57.4 38.2 92.2 38.2s67.6-13.6 92.2-38.2l121.9-121.9c24.6-24.6 38.2-57.4 38.2-92.2s-13.6-67.6-38.2-92.2L342.1 35.8z"
            fill="#32BCAD"
          />
        </svg>
        <span className="font-body text-[12px] font-semibold text-black">
          Pagamento via PIX — aprovação em segundos
        </span>
      </div>
    </div>
  );
}

function MarketEventSummary({ cart }: { cart: MarketCartPayload }) {
  return (
    <div className="rounded-[20px] border border-gray-200 bg-white p-5">
      <p className="font-body text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">
        Reppy Market
      </p>
      <p className="font-bricolage font-extrabold text-black text-[18px] uppercase leading-tight">
        {cart.eventTitle}
      </p>
      {cart.eventDate && (
        <p className="font-body text-[13px] text-gray-400 mt-1">{cart.eventDate}</p>
      )}
      {cart.eventVenue && (
        <p className="font-body text-[13px] text-gray-400">{cart.eventVenue}</p>
      )}
    </div>
  );
}

function MarketCheckoutContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { user } = useAuth();

  const cart = useMemo<MarketCartPayload | null>(() => {
    const raw = params.get("cart");
    return raw ? decodeMarketCart(raw) : null;
  }, [params]);

  const isLogged = !!user;

  const [formData, setFormData] = useState<FormData>({
    nome:  user?.user_metadata?.full_name ?? "",
    email: user?.email ?? "",
    cpf:   "",
  });
  const [touched, setTouched]               = useState<FormTouched>({ nome: false, email: false, cpf: false });
  const [loading, setLoading]               = useState(false);
  const [step, setStep]                     = useState<Step>("form");
  const [pixData, setPixData]               = useState<{ code: string } | null>(null);
  const [currentTxId, setCurrentTxId]       = useState<string | null>(null);
  const [confirmedEmail, setConfirmedEmail] = useState<string | null>(null);
  const [serverCPFError, setServerCPFError]     = useState<string | null>(null);
  const [serverEmailError, setServerEmailError] = useState<string | null>(null);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (step !== "pix" || !currentTxId) return;

    pollingRef.current = setInterval(async () => {
      try {
        const { status } = await marketCheckoutService.checkPixStatus(currentTxId);
        if (status === "PAID") {
          clearInterval(pollingRef.current!);
          setStep("paid");
        } else if (status === "EXPIRED" || status === "CANCELLED") {
          clearInterval(pollingRef.current!);
          setStep("expired");
        }
      } catch {}
    }, POLL_INTERVAL_MS);

    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [step, currentTxId]);

  const errors      = validate(formData);
  const isFormValid = Object.keys(errors).length === 0;

  const handleChange = (field: keyof FormData, value: string) => {
    if (field === "cpf")   setServerCPFError(null);
    if (field === "email") setServerEmailError(null);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: keyof FormData) =>
    setTouched(prev => ({ ...prev, [field]: true }));

  const handleSubmit = async () => {
    setTouched({ nome: true, email: true, cpf: true });
    if (!isFormValid || !cart) return;

    setLoading(true);
    try {
      const tx = await marketCheckoutService.createTransaction({
        listingId:  cart.listingId,
        buyerName:  formData.nome,
        buyerEmail: formData.email,
        buyerCPF:   formData.cpf,
      });

      if (tx.pixCode) {
        setCurrentTxId(tx.transactionId);
        setPixData({ code: tx.pixCode });
        setStep("pix");
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        if (err.code === "cpf_already_exists") {
          setServerCPFError(err.message);
        } else if (err.code === "email_already_exists") {
          setServerEmailError(err.message);
        } else {
          setServerCPFError("Erro ao processar pedido. Tente novamente.");
        }
      } else {
        setServerCPFError("Erro ao processar pedido. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExpired = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    setStep("expired");
  };

  const handleReset = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    setStep("form");
    setPixData(null);
    setCurrentTxId(null);
    setServerCPFError(null);
    setServerEmailError(null);
    setTouched({ nome: false, email: false, cpf: false });
  };

  if (!cart) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-[20px] font-extrabold text-black mb-2">
            Link inválido.
          </p>
          <button
            onClick={() => router.back()}
            className="font-body text-sm text-gray-400 underline"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const displayErrors: FormErrors = {
    ...errors,
    cpf:   serverCPFError   ?? (touched.cpf   ? errors.cpf   : undefined),
    email: serverEmailError ?? (touched.email ? errors.email : undefined),
  };

  const displayTouched: FormTouched = {
    ...touched,
    cpf:   touched.cpf   || !!serverCPFError,
    email: touched.email || !!serverEmailError,
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {step !== "paid" && (
        <div className="mb-6 animate-fadeUp">
          <p className="text-xs font-display font-bold tracking-widest uppercase mb-1 text-gray-400">
            Reppy Market
          </p>
          <h1 className="text-[32px] font-display font-extrabold leading-tight text-black">
            Seu ingresso está<br />
            <span className="text-primary">quase confirmado</span>
          </h1>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {step === "paid" && (
          <div className="rounded-[20px] border border-gray-200 bg-white p-8 text-center animate-fadeUp">
            <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center mx-auto mb-4">
              <SealCheck size={28} weight="fill" className="text-primary" />
            </div>
            <p className="font-bricolage text-[28px] font-extrabold text-black mb-2 leading-tight uppercase">
              Ingresso transferido 🎉
            </p>
            <p className="font-body text-sm text-gray-500 mb-6">
              O ingresso foi transferido para você com sucesso.
            </p>
            <div className="flex flex-col gap-3">
              {isLogged && (
                <button
                  onClick={() => router.push("/meus-ingressos")}
                  className="w-full font-bricolage font-extrabold text-lg uppercase py-4 rounded-full bg-primary text-black border-2 border-black shadow-[4px_4px_0px_#0A0A0A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#0A0A0A] transition-all"
                >
                  Ver meus ingressos
                </button>
              )}
              <button
                onClick={() => router.push(`/${cart.eventSlug}`)}
                className="w-full font-bricolage font-extrabold text-lg uppercase py-4 rounded-full bg-black text-white border-2 border-black hover:bg-black/80 transition-all"
              >
                Ver evento
              </button>
            </div>
          </div>
        )}

        {(step === "form" || step === "pix") && (
          <div className="animate-fadeUp" style={{ animationDelay: "0.05s" }}>
            <MarketEventSummary cart={cart} />
          </div>
        )}

        {step === "confirmed" && confirmedEmail && (
          <div className="rounded-[20px] border border-gray-200 bg-white p-8 text-center animate-fadeUp">
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mx-auto mb-4">
              <SealCheck size={24} weight="fill" className="text-primary" />
            </div>
            <p className="font-bricolage text-[26px] font-extrabold text-black mb-2 leading-tight uppercase">
              Ingresso confirmado 🎉
            </p>
            <p className="font-body text-sm text-gray-500 mb-1">Enviamos seu ingresso para</p>
            <p className="font-body text-[15px] font-semibold text-black mb-6">{confirmedEmail}</p>
            <div className="rounded-[12px] px-4 py-3 text-left" style={{ background: "#F0F0EB" }}>
              <p className="font-body text-[12px] text-gray-500 leading-relaxed">
                Quer acessar seus ingressos pelo app?{" "}
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
          <div className="rounded-[20px] border border-red-400 p-6 text-center bg-red-50 animate-fadeUp">
            <p className="text-[28px] font-display font-extrabold mb-1 text-black">
              Código expirado
            </p>
            <p className="text-sm mb-5 text-gray-500">
              O tempo para pagamento acabou. Nenhum valor foi cobrado.
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-full text-sm font-display font-bold bg-black text-white hover:bg-black/90 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {(step === "form" || step === "pix") && (
          <div className="flex flex-col gap-4 animate-fadeUp" style={{ animationDelay: "0.1s" }}>
            <div
              style={{
                opacity:       step === "pix" ? 0.6 : 1,
                pointerEvents: step === "pix" ? "none" : "auto",
                transition:    "opacity 0.3s",
              }}
            >
              <BuyerForm
                data={formData}
                onChange={handleChange}
                errors={displayErrors}
                touched={displayTouched}
                onBlur={handleBlur}
              />
            </div>

            <MarketOrderSummary cart={cart} />

            {step === "form" && (
              <button
                onClick={handleSubmit}
                disabled={loading || (!isFormValid && Object.values(touched).some(Boolean))}
                className={`w-full font-bricolage font-extrabold text-xl uppercase tracking-wide py-4 rounded-full flex items-center justify-center transition-all ${
                  isFormValid
                    ? "bg-primary text-black border-2 border-black shadow-[4px_4px_0px_#0A0A0A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#0A0A0A] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? "Processando..." : `Pagar ${formatBRL(cart.total)}`}
              </button>
            )}
          </div>
        )}

        {step === "pix" && pixData && (
          <div className="animate-fadeUp">
            <PixPayment pixData={pixData} onExpire={handleExpired} isVisible />
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
  );
}

export default function MarketCheckoutPage() {
  return (
    <div className="min-h-screen bg-off-white font-body">
      <Suspense
        fallback={
          <div className="min-h-screen bg-off-white flex items-center justify-center">
            Carregando...
          </div>
        }
      >
        <MarketCheckoutContent />
      </Suspense>
    </div>
  );
}