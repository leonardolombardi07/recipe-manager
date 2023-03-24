declare namespace Cypress {
  interface Chainable {
    task(
      event: "signIn",
      arg: string,
      options?: Partial<Loggable & Timeoutable>
    ): Chainable<string>;

    task(
      event: "populateDb",
      arg: any,
      options?: Partial<Loggable & Timeoutable>
    ): Chainable;

    signIn(uid: string): Chainable;
  }
}
