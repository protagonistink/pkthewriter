"use client";

type ChipItem = { id: string; label: string };

type Props = {
  chips: ChipItem[];
  onSelect: (label: string) => void;
};

export function AboutChips({ chips, onSelect }: Props) {
  if (!chips.length) return null;
  return (
    <div className="mt-[16px] flex flex-wrap gap-[10px]">
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          aria-label={`Ask: ${chip.label}`}
          onClick={() => onSelect(chip.label)}
          className="
            font-[family-name:var(--font-mono)] text-[13px]
            px-[14px] py-[6px] rounded-full
            border border-[var(--color-paper-line)]
            bg-[var(--color-paper-panel)]
            text-[var(--color-ink-mid)]
            hover:text-[var(--color-ink)] hover:border-[var(--color-ink-soft)]
            transition-colors
          "
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
