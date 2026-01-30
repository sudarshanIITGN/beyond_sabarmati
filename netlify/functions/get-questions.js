// netlify/functions/get-questions.js
exports.handler = async (event, context) => {
  const NEON_URL = process.env.NEON_DATA_API_URL;
  const NEON_KEY = process.env.NEON_API_KEY;

  try {
    const response = await fetch(`${NEON_URL}/sql`, {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${NEON_KEY}`,
          'Content-Type': 'application/json',
          // ADD THIS LINE: It tells the API which database to open
          'Neon-Database': 'neondb' 
      },
      body: JSON.stringify({ query: "SELECT * FROM questions;" })
    });

    const result = await response.json();
    
    // Debugging to see if rows finally appear
    console.log("DEBUG: Result Rows Count:", result.rows ? result.rows.length : "0");

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(result.rows || [])
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
