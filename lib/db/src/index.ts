import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import path from "path";
import * as schema from "./schema";

const dbPath = process.env["SQLITE_DB_PATH"]
  ? `file:${process.env["SQLITE_DB_PATH"]}`
  : `file:${path.join(process.cwd(), "blog.db")}`;

const client = createClient({ url: dbPath });

export const db = drizzle(client, { schema });

export * from "./schema";
