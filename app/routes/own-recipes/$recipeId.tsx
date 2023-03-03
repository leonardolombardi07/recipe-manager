import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import RecipeRoute, {
  meta as recipeRouteMeta,
  action as recipeRouteAction,
  loader as recipeRouteLoader,
} from "~/components/routes/RecipeRoute";

export const meta: MetaFunction<typeof loader> = (metaArgs) => {
  return recipeRouteMeta(metaArgs);
};

export async function action(actionArgs: ActionArgs) {
  return recipeRouteAction(actionArgs);
}

export async function loader(loaderArgs: LoaderArgs) {
  return recipeRouteLoader(loaderArgs);
}

export default function OwnRecipesRecipeRoute() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  return (
    <RecipeRoute
      recipe={data.recipe}
      canGoBack={true}
      onGoBack={() => navigate("/own-recipes")}
      canDelete={true}
      canEdit={true}
      canRate={false}
    />
  );
}
