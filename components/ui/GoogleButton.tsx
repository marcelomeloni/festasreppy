"use client";

import { GoogleLogo, SpinnerGap } from "@phosphor-icons/react";

interface GoogleButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function GoogleButton({ onClick, loading = false, disabled = false }: GoogleButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className="w-full flex items-center justify-center gap-3 border-2 border-black bg-transparent text-black font-bricolage text-[16px] font-extrabold uppercase tracking-wide py-3.5 px-6 rounded-pill hover:bg-primary hover:border-primary transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
      ) : (
        <GoogleLogo size={22} weight="bold" />
      )}
      {loading ? "Redirecionando..." : "Continuar com Google"}
    </button>
  );
}