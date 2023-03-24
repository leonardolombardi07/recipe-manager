describe("sign in spec", () => {
  beforeEach(() => {
    cy.visit("/signin");
  });

  it("should be able to login", () => {
    cy.get('[data-test="sign-in-submit"]').filter(":visible").click();
    cy.signIn("uidd", { email: "leo", displayName: "lau" });
  });
});
