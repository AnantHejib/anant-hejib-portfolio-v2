import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";

await mkdir(".visual-tests", { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
});

const profiles = [
  { name: "old-phone", viewport: { width: 360, height: 740 }, cores: 2, memory: 2 },
  { name: "low-end-laptop", viewport: { width: 1366, height: 768 }, cores: 2, memory: 4 },
  { name: "modern-desktop", viewport: { width: 1440, height: 900 }, cores: 16, memory: 16, forceHigh: true },
];

const report = [];
for (const profile of profiles) {
  const page = await browser.newPage({ viewport: profile.viewport });
  await page.addInitScript(({ cores, memory, forceHigh }) => {
    Object.defineProperty(navigator, "hardwareConcurrency", { get: () => cores, configurable: true });
    Object.defineProperty(navigator, "deviceMemory", { get: () => memory, configurable: true });
    if(forceHigh) try { localStorage.setItem("anant-performance","high"); } catch {}
  }, profile);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 30000 });
  const enter = page.getByRole("button", { name: /enter portfolio/i });
  if (await enter.isVisible().catch(() => false)) await enter.click();
  await page.waitForTimeout(1200);
  await page.locator(".archive-rail-window").scrollIntoViewIfNeeded();
  await page.waitForTimeout(350);
  const railBefore=await page.locator(".archive-rail-window").evaluate((node)=>node.scrollLeft);
  await page.waitForTimeout(700);
  const railAfter=await page.locator(".archive-rail-window").evaluate((node)=>node.scrollLeft);
  await page.screenshot({ path: `.visual-tests/performance-${profile.name}.png`, fullPage: false });
  const metrics = await page.evaluate(() => ({
    mode: document.documentElement.dataset.performance,
    canvases: document.querySelectorAll("canvas").length,
    parallaxLayers: document.querySelectorAll('[data-parallax="active"]').length,
    velocityLayers: document.querySelectorAll(".cinematic-motion").length,
    animatedRibbon: document.querySelectorAll("animateMotion").length,
    staticRibbonLogos: document.querySelectorAll(".ribbon-static-strip .ribbon-logo").length,
    straightRibbonLogos: document.querySelectorAll(".straight-ribbon-track .ribbon-logo").length,
    persistentTechSignals: document.querySelectorAll(".tech-signal-item").length,
    widthOverflow: document.documentElement.scrollWidth - innerWidth,
    projects: document.querySelectorAll(".archive-card-primary").length,
    renderedRailCards: document.querySelectorAll(".archive-rail-card").length,
    inquiryOptions: document.querySelectorAll('select[name="inquiryType"] option').length,
    organizationField: Boolean(document.querySelector('input[name="organization"]')),
    portraitVisible: Boolean(document.querySelector(".identity-subject")) && getComputedStyle(document.querySelector(".identity-subject")).display !== "none",
    musicStarted: Boolean(document.querySelector('.audio-toggle[aria-pressed="true"]')),
  }));
  report.push({ name: profile.name, ...metrics, railMovedRight:railAfter<railBefore, errors });
  await page.close();
}

await browser.close();
console.log(JSON.stringify(report, null, 2));

const oldProfiles = report.filter((item) => item.name !== "modern-desktop");
if (oldProfiles.some((item) => item.mode !== "low" || item.canvases !== 0 || item.parallaxLayers!==0 || item.velocityLayers!==0 || item.animatedRibbon !== 0 || item.staticRibbonLogos !== 0 || item.straightRibbonLogos!==80 || item.persistentTechSignals!==80 || item.renderedRailCards!==21 || !item.musicStarted || item.inquiryOptions!==5 || !item.organizationField || item.widthOverflow > 1 || item.errors.length)) process.exitCode = 1;
if (report.find((item) => item.name === "modern-desktop")?.canvases !== 0||report.find((item)=>item.name==="modern-desktop")?.parallaxLayers!==1||report.find((item)=>item.name==="modern-desktop")?.velocityLayers!==1||report.find((item)=>item.name==="modern-desktop")?.straightRibbonLogos!==80||report.find((item)=>item.name==="modern-desktop")?.persistentTechSignals!==80||!report.find((item)=>item.name==="modern-desktop")?.musicStarted||report.find((item)=>item.name==="modern-desktop")?.renderedRailCards!==42) process.exitCode = 1;
if(!report.find((item)=>item.name==="low-end-laptop")?.railMovedRight||report.find((item)=>item.name==="old-phone")?.railMovedRight) process.exitCode=1;
