import missionsJson from "@/content/missions.json";
import type { Mission } from "./types";

export function getMissions(): Mission[] {
  return missionsJson as Mission[];
}

export function getMission(slug: string): Mission | undefined {
  return getMissions().find((mission) => mission.slug === slug);
}
