"use client";

import { useState } from "react";

// ── helpers ──────────────────────────────────────────────────────────────────
function reppyRate(price: number) {
  if (price <= 10) return 0.1;
  if (price <= 14) return 0.08;
  return 0.07;
}
const calcReppy = (p: number) => p * reppyRate(p);
const calcChe   = (p: number) => p * 0.1;
const calcSym   = (p: number) => Math.max(p * 0.1, p <= 39.9 ? 3.99 : 0);
const calcEve   = (p: number) => Math.max(p * 0.085, 2.5);

const PRESETS = [
  { label: "Repúblicada R$15", price: 15, qty: 80 },
  { label: "Calourada R$20",   price: 20, qty: 150 },
  { label: "Balada R$30",      price: 30, qty: 200 },
  { label: "Festa VIP R$50",   price: 50, qty: 120 },
  { label: "Show R$80",        price: 80, qty: 300 },
];

const COMPETITORS = [
  { id: "che", name: "Che…",  color: "#E53E3E", bgCard: "#1f0d0d", borderColor: "#3a1a1a", calc: calcChe, note: "10% fixo" },
  { id: "sym", name: "Sym…",  color: "#4299E1", bgCard: "#0c1422", borderColor: "#1a2a3a", calc: calcSym, note: "10% · mín R$3,99" },
  { id: "eve", name: "Eve…",  color: "#48BB78", bgCard: "#0c1a10", borderColor: "#1a3020", calc: calcEve, note: "8,5% · mín R$2,50" },
];

const PRICE_POINTS = [20, 30, 50];

const FAQ = [
  { q: "Tem mensalidade ou taxa fixa?",               a: "Não. Você cria a conta, publica o evento e só paga quando vende. Zero custo fixo." },
  { q: "Quem paga a taxa — eu ou o comprador?",       a: "Por padrão é descontada do repasse ao organizador. Você pode configurar para exibir separado no checkout." },
  { q: "Quando o dinheiro cai na minha conta?",       a: "Em até 3 dias úteis após o término do evento, direto na conta bancária cadastrada." },
  { q: "Posso criar eventos gratuitos?",              a: "Sim. Eventos com ingresso R$0 não geram nenhuma taxa. Crie, divulgue e gerencie a lista de graça." },
  { q: "A taxa muda depois que eu publicar o evento?",a: "Não. A taxa exibida na configuração é a taxa que vale. Sem surpresa no fechamento." },
];

// ── component ─────────────────────────────────────────────────────────────────
export default function TaxasPage() {
  const [price, setPrice]     = useState(30);
  const [qty, setQty]         = useState(200);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const reppyTotal = calcReppy(price) * qty;
  const cheTotal   = calcChe(price)   * qty;
  const symTotal   = calcSym(price)   * qty;
  const eveTotal   = calcEve(price)   * qty;
  const gross      = price * qty;

  const bars = [
    { name: "reppy", color: "#1BFF11", textColor: "#0A0A0A", total: reppyTotal },
    { name: "Che…",  color: "#E53E3E", textColor: "#fff",    total: cheTotal   },
    { name: "Sym…",  color: "#4299E1", textColor: "#fff",    total: symTotal   },
    { name: "Eve…",  color: "#48BB78", textColor: "#0A0A0A", total: eveTotal   },
  ];
  const maxBar = Math.max(...bars.map((b) => b.total));
  const fmtBRL = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

  return (
    <>
      <style>{`
        /* ── scoped to this page only, NO body overrides ── */
        .taxas-page {
          background: #0A0A0A;
          color: #F7F7F2;
          min-height: 100%;
        }

        .taxas-page input[type=range] {
          -webkit-appearance: none; appearance: none;
          width: 100%; height: 6px;
          background: #2a2a2a; border-radius: 100px; outline: none; cursor: pointer;
        }
        .taxas-page input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px; height: 22px;
          background: #1BFF11; border-radius: 50%;
          box-shadow: 0 0 0 4px rgba(27,255,17,0.2);
          transition: box-shadow .15s;
        }
        .taxas-page input[type=range]::-webkit-slider-thumb:hover {
          box-shadow: 0 0 0 8px rgba(27,255,17,0.22);
        }

        .taxas-page .bar-fill {
          transition: width .45s cubic-bezier(.4,0,.2,1);
        }

        .taxas-page .tag-green {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: var(--font-bricolage), sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: .18em;
          text-transform: uppercase;
          padding: 5px 14px; border-radius: 100px;
          background: rgba(27,255,17,0.12);
          border: 1px solid rgba(27,255,17,0.28);
          color: #1BFF11;
        }

        .taxas-page .preset-btn {
          font-family: var(--font-bricolage), sans-serif;
          font-weight: 700; font-size: 13px;
          padding: 8px 18px; border-radius: 100px;
          border: 1px solid #2a2a2a;
          background: #141414; color: #9A9A8F;
          cursor: pointer; transition: all .15s;
        }
        .taxas-page .preset-btn:hover,
        .taxas-page .preset-btn.active {
          background: #1BFF11; color: #0A0A0A; border-color: #1BFF11;
        }
      `}</style>

      <div className="taxas-page">

        {/* ── HERO ── */}
        <section style={{ padding: "100px 24px 96px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(27,255,17,0.09) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative" }}>
       
            <h1 style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 800, fontSize: "clamp(52px, 9vw, 92px)", lineHeight: 0.95, letterSpacing: "-3px", color: "#fff", marginBottom: 24 }}>
              Mais festa,<br />
              <span style={{ color: "#1BFF11" }}>menos taxa.</span>
            </h1>
            <p style={{ fontSize: 18, color: "#9A9A8F", lineHeight: 1.75, maxWidth: 500, margin: "0 auto 48px", fontFamily: "var(--font-body), sans-serif" }}>
              Sem mensalidade, sem taxa escondida, sem surpresa no fechamento.
            </p>
         
          </div>
        </section>

 

        {/* ── COMPARATIVO ── */}
        <section id="comparativo" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 0" }}>
    
          <h2 style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 800, fontSize: "clamp(36px, 5vw, 52px)", letterSpacing: "-2px", color: "#fff", lineHeight: 1, marginBottom: 12 }}>
            A conta é simples.
          </h2>
          <p style={{ fontSize: 16, color: "#9A9A8F", lineHeight: 1.7, marginBottom: 40, fontFamily: "var(--font-body), sans-serif" }}>
            Taxa por ingresso nas principais plataformas do Brasil. Dados públicos, sem enrolação.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14 }}>
            {/* reppy card */}
            <div style={{ display: "flex", flexDirection: "column", borderRadius: 24, overflow: "hidden", border: "2px solid #1BFF11", background: "#0d1a0d" }}>
              <div style={{ padding: "24px 24px 20px", borderBottom: "1px solid rgba(27,255,17,0.2)" }}>
                <p style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 800, fontSize: 30, color: "#1BFF11", marginBottom: 4 }}>reppy</p>
                <p style={{ fontFamily: "var(--font-body), sans-serif", fontSize: 13, color: "#4CAF50" }}>a partir de 7%</p>
              </div>
              {PRICE_POINTS.map((p) => (
                <div key={p} style={{ padding: "20px 24px", borderBottom: "1px solid rgba(27,255,17,0.1)" }}>
                  <p style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 700, fontSize: 11, color: "#4CAF50", letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 8 }}>Ingresso R${p}</p>
                  <p style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 800, fontSize: 34, color: "#1BFF11" }}>R${calcReppy(p).toFixed(2)}</p>
                  <p style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 700, fontSize: 12, color: "rgba(27,255,17,0.6)", marginTop: 4 }}>melhor preço ✦</p>
                </div>
              ))}
            </div>

            {/* competitor cards */}
            {COMPETITORS.map((c) => (
              <div key={c.id} style={{ display: "flex", flexDirection: "column", borderRadius: 24, overflow: "hidden", border: `1px solid ${c.borderColor}`, background: c.bgCard }}>
                <div style={{ padding: "24px 24px 20px", borderBottom: `1px solid ${c.borderColor}` }}>
                  <p style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 800, fontSize: 30, color: c.color, marginBottom: 4 }}>{c.name}</p>
                  <p style={{ fontFamily: "var(--font-body), sans-serif", fontSize: 13, color: "#9A9A8F" }}>{c.note}</p>
                </div>
                {PRICE_POINTS.map((p) => {
                  const their = c.calc(p);
                  const diff  = their - calcReppy(p);
                  return (
                    <div key={p} style={{ padding: "20px 24px", borderBottom: `1px solid ${c.borderColor}` }}>
                      <p style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 700, fontSize: 11, color: "#5C5C52", letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 8 }}>Ingresso R${p}</p>
                      <p style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 800, fontSize: 34, color: "#F7F7F2" }}>R${their.toFixed(2)}</p>
                      <p style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 700, fontSize: 12, color: "#FF6B6B", marginTop: 4 }}>+R${diff.toFixed(2)} a mais</p>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <p style={{ marginTop: 16, fontSize: 12, color: "#5C5C52", lineHeight: 1.6, fontFamily: "var(--font-body), sans-serif" }}>
            * Taxa por ingresso. Dados obtidos publicamente nos sites das plataformas. Pode haver variação conforme modalidade de pagamento.
          </p>
        </section>
                   {/* ── TAXA TABLE ── */}
        <section style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px 0" }}>
 
          <h2 style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 800, fontSize: "clamp(36px, 5vw, 52px)", letterSpacing: "-2px", color: "#fff", lineHeight: 1, marginBottom: 12 }}>
            Uma taxa justa.<br />Simples assim.
          </h2>
          <p style={{ fontSize: 16, color: "#9A9A8F", lineHeight: 1.7, marginBottom: 40, fontFamily: "var(--font-body), sans-serif" }}>
            Quanto mais caro o ingresso, menor a porcentagem. Sem mínimo abusivo.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { range: "Até R$10",    pct: 10, note: null },
              { range: "R$11 – R$14", pct: 8,  note: null },
              { range: "R$15+",       pct: 7,  note: "Taxa fixa pra sempre" },
            ].map((row) => (
              <div key={row.range} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#141414", border: "1px solid #222", borderRadius: 20, padding: "20px 28px" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 700, fontSize: 18, color: "#fff" }}>{row.range}</p>
                  {row.note && <p style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 700, fontSize: 12, color: "#1BFF11", marginTop: 4, letterSpacing: "0.04em" }}>✦ {row.note}</p>}
                </div>
                <span style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 800, fontSize: 24, background: "#1BFF11", color: "#0A0A0A", padding: "6px 20px", borderRadius: 100 }}>
                  {row.pct}%
                </span>
              </div>
            ))}
          </div>
        </section>
        {/* ── SIMULADOR ── */}
        <section id="simulador" style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px 0" }}>
    
          <h2 style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 800, fontSize: "clamp(36px, 5vw, 52px)", letterSpacing: "-2px", color: "#fff", lineHeight: 1, marginBottom: 12 }}>
            Quanto você economiza?
          </h2>
          <p style={{ fontSize: 16, color: "#9A9A8F", lineHeight: 1.7, marginBottom: 40, fontFamily: "var(--font-body), sans-serif" }}>
            Configure seu evento e veja a diferença em reais.
          </p>

          {/* presets */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40 }}>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => { setPrice(p.price); setQty(p.qty); }}
                className={`preset-btn${price === p.price && qty === p.qty ? " active" : ""}`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* sliders */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 40 }}>
            {[
              { label: "Preço do ingresso", val: price, set: setPrice, min: 5, max: 200, step: 5,  fmt: (v: number) => `R$${v}` },
              { label: "Qtd. vendida",      val: qty,   set: setQty,   min: 10, max: 1000, step: 10, fmt: (v: number) => `${v}` },
            ].map((sl) => (
              <div key={sl.label}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                  <label style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 700, fontSize: 13, color: "#9A9A8F" }}>{sl.label}</label>
                  <span style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 800, fontSize: 30, color: "#fff" }}>{sl.fmt(sl.val)}</span>
                </div>
                <input type="range" min={sl.min} max={sl.max} step={sl.step} value={sl.val} onChange={(e) => sl.set(Number(e.target.value))} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: 11, color: "#5C5C52" }}>{sl.fmt(sl.min)}</span>
                  <span style={{ fontSize: 11, color: "#5C5C52" }}>{sl.fmt(sl.max)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* gross */}
          <div style={{ background: "#141414", border: "1px solid #222", borderRadius: 20, padding: "20px 28px", textAlign: "center", marginBottom: 20 }}>
            <p style={{ fontFamily: "var(--font-body), sans-serif", fontSize: 13, color: "#9A9A8F", marginBottom: 4 }}>Receita bruta do evento</p>
            <p style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 800, fontSize: 36, color: "#fff" }}>R${fmtBRL(gross)}</p>
          </div>

          {/* bar chart */}
          <div style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", borderRadius: 24, overflow: "hidden", marginBottom: 14 }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid #1e1e1e" }}>
              <p style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 700, fontSize: 13, color: "#9A9A8F" }}>Total de taxa cobrada por plataforma</p>
            </div>
            {bars.map((b, i) => {
              const pct    = maxBar > 0 ? (b.total / maxBar) * 100 : 0;
              const saving = b.total - reppyTotal;
              return (
                <div key={b.name} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 24px", borderBottom: i < bars.length - 1 ? "1px solid #1a1a1a" : "none" }}>
                  <span style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 700, fontSize: 14, width: 54, flexShrink: 0, color: i === 0 ? "#1BFF11" : "#9A9A8F" }}>{b.name}</span>
                  <div style={{ flex: 1, height: 36, position: "relative" }}>
                    <div className="bar-fill" style={{ height: "100%", borderRadius: 100, background: b.color, width: `${Math.max(pct, 5)}%`, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 12 }}>
                      <span style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 800, fontSize: 13, color: b.textColor, whiteSpace: "nowrap" as const }}>
                        R${b.total.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                  {i === 0 ? (
                    <span style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 700, fontSize: 12, background: "rgba(27,255,17,0.15)", color: "#1BFF11", padding: "3px 10px", borderRadius: 100, flexShrink: 0 }}>menor ✦</span>
                  ) : (
                    <span style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 700, fontSize: 12, background: "rgba(255,45,45,0.13)", color: "#FF6B6B", padding: "3px 10px", borderRadius: 100, flexShrink: 0, whiteSpace: "nowrap" as const }}>+R${saving.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* savings cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
            {bars.slice(1).map((b) => {
              const save = b.total - reppyTotal;
              return (
                <div key={b.name} style={{ background: "#141414", border: "1px solid #222", borderRadius: 20, padding: "18px 20px" }}>
                  <p style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 700, fontSize: 11, color: "#5C5C52", letterSpacing: "0.08em", marginBottom: 8 }}>vs {b.name}</p>
                  <p style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 800, fontSize: 28, color: "#1BFF11" }}>R${save.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}</p>
                  <p style={{ fontFamily: "var(--font-body), sans-serif", fontSize: 12, color: "#9A9A8F", marginTop: 2 }}>a menos de taxa</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px" }}>
      
          <h2 style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 800, fontSize: "clamp(36px, 4vw, 48px)", letterSpacing: "-2px", color: "#fff", lineHeight: 1, marginBottom: 40 }}>
            Perguntas frequentes
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FAQ.map((item, i) => (
              <div key={i} style={{ background: "#141414", border: "1px solid #222", borderRadius: 20, overflow: "hidden" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left", padding: "20px 24px", background: "transparent", border: "none", cursor: "pointer", color: "#F7F7F2", fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 700, fontSize: 16 }}
                >
                  {item.q}
                  <span style={{ fontSize: 22, color: openFaq === i ? "#1BFF11" : "#9A9A8F", transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform .2s", flexShrink: 0, marginLeft: 16 }}>+</span>
                </button>
                {openFaq === i && (
                  <p style={{ fontFamily: "var(--font-body), sans-serif", fontSize: 15, color: "#9A9A8F", lineHeight: 1.75, padding: "0 24px 20px" }}>
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA BOTTOM ── */}
        <section style={{ borderTop: "1px solid #141414", padding: "96px 24px 120px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", bottom: -80, left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(27,255,17,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <h2 style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 800, fontSize: "clamp(40px, 6vw, 72px)", lineHeight: 1, letterSpacing: "-2px", color: "#fff", marginBottom: 20 }}>
              Pronto pra vender<br />
              <span style={{ color: "#1BFF11" }}>sem pagar a mais?</span>
            </h2>
            <p style={{ fontFamily: "var(--font-body), sans-serif", fontSize: 17, color: "#9A9A8F", lineHeight: 1.75, marginBottom: 40 }}>
              Crie seu evento agora. Grátis, rápido e com a taxa mais justa do mercado.
            </p>
            <a href="/criar-evento" style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 700, fontSize: 16, padding: "16px 36px", borderRadius: 100, background: "#1BFF11", color: "#0A0A0A", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              Criar evento grátis →
            </a>
          </div>
        </section>

      </div>
    </>
  );
}