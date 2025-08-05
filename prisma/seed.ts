// Use the default Prisma client import for compatibility with tsx and ESM scripts
import { hashPassword } from "~/lib/password-utils";
import { db } from "~/server/db";

async function main() {
  /* Password for users
   * This password is used for both admin and normal users
   * It should be set in the .env file as USER_PASSWORD
   */
  const password = process.env.USER_PASSWORD;

  let hashedPassword: string | null = null;

  if (password) {
    hashedPassword = await hashPassword(password);
  }

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
    { name: "Admin", email: "admin@lastcallmedia.com" },
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
        password: hashedPassword,
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
      password: hashedPassword,
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
