"use client";
// components/checkout/EventSummary.jsx

export default function EventSummary({ event }) {
  return (
    <div className="rounded-[20px] overflow-hidden border border-[#E0E0D8] bg-white">
      {/* Banner do evento */}
      <div
        className="h-[120px] w-full relative flex items-end p-4"
        style={{
          background:
            "linear-gradient(135deg, #0A0A0A 0%, #1a1a1a 40%, #0d2b0c 100%)",
        }}
      >
        {/* Grain overlay sutil */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundSize: "150px",
          }}
        />

        {/* Verde glow */}
        <div
          className="absolute top-4 right-6 w-24 h-24 rounded-full opacity-20 blur-2xl"
          style={{ background: "#1BFF11" }}
        />

      </div>

      {/* Info */}
      <div className="p-5">
        <h2
          className="text-[22px] font-extrabold leading-tight mb-3"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "#0A0A0A" }}
        >
          {event.title}
        </h2>

        <div
          className="flex flex-col gap-2"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: "#5C5C52",
          }}
        >
          <div className="flex items-center gap-2 text-[14px]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>{event.date} · {event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-[14px]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span>{event.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-[14px]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>{event.organizer}</span>
          </div>
        </div>
      </div>
    </div>
  );
}