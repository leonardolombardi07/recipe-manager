import "@testing-library/cypress/add-commands";

import * as CookieUtils from "~/utils/cookies";

/// <reference types="cypress" />
// ***********************************************

Cypress.Commands.add("signIn", (credentials) => {
  cy.task("signIn", credentials).then((setCookieHeader) => {
    // TODO: type this library!
    const parsedCookie = CookieUtils.parse(setCookieHeader, {
      map: false,
    })[0];

    cy.setCookie(parsedCookie.name, parsedCookie.value, {
      ...parsedCookie,
    });
  });
});
