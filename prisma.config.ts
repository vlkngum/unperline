import { defineConfig } from "@prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { config } from "dotenv";

config();

const adapters = {
  postgres: ({ url }: { url: string }) => {
    const pool = new Pool({
      connectionString: url,
    });
    return new PrismaPg(pool);
  },
};

export default defineConfig({
  datasource: {
    // For migrations, we need to use url instead of adapter
    // The adapter is used in PrismaClient initialization (see app/lib/prisma.ts)
    url: process.env.DATABASE_URL!,
  },
});

