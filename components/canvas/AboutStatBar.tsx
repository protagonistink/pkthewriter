/**
 * Sticky top terminal prompt line — the tl;dr for recruiters scanning in 30 seconds.
 * Reads like a shell invocation: the dossier as flags. `[resume ↓]` is the
 * speed-path, jumping straight to the resume PDF without touching the FAB.
 */
export function AboutStatBar({ resumeUrl }: { resumeUrl?: string }) {
  return (
    <div
      aria-label="Patrick's dossier at a glance"
      className="
        sticky top-0 z-20 w-full
        bg-[color-mix(in_oklab,var(--color-dark-panel)_92%,transparent)]
        border-b border-[var(--color-dark-line)]
        backdrop-blur-sm
      "
    >
      <div
        className="
          relative flex items-center gap-[18px] whitespace-nowrap overflow-x-auto
          px-[56px] py-[10px]
          font-[family-name:var(--font-mono)] text-[10.5px] tracking-[0.08em]
          text-[var(--color-dark-ink-soft)]
          [scrollbar-width:none] [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
          max-[640px]:px-[16px]
        "
      >
        <span className="flex items-center gap-[10px] min-w-0">
          <span className="text-[var(--color-accent)]">$</span>
          <span className="text-[var(--color-dark-ink)]">patrick</span>
          <StatFlag name="role" value={`"cd+copywriter"`} />
          <StatFlag name="exp" value="20yr" />
          <StatFlag name="coasts" value="ny,la" />
          <StatFlag
            name="brands"
            value="apple,hbo,verizon,att,beats,chevron"
          />
          <span className="flex items-center gap-[6px]">
            <span className="text-[var(--color-dark-ink-mid)]">--status</span>
            <span className="text-[var(--color-dark-ink)]">available</span>
            <span
              aria-hidden="true"
              className="about-pulse-dot inline-block w-[6px] h-[6px] rounded-full bg-[var(--color-accent)]"
              style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
            />
          </span>
        </span>

        {resumeUrl && (
          <span className="ml-auto shrink-0 pl-[24px]">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="
                inline-flex items-center gap-[6px]
                text-[var(--color-dark-ink)]
                hover:text-[var(--color-accent)]
                transition-colors
              "
            >
              <span className="text-[var(--color-accent)]">[</span>
              resume
              <span aria-hidden="true">↓</span>
              <span className="text-[var(--color-accent)]">]</span>
            </a>
          </span>
        )}
      </div>
    </div>
  );
}

function StatFlag({ name, value }: { name: string; value: string }) {
  return (
    <span className="flex items-center gap-[6px]">
      <span className="text-[var(--color-dark-ink-mid)]">--{name}</span>
      <span className="text-[var(--color-dark-ink)]">{value}</span>
    </span>
  );
}
