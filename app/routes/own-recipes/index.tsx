import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import {
  Segment,
  Header,
  Grid,
  Card,
  Button,
  Icon,
  Message,
} from "semantic-ui-react";
import RecipeCard from "~/components/views/RecipeCard";
import * as Cookies from "~/services/cookies";
import * as Firebase from "~/services/firebase";

export async function loader({ request }: LoaderArgs) {
  const { uid } = await Cookies.getAuthenticatedUser(request);
  const recipes = await Firebase.getOwnRecipes(uid);
  return json({ recipes });
}

export default function OwnIndexRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <Segment padded style={{ minHeight: "100vh" }}>
      <Header as="h1">Own Recipes</Header>

      <Segment>
        <Grid stackable>
          <Grid.Column widescreen={3} tablet={5}>
            <CreateRecipeCardButton />
          </Grid.Column>

          {data.recipes.length === 0 && (
            <Grid.Column widescreen={13}>
              <Message icon info size="big">
                <Icon name={"food"} />
                <Message.Content>
                  <Message.Header>You don't have any recipe!</Message.Header>
                  Click on <b>"Add a new recipe"</b> to start.
                </Message.Content>
              </Message>
            </Grid.Column>
          )}

          {data.recipes.map((r) => (
            <Grid.Column widescreen={3} tablet={5} key={r.id}>
              <RecipeCard {...r} />
            </Grid.Column>
          ))}
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
          width: "100%",
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
