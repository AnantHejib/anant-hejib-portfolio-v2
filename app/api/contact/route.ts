import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const deliveryLog = new Map<string, number[]>();
const inquiryProfiles = {
  opportunity: { label: "Job or interview opportunity", subject: "Opportunity", reply: "Anant will review the role, requirements and timeline you shared." },
  collaboration: { label: "Project collaboration", subject: "Collaboration", reply: "Anant will review the idea, scope and the best way to collaborate." },
  technical: { label: "Technical discussion", subject: "Technical discussion", reply: "Anant will review your technical question and the context you provided." },
  speaking: { label: "Speaking, media or event", subject: "Speaking or media", reply: "Anant will review the event details, audience and proposed timeline." },
  general: { label: "General inquiry", subject: "General inquiry", reply: "Anant will review your message and respond with the most useful next step." },
} as const;
type InquiryType = keyof typeof inquiryProfiles;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] ?? character);
}

function withinRateLimit(identifier: string) {
  const now = Date.now();
  const recent = (deliveryLog.get(identifier) ?? []).filter((time) => now - time < 15 * 60 * 1000);
  if (recent.length >= 5) return false;
  recent.push(now);
  deliveryLog.set(identifier, recent);
  return true;
}

function emailShell(content: string, preheader: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${preheader}</title></head><body style="margin:0;background:#05080d;color:#eaf7fa;font-family:Arial,Helvetica,sans-serif"><div style="display:none;max-height:0;overflow:hidden;opacity:0">${preheader}</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#05080d;padding:32px 14px"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;border:1px solid #183642;background:#091118"><tr><td style="height:3px;background:linear-gradient(90deg,#4fd1e5,#1769ff)"></td></tr><tr><td style="padding:34px 34px 16px"><div style="font-family:Consolas,monospace;font-size:10px;letter-spacing:2.4px;color:#4fd1e5">ANANT HEJIB · ENGINEERING PORTFOLIO</div></td></tr><tr><td style="padding:0 34px 36px">${content}</td></tr><tr><td style="border-top:1px solid #18303a;padding:20px 34px;font-family:Consolas,monospace;font-size:10px;line-height:1.7;color:#6f8992">AI · COMPUTER VISION · ROBOTICS · FULL-STACK<br>Pune, India</td></tr></table></td></tr></table></body></html>`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const organization = typeof body.organization === "string" ? body.organization.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const company = typeof body.company === "string" ? body.company.trim() : "";
    const inquiryType = typeof body.inquiryType === "string" && body.inquiryType in inquiryProfiles ? body.inquiryType as InquiryType : "general";

    if (company) return NextResponse.json({ ok: true });
    if (!name || name.length > 80 || organization.length > 120 || !emailPattern.test(email) || email.length > 160 || message.length < 10 || message.length > 3000) {
      return NextResponse.json({ error: "Please check your name, email, organization and message." }, { status: 400 });
    }

    const smtpHost = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
    const smtpPort = Number(process.env.SMTP_PORT ?? "465");
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.replace(/\s/g, "");
    const recipient = process.env.CONTACT_EMAIL?.trim() || "ananthejib28@gmail.com";
    const sender = process.env.LUCY_SMTP_FROM?.trim() || `Lucy | Anant's Personal AI <${smtpUser}>`;
    if (!smtpUser || !smtpPass || !Number.isFinite(smtpPort)) {
      console.error("Contact delivery is not configured: SMTP credentials are missing.");
      return NextResponse.json({ code: "SMTP_NOT_CONFIGURED", error: "The secure contact channel is temporarily unavailable. Please try again shortly." }, { status: 503 });
    }

    const identifier = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
    if (!withinRateLimit(identifier)) return NextResponse.json({ error: "Too many messages. Please try again in 15 minutes." }, { status: 429 });

    const inquiry = inquiryProfiles[inquiryType];
    const reference = crypto.randomUUID().slice(0, 8).toUpperCase();
    const headerName = name.replace(/[\r\n]+/g, " ").trim();
    const headerOrganization = organization.replace(/[\r\n]+/g, " ").trim();
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeOrganization = escapeHtml(organization);
    const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br>");
    const submittedAt = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date());

    const ownerHtml = emailShell(`
      <h1 style="margin:10px 0 8px;font-size:28px;line-height:1.2;color:#ffffff">New ${inquiry.subject.toLowerCase()} inquiry</h1>
      <p style="margin:0 0 28px;color:#8fa6af;font-size:14px;line-height:1.7">A personalized message was submitted through your portfolio. Reference ${reference}.</p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#071016;border:1px solid #183642">
        <tr><td style="padding:14px 16px;border-bottom:1px solid #18303a;color:#6f8992;font-size:11px;letter-spacing:1px">NAME</td><td style="padding:14px 16px;border-bottom:1px solid #18303a;color:#ffffff">${safeName}</td></tr>
        <tr><td style="padding:14px 16px;border-bottom:1px solid #18303a;color:#6f8992;font-size:11px;letter-spacing:1px">EMAIL</td><td style="padding:14px 16px;border-bottom:1px solid #18303a"><a href="mailto:${safeEmail}" style="color:#4fd1e5;text-decoration:none">${safeEmail}</a></td></tr>
        <tr><td style="padding:14px 16px;border-bottom:1px solid #18303a;color:#6f8992;font-size:11px;letter-spacing:1px">ORGANIZATION</td><td style="padding:14px 16px;border-bottom:1px solid #18303a;color:#ffffff">${safeOrganization || "Not provided"}</td></tr>
        <tr><td style="padding:14px 16px;border-bottom:1px solid #18303a;color:#6f8992;font-size:11px;letter-spacing:1px">INQUIRY</td><td style="padding:14px 16px;border-bottom:1px solid #18303a;color:#ffffff">${inquiry.label}</td></tr>
        <tr><td style="padding:14px 16px;color:#6f8992;font-size:11px;letter-spacing:1px">RECEIVED</td><td style="padding:14px 16px;color:#ffffff">${submittedAt} IST</td></tr>
      </table>
      <div style="margin-top:22px;border-left:3px solid #4fd1e5;background:#071016;padding:20px;color:#dbe9ed;font-size:15px;line-height:1.8">${safeMessage}</div>
      <a href="mailto:${safeEmail}?subject=${encodeURIComponent(`Re: ${inquiry.subject} — ${reference}`)}" style="display:inline-block;margin-top:24px;background:#4fd1e5;color:#031015;text-decoration:none;font-size:12px;font-weight:bold;letter-spacing:1.4px;padding:14px 20px">REPLY TO ${safeName.toUpperCase()}</a>
    `, `${inquiry.subject} inquiry from ${safeName}`);

    const acknowledgementHtml = emailShell(`
      <h1 style="margin:10px 0 8px;font-size:28px;line-height:1.2;color:#ffffff">Thank you for contacting Anant.</h1>
      <p style="margin:0 0 20px;color:#dbe9ed;font-size:15px;line-height:1.8">Hello ${safeName},</p>
      <p style="margin:0 0 20px;color:#a9bcc3;font-size:15px;line-height:1.8">I’m Lucy, Anant’s personal AI assistant. Your <strong style="color:#dbe9ed">${inquiry.label.toLowerCase()}</strong> has been delivered directly to Anant. ${inquiry.reply} He usually responds within 24–48 hours.</p>
      <div style="margin:0 0 22px;padding:12px 16px;border:1px solid #183642;background:#071016;font-family:Consolas,monospace;font-size:10px;letter-spacing:1.4px;color:#4fd1e5">REFERENCE // ${reference}</div>
      <div style="margin:24px 0;border-left:3px solid #1769ff;background:#071016;padding:18px 20px"><div style="margin-bottom:10px;font-family:Consolas,monospace;font-size:9px;letter-spacing:1.8px;color:#4fd1e5">YOUR MESSAGE</div><div style="color:#91a8b0;font-size:13px;line-height:1.75">${safeMessage}</div></div>
      <p style="margin:24px 0 6px;color:#dbe9ed;font-size:14px;line-height:1.7">Regards,<br><strong style="color:#ffffff">Lucy — Anant’s personal AI assistant</strong></p>
      <p style="margin:18px 0 0;font-size:12px;line-height:1.7"><a href="https://github.com/AnantHejib" style="color:#4fd1e5;text-decoration:none">GitHub</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="https://www.linkedin.com/in/anant-hejib-b277a82a2/" style="color:#4fd1e5;text-decoration:none">LinkedIn</a></p>
    `, `${inquiry.subject} received by Anant Hejib.`);

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : smtpPort === 465,
      requireTLS: smtpPort !== 465,
      connectionTimeout: 12_000,
      greetingTimeout: 12_000,
      socketTimeout: 20_000,
      tls: { servername: smtpHost },
      auth: { user: smtpUser, pass: smtpPass },
    });
    const send = (payload: { from: string; to: string[]; replyTo: string; subject: string; html: string; text: string }) => transporter.sendMail(payload);

    try {
      await send({ from: sender, to: [recipient], replyTo: email, subject: `[${inquiry.subject}] ${headerName}${headerOrganization ? ` — ${headerOrganization}` : ""}`, html: ownerHtml, text: `New ${inquiry.label}\nReference: ${reference}\n\nName: ${name}\nEmail: ${email}\nOrganization: ${organization || "Not provided"}\nReceived: ${submittedAt} IST\n\n${message}` });
    } catch (error) {
      console.error("SMTP rejected contact notification:", error instanceof Error ? error.message : "Unknown SMTP error");
      transporter.close();
      return NextResponse.json({ error: "Message delivery failed. Please try again shortly." }, { status: 502 });
    }
    let autoReply=true;
    try {
      await send({ from: sender, to: [email], replyTo: recipient, subject: `${inquiry.subject} received — Anant Hejib`, html: acknowledgementHtml, text: `Hello ${name},\n\nI’m Lucy, Anant’s personal AI assistant. Your ${inquiry.label.toLowerCase()} has been delivered to Anant. ${inquiry.reply} He usually responds within 24–48 hours.\n\nReference: ${reference}\n\nRegards,\nLucy — Anant’s personal AI assistant` });
    } catch (error) {
      autoReply=false;
      console.error("SMTP rejected sender acknowledgement:", error instanceof Error ? error.message : "Unknown SMTP error");
    } finally {
      transporter.close();
    }
    return NextResponse.json({ ok: true, autoReply, reference });
  } catch (error) {
    console.error("Invalid contact request:", error);
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
