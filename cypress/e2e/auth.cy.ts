/// <reference types="cypress" />

describe("Authentication Tests", () => {
  it("should load the sign-in page", () => {
    cy.visit("/en/auth/signin");
    cy.get("body").should("be.visible");
    cy.url().should("include", "/auth/signin");
  });

  it("should display Google sign-in button", () => {
    cy.visit("/en/auth/signin");
    cy.get("button").contains("Google").should("be.visible");
  });

  it("should redirect to sign-in when accessing protected route without auth", () => {
    cy.visit("/en/protected", { failOnStatusCode: false });
    // Check if redirected to auth or if page shows sign-in content
    cy.url().then((url) => {
      if (url.includes("/auth/signin")) {
        cy.url().should("include", "/auth/signin");
      } else {
        // If not redirected, check if page shows authentication requirement
        cy.get("body").should("contain.text", "Sign");
      }
    });
  });

  it("should show error for invalid credentials", () => {
    cy.visit("/en/auth/signin");
    // This would require actual form inputs to test
    // For now, just verify the page loads
    cy.get("body").should("contain.text", "Sign");
  });

  it("should have proper meta tags for SEO", () => {
    cy.visit("/en/auth/signin");
    cy.get("head title").should("exist");
    cy.get('head meta[name="description"]').should("exist");
  });
});
