// api/get-questions.js
export default async function handler(req, res) {
  const NEON_SQL_URL = process.env.NEON_DATA_API_URL; // must end with /sql
  const NEON_KEY = process.env.NEON_API_KEY;

  try {
    const response = await fetch(NEON_SQL_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NEON_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: "SELECT * FROM public.questions;"
      })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    const result = await response.json();
    return res.status(200).json(result.rows || []);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
