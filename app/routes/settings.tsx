import { Link, Outlet, useLocation } from "@remix-run/react";
import React from "react";
import type { SemanticICONS } from "semantic-ui-react";
import {
  Segment,
  Accordion,
  Icon,
  Header,
  Menu,
  Grid,
} from "semantic-ui-react";

export default function SettingsRoute() {
  return (
    <div>
      <main style={{ minHeight: "100vh" }}>
        <Segment padded>
          <Header as="h1">Settings</Header>

          <Accordion as={Menu} vertical fluid>
            <AccordionItem
              title={<AccordionTitle icon="user" title="Your profile" />}
              to={"/settings/profile"}
            />

            <AccordionItem
              title={
                <AccordionTitle icon="sticky note" title="Personal details" />
              }
              to={"/settings/personal-details"}
            />

            <AccordionItem
              title={<AccordionTitle icon="mail" title="Emails" />}
              to={"/settings/emails"}
            />

            <AccordionItem
              title={<AccordionTitle icon="lock" title="Change password" />}
              to={"/settings/change-password"}
            />
          </Accordion>
        </Segment>
      </main>
    </div>
  );
}

interface AccordionItemProps {
  title: React.ReactNode;
  to: string;
}

function AccordionItem({ title, to }: AccordionItemProps) {
  const { pathname } = useLocation();
  const active = pathname === to;

  function defaultToIndex(path: string) {
    return path === pathname ? "/settings/" : path;
  }

  return (
    <React.Fragment>
      <Menu.Item>
        <Accordion.Title as={Link} to={defaultToIndex(to)} active={active}>
          {title}
        </Accordion.Title>

        <Accordion.Content active={active}>
          <Outlet />
        </Accordion.Content>
      </Menu.Item>
    </React.Fragment>
  );
}

function AccordionTitle({
  icon,
  title,
}: {
  icon: SemanticICONS;
  title: string;
}) {
  return (
    <Grid style={{ padding: 2 }}>
      <Grid.Column floated="left" width={15} verticalAlign="middle">
        <Header as="h3">
          <Icon name={icon} size="huge" />
          <Header.Content>{title}</Header.Content>
        </Header>
      </Grid.Column>

      <Grid.Column
        floated="right"
        textAlign={"right"}
        width={1}
        verticalAlign="middle"
      >
        <Segment.Inline>
          <Icon name="dropdown" />
        </Segment.Inline>
      </Grid.Column>
    </Grid>
  );
}
