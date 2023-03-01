// We don't consider 0 as a valid rating,
// but as a sign that the user is clearing (reseting) the rating
type RatingClearingValue = 0;

export type RatingValue = RatingClearingValue | 1 | 2 | 3 | 4 | 5;

export interface RatedRecipeRecord {
  rating: RatingValue;
  id: string;
}

export interface FirestoreUser {
  savedRecipes: string[];
  ratedRecipes: RatedRecipeRecord[];
}
