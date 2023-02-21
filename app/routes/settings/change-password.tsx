import { Segment, Form, Button } from "semantic-ui-react";

export default function SettingsChangePasswordRoute() {
  return (
    <Segment basic style={{ padding: 0, paddingTop: 10 }}>
      <Form>
        <Form.Input required label="Current password" />
        <Form.Input required label="New password" />

        <Button type="submit" primary>
          Save changes
        </Button>
      </Form>
    </Segment>
  );
}
