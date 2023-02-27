import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import RecipeFormRoute from "~/components/routes/RecipeForm";
import { loader as recipeRouteLoader } from "~/components/routes/RecipeRoute";
import { action as recipeFormAction } from "~/components/routes/RecipeForm";

export const meta: MetaFunction<typeof loader> = ({ data }: any) => {
  if (!data) {
    return { title: "No recipe", description: "No recipe found" };
  }

  return {
    title: `Editing "${data?.recipe?.title}" recipe`,
    description: `Edit the "${data?.recipe?.title}" recipe`,
  };
};

export async function action(actionArgs: ActionArgs) {
  return recipeFormAction(actionArgs, "edit");
}

export async function loader(loaderArgs: LoaderArgs) {
  return recipeRouteLoader(loaderArgs);
}

export default function OwnRecipesRecipeRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <RecipeFormRoute
      header={`Edit "${data.recipe.title}" recipe`}
      initialValues={{
        ...data.recipe,
        image: data.recipe.image.url,
      }}
      confirmButton={"Edit"}
    />
  );
}
