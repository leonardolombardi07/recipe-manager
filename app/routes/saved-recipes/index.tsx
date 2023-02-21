import { Segment, Header, Grid } from "semantic-ui-react";
import RecipeCard from "~/components/views/RecipeCard";

export default function SavedRecipesIndexRoute() {
  return (
    <Segment padded>
      <Header as="h1">Saved Recipes</Header>

      <Segment>
        <Grid stackable>
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

          <Grid.Column widescreen={3} tablet={5}>
            <RecipeCard />
          </Grid.Column>
        </Grid>
      </Segment>
    </Segment>
  );
}
