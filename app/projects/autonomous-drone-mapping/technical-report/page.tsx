import type { Metadata } from "next";
import { AscendTechnicalReport } from "@/components/AscendTechnicalReport";

export const metadata: Metadata = {
  title: "ASCEND Technical Report | Anant Hejib",
  description: "Technical presentation of Team IIC_SIT's ASCEND GPS-denied autonomous UAV and automated base station for IRoC-U 2026.",
};

export default function AscendReportPage() {
  return <AscendTechnicalReport/>;
}
