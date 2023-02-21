import { useNavigate } from "@remix-run/react";
import {
  Segment,
  Grid,
  Header,
  Divider,
  Icon,
  Button,
  Image,
  Rating,
} from "semantic-ui-react";
import type { Recipe } from "types";

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

export default function RecipeRoute() {
  const navigate = useNavigate();

  return (
    <Segment>
      <Header style={{ marginBottom: -8 }}>
        <Button
          icon
          onClick={() => navigate(-1)}
          style={{ backgroundColor: "transparent" }}
        >
          <Icon name="arrow left" />
        </Button>
      </Header>
      <Divider horizontal>{"-"}</Divider>

      <Grid columns={2} centered style={{ marginBottom: 20 }}>
        <Grid.Column width={4}>
          <div>
            <Image src={FAKE_RECIPE.image.url} style={{ maxHeight: 500 }} />
          </div>
        </Grid.Column>

        <Grid.Column width={7}>
          <Header as="h1">
            {FAKE_RECIPE.title}
            <Header.Subheader>
              By {FAKE_RECIPE.author.name}
              <span> | </span>
              <Rating
                icon="star"
                rating={FAKE_RECIPE.rating.average}
                maxRating={5}
                disabled
              />
              <span>{FAKE_RECIPE.rating.count} ratings</span>
            </Header.Subheader>
          </Header>

          <p>{FAKE_RECIPE.description}</p>
        </Grid.Column>
      </Grid>

      <Grid as={Segment} style={{ marginTop: 30 }} padded>
        <Grid.Column width={8}>
          <Ingredients ingredients={FAKE_RECIPE.ingredients} />
        </Grid.Column>

        <Grid.Column width={8}>
          <Method methods={FAKE_RECIPE.methods} />
        </Grid.Column>
      </Grid>
    </Segment>
  );
}

function Ingredients({ ingredients }: { ingredients: string[] }) {
  return (
    <Segment>
      <Header as={"h2"}>Ingredients</Header>
      {ingredients.map((i) => {
        return (
          <div key={i}>
            <p>{i}</p>
            <Divider />
          </div>
        );
      })}
    </Segment>
  );
}

function Method({ methods }: { methods: string[] }) {
  return (
    <Segment>
      <Header as={"h2"}>Method</Header>
      {methods.map((step, index) => {
        return (
          <div key={step} style={{ marginBottom: 40 }}>
            <p>
              <b>Step {index + 1}</b>
            </p>

            <p>{step}</p>
          </div>
        );
      })}
    </Segment>
  );
}
