import {
  validateAuthor,
  validateDescription,
  validateDifficulty,
  validateExtraTime,
  validateImage,
  validateIngredients,
  validateServingType,
  validateServingValue,
  validateSteps,
  validateTime,
  validateTitle,
} from "./validation";
import { someError } from "~/utils/errors";
import type { Recipe, User } from "types";

type ValidatedForm =
  | { hasErrors: true; errors: any; values: Recipe }
  | { hasErrors: false; values: Recipe };

function getValidatedForm(formData: FormData, user: User): ValidatedForm {
  const form = getForm(formData, user);

  const validatedForm = validateForm(form);
  if (validatedForm.hasErrors === true) {
    return {
      hasErrors: true,
      errors: validatedForm.errors,
      values: form as unknown as Recipe,
    };
  }

  return { hasErrors: false, values: form as unknown as Recipe };
}

type FormDataAsObject = ReturnType<typeof convertFormDataToObj>;

function convertFormDataToObj(formData: FormData) {
  const imageField = formData.get("image");
  const imageUrl =
    imageField instanceof File ? URL.createObjectURL(imageField) : imageField;

  return {
    title: formData.get("title"),
    description: formData.get("description"),
    image: { url: imageUrl },
    timings: {
      prepTime: {
        hours: formData.get("prepTimeHours"),
        minutes: formData.get("prepTimeMinutes"),
      },
      cookTime: {
        hours: formData.get("cookTimeHours"),
        minutes: formData.get("cookTimeMinutes"),
      },
      extraTime: formData.get("extraTime"),
    },
    difficulty: formData.get("difficulty"),
    ingredients: formData.getAll("ingredient").slice(0, -1), // Remove next
    steps: formData.getAll("step").slice(0, -1), // Remove next
    servings: {
      type: formData.get("servingsType"),
      value: formData.get("servingsValue"),
    },
  };
}

interface Form extends FormDataAsObject {
  author: Recipe["author"];
}

function getForm(formData: FormData, user: User): Form {
  return {
    ...convertFormDataToObj(formData),
    author: {
      id: user.uid,
      name: user.displayName || "",
    },
  };
}

function validateForm(form: Form) {
  const { prepTime, cookTime } = form.timings;
  const errors = {
    title: validateTitle(form.title),
    description: validateDescription(form.description),
    image: validateImage(form.image),
    timings: {
      prepTime: {
        hours: validateTime(prepTime.hours, "Prep time hours", "hours"),
        minutes: validateTime(prepTime.minutes, "Prep time minutes", "minutes"),
      },
      cookTime: {
        hours: validateTime(cookTime.hours, "Cook time hours", "hours"),
        minutes: validateTime(cookTime.minutes, "Cook time minutes", "minutes"),
      },
      extraTime: validateExtraTime(form.timings.extraTime),
    },
    difficulty: validateDifficulty(form.difficulty),
    ingredients: validateIngredients(form.ingredients),
    steps: validateSteps(form.steps),
    servings: {
      type: validateServingType(form.servings.type),
      value: validateServingValue(form.servings.value),
    },
    author: validateAuthor(form.author),
  };

  return { hasErrors: someError(errors), errors };
}

export { getValidatedForm };
