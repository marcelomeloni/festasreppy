"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/services/userService";
import { maskCPF } from "@/lib/authHelpers";

export interface BuyerProfile {
  nome:      string;
  email:     string;
  cpf:       string;
  cpfLocked: boolean;
  loading:   boolean;
  error:     string | null;
}

const EMPTY: BuyerProfile = {
  nome:      "",
  email:     "",
  cpf:       "",
  cpfLocked: false,
  loading:   false,
  error:     null,
};

const LOADING: BuyerProfile = {
  nome:      "",
  email:     "",
  cpf:       "",
  cpfLocked: false,
  loading:   true,
  error:     null,
};

/**
 * Carrega os dados do comprador para o checkout.
 *
 * O CPF não vem do Supabase Auth (que só expõe user_metadata), e sim da tabela
 * `users` do backend — por isso exige uma requisição à API. Como a sessão é
 * reidratada de forma assíncrona, o hook espera `authLoading` terminar antes de
 * decidir: sem isso um `user` null no primeiro render deixaria o formulário
 * congelado vazio.
 *
 * Com sessão e CPF salvo, `cpfLocked` vem true: o CPF da compra passa a ser o
 * da conta, impedindo que o billing receba um CPF diferente do titular.
 */
export function useBuyerProfile(): BuyerProfile {
  const { user, loading: authLoading } = useAuth();

  const userId        = user?.id ?? null;
  const nomeFallback  = user?.user_metadata?.full_name ?? "";
  const emailFallback = user?.email ?? "";

  // Registra de qual conta o perfil foi buscado, para nunca reaproveitar o
  // resultado de um usuário anterior.
  const [state, setState] = useState<{ userId: string | null; profile: BuyerProfile | null }>({
    userId: null,
    profile: null,
  });

  useEffect(() => {
    if (authLoading || !userId) return;

    let cancelled = false;

    userService
      .getProfile(userId)
      .then(p => {
        if (cancelled) return;
        const cpf = maskCPF(p.cpf ?? "");
        setState({
          userId,
          profile: {
            nome:      p.fullName || nomeFallback,
            email:     p.email    || emailFallback,
            cpf,
            cpfLocked: cpf !== "",
            loading:   false,
            error:     null,
          },
        });
      })
      .catch(() => {
        if (cancelled) return;
        // Perfil indisponível não trava a compra: apenas perde o
        // pré-preenchimento e devolve o campo CPF editável.
        setState({
          userId,
          profile: {
            nome:      nomeFallback,
            email:     emailFallback,
            cpf:       "",
            cpfLocked: false,
            loading:   false,
            error:     "Não foi possível carregar os dados da sua conta.",
          },
        });
      });

    return () => { cancelled = true; };
  }, [userId, authLoading, nomeFallback, emailFallback]);

  if (authLoading) return LOADING;

  // Visitante: não há perfil para consultar, todos os campos seguem editáveis.
  if (!userId) return EMPTY;

  // Descasado com a conta atual (ou ainda não buscou): exibe os fallbacks.
  if (state.userId !== userId || !state.profile) {
    return { ...LOADING, nome: nomeFallback, email: emailFallback };
  }

  return state.profile;
}