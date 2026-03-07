"use client";

import { useState } from "react";
import Link from "next/link";
import { GoogleLogo, ArrowLeft } from "@phosphor-icons/react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleGoogle() {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch {
      setError("Não foi possível conectar com o Google. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-off-white flex flex-col items-center justify-center p-6 relative">

      <Link
        href="/"
        className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 text-gray-500 hover:text-black transition-colors font-body text-[14px] font-medium"
      >
        <ArrowLeft size={18} weight="bold" />
        voltar
      </Link>

      <div className="w-full max-w-sm bg-white border-2 border-gray-200 rounded-[24px] p-8 md:p-10 flex flex-col items-center text-center shadow-sm">

        <h1 className="font-bricolage text-[32px] font-extrabold text-black tracking-tight leading-none mb-3 lowercase">
          bora pro rolê.
        </h1>
        <p className="font-body text-[15px] text-gray-500 mb-8 font-medium">
          Entre com o Google para descobrir as melhores festas perto de você.
        </p>

        {error && (
          <p className="w-full mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-[12px] font-body text-[13px] text-red-600">
            {error}
          </p>
        )}

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border-2 border-black bg-transparent text-black font-bricolage text-[16px] font-extrabold uppercase tracking-wide py-3.5 px-6 rounded-pill hover:bg-primary hover:border-primary transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <GoogleLogo size={22} weight="bold" />
          )}
          {loading ? "Redirecionando..." : "Continuar com Google"}
        </button>

        <p className="mt-8 font-body text-[13px] text-gray-400">
          Ao continuar, você concorda com nossos{" "}
          <Link href="/termos" className="underline hover:text-black transition-colors">
            Termos
          </Link>{" "}
          e{" "}
          <Link href="/privacidade" className="underline hover:text-black transition-colors">
            Privacidade
          </Link>.
        </p>
      </div>
    </main>
  );
}