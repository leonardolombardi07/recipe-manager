export interface Recipe {
  id?: string;
  title: string;
  description: string;
  image: { url: string };
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
  rating?: {
    count: number;
    average: number;
  };
  author?: { name: string; id: string };
}
