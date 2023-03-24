// TODO: couldn't import types without breaking global scope

declare namespace Cypress {
  interface Chainable {
    task(
      event: "signIn",
      arg: { email: string; password: string },
      options?: Partial<Loggable & Timeoutable>
    ): Chainable<string>;

    signIn(credentials: { email: string; password: string }): Chainable;
  }
}
