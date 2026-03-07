"use client";
// components/checkout/OrderSummary.jsx
import { useState } from "react";

function formatBRL(cents) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function OrderSummary({ cart, onCouponApply }) {
  const [couponCode, setCouponCode]   = useState("");
  const [couponState, setCouponState] = useState("idle"); // "idle" | "loading" | "valid" | "invalid"
  const [couponError, setCouponError] = useState("");

  const isFree = cart.total === 0;

  async function handleApplyCoupon() {
    if (!couponCode.trim()) return;
    setCouponState("loading");
    setCouponError("");
    try {
      const result = onCouponApply
        ? await onCouponApply(couponCode.trim())
        : await fakeCouponCheck(couponCode.trim());

      if (result.valid) {
        setCouponState("valid");
      } else {
        setCouponState("invalid");
        setCouponError(result.message || "Cupom inválido ou expirado.");
      }
    } catch {
      setCouponState("invalid");
      setCouponError("Erro ao validar cupom. Tente novamente.");
    }
  }

  function handleRemoveCoupon() {
    setCouponCode("");
    setCouponState("idle");
    setCouponError("");
  }

  return (
    <div className="rounded-[20px] border border-[#E0E0D8] bg-white p-5">

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0"
          style={{ background: "#0A0A0A", color: "#1BFF11" }}
        >
          2
        </div>
        <h3
          className="text-[16px] font-bold"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "#0A0A0A" }}
        >
          Resumo do pedido
        </h3>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-3 mb-4">
        {cart.items.map((item) => (
          <div key={item.id} className="flex justify-between items-center gap-2">
            <div className="flex-1 min-w-0">
              <p
                className="text-[14px] font-semibold leading-tight truncate"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0A0A0A" }}
              >
                {item.name}
              </p>
              <p
                className="text-[12px] mt-0.5"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#9A9A8F" }}
              >
                {item.quantity}×
              </p>
            </div>
            <span
              className="text-[14px] font-semibold whitespace-nowrap"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0A0A0A" }}
            >
              {item.price === 0 ? (
                <span style={{ color: "#1BFF11" }}>Grátis</span>
              ) : (
                formatBRL(item.price * item.quantity)
              )}
            </span>
          </div>
        ))}
      </div>

      <div className="h-px bg-[#E0E0D8] mb-4" />

      {/* Cupom — só aparece se não for gratuito */}
      {!isFree && (
        <>
          <div className="mb-4">
            <label
              className="block text-[12px] font-semibold mb-1.5"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#5C5C52" }}
            >
              Cupom de desconto
            </label>

            {couponState === "valid" ? (
              <div
                className="flex items-center justify-between px-3 py-2.5 rounded-[10px]"
                style={{ background: "#EDFFF0", border: "1.5px solid #1BFF11" }}
              >
                <div className="flex items-center gap-2">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <circle cx="7.5" cy="7.5" r="7.5" fill="#1BFF11" />
                    <path d="M4 7.5L6.5 10L11 5.5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span
                    className="text-[13px] font-bold tracking-wider uppercase"
                    style={{ fontFamily: "'DM Sans', sans-serif", color: "#0A0A0A" }}
                  >
                    {couponCode}
                  </span>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-[11px] font-semibold underline"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#9A9A8F" }}
                >
                  Remover
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    if (couponState === "invalid") {
                      setCouponState("idle");
                      setCouponError("");
                    }
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  placeholder="EX: PROMO10"
                  className="flex-1 px-3 py-2.5 text-[13px] rounded-[10px] outline-none transition-all"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: "#0A0A0A",
                    letterSpacing: "0.05em",
                    background: "#F7F7F2",
                    border: couponState === "invalid" ? "1.5px solid #FF4444" : "1.5px solid #E0E0D8",
                  }}
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={!couponCode.trim() || couponState === "loading"}
                  className="px-4 py-2.5 rounded-[10px] text-[13px] font-bold transition-all"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    background: couponCode.trim() ? "#0A0A0A" : "#E0E0D8",
                    color: couponCode.trim() ? "#1BFF11" : "#9A9A8F",
                    cursor: couponCode.trim() ? "pointer" : "not-allowed",
                    minWidth: "80px",
                  }}
                >
                  {couponState === "loading" ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <svg className="animate-spin" width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 8" />
                      </svg>
                      <span>...</span>
                    </span>
                  ) : (
                    "Aplicar"
                  )}
                </button>
              </div>
            )}

            {couponState === "invalid" && couponError && (
              <p
                className="mt-1.5 text-[11px] font-medium"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#FF4444" }}
              >
                {couponError}
              </p>
            )}
          </div>

          <div className="h-px bg-[#E0E0D8] mb-4" />
        </>
      )}

      {/* Breakdown — subtotal e taxa só aparecem se não for gratuito */}
      {!isFree && (
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex justify-between">
            <span className="text-[13px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#5C5C52" }}>
              Subtotal
            </span>
            <span className="text-[13px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#5C5C52" }}>
              {formatBRL(cart.subtotal)}
            </span>
          </div>

          {cart.totalFees > 0 && (
            <div className="flex justify-between">
              <span className="text-[13px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#5C5C52" }}>
                Taxa de serviço
              </span>
              <span className="text-[13px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#5C5C52" }}>
                {formatBRL(cart.totalFees)}
              </span>
            </div>
          )}

          {couponState === "valid" && cart.discount > 0 && (
            <div className="flex justify-between">
              <span
                className="text-[13px] font-semibold"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1BFF11" }}
              >
                Desconto ({couponCode})
              </span>
              <span
                className="text-[13px] font-semibold"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1BFF11" }}
              >
                -{formatBRL(cart.discount)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Total */}
      <div
        className="flex justify-between items-center px-4 py-3 rounded-[12px]"
        style={{ background: "#0A0A0A" }}
      >
        <span
          className="text-[14px] font-bold"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "#F7F7F2" }}
        >
          Total
        </span>
        <span
          className="text-[20px] font-extrabold"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "#1BFF11" }}
        >
          {isFree ? "Gratuito" : formatBRL(cart.total)}
        </span>
      </div>

      {/* Badge PIX — só para pedidos pagos */}
      {!isFree && (
        <div
          className="mt-3 flex items-center gap-2 px-3 py-2 rounded-[10px]"
          style={{ background: "#F0F0EB" }}
        >
          <svg width="16" height="16" viewBox="0 0 512 512" fill="none">
            <path d="M342.1 35.8c-24.6-24.6-57.4-38.2-92.2-38.2-34.8 0-67.6 13.6-92.2 38.2L35.8 157.7C11.2 182.3-2.4 215.1-2.4 249.9s13.6 67.6 38.2 92.2l121.9 121.9c24.6 24.6 57.4 38.2 92.2 38.2s67.6-13.6 92.2-38.2l121.9-121.9c24.6-24.6 38.2-57.4 38.2-92.2s-13.6-67.6-38.2-92.2L342.1 35.8z" fill="#32BCAD"/>
          </svg>
          <span
            className="text-[12px] font-semibold"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0A0A0A" }}
          >
            Pagamento via PIX — aprovação em segundos
          </span>
        </div>
      )}

      {/* Badge gratuito */}
      {isFree && (
        <div
          className="mt-3 flex items-center gap-2 px-3 py-2 rounded-[10px]"
          style={{ background: "#EDFFF0", border: "1px solid rgba(27,255,17,0.2)" }}
        >
          <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
            <circle cx="7.5" cy="7.5" r="7.5" fill="#1BFF11" />
            <path d="M4 7.5L6.5 10L11 5.5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span
            className="text-[12px] font-semibold"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0A0A0A" }}
          >
            Ingresso gratuito — sem custo algum
          </span>
        </div>
      )}

    </div>
  );
}

async function fakeCouponCheck(code) {
  await new Promise((r) => setTimeout(r, 800));
  const valid = ["PROMO10", "DESC20", "BEMVINDO"].includes(code);
  return valid
    ? { valid: true }
    : { valid: false, message: "Cupom inválido ou expirado." };
}

export { formatBRL };