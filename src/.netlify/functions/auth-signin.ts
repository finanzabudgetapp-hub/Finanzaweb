import type { Handler } from "@netlify/functions";
import { DB_USER } from "../../_mock/assets_backup";
import { ResultStatus } from "#/enum"; // ✅ adjust if your enums are in #/enum

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
    const user = DB_USER.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          status: ResultStatus.ERROR,
          message: "Invalid credentials",
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: ResultStatus.SUCCESS, // ✅ matches frontend expectation
        message: "Login successful",
        data: {
          token: "demo-token-123",
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
          },
        },
      }),
    };
  } catch (error) {
    console.error("Auth error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: ResultStatus.ERROR,
        message: "Server error",
        error: (error as Error).message,
      }),
    };
  }
};
