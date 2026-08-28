import type { Metadata, Viewport } from "next";
import "./globals.css";

const configuredUrl=process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000";
const siteUrl=new URL(configuredUrl);

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "Anant Hejib | AI, Computer Vision & Robotics Engineer",
  description: "Anant Hejib is an AI/ML, computer vision, robotics and full-stack engineer with industry experience in robotic perception, autonomous drone mapping and production software.",
  keywords: ["Anant Hejib", "AI engineer", "machine learning engineer", "computer vision engineer", "robotics engineer", "full-stack developer", "OpenCV", "ROS 2", "PX4", "Python"],
  authors: [{ name: "Anant Hejib", url: "https://github.com/AnantHejib" }],
  creator: "Anant Hejib",
  alternates: { canonical: "/" },
  applicationName: "Anant Hejib Engineering Portfolio",
  category: "technology",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Anant Hejib | AI, Computer Vision & Robotics Engineer",
    description: "Engineering autonomous systems, robotic perception and production software.",
    type: "profile",
    url: "/",
    siteName: "Anant Hejib Engineering Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anant Hejib | AI, Computer Vision & Robotics Engineer",
    description: "Engineering autonomous systems, robotic perception and production software.",
  },
};

export const viewport:Viewport={
  width:"device-width",
  initialScale:1,
  viewportFit:"cover",
  themeColor:[{media:"(prefers-color-scheme: dark)",color:"#05080d"},{media:"(prefers-color-scheme: light)",color:"#f4f8f9"}],
  colorScheme:"dark light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const profile = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Anant Hejib",
    jobTitle: ["AI/ML Engineer", "Computer Vision Engineer", "Robotics Engineer", "Full-Stack Developer"],
    url: siteUrl.toString(),
    sameAs: ["https://github.com/AnantHejib", "https://www.linkedin.com/in/anant-hejib-b277a82a2/"],
    alumniOf: { "@type": "CollegeOrUniversity", name: "Sinhgad Institute of Technology, Lonavala" },
    knowsAbout: ["Artificial Intelligence", "Machine Learning", "Computer Vision", "Robotics", "Autonomous Systems", "Full-Stack Development"],
  };
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{__html:`try{var t=localStorage.getItem('anant-theme');document.documentElement.dataset.theme=t==='light'||t==='dark'?t:(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark')}catch(e){document.documentElement.dataset.theme='dark'}`}}/></head>
      <body className="font-sans"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profile) }}/>{children}</body>
    </html>
  );
}
