import React from "react";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

// Extend Jest matchers for accessibility testing
expect.extend(toHaveNoViolations);

// Example component for testing structure
function ExampleComponent() {
  return <div data-testid="hello">Hello, World!</div>;
}

describe("Example Test", () => {
  it("should render example component", () => {
    const { getByTestId } = render(<ExampleComponent />);
    const element = getByTestId("hello");
    expect(element.textContent).toBe("Hello, World!");
  });

  it("should have no accessibility violations", async () => {
    const { container } = render(<ExampleComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
