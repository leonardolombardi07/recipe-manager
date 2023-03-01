import { Link, useLocation } from "@remix-run/react";
import React from "react";
import { Image, Card, Rating } from "semantic-ui-react";
import type { Recipe } from "types";
import SavableRecipeCard from "./SavableRecipeCard";

export interface RecipeCardProps extends Recipe {
  children?: React.ReactNode;
}

const PLACEHOLDER_RECIPE_IMAGE_URL =
  "https://react.semantic-ui.com/images/wireframe/image.png";

export default function RecipeCard({ children, ...recipe }: RecipeCardProps) {
  const { pathname } = useLocation();
  return (
    <Card as={Link} to={`${pathname}/${recipe.id}`} centered>
      <Image
        src={recipe.image.url || PLACEHOLDER_RECIPE_IMAGE_URL}
        wrapped
        ui={false}
      />
      <Card.Content>
        <Card.Header>{recipe.title}</Card.Header>
        <Card.Meta
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <span>By {recipe.author?.name}</span>
        </Card.Meta>
      </Card.Content>

      <Card.Content extra>
        <Rating
          icon="star"
          rating={recipe.rating?.average || 0}
          maxRating={5}
          disabled
        />
        <span>{recipe.rating?.count} ratings</span>
      </Card.Content>

      {children}
    </Card>
  );
}

RecipeCard.Savable = SavableRecipeCard;
