export function ContactLink({ email }: { email?: string }) {
  if (!email) return null;
  return (
    <a
      href={`mailto:${email}`}
      className="fixed top-6 right-6 z-10 font-voice text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
    >
      [@] contact
    </a>
  );
}
