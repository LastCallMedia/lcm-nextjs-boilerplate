/// <reference types="cypress" />

describe("Homepage Tests", () => {
  beforeEach(() => {
    cy.visit("/en");
  });

  it("should load the homepage successfully", () => {
    cy.url().should("include", "/en");
    cy.get("body").should("be.visible");
  });

  it("should display the navigation", () => {
    cy.get("nav").should("be.visible");
  });

  it("should display posts if any exist", () => {
    // Check if posts section exists
    cy.get("body").then(($body) => {
      if ($body.find('[data-testid="posts-section"]').length > 0) {
        cy.get('[data-testid="posts-section"]').should("be.visible");
      }
    });
  });
});
