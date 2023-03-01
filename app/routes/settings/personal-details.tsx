import { Form } from "@remix-run/react";
import { Segment, Form as SUIForm } from "semantic-ui-react";
import { useRootData } from "~/root";

export default function SettingsPersonalDetailsRoute() {
  const { user } = useRootData();
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
        </SUIForm.Group>
      </SUIForm>
    </Segment>
  );
}
