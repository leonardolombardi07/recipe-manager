import React from "react";
import { Rating, Segment } from "semantic-ui-react";

export default function RateRecipe() {
  const [rating, setRating] = React.useState<number | null>(null);
  return (
    <Segment>
      <Rating
        icon="star"
        rating={rating || undefined}
        maxRating={5}
        size="massive"
        onRate={(e, { rating }) => setRating(Number(rating))}
      />
      <input hidden name="rating" value={String(rating)} />
    </Segment>
  );
}
