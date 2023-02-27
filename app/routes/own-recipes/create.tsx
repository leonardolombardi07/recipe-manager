import type { ActionArgs, MetaFunction } from "@remix-run/node";
import type { FormValues } from "~/components/routes/RecipeForm";
import RecipeFormRoute, {
  action as recipeFormAction,
  ErrorBoundary as RecipeFormErrorBoundary,
} from "~/components/routes/RecipeForm";

export const meta: MetaFunction = () => ({
  title: "Recipe Manager | Create Recipe",
  description: "Create your own recipe",
});

export async function action(actionArgs: ActionArgs) {
  return recipeFormAction(actionArgs, "create");
}

const INITIAL_FORM_VALUES: FormValues = {
  title: "",
  description: "",
  timings: {
    prepTime: { hours: 0, minutes: 0 },
    cookTime: { hours: 0, minutes: 0 },
    extraTime: "",
  },
  difficulty: "easy",
  ingredients: [] as string[],
  steps: [] as string[],
  servings: {
    type: "serves" as "serves" | "makes",
    value: "",
  },
  image: null,
};

export default function CreateRecipeRoute() {
  return (
    <RecipeFormRoute
      header="Create a Recipe"
      initialValues={INITIAL_FORM_VALUES}
      confirmButton={"Create"}
    />
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return <RecipeFormErrorBoundary error={error} />;
}
