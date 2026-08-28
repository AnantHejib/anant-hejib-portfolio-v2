import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const edge = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const baseURL = process.env.PORTFOLIO_URL || "http://localhost:3000";
const output = path.resolve(".visual-tests");
await mkdir(output, { recursive: true });

// Warm the Next.js development compiler before browser assertions.
for (let attempt = 0; attempt < 3; attempt += 1) {
  try {
    const response = await fetch(baseURL);
    if (response.ok) break;
  } catch {}
  await new Promise((resolve) => setTimeout(resolve, 1500));
}

const browser = await chromium.launch({ headless: true, executablePath: edge });
const report = [];

for (const viewport of [{ name: "desktop", width: 1440, height: 1000 }, { name: "mobile", width: 390, height: 844 }, { name: "low-end", width: 1366, height: 768 }]) {
  const page = await browser.newPage({ viewport });
  if (viewport.name === "low-end") await page.addInitScript(() => {
    Object.defineProperty(navigator,"hardwareConcurrency",{get:()=>2,configurable:true});
    Object.defineProperty(navigator,"deviceMemory",{get:()=>2,configurable:true});
  });
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto(baseURL, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(2800);
  await page.screenshot({ path: path.join(output, `${viewport.name}-boot.png`) });
  const initialize = page.getByRole("button", { name: /enter portfolio|launch portfolio|initialize experience/i });
  if (await initialize.isVisible().catch(() => false)) await initialize.click();
  await page.waitForSelector('[data-intro="active"]', { state: "detached", timeout: 12000 }).catch(() => {});
  await page.waitForTimeout(500);
  let autoScrollAdvanced = true;
  if (viewport.name === "desktop") {
    const autoStart = await page.evaluate(() => window.scrollY);
    await page.waitForTimeout(16000);
    const autoEnd = await page.evaluate(() => window.scrollY);
    autoScrollAdvanced = autoEnd > autoStart;
    const director = page.getByRole("button", { name: /auto scroll|auto director/i });
    if (await director.isVisible().catch(() => false)) await director.click();
    await page.evaluate(() => window.scrollTo(0,0));
    await page.waitForTimeout(500);
  }

  const metrics = await page.evaluate(() => ({
    title: document.title,
    pageWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
    pageHeight: document.documentElement.scrollHeight,
    headings: document.querySelectorAll("h1,h2,h3").length,
    links: document.querySelectorAll("a").length,
    images: [...document.images].map((image) => ({ src: image.getAttribute("src"), complete: image.complete, width: image.naturalWidth, height: image.naturalHeight })),
    portraitVisible: [...document.querySelectorAll('.identity-body')].some((el) => { const r = el.getBoundingClientRect(); const style = getComputedStyle(el); return r.width > 0 && r.height > 0 && style.visibility !== "hidden" && style.display !== "none"; }),
    depthFacePresent: document.querySelector('.identity-face-depth') !== null,
    persistentAvatarMounted: document.querySelector('.persistent-avatar') !== null,
    visionCorePresent: document.querySelector('.vision-core') !== null,
    fintechSimulationPresent: document.querySelector('.fintech-simulation') !== null,
    powerGesturePresent: document.querySelector('.forge-sequence') !== null,
    technologyModules: document.querySelectorAll('.tech-module').length,
    technologyChips: document.querySelectorAll('.tech-chip').length,
    performanceMode: document.documentElement.dataset.performance,
    parallaxPresent: document.querySelector('[data-parallax="active"]') !== null,
    obsoleteCharacterPresent: document.querySelector('[data-character="anant"]') !== null,
  }));

  let pointerDepthMoved = true;
  if (viewport.name === "desktop") {
    const before = await page.locator(".identity-subject").evaluate((node) => getComputedStyle(node).transform);
    await page.mouse.move(viewport.width * .86, viewport.height * .2);
    await page.waitForTimeout(450);
    const after = await page.locator(".identity-subject").evaluate((node) => getComputedStyle(node).transform);
    pointerDepthMoved = before !== after;
  }
  const journeyBox = await page.locator("#journey").boundingBox();
  let journeyModelMoved = false;
  if (journeyBox) {
    await page.evaluate((top) => window.scrollTo(0, top), journeyBox.y + journeyBox.height * .12);
    await page.waitForTimeout(500);
    const journeyStart = await page.locator(".journey-digital-twin").evaluate((node) => getComputedStyle(node).transform);
    await page.evaluate((top) => window.scrollTo(0, top), journeyBox.y + journeyBox.height * .72);
    await page.waitForTimeout(500);
    const journeyEnd = await page.locator(".journey-digital-twin").evaluate((node) => getComputedStyle(node).transform);
    journeyModelMoved = journeyStart !== journeyEnd;
    await page.screenshot({ path: path.join(output, `${viewport.name}-journey.png`) });
  }

  const stops = [0, .05, .22, .48, .72, 1];
  const motionFrames = [];
  for (const [index, stop] of stops.entries()) {
    await page.evaluate((progress) => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * progress), stop);
    await page.waitForTimeout(650);
    await page.screenshot({ path: path.join(output, `${viewport.name}-${index}.png`) });
    motionFrames.push(await page.evaluate(() => [...document.querySelectorAll(".cinematic-reveal")].slice(0, 8).map((part) => `${getComputedStyle(part).transform}|${getComputedStyle(part).opacity}`)));
  }
  const archive = page.locator("[aria-labelledby='archive-title']");
  await archive.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const initialArchiveCards = await archive.locator(".archive-card-primary").count();
  const allProjectsVisible = initialArchiveCards === 21;
  const interludes = page.locator(".project-interlude:visible");
  const interludeCount = await interludes.count();
  for (let index = 0; index < interludeCount; index += 1) {
    await interludes.nth(index).scrollIntoViewIfNeeded();
    await page.waitForTimeout(450);
    await page.screenshot({ path: path.join(output, `${viewport.name}-interlude-${index}.png`) });
  }
  const cityBox = interludeCount > 2 ? await interludes.nth(2).boundingBox() : null;
  if (cityBox) {
    const currentScroll = await page.evaluate(() => window.scrollY);
    await page.evaluate(({top,height}) => window.scrollTo(0,top+.4*(height+innerHeight)-innerHeight),{top:cityBox.y+currentScroll,height:cityBox.height});
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(output, `${viewport.name}-city-blast.png`) });
  }
  const forge = page.locator(".forge-sequence");
  const forgeBox = await forge.count() ? await forge.boundingBox() : null;
  if (forgeBox) {
    const currentScroll = await page.evaluate(() => window.scrollY);
    await page.evaluate(({top,height}) => window.scrollTo(0,top+.45*height),{top:forgeBox.y+currentScroll,height:forgeBox.height});
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(output, `${viewport.name}-power-gesture.png`) });
  }
  const fintechSimulation = page.locator(".fintech-simulation");
  await fintechSimulation.scrollIntoViewIfNeeded();
  await page.waitForTimeout(550);
  await page.screenshot({ path: path.join(output, `${viewport.name}-fintech.png`) });
  await page.screenshot({ path: path.join(output, `${viewport.name}-archive.png`) });
  const technologyStack = page.locator("#technology-stack");
  await technologyStack.scrollIntoViewIfNeeded();
  await page.waitForTimeout(550);
  await page.screenshot({ path: path.join(output, `${viewport.name}-technology-stack.png`) });
  report.push({ viewport, metrics, autoScrollAdvanced, pointerDepthMoved, journeyModelMoved, initialArchiveCards, allProjectsVisible, interludeCount, cinematicMotionChanged: motionFrames.some((frame, i) => i > 0 && frame.some((transform, j) => transform !== motionFrames[0][j])), errors });
  await page.close();
}

await browser.close();
await writeFile(path.join(output, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
