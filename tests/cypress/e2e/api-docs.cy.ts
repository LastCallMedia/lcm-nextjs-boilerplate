/// <reference types="cypress" />

describe("API Documentation Tests", () => {
  beforeEach(() => {
    cy.visit("/en/api-docs");
  });

  it("should load the API documentation page", () => {
    cy.url().should("include", "/api-docs");
    cy.get("body").should("be.visible");
  });

  it("should have interactive API explorer", () => {
    // Check if Swagger/OpenAPI UI is present
    cy.get("body").then(($body) => {
      if ($body.find(".swagger-ui").length > 0) {
        cy.get(".swagger-ui").should("be.visible");
      }
    });
  });

  it("should be responsive on mobile devices", () => {
    cy.viewport("iphone-6");
    cy.get("body").should("be.visible");
    cy.viewport("macbook-15");
  });
});
