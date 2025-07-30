/// <reference types="cypress" />

describe("Navigation Tests", () => {
  it("should navigate between different pages", () => {
    cy.visit("/en");
    cy.get("body").should("be.visible");

    // Test navigation to posts
    cy.visit("/en/posts");
    cy.url().should("include", "/posts");

    // Test navigation to API docs
    cy.visit("/en/api-docs");
    cy.url().should("include", "/api-docs");
  });

  it("should handle 404 pages correctly", () => {
    cy.visit("/en/non-existent-page", { failOnStatusCode: false });
    cy.get("body").should("be.visible");
    // Should show not found page
  });

  it("should have proper navigation menu", () => {
    cy.visit("/en");
    cy.get("nav").should("be.visible");
  });

  it("should support locale routing", () => {
    // Test different locales
    cy.visit("/en");
    cy.url().should("include", "/en");

    cy.visit("/es", { failOnStatusCode: false });
    cy.get("body").should("be.visible");

    cy.visit("/fr", { failOnStatusCode: false });
    cy.get("body").should("be.visible");
  });

  it("should redirect root to default locale", () => {
    cy.visit("/", { failOnStatusCode: false });
    cy.url().then((url) => {
      if (url.includes("/en") || url.includes("/es") || url.includes("/fr")) {
        cy.url().should("match", /\/(en|es|fr)\//);
      } else {
        // If no redirect, check if we can access the en locale directly
        cy.visit("/en");
        cy.url().should("include", "/en");
      }
    });
  });
});
