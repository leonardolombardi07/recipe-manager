import type { Recipe } from "types";

const ADMIN = {
  name: "Leonardo Lombardi",
  id: "admin",
};

const CREAMY_COURGETTE_LASAGNE: Recipe = {
  id: "Fbs5CqH7m0fOTaTQ64Pz",
  title: "Creamy courgette lasagne",
  description:
    "Serve this quick, creamy courgette & ricotta lasagne for a last-minute dinner party to impress vegetarian friends. It's a great way to use courgettes when they're in season",
  rating: {
    count: 417,
    average: 4.3,
  },
  image: {
    url: "https://media.istockphoto.com/id/1313124814/photo/lasagne-traditional-italian-dish.jpg?b=1&s=170667a&w=0&k=20&c=sxtrgG2UZ60Pq2d2vR3fjPlBVjK2_PAtONx_Vm_iJ7k=",
  },
  author: ADMIN,
  ingredients: [
    "9 dried lasagne sheets",
    "1 tbsp sunflower oil",
    "1 onion, finely chopped",
  ],
  steps: [
    "Heat oven to 220C/fan 200C/gas 7. Put a pan of water on to boil, then cook the lasagne sheets for about 5 mins until softened, but not cooked through. Rinse in cold water, then drizzle with a little oil to stop them sticking togethe",
    "Meanwhile, heat the oil in a large frying pan, then fry the onion. After 3 mins, add the courgettes and garlic and continue to fry until the courgette has softened and turned bright green. Stir in 2/3 of both the ricotta and the cheddar, then season to taste. Heat the tomato sauce in the microwave for 2 mins on High until hot.",
    "In a large baking dish, layer up the lasagne, starting with half the courgette mix, then pasta, then tomato sauce. Repeat, top with blobs of the remaining ricotta, then scatter with the rest of the cheddar. Bake on the top shelf for about 10 mins until the pasta is tender and the cheese is golden.",
  ],
  difficulty: "easy",
  servings: { type: "makes", value: "10 dishes" },
  timings: {
    prepTime: { hours: 10, minutes: 30 },
    cookTime: { hours: 20, minutes: 5 },
    extraTime: "",
  },
};

const SPICY_LENTIL_SOUP: Recipe = {
  id: "Tjw8EoP6vFk9XsR2Lm",
  title: "Spicy lentil soup",
  image: {
    url: "https://images.unsplash.com/photo-1631898039981-b5dab492ff2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80",
  },
  description:
    "Warm yourself up with a bowl of this hearty lentil soup packed with spices and veggies. Perfect for a cozy winter evening!",
  rating: {
    count: 128,
    average: 4.1,
  },
  author: ADMIN,
  ingredients: [
    "1 onion, chopped",
    "2 cloves garlic, minced",
    "1 tbsp olive oil",
    "1 carrot, chopped",
    "1 celery stalk, chopped",
    "1 tsp ground cumin",
    "1/2 tsp ground coriander",
    "1/2 tsp smoked paprika",
    "1/4 tsp ground turmeric",
    "1/4 tsp cayenne pepper",
    "1 bay leaf",
    "4 cups vegetable broth",
    "1 cup dry brown lentils, rinsed",
    "1 can diced tomatoes",
    "Salt and black pepper, to taste",
    "Fresh parsley or cilantro, chopped (for garnish)",
  ],
  steps: [
    "In a large pot, heat the olive oil over medium heat. Add the onion and garlic and sauté until the onion is soft and translucent, about 5 minutes.",
    "Add the carrot and celery and sauté for another 5 minutes, until the vegetables start to soften.",
    "Add the cumin, coriander, paprika, turmeric, cayenne pepper, and bay leaf and cook for 1-2 minutes, until fragrant.",
    "Add the vegetable broth, lentils, and tomatoes and bring to a boil. Reduce heat to low, cover, and simmer for 30-40 minutes, until the lentils are tender.",
    "Remove the bay leaf and season the soup with salt and black pepper, to taste. Serve hot, garnished with fresh parsley or cilantro.",
  ],
  difficulty: "easy",
  servings: { type: "serves", value: "4" },
  timings: {
    prepTime: { hours: 0, minutes: 15 },
    cookTime: { hours: 0, minutes: 50 },
    extraTime: "",
  },
};

const POTATO_AND_CHICKEN_CASSEROLE: Recipe = {
  id: "jDa1ZgK7ah8RJ1tV9vDm",
  title: "Delicious Potato and Chicken Casserole",
  description:
    "This potato and chicken casserole is the perfect comfort food on a chilly day. The tender chicken and soft potatoes are combined with a creamy sauce and baked to perfection.",
  timings: {
    prepTime: { hours: 0, minutes: 15 },
    cookTime: { hours: 1, minutes: 15 },
    extraTime: "10 minutes resting time",
  },
  rating: {
    count: 38,
    average: 4.9,
  },
  image: {
    url: "https://images.unsplash.com/photo-1592119747782-d8c12c2ea267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
  },
  difficulty: "moderate",
  ingredients: [
    "4 medium potatoes, peeled and thinly sliced",
    "1 pound boneless, skinless chicken breasts, cut into bite-sized pieces",
    "1/2 cup all-purpose flour",
    "1/2 cup butter",
    "2 cups chicken broth",
    "1 cup heavy cream",
    "1/2 cup grated Parmesan cheese",
    "1/4 cup chopped fresh parsley",
    "Salt and pepper, to taste",
  ],
  steps: [
    "Preheat the oven to 375 degrees F (190 degrees C).",
    "In a large bowl, toss the sliced potatoes with salt and pepper. Set aside.",
    "Season the chicken with salt and pepper, then coat in flour.",
    "Melt the butter in a large skillet over medium heat. Add the chicken and cook until golden brown, about 5 minutes.",
    "Add the chicken broth and heavy cream to the skillet and stir to combine.",
    "Bring to a simmer and cook until the sauce has thickened, about 10 minutes.",
    "Stir in the Parmesan cheese and parsley.",
    "Layer half of the sliced potatoes in the bottom of a 9x13 inch baking dish.",
    "Top with the chicken mixture.",
    "Layer the remaining sliced potatoes on top.",
    "Cover with foil and bake for 45 minutes.",
    "Remove the foil and bake for an additional 15 minutes, or until the potatoes are tender and the top is golden brown.",
    "Let the casserole cool for 10 minutes before serving.",
  ],
  servings: {
    type: "serves",
    value: "4-6",
  },
  author: ADMIN,
};

const SPICY_CHICKEN_TACOS: Recipe = {
  id: "bZI35dw1T7yWkCcT2Kxh",
  title: "Spicy Chicken Tacos",
  image: {
    url: "https://plus.unsplash.com/premium_photo-1673747885154-a42474df3cee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
  },
  description:
    "These spicy chicken tacos are the perfect way to add some heat to your meal. Tender chicken is marinated in a flavorful spice blend, then grilled to perfection and served with fresh toppings.",
  rating: {
    count: 205,
    average: 4.7,
  },
  author: ADMIN,
  ingredients: [
    "1 lb boneless, skinless chicken breast",
    "1 tbsp chili powder",
    "1 tsp smoked paprika",
    "1/2 tsp cumin",
    "1/2 tsp garlic powder",
    "1/2 tsp onion powder",
    "1/4 tsp cayenne pepper",
    "1/4 tsp salt",
    "1/4 tsp black pepper",
    "2 tbsp olive oil",
    "8 corn tortillas",
  ],
  steps: [
    "Combine chili powder, smoked paprika, cumin, garlic powder, onion powder, cayenne pepper, salt, black pepper, and olive oil in a large bowl.",
    "Add chicken to the bowl and coat with the spice mixture. Cover and refrigerate for at least 30 minutes, or up to 24 hours.",
    "Preheat grill to medium-high heat. Grill chicken for 5-6 minutes per side, or until fully cooked.",
    "Warm tortillas on the grill for 30 seconds per side.",
    "Assemble tacos with chicken, avocado, salsa, and any other desired toppings.",
  ],
  difficulty: "moderate",
  servings: { type: "serves", value: "4" },
  timings: {
    prepTime: { hours: 0, minutes: 30 },
    cookTime: { hours: 0, minutes: 15 },
    extraTime: "",
  },
};

const CHICKEN_AND_SPINACH_CURRY: Recipe = {
  id: "bsa6FcT1hVrJ6nBf8zKp",
  title: "Chickpea and Spinach Curry",
  description:
    "A quick and easy vegetarian curry that can be whipped up in no time. Perfect for a mid-week meal.",
  image: {
    url: "https://media.istockphoto.com/id/1296757989/photo/healthy-vegan-chickpea-spinach-korma.jpg?b=1&s=170667a&w=0&k=20&c=8qt3ey68JOU1MbOwrqNldJX2AY1fXYehq4RMnuZZ7Kg=",
  },
  rating: {
    count: 132,
    average: 4.2,
  },
  author: ADMIN,
  ingredients: [
    "1 tbsp vegetable oil",
    "1 onion, finely chopped",
    "2 cloves garlic, crushed",
    "1 tbsp grated ginger",
    "1 tsp ground cumin",
    "1 tsp ground coriander",
    "1/2 tsp ground turmeric",
    "1/4 tsp cayenne pepper",
    "400g can chopped tomatoes",
    "400g can chickpeas, drained and rinsed",
    "200g spinach",
  ],
  steps: [
    "Heat the oil in a large saucepan over a medium heat. Add the onion and cook for 5 minutes until soft and translucent.",
    "Add the garlic and ginger and cook for a further 2 minutes.",
    "Add the spices and cook for 1 minute until fragrant.",
    "Add the chopped tomatoes and chickpeas and bring to a simmer.",
    "Simmer for 10-15 minutes until the sauce has thickened and the chickpeas are tender.",
    "Stir in the spinach and cook until wilted.",
    "Serve with rice or naan bread.",
  ],
  difficulty: "easy",
  servings: { type: "serves", value: "4" },
  timings: {
    prepTime: { hours: 0, minutes: 10 },
    cookTime: { hours: 0, minutes: 25 },
    extraTime: "",
  },
};

const BAKED_SALMON_WITH_LEMON_AND_DILL: Recipe = {
  id: "vCe8WgK7aF5rJ1tV9vDm",
  title: "Baked Salmon with Lemon and Dill",
  description:
    "A simple and healthy way to enjoy fresh salmon. The lemon and dill add a refreshing flavor.",
  image: {
    url: "https://media.istockphoto.com/id/1264952430/photo/roasted-salmon-steak-served-with-lemon-and-onion-on-wooden-table.jpg?b=1&s=170667a&w=0&k=20&c=MYsGT1TP5QHItWxkZWnJCtHTyYf2T03fdALsRDgPXvQ=",
  },
  rating: {
    count: 287,
    average: 4.5,
  },
  author: ADMIN,
  ingredients: [
    "4 salmon fillets",
    "2 tbsp olive oil",
    "1 lemon, sliced",
    "2 tbsp chopped fresh dill",
    "Salt and pepper",
  ],
  steps: [
    "Preheat the oven to 200C/180C fan/gas 6.",
    "Place the salmon fillets on a baking tray lined with foil.",
    "Drizzle the olive oil over the fillets and season with salt and pepper.",
    "Place a slice of lemon on each fillet and sprinkle with the chopped dill.",
    "Bake in the preheated oven for 12-15 minutes, or until the salmon is cooked through.",
    "Serve immediately with steamed vegetables or a salad.",
  ],
  difficulty: "moderate",
  servings: { type: "serves", value: "4" },
  timings: {
    prepTime: { hours: 0, minutes: 10 },
    cookTime: { hours: 0, minutes: 15 },
    extraTime: "",
  },
};

const PESTO_PASTA_SALAD: Recipe = {
  id: "vCe8WgK7aF5rJ1tV9sD23",
  title: "Pesto pasta salad",
  description:
    "This simple pesto pasta salad makes a great summertime meal. Loaded with fresh ingredients and tossed with a tangy pesto dressing, this dish is sure to impress!",
  image: {
    url: "https://media.istockphoto.com/id/1224405926/photo/pasta-salad-with-zucchini-and-pesto-dressing-and-white-cheese.jpg?b=1&s=170667a&w=0&k=20&c=6MBL9XV9mZruwVG5qDWP_Cjq-A49zoHJes0llEmKXTY=",
  },
  timings: {
    prepTime: { hours: 0, minutes: 20 },
    cookTime: { hours: 0, minutes: 10 },
    extraTime: "",
  },
  difficulty: "easy",
  servings: { type: "serves", value: "4" },
  ingredients: [
    "1 pound penne pasta",
    "1 pint cherry tomatoes, halved",
    "1/2 red onion, diced",
    "1/2 cup pitted kalamata olives, halved",
    "1/4 cup pine nuts, toasted",
    "1/2 cup fresh basil, chopped",
    "1/2 cup fresh parsley, chopped",
    "1/2 cup freshly grated parmesan cheese",
    "1/2 cup olive oil",
    "2 tablespoons red wine vinegar",
    "1 clove garlic, minced",
    "salt and pepper, to taste",
  ],
  steps: [
    "Cook the pasta according to package instructions until al dente. Drain and rinse under cold water to stop the cooking process. Transfer the pasta to a large bowl.",
    "Add the cherry tomatoes, red onion, olives, pine nuts, basil, parsley, and parmesan cheese to the bowl with the pasta.",
    "In a small bowl, whisk together the olive oil, red wine vinegar, garlic, salt, and pepper until well combined. Pour the dressing over the pasta and toss to combine.",
    "Serve the pasta salad chilled or at room temperature.",
  ],
  author: ADMIN,
  rating: {
    count: 222,
    average: 3.5,
  },
};

const CHICKPEA_CURRY: Recipe = {
  id: "h34lY5rEaL1tY",
  title: "Chickpea Curry",
  description:
    "This easy chickpea curry is healthy, vegan and packed with vibrant flavors of cumin, coriander, and turmeric. It's a quick and easy dinner that's perfect for a busy weeknight meal.",
  image: {
    url: "https://media.istockphoto.com/id/1279351047/photo/indian-chana-alu-masala-with-coriander-chickpea-curry.jpg?b=1&s=170667a&w=0&k=20&c=VKsdyafCNetMmYUqO0grVyvLq_2DIE4SvWL--PTEHcM=",
  },
  rating: {
    count: 103,
    average: 4.5,
  },
  author: ADMIN,
  ingredients: [
    "2 tbsp olive oil",
    "1 onion, finely chopped",
    "3 garlic cloves, finely chopped",
    "1 tbsp grated ginger",
    "1 tsp ground cumin",
    "1 tsp ground coriander",
    "1 tsp ground turmeric",
    "2 tbsp tomato paste",
    "2 cups vegetable broth",
    "2 cans chickpeas, drained and rinsed",
    "1/2 cup coconut milk",
    "1/4 tsp salt",
    "fresh cilantro, for garnish",
  ],
  steps: [
    "In a large pot, heat olive oil over medium heat. Add onions and sauté until soft and translucent, about 5 minutes. Add garlic and ginger and cook for an additional 2 minutes.",
    "Add cumin, coriander, turmeric, and tomato paste. Stir well and cook for 2-3 minutes, or until fragrant.",
    "Add vegetable broth and chickpeas. Bring to a boil, then reduce heat and let simmer for 10-15 minutes.",
    "Stir in coconut milk and salt. Cook for an additional 5 minutes.",
    "Serve hot, garnished with fresh cilantro.",
  ],
  difficulty: "easy",
  servings: { type: "serves", value: "4" },
  timings: {
    prepTime: { hours: 0, minutes: 15 },
    cookTime: { hours: 0, minutes: 30 },
    extraTime: "",
  },
};

const STUFFED_BELL_PEPPERS: Recipe = {
  id: "JnYkSdR4wBtEiQyN1hZf",
  title: "Stuffed Bell Peppers",
  description:
    "These stuffed bell peppers are filled with a flavorful mixture of beef, rice, and spices, making them a delicious and satisfying meal.",
  image: {
    url: "https://media.istockphoto.com/id/1289890443/photo/preparing-stuffed-bell-peppers-with-ground-meat-in-tomato-sauce.jpg?b=1&s=170667a&w=0&k=20&c=io2EKzhUKp_z6APVCOXDxN2gmqmSgDeE0wiuozjVP_k=",
  },
  author: ADMIN,
  ingredients: [
    "6 bell peppers, any color",
    "1 lb. ground beef",
    "1 small onion, chopped",
    "2 garlic cloves, minced",
    "1 cup cooked rice",
    "1 tsp. salt",
    "1/4 tsp. black pepper",
    "1/4 tsp. paprika",
    "1/4 tsp. garlic powder",
    "1/4 tsp. onion powder",
    "1 can (8 oz.) tomato sauce",
  ],
  steps: [
    "Preheat oven to 375°F.",
    "Slice off the tops of the bell peppers and remove the seeds and membranes. Set aside.",
    "In a large skillet, cook the ground beef over medium-high heat until browned. Drain off the excess fat.",
    "Add the onion and garlic to the skillet and sauté until softened.",
    "Add the cooked rice, salt, black pepper, paprika, garlic powder, onion powder, and tomato sauce to the skillet. Stir to combine.",
    "Stuff each bell pepper with the beef mixture and place in a baking dish.",
    "Bake for 45 minutes, or until the peppers are tender and the filling is hot and bubbly.",
    "Let cool for a few minutes before serving.",
  ],
  servings: { type: "serves", value: "6" },
  difficulty: "moderate",
  timings: {
    prepTime: { hours: 0, minutes: 30 },
    cookTime: { hours: 1, minutes: 0 },
    extraTime: "",
  },
  rating: {
    count: 542,
    average: 3.7,
  },
};

const SPICY_KOREAN_CHICKEN: Recipe = {
  id: "uV7q3K1m4cXp9IaS8yZp",
  title: "Spicy Korean Chicken",
  description:
    "This Korean chicken recipe has a fiery gochujang and honey glaze that caramelizes on the grill, which makes for a beautifully charred and crispy skin. Serve it with steamed rice or noodles.",
  rating: {
    count: 542,
    average: 4.8,
  },
  image: {
    url: "https://media.istockphoto.com/id/1415401638/photo/cropped-shot-of-chopstick-holding-a-korean-spicy-fried-chicken.jpg?b=1&s=170667a&w=0&k=20&c=-AKtLJqLGoZi73MkG06KkFZ_IF55_FLXyBK5SdngyA0=",
  },
  author: ADMIN,
  ingredients: [
    "4 chicken thighs",
    "2 tablespoons gochujang paste",
    "1 tablespoon honey",
    "1 tablespoon soy sauce",
    "1 tablespoon vegetable oil",
    "1 teaspoon sesame oil",
    "1 teaspoon grated ginger",
    "1 teaspoon minced garlic",
    "Salt and pepper to taste",
  ],
  steps: [
    "In a small bowl, whisk together the gochujang paste, honey, soy sauce, vegetable oil, sesame oil, ginger, and garlic.",
    "Season the chicken thighs with salt and pepper on both sides.",
    "Brush the chicken thighs with the gochujang mixture on both sides.",
    "Preheat a grill or grill pan to medium-high heat. Grill the chicken thighs for 6-8 minutes per side, or until the internal temperature reaches 165°F.",
    "Let the chicken rest for 5 minutes, then slice and serve with steamed rice or noodles.",
  ],
  difficulty: "moderate",
  servings: { type: "serves", value: "4" },
  timings: {
    prepTime: { hours: 0, minutes: 15 },
    cookTime: { hours: 0, minutes: 16 },
    extraTime: "5 minutes resting time",
  },
};

const TRENDING_RECIPES: Recipe[] = Array.from(
  new Set([
    CREAMY_COURGETTE_LASAGNE,
    BAKED_SALMON_WITH_LEMON_AND_DILL,
    CHICKEN_AND_SPINACH_CURRY,
    POTATO_AND_CHICKEN_CASSEROLE,
    SPICY_LENTIL_SOUP,
    SPICY_CHICKEN_TACOS,
    PESTO_PASTA_SALAD,
    CHICKPEA_CURRY,
    STUFFED_BELL_PEPPERS,
    SPICY_KOREAN_CHICKEN,
  ])
);

export { TRENDING_RECIPES, ADMIN };
