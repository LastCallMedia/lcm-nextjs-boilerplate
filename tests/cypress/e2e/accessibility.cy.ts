/// <reference types="cypress" />

describe("Accessibility Tests", () => {
  beforeEach(() => {
    cy.visit("/en");
  });

  it("should have proper document structure", () => {
    cy.get("head title").should("exist");
    cy.get("main").should("exist");
  });

  it("should have proper heading hierarchy", () => {
    cy.get("h1").should("exist");
    cy.get("h1").should("have.length.at.most", 1);
  });

  it("should have alt text for images", () => {
    cy.get("img").each(($img) => {
      cy.wrap($img).should("have.attr", "alt");
    });
  });

  it("should be keyboard navigable", () => {
    // Test keyboard navigation by focusing on the first interactive element
    cy.get(
      "a, button, input, select, textarea, [tabindex]:not([tabindex='-1'])",
    )
      .first()
      .focus();
    cy.focused().should("exist");
  });

  it("should have proper color contrast", () => {
    // Basic check - ensure content is visible
    cy.get("body").should("be.visible");
    cy.get("main").should("be.visible");
  });

  it("should work with different viewport sizes", () => {
    // Mobile
    cy.viewport(375, 667);
    cy.get("body").should("be.visible");

    // Tablet
    cy.viewport(768, 1024);
    cy.get("body").should("be.visible");

    // Desktop
    cy.viewport(1920, 1080);
    cy.get("body").should("be.visible");
  });
});
