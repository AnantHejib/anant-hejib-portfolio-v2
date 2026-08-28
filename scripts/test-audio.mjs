import { chromium } from "playwright-core";

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  args: ["--disable-gpu"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
page.on("pageerror", (error) => errors.push(error.message));
await page.addInitScript(() => {
  class AudioProbe {
    src;
    loop = false;
    preload = "";
    volume = 1;
    constructor(src) { this.src = src; }
    play() { window.__audioProbe = { src: this.src, loop: this.loop, volume: this.volume, playing: true }; return Promise.resolve(); }
    pause() { if (window.__audioProbe) window.__audioProbe.playing = false; }
  }
  window.Audio = AudioProbe;
  class SpeechProbe {
    constructor(text) { this.text = text; this.voice = null; this.rate = 1; this.pitch = 1; this.volume = 1; }
  }
  const speechService = {
    getVoices: () => [{ name: "Microsoft Neerja Online (Natural)", lang: "en-IN" }, { name: "Default", lang: "en-US" }],
    speak: (utterance) => { window.__speechProbe = { text: utterance.text, voice: utterance.voice?.name, rate: utterance.rate, pitch: utterance.pitch }; },
    cancel: () => {},
    addEventListener: () => {},
  };
  Object.defineProperty(window, "SpeechSynthesisUtterance", { value: SpeechProbe });
  Object.defineProperty(window, "speechSynthesis", { value: speechService });
});

await page.goto("http://127.0.0.1:3000", { waitUntil: "domcontentloaded" });
await page.waitForSelector('[data-intro="active"]', { state: "detached", timeout: 12000 }).catch(() => {});
const control = page.locator('button[aria-label$="background music"]');
await control.click();
await page.waitForTimeout(1200);
const playingLabel = await control.textContent();
const playback = await page.evaluate(() => window.__audioProbe);
const narration = await page.evaluate(() => window.__speechProbe);
await control.click();
const pausedLabel = await control.textContent();

console.log(JSON.stringify({ playback, narration, playingLabel, pausedLabel, errors }, null, 2));
await browser.close();
