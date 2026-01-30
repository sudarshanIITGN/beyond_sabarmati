exports.handler = async (event, context) => {
  const NEON_URL = process.env.NEON_DATA_API_URL;
  const NEON_KEY = process.env.NEON_API_KEY;

  console.log("DEBUG: Using URL:", `${NEON_URL}/sql`);
  
  try {
    const response = await fetch(`${NEON_URL}/sql`, {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${NEON_KEY}`,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: "SELECT * FROM questions;" })
    });

    const result = await response.json();
    
    // This will print the actual structure Neon is sending back
    console.log("DEBUG: Full Neon Response:", JSON.stringify(result));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(result.rows || result)
    };
  } catch (err) {
    console.error("DEBUG: Crash Error:", err.message);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
