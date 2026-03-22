import { defineConfig } from "drizzle-kit";
import path from "path";

const dbPath = process.env["SQLITE_DB_PATH"] ?? path.join(process.cwd(), "blog.db");

export default defineConfig({
  schema: path.join(__dirname, "./src/schema/index.ts"),
  dialect: "turso",
  dbCredentials: {
    url: `file:${dbPath}`,
  },
});
