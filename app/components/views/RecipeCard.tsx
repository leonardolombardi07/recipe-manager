import { Link } from "@remix-run/react";
import { Image, Card, Rating } from "semantic-ui-react";
import { FAKE_RECIPE } from "~/data";

export default function RecipeCard() {
  return (
    <Card as={Link} to="/recipe/233" centered>
      <Image src={FAKE_RECIPE.image.url} wrapped ui={false} />
      <Card.Content>
        <Card.Header>{FAKE_RECIPE.title}</Card.Header>
        <Card.Meta>
          <span className="date">By {FAKE_RECIPE?.author?.name}</span>
        </Card.Meta>
      </Card.Content>
      <Card.Content extra>
        <Rating
          icon="star"
          rating={FAKE_RECIPE?.rating?.average}
          maxRating={5}
        />
        <span>{FAKE_RECIPE?.rating?.count} ratings</span>
      </Card.Content>
    </Card>
  );
}
