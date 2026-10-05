"use client";

import { WarningCircle } from "@phosphor-icons/react";
import type { ComponentType } from "react";

interface InputFieldProps {
  label?: string;
  Icon?: ComponentType<{ size?: number; weight?: "regular" | "bold" | "fill" | "light" | "thin" | "duotone"; className?: string }>;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  required?: boolean;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
}

export function InputField({
  label,
  Icon,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  leftIcon,
  rightIcon,
  required = false,
  maxLength,
  disabled = false,
  className = "",
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="font-body text-[13px] font-medium text-gray-600">{label}</label>}
      <div className="relative">
        {Icon && (
          <Icon
            size={20}
            weight="bold"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
        )}
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{leftIcon}</div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          maxLength={maxLength}
          disabled={disabled}
          className={`
            w-full font-body text-[15px] font-medium bg-gray-100 text-black
            placeholder:text-gray-400 pr-4 py-3.5 rounded-[12px]
            border-2 focus:bg-white focus:outline-none transition-all
            ${Icon || leftIcon ? "pl-12" : "pl-4"}
            ${rightIcon ? "pr-12" : ""}
            ${error
              ? "border-red-400 bg-red-50 focus:border-red-400"
              : "border-transparent focus:border-primary"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${className}
          `}
        />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">{rightIcon}</div>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 font-body text-[12px] font-semibold text-red-500 -mt-2 px-1">
          <WarningCircle size={13} weight="fill" className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}