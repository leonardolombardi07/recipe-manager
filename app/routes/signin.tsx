import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { Header, Segment } from "semantic-ui-react";
import GoogleButton from "~/components/elements/Button/GoogleButton";
import * as Cookies from "~/services/cookies";
import * as Firebase from "~/services/firebase";
import { badRequest } from "~/utils/action";

export const meta: MetaFunction = () => ({
  title: "Recipe Manager | Sign In",
  description: "Sign in to manage your recipes!",
});

export async function loader({ request }: LoaderArgs) {
  return await Cookies.redirectIfAuthorized(request);
}

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const idToken = form.get("idToken")?.toString();
  if (!idToken) {
    throw badRequest(`We couldn't get your credentials`);
  }

  const jwt = await Firebase.Server.signIn(idToken, Cookies.EXPIRES_IN);
  return Cookies.signIn(jwt);
};

export default function SignInRoute() {
  const fetcher = useFetcher();

  async function onGoogleSignIn() {
    const { user } = await Firebase.signInWithGoogle();
    const idToken = await user.getIdToken();
    fetcher.submit({ idToken }, { method: "post", action: "/signin" });
  }

  return (
    <Segment style={{ height: "100vh" }}>
      <fetcher.Form method="post">
        <Segment>
          <Header as="h1">Sign in</Header>
          <GoogleButton onClick={onGoogleSignIn} />
        </Segment>
      </fetcher.Form>
    </Segment>
  );
}
