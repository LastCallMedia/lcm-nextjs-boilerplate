// Jest setup for testing
require("@testing-library/jest-dom");

// Extend Jest matchers for accessibility testing
const { toHaveNoViolations } = require("jest-axe");
expect.extend(toHaveNoViolations);

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
  useParams: jest.fn(),
  redirect: jest.fn(),
}));

// Mock NextAuth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  getSession: jest.fn(),
}));

// Mock environment variables
process.env.NEXTAUTH_SECRET = "test-secret";
process.env.NEXTAUTH_URL = "http://localhost:3000";
