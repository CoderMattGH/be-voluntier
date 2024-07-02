import { ENV } from "../env-parser";

import { Pool } from "pg";

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set!");
}

type Config = { connectionString?: string; max?: number };

let config: Config = {};
if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

export const db = new Pool(config);
