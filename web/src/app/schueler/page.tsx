import type { Metadata } from "next";
import { getAppData } from "@/lib/data";
import { SchuelerView } from "@/components/audience";

export const metadata: Metadata = {
  title: "Für Schüler:innen — Lernassistent",
  description: "Dein Alltag steckt voller Schulstoff — entdecken und gleich interaktiv üben.",
};

export default function SchuelerPage() {
  return <SchuelerView data={getAppData()} />;
}
