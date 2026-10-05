"use client";

import { getPasswordStrengthColor, getPasswordStrengthLabel } from "@/lib/authHelpers";

interface PasswordStrengthMeterProps {
  strength: number;
}

export function PasswordStrengthMeter({ strength }: PasswordStrengthMeterProps) {
  if (!strength) return null;
  const s = strength as 0 | 1 | 2 | 3;
  return (
    <div className="mt-1.5 flex gap-1 h-1.5 items-center">
      {[1, 2, 3].map((level) => (
        <div
          key={level}
          className={`flex-1 rounded-sm transition-colors ${
            level <= s ? getPasswordStrengthColor(s) : "bg-gray-200"
          }`}
        />
      ))}
      <span className={`text-xs font-medium ml-2 ${getPasswordStrengthColor(s)}`}>
        {getPasswordStrengthLabel(s)}
      </span>
    </div>
  );
}