import type { Config, Context } from "@netlify/functions";
import { getDatabase } from "@netlify/database";

const CRIME_TYPES = new Set(["theft", "assault", "fraud", "vandalism", "other"]);

type Row = {
  id: number;
  crime_type: string;
  location: string;
  description: string;
  latitude: number;
  longitude: number;
  timestamp: Date | string;
};

const toReport = (r: Row) => ({
  id: String(r.id),
  crime_type: r.crime_type,
  location: r.location,
  description: r.description,
  latitude: Number(r.latitude),
  longitude: Number(r.longitude),
  timestamp: new Date(r.timestamp).toISOString(),
});

export default async (req: Request, context: Context) => {
  const db = getDatabase();

  try {
    if (req.method === "GET") {
      const rows = (await db.sql`
        SELECT * FROM crime_reports ORDER BY timestamp DESC
      `) as Row[];
      return Response.json(rows.map(toReport));
    }

    if (req.method === "POST") {
      const body = await req.json().catch(() => null);
      const latitude = Number(body?.latitude);
      const longitude = Number(body?.longitude);
      if (!body || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return Response.json({ error: "Invalid report" }, { status: 400 });
      }
      const crimeType = CRIME_TYPES.has(body.crime_type) ? body.crime_type : "other";
      const [row] = (await db.sql`
        INSERT INTO crime_reports (crime_type, location, description, latitude, longitude)
        VALUES (${crimeType}, ${String(body.location ?? "")}, ${String(body.description ?? "")}, ${latitude}, ${longitude})
        RETURNING *
      `) as Row[];
      return Response.json(toReport(row), { status: 201 });
    }

    if (req.method === "DELETE") {
      const id = Number(context.params.id);
      if (!Number.isInteger(id)) {
        return Response.json({ error: "Invalid id" }, { status: 400 });
      }
      await db.sql`DELETE FROM crime_reports WHERE id = ${id}`;
      return Response.json({ success: true });
    }

    return new Response("Method not allowed", { status: 405 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
};

export const config: Config = {
  path: ["/api/reports", "/api/reports/:id"],
};
