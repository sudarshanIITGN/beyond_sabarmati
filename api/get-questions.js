module.exports = async (req, res) => {
  const url = process.env.NEON_DATA_API_URL; // https://...tech/sql
  const key = process.env.NEON_API_KEY;      // Your Personal API Key

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key.trim()}`,
        'Content-Type': 'application/json'
      },
      // We pass the database name inside the body instead of a header
      body: JSON.stringify({ 
        query: "SELECT * FROM public.questions;",
        database: "neondb" 
      })
    });

    const result = await response.json();

    // If Neon is still complaining, this will catch the specific message
    if (result.message) {
      return res.status(500).json({ error: result.message });
    }

    return res.status(200).json(result.rows || []);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
