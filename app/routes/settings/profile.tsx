import {
  Form as SUIForm,
  Button,
  Segment,
  Image,
  Header,
} from "semantic-ui-react";
import { useUser } from "~/context/user";

export default function SettingsProfileRoute() {
  const {
    state: { user },
  } = useUser();
  return (
    <Segment basic style={{ padding: 0 }}>
      <p>
        This information will appear on your public profile and can be seen by
        other members.
      </p>

      <SUIForm>
        <div
          style={{
            margin: "2em auto",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Image
            size="small"
            src={
              user?.photoURL ||
              "https://react.semantic-ui.com/images/wireframe/square-image.png"
            }
            avatar
          />
          <Header as="h4" style={{ marginTop: 10 }}>
            Image
          </Header>
        </div>

        <SUIForm.Group widths="equal">
          <SUIForm.Input
            defaultValue={user?.displayName}
            label="Display name"
            placeholder="Display name"
            required
          />
        </SUIForm.Group>

        <Button type="submit" primary>
          Save changes
        </Button>
      </SUIForm>
    </Segment>
  );
}
