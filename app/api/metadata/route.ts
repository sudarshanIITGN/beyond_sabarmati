import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  try {
    const unitsResult = await pool.query(`
      SELECT DISTINCT unit
      FROM questions
      WHERE unit IS NOT NULL
      ORDER BY unit;
    `);

    const yearsResult = await pool.query(`
      SELECT DISTINCT year
      FROM questions
      WHERE year IS NOT NULL
      ORDER BY year;
    `);

    return NextResponse.json({
      units: unitsResult.rows.map(r => r.unit),
      years: yearsResult.rows.map(r => r.year),
    });
  } catch (error) {
    console.error("API /metadata error:", error);
    return NextResponse.json(
      { error: "Failed to fetch metadata" },
      { status: 500 }
    );
  }
}
