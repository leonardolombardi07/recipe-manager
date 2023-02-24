import type { Recipe, User } from "types";

async function login(): Promise<User> {
  return { id: "1", email: "leo@mail.com" };
}

async function createRecipe(form: Recipe): Promise<Recipe> {
  await wait(10000);
  return {
    ...form,
    id: String(Math.random() * 250),
    author: {
      name: "Leo",
      id: "10",
    },
    rating: {
      average: 0,
      count: 100,
    },
  };
}

async function getSavedRecipes() {
  const recipes = Array.from(Array(10).keys());
  return recipes;
}

async function getOwnRecipes() {
  await wait(700);
  const recipes = Array.from(Array(15).keys());
  return recipes;
}

function wait(ms: number, mayFail: boolean = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!mayFail) resolve("");

      if (Math.random() > 0.5) resolve("");
      else reject();
    }, ms);
  });
}

export const Firebase = {
  login,
  createRecipe,
  getSavedRecipes,
  getOwnRecipes,
};
