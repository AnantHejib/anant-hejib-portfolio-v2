import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const output=path.resolve(".visual-tests","ascend-report");
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",args:["--disable-gpu"]});
const results=[];
for(const viewport of [{name:"desktop",width:1440,height:1000},{name:"mobile",width:390,height:844}]){
  const page=await browser.newPage({viewport});
  const errors=[];
  page.on("console",message=>{if(message.type()==="error")errors.push(message.text());});
  page.on("pageerror",error=>errors.push(error.message));
  await page.goto("http://127.0.0.1:3000/projects/autonomous-drone-mapping/technical-report",{waitUntil:"domcontentloaded",timeout:30000});
  await page.waitForTimeout(900);
  const metrics=await page.evaluate(()=>({
    title:document.title,
    width:document.documentElement.scrollWidth,
    viewport:innerWidth,
    heading:document.querySelector("h1")?.textContent,
    images:[...document.images].map(image=>({src:image.getAttribute("src"),complete:image.complete,width:image.naturalWidth})),
    missionSteps:document.querySelectorAll(".mission-step").length,
    downloads:document.querySelectorAll("a[download]").length,
  }));
  await page.screenshot({path:path.join(output,`${viewport.name}-hero.png`)});
  await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight*.63));
  await page.waitForTimeout(750);
  await page.screenshot({path:path.join(output,`${viewport.name}-evidence.png`)});
  results.push({viewport,metrics,errors});
  await page.close();
}
await browser.close();
console.log(JSON.stringify(results,null,2));
