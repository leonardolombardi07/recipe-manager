import React from "react";
import { Button, Icon } from "semantic-ui-react";
import type { Recipe } from "types";
import RecipeCard from "./RecipeCard";

interface SavableRecipeCardProps extends Recipe {
  onToggleSave: (
    event: React.MouseEvent<HTMLButtonElement>,
    savableRecipeCardProps: SavableRecipeCardProps
  ) => void;
  saved: boolean;
}

export default function SavableRecipeCard(props: SavableRecipeCardProps) {
  const { onToggleSave, ...recipe } = props;
  return (
    <RecipeCard {...recipe}>
      <Button
        size={"large"}
        onClick={(event) => {
          event.preventDefault();
          onToggleSave(event, props);
        }}
        color={recipe.saved ? "teal" : "blue"}
        // style={{ backgroundColor: recipe.saved ? undefined : "lightgrey" }}
      >
        <Icon name={recipe.saved ? "save" : "save outline"} />
        {recipe.saved ? "Saved" : "Save Recipe"}
      </Button>
    </RecipeCard>
  );
}
