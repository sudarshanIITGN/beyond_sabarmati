// api/get-questions.js
export default async function handler(req, res) {
  const NEON_REST_URL = process.env.NEON_DATA_API_URL;
  const NEON_KEY = process.env.NEON_API_KEY;

  try {
    const response = await fetch(
      `${NEON_REST_URL}/questions?select=*`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${NEON_KEY}`,
          'apikey': NEON_KEY
        }
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
