"use client";

import { useEffect } from "react";

export default function ErrorPage({error,reset}:{error:Error&{digest?:string};reset:()=>void}){
  useEffect(()=>{console.error("Portfolio render error",error);},[error]);
  return <main style={{minHeight:"100svh",display:"grid",placeItems:"center",padding:"24px",background:"#05080d",color:"#edf8fa",fontFamily:"Arial,sans-serif"}}><section style={{maxWidth:560,border:"1px solid #1d4652",borderRadius:12,padding:"36px",background:"#081117"}}><p style={{color:"#4fd1e5",letterSpacing:".18em",fontSize:12}}>SYSTEM RECOVERY</p><h1>That section did not load correctly.</h1><p style={{color:"#9bb0b7",lineHeight:1.7}}>Your connection and the rest of the site are safe. Retry the render, or return to the main portfolio.</p><button type="button" onClick={reset} style={{marginTop:12,border:"1px solid #4fd1e5",borderRadius:8,padding:"12px 18px",background:"#4fd1e5",color:"#031015",fontWeight:700}}>TRY AGAIN</button></section></main>;
}
