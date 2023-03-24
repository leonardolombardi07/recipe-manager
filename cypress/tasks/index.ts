import { signIn } from "~/utils/auth.server";
import * as FirebaseTestUtils from "~/services/firebase/testUtils";

function authTasks(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): void {
  on("task", {
    // async populateDb() {
    //   await Firebase.Server.createUser__TEST_ONLY({
    //     email: "leo@email.com",
    //     password: "leo123456",
    //     uid: "uid",
    //   });
    //   return null;
    // },
    async signIn(uid: string) {
      // TODO: be able to customize displayName and e-mail
      const idToken = await FirebaseTestUtils.createIdToken__TEST_ONLY(uid);
      console.log("idToken: ", idToken);
      return signIn(idToken);
    },
  });
}

export { authTasks };
