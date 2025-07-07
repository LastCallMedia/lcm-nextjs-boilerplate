import { PrismaClient } from "./generated/client";
import { Role } from "./generated/enums";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with dummy users and posts...");

  // Create dummy users
  const user1 = await prisma.user.upsert({
    where: { email: "john.doe@example.com" },
    update: {},
    create: {
      email: "john.doe@example.com",
      name: "John Doe",
      role: Role.USER,
      emailVerified: new Date(),
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "jane.smith@example.com" },
    update: {},
    create: {
      email: "jane.smith@example.com",
      name: "Jane Smith",
      role: Role.USER,
      emailVerified: new Date(),
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: "bob.wilson@example.com" },
    update: {},
    create: {
      email: "bob.wilson@example.com",
      name: "Bob Wilson",
      role: Role.USER,
      emailVerified: new Date(),
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      role: Role.ADMIN,
      emailVerified: new Date(),
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
    },
  });

  console.log("✅ Created users:", {
    user1: user1.email,
    user2: user2.email,
    user3: user3.email,
    adminUser: adminUser.email,
  });

  // Create dummy posts
  const posts = [
    {
      name: "Getting Started with Next.js",
      createdById: user1.id,
    },
    {
      name: "Building Scalable React Applications",
      createdById: user1.id,
    },
    {
      name: "TypeScript Best Practices",
      createdById: user2.id,
    },
    {
      name: "Database Design Patterns",
      createdById: user2.id,
    },
    {
      name: "Modern CSS Techniques",
      createdById: user3.id,
    },
    {
      name: "API Design Guidelines",
      createdById: user3.id,
    },
    {
      name: "Testing Strategies for Web Apps",
      createdById: user1.id,
    },
    {
      name: "Performance Optimization Tips",
      createdById: user2.id,
    },
    {
      name: "Security Best Practices",
      createdById: adminUser.id,
    },
    {
      name: "Deployment and DevOps",
      createdById: adminUser.id,
    },
    {
      name: "User Experience Design",
      createdById: user3.id,
    },
    {
      name: "Advanced React Patterns",
      createdById: user1.id,
    },
  ];

  for (const post of posts) {
    await prisma.post.create({
      data: post,
    });
  }

  console.log(`✅ Created ${posts.length} posts`);

  // Get final counts
  const userCount = await prisma.user.count();
  const postCount = await prisma.post.count();
  const adminCount = await prisma.user.count({
    where: { role: Role.ADMIN },
  });

  console.log("📊 Database summary:");
  console.log(
    `   Users: ${userCount} (${adminCount} admin${adminCount !== 1 ? "s" : ""})`,
  );
  console.log(`   Posts: ${postCount}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("🎉 Seeding completed successfully!");
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
