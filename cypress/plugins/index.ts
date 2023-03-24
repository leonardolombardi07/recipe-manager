import * as Cookies from "~/services/cookies";
import * as FirebaseTestUtils from "~/services/firebase/server/auth/testUtils.server";
import * as Firebase from "~/services/firebase";
import { signIn, signOut } from "~/utils/auth.server";

const plugins: Cypress.PluginConfig = (on) => {
  on("task", {
    async signIn(uid: string) {
      const idToken = await FirebaseTestUtils.createIdToken(uid);
      await signIn(idToken);
      cy.request();
    },
    async signOut() {
      await signOut({} as any);
    },
  });
};

export default plugins;
