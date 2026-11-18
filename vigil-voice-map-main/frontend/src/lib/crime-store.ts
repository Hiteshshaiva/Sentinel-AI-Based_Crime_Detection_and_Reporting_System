export type CrimeType = "theft" | "assault" | "fraud" | "vandalism" | "other";

export interface CrimeReport {
  id: string;
  crime_type: CrimeType;
  location: string;
  description: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

const API = "/api/reports";

export async function getReports(): Promise<CrimeReport[]> {
  const res = await fetch(API);
  if (!res.ok) {
    throw new Error("Failed to load reports");
  }
  return await res.json();
}

export async function addReport(
  report: Omit<CrimeReport, "id" | "timestamp">
): Promise<CrimeReport> {
  const response = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(report),
  });

  if (!response.ok) {
    throw new Error("Failed to save report");
  }

  return await response.json();
}

export async function deleteReport(id: string) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
}

export function getCrimeColor(type: CrimeType): string {
  const colors: Record<CrimeType, string> = {
    theft: "hsl(200,80%,45%)",
    assault: "hsl(0,84%,60%)",
    fraud: "hsl(35,92%,50%)",
    vandalism: "hsl(270,60%,55%)",
    other: "gray",
  };

  return colors[type];
}

export function analyzeCrime(text: string): CrimeType {
  const lower = text.toLowerCase();

  const categories: Record<CrimeType, string[]> = {
    theft: [
      "stole",
      "stolen",
      "theft",
      "robbed",
      "steal",
      "wallet",
      "phone",
      "bike",
    ],
    assault: [
      "attack",
      "attacked",
      "fight",
      "hit",
      "assault",
      "stab",
    ],
    fraud: [
      "fraud",
      "scam",
      "fake",
      "credit card",
      "phishing",
    ],
    vandalism: [
      "graffiti",
      "broken",
      "damage",
      "vandalism",
      "destroy",
    ],
    other: [],
  };

  for (const [type, words] of Object.entries(categories)) {
    if (words.some((w) => lower.includes(w))) {
      return type as CrimeType;
    }
  }

  return "other";
}