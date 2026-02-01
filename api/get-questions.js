// api/get-questions.js
export default async function handler(request, response) {
  const NEON_FULL_URL = process.env.NEON_DATA_API_URL;
  const NEON_KEY = process.env.NEON_API_KEY;

  try {
    const res = await fetch(NEON_FULL_URL, {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${NEON_KEY}`,
          'Content-Type': 'application/json',
          'Neon-Database': 'neondb'
      },
      body: JSON.stringify({ query: "SELECT * FROM questions;" })
    });

    const result = await res.json();

    // Vercel uses response.status().json() syntax
    return response.status(200).json(result.rows || []);
    
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
