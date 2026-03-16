'use client'

import { LockKey, SpinnerGap } from '@phosphor-icons/react'
import { type BlockedUser } from '@/services/radarService'

interface BlockedUsersListProps {
  users:        BlockedUser[]
  loading:      boolean
  unblockingId: string | null
  onUnblock:    (userId: string) => void
}

export function BlockedUsersList({ users, loading, unblockingId, onUnblock }: BlockedUsersListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <SpinnerGap size={32} weight="bold" className="animate-spin text-[#9A9A8F]" />
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-[40px]">🔓</span>
        <p className="font-bricolage text-[18px] font-extrabold text-[#0A0A0A] mt-4 mb-1">
          Nenhum usuário bloqueado.
        </p>
        <p className="font-body text-sm text-[#9A9A8F]">
          Quando você bloquear alguém, vai aparecer aqui.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {users.map(user => {
        const isUnblocking = unblockingId === user.userId
        return (
          <div key={user.userId} className="bg-white rounded-[16px] px-4 py-3 flex items-center gap-3 border border-[#E0E0D8]">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#F0F0EB] shrink-0">
              {user.avatarUrl
                ? <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-[18px]">👤</div>
              }
            </div>
            <span className="font-bricolage text-[15px] font-extrabold text-[#0A0A0A] flex-1 truncate">
              {user.name}
            </span>
            <button
              onClick={() => onUnblock(user.userId)}
              disabled={isUnblocking}
              className={`shrink-0 flex items-center gap-1.5 font-body text-[12px] font-bold px-3 py-1.5 rounded-full border transition-all
                ${isUnblocking
                  ? 'opacity-50 cursor-not-allowed bg-[#F0F0EB] border-[#E0E0D8] text-[#9A9A8F]'
                  : 'bg-[#F0F0EB] border-[#E0E0D8] text-[#5C5C52] hover:bg-[#E0E0D8] hover:text-[#0A0A0A]'
                }`}
            >
              {isUnblocking
                ? <SpinnerGap size={12} weight="bold" className="animate-spin" />
                : <LockKey size={12} weight="bold" />
              }
              {isUnblocking ? 'Desbloqueando...' : 'Desbloquear'}
            </button>
          </div>
        )
      })}
      <p className="text-center font-body text-[12px] text-[#9A9A8F] mt-4 mb-2">
        {users.length} usuário{users.length > 1 ? 's' : ''} bloqueado{users.length > 1 ? 's' : ''}.
      </p>
    </div>
  )
}