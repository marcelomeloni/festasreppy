"use client";
// components/checkout/BuyerForm.jsx

import { useState } from "react";

function formatCPF(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function validateCPF(cpf) {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1+$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(digits[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  return rest === parseInt(digits[10]);
}

function InputField({ label, id, type = "text", value, onChange, onBlur, error, placeholder, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-body text-[13px] font-semibold text-black"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3 font-body text-[15px] text-black bg-white
          border-2 rounded-card-sm outline-none transition-all
          ${error ? "border-red shadow-[0_0_0_3px_rgba(255,45,45,0.08)]" : "border-gray-200"}
          focus:shadow-[0_0_0_3px_rgba(27,255,17,0.12)] focus:border-primary focus:outline-none
        `}
      />
      {error && (
        <p className="font-body text-[12px] text-red flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="font-body text-[12px] text-gray-400">
          {hint}
        </p>
      )}
    </div>
  );
}

export default function BuyerForm({ data, onChange, errors, touched, onBlur }) {
  return (
    <div className="rounded-card-md border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-full bg-black text-primary flex items-center justify-center text-[13px] font-bold">
          1
        </div>
        <h3 className="font-display text-[16px] font-bold text-black">
          Seus dados
        </h3>
      </div>

      <div className="flex flex-col gap-4">
        <InputField
          label="Nome completo"
          id="nome"
          value={data.nome}
          onChange={(e) => onChange("nome", e.target.value)}
          onBlur={() => onBlur("nome")}
          error={touched.nome ? errors.nome : null}
          placeholder="Como aparece no documento"
        />

        <InputField
          label="E-mail"
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
          onBlur={() => onBlur("email")}
          error={touched.email ? errors.email : null}
          placeholder="seu@email.com"
          hint="Seu ingresso chega aqui"
        />

        <InputField
          label="CPF"
          id="cpf"
          value={data.cpf}
          onChange={(e) => onChange("cpf", formatCPF(e.target.value))}
          onBlur={() => onBlur("cpf")}
          error={touched.cpf ? errors.cpf : null}
          placeholder="000.000.000-00"
          hint="Necessário para emissão do ingresso"
        />
      </div>

      <p className="mt-4 font-body text-[12px] text-gray-400 flex items-center gap-1.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        Seus dados são protegidos e nunca compartilhados com terceiros.
      </p>
    </div>
  );
}

export { validateCPF };