import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DEFAULT_RESUME_PATH = "/patrick-kirkland-resume.pdf";

export function GET(request: Request) {
  const configured = process.env.RESUME_PDF_URL;
  const target = configured && configured.trim() ? configured : DEFAULT_RESUME_PATH;
  const resolved = target.startsWith("http")
    ? target
    : new URL(target, request.url).toString();
  return NextResponse.redirect(resolved, 302);
}
