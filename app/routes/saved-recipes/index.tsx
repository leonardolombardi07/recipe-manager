import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Segment, Header, Grid, Message, Icon } from "semantic-ui-react";
import RecipeCard from "~/components/views/RecipeCard";
import * as Cookies from "~/services/cookies";
import * as Firebase from "~/services/firebase";

export async function loader({ request }: LoaderArgs) {
  const { uid } = await Cookies.getAuthenticatedUser(request);
  const recipes = await Firebase.getSavedRecipes(uid);
  return json({ recipes });
}

export default function SavedRecipesIndexRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <Segment padded style={{ minHeight: "100vh" }}>
      <Header as="h1">Saved Recipes</Header>

      <Segment>
        <Grid stackable>
          {data.recipes.length === 0 && (
            <Grid.Column>
              <Message icon info size="big">
                <Icon name={"food"} />
                <Message.Content>
                  <Message.Header>
                    You don't have any saved recipe!
                  </Message.Header>
                  Go{" "}
                  <Link to="/home">
                    <b>Home</b>
                  </Link>
                  , save a recipe and comeback.
                </Message.Content>
              </Message>
            </Grid.Column>
          )}

          {data.recipes.map((recipe) => (
            <Grid.Column widescreen={3} tablet={5} key={recipe.id}>
              <RecipeCard {...recipe} />
            </Grid.Column>
          ))}
        </Grid>
      </Segment>
    </Segment>
  );
}
