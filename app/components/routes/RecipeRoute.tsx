import type {
  ActionArgs,
  LoaderArgs,
  MetaFunction,
  TypedResponse,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useLocation, useNavigate, useSubmit } from "@remix-run/react";
import React from "react";
import {
  Segment,
  Grid,
  Header,
  Divider,
  Icon,
  Button,
  Image,
  Rating,
  Menu,
  Message,
  Label,
} from "semantic-ui-react";
import type { Recipe } from "types";
import * as Firebase from "~/services/firebase";
import { badRequest } from "~/utils/action";
import Confirm from "~/components/addons/Confirm";
import { capitalizeFirstLetter } from "~/utils/string";
import { extractNumber } from "~/utils/number";

// TODO: fix type on parameters
export const meta: MetaFunction<typeof loader> = ({ data, params }: any) => {
  if (!data) {
    return { title: "No recipe", description: "No recipe found" };
  }

  return {
    title: `"${data?.recipe?.title}" recipe`,
    description: `Enjoy the "${data?.recipe?.title}" recipe and much more`,
  };
};

export async function loader({ params }: LoaderArgs) {
  if (!params.recipeId) {
    throw badRequest("No recipe id found!");
  }
  const recipe = await Firebase.getRecipe(params.recipeId);
  if (!recipe) {
    throw badRequest(`Recipe for  recipe id "${params.recipeId}" not found`);
  }

  // Fix: something related to
  // https://github.com/remix-run/remix/issues/3931
  // We don't get correct types when importing the loader
  return json({ recipe }) as TypedResponse<{ recipe: Recipe }>;
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));
  if (!["deleteRecipe"].includes(intent)) {
    return badRequest(`The intent "${intent}" is not supported`);
  }

  const recipeId = String(formData.get("recipeId"));
  if (!recipeId) {
    throw badRequest(`The recipe id "${recipeId}" is not valid`);
  }

  switch (intent) {
    case "deleteRecipe": {
      await Firebase.deleteRecipe(recipeId);
      // TODO: we actually want to navigate to the last route
      // But the user can only delete it's own recipes so that's
      // not a big problem now
      return redirect("/own-recipes");
    }
  }
}

interface RecipeProps {
  recipe: Recipe;
}

interface RecipeRouteProps extends RecipeProps {
  canDelete: boolean;
  canEdit: boolean;
  canGoBack: boolean;
}

export default function RecipeRoute(props: RecipeRouteProps) {
  const { recipe } = props;
  return (
    <Segment style={{ padding: 0, minHeight: "100vh" }}>
      <HeaderMenu {...props} />

      <Segment basic>
        <Grid columns={2} style={{ marginBottom: 20 }} stackable centered>
          <Grid.Column width={4}>
            <div>
              <Image src={recipe?.image?.url} style={{ maxHeight: 500 }} />
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

            <Label.Group>
              <TimingsLabel timings={recipe.timings} />
              <DifficultyLabel difficulty={recipe.difficulty} />
              <ServingsLabel servings={recipe.servings} />
            </Label.Group>

            <p>{recipe.description}</p>
          </Grid.Column>
        </Grid>

        <Grid as={Segment} style={{ marginTop: 30 }} padded>
          <Grid.Column width={8}>
            <Ingredients {...props} />
          </Grid.Column>

          <Grid.Column width={8}>
            <Steps {...props} />
          </Grid.Column>
        </Grid>
      </Segment>
    </Segment>
  );
}

function HeaderMenu({
  recipe,
  canDelete,
  canEdit,
  canGoBack,
}: RecipeRouteProps) {
  const navigate = useNavigate();

  return (
    <Menu style={{ marginBottom: 0 }} size="huge">
      {canGoBack && (
        <Menu.Item onClick={() => navigate(-1)}>
          <Button icon style={{ backgroundColor: "transparent" }}>
            <Icon name="arrow left" />
          </Button>
        </Menu.Item>
      )}

      <Menu.Menu position="right">
        {canEdit && (
          <Menu.Item onClick={() => navigate(`/own-recipes/edit/${recipe.id}`)}>
            <Button icon style={{ backgroundColor: "transparent" }}>
              <Icon name="edit" />
            </Button>
          </Menu.Item>
        )}

        {canDelete && <DeleteMenuItem recipe={recipe} />}
      </Menu.Menu>
    </Menu>
  );
}

function TimingsLabel({ timings }: { timings: Recipe["timings"] }) {
  const { prepTime, cookTime, extraTime } = timings;

  function getHumanReadableTime(hours: number, minutes: number) {
    const minutePart = `${minutes}min`;
    if (hours === 0) return minutePart;
    const hourPart = `${hours}h`;
    if (minutes === 0) return hourPart;
    return `${hours}h & ${minutePart}`;
  }

  return (
    <Label.Group>
      <TimingLabel
        name="Prep Time:"
        time={getHumanReadableTime(prepTime.hours, prepTime.minutes)}
      />
      <TimingLabel
        name="Cook Time:"
        time={getHumanReadableTime(cookTime.hours, cookTime.minutes)}
      />
      <TimingLabel name="Extra Time:" time={extraTime} />
    </Label.Group>
  );
}

function TimingLabel({ name, time }: { name: string; time: string }) {
  return (
    <Label size="large">
      <Icon name="clock" />
      {name}
      <Label.Detail>{time}</Label.Detail>
    </Label>
  );
}

function ServingsLabel({ servings }: { servings: Recipe["servings"] }) {
  const { type, value } = servings;
  const possibleNumber = extractNumber(value);
  return (
    <Label
      color={"blue"}
      size={
        typeof possibleNumber !== "number"
          ? "large"
          : possibleNumber > 10
          ? "massive"
          : possibleNumber > 6
          ? "huge"
          : possibleNumber > 4
          ? "large"
          : "medium"
      }
    >
      <Icon name="food" />
      {`${capitalizeFirstLetter(type)} ${value}`}
    </Label>
  );
}

function DifficultyLabel({ difficulty }: { difficulty: Recipe["difficulty"] }) {
  const isEasy = difficulty === "easy";
  const isModerate = difficulty === "moderate";
  return (
    <Label size="large" color={isEasy ? "blue" : isModerate ? "yellow" : "red"}>
      <Icon name="student" />
      {isEasy ? "Easy" : isModerate ? "Moderate" : "Hard"}
    </Label>
  );
}

function DeleteMenuItem({ recipe }: RecipeProps) {
  const [isConfirming, setIsConfirming] = React.useState(false);
  const { pathname } = useLocation();
  const submit = useSubmit();

  function onConfirm() {
    setIsConfirming(false);
    submit(
      { intent: "deleteRecipe", recipeId: recipe.id as string },
      { action: `${pathname}`, method: "post" }
    );
  }

  return (
    <>
      <Menu.Item onClick={() => setIsConfirming(true)}>
        <Button icon style={{ backgroundColor: "transparent" }}>
          <Icon name="trash" />
        </Button>
      </Menu.Item>

      <Confirm
        size="large"
        open={isConfirming}
        header={`Deleting recipe "${recipe.title}"`}
        message="Are you sure you want to delete this recipe?"
        cancelButton="Cancel"
        confirmButton="Yes"
        onCancel={() => setIsConfirming(false)}
        onConfirm={onConfirm}
        closeOnEscape
        closeOnDimmerClick
      />
    </>
  );
}

function Ingredients({ recipe, canEdit }: RecipeRouteProps) {
  const { ingredients } = recipe;
  return (
    <Segment>
      <Header as={"h2"}>Ingredients</Header>
      {ingredients.length === 0 && (
        <EmptyItems
          collection="ingredients"
          canEdit={canEdit}
          to={`/own-recipes/edit/${recipe.id}`}
        />
      )}

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

function Steps({ recipe, canEdit }: RecipeRouteProps) {
  const { steps } = recipe;
  return (
    <Segment>
      <Header as={"h2"}>Method</Header>
      {steps.length === 0 && (
        <EmptyItems
          collection="method steps"
          canEdit={canEdit}
          to={`/own-recipes/edit/${recipe.id}`}
        />
      )}

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

interface EmptyItemsProps {
  collection: string;
  canEdit: boolean;
  to: string;
}

function EmptyItems({ collection, canEdit, to }: EmptyItemsProps) {
  return (
    <Message icon info size="huge">
      <Icon name="food" />
      <Message.Content>
        <Message.Header>This recipe has no {collection}.</Message.Header>

        {canEdit && (
          <React.Fragment>
            Why don't you add some?
            <div style={{ marginTop: "1em" }}>
              <Button as={Link} to={to} icon size="huge">
                <Icon name="edit" />
                Edit recipe
              </Button>
            </div>
          </React.Fragment>
        )}
      </Message.Content>
    </Message>
  );
}
