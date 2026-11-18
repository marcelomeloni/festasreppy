import { DM_Sans, Plus_Jakarta_Sans, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { LocationProvider } from "@/contexts/LocationContext";
import { AuthProvider } from "@/contexts/AuthContext";
import {
  DEFAULT_OG_IMAGE,
  HOME_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  organizationSchema,
  webSiteSchema,
} from "@/lib/seo";

const dmSans = DM_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Reppy — Eventos, festas e ingressos universitários",
    template: "%s | Reppy",
  },
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE_NAME,
    url: "/",
    title: "Reppy — Eventos, festas e ingressos universitários",
    description: HOME_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Reppy — eventos e festas universitárias",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reppy — Eventos, festas e ingressos universitários",
    description:
      "Descubra festas, baladas e eventos universitários perto de você e garanta seu ingresso.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body
        className={`${dmSans.variable} ${plusJakartaSans.variable} ${bricolage.variable} font-body bg-off-white text-black antialiased flex flex-col min-h-screen`}
      >
        <JsonLd data={[organizationSchema, webSiteSchema]} />
        <AuthProvider>
          <LocationProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}