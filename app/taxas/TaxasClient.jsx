"use client";

import { useState } from "react";

// ── fee logic ─────────────────────────────────────────────────────────────────
const reppyRate = (p) => (p <= 10 ? 0.1 : p <= 14 ? 0.08 : 0.07);
const calcReppy = (p) => p * reppyRate(p);
const calcChe   = (p) => p * 0.1;
const calcSym   = (p) => Math.max(p * 0.1, p <= 39.9 ? 3.99 : 0);
const calcEve   = (p) => Math.max(p * 0.085, 2.5);

const fmt  = (n) => n.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
const fmtS = (n) => n.toLocaleString("pt-BR", { minimumFractionDigits: 0 });

// ─────────────────────────────────────────────────────────────────────────────
// COMPETITOR BADGES
// ─────────────────────────────────────────────────────────────────────────────

function BadgeCheers({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="7" fill="#D01910"/>
      <path d="M19 11.5 C17.8 10.5 16.5 10 15 10 C11.7 10 9 12.7 9 16 C9 19.3 11.7 22 15 22 C16.5 22 17.8 21.5 19 20.5"
        stroke="white" strokeWidth="3.4" strokeLinecap="round" fill="none"/>
      <rect x="21.2" y="9.5" width="2.6" height="7.8" rx="1.3" fill="white"/>
      <rect x="21.2" y="19.5" width="2.6" height="2.6" rx="1.3" fill="white"/>
    </svg>
  );
}

function BadgeSympla({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.5 13 C19.5 13 18.5 8 14.5 8 C10.5 8 8 11.5 8 16 C8 20.5 10.5 24 14.5 24 C17 24 18.8 22.5 19.5 21"
        stroke="#00AEEF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M19.5 13 L19.5 24" stroke="#00AEEF" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="26" cy="7" r="3.2" fill="#00AEEF"/>
      <circle cx="28" cy="13" r="1.9" fill="#00AEEF" opacity=".65"/>
    </svg>
  );
}

function BadgeEventiza({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="7" fill="#1A56DB"/>
      <line x1="6" y1="16.5" x2="26" y2="16.5" stroke="white" strokeWidth="1" strokeDasharray="1.8 2.2" opacity=".35"/>
      <path d="M9.5 16.5 L13.5 20.5 L22.5 12" stroke="#4ADE80" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BadgeReppy({ size = 32 }) {
  return (
    <img src="/reppy_badge.jpg" alt="reppy" width={size} height={size}
      style={{ borderRadius: 7, objectFit: "cover", display: "block", flexShrink: 0 }}/>
  );
}

const COMPETITORS = [
  {
    id: "che", Badge: BadgeCheers,
    tagline: "plataforma do copo vermelho",
    color: "#E74C3C", bgDim: "rgba(231,76,60,0.06)", borderDim: "rgba(231,76,60,0.2)",
    note: "10% fixo, sem desconto", hint: "10% fixo", calc: calcChe,
  },
  {
    id: "sym", Badge: BadgeSympla,
    tagline: "plataforma do \"a\" azul",
    color: "#00AEEF", bgDim: "rgba(0,174,239,0.05)", borderDim: "rgba(0,174,239,0.18)",
    note: "10% · mín R$3,99/ingresso", hint: "10% · mín R$3,99", calc: calcSym,
  },
  {
    id: "eve", Badge: BadgeEventiza,
    tagline: "plataforma do ticket azul",
    color: "#2563EB", bgDim: "rgba(37,99,235,0.06)", borderDim: "rgba(37,99,235,0.2)",
    note: "8,5% · mín R$2,50/ingresso", hint: "8,5% · mín R$2,50", calc: calcEve,
  },
];

const PRESETS = [
  { label: "Open R$15",   price: 15,  qty: 80  },
  { label: "Calou R$20",  price: 20,  qty: 150 },
  { label: "Balada R$30", price: 30,  qty: 200 },
  { label: "VIP R$50",    price: 50,  qty: 120 },
  { label: "Show R$80",   price: 80,  qty: 300 },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Taxas — Reppy",
  description: "Reppy cobra 7% de taxa a partir de R$15. Sem mensalidade, sem mínimo abusivo.",
  url: "https://reppy.com.br/taxas",
  provider: { "@type": "Organization", name: "Reppy", url: "https://reppy.com.br" },
  mainEntity: {
    "@type": "PriceSpecification",
    name: "Taxa de serviço Reppy",
    description: "7% para ingressos a partir de R$15",
    price: "7", priceCurrency: "BRL",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
export default function TaxasClient() {
  const [price, setPrice] = useState(30);
  const [qty,   setQty]   = useState(200);

  const gross      = price * qty;
  const reppyFee   = calcReppy(price);
  const reppyTotal = reppyFee * qty;
  const reppyNet   = gross - reppyTotal;

  const allBars = [
    { id: "rep", label: "reppy", total: reppyTotal, green: true, Badge: BadgeReppy },
    ...COMPETITORS.map((c) => ({
      id: c.id, label: c.tagline, total: c.calc(price) * qty,
      green: false, Badge: c.Badge, color: c.color,
    })),
  ];
  const maxBar = Math.max(...allBars.map((b) => b.total));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <style>{`
        @keyframes tick   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .ticker-anim { animation: tick 24s linear infinite; }
        .bar-t       { transition: width .55s cubic-bezier(.4,0,.2,1); }
        input[type=range] {
          -webkit-appearance:none; appearance:none;
          width:100%; height:2px; background:#222; border-radius:100px; outline:none; cursor:pointer;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance:none; width:24px; height:24px;
          background:#1BFF11; border-radius:50%;
          box-shadow:0 0 0 4px rgba(27,255,17,.15); transition:box-shadow .15s;
        }
        input[type=range]::-webkit-slider-thumb:hover { box-shadow:0 0 0 8px rgba(27,255,17,.18); }
        /* Larger touch target on mobile */
        @media (max-width: 640px) {
          input[type=range]::-webkit-slider-thumb { width:28px; height:28px; }
        }
      `}</style>

      <div className="bg-[#0A0A0A] text-[#F7F7F2] min-h-screen">

        {/* ══════════════════ HERO ══════════════════ */}
        <section className="relative min-h-screen flex flex-col justify-end px-5 sm:px-10 pb-16 sm:pb-20 overflow-hidden">
          {/* grain */}
          <div aria-hidden className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize:"160px" }} />
          {/* glow */}
          <div aria-hidden className="absolute top-[-120px] right-[-80px] w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background:"radial-gradient(circle, rgba(27,255,17,0.13) 0%, transparent 65%)" }} />
          {/* breadcrumb */}
          <div className="absolute top-8 sm:top-12 left-5 sm:left-10 flex items-center gap-2">
            <span className="font-bricolage font-bold text-[11px] tracking-[.2em] uppercase text-[#1BFF11]">reppy</span>
            <span className="text-[#333] text-[11px]">/</span>
            <span className="font-body text-[11px] tracking-[.1em] uppercase text-[#5C5C52]">taxas</span>
          </div>
          {/* ghost 7% — smaller on mobile so it doesn't overwhelm */}
          <div aria-hidden className="absolute top-1/2 right-2 sm:right-8 -translate-y-[55%] select-none pointer-events-none opacity-[0.04]">
            <span className="font-bricolage font-extrabold text-[#F7F7F2]" style={{ fontSize:"clamp(120px,28vw,340px)", lineHeight:1 }}>7%</span>
          </div>

          <div className="max-w-5xl relative">
            <h1 className="font-bricolage font-extrabold text-[#F7F7F2] leading-[.88] mb-6 sm:mb-8"
              style={{ fontSize:"clamp(52px,11vw,140px)", letterSpacing:"clamp(-2px,-0.04em,-4px)" }}>
              Mais festa.<br />
              <span className="text-[#1BFF11]">Menos taxa.</span>
            </h1>
            <p className="font-body text-[15px] sm:text-[17px] text-[#5C5C52] leading-[1.8] max-w-sm">
              Sem mensalidade, sem taxa escondida,<br className="hidden sm:block" />sem surpresa no fechamento.
            </p>
          </div>
        </section>

        {/* ══════════════════ TABELA — OFF-WHITE ══════════════════ */}
        <section className="bg-[#F7F7F2] px-5 sm:px-10 py-16 sm:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 sm:gap-12 mb-10 sm:mb-16">
              <div>
                <p className="font-bricolage font-bold text-[11px] tracking-[.2em] uppercase text-[#9A9A8F] mb-3 sm:mb-4">estrutura de taxas</p>
                <h2 className="font-bricolage font-extrabold text-[#0A0A0A] leading-[.92]"
                  style={{ fontSize:"clamp(32px,5vw,64px)", letterSpacing:"clamp(-1.5px,-0.03em,-3px)" }}>
                  Uma taxa justa.<br />Simples assim.
                </h2>
              </div>
              <p className="font-body text-[14px] sm:text-[15px] text-[#9A9A8F] leading-[1.8] sm:max-w-[260px] sm:pt-2">
                Quanto mais caro o ingresso, menor a porcentagem. Sem mínimo abusivo.
              </p>
            </div>

            <div className="border-[1.5px] border-[#E0E0D8] rounded-[20px] sm:rounded-[28px] overflow-hidden">
              {[
                { range:"Até R$10",    pct:"10%", sub:null,                    dark:false },
                { range:"R$11 – R$14", pct:"8%",  sub:null,                    dark:false },
                { range:"R$15+",       pct:"7%",  sub:"TAXA FIXA PRA SEMPRE", dark:true  },
              ].map((row, i) => (
                <div key={row.range}
                  className={[
                    "flex items-center justify-between px-5 sm:px-9 py-5 sm:py-7",
                    i > 0 ? "border-t-[1.5px] border-[#E0E0D8]" : "",
                    row.dark ? "bg-[#0A0A0A]" : "",
                  ].join(" ")}>
                  <div>
                    <p className={`font-bricolage font-bold text-[17px] sm:text-[20px] ${row.dark ? "text-[#F7F7F2]" : "text-[#0A0A0A]"}`}>{row.range}</p>
                    {row.sub && <p className="font-bricolage font-bold text-[10px] sm:text-[11px] text-[#1BFF11] mt-1 tracking-[.06em]">{row.sub}</p>}
                  </div>
                  <span className={`font-bricolage font-extrabold text-[24px] sm:text-[32px] px-4 sm:px-6 py-1.5 sm:py-2 rounded-full ${row.dark ? "bg-[#1BFF11] text-[#0A0A0A]" : "bg-[#0A0A0A] text-[#F7F7F2]"}`}>
                    {row.pct}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════ SIMULADOR — BLACK ══════════════════ */}
        <section id="simulador" className="bg-[#0A0A0A] px-5 sm:px-10 py-16 sm:py-24">
          <div className="max-w-5xl mx-auto">

            <p className="font-bricolage font-bold text-[11px] tracking-[.2em] uppercase text-[#5C5C52] mb-3 sm:mb-4">comparativo honesto</p>
            <h2 className="font-bricolage font-extrabold text-[#F7F7F2] leading-[.9] mb-4"
              style={{ fontSize:"clamp(30px,6vw,72px)", letterSpacing:"clamp(-1.5px,-0.03em,-3px)" }}>
              O que eles <span className="text-[#FF4444]">cobram</span>.<br />
              O que a REPPY <span className="text-[#1BFF11]">cobra</span>.
            </h2>

           

            {/* presets — scrollable on mobile */}
            <div className="flex flex-wrap gap-2 mb-8 sm:mb-12">
              {PRESETS.map((p) => {
                const active = price === p.price && qty === p.qty;
                return (
                  <button key={p.label} onClick={() => { setPrice(p.price); setQty(p.qty); }}
                    className={[
                      "font-bricolage font-bold text-[12px] sm:text-[13px] px-4 sm:px-5 py-2 rounded-full border transition-all cursor-pointer",
                      active
                        ? "bg-[#1BFF11] text-[#0A0A0A] border-[#1BFF11]"
                        : "bg-transparent text-[#5C5C52] border-[#222] hover:border-[#444]",
                    ].join(" ")}>
                    {p.label}
                  </button>
                );
              })}
            </div>

            {/* sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-12 mb-10 sm:mb-12">
              {[
                { label:"Preço do ingresso", val:price, set:setPrice, min:5,  max:200,  step:5,  fmt:(v)=>`R$${v}` },
                { label:"Qtd. de ingressos", val:qty,   set:setQty,   min:10, max:1000, step:10, fmt:(v)=>`${v}`   },
              ].map((sl) => (
                <div key={sl.label}>
                  <div className="flex justify-between items-baseline mb-4">
                    <label className="font-body text-[11px] sm:text-[12px] text-[#5C5C52] font-semibold tracking-[.04em]">{sl.label}</label>
                    {/* Responsive font size for slider value */}
                    <span className="font-bricolage font-extrabold text-[#F7F7F2]"
                      style={{ fontSize:"clamp(28px,7vw,42px)", lineHeight:1 }}>
                      {sl.fmt(sl.val)}
                    </span>
                  </div>
                  <input type="range" min={sl.min} max={sl.max} step={sl.step} value={sl.val}
                    onChange={(e) => sl.set(Number(e.target.value))} />
                  <div className="flex justify-between mt-2">
                    <span className="font-body text-[11px] text-[#333]">{sl.fmt(sl.min)}</span>
                    <span className="font-body text-[11px] text-[#333]">{sl.fmt(sl.max)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* receita bruta */}
            <div className="flex justify-between items-center border-[1.5px] border-[#1e1e1e] rounded-[16px] sm:rounded-[20px] px-5 sm:px-8 py-4 sm:py-5 mb-4 sm:mb-6">
              <span className="font-body text-[12px] sm:text-[13px] text-[#5C5C52] font-semibold">Receita bruta do evento</span>
              <span className="font-bricolage font-extrabold text-[#F7F7F2]"
                style={{ fontSize:"clamp(22px,5vw,34px)", lineHeight:1 }}>
                R${fmt(gross)}
              </span>
            </div>

            {/* ── COMPARISON CARDS ── */}
            <div className="flex flex-col gap-3 mb-8 sm:mb-10">

              {/* reppy card */}
              <div className="relative rounded-[16px] sm:rounded-[20px] border-[1.5px] border-[#1BFF11] bg-[#0d0d0d] overflow-hidden">
                <div aria-hidden className="absolute right-0 top-0 bottom-0 w-48 pointer-events-none"
                  style={{ background:"linear-gradient(to left, rgba(27,255,17,0.07), transparent)" }} />
                {/* Top row: badge + name */}
                <div className="flex items-center gap-3 px-5 sm:px-8 pt-5 sm:pt-6 pb-3">
                  <BadgeReppy size={38} />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-bricolage font-extrabold text-[#1BFF11] text-[18px] sm:text-[22px]">REPPY</span>
                      <span className="font-bricolage font-bold text-[10px] sm:text-[11px] bg-[#1BFF11] text-[#0A0A0A] px-2.5 py-[2px] rounded-full uppercase tracking-[.08em]">menor taxa</span>
                    </div>
                    <p className="font-body text-[12px] sm:text-[13px] text-[#5C5C52]">
                      {(reppyRate(price) * 100).toFixed(0)}% · R${fmt(reppyFee)}/ingresso
                    </p>
                  </div>
                </div>
                {/* Bottom row: values */}
                <div className="flex items-end justify-between px-5 sm:px-8 pb-5 sm:pb-6 pt-1">
                  <div>
                    <p className="font-body text-[11px] sm:text-[12px] text-[#5C5C52] mb-0.5">você recebe</p>
                    <p className="font-bricolage font-bold text-[#F7F7F2] text-[16px] sm:text-[18px]">R${fmtS(reppyNet)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-body text-[11px] sm:text-[12px] text-[#5C5C52] mb-0.5">você paga de taxa</p>
                    <p className="font-bricolage font-extrabold text-[#1BFF11]"
                      style={{ fontSize:"clamp(28px,6vw,40px)", lineHeight:1 }}>
                      R${fmtS(reppyTotal)}
                    </p>
                  </div>
                </div>
              </div>

              {/* competitor cards */}
              {COMPETITORS.map((c) => {
                const fee    = c.calc(price);
                const total  = fee * qty;
                const net    = gross - total;
                const diff   = total - reppyTotal;
                const pctEff = price > 0 ? ((fee / price) * 100).toFixed(1) : "0";
                return (
                  <div key={c.id}
                    className="rounded-[16px] sm:rounded-[20px] border-[1.5px] border-[#1a1a1a] bg-[#0d0d0d] hover:border-[#252525] transition-colors overflow-hidden">
                    {/* Top row: badge + name */}
                    <div className="flex items-center gap-3 px-5 sm:px-8 pt-5 sm:pt-6 pb-3">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[10px] sm:rounded-[12px] flex items-center justify-center shrink-0"
                        style={{ background: c.bgDim, border:`1.5px solid ${c.borderDim}` }}>
                        <c.Badge size={24} />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bricolage font-bold text-[13px] sm:text-[15px] block truncate" style={{ color: c.color }}>
                          {c.tagline}
                        </span>
                        <p className="font-body text-[11px] sm:text-[12px] text-[#3a3a3a] truncate">
                          {pctEff}% efetivo · {c.note}
                        </p>
                      </div>
                    </div>
                    {/* Bottom row: values */}
                    <div className="flex items-end justify-between px-5 sm:px-8 pb-5 sm:pb-6 pt-1">
                      <div>
                        <p className="font-body text-[11px] sm:text-[12px] text-[#3a3a3a] mb-0.5">você recebe</p>
                        <p className="font-bricolage font-bold text-[#9A9A8F] text-[15px] sm:text-[17px]">R${fmtS(net)}</p>
                        <span className="font-bold text-[11px] sm:text-[12px] text-[#FF4444]">+R${fmtS(diff)} de taxa</span>
                      </div>
                      <div className="text-right">
                        <p className="font-body text-[11px] sm:text-[12px] text-[#3a3a3a] mb-0.5">você paga de taxa</p>
                        <p className="font-bricolage font-extrabold text-[#FF4444]"
                          style={{ fontSize:"clamp(24px,5vw,36px)", lineHeight:1 }}>
                          R${fmtS(total)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── BAR CHART ── */}
            <div className="border-[1.5px] border-[#1a1a1a] rounded-[20px] sm:rounded-[24px] overflow-hidden mb-4">
              <div className="px-4 sm:px-8 py-3 sm:py-4 border-b border-[#1a1a1a]">
                <p className="font-bricolage font-bold text-[10px] sm:text-[11px] text-[#5C5C52] uppercase tracking-[.1em]">
                  taxa total · R${fmt(price)} × {qty} = R${fmt(gross)}
                </p>
              </div>
              {allBars.map((b, i) => {
                const w = Math.max((b.total / maxBar) * 100, 6);
                return (
                  <div key={b.id}
                    className={`flex items-center gap-2 sm:gap-4 px-4 sm:px-8 py-3 sm:py-[14px] ${i < allBars.length - 1 ? "border-b border-[#141414]" : ""}`}>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[7px] sm:rounded-[8px] flex items-center justify-center shrink-0"
                      style={{ background: b.green ? "rgba(27,255,17,0.12)" : "rgba(255,255,255,0.04)" }}>
                      <b.Badge size={17} />
                    </div>
                    <div className="flex-1 h-8 sm:h-9">
                      <div className="bar-t h-full rounded-full flex items-center pl-3 sm:pl-4"
                        style={{ width:`${w}%`, background: b.green ? "#1BFF11" : "#1e1e1e" }}>
                        <span className={`font-bricolage font-bold text-[11px] sm:text-[13px] whitespace-nowrap ${b.green ? "text-[#0A0A0A]" : "text-[#5C5C52]"}`}>
                          R${fmtS(b.total)}
                        </span>
                      </div>
                    </div>
                    {b.green ? (
                      <span className="font-bricolage font-bold text-[10px] sm:text-[11px] bg-[rgba(27,255,17,0.1)] text-[#1BFF11] border border-[rgba(27,255,17,0.2)] px-2 sm:px-3 py-1 rounded-full shrink-0">MENOR</span>
                    ) : (
                      <span className="font-bricolage font-bold text-[10px] sm:text-[11px] bg-[rgba(255,68,68,0.08)] text-[#FF4444] border border-[rgba(255,68,68,0.15)] px-2 sm:px-3 py-1 rounded-full shrink-0 whitespace-nowrap">
                        +R${fmtS(b.total - reppyTotal)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── ECONOMY CARDS — 1 col mobile, 3 col desktop ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {COMPETITORS.map((c) => {
                const save = c.calc(price) * qty - reppyTotal;
                return (
                  <div key={c.id}
                    className="rounded-[16px] sm:rounded-[20px] px-5 sm:px-6 py-4 sm:py-5 hover:-translate-y-[2px] transition-transform cursor-default"
                    style={{ border:`1.5px solid ${c.borderDim}`, background: c.bgDim }}>
                    {/* On mobile: horizontal layout for space efficiency */}
                    <div className="flex sm:block items-center justify-between gap-3">
                      <div className="flex items-center gap-2 mb-0 sm:mb-3">
                        <c.Badge size={20} />
                        <span className="font-bricolage font-bold text-[10px] sm:text-[11px] uppercase tracking-[.08em]" style={{ color: c.color }}>
                          vs {c.tagline.split(" ").slice(-2).join(" ")}
                        </span>
                      </div>
                      <div className="text-right sm:text-left">
                        <p className="font-bricolage font-extrabold text-[#1BFF11]"
                          style={{ fontSize:"clamp(24px,5vw,34px)", lineHeight:1 }}>
                          R${fmtS(save)}
                        </p>
                        <p className="font-body text-[11px] sm:text-[12px] text-[#5C5C52] mt-0.5 sm:mt-1">que você não paga</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* ══════════════════ CTA — OFF-WHITE ══════════════════ */}
        <section className="bg-[#F7F7F2] px-5 sm:px-10 py-20 sm:py-32 relative overflow-hidden">
          <div aria-hidden className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.08]"
            style={{ background:"radial-gradient(circle, #1BFF11 0%, transparent 65%)", transform:"translate(30%, -30%)" }} />

          <div className="max-w-5xl mx-auto relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 sm:gap-10">
            <div>
              <p className="font-bricolage font-bold text-[11px] tracking-[.2em] uppercase text-[#9A9A8F] mb-4 sm:mb-5">próximo passo</p>
              <h2 className="font-bricolage font-extrabold text-[#0A0A0A] leading-[.9] mb-5 sm:mb-6"
                style={{ fontSize:"clamp(44px,8vw,100px)", letterSpacing:"clamp(-2px,-0.04em,-4px)" }}>
                Pronto pra<br />
                vender{" "}
                <span style={{ WebkitTextStroke:"2px #0A0A0A", color:"transparent" }}>certo?</span>
              </h2>
              <p className="font-body text-[14px] sm:text-[16px] text-[#9A9A8F] leading-[1.8] max-w-sm">
                Crie seu evento agora. Grátis, rápido e com a taxa mais justa do mercado.
              </p>
            </div>
            {/* Buttons: full-width on mobile, auto on desktop */}
            <div className="flex flex-col gap-3 sm:shrink-0 w-full sm:w-auto">
              <a href="/criar-evento"
                className="font-bricolage font-bold text-[14px] sm:text-[15px] px-7 sm:px-9 py-4 sm:py-5 rounded-full bg-[#0A0A0A] text-[#F7F7F2] no-underline inline-flex items-center justify-center gap-2 hover:bg-[#1a1a1a] transition-colors text-center">
                Criar evento grátis →
              </a>
              <a href="#simulador"
                className="font-bricolage font-bold text-[13px] sm:text-[14px] px-7 sm:px-9 py-4 sm:py-5 rounded-full border-[1.5px] border-[#E0E0D8] text-[#9A9A8F] no-underline text-center hover:border-[#9A9A8F] transition-colors">
                Simular de novo
              </a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}

