import { Link, useLocation } from "@remix-run/react";
import React from "react";
import {
  Image,
  Card,
  Rating,
  Modal,
  Header,
  Icon,
  Button,
} from "semantic-ui-react";
import type { Recipe } from "types";
import SavableRecipeCard from "./SavableRecipeCard";

export interface RecipeCardProps extends Recipe {
  children?: React.ReactNode;
}

export default function RecipeCard({ children, ...recipe }: RecipeCardProps) {
  const { pathname } = useLocation();
  return (
    <Card as={Link} to={`${pathname}/${recipe.id}`} centered>
      <Image src={recipe.image.url} wrapped ui={false} />
      <Card.Content>
        <Card.Header>{recipe.title}</Card.Header>
        <Card.Meta
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <span>By {recipe.author?.id}</span>
        </Card.Meta>
      </Card.Content>

      <Card.Content extra>
        <RatingWithAlertModal rating={recipe.rating?.average} />
        <span>{recipe.rating?.count} ratings</span>
      </Card.Content>

      {children}
    </Card>
  );
}

function RatingWithAlertModal({ rating }: { rating: number | undefined }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div onClick={(e) => e.preventDefault()}>
      <Modal
        closeIcon
        onClose={() => setOpen(false)}
        open={open}
        size="small"
        closeOnDimmerClick
        closeOnEscape
        trigger={
          <Rating
            icon="star"
            rating={rating}
            maxRating={5}
            onRate={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
          />
        }
      >
        <Header icon>
          <Icon name="warning sign" color="red" />
          Not yet implemented
        </Header>
        <Modal.Content>
          <p style={{ fontSize: 16 }}>
            You can't rate recipes yet. Wait a bit, please.
          </p>

          <div>
            <span style={{ fontSize: 16, marginRight: 30 }}>
              <b>SORRY</b> about that 🤓
            </span>
            <Rating
              icon="star"
              rating={1}
              maxRating={5}
              disabled
              size="large"
            />
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button
            onClick={(e) => {
              setOpen(false);
            }}
            size="large"
          >
            OK
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}

RecipeCard.Savable = SavableRecipeCard;
