import type {
  ActionArgs,
  LoaderArgs,
  MetaFunction,
  TypedResponse,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Link,
  useActionData,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
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
  Loader,
} from "semantic-ui-react";
import type { Recipe } from "types";
import * as Firebase from "~/services/firebase";
import { badRequest } from "~/utils/action";
import Confirm from "~/components/addons/Confirm";
import { capitalizeFirstLetter } from "~/utils/string";
import { extractNumber, isNumeric } from "~/utils/number";
import * as Cookies from "~/services/cookies";
import type { RatingValue } from "~/services/firebase";
import useSpinDelay from "~/components/hooks/useSpinDelay";

// TODO: fix type on parameters
export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return { title: "No recipe", description: "No recipe found" };
  }

  return {
    title: `"${data?.recipe?.title}" recipe`,
    description: `Enjoy the "${data?.recipe?.title}" recipe and much more`,
  };
};

export async function loader({ request, params }: LoaderArgs) {
  if (!params.recipeId) {
    throw badRequest("No recipe id found!");
  }

  const user = await Cookies.getAuthenticatedUser(request);
  const recipe = await Firebase.getRecipeWithUserInfo(
    params.recipeId,
    user.uid
  );
  if (!recipe) {
    throw badRequest(`Recipe for  recipe id "${params.recipeId}" not found`);
  }

  // Fix: something related to
  // https://github.com/remix-run/remix/issues/3931
  // We don't get correct types when importing the loader
  return json({ recipe }) as TypedResponse<{
    recipe: Recipe & { userRating: number | null };
  }>;
}

const ACTION_INTENTS = {
  DELETE_RECIPE: "deleteRecipe",
  RATE_RECIPE: "rateRecipe",
} as const;

type ActionIntent = typeof ACTION_INTENTS[keyof typeof ACTION_INTENTS];

export async function action({ request, params }: ActionArgs) {
  const formData = await request.formData();

  const recipeId = String(params.recipeId);
  if (!recipeId) {
    throw badRequest({ error: `The recipe id "${recipeId}" is not valid` });
  }

  const intent = String(formData.get("intent"));
  switch (intent as ActionIntent) {
    case "deleteRecipe":
      await Firebase.deleteRecipe(recipeId);
      // TODO: we actually want to navigate to the last route
      // But the user can only delete it's own recipes so that's
      // not a big problem now
      return redirect("/own-recipes");

    case "rateRecipe":
      const user = await Cookies.getAuthenticatedUser(request);
      const rating = Number(formData.get("rating"));
      if (!isNumeric(rating) || rating < 0 || rating > 5) {
        return badRequest({
          error: `The rating must be a number between 0 and 5. Rating "${rating}" provided is not valid`,
        });
      }

      try {
        await wait(5000);
        await Firebase.rateRecipe(recipeId, user.uid, rating as RatingValue);
        return json({ error: null });
      } catch (error: any) {
        return badRequest({ error: error?.message || "Unknown error" });
      }

    default:
      if (!Object.values(ACTION_INTENTS).includes(intent as any)) {
        throw badRequest({ error: `The intent "${intent}" is not supported` });
      }
  }

  return json({ error: null });

  function wait(ms: number) {
    return new Promise((r, reject) => {
      setTimeout(() => {
        r("");
      }, ms);
    });
  }
}

interface RecipeProps {
  recipe: Recipe;
}

interface RecipeRouteProps extends RecipeProps {
  canDelete: boolean;
  canEdit: boolean;
  canGoBack: boolean;
  onGoBack?: () => void;
  canRate: boolean;
}

export default function RecipeRoute(props: RecipeRouteProps) {
  const rateRecipeRef = React.useRef<HTMLDivElement>(null);

  function scrollToRateRecipe() {
    if (rateRecipeRef.current) {
      rateRecipeRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  const { recipe, canRate } = props;
  return (
    <Segment style={{ padding: 0, minHeight: "100vh" }}>
      <HeaderMenu {...props} />

      <Segment basic>
        <Grid columns={2} style={{ marginBottom: 20 }} stackable centered>
          <Grid.Column width={5}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image src={recipe?.image?.url} style={{ maxHeight: 500 }} />
            </div>
          </Grid.Column>

          <Grid.Column width={8}>
            <Header as="h1">
              {recipe.title}
              <Header.Subheader>
                {recipe.author?.name ? `By ${recipe.author?.name}` : null}
                <span> | </span>
                <Rating
                  icon="star"
                  rating={recipe.rating?.average || 0}
                  maxRating={5}
                  disabled
                />
                {canRate && isNumeric(recipe.rating?.count) && (
                  <React.Fragment>
                    <span>{recipe.rating?.count || 0} ratings </span>
                    <Button
                      size="tiny"
                      basic
                      color="blue"
                      style={{ marginLeft: 5 }}
                      onClick={scrollToRateRecipe}
                    >
                      Rate
                    </Button>
                  </React.Fragment>
                )}
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

        <Grid as={Segment} style={{ marginTop: 30 }} padded stackable>
          <Grid.Column width={8}>
            <Ingredients {...props} />
          </Grid.Column>

          <Grid.Column width={8}>
            <Steps {...props} />
          </Grid.Column>
        </Grid>

        {canRate && (
          <Segment textAlign="center">
            <RateRecipe ref={rateRecipeRef} />
          </Segment>
        )}
      </Segment>
    </Segment>
  );
}

function HeaderMenu({
  recipe,
  canDelete,
  canEdit,
  canGoBack,
  onGoBack,
}: RecipeRouteProps) {
  const navigate = useNavigate();

  function handleGoBack() {
    if (onGoBack) onGoBack();
    else navigate(-1);
  }

  return (
    <Menu style={{ marginBottom: 0 }} size="huge">
      {canGoBack && (
        <Menu.Item onClick={handleGoBack}>
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
      {extraTime && <TimingLabel name="Extra Time:" time={extraTime} />}
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
      { intent: ACTION_INTENTS.DELETE_RECIPE },
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
        cancelButton="No"
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
    <Message icon info size="large">
      <Icon name="food" />
      <Message.Content>
        <Message.Header>This recipe has no {collection}.</Message.Header>

        {canEdit && (
          <React.Fragment>
            Why don't you add some?
            <div style={{ marginTop: "1em" }}>
              <Button as={Link} to={to} icon size="large">
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

const RateRecipe = React.forwardRef<HTMLDivElement, {}>((props, ref) => {
  const { pathname } = useLocation();
  const submit = useSubmit();
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();
  const showSpinner = useSpinDelay(navigation.state === "submitting", {
    delay: 500,
  });

  const userRating = loaderData?.recipe?.userRating || 0;
  const ratingToDisplay = navigation.formData
    ? Number(navigation.formData.get("rating"))
    : userRating;

  return (
    <Segment>
      <Header as="h2">Rate this recipe</Header>
      <div ref={ref} />

      <Rating
        clearable
        icon="star"
        rating={ratingToDisplay || 0}
        maxRating={5}
        size="massive"
        onRate={(e, { rating }) => {
          submit(
            { intent: ACTION_INTENTS.RATE_RECIPE, rating: rating as any },
            { action: `${pathname}`, method: "post" }
          );
        }}
      />
      <Loader
        active={showSpinner}
        size="tiny"
        style={{ position: "relative", marginTop: 10 }}
      />

      {navigation.state === "idle" && actionData?.error ? (
        <Message negative>
          <Message.Header>Invalid form!</Message.Header>
          <p>
            <b>This is the error we found:</b> "{actionData?.error}"
          </p>
        </Message>
      ) : null}
    </Segment>
  );
});
