import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form as RemixForm } from "@remix-run/react";
import { useNavigate } from "@remix-run/react";
import type { Dispatch, SetStateAction } from "react";
import React from "react";
import type {
  InputOnChangeData,
  TextAreaProps,
  DropdownProps,
} from "semantic-ui-react";
import {
  Form,
  Button,
  Segment,
  Header,
  Card,
  Icon,
  Image,
  Label,
} from "semantic-ui-react";
import FastFormInput from "~/components/collections/Form/FastFormInput";
import FastFormTextArea from "~/components/collections/Form/FastFormTextArea";

export const action: ActionFunction = async ({ request }) => {
  try {
    // const formInputData = await request.formData();
  } finally {
    return redirect("/recipe/32232");
  }
};

export default function CreateRecipeRoute() {
  return (
    <Segment padded>
      <Header as="h1">Create a Recipe</Header>

      <Segment>
        <CreateRecipeForm />
      </Segment>
    </Segment>
  );
}

const INITIAL_FORM_STATE = {
  title: "",
  shortIntro: "",
  image: { url: "" },
  timings: {
    prepTime: { hours: 0, minutes: 0 },
    cookTime: { hours: 0, minutes: 0 },
    extraTime: "",
  },
  difficulty: "easy" as "easy" | "moderate" | "hard",
  ingredients: [] as string[],
  method: {
    steps: [] as string[],
  },
  servings: {
    type: "serves" as "serves" | "makes",
    value: "",
  },
};

function CreateRecipeForm() {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = React.useState(INITIAL_FORM_STATE.image.url);
  const [ingredients, setIngredients] = React.useState(
    INITIAL_FORM_STATE.ingredients
  );
  const [steps, setSteps] = React.useState(INITIAL_FORM_STATE.method.steps);
  const [servingsType, setServingsType] = React.useState<"serves" | "makes">(
    INITIAL_FORM_STATE.servings.type
  );
  const [timings, setTimings] = React.useState(INITIAL_FORM_STATE.timings);
  const [difficulty, setDifficulty] = React.useState(
    INITIAL_FORM_STATE.difficulty
  );

  function onUploadImage(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      const url = URL.createObjectURL(event.target.files[0]);
      setImageUrl(url);
    }
  }

  function onChangeServingType(
    event: React.MouseEvent<HTMLButtonElement>,
    type: typeof INITIAL_FORM_STATE["servings"]["type"]
  ) {
    event.preventDefault();
    setServingsType(type);
  }

  return (
    <Form
      as={RemixForm}
      onSubmit={(event) => {
        // event.preventDefault();
        const formInputData = new FormData(event.currentTarget);
        const formData = {
          title: formInputData.get("title"),
          shortIntro: formInputData.get("shortIntro"),
          image: { url: imageUrl },
          timings: {
            ...timings,
            extraTime: formInputData.get("extraTime"),
          },
          difficulty,
          ingredients,
          method: { steps },
          servings: {
            type: servingsType,
            value: formInputData.get("servingsValue"),
          },
        } as typeof INITIAL_FORM_STATE;
        console.log(formData);
      }}
      method="post"
      action="/own-recipes/create"
    >
      <Form.Group widths="equal">
        <ImageUploader
          value={imageUrl}
          onChange={onUploadImage}
          reset={() => setImageUrl("")}
        />

        <div style={{ width: "100%", margin: 10 }}>
          <FastFormInput
            name="title"
            label="Recipe Title (keep it short and descriptive)"
            placeholder="e.g Momma's Apple Pie"
            required
          />

          <FastFormTextArea
            name="shortIntro"
            label="Short Intro (10-15 words)"
            placeholder="Tell us about your recipe"
            required
          />

          <Timings timings={timings} setTimings={setTimings} />

          <Form.Group widths={"equal"}>
            <Form.Select
              value={difficulty}
              onChange={(_, data) =>
                setDifficulty(data.value as "easy" | "moderate" | "hard")
              }
              options={[
                { key: "easy", value: "easy", text: "Easy" },
                { key: "moderate", value: "moderate", text: "Moderate" },
                { key: "hard", value: "hard", text: "Hard" },
              ]}
              label={"Difficulty level"}
              placeholder="Easy"
            />

            <Form.Field>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Label
                  basic
                  style={{ border: 0, fontSize: 13, paddingLeft: 0 }}
                >
                  Servings
                </Label>
                <Button.Group
                  style={{ marginBottom: 10, marginTop: -3, height: 38.15 }}
                >
                  <Button
                    positive={servingsType === "serves"}
                    onClick={(e) => onChangeServingType(e, "serves")}
                  >
                    Serves
                  </Button>
                  <Button
                    positive={servingsType === "makes"}
                    onClick={(e) => onChangeServingType(e, "makes")}
                  >
                    Makes
                  </Button>
                </Button.Group>
              </div>

              <FastFormInput
                name="servingsValue"
                placeholder="e.g 8 pieces"
                required
              />
            </Form.Field>
          </Form.Group>
        </div>
      </Form.Group>

      <Form.Group widths={"equal"}>
        <Ingredients
          ingredients={ingredients}
          setIngredients={setIngredients}
        />
        <Method steps={steps} setSteps={setSteps} />
      </Form.Group>

      <Form.Group inline style={{ marginTop: 30 }}>
        <Button
          onClick={(event) => {
            event.preventDefault();
            navigate(-1);
          }}
          size={"huge"}
        >
          Cancel
        </Button>

        <Button primary size="huge">
          Create
        </Button>
      </Form.Group>
    </Form>
  );
}

function ImageUploader({
  value,
  onChange,
  reset,
}: {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  reset: () => void;
}) {
  return (
    <Card
      style={{
        height: 400,
        placeItems: "center",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <Card.Content
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {value ? (
          <React.Fragment>
            <Image
              src={value}
              fluid
              style={{ height: "100%", width: "100%" }}
            />

            <Button
              circular
              color="red"
              icon="delete"
              size="huge"
              style={{ position: "absolute", bottom: 0, left: 0, zIndex: 5 }}
              onClick={reset}
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Icon name="camera" size="huge" />
            <Header style={{ marginTop: 10, textAlign: "center" }}>
              Tap or click to add a photo
              <Header.Subheader style={{ marginTop: 30 }}>
                *Please ensure this is your own image
              </Header.Subheader>
            </Header>
          </React.Fragment>
        )}

        <input
          // value={""} Resets the input the empty string on render
          // Fix for https://stackoverflow.com/questions/42192346/how-to-reset-reactjs-file-input
          // (Bug when uploading the same file twice)
          value={""}
          type="file"
          onChange={onChange}
          style={{
            color: "transparent",
            opacity: 0,
            position: "absolute",
            height: "100%",
            cursor: "pointer",
          }}
        />
      </Card.Content>
    </Card>
  );
}

const minuteOptions = Array.from(Array(60).keys()).map((m) => ({
  key: m,
  text: `${m} mins`,
  value: m,
}));

const hourOptions = Array.from(Array(24).keys()).map((h) => ({
  key: h,
  text: `${h} hours`,
  value: h,
}));

function Timings({
  timings,
  setTimings,
}: {
  timings: typeof INITIAL_FORM_STATE.timings;
  setTimings: Dispatch<SetStateAction<typeof INITIAL_FORM_STATE.timings>>;
}) {
  function onChange(
    data: DropdownProps,
    key: "prepTime" | "cookTime",
    nestedKey: "hours" | "minutes"
  ) {
    setTimings((t) => ({
      ...t,
      [key]: { ...t[key], [nestedKey]: data.value as number },
    }));
  }
  return (
    <Segment>
      <Header>Timings</Header>
      <Form.Group widths="equal">
        <Form.Select
          value={timings.prepTime.hours}
          onChange={(e, d) => onChange(d, "prepTime", "hours")}
          options={hourOptions}
          label={"Prep Time (approx.)"}
          placeholder="0 hours"
        />
        <Form.Select
          value={timings.prepTime.minutes}
          onChange={(e, d) => onChange(d, "prepTime", "minutes")}
          label={{
            // Hack to keep label spacing without it
            // TODO: we should not render the label on mobile
            children: () => (
              <label style={{ color: "transparent" }}>{"-"}</label>
            ),
          }}
          options={minuteOptions}
          placeholder="0 mins"
        />
        <Form.Select
          value={timings.cookTime.hours}
          onChange={(e, d) => onChange(d, "cookTime", "hours")}
          options={hourOptions}
          label={"Cook Time (approx.)"}
          placeholder="0 hours"
        />
        <Form.Select
          value={timings.cookTime.minutes}
          onChange={(e, d) => onChange(d, "cookTime", "minutes")}
          label={{
            // Hack to keep label spacing without it
            // TODO: we should not render the label on mobile
            children: () => (
              <label style={{ color: "transparent" }}>{"-"}</label>
            ),
          }}
          options={minuteOptions}
          placeholder="0 mins"
        />
      </Form.Group>

      <FastFormInput
        name="extraTime"
        label="Any Extra Time (Optional)"
        placeholder="e.g plus resting"
      />
    </Segment>
  );
}

interface IngredientsProps {
  ingredients: string[];
  setIngredients: Dispatch<SetStateAction<string[]>>;
}

function Ingredients({ ingredients, setIngredients }: IngredientsProps) {
  const [nextIngredient, setNextIngredient] = React.useState("");

  function onAdd() {
    setIngredients([...ingredients, nextIngredient]);
  }

  function onEdit(index: number, newIngredient: string) {
    setIngredients(function (s) {
      const updatedIngredients: string[] = [...ingredients];
      updatedIngredients[index] = newIngredient;
      return updatedIngredients;
    });
  }

  function onDelete(index: number) {
    setIngredients(function (s) {
      const updatedIngredients: string[] = [...ingredients];
      updatedIngredients.splice(index, 1);
      return updatedIngredients;
    });
  }

  return (
    <Form.Field>
      <Segment>
        <Header>Ingredients</Header>
        <p>
          Please use metric if possible (we have a handy conversion guide to
          help)
        </p>
        <p>
          You can split your ingredients into groups, e.g. sauce, filling etc.
        </p>

        {ingredients.map((ingredient, index) => (
          <DraggableIngredientInput
            key={index}
            value={ingredient}
            onChange={(e) => onEdit(index, e.target.value)}
            onDelete={() => onDelete(index)}
          />
        ))}

        <DraggableIngredientInput
          value={nextIngredient}
          onChange={(e) => setNextIngredient(e.target.value)}
        />

        <Button
          primary
          style={{ marginTop: 20 }}
          onClick={(event) => {
            event.preventDefault();
            onAdd();
            setNextIngredient("");
          }}
        >
          Add next ingredient
        </Button>
      </Segment>
    </Form.Field>
  );
}

interface DraggableIngredientInputProps {
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => void;
  onDelete?: () => void;
}

function DraggableIngredientInput({
  value,
  onChange,
  onDelete,
}: DraggableIngredientInputProps) {
  return (
    <Form.Input
      value={value}
      onChange={onChange}
      type="text"
      placeholder="500g chicken breast, diced"
      fluid
      action
      style={{ margin: "10px 0" }}
    >
      <Button
        // @ts-ignore lightgrey is a valid color here
        color="lightgrey"
        icon={"grid layout"}
        onClick={(e) => e.preventDefault()}
      />

      <input />

      {onDelete && (
        <Button
          onClick={(e) => {
            e.preventDefault();
            onDelete();
          }}
          icon={"delete"}
          color={"red"}
          style={{ marginRight: 0, borderRadius: 0, color: "white" }}
        />
      )}
    </Form.Input>
  );
}

interface MethodProps {
  steps: string[];
  setSteps: Dispatch<SetStateAction<string[]>>;
}

function Method({ steps, setSteps }: MethodProps) {
  const [nextStep, setNextStep] = React.useState("");

  function onAdd() {
    setSteps([...steps, nextStep]);
  }

  function onEdit(index: number, newMethod: string) {
    const updatedSteps: string[] = [...steps];
    updatedSteps[index] = newMethod;
    setSteps(updatedSteps);
  }

  function onDelete(index: number) {
    const updatedSteps: string[] = [...steps];
    updatedSteps.splice(index, 1);
    setSteps(updatedSteps);
  }

  return (
    <Form.Field>
      <Segment>
        <Header>Method</Header>
        {steps.map((method, index) => (
          <DraggableMethodTextArea
            key={index}
            value={method}
            onChange={(e) => onEdit(index, e.target.value)}
            onDelete={() => onDelete(index)}
          />
        ))}

        <DraggableMethodTextArea
          value={nextStep}
          onChange={(e) => setNextStep(e.target.value)}
        />

        <Button
          primary
          style={{ marginTop: 20 }}
          onClick={(event) => {
            event.preventDefault();
            onAdd();
            setNextStep("");
          }}
        >
          Add next step
        </Button>
      </Segment>
    </Form.Field>
  );
}

interface DraggableMethodTextAreaProps {
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    data: TextAreaProps
  ) => void;
  onDelete?: () => void;
}

function DraggableMethodTextArea({
  value,
  onChange,
  onDelete,
}: DraggableMethodTextAreaProps) {
  return (
    <div style={{ display: "flex", width: "100%", margin: "10px 0" }}>
      <Button
        // @ts-ignore lightgrey is a valid color here
        color="lightgrey"
        icon={"grid layout"}
        style={{ marginRight: 0, borderRadius: 0 }}
        onClick={(e) => e.preventDefault()}
      />

      <div style={{ flex: 1 }}>
        <Form.TextArea
          value={value}
          onChange={onChange}
          placeholder="First, boil the rice"
          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
        />
      </div>

      {onDelete && (
        <Button
          onClick={(e) => {
            e.preventDefault();
            onDelete();
          }}
          icon={"delete"}
          color={"red"}
          style={{ marginRight: 0, borderRadius: 0, color: "white" }}
        />
      )}
    </div>
  );
}
