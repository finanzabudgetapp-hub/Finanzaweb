import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ message: "Method not allowed" }) };
  }

  try {
    const { username, password } = JSON.parse(event.body || "{}");

    // Simple demo authentication logic (replace with real backend or DB later)
    if (username === "admin" && password === "demo1234") {
      return {
        statusCode: 200,
        body: JSON.stringify({
          token: "mock-token-123",
          user: {
            id: "1",
            username: "admin",
            email: "demo@example.com",
          },
        }),
      };
    }

    return { statusCode: 401, body: JSON.stringify({ message: "Invalid credentials" }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: "Server error", error }) };
  }
};
