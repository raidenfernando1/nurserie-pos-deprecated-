import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { Pool } from "pg";
import { admin } from "better-auth/plugins";
import { baseUrl } from "@/components/data";

export const auth = betterAuth({
  secret:
    process.env.BETTER_AUTH_SECRET || "development-secret-change-in-production",
  database: new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      admin_id: {
        type: "string",
        defaultValue: null,
      },
    },
  },
  plugins: [
    username(),
    admin({
      defaultRole: "cashier",
      bannedUserMessage:
        "This account is currently not active. Please contact your administrator to activate your account.",
      adminUserIds: ["RKvdVdU77zQF230CKUAY8gr2ujYEVWKq"],
    }),
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_SECRET_KEY!,
    },
  },
  baseURL: baseUrl,
});

export default auth;
