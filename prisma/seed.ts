// Use the default Prisma client import for compatibility with tsx and ESM scripts
import { db } from "~/server/db";

async function main() {
  // Seed admin user
  const adminEmail = "admin@example.com";
  await db.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Admin User",
      email: adminEmail,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  // Seed normal user
  const userEmail = "user@example.com";
  await db.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      name: "Normal User",
      email: userEmail,
      role: "USER",
      emailVerified: new Date(),
    },
  });

  console.log("Seeded admin and normal user.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void db.$disconnect();
  });
