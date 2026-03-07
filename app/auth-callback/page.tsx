"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { SpinnerGap } from "@phosphor-icons/react";
import { supabase } from "@/contexts/AuthContext";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    const checkUserAccount = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const userId = data.session?.user?.id;
        if (!userId) throw new Error("sem sessão");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/client/auth/profile/${userId}`
        );
        const profile = await res.json();

        if (profile.hasProfile) {
          router.push("/eventos");
        } else {
          router.push("/completar-registro");
        }
      } catch (error) {
        console.error("Erro na autenticação:", error);
        router.push("/login?error=auth_failed");
      }
    };

    checkUserAccount();
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center text-center animate-pulse">
      <Image
        src="/logo_preto.png"
        alt="Reppy"
        width={140}
        height={44}
        className="h-10 w-auto object-contain mb-8"
        priority
      />

      <div className="flex items-center gap-3">
        <SpinnerGap size={24} weight="bold" className="animate-spin text-primary" />
        <h1 className="font-bricolage text-[24px] font-extrabold text-black tracking-tight lowercase">
          preparando seu rolê...
        </h1>
      </div>

      <p className="font-body text-[14px] text-gray-500 font-medium mt-3">
        verificando seus dados de acesso
      </p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <main className="min-h-screen bg-off-white flex flex-col items-center justify-center p-6">
      <Suspense fallback={
        <div className="text-gray-500 font-medium font-body">Carregando...</div>
      }>
        <AuthCallbackContent />
      </Suspense>
    </main>
  );
}