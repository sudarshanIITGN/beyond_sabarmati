// netlify/functions/get-questions.js
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
      // The semicolon at the end of the query is a best practice in Postgres
      body: JSON.stringify({ query: "SELECT * FROM questions;" })
    });

    const result = await response.json();

    // If Neon returns an error (like a timeout or auth issue)
    if (result.error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: result.error })
        };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      // Return the rows array directly
      body: JSON.stringify(result.rows || [])
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "The backend is currently unavailable." }) 
    };
  }
};
