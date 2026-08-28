import nextEnv from "@next/env";
import nodemailer from "nodemailer";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const host = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
const port = Number(process.env.SMTP_PORT || "465");
const user = process.env.SMTP_USER?.trim();
const rawPassword = process.env.SMTP_PASS || "";
const pass = rawPassword.replace(/\s/g, "");
const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465;

console.log(JSON.stringify({
  host,
  port,
  secure,
  userConfigured: Boolean(user),
  passwordConfigured: Boolean(pass),
  passwordLength: pass.length,
  passwordHadWhitespace: rawPassword !== pass,
}, null, 2));

if (!user || !pass) process.exit(2);

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  requireTLS: !secure,
  connectionTimeout: 12_000,
  greetingTimeout: 12_000,
  socketTimeout: 20_000,
  auth: { user, pass },
});

try {
  await transporter.verify();
  console.log("SMTP_VERIFY_OK");
} catch (error) {
  console.error(JSON.stringify({
    status: "SMTP_VERIFY_FAILED",
    code: error?.code,
    command: error?.command,
    responseCode: error?.responseCode,
    message: error?.message,
  }, null, 2));
  process.exitCode = 1;
} finally {
  transporter.close();
}
