interface RecipeRating {
  count: number;
  average: number;
}

interface RecipeImage {
  width?: number;
  height?: number;
  aspectRatio?: number;
  url: string;
}

export interface Recipe {
  title: string;
  description: string;
  rating: RecipeRating;
  image: RecipeImage;
  author: {
    name: string;
  };
  ingredients: string[];
  methods: string[];
}
