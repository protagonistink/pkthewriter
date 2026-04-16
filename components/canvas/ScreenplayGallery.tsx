import { urlForImage } from "@/lib/sanity/image";
import type { Screenplay } from "@/lib/sanity/types";
import { RequestScriptForm } from "./RequestScriptForm";

export function ScreenplayGallery({ screenplays }: { screenplays: Screenplay[] }) {
  return (
    <div>
      <div className="font-voice text-sm text-[var(--color-paper-text-muted)] uppercase tracking-[0.2em]">
        aren&apos;t you a screenwriter?
      </div>
      <h1 className="text-3xl sm:text-4xl font-medium mt-2 mb-2">Screenplays.</h1>
      <p className="text-[var(--color-paper-text-muted)] mb-10 max-w-prose">
        Sample pages are downloadable. Full scripts on request.
      </p>
      <ul className="space-y-12">
        {screenplays.map((s) => {
          const meta = [s.genre, s.status?.toUpperCase(), s.year].filter(Boolean).join(" • ");
          const sampleUrl = s.samplePdf?.asset?.url;
          return (
            <li key={s._id} className="grid sm:grid-cols-[200px_1fr] gap-6 items-start">
              {s.coverImage ? (
                <img
                  src={urlForImage(s.coverImage).width(400).url()}
                  alt={s.title}
                  className="w-full aspect-[2/3] object-cover border border-[var(--color-paper-border)]"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-[var(--color-paper-surface)] border border-[var(--color-paper-border)]" />
              )}
              <div>
                <div className="font-voice text-sm text-[var(--color-paper-text-muted)] uppercase tracking-[0.2em]">
                  {meta}
                </div>
                <h2 className="text-2xl font-medium mt-1">{s.title}</h2>
                {s.logline && <p className="mt-3 text-[var(--color-paper-text-muted)] max-w-prose">{s.logline}</p>}
                <div className="mt-5 flex flex-wrap gap-3">
                  {sampleUrl && (
                    <a
                      href={sampleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-voice text-sm border border-[var(--color-paper-text)] px-3 py-1.5 rounded-full hover:bg-[var(--color-paper-text)] hover:text-[var(--color-paper)] transition-colors"
                    >
                      download sample ↓
                    </a>
                  )}
                  <RequestScriptForm title={s.title} />
                  {s.externalUrl && (
                    <a
                      href={s.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-voice text-sm text-[var(--color-paper-text-muted)] hover:text-[var(--color-paper-text)]"
                    >
                      view on {hostnameOf(s.externalUrl)} ↗
                    </a>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {screenplays.length === 0 && (
        <p className="font-voice text-[var(--color-paper-text-muted)]">No screenplays published yet.</p>
      )}
    </div>
  );
}

function hostnameOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "site";
  }
}
