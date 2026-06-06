import { getAppData } from "@/lib/data";
import { Landing } from "@/components/landing";

export default function Home() {
  // Echtes Beispiel-Szenario aus den Daten (deutscher Inhalt, bleibt deutsch).
  const data = getAppData();
  const demo = data.byBubble["klasse_6"]?.["Deutsch"];
  const beispiel = demo?.matches.find((m) => m.einstiegsfrage) ?? demo?.matches[0] ?? null;

  return (
    <Landing
      beispiel={
        beispiel ? { szenario: beispiel.szenario, einstiegsfrage: beispiel.einstiegsfrage } : null
      }
    />
  );
}
