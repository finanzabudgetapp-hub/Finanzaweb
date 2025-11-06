import type { Handler } from "@netlify/functions";
import axios from "axios";

export const handler: Handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method not allowed" }),
    };
  }

  try {
    // Parse credentials from frontend
    const body = JSON.parse(event.body || "{}");
    const { username, password } = body;

    // Forward the request to your EMO backend endpoint
    const response = await axios.post(
      "https://finanzatechnologies.com/api/auth-signin", // 👈 actual backend endpoint
      { username, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    // Return backend response directly to the frontend
    return {
      statusCode: response.status,
      body: JSON.stringify(response.data),
    };
  } catch (error: any) {
    console.error("Auth-signin error:", error);

    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to connect to backend";

    return {
      statusCode: status,
      body: JSON.stringify({ message }),
    };
  }
};
