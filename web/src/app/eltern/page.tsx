import type { Metadata } from "next";
import { getAppData } from "@/lib/data";
import { ElternView } from "@/components/audience";

export const metadata: Metadata = {
  title: "Für Eltern — Lernassistent",
  description:
    "Was dein Kind schaut — und was schulisch dahintersteckt: mit Gesprächsanlässen und Sicherheits-Hinweisen.",
};

export default function ElternPage() {
  return <ElternView data={getAppData()} />;
}
