import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { Pool } from "pg";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { admin } from "better-auth/plugins";

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

  plugins: [
    username(),
    admin({
      defaultRole: "cashier",
      adminUserIds: [
        "DQ6QE041xsIVa8g7GPXeTTgZkp81l6cH",
        "d5zYyaanwqcdcfZGU3cCVC4jB0t0zMxb",
      ],
    }),
  ],

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_SECRET_KEY!,
    },
  },

  baseURL: "http://localhost:3000",
});

export default auth;
