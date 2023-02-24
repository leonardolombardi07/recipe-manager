import RecipePage from "~/components/RecipePage";
import { FAKE_RECIPE } from "~/data";

export default function RecipeRoute() {
  return <RecipePage recipe={FAKE_RECIPE} />;
}
