export default function Logo({ size = 36, light = false }) {
  return (
    <span className="inline-flex items-center gap-2 select-none">
      <span
        className="grid place-items-center rounded-xl brand-gradient shadow-lg shadow-brand-600/30"
        style={{ width: size, height: size }}
      >
        <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none">
          <path
            d="M5 11l1.5-4.2A2 2 0 0 1 8.4 5.5h7.2a2 2 0 0 1 1.9 1.3L19 11m-14 0h14m-14 0a2 2 0 0 0-2 2v3h2m14-5a2 2 0 0 1 2 2v3h-2m-14 0v1.5a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V16m-3 0h3m11 0v1.5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V16m3 0h-3"
            stroke="#fff"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="7.5" cy="13.5" r="1.1" fill="#fff" />
          <circle cx="16.5" cy="13.5" r="1.1" fill="#fff" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`text-lg font-extrabold tracking-tight ${
            light ? 'text-white' : 'text-ink-900'
          }`}
        >
          سيارتي
        </span>
        <span
          className={`text-[10px] font-semibold tracking-[0.2em] ${
            light ? 'text-brand-200' : 'text-brand-600'
          }`}
        >
          SAYARATI
        </span>
      </span>
    </span>
  )
}
