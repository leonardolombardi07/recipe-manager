import * as CookieUtils from "~/utils/cookies";

/// <reference types="cypress" />
// ***********************************************

Cypress.Commands.add("signIn", (uid: string) => {
  cy.task("signIn", uid).then((setCookieHeader) => {
    // TODO: get name from variable here

    // TODO: type this library!
    const parsedCookie = CookieUtils.parse(setCookieHeader, {
      map: false,
    })[0];

    cy.setCookie(parsedCookie.name, parsedCookie.value, {
      ...parsedCookie,
    });
  });

  cy.visit("/home");
});
