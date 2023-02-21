import React from "react";
import type { CheckboxProps } from "semantic-ui-react";
import {
  Segment,
  Form,
  Checkbox,
  Button,
  Grid,
  Header,
} from "semantic-ui-react";

export default function SettingsEmailsRoute() {
  const [state, setState] = React.useState({
    enableNewsletter: false,
    enableHealth: false,
    enableOffers: false,
  });

  function handleToggle(property: keyof typeof state) {
    setState((s) => ({ ...s, [property]: !s[property] }));
  }

  return (
    <Segment basic style={{ padding: 0, paddingTop: 10 }}>
      <p>
        Here is a list of emails you are subscribed to. We won't send you
        anything that you haven't selected. To make changes simply select yes/no
        and tap save.
      </p>

      <Form>
        <Option
          title="BBC Good Food Newsletter"
          description="Would you like to receive BBC Good Food newsletters, special offers and related promotions?"
          checked={state.enableNewsletter}
          onToggle={() => handleToggle("enableNewsletter")}
        />

        <Option
          title="BBC Good Food Health"
          description="Would you like to receive BBC Good Food’s Health newsletter, with healthy meal plans and our latest healthy recipes and tips?"
          checked={state.enableHealth}
          onToggle={() => handleToggle("enableHealth")}
        />

        <Option
          title="BBC Good Food Offers"
          description="Want to receive the relevant deals and promotions from our carefully selected partners straight to your inbox?"
          checked={state.enableOffers}
          onToggle={() => handleToggle("enableOffers")}
        />

        <Button type="submit" primary>
          Save changes
        </Button>
      </Form>
    </Segment>
  );
}

interface OptionProps {
  title: string;
  description: string;
  checked: boolean;
  onToggle: (
    event: React.FormEvent<HTMLInputElement>,
    data: CheckboxProps
  ) => void;
}

function Option({ title, description, onToggle, checked }: OptionProps) {
  return (
    <Segment>
      <Grid columns={"equal"} verticalAlign={"middle"}>
        <Grid.Column>
          <Header as="h3">
            {title}
            <Header.Subheader>{description}</Header.Subheader>
          </Header>
        </Grid.Column>

        <Grid.Column>
          <Checkbox
            toggle
            label={checked ? "Yes please" : "No thanks"}
            checked={checked}
            onChange={onToggle}
          />
        </Grid.Column>
      </Grid>
    </Segment>
  );
}
