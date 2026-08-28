import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";

await mkdir(".visual-tests", { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const issues = [];

page.on("pageerror", (error) => issues.push({ type: "pageerror", text: error.message }));
page.on("console", (message) => {
  if (["warning", "error"].includes(message.type())) issues.push({ type: message.type(), text: message.text() });
});
page.on("response", (response) => {
  if (response.status() >= 400) issues.push({ type: "response", text: `${response.status()} ${response.url()}` });
});

await page.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 30_000 });
const enter = page.getByRole("button", { name: /enter portfolio|launch portfolio|initialize experience/i });
if (await enter.isVisible().catch(() => false)) await enter.click();
await page.waitForSelector('[data-intro="active"]', { state: "detached", timeout: 12_000 }).catch(() => {});
await page.waitForTimeout(800);
const director = page.getByRole("button", { name: /auto scroll|auto director/i });
if (await director.isVisible().catch(() => false)) await director.click();
await page.locator("#about").scrollIntoViewIfNeeded();
await page.waitForTimeout(500);
await page.screenshot({ path: ".visual-tests/identity-portrait.png" });
await page.locator(".identity-portrait").screenshot({ path: ".visual-tests/identity-portrait-element.png" });
await page.locator("[aria-labelledby='archive-title']").scrollIntoViewIfNeeded();
await page.waitForTimeout(500);
await page.screenshot({ path: ".visual-tests/clear-deliverables.png" });
await page.getByRole("button", { name: /ask lucy/i }).click();
await page.waitForTimeout(300);
await page.screenshot({ path: ".visual-tests/lucy-intelligence.png" });
await page.locator("#technology-stack").scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await page.screenshot({ path: ".visual-tests/expanded-technology-motion.png" });

console.log(JSON.stringify({ issues, title: await page.title() }, null, 2));
await browser.close();
if (issues.length) process.exitCode = 1;
