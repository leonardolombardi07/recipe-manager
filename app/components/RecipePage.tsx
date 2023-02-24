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

export default function RecipePage({ recipe }: { recipe: Recipe }) {
  const navigate = useNavigate();

  return (
    <Segment style={{ minHeight: "100vh" }}>
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
            <Image src={recipe.image.url} style={{ maxHeight: 500 }} />
          </div>
        </Grid.Column>

        <Grid.Column width={7}>
          <Header as="h1">
            {recipe.title}
            <Header.Subheader>
              By {recipe.author?.name}
              <span> | </span>
              <Rating
                icon="star"
                rating={recipe.rating?.average}
                maxRating={5}
                disabled
              />
              <span>{recipe.rating?.count} ratings</span>
            </Header.Subheader>
          </Header>

          <p>{recipe.description}</p>
        </Grid.Column>
      </Grid>

      <Grid as={Segment} style={{ marginTop: 30 }} padded>
        <Grid.Column width={8}>
          <Ingredients ingredients={recipe.ingredients} />
        </Grid.Column>

        <Grid.Column width={8}>
          <Steps steps={recipe.steps} />
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

function Steps({ steps }: { steps: string[] }) {
  return (
    <Segment>
      <Header as={"h2"}>Method</Header>
      {steps.map((step, index) => {
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
