import { Resend } from "resend";

let _resend: Resend | null = null;

export function getResend(): Resend {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Missing RESEND_API_KEY");
  _resend = new Resend(key);
  return _resend;
}

export function leadConfig() {
  const to = process.env.LEAD_TO_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL;
  if (!to || !from) {
    throw new Error("Missing LEAD_TO_EMAIL or LEAD_FROM_EMAIL");
  }
  return { to, from };
}
