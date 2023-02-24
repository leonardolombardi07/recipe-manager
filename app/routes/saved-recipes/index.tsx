import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Segment, Header, Grid } from "semantic-ui-react";
import RecipeCard from "~/components/views/RecipeCard";
import { Firebase } from "~/services/firebase";

export async function loader(args: LoaderArgs) {
  const recipes = await Firebase.getSavedRecipes();
  return json({ recipes });
}

export default function SavedRecipesIndexRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <Segment padded>
      <Header as="h1">Saved Recipes</Header>

      <Segment>
        <Grid stackable>
          {data.recipes.map((r) => (
            <Grid.Column widescreen={3} tablet={5} key={r}>
              <RecipeCard />
            </Grid.Column>
          ))}
        </Grid>
      </Segment>
    </Segment>
  );
}
