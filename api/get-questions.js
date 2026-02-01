export default async function handler(req, res) {
    // This now contains the FULL URL ending in /sql
    const fullUrl = process.env.NEON_DATA_API_URL;
    const key = process.env.NEON_API_KEY;

    try {
        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${key.trim()}`,
                'Content-Type': 'application/json',
                'Neon-Database': 'neondb'
            },
            body: JSON.stringify({ query: "SELECT * FROM public.questions;" })
        });

        const result = await response.json();

        // Check if Neon returned a 404 or other error message
        if (result.msg || result.message) {
            return res.status(500).json({ error: result.msg || result.message });
        }

        // Return the rows
        const rows = result.rows || (Array.isArray(result) ? result : []);
        return res.status(200).json(rows);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
