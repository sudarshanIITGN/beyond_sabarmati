export default async function handler(req, res) {
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

        // If Neon sends back an error message (like the password one)
        if (result.message) {
            return res.status(500).json({ error: result.message });
        }

        // Send the rows back to your HTML
        return res.status(200).json(result.rows || []);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
