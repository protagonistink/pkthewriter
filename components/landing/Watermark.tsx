export function Watermark() {
  return (
    <div
      aria-hidden="true"
      className="
        fixed right-[44px] bottom-[26px]
        flex items-center gap-[22px]
        pointer-events-none z-[1]
        opacity-[0.22]
        max-[820px]:right-[18px] max-[820px]:bottom-[14px] max-[820px]:gap-[14px]
      "
    >
      {/* Verizon checkmark */}
      <svg
        className="w-[22px] h-[22px] max-[820px]:w-[18px] max-[820px]:h-[18px] text-[var(--color-accent)]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="4 12 10 19 21 5" />
      </svg>
      {/* Apple */}
      <svg
        className="w-[22px] h-[22px] max-[820px]:w-[18px] max-[820px]:h-[18px] text-[var(--color-ink)]"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M16.4 12.5c0-2.5 2-3.7 2.1-3.8-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.1-2.9.9-3.6.9s-1.9-.9-3.1-.8c-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.1 1.2 9.5.8 1.1 1.8 2.4 3.1 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.3.9-1.3 1.3-2.6 1.3-2.6-.1 0-2.6-1-2.9-3.8zM14 4.8C14.6 4 15 3 14.9 1.9c-.9 0-2 .6-2.6 1.3C11.7 3.9 11.2 5 11.3 6c1 .1 2-.5 2.7-1.2z" />
      </svg>
      {/* Warner */}
      <svg
        className="w-[22px] h-[22px] max-[820px]:w-[18px] max-[820px]:h-[18px] text-[var(--color-ink)]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4l4 16 4-10 4 10 4-16" />
        <path d="M3 4h18" />
      </svg>
      {/* Mercedes */}
      <svg
        className="w-[22px] h-[22px] max-[820px]:w-[18px] max-[820px]:h-[18px] text-[var(--color-ink)]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2v10m0 0l-8.5 4.8M12 12l8.5 4.8" />
      </svg>
      {/* Protagonist Ink */}
      <svg
        className="w-[22px] h-[22px] max-[820px]:w-[18px] max-[820px]:h-[18px] text-[var(--color-ink)]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 7l9-4 9 4v10l-9 4-9-4z" />
        <path d="M3 7l9 4 9-4M12 11v10" />
      </svg>
    </div>
  );
}
