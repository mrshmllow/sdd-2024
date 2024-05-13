import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "./schema";

// for migrations
const connection = postgres(process.env.DATABASE_URL!, { max: 1 });

export const db = drizzle(connection, { schema });

migrate(db, { migrationsFolder: "./drizzle" });
