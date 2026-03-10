import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Ticket,
  UsersThree,
  House,
  Lightning,
  ChartLineUp,
  GraduationCap,
} from "@phosphor-icons/react/dist/ssr";

const TICKER_ITEMS = [
  "festas", "repúblicas", "calouradas", "baladas",
  "barzinhos", "shows", "open bar",
"ingressos", "eventos", "galera",
];

const AUDIENCES = [
  {
    Icon: GraduationCap,
    tag: "pra você",
    title: "Estudante",
    desc: "Descubra o que rola perto da sua faculdade. Filtra por cidade, categoria e data. Pega ingresso em segundos.",
    cta: "explorar eventos",
    href: "/eventos",
    dark: false,
  },
  {
    Icon: House,
    tag: "pra sua rep",
    title: "Morador de Rep",
    desc: "Sua república tem festa? A Reppy coloca no mapa. Venda ingressos, divulga o evento e enche a casa.",
    cta: "criar evento",
    href: "/criar-evento",
    dark: true,
  },
  {
    Icon: ChartLineUp,
    tag: "pra seu negócio",
    title: "Organizador",
    desc: "Dashboard completo, venda de ingressos, relatórios em tempo real. Tudo que você precisa pra fazer a noite acontecer.",
    cta: "começar agora",
    href: "/cadastro",
    dark: false,
  },
];

const STEPS = [
  { n: "01", title: "Cria sua conta",       desc: "Leva 30 segundos. Só o básico." },
  { n: "02", title: "Encontra seu rolê",    desc: "Filtra por cidade, data ou categoria. Ou deixa a gente recomendar." },
  { n: "03", title: "Pega o ingresso",      desc: "Pagamento rápido. QR Code no celular. Chega e aproveita." },
];

const STATS = [
  { value: "50k+",  label: "universitários" },
  { value: "1.2k+", label: "eventos por mês" },
  { value: "800+",  label: "repúblicas" },
  { value: "12",    label: "cidades" },
];

export default function HomePage() {
  return (
    <div className="bg-off-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative bg-black min-h-[92vh] flex flex-col justify-between overflow-hidden">

        {/* grain overlay */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "180px" }} />

       

        <div className="max-w-6xl mx-auto px-6 w-full flex-1 flex flex-col justify-center gap-10 py-20">

     

          {/* headline — Bricolage Grotesque aqui */}
          <div>
            <h1
              className="font-bricolage font-extrabold text-white leading-[0.92]"
              style={{ fontSize: "clamp(72px, 13vw, 168px)", letterSpacing: "-4px" }}
            >
              de rep
            </h1>
            <h1
              className="font-bricolage font-extrabold text-primary leading-[0.92]"
              style={{ fontSize: "clamp(72px, 13vw, 168px)", letterSpacing: "-4px" }}
            >
              pra rep.
            </h1>
          </div>

          {/* sub + CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-8">
            <p className="font-body text-base text-gray-500 leading-relaxed max-w-xs">
              Festas, baladas, calouradas —
              tudo num lugar só. Pega seu ingresso
              e vai aproveitar.
            </p>
            <Link
              href="/eventos"
              className="flex items-center gap-2 font-display font-extrabold text-black bg-primary hover:bg-primary-dark px-7 py-4 rounded-pill transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 tracking-tight text-[15px]"
            >
              explorar eventos
              <ArrowRight size={15} weight="bold" />
            </Link>
          </div>
        </div>

      </section>

      {/* ── TICKER ── */}
      <div className="bg-primary border-y-2 border-black py-3 overflow-hidden">
        <div className="flex gap-8 whitespace-nowrap w-max" style={{ animation: "ticker 20s linear infinite" }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="font-display font-extrabold text-black text-sm uppercase tracking-[0.15em] flex items-center gap-8">
              {item}<span className="opacity-30">✦</span>
            </span>
          ))}
        </div>
        <style>{`@keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-33.333%)} }`}</style>
      </div>

      {/* ── PARA QUEM É ── */}
      <section className="py-28 max-w-6xl mx-auto px-6">
        <div className="mb-16">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4">pra todo mundo</p>
          <h2
            className="font-display font-extrabold text-black leading-none"
            style={{ fontSize: "clamp(38px, 5vw, 66px)", letterSpacing: "-2px" }}
          >
            feito pra você,<br />
            <span className="text-primary">seja quem for.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AUDIENCES.map(({ Icon, tag, title, desc, cta, href, dark }) => (
            <div
              key={title}
              className={`flex flex-col justify-between gap-10 p-8 rounded-card-lg border transition-all duration-200 hover:-translate-y-1 ${
                dark
                  ? "bg-black border-black text-white"
                  : "bg-off-white border-gray-200 text-black hover:border-gray-400"
              }`}
            >
              <div className="flex flex-col gap-6">
                <div className="flex items-start justify-between">
                  <span className={`flex items-center justify-center w-10 h-10 rounded-card-sm bg-primary`}>
                    <Icon size={20} weight="bold" className="text-black" />
                  </span>
                  <span className={`font-body text-[11px] font-semibold uppercase tracking-widest ${dark ? "text-gray-600" : "text-gray-400"}`}>
                    {tag}
                  </span>
                </div>
                <div>
                  <h3
                    className="font-display font-extrabold leading-none tracking-tight mb-3"
                    style={{ fontSize: "clamp(28px, 2.5vw, 36px)", letterSpacing: "-1px" }}
                  >
                    {title}
                  </h3>
                  <p className={`font-body text-sm leading-relaxed ${dark ? "text-gray-400" : "text-gray-600"}`}>
                    {desc}
                  </p>
                </div>
              </div>
              <Link
                href={href}
                className={`flex items-center gap-1.5 font-display text-sm font-bold tracking-tight w-fit transition-colors ${
                  dark ? "text-primary" : "text-black hover:text-primary"
                }`}
              >
                {cta}
                <ArrowRight size={14} weight="bold" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section className="bg-black py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-gray-600 mb-4">simples assim</p>
            <h2
              className="font-display font-extrabold text-white leading-none"
              style={{ fontSize: "clamp(38px, 5vw, 66px)", letterSpacing: "-2px" }}
            >
              três passos.<br />
              <span className="text-primary">uma noite.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} className="bg-black p-10 flex flex-col gap-6">
                <span
                  className="font-display font-extrabold text-primary leading-none"
                  style={{ fontSize: "56px", letterSpacing: "-2px" }}
                >
                  {n}
                </span>
                <div>
                  <h3 className="font-display font-extrabold text-white text-2xl tracking-tight mb-2" style={{ letterSpacing: "-0.5px" }}>
                    {title}
                  </h3>
                  <p className="font-body text-sm text-gray-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MANIFESTO — Bricolage aqui ── */}
      <section className="py-32 max-w-6xl mx-auto px-6">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-8">nosso jeito</p>
        <blockquote
          className="font-bricolage font-extrabold text-black leading-[1.0]"
          style={{ fontSize: "clamp(30px, 4vw, 56px)", letterSpacing: "-2px" }}
        >
          "A gente não vende ingresso.{" "}
          <span className="text-primary">A gente conecta pessoas</span>
          {" "}— de rep pra rep, de galera pra galera, de hoje pra uma noite que fica na memória."
        </blockquote>

      </section>

      {/* ── FEATURES ── */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { Icon: MapPin,     label: "Localização inteligente", desc: "Eventos perto de você." },
            { Icon: Ticket,     label: "Ingresso em segundos",    desc: "Sem fila, sem stress." },
            { Icon: UsersThree, label: "Comunidade ativa",        desc: "Galera real, eventos reais." },
            { Icon: Lightning,  label: "Notificações na hora",    desc: "Nada passa batido." },
          ].map(({ Icon, label, desc }) => (
            <div key={label} className="flex flex-col gap-4 p-6 bg-off-white rounded-card-md border border-gray-200 hover:border-gray-400 transition-all">
              <span className="flex items-center justify-center w-9 h-9 bg-primary rounded-lg shrink-0">
                <Icon size={17} weight="bold" />
              </span>
              <div>
                <p className="font-display font-bold text-black text-sm tracking-tight leading-tight mb-1">{label}</p>
                <p className="font-body text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL — Bricolage aqui ── */}
      <section className="bg-black py-36 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "180px" }} />
        <div className="absolute bottom-[-120px] left-[-120px] w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(27,255,17,0.14) 0%, transparent 65%)" }} />

        <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col items-center text-center gap-8">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-gray-600">
            a sua noite começa aqui
          </p>
          <h2
            className="font-bricolage font-extrabold text-white leading-none"
            style={{ fontSize: "clamp(52px, 9vw, 120px)", letterSpacing: "-4px" }}
          >
            tá esperando<br />
            <span className="text-primary">o quê?</span>
          </h2>
          <p className="font-body text-base text-gray-500 max-w-sm leading-relaxed">
            Cria sua conta grátis e descobre o que rolê na sua cidade hoje à noite.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
            <Link
              href="/cadastro"
              className="flex items-center gap-2 font-display font-extrabold text-black bg-primary hover:bg-primary-dark px-8 py-4 rounded-pill transition-all hover:scale-[1.02] active:scale-[0.98] tracking-tight text-[15px]"
            >
              criar conta grátis
              <ArrowRight size={15} weight="bold" />
            </Link>
            <Link
              href="/eventos"
              className="flex items-center gap-2 font-display font-bold text-white border border-white/20 hover:border-white/50 px-8 py-4 rounded-pill transition-all tracking-tight text-[15px]"
            >
              ver eventos
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
} 
