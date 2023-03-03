import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import React from "react";
import {
  Segment,
  Header,
  Button,
  Grid,
  Message,
  Icon,
} from "semantic-ui-react";
import RecipeCard from "~/components/views/RecipeCard";
import * as Firebase from "~/services/firebase";
import * as Cookies from "~/services/cookies";
import type { Recipe } from "types";
import { badRequest } from "~/utils/action";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));
  if (!["saveRecipe", "unsaveRecipe"].includes(intent)) {
    throw badRequest(`The intent "${intent}" is not supported`);
  }

  const recipeId = formData.get("recipeId");
  if (!recipeId || typeof recipeId !== "string") {
    throw badRequest(`The recipe id "${recipeId} is not valid"`);
  }

  const { uid } = await Cookies.getAuthenticatedUser(request);

  if (intent === "saveRecipe") await Firebase.saveRecipe(recipeId, uid);
  else if (intent === "unsaveRecipe")
    await Firebase.unsaveRecipe(recipeId, uid);

  return {};
}

export async function loader({ request }: LoaderArgs) {
  const { uid } = await Cookies.getAuthenticatedUser(request);
  return json({
    trending: await Firebase.getTrendingRecipes(uid),
    feed: await Firebase.getFeedRecipes(uid),
  });
}

export default function HomeRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <Segment padded style={{ minHeight: "100vh" }}>
      <Header as="h1">Home</Header>
      <ScrollableRecipeList header="Trending" data={data.trending} />

      <Feed data={data.feed} />
    </Segment>
  );
}

function useToggleSaveRecipe() {
  const fetcher = useFetcher();

  function onToggleRecipeSave(recipe: SavableRecipe) {
    fetcher.submit(
      {
        intent: recipe.saved ? "unsaveRecipe" : "saveRecipe",
        recipeId: recipe.id as string,
      },
      // To understand why we add an "?" on the action:
      // From https://remix.run/docs/en/v1/components/form
      // "If you want to post to an index route use ?index in the action"
      // See also: https://stackoverflow.com/questions/72528682/remix-run-submitting-an-action-and-getting-errro-root-does-not-have-an-act
      { method: "post", action: "/home?index" }
    );
  }

  function markRecipeAsSaved(recipe: SavableRecipe) {
    const formData = fetcher.submission?.formData;
    if (formData && formData.get("recipeId") === recipe.id) {
      switch (formData.get("intent")) {
        case "saveRecipe":
          return true;
        case "unsaveRecipe":
          return false;
      }
    }
    return recipe.saved;
  }

  return { onToggleRecipeSave, markRecipeAsSaved };
}

type SavableRecipe = Recipe & { saved: boolean };

interface ScrollableRecipeListProps {
  data: SavableRecipe[];
  header: string;
}

function ScrollableRecipeList({ data, header }: ScrollableRecipeListProps) {
  const { onToggleRecipeSave, markRecipeAsSaved } = useToggleSaveRecipe();

  const listRef = React.useRef<HTMLDivElement>(null);

  const [renderLeftArrowButton, setRenderLeftArrowButton] =
    React.useState(false);
  const [renderRightArrowButton, setRenderRightArrowButton] =
    React.useState(true);

  React.useEffect(() => {
    if (!listRef.current) return;
    const list = listRef.current;

    function renderButtons() {
      setRenderLeftArrowButton(list.scrollLeft > 0);

      const hasScroll = list.scrollWidth > list.clientWidth;
      const reachedEnd =
        list.scrollLeft + list.offsetWidth >= 0.95 * list.scrollWidth; // We use 0.95 as an heuristic
      setRenderRightArrowButton(hasScroll && !reachedEnd);
    }

    renderButtons();

    list?.addEventListener("scroll", renderButtons);
    window.addEventListener("resize", renderButtons);
    return () => {
      list?.removeEventListener("scroll", renderButtons);
      window.removeEventListener("resize", renderButtons);
    };
  }, []);

  function horizontalScroll(number: number) {
    if (!listRef.current) return;

    listRef.current?.scroll({
      left: listRef.current.scrollLeft + number,
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <Segment style={{ marginTop: "2em" }}>
      <Header as="h2">{header}</Header>
      {renderLeftArrowButton && (
        <Button
          icon="arrow left"
          size="huge"
          circular
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            zIndex: 100,
          }}
          color="teal"
          onClick={() => {
            horizontalScroll(-1000);
            setRenderLeftArrowButton(false);
          }}
        />
      )}

      <div
        style={{
          display: "flex",
          overflow: "hidden",
          width: "auto",
          paddingBottom: 5,
        }}
        ref={listRef}
      >
        {data.map((recipe) => (
          <div key={recipe.id} style={{ marginRight: 30, maxWidth: 200 }}>
            <RecipeCard.Savable
              onToggleSave={() => onToggleRecipeSave(recipe)}
              {...recipe}
              saved={markRecipeAsSaved(recipe)}
            />
          </div>
        ))}
      </div>

      {renderRightArrowButton && (
        <Button
          icon="arrow right"
          size="huge"
          circular
          style={{
            position: "absolute",
            top: "50%",
            right: 0,
            zIndex: 100,
          }}
          color="teal"
          onClick={() => {
            horizontalScroll(1000);
            setRenderRightArrowButton(true);
          }}
        />
      )}
    </Segment>
  );
}

interface FeedProps {
  data: SavableRecipe[];
}

function Feed({ data }: FeedProps) {
  const { onToggleRecipeSave, markRecipeAsSaved } = useToggleSaveRecipe();
  return (
    <Segment style={{ margin: "2em 0" }}>
      <Header as="h1">Feed</Header>
      <Grid stackable relaxed padded>
        {data.length === 0 && <EmptyFeed />}

        {data.map((recipe) => (
          <Grid.Column widescreen={3} tablet={5} key={recipe.id}>
            <RecipeCard.Savable
              onToggleSave={() => onToggleRecipeSave(recipe)}
              {...recipe}
              saved={markRecipeAsSaved(recipe)}
            />
          </Grid.Column>
        ))}
      </Grid>
    </Segment>
  );
}

function EmptyFeed() {
  return (
    <Grid.Column>
      <Message icon info size="huge">
        <Icon name="food" />
        <Message.Content>
          <Message.Header>
            We don't have any recipe to show you yet...
          </Message.Header>
          What a shame!
        </Message.Content>
      </Message>
    </Grid.Column>
  );
}
