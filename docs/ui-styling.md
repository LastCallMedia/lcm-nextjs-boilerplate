# UI & Styling Guide

This guide covers the UI component system, styling approach, and design patterns used in the LCM Next.js Boilerplate.

## Overview

The UI system is built on top of modern design principles using:

- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: High-quality component library built on Radix UI
- **Radix UI**: Unstyled, accessible UI primitives
- **next-themes**: Theme switching with dark mode support
- **CSS Variables**: Design tokens for consistent theming

## Component Architecture

### shadcn/ui Integration

The project uses shadcn/ui components located in `src/_components/ui/`:

```
src/_components/ui/
├── accordion.tsx      # Collapsible content sections
├── alert.tsx         # Status messages and notifications
├── avatar.tsx        # User profile images
├── button.tsx        # Interactive buttons
├── card.tsx          # Content containers
├── dialog.tsx        # Modal dialogs
├── form.tsx          # Form components with validation
├── input.tsx         # Text input fields
├── label.tsx         # Form labels
├── select.tsx        # Dropdown selections
├── table.tsx         # Data tables
├── theme-provider.tsx # Theme context provider
└── ...
```

### Component Structure

Each UI component follows this pattern:

```typescript
// Example: button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

## Design System

### Color Palette

The design system uses CSS custom properties for theming:

```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark mode values */
}
```

### Typography Scale

```css
/* Typography utilities */
.text-h1 {
  @apply text-4xl font-bold tracking-tight lg:text-5xl;
}
.text-h2 {
  @apply text-3xl font-semibold tracking-tight;
}
.text-h3 {
  @apply text-2xl font-semibold tracking-tight;
}
.text-h4 {
  @apply text-xl font-semibold tracking-tight;
}
.text-p {
  @apply leading-7;
}
.text-small {
  @apply text-muted-foreground text-sm;
}
.text-large {
  @apply text-lg font-semibold;
}
```

### Spacing System

Tailwind's default spacing scale (based on 0.25rem units):

```typescript
// Common spacing patterns
const spacing = {
  xs: "0.5rem", // 2
  sm: "0.75rem", // 3
  md: "1rem", // 4
  lg: "1.5rem", // 6
  xl: "2rem", // 8
  "2xl": "3rem", // 12
  "3xl": "4rem", // 16
};
```

## Component Usage

### Basic Components

#### Button

```typescript
import { Button } from "~/components/ui/button";

export function ButtonExample() {
  return (
    <div className="flex gap-2">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}
```

#### Card

```typescript
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

export function CardExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content</p>
      </CardContent>
    </Card>
  );
}
```

#### Form

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

const formSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

export function FormExample() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

### Layout Components

#### Container

```typescript
import { cn } from "~/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("container mx-auto px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
```

#### Grid System

```typescript
export function GridExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>Content 1</Card>
      <Card>Content 2</Card>
      <Card>Content 3</Card>
    </div>
  );
}
```

### Data Display Components

#### Table

```typescript
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

const posts = [
  { id: 1, title: "Post 1", author: "John Doe", date: "2024-01-01" },
  { id: 2, title: "Post 2", author: "Jane Smith", date: "2024-01-02" },
];

export function TableExample() {
  return (
    <Table>
      <TableCaption>Recent posts</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.title}</TableCell>
            <TableCell>{post.author}</TableCell>
            <TableCell>{post.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

## Theme System

### Theme Provider Setup

The theme provider is configured in the root layout:

```typescript
// app/layout.tsx
import { ThemeProvider } from "~/components/ui/theme-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Theme Toggle Component

```typescript
"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";

export function ThemeModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### Custom Theme Colors

Create custom color variants:

```css
/* globals.css */
:root {
  --chart-1: 12 76% 61%;
  --chart-2: 173 58% 39%;
  --chart-3: 197 37% 24%;
  --chart-4: 43 74% 66%;
  --chart-5: 27 87% 67%;
}
```

```typescript
// Extend the theme
const customColors = {
  chart: {
    1: "hsl(var(--chart-1))",
    2: "hsl(var(--chart-2))",
    3: "hsl(var(--chart-3))",
    4: "hsl(var(--chart-4))",
    5: "hsl(var(--chart-5))",
  },
};
```

## Responsive Design

### Breakpoint System

Tailwind's default breakpoints:

```typescript
const breakpoints = {
  sm: "640px", // Small devices
  md: "768px", // Medium devices
  lg: "1024px", // Large devices
  xl: "1280px", // Extra large devices
  "2xl": "1536px", // 2X large devices
};
```

### Responsive Patterns

```typescript
export function ResponsiveExample() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3-4 columns */}
      <Card className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl lg:text-2xl">Responsive Title</h3>
        <p className="text-sm sm:text-base">Responsive content</p>
      </Card>
    </div>
  );
}
```

### Mobile-First Approach

```typescript
export function MobileFirstComponent() {
  return (
    <div className="
      flex flex-col          // Mobile: stack vertically
      sm:flex-row           // Small screens: horizontal
      gap-4                 // All screens: gap
      p-4 sm:p-6 lg:p-8    // Responsive padding
    ">
      <div className="
        w-full sm:w-1/2     // Mobile: full width, SM+: half width
        order-2 sm:order-1  // Mobile: second, SM+: first
      ">
        Content 1
      </div>
      <div className="
        w-full sm:w-1/2
        order-1 sm:order-2
      ">
        Content 2
      </div>
    </div>
  );
}
```

## Animation & Transitions

### Built-in Animations

```typescript
export function AnimationExample() {
  return (
    <div className="
      transform transition-all duration-300 ease-in-out
      hover:scale-105 hover:shadow-lg
      focus:ring-2 focus:ring-blue-500
    ">
      <Button className="
        transition-colors duration-200
        hover:bg-blue-600
        active:scale-95
      ">
        Animated Button
      </Button>
    </div>
  );
}
```

### Custom Animations

Add to `tailwind.config.ts`:

```typescript
module.exports = {
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "bounce-slow": "bounce 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
    },
  },
};
```

## Accessibility

### Focus Management

```typescript
export function AccessibleComponent() {
  return (
    <Button className="
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
      focus:ring-offset-2
      focus-visible:ring-2
    ">
      Accessible Button
    </Button>
  );
}
```

### Screen Reader Support

```typescript
export function ScreenReaderExample() {
  return (
    <div>
      <h2 className="sr-only">Section Title for Screen Readers</h2>
      <Button aria-label="Close dialog">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Button>
    </div>
  );
}
```

### Semantic HTML

```typescript
export function SemanticExample() {
  return (
    <article className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold">Article Title</h1>
        <time dateTime="2024-01-01" className="text-muted-foreground">
          January 1, 2024
        </time>
      </header>
      <main>
        <p>Article content...</p>
      </main>
      <footer>
        <nav aria-label="Article navigation">
          <Button variant="outline">Previous</Button>
          <Button variant="outline">Next</Button>
        </nav>
      </footer>
    </article>
  );
}
```

## Custom Component Patterns

### Compound Components

```typescript
interface CardContextType {
  id: string;
}

const CardContext = React.createContext<CardContextType | null>(null);

export function CardRoot({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <CardContext.Provider value={{ id }}>
      <Card>{children}</Card>
    </CardContext.Provider>
  );
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  const context = React.useContext(CardContext);
  return (
    <CardHeader>
      <h2 id={context?.id}>{children}</h2>
    </CardHeader>
  );
}

// Usage
<CardRoot id="article-1">
  <CardTitle>Article Title</CardTitle>
  <CardContent>Content...</CardContent>
</CardRoot>
```

### Polymorphic Components

```typescript
type AsChildProps<T> = T & {
  asChild?: boolean;
};

function createPolymorphicComponent<T extends React.ElementType>(
  defaultElement: T,
) {
  return React.forwardRef<
    React.ElementRef<T>,
    AsChildProps<React.ComponentPropsWithoutRef<T>>
  >(({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot : defaultElement;
    return <Component ref={ref} {...props} />;
  });
}

const PolymorphicButton = createPolymorphicComponent("button");

// Usage
<PolymorphicButton>Regular Button</PolymorphicButton>
<PolymorphicButton asChild>
  <Link href="/somewhere">Link Button</Link>
</PolymorphicButton>
```

## Performance Optimization

### Bundle Size Optimization

```typescript
// Tree-shakeable imports
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

// Avoid default imports for large libraries
import { format } from "date-fns/format";
import { subDays } from "date-fns/subDays";
```

### CSS Optimization

```css
/* Use CSS custom properties for theming */
.button {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

/* Avoid complex selectors */
.card-header {
  /* Good */
}
.card .header .title {
  /* Avoid */
}
```

### Component Lazy Loading

```typescript
import { lazy, Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";

const LazyChart = lazy(() => import("~/components/ui/chart"));

export function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <LazyChart />
      </Suspense>
    </div>
  );
}
```

## Best Practices

### Component Organization

```
src/_components/
├── ui/              # shadcn/ui components
├── layout/          # Layout components (Navbar, Footer)
├── features/        # Feature-specific components
│   ├── auth/
│   ├── posts/
│   └── dashboard/
└── common/          # Shared components
    ├── LoadingSpinner.tsx
    ├── ErrorBoundary.tsx
    └── SEO.tsx
```

### Naming Conventions

```typescript
// Component names: PascalCase
export function UserProfileCard() {}

// Props interfaces: ComponentNameProps
interface UserProfileCardProps {
  user: User;
  onEdit?: () => void;
}

// Variants: camelCase
const variants = {
  primary: "...",
  secondary: "...",
};
```

### State Management

```typescript
// Local component state
const [isOpen, setIsOpen] = useState(false);

// Form state with React Hook Form
const form = useForm<FormData>({
  resolver: zodResolver(schema),
});

// Server state with tRPC
const { data: posts } = api.post.getAll.useQuery();

// Global client state (when needed)
const useGlobalStore = create((set) => ({
  theme: "light",
  setTheme: (theme: string) => set({ theme }),
}));
```

### Error Handling

```typescript
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="text-center p-8">
      <h2 className="text-lg font-semibold text-destructive">Something went wrong</h2>
      <p className="text-muted-foreground mt-2">{error.message}</p>
      <Button onClick={resetErrorBoundary} className="mt-4">
        Try again
      </Button>
    </div>
  );
}

export function ComponentWithErrorBoundary() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <RiskyComponent />
    </ErrorBoundary>
  );
}
```

## Testing UI Components

### Component Testing

```typescript
import { render, screen } from "@testing-library/react";
import { Button } from "~/components/ui/button";

describe("Button", () => {
  it("renders with correct text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("applies variant classes correctly", () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-destructive");
  });
});
```

### Visual Testing

```typescript
// Storybook stories for visual testing
export default {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
};

export const Default = {
  args: {
    children: "Button",
  },
};

export const AllVariants = () => (
  <div className="flex gap-2">
    <Button variant="default">Default</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="destructive">Destructive</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="link">Link</Button>
  </div>
);
```

## Customization Guide

### Adding New Components

1. **Create the component file**:

   ```bash
   # Add to shadcn/ui
   npx shadcn-ui@latest add [component-name]

   # Or create custom component
   touch src/_components/ui/my-component.tsx
   ```

2. **Follow the pattern**:

   ```typescript
   import { cn } from "~/lib/utils";

   interface MyComponentProps {
     children: React.ReactNode;
     className?: string;
   }

   export function MyComponent({ children, className }: MyComponentProps) {
     return (
       <div className={cn("base-styles", className)}>
         {children}
       </div>
     );
   }
   ```

3. **Add to index file**:
   ```typescript
   // src/_components/ui/index.ts
   export { MyComponent } from "./my-component";
   ```

### Extending Existing Components

```typescript
import { Button, type ButtonProps } from "~/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
}

export function LoadingButton({ loading, children, ...props }: LoadingButtonProps) {
  return (
    <Button disabled={loading} {...props}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}
```

### Custom Themes

```typescript
// Create custom theme configuration
const customTheme = {
  colors: {
    primary: {
      50: "#eff6ff",
      500: "#3b82f6",
      900: "#1e3a8a",
    },
  },
  spacing: {
    "18": "4.5rem",
    "88": "22rem",
  },
};

// Extend Tailwind config
module.exports = {
  theme: {
    extend: customTheme,
  },
};
```
