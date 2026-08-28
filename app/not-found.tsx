import Link from "next/link";

export default function NotFound(){
  return <main style={{minHeight:"100svh",display:"grid",placeItems:"center",padding:"24px",background:"#05080d",color:"#edf8fa",fontFamily:"Arial,sans-serif"}}><section style={{maxWidth:560,border:"1px solid #1d4652",borderRadius:12,padding:"36px",background:"#081117"}}><p style={{color:"#4fd1e5",letterSpacing:".18em",fontSize:12}}>404 // ROUTE NOT FOUND</p><h1>This mission does not exist.</h1><p style={{color:"#9bb0b7",lineHeight:1.7}}>The link may be old or mistyped. Return to the engineering portfolio and continue exploring.</p><Link href="/" style={{display:"inline-block",marginTop:12,border:"1px solid #4fd1e5",borderRadius:8,padding:"12px 18px",background:"#4fd1e5",color:"#031015",fontWeight:700,textDecoration:"none"}}>RETURN HOME</Link></section></main>;
}
