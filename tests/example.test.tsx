// Example test file - you can remove this once you have real tests
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";

// Example component for testing structure
function ExampleComponent() {
  return <div>Hello, World!</div>;
}

describe("Example Test", () => {
  it("should render example component", () => {
    render(<ExampleComponent />);
    expect(screen.getByText("Hello, World!")).toBeInTheDocument();
  });
});
