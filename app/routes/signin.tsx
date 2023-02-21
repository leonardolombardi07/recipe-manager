import type { ActionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { Header, Segment } from "semantic-ui-react";
import GoogleButton from "~/components/elements/Button/GoogleButton";
import { createUserSession } from "~/services/cookies";
import { Firebase } from "~/services/firebase";

export const action = async ({ request }: ActionArgs) => {
  const user = await Firebase.login();
  if (!user) {
    return { formError: `Username/Password combination is incorrect` };
  }
  return createUserSession(user.id, "/home");
};

export default function SignInRoute() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        padding: 50,
        justifyContent: "center",
      }}
    >
      <Form method="post">
        <Segment style={{ width: 800, height: 150 }}>
          <Header as="h1">Sign in</Header>
          <GoogleButton />
        </Segment>
      </Form>
    </div>
  );
}
