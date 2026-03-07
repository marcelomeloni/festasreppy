"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight, IdentificationCard, CalendarBlank,
  WarningCircle, SpinnerGap, Phone,
} from "@phosphor-icons/react";
import { supabase } from "@/contexts/AuthContext";

// ── Helpers ───────────────────────────────────────────────────────────────────

function toISO(dataBR: string): string {
  const [d, m, y] = dataBR.split("/");
  return `${y}-${m}-${d}`;
}

function toBR(dateISO: string): string {
  if (!dateISO) return "";
  const [y, m, d] = dateISO.split("-");
  return `${d}/${m}/${y}`;
}

function maskCPF(value: string): string {
  let v = value.replace(/\D/g, "").slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return v;
}

function maskDate(value: string): string {
  let v = value.replace(/\D/g, "").slice(0, 8);
  v = v.replace(/(\d{2})(\d)/, "$1/$2");
  v = v.replace(/(\d{2})(\d)/, "$1/$2");
  return v;
}

function maskPhone(value: string): string {
  let v = value.replace(/\D/g, "").slice(0, 11);
  if (v.length > 2) v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
  if (v.length > 7) v = v.replace(/(\d)(\d{4})$/, "$1-$2");
  return v;
}

// ── Componente de erro inline ─────────────────────────────────────────────────

function FieldError({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-1.5 font-body text-[12px] font-semibold text-red-500 -mt-2 px-1">
      <WarningCircle size={13} weight="fill" className="shrink-0" />
      {message}
    </p>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CompletarRegistroPage() {
  const router = useRouter();

  const [cpf, setCpf]                       = useState("");
  const [dataNascimento, setDataNascimento]   = useState("");
  const [telefone, setTelefone]             = useState("");
  const [userId, setUserId]                 = useState("");
  const [fullName, setFullName]             = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isLoading, setIsLoading]           = useState(false);

  // Erros inline por campo
  const [cpfError, setCpfError]       = useState<string | null>(null);
  const [phoneError, setPhoneError]   = useState<string | null>(null);
  const [genericError, setGenericError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const { data } = await supabase.auth.getSession();
      const uid = data.session?.user?.id;
      if (!uid) { router.replace("/login"); return; }

      setUserId(uid);
      setFullName(data.session?.user?.user_metadata?.full_name ?? "");

      try {
        const res     = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/client/auth/profile/${uid}`);
        const profile = await res.json();
        if (profile.hasProfile) { router.replace("/eventos"); return; }
        if (profile.cpf)       setCpf(profile.cpf);
        if (profile.birthDate) setDataNascimento(toBR(profile.birthDate));
        if (profile.phone)     setTelefone(maskPhone(profile.phone));
      } catch {
        // silencia — formulário fica vazio
      } finally {
        setLoadingProfile(false);
      }
    }
    loadProfile();
  }, [router]);

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();

    // Limpa erros anteriores
    setCpfError(null);
    setPhoneError(null);
    setGenericError(null);
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/client/auth/complete-profile`,
        {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            fullName,
            cpf,
            birthDate: toISO(dataNascimento),
            phone:     telefone,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        // Roteia o erro para o campo certo
        if (res.status === 409) {
          if (data.code === "cpf_conflict") {
            setCpfError("Este CPF já está cadastrado em outra conta.");
          } else if (data.code === "phone_conflict") {
            setPhoneError("Este telefone já está cadastrado em outra conta.");
          } else {
            setGenericError(data.error ?? "Conflito de dados.");
          }
        } else {
          setGenericError(data.error ?? "Erro ao salvar. Tente novamente.");
        }
        return;
      }

      router.push("/eventos");
    } catch {
      setGenericError("Erro de conexão. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    cpf.length === 14 &&
    dataNascimento.length === 10 &&
    telefone.length >= 14 &&
    !cpfError &&
    !phoneError;

  if (loadingProfile) {
    return (
      <main className="min-h-screen bg-off-white flex items-center justify-center">
        <SpinnerGap size={32} weight="bold" className="animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-off-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary opacity-20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-sm bg-white border-2 border-gray-200 rounded-[24px] p-8 md:p-10 shadow-sm relative z-10">

        <div className="mb-8">
          <h1 className="font-bricolage text-[32px] font-extrabold text-black tracking-tight leading-none mb-3 lowercase">
            só mais um detalhe.
          </h1>
          <p className="font-body text-[15px] text-gray-500 font-medium">
            Precisamos de mais alguns dados para emitir seus ingressos com segurança.
          </p>
        </div>

        <form onSubmit={handleSalvar} className="flex flex-col gap-5">

          {/* CPF */}
          <div className="flex flex-col gap-1.5">
            <div className="relative">
              <IdentificationCard
                size={20}
                weight="bold"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="CPF (000.000.000-00)"
                value={cpf}
                onChange={e => { setCpfError(null); setCpf(maskCPF(e.target.value)); }}
                className={`
                  w-full font-body text-[15px] font-medium bg-gray-100 text-black
                  placeholder:text-gray-400 pl-12 pr-4 py-3.5 rounded-[12px]
                  border-2 focus:bg-white focus:outline-none transition-all
                  ${cpfError
                    ? "border-red-400 bg-red-50 focus:border-red-400"
                    : "border-transparent focus:border-primary"
                  }
                `}
                required
              />
            </div>
            {cpfError && <FieldError message={cpfError} />}
          </div>

          {/* Telefone */}
          <div className="flex flex-col gap-1.5">
            <div className="relative">
              <Phone
                size={20}
                weight="bold"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Telefone ou WhatsApp"
                value={telefone}
                onChange={e => { setPhoneError(null); setTelefone(maskPhone(e.target.value)); }}
                className={`
                  w-full font-body text-[15px] font-medium bg-gray-100 text-black
                  placeholder:text-gray-400 pl-12 pr-4 py-3.5 rounded-[12px]
                  border-2 focus:bg-white focus:outline-none transition-all
                  ${phoneError
                    ? "border-red-400 bg-red-50 focus:border-red-400"
                    : "border-transparent focus:border-primary"
                  }
                `}
                required
              />
            </div>
            {phoneError && <FieldError message={phoneError} />}
          </div>

          {/* Data de nascimento */}
          <div className="relative">
            <CalendarBlank
              size={20}
              weight="bold"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Nascimento (DD/MM/AAAA)"
              value={dataNascimento}
              onChange={e => setDataNascimento(maskDate(e.target.value))}
              className="w-full font-body text-[15px] font-medium bg-gray-100 text-black placeholder:text-gray-400 pl-12 pr-4 py-3.5 rounded-[12px] border-2 border-transparent focus:border-primary focus:bg-white focus:outline-none transition-all"
              required
            />
          </div>

          {/* Erro genérico */}
          {genericError && (
            <p className="px-4 py-3 bg-red-50 border border-red-200 rounded-[12px] font-body text-[13px] text-red-600">
              {genericError}
            </p>
          )}

          {/* Aviso idade */}
          <div className="flex gap-2 items-start bg-gray-100 p-3 rounded-[12px]">
            <WarningCircle size={18} weight="fill" className="text-gray-400 shrink-0 mt-0.5" />
            <p className="font-body text-[12px] text-gray-500 leading-snug font-medium">
              Eventos <strong className="text-black">Open Bar</strong> exigem +18. Use sua data de nascimento real para evitar barragem na porta.
            </p>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-black border-2 border-primary font-bricolage text-[16px] font-extrabold uppercase tracking-wide py-4 px-6 rounded-pill hover:bg-primary-dark hover:border-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed group mt-2"
          >
            {isLoading ? (
              <><SpinnerGap size={20} weight="bold" className="animate-spin" />salvando...</>
            ) : (
              <>finalizar cadastro<ArrowRight size={20} weight="bold" className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>

        </form>
      </div>
    </main>
  );
}