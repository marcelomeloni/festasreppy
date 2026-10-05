"use client";

import { useState, FormEvent } from "react";
import { Eye, EyeSlash, Envelope, Lock } from "@phosphor-icons/react";
import { SpinnerGap } from "@phosphor-icons/react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { InputField } from "@/components/ui/InputField";

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchMode: () => void;
}

export function LoginForm({ onSuccess, onSwitchMode }: LoginFormProps) {
  const router = useRouter();
  const { signInWithPassword } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = (field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, identifier: value }));
    clearError("identifier");
    setError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, password: e.target.value }));
    clearError("password");
    setError(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.identifier.trim()) {
      newErrors.identifier = "Informe seu e-mail ou CPF";
    }
    if (!form.password) {
      newErrors.password = "Informe sua senha";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      await signInWithPassword(form.identifier, form.password);
      onSuccess();
    } catch (err: unknown) {
      const error = err as Error & { code?: string; status?: number };
      if (error.status === 401 || error.code === "invalid_credentials") {
        setError("E-mail/CPF ou senha inválidos.");
      } else {
        setError(error.message || "Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <InputField
        Icon={Envelope}
        type="text"
        value={form.identifier}
        onChange={handleIdentifierChange}
        placeholder="E-mail ou CPF"
        error={errors.identifier}
        required
        disabled={loading}
      />
      <InputField
        Icon={Lock}
        type={showPassword ? "text" : "password"}
        value={form.password}
        onChange={handlePasswordChange}
        placeholder="Senha"
        error={errors.password}
        required
        disabled={loading}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
            className="text-gray-400 hover:text-black transition-colors disabled:opacity-50"
          >
            {showPassword ? <EyeSlash size={20} weight="bold" /> : <Eye size={20} weight="bold" />}
          </button>
        }
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-primary text-black border-2 border-primary font-bricolage text-[16px] font-extrabold uppercase tracking-wide py-4 px-6 rounded-pill hover:bg-primary-dark hover:border-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed group mt-2"
      >
        {loading ? (
          <>
            <SpinnerGap size={20} weight="bold" className="animate-spin" />
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </button>

      <p className="text-center font-body text-[14px] text-gray-500 mt-4">
        Não tem conta?{" "}
        <button
          type="button"
          onClick={onSwitchMode}
          disabled={loading}
          className="text-primary font-semibold underline hover:text-primary-dark disabled:opacity-50"
        >
          Cadastrar
        </button>
      </p>
    </form>
  );
}