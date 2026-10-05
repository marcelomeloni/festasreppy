import { useState, FormEvent, useEffect, useRef } from "react";
import { Eye, EyeSlash, User, Envelope, Lock, IdentificationCard, CalendarBlank, Phone, WarningCircle, Info, ShieldCheck } from "@phosphor-icons/react";
import { SpinnerGap } from "@phosphor-icons/react";
import { useAuth } from "@/contexts/AuthContext";
import { InputField } from "@/components/ui/InputField";
import { PasswordStrengthMeter } from "@/components/ui/PasswordStrengthMeter";
import {
  maskCPF,
  maskDate,
  maskPhone,
  validateCPF,
  validateBirthDate,
  unmaskCPF,
  unmaskPhone,
  toISO,
  calculatePasswordStrength,
} from "@/lib/authHelpers";

interface GuestInfo {
  isGuest: boolean;
  fullName: string;
  hasTickets: boolean;
}

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchMode: () => void;
}

export function RegisterForm({ onSuccess, onSwitchMode }: RegisterFormProps) {
  const { signUp, claimGuest, checkGuest } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [guestInfo, setGuestInfo] = useState<GuestInfo | null>(null);
  const [checkingGuest, setCheckingGuest] = useState(false);
  const guestCheckTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    cpf: "",
    birthDate: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const clearError = (field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  // Só consulta quando e-mail E CPF forem válidos: o backend exige os dois e
// responder a cada tecla permitiria enumerar contas.
const checkForGuest = async (email: string, cpf: string) => {
    if (guestCheckTimeoutRef.current) {
      clearTimeout(guestCheckTimeoutRef.current);
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const isValidCPF = unmaskCPF(cpf).length === 11 && validateCPF(cpf);

    if (!isValidEmail || !isValidCPF) {
      setGuestInfo(null);
      setCheckingGuest(false);
      return;
    }

    guestCheckTimeoutRef.current = setTimeout(async () => {
      setCheckingGuest(true);
      try {
        const result = await checkGuest(email.trim(), cpf);
        setGuestInfo(result);
      } catch {
        setGuestInfo(null);
      } finally {
        setCheckingGuest(false);
      }
    }, 600);
  };

  const handleChange = (field: string, value: string) => {
    let masked = value;
    if (field === "cpf") masked = maskCPF(value);
    else if (field === "birthDate") masked = maskDate(value);
    else if (field === "phone") masked = maskPhone(value);

    setForm((prev) => ({ ...prev, [field]: masked }));

    clearError(field);
    setError(null);

    if (field === "password") {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }

    if (field === "email" || field === "cpf") {
      checkForGuest(
        field === "email" ? masked : form.email,
        field === "cpf" ? masked : form.cpf
      );
    }
  };

  // Auto-fill fullName from guest info
  useEffect(() => {
    if (guestInfo && !form.fullName.trim()) {
      setForm((prev) => ({ ...prev, fullName: guestInfo.fullName }));
    }
  }, [guestInfo, form.fullName]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Informe seu nome completo";
    }
    if (!form.email.trim()) {
      newErrors.email = "Informe seu e-mail";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "E-mail inválido";
    }
    if (!form.password) {
      newErrors.password = "Informe uma senha";
    } else if (form.password.length < 6) {
      newErrors.password = "Mínimo 6 caracteres";
    }
    if (!form.cpf) {
      newErrors.cpf = "Informe seu CPF";
    } else if (!validateCPF(form.cpf)) {
      newErrors.cpf = "CPF inválido";
    }
    if (!form.birthDate) {
      newErrors.birthDate = "Informe sua data de nascimento";
    } else {
      const dateValidation = validateBirthDate(form.birthDate);
      if (!dateValidation.valid) {
        newErrors.birthDate = dateValidation.error || "Data inválida";
      }
    }
    if (!form.phone) {
      newErrors.phone = "Informe seu telefone";
    } else if (unmaskPhone(form.phone).length < 10) {
      newErrors.phone = "Telefone inválido";
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
      const isGuest = !!guestInfo?.isGuest;

      if (isGuest) {
        // Converte a conta de convidado: o backend exige e-mail + CPF
        // (os mesmos que a pessoa digitou no formulário).
        await claimGuest({
          email: form.email.trim(),
          cpf: form.cpf,
          password: form.password,
          fullName: form.fullName.trim(),
          birthDate: toISO(form.birthDate),
          phone: form.phone,
        });
      } else {
        // Normal registration
        await signUp({
          fullName: form.fullName.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          cpf: unmaskCPF(form.cpf),
          birthDate: toISO(form.birthDate),
          phone: unmaskPhone(form.phone),
        });
      }
      onSuccess();
    } catch (err: unknown) {
      const error = err as Error & { code?: string; status?: number };
      if (error.code === "email_conflict") {
        setErrors((prev) => ({ ...prev, email: "Este e-mail já está cadastrado." }));
      } else if (error.code === "cpf_conflict") {
        setErrors((prev) => ({ ...prev, cpf: "Este CPF já está cadastrado em outra conta." }));
      } else if (error.code === "phone_conflict") {
        setErrors((prev) => ({ ...prev, phone: "Este telefone já está cadastrado em outra conta." }));
      } else {
        setError(error.message || "Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <InputField
        Icon={User}
        type="text"
        value={form.fullName}
        onChange={(e) => handleChange("fullName", e.target.value)}
        placeholder="Nome completo"
        error={errors.fullName}
        required
        disabled={loading}
      />
      <InputField
        Icon={Envelope}
        type="email"
        value={form.email}
        onChange={(e) => handleChange("email", e.target.value)}
        placeholder="E-mail"
        error={errors.email}
        required
        disabled={loading}
        rightIcon={checkingGuest && form.email ? (
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : guestInfo?.isGuest ? (
          <ShieldCheck size={20} weight="bold" className="text-primary" />
        ) : undefined}
      />
      <InputField
        Icon={Lock}
        type={showPassword ? "text" : "password"}
        value={form.password}
        onChange={(e) => handleChange("password", e.target.value)}
        placeholder="Senha (mín. 6 caracteres)"
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
      <PasswordStrengthMeter strength={passwordStrength} />
      <InputField
        Icon={IdentificationCard}
        type="text"
        value={form.cpf}
        onChange={(e) => handleChange("cpf", e.target.value)}
        placeholder="CPF (000.000.000-00)"
        error={errors.cpf}
        required
        maxLength={14}
        disabled={loading}
        rightIcon={checkingGuest && form.cpf ? (
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : guestInfo?.isGuest ? (
          <ShieldCheck size={20} weight="bold" className="text-primary" />
        ) : undefined}
      />
      <div className="flex flex-col sm:flex-row gap-4">
        <InputField
          className="flex-1 min-w-0"
          Icon={CalendarBlank}
          type="text"
          value={form.birthDate}
          onChange={(e) => handleChange("birthDate", e.target.value)}
          placeholder="Nascimento (DD/MM/AAAA)"
          error={errors.birthDate}
          required
          maxLength={10}
          disabled={loading}
        />
        <InputField
          className="flex-1 min-w-0"
          Icon={Phone}
          type="text"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="Telefone (XX) XXXXX-XXXX"
          error={errors.phone}
          required
          maxLength={15}
          disabled={loading}
        />
      </div>

      {/* Guest detection banner */}
      {guestInfo?.isGuest && (
        <div
          className="flex items-start gap-3 p-4 rounded-[12px] bg-primary/10 border border-primary/20 animate-fadeUp"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <Info size={18} weight="bold" className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bricolage text-[14px] font-bold text-black mb-1">
              Encontramos sua compra como convidado!
            </p>
            <p className="font-body text-[13px] text-gray-600 leading-relaxed">
              {guestInfo.hasTickets
                ? "Encontramos seus ingressos com este e-mail e CPF. Crie uma senha abaixo para acessar sua conta e ver seus ingressos."
                : "Encontramos uma compra de visitante com este e-mail e CPF. Crie uma senha abaixo para converter sua conta e acessar o app."}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-[12px] font-body text-[13px] text-red-600">
          {error}
        </div>
      )}

      <div className="flex gap-2 items-start bg-gray-100 p-3 rounded-[12px]">
        <WarningCircle size={18} weight="fill" className="text-gray-400 shrink-0 mt-0.5" />
        <p className="font-body text-[12px] text-gray-500 leading-snug font-medium">
          Eventos <strong className="text-black">Open Bar</strong> exigem +18. Use sua data de nascimento real para evitar barragem na porta.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-primary text-black border-2 border-primary font-bricolage text-[16px] font-extrabold uppercase tracking-wide py-4 px-6 rounded-pill hover:bg-primary-dark hover:border-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed group mt-2"
      >
        {loading ? (
          <>
            <SpinnerGap size={20} weight="bold" className="animate-spin" />
            {guestInfo?.isGuest ? "Convertendo conta..." : "Cadastrando..."}
          </>
        ) : (
          guestInfo?.isGuest ? "Converter para conta" : "Cadastrar"
        )}
      </button>

      <p className="text-center font-body text-[14px] text-gray-500 mt-4">
        Já tem conta?{" "}
        <button
          type="button"
          onClick={onSwitchMode}
          disabled={loading}
          className="text-primary font-semibold underline hover:text-primary-dark disabled:opacity-50"
        >
          Entrar
        </button>
      </p>
    </form>
  );
}