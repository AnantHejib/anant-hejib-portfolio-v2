import { ImageResponse } from "next/og";

export const alt="Anant Hejib — AI, Computer Vision and Robotics Engineer";
export const size={width:1200,height:630};
export const contentType="image/png";

export default function OpenGraphImage(){
  return new ImageResponse(
    <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"72px",background:"#05080d",color:"#f5fbfc",fontFamily:"Arial, sans-serif",border:"2px solid #173640"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:22,letterSpacing:5,color:"#4fd1e5"}}><span>ANANT HEJIB</span><span>ENGINEERING PORTFOLIO</span></div>
      <div style={{display:"flex",flexDirection:"column"}}><div style={{display:"flex",fontSize:84,fontWeight:700,lineHeight:1.02}}>I BUILD INTELLIGENT MACHINES<span style={{color:"#4fd1e5"}}>.</span></div><div style={{fontSize:28,marginTop:30,color:"#9db0b7"}}>AI · COMPUTER VISION · ROBOTICS · FULL-STACK</div></div>
      <div style={{fontSize:18,letterSpacing:3,color:"#718790"}}>PUNE, INDIA // SYSTEMS THAT PERCEIVE, DECIDE AND SHIP</div>
    </div>,size
  );
}
