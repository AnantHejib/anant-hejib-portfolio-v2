import type { MetadataRoute } from "next";

export default function manifest():MetadataRoute.Manifest{
  return {
    name:"Anant Hejib Engineering Portfolio",
    short_name:"Anant Hejib",
    description:"AI, computer vision, robotics and full-stack engineering portfolio.",
    start_url:"/",
    display:"standalone",
    background_color:"#05080d",
    theme_color:"#4fd1e5",
    icons:[{src:"/icon.svg",sizes:"any",type:"image/svg+xml"}],
  };
}
