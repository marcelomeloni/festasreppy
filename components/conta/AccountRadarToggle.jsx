'use client'

import { useState } from 'react'
import { Broadcast } from '@phosphor-icons/react'

export default function AccountRadarToggle({ initialValue = false, onToggle }) {
  const [active, setActive] = useState(initialValue)

  function handleToggle() {
    const next = !active
    setActive(next)
    onToggle?.(next)
  }

  return (
    <div className={`
      flex items-center gap-4 p-4 rounded-[16px] border-[1.5px] transition-colors duration-200
      ${active
        ? 'bg-[#1BFF11] border-[#1BFF11]'
        : 'bg-white border-[#E0E0D8]'
      }
    `}>

      {/* Ícone */}
      <div className={`
        shrink-0 w-10 h-10 rounded-[12px] flex items-center justify-center transition-colors duration-200
        ${active ? 'bg-[#0FD40A]' : 'bg-[#F0F0EB]'}
      `}>
        <Broadcast size={20} weight="fill" color={active ? '#0A0A0A' : '#9A9A8F'} />
      </div>

      {/* Texto */}
      <div className="flex-1 min-w-0">
        <p className={`font-body text-[14px] font-semibold leading-tight ${active ? 'text-[#0A0A0A]' : 'text-[#0A0A0A]'}`}>
          Modo Radar
        </p>
        <p className={`font-body text-[12px] leading-tight mt-0.5 ${active ? 'text-[#0A6600]' : 'text-[#9A9A8F]'}`}>
          {active
            ? 'Você aparece para outros no Reppy Radar'
            : 'Você está invisível no Reppy Radar'
          }
        </p>
      </div>

      {/* Toggle */}
      <button
        type="button"
        onClick={handleToggle}
        role="switch"
        aria-checked={active}
        className={`
          relative shrink-0 w-[44px] h-[26px] rounded-full border-none cursor-pointer
          transition-colors duration-200 overflow-hidden
          ${active ? 'bg-[#0A0A0A]' : 'bg-[#E0E0D8]'}
        `}
      >
        <span className={`
          absolute top-[3px] w-5 h-5 rounded-full bg-white
          shadow-[0_1px_3px_rgba(0,0,0,0.25)]
          transition-transform duration-200
          ${active ? 'translate-x-[21px]' : 'translate-x-[3px]'}
        `} />
      </button>

    </div>
  )
}