import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  const url = process.env.RESUME_PDF_URL;
  if (!url) {
    return NextResponse.json({ error: "Resume URL not configured" }, { status: 503 });
  }
  return NextResponse.redirect(url, 302);
}
