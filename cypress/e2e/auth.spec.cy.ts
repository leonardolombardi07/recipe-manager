describe("auth spec", () => {
  it("should be able to programatically login with stored cookies", () => {
    cy.signIn({ email: "leo@email.com", password: "pass123456" });
    cy.visit("/home");

    // Visiting home without being redirected means the cookies were stored
    cy.location("pathname").should("contain", "home");
  });
});
