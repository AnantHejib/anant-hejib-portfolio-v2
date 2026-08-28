import { NextResponse } from "next/server";

export const dynamic="force-dynamic";

export function GET(){
  const aiProvider=process.env.GEMINI_API_KEY||process.env.GOOGLE_API_KEY?"gemini":process.env.OPENAI_API_KEY?"openai":"built-in";
  const emailConfigured=Boolean(process.env.SMTP_USER&&process.env.SMTP_PASS&&process.env.CONTACT_EMAIL);
  return NextResponse.json({
    status:"ok",
    service:"anant-hejib-portfolio",
    lucy:{status:"ready",provider:aiProvider},
    contact:{status:emailConfigured?"ready":"configuration-required"},
    timestamp:new Date().toISOString(),
  },{headers:{"Cache-Control":"no-store"}});
}
