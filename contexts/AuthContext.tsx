"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@supabase/supabase-js";
import type { User, Session, SupabaseClient } from "@supabase/supabase-js";

export const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithPassword: (identifier: string, password: string) => Promise<void>;
  signUp: (data: RegisterData) => Promise<void>;
  checkGuest: (email: string, cpf: string) => Promise<CheckGuestResponse | null>;
  claimGuest: (data: ClaimGuestData) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  cpf: string;
  birthDate: string;
  phone: string;
}

export interface ClaimGuestData {
  email: string;
  cpf: string;
  password: string;
  fullName: string;
  birthDate: string;
  phone: string;
}

export interface CheckGuestResponse {
  isGuest: boolean;
  fullName: string;
  hasTickets: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth-callback`,
      },
    });
  }

  async function signInWithPassword(identifier: string, password: string) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const res = await fetch(`${API_URL}/client/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      const error = new Error(data.error || "Erro ao fazer login") as Error & { code?: string; status?: number };
      error.code = data.code;
      error.status = res.status;
      throw error;
    }

    const { accessToken, refreshToken } = data;
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  async function signUp(data: RegisterData) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    const registerRes = await fetch(`${API_URL}/client/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      }),
    });

    const registerData = await registerRes.json();

    if (!registerRes.ok) {
      const error = new Error(registerData.error || "Erro ao criar conta") as Error & { code?: string; status?: number };
      error.code = registerData.code;
      error.status = registerRes.status;
      throw error;
    }

    const { accessToken, refreshToken } = registerData;

    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const profileRes = await fetch(`${API_URL}/client/auth/complete-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        fullName: data.fullName,
        cpf: data.cpf.replace(/\D/g, ""),
        birthDate: data.birthDate,
        phone: data.phone.replace(/\D/g, ""),
      }),
    });

    const profileData = await profileRes.json();

    if (!profileRes.ok) {
      const error = new Error(profileData.error || "Erro ao completar perfil") as Error & { code?: string; status?: number };
      error.code = profileData.code;
      error.status = profileRes.status;
      throw error;
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function checkGuest(email: string, cpf: string): Promise<CheckGuestResponse | null> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    // POST (não GET): e-mail e CPF não devem aparecer na query string,
    // senão ficam registrados nos logs de acesso do servidor.
    const res = await fetch(`${API_URL}/client/auth/check-guest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, cpf: cpf.replace(/\D/g, "") }),
    });

    const data = await res.json();

    if (!res.ok) {
      const error = new Error(data.error || "Erro ao verificar conta guest") as Error & { code?: string; status?: number };
      error.code = data.code;
      error.status = res.status;
      throw error;
    }

    if (!data.isGuest) {
      return null;
    }

    return data;
  }

  async function claimGuest(data: ClaimGuestData) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const res = await fetch(`${API_URL}/client/auth/claim-guest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email,
        cpf: data.cpf.replace(/\D/g, ""),
        password: data.password,
        fullName: data.fullName,
        birthDate: data.birthDate,
        phone: data.phone.replace(/\D/g, ""),
      }),
    });

    const payload = await res.json();

    if (!res.ok) {
      const error = new Error(payload.error || "Erro ao converter conta") as Error & { code?: string; status?: number };
      error.code = payload.code;
      error.status = res.status;
      throw error;
    }

    const { accessToken, refreshToken } = payload;
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, signInWithPassword, signUp, checkGuest, claimGuest, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}