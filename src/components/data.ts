export const company = {
  name: "Nurserie",
  brand: ["MUSHIE", "FRIGG", "MOONIE", "NAJELL"],
};

// Detect environment
const isDev = process.env.NODE_ENV !== "production";

export const devUrl = "http://localhost:3000";
export const prodUrl = "https://nurserie-pos.vercel.app/";

export const baseUrl = isDev ? devUrl : prodUrl;
