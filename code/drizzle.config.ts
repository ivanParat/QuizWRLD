import { defineConfig } from "drizzle-kit";

import { config } from "dotenv";
config({ path: ".env" });
export default defineConfig({
  schema: "app/db/schema.ts",
  out: "app/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
