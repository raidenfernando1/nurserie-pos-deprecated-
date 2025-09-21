import { betterAuth, jwt } from "better-auth";
import { username, createAuthMiddleware } from "better-auth/plugins";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
  }),

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "cashier",
        input: false,
      },
      admin_id: {
        type: "string",
        defaultValue: null,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [username()],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_SECRET_KEY!,
    },
  },

  baseURL: "http://localhost:3000",
});

export default auth;
