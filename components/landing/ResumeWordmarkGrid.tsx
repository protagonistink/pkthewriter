"use client";

const WORDMARKS = [
  { key: "verizon",        label: "Verizon",                  src: "/wordmarks/verizon.svg" },
  { key: "att",            label: "AT&T",                     src: "/wordmarks/atandt.svg" },
  { key: "warnerbros",     label: "Warner Bros.",             src: "/wordmarks/warnerbros.svg" },
  { key: "chevron",        label: "Chevron",                  src: "/wordmarks/chevron.png" },
  { key: "airtable",       label: "Airtable",                 src: "/wordmarks/airtable.svg" },
  { key: "mercedesbenz",   label: "Mercedes-Benz",            src: "/wordmarks/mercedesbenz.svg" },
  { key: "toyota",         label: "Toyota",                   src: "/wordmarks/toyota.svg" },
  { key: "beatsbydre",     label: "Beats by Dre",             src: "/wordmarks/beatsbydre.svg" },
  { key: "americanexpress",label: "American Express",         src: "/wordmarks/americanexpress.svg" },
  { key: "mpa",            label: "Motion Picture Association",src: "/wordmarks/mpa.svg" },
] as const;

type Props = {
  isDark: boolean;
};

export function ResumeWordmarkGrid({ isDark }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "24px 32px",
      }}
    >
      {WORDMARKS.map((wordmark) => (
        <div
          key={wordmark.key}
          data-resume-wordmark="true"
          data-key={wordmark.key}
          style={{
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={wordmark.src}
            alt={wordmark.label}
            style={{
              display: "block",
              width: "100%",
              maxWidth: 110,
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
              opacity: isDark ? 0.75 : 0.62,
              filter: isDark
                ? "grayscale(1) invert(1) brightness(1.15) contrast(1.06)"
                : "grayscale(1) brightness(0.30) contrast(1.08)",
            }}
          />
        </div>
      ))}
    </div>
  );
}
