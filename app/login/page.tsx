"use client";

import { useState } from "react";
import Image from "next/image";
import { GoogleLogo, ArrowLeft } from "@phosphor-icons/react";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { DividerWithText } from "@/components/ui/DividerWithText";
import { GoogleButton } from "@/components/ui/GoogleButton";
import { TermsLinks } from "@/components/ui/TermsLinks";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

export default function LoginPage() {
  const { signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch {
      setError("Não foi possível conectar com o Google. Tente novamente.");
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    window.location.href = "/auth-callback";
  };

  return (
    <main className="min-h-screen bg-off-white flex relative">
      {/* Left Panel - Branding (hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary opacity-20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-primary opacity-10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-lg w-full h-full flex items-center justify-center">
          <div className="relative w-full h-[80vh] max-h-[700px] rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm bg-white/5 border border-white/20">
            <Image
              src="/loginimage.png"
              alt="Imagem de login"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center min-h-screen p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <h1 className="font-bricolage text-[32px] font-extrabold text-black tracking-tight mb-3 lowercase">
            bora pro rolê.
          </h1>
          <p className="font-body text-[15px] text-gray-500 mb-8 font-medium">
            {mode === "login" ? "Entre para descobrir as melhores festas." : "Crie sua conta e comece a curtir."}
          </p>

          {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

          {mode === "login" ? (
            <LoginForm onSuccess={handleSuccess} onSwitchMode={() => setMode("register")} />
          ) : (
            <RegisterForm onSuccess={handleSuccess} onSwitchMode={() => setMode("login")} />
          )}

          <DividerWithText text="ou continuar com" />
          <GoogleButton onClick={handleGoogle} loading={loading} />
          <TermsLinks />
        </div>
      </div>
    </main>
  );
}