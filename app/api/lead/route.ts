import { NextRequest, NextResponse } from "next/server";
import { validateLeadPayload, type LeadPayload } from "@/lib/lead-validation";
import { allow } from "@/lib/throttle";
import { getResend, leadConfig } from "@/lib/resend";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!allow(ip)) {
    return NextResponse.json({ ok: false, error: "rate-limited" }, { status: 429 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  const parsed = validateLeadPayload(raw as LeadPayload);
  if (!parsed.ok) {
    if (parsed.error === "honeypot") return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }

  try {
    const { to, from } = leadConfig();
    const ua = req.headers.get("user-agent") ?? "unknown";
    const subject = `[pk] ${parsed.context ?? "lead"} — ${parsed.message.slice(0, 60)}`;
    await getResend().emails.send({
      from,
      to,
      subject,
      text: `From: ${ip}\nUA: ${ua}\nContext: ${parsed.context ?? "free-text"}\n\n${parsed.message}`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/lead] send failed", err);
    return NextResponse.json({ ok: false, error: "send-failed" }, { status: 500 });
  }
}
