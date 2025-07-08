// Jest type declarations
import "@testing-library/jest-dom";
import "jest-axe/extend-expect";

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toBeVisible(): R;
      toHaveClass(className: string): R;
      toHaveNoViolations(): R;
    }
  }
}
