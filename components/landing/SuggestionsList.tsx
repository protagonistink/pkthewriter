import Link from "next/link";
import type { SuggestionItem } from "@/lib/sanity/types";
import { FileText, BookOpen, Link2 } from "lucide-react";

function iconFor(kind: SuggestionItem["_kind"]) {
  if (kind === "project") return <FileText className="w-5 h-5 text-[var(--color-accent)]" />;
  if (kind === "story") return <BookOpen className="w-5 h-5 text-[var(--color-accent)]" />;
  return <Link2 className="w-5 h-5 text-[var(--color-accent)]" />;
}

function metaFor(item: SuggestionItem): string {
  if (item._kind === "project") return `CASE STUDY${item.year ? ` • ${item.year}` : ""}`;
  if (item._kind === "story") return `STORY${item.year ? ` • ${item.year}` : ""}`;
  return `BLOG${item.outlet ? ` • ${item.outlet.toUpperCase()}` : ""}`;
}

function hrefFor(item: SuggestionItem): string {
  if (item._kind === "project") return `/work/${item.slug.current}`;
  if (item._kind === "story") return `/story/${item.slug.current}`;
  return item.url;
}

const SKELETON_ROWS = [
  { icon: <FileText className="w-5 h-5 text-[var(--color-border)]" />, title: "————————————————", meta: "CASE STUDY" },
  { icon: <BookOpen className="w-5 h-5 text-[var(--color-border)]" />, title: "——————————————", meta: "STORY" },
  { icon: <Link2 className="w-5 h-5 text-[var(--color-border)]" />, title: "———————————————————", meta: "BLOG" },
];

function SuggestionsSkeleton() {
  return (
    <section className="mt-10 pt-6 border-t border-[var(--color-border)]">
      <div className="font-voice text-sm text-[var(--color-border)] uppercase tracking-[0.2em] mb-4">
        suggestions
      </div>
      <ul className="divide-y divide-[var(--color-border)]">
        {SKELETON_ROWS.map((row, i) => (
          <li key={i} className="flex items-start gap-4 py-5 opacity-30">
            <div className="pt-0.5 shrink-0">{row.icon}</div>
            <div className="min-w-0">
              <div className="text-[var(--color-border)]">{row.title}</div>
              <div className="font-voice text-sm text-[var(--color-border)] mt-1 tracking-wide">{row.meta}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SuggestionsList({ items }: { items: SuggestionItem[] }) {
  if (!items || items.length === 0) return <SuggestionsSkeleton />;
  return (
    <section className="mt-10 pt-6 border-t border-[var(--color-border)]">
      <div className="font-voice text-sm text-[var(--color-text-muted)] uppercase tracking-[0.2em] mb-4">
        suggestions
      </div>
      <ul className="divide-y divide-[var(--color-border)]">
        {items.map((item) => {
          const href = hrefFor(item);
          const external = item._kind === "blogPost";
          const classes = "flex items-start gap-4 py-5 group";
          const inner = (
            <>
              <div className="pt-0.5 shrink-0">{iconFor(item._kind)}</div>
              <div className="min-w-0">
                <div className="text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                  {item.title}
                </div>
                <div className="font-voice text-sm text-[var(--color-text-muted)] mt-1 tracking-wide">
                  {metaFor(item)}
                </div>
              </div>
            </>
          );
          return (
            <li key={item._id}>
              {external ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
                  {inner}
                </a>
              ) : (
                <Link href={href} className={classes}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
