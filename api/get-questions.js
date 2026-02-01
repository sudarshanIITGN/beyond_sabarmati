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

        // LOGGING: This will show up in your Vercel logs so we can see what Neon is actually sending
        console.log("Neon Raw Output:", JSON.stringify(result));

        // This handles every possible way Neon sends data back
        const rows = result.rows || (Array.isArray(result) ? result : []);
        
        return res.status(200).json(rows);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
