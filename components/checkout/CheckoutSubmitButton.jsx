"use client";
// components/checkout/CheckoutSubmitButton.jsx

const formatBRL = (cents) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function CheckoutSubmitButton({ loading, disabled, total, isFree, onSubmit }) {
  const isDisabled = disabled || loading;

  const label = loading
    ? (isFree ? "Confirmando..." : "Gerando PIX...")
    : isFree
    ? "Garantir ingresso grátis"
    : `Gerar PIX · ${formatBRL(total)}`;

  return (
    <button
      onClick={onSubmit}
      disabled={isDisabled}
      aria-busy={loading}
      aria-disabled={isDisabled}
      className="w-full flex items-center justify-center gap-2 py-4 rounded-[100px] text-[16px] font-bold transition-all"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: isDisabled ? "#E0E0D8" : "#1BFF11",
        color:      isDisabled ? "#9A9A8F" : "#0A0A0A",
        cursor:     isDisabled ? "not-allowed" : "pointer",
        boxShadow:  isDisabled ? "none" : "0 4px 20px rgba(27,255,17,0.25)",
      }}
      onMouseEnter={(e) => {
        if (isDisabled) return;
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "0 6px 24px rgba(27,255,17,0.35)";
      }}
      onMouseLeave={(e) => {
        if (isDisabled) return;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(27,255,17,0.25)";
      }}
    >
      {loading && (
        <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      )}

      {label}

      {!loading && !isFree && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      )}
    </button>
  );
}