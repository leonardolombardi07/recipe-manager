import type { Recipe } from "types";

const MINUTE_OPTIONS = Array.from(Array(60).keys()).map((m) => ({
  key: m,
  text: `${m} mins`,
  value: m,
}));

const HOUR_OPTIONS = Array.from(Array(24).keys()).map((h) => ({
  key: h,
  text: `${h} hours`,
  value: h,
}));

const DIFICULTY_OPTIONS: ({ [key: string]: string } & {
  value: Recipe["difficulty"];
})[] = [
  { key: "easy", value: "easy", text: "Easy" },
  { key: "moderate", value: "moderate", text: "Moderate" },
  { key: "hard", value: "hard", text: "Hard" },
];

export { MINUTE_OPTIONS, HOUR_OPTIONS, DIFICULTY_OPTIONS };
