import { db } from "~/server/db";

async function seedPosts() {
  // Check if posts already exist
  const existingCount = await db.post.count();
  if (existingCount > 0) {
    console.log(`Database already has ${existingCount} posts. Skipping seed.`);
    return;
  }

  // Get the first user from the database
  const user = await db.user.findFirst();
  if (!user) {
    console.log("No users found. Please create a user first.");
    return;
  }

  console.log(`Seeding database with ${samplePosts.length} posts...`);

  for (const postContent of samplePosts) {
    await db.post.create({
      data: {
        name: postContent,
        createdBy: { connect: { id: user.id } },
      },
    });
  }

  console.log("✅ Database seeded successfully!");
}

seedPosts()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void db.$disconnect();
  });

const samplePosts = [
  "Just deployed my new Next.js app!",
  "Learning tRPC and loving the type safety",
  "Infinite scroll is working perfectly",
  "Building amazing user experiences",
  "TypeScript makes development so much better",
  "React Query handles caching beautifully",
  "Tailwind CSS speeds up my styling workflow",
  "Database queries are lightning fast with Prisma",
  "Authentication flow is seamless with NextAuth",
  "Docker makes deployment consistent",
  "Testing ensures code quality",
  "Performance optimization is crucial",
  "User feedback drives feature development",
  "Code reviews improve team collaboration",
  "Documentation helps future developers",
  "Accessibility should be a priority",
  "Mobile-first design is essential",
  "API design affects frontend experience",
  "State management keeps UI predictable",
  "Error handling improves user experience",
  "Loading states provide better UX",
  "Responsive design works on all devices",
  "SEO optimization increases visibility",
  "Security best practices protect users",
  "Performance monitoring catches issues early",
  "A/B testing validates feature decisions",
  "Analytics provide valuable insights",
  "Automated deployments reduce errors",
  "Code splitting improves load times",
  "Progressive enhancement ensures broad compatibility",
  "Feature flags enable gradual rollouts",
  "Server-side rendering improves SEO",
  "Static site generation boosts performance",
  "Environment variables keep secrets safe",
  "CI/CD pipelines automate testing",
  "Webhooks enable real-time updates",
  "Custom hooks simplify logic reuse",
  "Monorepos streamline code sharing",
  "Linting enforces code standards",
  "Prettier keeps formatting consistent",
  "GraphQL enables flexible APIs",
  "REST APIs are easy to cache",
  "Microservices scale independently",
  "Edge functions reduce latency",
  "WebSockets enable live collaboration",
  "OAuth simplifies third-party login",
  "Rate limiting prevents abuse",
  "Error boundaries catch UI crashes",
  "SSR fallback improves reliability",
  "Internationalization expands reach",
];
