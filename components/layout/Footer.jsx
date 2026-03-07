import Link from "next/link";
import Image from "next/image";
import { InstagramLogo, TiktokLogo, XLogo } from "@phosphor-icons/react/dist/ssr";

// Footer enxuto: Apenas o que importa para o usuário agora
const FOOTER_LINKS = {
  Explorar: [
    { href: "/eventos",    label: "Eventos" },
    { href: "/login",      label: "Entrar na conta" },
  ],
  "Para Organizadores": [
    { href: "/criar-evento", label: "Venda seus ingressos" },
  ],
  Legal: [
    { href: "/termos-de-uso",      label: "Termos de uso" },
    { href: "/privacidade", label: "Privacidade" },
  ],
};

const SOCIALS = [
  { href: "https://instagram.com", Icon: InstagramLogo, label: "Instagram" },
  { href: "https://tiktok.com",    Icon: TiktokLogo,    label: "TikTok" },
  { href: "https://twitter.com",   Icon: XLogo,         label: "X" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t-2 border-gray-200 mt-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Top */}
        <div className="flex flex-col md:flex-row gap-12 justify-between py-14">

          {/* Brand & Info */}
          <div className="flex flex-col gap-6 max-w-sm">
            <Link href="/" className="inline-block transition-opacity hover:opacity-80">
              <Image 
                src="/logo_preto.png" 
                alt="Reppy" 
                width={120} 
                height={38} 
                className="h-8 md:h-10 w-auto object-contain"
              />
            </Link>
            
            <p className="font-body text-[15px] font-medium text-gray-600 leading-relaxed">
              O hub da vida social universitária brasileira. Descubra as melhores festas, repúblicas e bares perto de você.
            </p>
            
            <div className="flex gap-3 mt-2">
              {SOCIALS.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="bg-white text-black border-2 border-gray-200 p-2.5 rounded-full hover:bg-primary hover:border-primary hover:text-black transition-all"
                >
                  <Icon size={20} weight="bold" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Enxutos */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10 md:gap-12">
            {Object.entries(FOOTER_LINKS).map(([group, links]) => (
              <div key={group}>
                <h4 className="font-bricolage text-[14px] font-extrabold uppercase tracking-wide text-black mb-5">
                  {group}
                </h4>
                <ul className="flex flex-col gap-3.5">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link 
                        href={link.href}
                        className="font-body text-[14px] font-medium text-gray-500 hover:text-primary-dark transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t-2 border-gray-200 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-[13px] font-semibold text-gray-400">
            © {new Date().getFullYear()} Reppy.
          </p>
          <p className="font-bricolage text-[16px] font-extrabold text-black tracking-tight uppercase">
            A sua noite começa aqui.
          </p>
        </div>
      </div>
    </footer>
  );
}