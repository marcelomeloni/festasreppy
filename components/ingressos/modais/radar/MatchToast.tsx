'use client'

interface MatchToastProps {
  name: string
}

export function MatchToast({ name }: MatchToastProps) {
  return (
    <>
      <style>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25%       { transform: scale(1.35); }
          50%       { transform: scale(1.1); }
          75%       { transform: scale(1.28); }
        }
        @keyframes match-toast-in {
          from { opacity: 0; transform: translateX(-50%) translateY(-10px) scale(0.92); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0)     scale(1);    }
        }
        .match-heart { animation: heartbeat 0.65s ease-in-out 2; transform-origin: center; }
      `}</style>

      <div
        className="absolute left-1/2 z-50 flex items-center gap-2"
        style={{
          top:          '16px',
          background:   '#0A0A0A',
          border:       '1px solid rgba(255,255,255,0.1)',
          padding:      '10px 18px',
          borderRadius: '100px',
          boxShadow:    '0 8px 32px rgba(0,0,0,0.5)',
          animation:    'match-toast-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          whiteSpace:   'nowrap',
        }}
      >
        <svg className="match-heart" width="18" height="16" viewBox="0 0 18 16" fill="#FF4D6D">
          <path d="M9 15.5S1 10.135 1 4.5A4 4 0 0 1 9 2.236 4 4 0 0 1 17 4.5C17 10.135 9 15.5 9 15.5Z" />
        </svg>

        <span className="font-body text-[13px] font-bold text-white" style={{ letterSpacing: '-0.01em' }}>
          Match com{' '}
          <span style={{ color: '#FF4D6D' }}>{name}</span>!
        </span>
      </div>
    </>
  )
}