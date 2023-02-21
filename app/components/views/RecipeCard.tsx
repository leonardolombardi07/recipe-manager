import { Link } from "@remix-run/react";
import { Image, Card, Rating } from "semantic-ui-react";
import type { Recipe } from "~/types";

const FAKE_RECIPE: Recipe = {
  title: "Creamy courgette lasagne",
  description:
    "Serve this quick, creamy courgette & ricotta lasagne for a last-minute dinner party to impress vegetarian friends. It's a great way to use courgettes when they're in season",
  rating: {
    count: 417,
    average: 4.3,
  },
  image: {
    url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80",
  },
  author: {
    name: "Leonardo",
  },
  ingredients: [
    "9 dried lasagne sheets",
    "1 tbsp sunflower oil",
    "1 onion, finely chopped",
  ],
  methods: [
    "Heat oven to 220C/fan 200C/gas 7. Put a pan of water on to boil, then cook the lasagne sheets for about 5 mins until softened, but not cooked through. Rinse in cold water, then drizzle with a little oil to stop them sticking togethe",
    "Meanwhile, heat the oil in a large frying pan, then fry the onion. After 3 mins, add the courgettes and garlic and continue to fry until the courgette has softened and turned bright green. Stir in 2/3 of both the ricotta and the cheddar, then season to taste. Heat the tomato sauce in the microwave for 2 mins on High until hot.",
    "In a large baking dish, layer up the lasagne, starting with half the courgette mix, then pasta, then tomato sauce. Repeat, top with blobs of the remaining ricotta, then scatter with the rest of the cheddar. Bake on the top shelf for about 10 mins until the pasta is tender and the cheese is golden.",
  ],
};

export default function RecipeCard() {
  return (
    <Card as={Link} to="/recipe/233">
      <Image src={FAKE_RECIPE.image.url} wrapped ui={false} />
      <Card.Content>
        <Card.Header>{FAKE_RECIPE.title}</Card.Header>
        <Card.Meta>
          <span className="date">By {FAKE_RECIPE.author.name}</span>
        </Card.Meta>
      </Card.Content>
      <Card.Content extra>
        <Rating icon="star" rating={FAKE_RECIPE.rating.average} maxRating={5} />
        <span>{FAKE_RECIPE.rating.count} ratings</span>
      </Card.Content>
    </Card>
  );
}
