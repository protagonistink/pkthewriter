"use client";

const WORDMARKS = [
  { key: "verizon", label: "Verizon", src: "/wordmarks/verizon.svg", width: "max-w-[56px] md:max-w-[64px]" },
  { key: "att", label: "AT&T", src: "/wordmarks/atandt.svg", width: "max-w-[68px] md:max-w-[76px]" },
  { key: "warnerbros", label: "Warner Bros.", src: "/wordmarks/warnerbros.svg", width: "max-w-[44px] md:max-w-[50px]" },
  { key: "chevron", label: "Chevron", src: "/wordmarks/chevron.png", width: "max-w-[74px] md:max-w-[84px]" },
  { key: "airtable", label: "Airtable", src: "/wordmarks/airtable.svg", width: "max-w-[64px] md:max-w-[74px]" },
  { key: "mercedesbenz", label: "Mercedes-Benz", src: "/wordmarks/mercedesbenz.svg", width: "max-w-[88px] md:max-w-[100px]" },
  { key: "toyota", label: "Toyota", src: "/wordmarks/toyota.svg", width: "max-w-[68px] md:max-w-[78px]" },
  { key: "beatsbydre", label: "Beats by Dre", src: "/wordmarks/beatsbydre.svg", width: "max-w-[44px] md:max-w-[48px]" },
  { key: "americanexpress", label: "American Express", src: "/wordmarks/americanexpress.svg", width: "max-w-[66px] md:max-w-[78px]" },
  { key: "mpa", label: "Motion Picture Association", src: "/wordmarks/mpa.svg", width: "max-w-[90px] md:max-w-[104px]" },
] as const;

type Props = {
  isDark: boolean;
};

export function ResumeWordmarkGrid({ isDark }: Props) {
  return (
    <div className="grid grid-cols-2 gap-x-[28px] gap-y-[18px] md:grid-cols-5 md:gap-x-[22px] md:gap-y-[18px]">
      {WORDMARKS.map((wordmark) => (
        <div
          key={wordmark.key}
          data-resume-wordmark="true"
          data-key={wordmark.key}
          className="flex min-h-[24px] items-center justify-start md:justify-center"
        >
          <img
            src={wordmark.src}
            alt={wordmark.label}
            className={`h-auto w-full object-contain ${wordmark.width}`}
            style={{
              opacity: isDark ? 0.78 : 0.62,
              filter: isDark
                ? "grayscale(1) invert(1) brightness(1.18) contrast(1.08)"
                : "grayscale(1) brightness(0.34) contrast(1.06)",
            }}
          />
        </div>
      ))}
    </div>
  );
}
