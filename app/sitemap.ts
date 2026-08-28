import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";

export default function sitemap():MetadataRoute.Sitemap{
  const base=(process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000").replace(/\/$/,"");
  const now=new Date();
  return [
    {url:base,lastModified:now,changeFrequency:"monthly",priority:1},
    ...projects.map((project)=>({url:`${base}/projects/${project.slug}`,lastModified:now,changeFrequency:"monthly" as const,priority:.8})),
    {url:`${base}/projects/autonomous-drone-mapping/technical-report`,lastModified:now,changeFrequency:"yearly",priority:.7},
  ];
}
