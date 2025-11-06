import type { Handler } from "@netlify/functions";

enum ResultStatus {
  SUCCESS = 0,
  ERROR = 1,
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({
        status: ResultStatus.ERROR,
        message: "Method not allowed",
      }),
    };
  }

  try {
    const { username, password } = JSON.parse(event.body || "{}");

    // Simple static login (you can later connect this to your demo backend)
    if (username !== "admin" || password !== "demo1234") {
      return {
        statusCode: 200,
        body: JSON.stringify({
          status: ResultStatus.ERROR,
          message: "Invalid username or password",
          data: null,
        }),
      };
    }

    // ✅ Return structure that matches SignInRes + Result<T>
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: ResultStatus.SUCCESS,
        message: "Login successful",
        data: {
          token: "demo-token-12345",
          user: {
            id: "1",
            username: "admin",
            email: "admin@example.com",
            avatar: "https://i.pravatar.cc/100?img=3",
          },
        },
      }),
    };
  } catch (error) {
    console.error("Sign-in error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: ResultStatus.ERROR,
        message: "Internal server error",
        data: null,
      }),
    };
  }
};
