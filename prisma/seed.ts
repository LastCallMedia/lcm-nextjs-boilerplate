// Use the default Prisma client import for compatibility with tsx and ESM scripts
import { db } from "~/server/db";

async function main() {
  // Seed admin users
  const adminUsers = [
    { name: "Jen", email: "jen@lastcallmedia.com" },
    { name: "Luke", email: "luke@lastcallmedia.com" },
    { name: "Phoenix", email: "phoenix@lastcallmedia.com" },
    { name: "Raiyan", email: "raiyan@lastcallmedia.com" },
    { name: "Brady", email: "brady@lastcallmedia.com" },
    { name: "Fawn", email: "fawn@lastcallmedia.com" },
    { name: "Gregg", email: "gregg@lastcallmedia.com" },
    { name: "Nazmul", email: "nazmul.huda@lastcallmedia.com" },
  ];
  for (const admin of adminUsers) {
    await db.user.upsert({
      where: { email: admin.email },
      update: {},
      create: {
        name: admin.name,
        email: admin.email,
        role: "ADMIN",
        emailVerified: new Date(),
      },
    });
  }

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

  console.log("Seeded admin users and normal user.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void db.$disconnect();
  });
