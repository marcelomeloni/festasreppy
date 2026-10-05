export function maskCPF(value: string): string {
  let v = value.replace(/\D/g, "").slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return v;
}

export function maskDate(value: string): string {
  let v = value.replace(/\D/g, "").slice(0, 8);
  v = v.replace(/(\d{2})(\d)/, "$1/$2");
  v = v.replace(/(\d{2})(\d)/, "$1/$2");
  return v;
}

export function maskPhone(value: string): string {
  let v = value.replace(/\D/g, "").slice(0, 11);
  if (v.length > 2) v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
  if (v.length > 7) v = v.replace(/(\d)(\d{4})$/, "$1-$2");
  return v;
}

export function unmaskCPF(value: string): string {
  return value.replace(/\D/g, "");
}

export function unmaskPhone(value: string): string {
  return value.replace(/\D/g, "");
}

export function validateCPF(cpf: string): boolean {
  const clean = cpf.replace(/\D/g, "");
  if (clean.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(clean)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(clean[i]) * (10 - i);
  }
  let digit1 = (sum * 10) % 11;
  if (digit1 === 10) digit1 = 0;
  if (digit1 !== parseInt(clean[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(clean[i]) * (11 - i);
  }
  let digit2 = (sum * 10) % 11;
  if (digit2 === 10) digit2 = 0;
  if (digit2 !== parseInt(clean[10])) return false;

  return true;
}

export function validateBirthDate(dateStr: string): { valid: boolean; age?: number; error?: string } {
  const clean = dateStr.replace(/\D/g, "");
  if (clean.length !== 8) return { valid: false, error: "Data inválida" };

  const day = parseInt(clean.slice(0, 2));
  const month = parseInt(clean.slice(2, 4));
  const year = parseInt(clean.slice(4, 8));

  const date = new Date(year, month - 1, day);
  if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
    return { valid: false, error: "Data inválida" };
  }

  const today = new Date();
  let age = today.getFullYear() - year;
  const monthDiff = today.getMonth() - (month - 1);
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
    age--;
  }

  if (age < 16) return { valid: false, age, error: "Idade mínima: 16 anos" };
  if (age > 100) return { valid: false, age, error: "Idade inválida" };

  return { valid: true, age };
}

export function toISO(dateBR: string): string {
  const clean = dateBR.replace(/\D/g, "");
  if (clean.length !== 8) return "";
  return `${clean.slice(4, 8)}-${clean.slice(2, 4)}-${clean.slice(0, 2)}`;
}

export type PasswordStrength = 0 | 1 | 2 | 3;

export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) return 0;
  if (password.length < 6) return 0;

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return 1;
  if (score === 2) return 1;
  if (score === 3) return 2;
  return 3;
}

export function getPasswordStrengthLabel(strength: PasswordStrength): string {
  switch (strength) {
    case 0:
      return "";
    case 1:
      return "Fraca";
    case 2:
      return "Média";
    case 3:
      return "Forte";
    default:
      return "";
  }
}

export function getPasswordStrengthColor(strength: PasswordStrength): string {
  switch (strength) {
    case 0:
      return "bg-gray-200";
    case 1:
      return "bg-red-400";
    case 2:
      return "bg-yellow-400";
    case 3:
      return "bg-green-400";
    default:
      return "bg-gray-200";
  }
}