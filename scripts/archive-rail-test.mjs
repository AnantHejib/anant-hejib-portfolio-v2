import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";

await mkdir(".visual-tests",{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"});
const report=[];

for(const profile of [{name:"desktop",width:1440,height:900,low:false},{name:"old-phone",width:360,height:740,low:true}]){
  const page=await browser.newPage({viewport:{width:profile.width,height:profile.height}});
  if(profile.low) await page.addInitScript(()=>{Object.defineProperty(navigator,"hardwareConcurrency",{get:()=>2});Object.defineProperty(navigator,"deviceMemory",{get:()=>2});});
  const errors=[];page.on("pageerror",(error)=>errors.push(error.message));page.on("console",(message)=>{if(message.type()==="error") errors.push(message.text());});
  await page.goto("http://127.0.0.1:3000",{waitUntil:"networkidle"});
  const enter=page.getByRole("button",{name:/enter portfolio/i});if(await enter.isVisible().catch(()=>false)) await enter.click();
  await page.mouse.move(profile.width/2,2);
  const section=page.locator(".archive-rail-section");await section.scrollIntoViewIfNeeded();await page.waitForTimeout(1000);
  const rail=page.locator(".archive-rail-window"),track=page.locator(".archive-rail-track");await rail.scrollIntoViewIfNeeded();const before=await track.evaluate((node)=>node.getBoundingClientRect().left);await page.waitForTimeout(900);const after=await track.evaluate((node)=>node.getBoundingClientRect().left);
  let centered=true,scaled=true,rounded=true,pausedOnInspect=true,arrowMoved=true;
  {
    const targetBox=await page.evaluate(()=>{const rail=document.querySelector(".archive-rail-window");if(!rail)return null;const a=rail.getBoundingClientRect();const card=[...document.querySelectorAll(".archive-rail-card")].find((node)=>{const b=node.getBoundingClientRect();return b.left>=a.left&&b.right<=a.right;});if(!card)return null;const b=card.getBoundingClientRect();return {x:b.left+b.width/2,y:b.top+b.height/2};});
    if(targetBox) await page.mouse.move(targetBox.x,targetBox.y);await page.waitForTimeout(1000);
    ({centered,scaled,rounded}=await page.evaluate(()=>{const rail=document.querySelector(".archive-rail-window");const cards=[...document.querySelectorAll(".archive-rail-card.is-inspected")];if(!rail||!cards.length)return {centered:false,scaled:false,rounded:false};const a=rail.getBoundingClientRect();const card=cards.sort((one,two)=>{const x=one.getBoundingClientRect(),y=two.getBoundingClientRect(),center=a.left+a.width/2;return Math.abs(x.left+x.width/2-center)-Math.abs(y.left+y.width/2-center);})[0];const b=card.getBoundingClientRect(),style=getComputedStyle(card),matrix=new DOMMatrixReadOnly(style.transform);return {centered:Math.abs((a.left+a.width/2)-(b.left+b.width/2))<20,scaled:matrix.a>1.025,rounded:parseFloat(style.borderRadius)>=18};}));
    const inspectBefore=await rail.evaluate((node)=>node.scrollLeft);await page.waitForTimeout(450);const inspectAfter=await rail.evaluate((node)=>node.scrollLeft);pausedOnInspect=Math.abs(inspectAfter-inspectBefore)<1;
    if(!profile.low){
    const arrowBefore=await rail.evaluate((node)=>node.scrollLeft);await page.getByRole("button",{name:/next project/i}).click();await page.waitForTimeout(650);const arrowAfter=await rail.evaluate((node)=>node.scrollLeft);arrowMoved=arrowAfter>arrowBefore;
    }
  }
  const metrics=await page.evaluate(()=>{const windowNode=document.querySelector(".archive-rail-window");return {performanceMode:document.documentElement.dataset.performance,reducedMotion:matchMedia("(prefers-reduced-motion: reduce)").matches,pageHeight:document.documentElement.scrollHeight,primaryProjects:document.querySelectorAll(".archive-card-primary").length,copies:document.querySelectorAll(".archive-rail-copy .archive-rail-card").length,windowHeight:windowNode?.getBoundingClientRect().height,railScrollable:Boolean(windowNode&&windowNode.scrollWidth>windowNode.clientWidth),controls:document.querySelectorAll(".archive-rail-controls button").length,pageOverflow:document.documentElement.scrollWidth-innerWidth};});
  await page.evaluate(()=>document.querySelector(".archive-rail-section")?.scrollIntoView({block:"start"}));await page.waitForTimeout(500);
  await page.screenshot({path:`.visual-tests/archive-rail-${profile.name}.png`});
  report.push({...profile,...metrics,before,after,railClass:await rail.getAttribute("class"),moved:before!==after,movedRight:after>before,centered,scaled,rounded,pausedOnInspect,arrowMoved,errors});await page.close();
}
await browser.close();console.log(JSON.stringify(report,null,2));
const desktop=report[0],mobile=report[1];
if(desktop.primaryProjects!==21||desktop.copies!==21||desktop.controls!==2||!desktop.moved||!desktop.movedRight||!desktop.centered||!desktop.scaled||!desktop.rounded||!desktop.pausedOnInspect||!desktop.arrowMoved||desktop.pageOverflow>1||desktop.errors.length) process.exitCode=1;
if(mobile.primaryProjects!==21||mobile.copies!==21||!mobile.moved||!mobile.movedRight||!mobile.railScrollable||mobile.pageOverflow>1||mobile.errors.length) process.exitCode=1;
