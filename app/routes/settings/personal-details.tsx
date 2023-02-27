import { Form } from "@remix-run/react";
import { Segment, Form as SUIForm, Button } from "semantic-ui-react";
import { useUser } from "~/context/user";

export default function SettingsPersonalDetailsRoute() {
  const {
    state: { user },
  } = useUser();

  return (
    <Segment basic style={{ padding: 0 }}>
      <p>
        These details will not appear on your public profile and you can update
        them at any time.
      </p>

      <SUIForm as={Form}>
        <SUIForm.Group widths="equal">
          <SUIForm.Input
            value={user?.email}
            label="Email address"
            readonly={true}
          />

          <SUIForm.Input
            label="Phone number"
            defaultValue={user?.phoneNumber}
          />
        </SUIForm.Group>

        <Button type="submit" primary>
          Save changes
        </Button>
      </SUIForm>
    </Segment>
  );
}
