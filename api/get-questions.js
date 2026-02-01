module.exports = async (req, res) => {
  // Use the URL you just updated in Vercel settings
  const url = process.env.NEON_DATA_API_URL; 
  const key = process.env.NEON_API_KEY;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key.trim()}`,
        'Content-Type': 'application/json',
        'Neon-Database': 'neondb'
      },
      body: JSON.stringify({ query: "SELECT * FROM public.questions;" })
    });

    const result = await response.json();

    // If Neon sends an error object back
    if (result.message || result.error) {
      return res.status(500).json({ error: result.message || result.error });
    }

    // Return just the rows to your HTML
    const rows = result.rows || (Array.isArray(result) ? result : []);
    return res.status(200).json(rows);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
