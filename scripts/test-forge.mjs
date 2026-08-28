import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const output = path.resolve(".visual-tests", "forge");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  args: ["--disable-gpu"],
});
const report = [];

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
]) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
  await page.waitForSelector('[data-intro="active"]', { state: "detached", timeout: 12000 }).catch(() => {});

  const section = page.locator(".forge-sequence");
  const bounds = await section.boundingBox();
  if (!bounds) throw new Error("Forge sequence was not rendered");
  const start = await section.evaluate((element) => element.offsetTop);
  const travel = bounds.height - viewport.height;
  const frames = [];

  for (const progress of [0.08, 0.34, 0.63, 0.82]) {
    await page.evaluate((y) => window.scrollTo(0, y), start + travel * progress);
    await page.waitForTimeout(1800);
    const frame = await page.locator(".forge-sequence > div").first().evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, position: getComputedStyle(element).position };
    });
    const file = path.join(output, `${viewport.name}-${String(progress).replace(".", "-")}.png`);
    await page.screenshot({ path: file });
    frames.push({ progress, file, sticky: frame });
  }

  const overflow = await page.evaluate(() => {
    const before = window.scrollX;
    window.scrollTo(500, window.scrollY);
    return {
      before,
      after: window.scrollX,
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    };
  });
  report.push({ viewport, frames, overflow, errors });
  await page.close();
}

await browser.close();
await writeFile(path.join(output, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
