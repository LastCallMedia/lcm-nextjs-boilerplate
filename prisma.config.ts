import "dotenv/config";
import { defineConfig } from "prisma/config";
import path from "node:path";

/**
 * Prisma Configuration File
 * This replaces the deprecated package.json#prisma configuration
 * @see https://www.prisma.io/docs/orm/reference/prisma-config-reference
 */
export default defineConfig({
  // Schema location (default: ./prisma/schema.prisma)
  schema: path.join("prisma", "schema.prisma"),

  // Migration configuration
  migrations: {
    // Custom migrations path (default: ./prisma/migrations)
    path: path.join("prisma", "migrations"),

    // Seed script configuration with environment file
    seed: "tsx --env-file=.env prisma/seed.ts",
  },

  // TypedSQL configuration (for future use with typedSql preview feature)
  typedSql: {
    path: path.join("prisma", "sql"),
  },

  // Database views configuration (for future use)
  views: {
    path: path.join("prisma", "views"),
  },
});
