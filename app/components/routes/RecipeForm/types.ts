export interface FormValues {
  title: string;
  description: string;
  timings: {
    prepTime: { hours: number; minutes: number };
    cookTime: { hours: number; minutes: number };
    extraTime: string;
  };
  difficulty: "easy" | "moderate" | "hard";
  ingredients: string[];
  steps: string[];
  servings: {
    type: "serves" | "makes";
    value: string;
  };
  image: File | string | null;
}
