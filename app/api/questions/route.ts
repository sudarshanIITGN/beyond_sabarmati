import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    const questions = await sql`
      SELECT
        question_id,
        genre,
        context,
        question_text,
        options
      FROM questions
      ORDER BY question_id;
    `;

    return new Response(JSON.stringify(questions), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch questions:", error);

    return new Response(
      JSON.stringify({ error: "Failed to fetch questions" }),
      { status: 500 }
    );
  }
}
