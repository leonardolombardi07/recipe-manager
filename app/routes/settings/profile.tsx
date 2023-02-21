import { Form, Button, Segment } from "semantic-ui-react";

export default function SettingsProfileRoute() {
  return (
    <Segment basic style={{ padding: 0 }}>
      <p>
        This information will appear on your public profile and can be seen by
        other members.
      </p>

      <Form>
        <Form.Input required label={"Username"} />

        <Form.TextArea
          label="Bio"
          placeholder="Tell us about you in 160 characters or less"
          maxLength={160}
        />

        <Form.Input
          label="Location"
          placeholder={"Tell us where you're located"}
        />

        <Button type="submit" primary>
          Save changes
        </Button>
      </Form>
    </Segment>
  );
}
