"use client";

import Link from "next/link";

export function TermsLinks() {
  return (
    <p className="mt-8 font-body text-[13px] text-gray-400 text-center">
      Ao continuar, você concorda com nossos{" "}
      <Link href="/termos" className="underline hover:text-black transition-colors">
        Termos
      </Link>{" "}
      e{" "}
      <Link href="/privacidade" className="underline hover:text-black transition-colors">
        Privacidade
      </Link>.
    </p>
  );
}