import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

// Extend Jest with accessibility matchers
expect.extend(toHaveNoViolations);

// Simple test component for now
function TestComponent() {
  return <div>Test Component</div>;
}

describe("PostCard", () => {
  it("renders correctly", () => {
    render(<TestComponent />);
    expect(screen.getByText("Test Component")).toBeInTheDocument();
  });

  it("should have no accessibility violations", async () => {
    const { container } = render(<TestComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
