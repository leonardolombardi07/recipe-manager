import { Link } from "@remix-run/react";
import { Segment, Header, Grid, Card, Button, Icon } from "semantic-ui-react";
import RecipeCard from "~/components/views/RecipeCard";

export default function OwnIndexRoute() {
  return (
    <Segment padded>
      <Header as="h1">Own Recipes</Header>

      <Segment>
        <Grid stackable>
          <Grid.Column widescreen={3} tablet={5}>
            <CreateRecipeCardButton />
          </Grid.Column>

          <Grid.Column widescreen={3} tablet={5}>
            <RecipeCard />
          </Grid.Column>

          <Grid.Column widescreen={3} tablet={5}>
            <RecipeCard />
          </Grid.Column>

          <Grid.Column widescreen={3} tablet={5}>
            <RecipeCard />
          </Grid.Column>

          <Grid.Column widescreen={3} tablet={5}>
            <RecipeCard />
          </Grid.Column>

          <Grid.Column widescreen={3} tablet={5}>
            <RecipeCard />
          </Grid.Column>
        </Grid>
      </Segment>
    </Segment>
  );
}

export function CreateRecipeCardButton() {
  return (
    <Card
      as={Button}
      style={{ height: 380, placeItems: "center" }}
      centered
      color="grey"
    >
      <Card.Content
        as={Link}
        to="/own-recipes/create"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name="plus circle" size="huge" style={{ color: "white" }} />
        <Header style={{ color: "white", marginTop: 10 }}>
          Add a new recipe
        </Header>
      </Card.Content>
    </Card>
  );
}
