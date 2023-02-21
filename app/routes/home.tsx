import { Segment, Header, Grid } from "semantic-ui-react";
import RecipeCard from "~/components/views/RecipeCard";

export default function HomeRoute() {
  return (
    <Segment padded>
      <Header as="h1">Home</Header>

      <Segment>
        <Header as="h2">Own Recipes</Header>

        <Grid>
          <Grid.Column width={3}>
            <RecipeCard />
          </Grid.Column>

          <Grid.Column width={3}>
            <RecipeCard />
          </Grid.Column>

          <Grid.Column width={3}>
            <RecipeCard />
          </Grid.Column>

          <Grid.Column width={3}>
            <RecipeCard />
          </Grid.Column>
        </Grid>
      </Segment>

      <Segment>
        <Header as="h2">Saved Recipes</Header>
        <Grid>
          <Grid.Column width={3}>
            <RecipeCard />
          </Grid.Column>

          <Grid.Column width={3}>
            <RecipeCard />
          </Grid.Column>

          <Grid.Column width={3}>
            <RecipeCard />
          </Grid.Column>

          <Grid.Column width={3}>
            <RecipeCard />
          </Grid.Column>
        </Grid>
      </Segment>
    </Segment>
  );
}
