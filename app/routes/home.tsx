import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import { Segment, Header, Button } from "semantic-ui-react";
import RecipeCard from "~/components/views/RecipeCard";
import { Firebase } from "~/services/firebase";

export async function loader(args: LoaderArgs) {
  const [ownRecipes, savedRecipes] = await Promise.all([
    Firebase.getOwnRecipes(),
    Firebase.getSavedRecipes(),
  ]);
  return json({ ownRecipes, savedRecipes });
}

export default function HomeRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <Segment padded>
      <Header as="h1">Home</Header>
      <ScrollableRecipeList header="Own Recipes" data={data.ownRecipes} />
      <ScrollableRecipeList header="Saved Recipes" data={data.savedRecipes} />
    </Segment>
  );
}

interface ScrollableRecipeListProps {
  data: any[];
  header: string;
}

function ScrollableRecipeList({ data, header }: ScrollableRecipeListProps) {
  const listRef = React.useRef<HTMLDivElement>(null);

  const [renderLeftArrowButton, setRenderLeftArrowButton] =
    React.useState(false);
  const [renderRightArrowButton, setRenderRightArrowButton] =
    React.useState(true);

  React.useEffect(() => {
    const currentRef = listRef.current;

    function renderButtons() {
      if (!listRef.current) return;

      const { current: list } = listRef;

      setRenderLeftArrowButton(list.scrollLeft > 0);

      // See:
      // https://stackoverflow.com/questions/21064101/understanding-offsetwidth-clientwidth-scrollwidth-and-height-respectively
      const reachedEnd =
        list.scrollLeft + list.offsetWidth >= 0.95 * list.scrollWidth; // We use 0.95 as an heuristic
      setRenderRightArrowButton(reachedEnd ? false : true);
    }

    currentRef?.addEventListener("scroll", renderButtons);
    return () => {
      currentRef?.removeEventListener("scroll", renderButtons);
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
    <Segment>
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
        {data.map((or) => (
          <div key={or} style={{ marginRight: 50 }}>
            <RecipeCard />
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
