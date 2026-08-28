import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const output=path.resolve(".visual-tests","character");
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",args:["--disable-gpu"]});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];
page.on("console",message=>{if(message.type()==="error")errors.push(message.text());});
page.on("pageerror",error=>errors.push(error.message));
await page.goto("http://127.0.0.1:3000",{waitUntil:"domcontentloaded"});
const enter=page.getByRole("button",{name:/enter portfolio/i});
if(await enter.isVisible().catch(()=>false)) await enter.click();
await page.waitForSelector('[data-intro="active"]',{state:"detached",timeout:12000}).catch(()=>{});
const hero=page.locator("#home");
const heroHeight=await hero.evaluate(element=>element.offsetHeight);
await page.evaluate(y=>window.scrollTo(0,y),heroHeight*.72);
await page.waitForTimeout(700);
const heroFilter=await page.locator(".identity-subject").evaluate(element=>getComputedStyle(element).filter);
await page.screenshot({path:path.join(output,"hero-sharp.png")});
const journey=page.locator("#journey");
const start=await journey.evaluate(element=>element.offsetTop);
const height=await journey.evaluate(element=>element.offsetHeight);
const transforms=[];
const journeyTwin=page.locator(".journey-digital-twin");
if(await journeyTwin.count()){
  for(const progress of [.2,.5,.8]){
    await page.evaluate(y=>window.scrollTo(0,y),start+(height-1000)*progress);
    await page.waitForTimeout(850);
    transforms.push(await journeyTwin.evaluate(element=>getComputedStyle(element).transform));
    if(progress===.5)await page.screenshot({path:path.join(output,"journey-mid.png")});
  }
}
console.log(JSON.stringify({heroFilter,transforms,motionChanged:new Set(transforms).size>1,errors},null,2));
if(heroFilter!=="none"||(transforms.length&&new Set(transforms).size<2)||errors.length) process.exitCode=1;
await browser.close();
