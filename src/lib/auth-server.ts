import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { Pool } from "pg";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { admin } from "better-auth/plugins";
import { baseUrl } from "@/components/data";

export function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(16);
    scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(salt.toString("hex") + ":" + derivedKey.toString("hex"));
    });
  });
}

export async function verifyPassword(data: {
  hash: string;
  password: string;
}): Promise<boolean> {
  const { password, hash: stored } = data;
  const [saltHex, keyHex] = stored.split(":");
  const salt = Buffer.from(saltHex, "hex");
  const storedKey = Buffer.from(keyHex, "hex");
  return new Promise((resolve, reject) => {
    scrypt(password, salt, storedKey.length, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(timingSafeEqual(storedKey, derivedKey));
    });
  });
}

export const auth = betterAuth({
  secret:
    process.env.BETTER_AUTH_SECRET || "development-secret-change-in-production",
  database: new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
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
      adminUserIds: [
        "RKvdVdU77zQF230CKUAY8gr2ujYEVWKq",
        "SrfdQ20gE5uSixwFMserwXMOeNVNxsGl",
      ],
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
