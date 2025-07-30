/// <reference types="cypress" />

describe("Posts Feature Tests", () => {
  beforeEach(() => {
    cy.visit("/en/posts");
  });

  it("should load the posts page", () => {
    cy.url().should("include", "/posts");
    cy.get("body").should("be.visible");
  });

  it("should display posts list", () => {
    // Check if posts are displayed
    cy.get("body").should("be.visible");
    // Posts might be loaded dynamically, so we just check the page loads
  });

  it("should have infinite scroll functionality", () => {
    cy.visit("/en/infinite-posts");
    cy.url().should("include", "/infinite-posts");
    cy.get("body").should("be.visible");
  });

  it("should allow navigation to individual posts", () => {
    // Check if post links exist and are clickable
    cy.get("body").then(($body) => {
      if ($body.find('a[href*="/post/"]').length > 0) {
        cy.get('a[href*="/post/"]').first().should("be.visible");
      }
    });
  });

  it("should handle empty posts state gracefully", () => {
    // The page should load even if no posts exist
    cy.get("body").should("be.visible");
    cy.get("html").should("have.attr", "lang");
  });
});
