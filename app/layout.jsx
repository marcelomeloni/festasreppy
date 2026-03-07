import { DM_Sans, Plus_Jakarta_Sans, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { LocationProvider } from "@/contexts/LocationContext";
import { AuthProvider } from "@/contexts/AuthContext";

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
  title: "Reppy — rolês universitários",
  description: "O hub da vida social universitária brasileira.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body
        className={`${dmSans.variable} ${plusJakartaSans.variable} ${bricolage.variable} font-body bg-off-white text-black antialiased flex flex-col min-h-screen`}
      >
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