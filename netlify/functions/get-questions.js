// netlify/functions/get-questions.js
exports.handler = async (event, context) => {
  const NEON_URL = process.env.NEON_DATA_API_URL;
  const NEON_KEY = process.env.NEON_API_KEY;

  // Handle "Preflight" requests (Browsers do this for security)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      },
      body: "",
    };
  }

  try {
    const response = await fetch(`${NEON_URL}/sql`, {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${NEON_KEY}`,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: "SELECT * FROM questions;" })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // This tells the browser the data is safe
      },
      body: JSON.stringify(data.rows || []),
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: error.message }) 
    };
  }
};
