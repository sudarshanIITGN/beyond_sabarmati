import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const unit = searchParams.get("unit");
    const year = searchParams.get("year");

    // HARD GATE: no unit or year → no questions
    if (!unit || !year) {
      return NextResponse.json({
        questions: [],
        page: 1,
        limit: 25,
        total: 0,
        totalPages: 0,
      });
    }

    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.max(parseInt(searchParams.get("limit") || "25", 10), 1);
    const offset = (page - 1) * limit;

    /* ===================== 1️⃣ COUNT ===================== */
    const countResult = await pool.query(
      `
      SELECT COUNT(*)
      FROM questions
      WHERE unit = $1 AND year = $2
      `,
      [unit, year]
    );

    const total = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(total / limit);

    /* ===================== 2️⃣ DATA (WITH CONTEXT JOIN) ===================== */
    const dataResult = await pool.query(
      `
      SELECT
        q.*,
        c.context_type,
        c.content AS context_content
      FROM questions q
      LEFT JOIN contexts c
        ON q.context_id = c.context_id
      WHERE q.unit = $1
        AND q.year = $2
      ORDER BY q.question_id DESC
      LIMIT $3 OFFSET $4
      `,
      [unit, year, limit, offset]
    );

    return NextResponse.json({
      questions: dataResult.rows,
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error) {
    console.error("API /questions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
