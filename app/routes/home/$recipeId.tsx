import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
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

export default function HomeRecipeRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <RecipeRoute
      recipe={data.recipe}
      canGoBack={true}
      canDelete={false}
      canEdit={false}
      canRate={true}
    />
  );
}
