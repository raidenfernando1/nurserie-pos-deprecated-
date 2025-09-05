import { betterAuth } from "better-auth";
import { username, admin } from "better-auth/plugins";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
  }),
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

  baseUrl: "http://localhost:3000",
});

export default auth;
