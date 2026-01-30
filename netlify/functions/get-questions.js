const fetch = require('node-fetch'); // Standard for older Netlify environments

exports.handler = async (event, context) => {
  const NEON_URL = process.env.NEON_DATA_API_URL;
  const NEON_KEY = process.env.NEON_API_KEY;

  try {
    const response = await fetch(`${NEON_URL}/sql`, {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${NEON_KEY}`,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: "SELECT * FROM questions;" }) // Added semicolon
    });

    const data = await response.json();

    // Check if Neon returned an error inside the JSON
    if (data.error) {
        console.error("Neon Database Error:", data.error);
        return { statusCode: 500, body: JSON.stringify({ error: data.error }) };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // Allows your frontend to read it
      },
      body: JSON.stringify(data.rows || []),
    };
  } catch (error) {
    console.error("Function Crash:", error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Internal Server Error" }) 
    };
  }
};
