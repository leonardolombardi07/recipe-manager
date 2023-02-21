import { Form } from "@remix-run/react";
import { Segment, Form as SUIForm, Button } from "semantic-ui-react";

export default function SettingsPersonalDetailsRoute() {
  return (
    <Segment basic style={{ padding: 0 }}>
      <p>
        These details will not appear on your public profile and you can update
        them at any time.
      </p>

      <SUIForm as={Form}>
        <SUIForm.Group widths="equal">
          <SUIForm.Input label="First name" placeholder="First name" />
          <SUIForm.Input label="Last name" placeholder="Last name" />
        </SUIForm.Group>

        <SUIForm.Group widths="equal">
          <SUIForm.Input required label="Email address" />
          <SUIForm.Input label="Phone number" />
        </SUIForm.Group>

        <Button type="submit" primary>
          Save changes
        </Button>
      </SUIForm>
    </Segment>
  );
}
