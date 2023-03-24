import type { Recipe } from "types";

const userCredentials = { email: "leo@email.com", password: "pass123456" };

const recipeForm: Omit<Recipe, "id" | "author" | "image"> = {
  title: "Receita teste",
  description: "Descrição",
  servings: { type: "makes", value: "22 pedaços" },
  difficulty: "hard",
  timings: {
    prepTime: { hours: 1, minutes: 30 },
    cookTime: { hours: 4, minutes: 10 },
    extraTime: "20 minutos descansando",
  },
  ingredients: ["Primeiro", "Segundo", "Terceiro"],
  steps: ["Primeiro passo", "Segundo passo", "Terceiro passo"],
};

describe("recipes spec", () => {
  beforeEach(() => {
    cy.signIn(userCredentials);
  });

  it(
    "should be able to create a recipe",
    { defaultCommandTimeout: 10000 }, //Because we are deliberately increasing the request time to visualize the optimistic ui
    () => {
      cy.visit("/own-recipes/create");

      cy.get("#title-input").type(recipeForm.title);
      cy.get("#description-textarea").type(recipeForm.description);

      // TODO: deal with this selects. They are actually "divs" in the DOM
      // so we should change the values with other methods besides ".select()"
      // const { timings } = recipeForm;
      // cy.get('[data-test="recipe-prepTimeHours-input"]').select(
      //   timings.prepTime.hours
      // );
      // cy.get('[data-test="recipe-prepTimeMinutes-input"]').select(
      //   timings.prepTime.minutes
      // );
      // cy.get('[data-test="recipe-cookTimeHours-input"]').select(
      //   timings.cookTime.hours
      // );
      // cy.get('[data-test="recipe-cookTimeMinutes-input"]').select(
      //   timings.cookTime.minutes
      // );
      // cy.get("#extraTime-input").type(timings.extraTime);

      // cy.get('[data-test="recipe-difficulty-input"]').select(
      //   recipeForm.difficulty
      // );

      if (recipeForm.servings.type === "serves") {
        cy.get('[data-test="recipe-servingType-button-serves"]').click();
      } else {
        cy.get('[data-test="recipe-servingType-button-makes"]').click();
      }

      cy.get("#servingsValue-input").type(recipeForm.servings.value);

      cy.get('[data-test="recipe-create-button"]').click();

      cy.location("pathname").should("not.contain", "create");
    }
  );
});
