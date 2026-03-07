"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, BellSlash, SpinnerGap } from "@phosphor-icons/react";
import { useAuth } from "@/contexts/AuthContext";
import { organizerService } from "@/services/organizerService";

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-fadeUp">
      <div className="flex items-center gap-3 bg-black text-white px-5 py-3.5 rounded-pill shadow-xl font-body text-[14px] font-semibold whitespace-nowrap">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors font-bold text-[16px] leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}

interface FollowButtonProps {
  slug:            string;
  initialFollowing?: boolean;
  onFollowChange?: (following: boolean) => void;
}

export default function FollowButton({
  slug,
  initialFollowing = false,
  onFollowChange,
}: FollowButtonProps) {
  const router              = useRouter();
  const { user }            = useAuth();
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading]     = useState(false);
  const [toast, setToast]         = useState<string | null>(null);

  // Checa o status real pelo Client para contornar a falta de token no Server Component
  useEffect(() => {
    if (user) {
      organizerService.getOrganizerDetail(slug)
        .then((res) => {
          if (res.organizer && res.organizer.isFollowing !== undefined) {
            setFollowing(res.organizer.isFollowing);
          }
        })
        .catch(() => {});
    }
  }, [user, slug]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  async function handleClick() {
    if (!user) {
      showToast("Faça login para seguir organizadores");
      return;
    }

    setLoading(true);
    // Optimistic UI: inverte o estado visual instantaneamente
    const newFollowingStatus = !following;
    setFollowing(newFollowingStatus);
    onFollowChange?.(newFollowingStatus);

    try {
      if (following) {
        await organizerService.unfollow(slug);
      } else {
        await organizerService.follow(slug);
      }
    } catch {
      // Reverte caso a API dê erro
      setFollowing(!newFollowingStatus);
      onFollowChange?.(!newFollowingStatus);
      showToast("Erro ao atualizar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading}
        className={`
          flex items-center gap-2 px-5 py-2.5 rounded-pill
          font-display text-[14px] font-bold transition-all border-2
          disabled:opacity-60 disabled:cursor-not-allowed
          ${following
            ? "bg-primary border-primary text-black hover:bg-primary-dark hover:border-primary-dark"
            : "bg-black border-black text-white hover:bg-primary hover:border-primary hover:text-black"
          }
        `}
      >
        {loading ? (
          <SpinnerGap size={16} weight="bold" className="animate-spin" />
        ) : following ? (
          <BellSlash size={16} weight="bold" />
        ) : (
          <Bell size={16} weight="bold" />
        )}
        {following ? "seguindo" : "seguir"}
      </button>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
}