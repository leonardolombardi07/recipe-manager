import { isNumeric } from "~/utils/number";

function validateTitle(title: FormDataEntryValue | null) {
  if (typeof title !== "string") {
    return `Title must be a string`;
  }

  if (title.length === 0) {
    return `A title is required`;
  }

  if (title.length < 3) {
    return `Title "${title}" must have at least 3 characters`;
  }

  return null;
}

function validateDescription(description: FormDataEntryValue | null) {
  if (typeof description !== "string") {
    return `Description must be a string`;
  }

  if (description && description.length < 3) {
    return `Description "${description}" must have at least 3 characters"`;
  }

  return null;
}

function validateImage(image: string | null) {
  if (!image) return null;

  if (typeof image !== "string") {
    return `Image "${image} must be a string"`;
  }

  return null;
}

function validateTime(
  value: FormDataEntryValue | null,
  label: string,
  unit: "minutes" | "hours"
) {
  if (!isNumeric(value)) {
    return `${label} must be a number`;
  }

  const convertedValue = Number(value);
  if (unit === "minutes" && (convertedValue > 60 || convertedValue < 0)) {
    return `${label} must be a number between 0 and 60`;
  }

  if (unit === "hours" && (convertedValue > 24 || convertedValue < 0)) {
    return `${label} must be a number between 0 and 24`;
  }

  return null;
}

function validateExtraTime(extraTime: FormDataEntryValue | null) {
  if (extraTime && typeof extraTime !== "string") {
    return `Extra time "${extraTime}" must be a string`;
  }

  return null;
}

function validateDifficulty(difficulty: FormDataEntryValue | null) {
  const validOptions = ["easy", "moderate", "hard"];
  if (
    !difficulty ||
    typeof difficulty !== "string" ||
    !validOptions.includes(difficulty)
  ) {
    return `Difficulty must be one of these options: "${validOptions.join(
      ", "
    )}"`;
  }

  return null;
}

function validateIngredients(ingredients: FormDataEntryValue[]) {
  if (
    ingredients.some(function validateIngredient(ingredient) {
      return typeof ingredient !== "string" || ingredient.length > 30;
    })
  ) {
    return `Ingredients must be strings and be less than 30 characters`;
  }

  return null;
}

function validateSteps(steps: FormDataEntryValue[]) {
  if (
    steps.some(function validateStep(step) {
      return typeof step !== "string" || step.length > 100;
    })
  ) {
    return `Steps must be strings and be less than 100 characters`;
  }

  return null;
}

function validateServingType(type: FormDataEntryValue | null) {
  if (!type) {
    return `Serving type is required`;
  }

  const validTypes = ["serves", "makes"];
  if (typeof type !== "string" || !validTypes.includes(type)) {
    return `Serving type "${type}" must be one of these: ${validTypes.join(
      ", "
    )}`;
  }

  return null;
}

function validateServingValue(value: FormDataEntryValue | null) {
  if (!value) {
    return `Serving value is required`;
  }

  if (value && typeof value !== "string") {
    return `Serving value "${value} must be a string`;
  }

  return null;
}

function validateAuthor(author: { id: string; name: string }) {
  if (!author.id || typeof author.id !== "string") {
    return `Author id "${author.id} must be a string"`;
  }

  if (!author.name || typeof author.name !== "string") {
    return `Author name "${author.name} must be a string"`;
  }

  return null;
}

export {
  validateTitle,
  validateDescription,
  validateImage,
  validateDifficulty,
  validateServingType,
  validateServingValue,
  validateIngredients,
  validateTime,
  validateExtraTime,
  validateSteps,
  validateAuthor,
};
