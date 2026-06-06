import type { Metadata } from "next";
import { getAppData } from "@/lib/data";
import { LehrkraftView } from "@/components/audience";

export const metadata: Metadata = {
  title: "Für Lehrkräfte — Lernassistent",
  description:
    "Vom Lehrplan-Thema zu aktuellen Einstiegen, Einstiegsfragen und fertigen Stunden — aus dem realen Medienkonsum deiner Klasse.",
};

export default function LehrkraftPage() {
  return <LehrkraftView data={getAppData()} />;
}
