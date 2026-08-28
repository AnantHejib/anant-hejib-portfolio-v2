import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";

await mkdir(".visual-tests",{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"});
const report=[];

for(const profile of [{name:"desktop",width:1440,height:900},{name:"mobile",width:360,height:740}]){
  const page=await browser.newPage({viewport:{width:profile.width,height:profile.height}});
  const errors=[];
  page.on("pageerror",(error)=>errors.push(error.message));
  page.on("console",(message)=>{if(message.type()==="error") errors.push(message.text());});
  await page.goto("http://127.0.0.1:3000",{waitUntil:"networkidle"});
  const enter=page.getByRole("button",{name:/enter portfolio/i});
  if(await enter.isVisible().catch(()=>false)) await enter.click();
  await page.waitForSelector('[data-intro="active"]',{state:"detached",timeout:12000}).catch(()=>{});
  await page.locator(".lucy-launch").click();
  await page.getByLabel("Ask Lucy a question").fill("Hi there, can you help me?");
  await page.getByRole("button",{name:"Send message"}).click();
  await page.getByText(/what’s on your mind/i).waitFor({timeout:10000});
  await page.getByText("PERSONAL ASSISTANT").last().waitFor({timeout:10000});
  await page.reload({waitUntil:"networkidle"});
  const enterAgain=page.getByRole("button",{name:/enter portfolio/i});if(await enterAgain.isVisible().catch(()=>false)) await enterAgain.click();
  await page.waitForSelector('[data-intro="active"]',{state:"detached",timeout:12000}).catch(()=>{});
  await page.locator(".lucy-launch").click();
  await page.getByText("Hi there, can you help me?").waitFor({timeout:10000});
  const metrics=await page.evaluate(()=>{
    const panel=document.querySelector(".lucy-panel")?.getBoundingClientRect();
    return {messages:document.querySelectorAll(".lucy-message").length,memorySaved:Boolean(localStorage.getItem("lucy-conversation-v1")),panelInsideViewport:Boolean(panel&&panel.left>=0&&panel.top>=0&&panel.right<=innerWidth&&panel.bottom<=innerHeight),pageOverflow:document.documentElement.scrollWidth-innerWidth};
  });
  await page.screenshot({path:`.visual-tests/lucy-${profile.name}.png`});
  report.push({...profile,...metrics,errors});
  await page.close();
}

await browser.close();
console.log(JSON.stringify(report,null,2));
if(report.some((item)=>item.messages<3||!item.memorySaved||!item.panelInsideViewport||item.pageOverflow>1||item.errors.length)) process.exitCode=1;
