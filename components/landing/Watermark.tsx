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
      {/* Chevron — stacked chevrons */}
      <svg
        className="w-[22px] h-[22px] max-[820px]:w-[18px] max-[820px]:h-[18px] text-[var(--color-ink)]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="4 9 12 3 20 9" />
        <polyline points="4 15 12 9 20 15" />
        <polyline points="4 21 12 15 20 21" />
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
      {/* AT&T — globe with meridians */}
      <svg
        className="w-[22px] h-[22px] max-[820px]:w-[18px] max-[820px]:h-[18px] text-[var(--color-ink)]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <circle cx="12" cy="12" r="10" />
        <ellipse cx="12" cy="12" rx="4.2" ry="10" />
        <path d="M2 12h20" />
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
