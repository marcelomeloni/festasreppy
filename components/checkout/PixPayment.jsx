"use client";
// components/checkout/PixPayment.jsx

import { useEffect, useRef, useState } from "react";
const PIX_EXPIRY_SECONDS = 900;

function CountdownTimer({ seconds, onExpire }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) {
      onExpire?.();
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining]);

  const mins = String(Math.floor(remaining / 60)).padStart(2, "0");
  const secs = String(remaining % 60).padStart(2, "0");
  const pct = (remaining / seconds) * 100;
  const isUrgent = remaining < 120;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isUrgent ? "#FF2D2D" : "#9A9A8F"}
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span
          className="text-[13px] font-semibold tabular-nums"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: isUrgent ? "#FF2D2D" : "#5C5C52",
          }}
        >
          {mins}:{secs}
        </span>
      </div>
      {/* Progress bar */}
      <div
        className="w-full h-1 rounded-full overflow-hidden"
        style={{ background: "#E0E0D8" }}
      >
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${pct}%`,
            background: isUrgent ? "#FF2D2D" : "#1BFF11",
          }}
        />
      </div>
      <p
        className="text-[11px] text-center"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#9A9A8F" }}
      >
        {isUrgent ? "Corre! O código expira em breve." : "O código expira em breve. Não feche essa tela."}
      </p>
    </div>
  );
}

export default function PixPayment({ pixData, onExpire, isVisible }) {
  const [copied, setCopied] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(false);
  const [qrError, setQrError] = useState(false);

  // Handle QR code image load/error
  const handleQrLoad = () => setQrLoaded(true);
  const handleQrError = () => setQrError(true);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixData.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback - silent fail
    }
  };

  if (!isVisible) return null;

  // Use real QR code from backend (base64 PNG) or fallback to copy-only mode
  const hasRealQr = !!pixData.qrCode;

  return (
    <div
      className="rounded-[20px] border border-[#E0E0D8] bg-white overflow-hidden"
      style={{ animation: "fadeUp 0.4s ease both" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-4 border-b border-[#E0E0D8]"
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold"
          style={{ background: "#0A0A0A", color: "#1BFF11" }}
        >
          3
        </div>
        <h3
          className="text-[16px] font-bold"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "#0A0A0A" }}
        >
          Pague via PIX
        </h3>
        {/* PIX logo text */}
        <span
          className="ml-auto text-[11px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
          style={{ background: "#32BCAD", color: "#fff" }}
        >
          PIX
        </span>
      </div>

      <div className="p-5 flex flex-col gap-5">
        {/* Steps */}
        <ol
          className="flex flex-col gap-2"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {["Abra o app do seu banco", "Escolha pagar via PIX", hasRealQr ? "Escaneie o QR Code" : "Copie o código PIX"].map(
            (step, i) => (
              <li key={i} className="flex items-center gap-2.5 text-[13px]" style={{ color: "#5C5C52" }}>
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                  style={{ background: "#F0F0EB", color: "#0A0A0A" }}
                >
                  {i + 1}
                </span>
                {step}
              </li>
            )
          )}
        </ol>

        {/* QR Code */}
        <div className="flex flex-col items-center gap-3">
          {hasRealQr ? (
            <div
              className="rounded-[16px] p-4 border border-[#E0E0D8]"
              style={{ background: "#fff" }}
            >
              <img
                src={`data:image/png;base64,${pixData.qrCode}`}
                alt="QR Code PIX"
                width={180}
                height={180}
                className="block"
                onLoad={handleQrLoad}
                onError={handleQrError}
                style={{
                  opacity: qrLoaded ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
              />
              {!qrLoaded && !qrError && (
                <div className="w-[180px] h-[180px] flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {qrError && (
                <div className="w-[180px] h-[180px] flex items-center justify-center text-gray-500 text-sm">
                  Não foi possível carregar o QR Code
                </div>
              )}
            </div>
          ) : (
            <div
              className="rounded-[16px] p-4 border border-[#E0E0D8] bg-gray-50 flex items-center justify-center"
              style={{ width: 180, height: 180 }}
            >
              <div className="text-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9A9A8F" strokeWidth="1.5" className="mx-auto mb-2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="6" y="6" width="1" height="1" />
                  <rect x="17" y="6" width="1" height="1" />
                  <rect x="6" y="17" width="1" height="1" />
                  <rect x="17" y="17" width="1" height="1" />
                </svg>
                <p className="text-[12px] text-gray-500">QR indisponível</p>
                <p className="text-[10px] text-gray-400 mt-1">Use o código abaixo</p>
              </div>
            </div>
          )}
          <CountdownTimer seconds={PIX_EXPIRY_SECONDS} onExpire={onExpire} />
        </div>

        {/* Copia e cola */}
        <div className="flex flex-col gap-2">
          <p
            className="text-[12px] font-semibold"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#5C5C52" }}
          >
            Ou copie o código PIX:
          </p>
          <div
            className="flex items-center gap-2 p-3 rounded-[12px]"
            style={{ background: "#F0F0EB", border: "1.5px solid #E0E0D8" }}
          >
            <p
              className="flex-1 text-[11px] font-mono break-all leading-relaxed"
              style={{ color: "#5C5C52" }}
            >
              {pixData.code.slice(0, 60)}…
            </p>
            <button
              onClick={handleCopy}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all"
              style={{
                background: copied ? "#1BFF11" : "#0A0A0A",
                color: copied ? "#0A0A0A" : "#fff",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {copied ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Copiado
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  Copiar
                </>
              )}
            </button>
          </div>
        </div>

        {/* Aviso */}
        <div
          className="flex items-start gap-2 p-3 rounded-[12px]"
          style={{ background: "rgba(27,255,17,0.06)", border: "1px solid rgba(27,255,17,0.2)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1BFF11" strokeWidth="2" className="mt-0.5 flex-shrink-0">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <p
            className="text-[12px] leading-relaxed"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#5C5C52" }}
          >
            Após o pagamento, seu ingresso é enviado automaticamente para o e-mail cadastrado.
          </p>
        </div>
      </div>
    </div>
  );
}