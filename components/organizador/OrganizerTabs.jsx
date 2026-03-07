'use client'

const TABS = [
  { id: 'eventos', label: 'Eventos' },
  { id: 'links',   label: 'Links'   },
]

export default function OrganizerTabs({ activeTab, onTabChange }) {
  return (
    <div className="w-full mt-1">
      <div className="flex px-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative font-body text-[15px] font-semibold px-5 py-[14px] border-none bg-transparent cursor-pointer transition-colors
              ${activeTab === tab.id ? 'text-[#0A0A0A]' : 'text-[#9A9A8F] hover:text-[#0A0A0A]'}
            `}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-5 right-5 h-[2px] bg-[#1BFF11] rounded-t-sm" />
            )}
          </button>
        ))}
      </div>
      <div className="h-px bg-[#E0E0D8] mx-6" />
    </div>
  )
}