import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Form as RemixForm,
  useActionData,
  useNavigation,
  useNavigate,
} from "@remix-run/react";
import type {
  ChangeEventHandler,
  Dispatch,
  KeyboardEventHandler,
  SetStateAction,
} from "react";
import React from "react";
import type { InputOnChangeData, DropdownProps } from "semantic-ui-react";
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
import type { Recipe } from "types";
import FastFormInput from "~/components/collections/Form/FastFormInput";
import FastFormTextArea from "~/components/collections/Form/FastFormTextArea";
import type {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
  DropResult,
} from "react-beautiful-dnd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Firebase } from "~/services/firebase";
import RecipePage from "~/components/RecipePage";
import {
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
} from "~/utils/validation";
import { someError } from "~/utils/errors";
import { badRequest } from "~/utils/action";
import { reorder } from "~/utils/array";

export async function action({ request }: ActionArgs) {
  const form = convertFormDataToObj(await request.formData());
  const { hasErrors, errors } = validateForm(form);
  if (hasErrors) {
    return badRequest({
      fields: form,
      errors,
      formError: `Form not submitted correctly.`,
    });
  }

  const createdRecipe = await Firebase.createRecipe(form as Recipe);
  return redirect(`/recipe/${createdRecipe.id}`);
}

export default function WithOptimisticUI() {
  const navigation = useNavigation();
  if (navigation.formData) {
    const form = convertFormDataToObj(navigation.formData);
    const { hasErrors } = validateForm(form);
    if (!hasErrors) {
      return <RecipePage recipe={form as Recipe} />;
    }
  }

  return (
    <Segment padded style={{ minHeight: "100vh" }}>
      <Header as="h1">Create a Recipe</Header>
      <Segment>
        <CreateRecipeForm />
      </Segment>
    </Segment>
  );
}

const INITIAL_FORM_STATE: Recipe = {
  title: "",
  description: "",
  image: { url: "" },
  timings: {
    prepTime: { hours: 0, minutes: 0 },
    cookTime: { hours: 0, minutes: 0 },
    extraTime: "",
  },
  difficulty: "easy" as "easy" | "moderate" | "hard",
  ingredients: [] as string[],
  steps: [] as string[],
  servings: {
    type: "serves" as "serves" | "makes",
    value: "",
  },
};

function validateForm(form: ReturnType<typeof convertFormDataToObj>) {
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
  };

  return { errors, hasErrors: someError(errors) };
}

const difficultyOptions: ({ [key: string]: string } & {
  value: Recipe["difficulty"];
})[] = [
  { key: "easy", value: "easy", text: "Easy" },
  { key: "moderate", value: "moderate", text: "Moderate" },
  { key: "hard", value: "hard", text: "Hard" },
];

function CreateRecipeForm() {
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = React.useState(INITIAL_FORM_STATE.image.url);
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
    <Form as={RemixForm} method="post" action="/own-recipes/create">
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
            required={process.env.NODE_ENV === "production"}
            error={actionData?.errors.title}
          />

          <FastFormTextArea
            name="description"
            label="Short Intro (10-15 words)"
            placeholder="Tell us about your recipe"
            error={actionData?.errors.description}
          />

          <Timings timings={timings} setTimings={setTimings} />

          <Form.Group widths={"equal"}>
            <input hidden readOnly name="difficulty" value={difficulty} />
            <Form.Select
              name="difficulty"
              value={difficulty}
              onChange={(_, data) =>
                setDifficulty(data.value as Recipe["difficulty"])
              }
              selection
              options={difficultyOptions}
              label={"Difficulty level"}
              placeholder="Easy"
              error={actionData?.errors.difficulty}
            />

            <Form.Field>
              <input hidden readOnly name="servingsType" value={servingsType} />

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
                required={process.env.NODE_ENV === "production"}
                error={actionData?.errors.servings.value}
              />
            </Form.Field>
          </Form.Group>
        </div>
      </Form.Group>

      <Form.Group widths={"equal"}>
        <Ingredients />
        <Steps />
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
              // type="button" fixes a onClick trigger when pressing enter key on different input
              // See: https://stackoverflow.com/questions/12325066/button-click-event-fires-when-pressing-enter-key-in-different-input-no-forms
              type="button"
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

        <input hidden readOnly name="imageUrl" value={value} />

        <input
          // value={""} Resets the input the empty string on render
          // Fix for https://stackoverflow.com/questions/42192346/how-to-reset-reactjs-file-input
          // (Bug when uploading the same file twice)
          value=""
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
  const actionData = useActionData<typeof action>();

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
        <input
          hidden
          readOnly
          name="prepTimeHours"
          value={timings.prepTime.hours}
        />
        <Form.Select
          value={timings.prepTime.hours}
          onChange={(e, d) => onChange(d, "prepTime", "hours")}
          options={hourOptions}
          label={"Prep Time (approx.)"}
          placeholder="0 hours"
          error={actionData?.errors.timings.prepTime.hours}
        />

        <input
          hidden
          readOnly
          name="prepTimeMinutes"
          value={timings.prepTime.minutes}
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
          error={actionData?.errors.timings.prepTime.minutes}
        />

        <input
          hidden
          readOnly
          name="cookTimeHours"
          value={timings.cookTime.hours}
        />
        <Form.Select
          value={timings.cookTime.hours}
          onChange={(e, d) => onChange(d, "cookTime", "hours")}
          options={hourOptions}
          label={"Cook Time (approx.)"}
          placeholder="0 hours"
          error={actionData?.errors.timings.cookTime.hours}
        />

        <input
          hidden
          readOnly
          name="cookTimeMinutes"
          value={timings.cookTime.minutes}
        />
        <Form.Select
          value={timings.cookTime.minutes}
          onChange={(e, d) => onChange(d, "cookTime", "minutes")}
          label={{
            // Hack to keep label spacing without it
            // TODO: we should not even render the label on mobile
            children: () => (
              <label style={{ color: "transparent" }}>{"-"}</label>
            ),
          }}
          options={minuteOptions}
          placeholder="0 mins"
          error={actionData?.errors.timings.cookTime.minutes}
        />
      </Form.Group>

      <FastFormInput
        name="extraTime"
        label="Any Extra Time (Optional)"
        placeholder="e.g plus resting"
        error={actionData?.errors.timings.extraTime}
      />
    </Segment>
  );
}

function useSortableSegment<Element extends { focus: () => void }>() {
  const [data, setData] = React.useState<string[]>([]);
  const [next, setNext] = React.useState("");
  const nextRef = React.useRef<Element>(null);

  function onAdd() {
    setData([...data, next]);
    setNext("");
    if (nextRef.current?.focus) {
      nextRef.current?.focus();
    }
  }

  function onEdit(index: number, edited: string) {
    const updatedData: string[] = [...data];
    updatedData[index] = edited;
    setData(updatedData);
  }

  function onDelete(index: number) {
    const updatedData: string[] = [...data];
    updatedData.splice(index, 1);
    setData(updatedData);
  }

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    const reordered = reorder(
      data,
      result.source.index,
      result.destination.index
    );
    setData(reordered);
  }

  const dataWithId = data.map((item) => ({ id: item, content: item }));

  return {
    state: { data: dataWithId, next },
    actions: { setNext, onAdd, onEdit, onDelete, onDragEnd },
    refs: { nextRef },
  };
}

const DISABLE_DRAGGING = true;

function Ingredients() {
  const {
    state: { data, next },
    actions: { setNext, onAdd, onEdit, onDelete, onDragEnd },
    refs: { nextRef },
  } = useSortableSegment<HTMLInputElement>();
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

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {data.map((ingredient, index) => (
                  <Draggable
                    key={index}
                    draggableId={ingredient.id}
                    index={index}
                    isDragDisabled={DISABLE_DRAGGING}
                  >
                    {(provided, snapshot) => (
                      <DraggableIngredientInput
                        ref={provided.innerRef}
                        value={ingredient.content}
                        onChange={(e) => onEdit(index, e.target.value)}
                        onDelete={() => onDelete(index)}
                        draggableProps={provided.draggableProps}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <DraggableIngredientInput
          inputRef={nextRef}
          value={next}
          onChange={(e) => setNext(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onAdd();
          }}
        />

        <Button
          primary
          style={{ marginTop: 20 }}
          onClick={(event) => {
            event.preventDefault();
            onAdd();
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
  draggableProps?: DraggableProvidedDraggableProps;
  dragHandleProps?: DraggableProvidedDragHandleProps | null | undefined;
  inputRef?: React.RefObject<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement> | undefined;
}

const DraggableIngredientInput = React.forwardRef<
  HTMLDivElement,
  DraggableIngredientInputProps
>(
  (
    {
      value,
      onChange,
      onDelete,
      draggableProps,
      dragHandleProps,
      inputRef,
      onKeyDown,
    },
    ref
  ) => {
    return (
      <div
        {...draggableProps}
        style={{
          ...draggableProps?.style,
          // TODO: BUG - doesn't work on tablet or mobile
          // For some reasons the initial draggable dimensions are messed up
          // This is related to the the fact that the Sidebar its not fixed
          // and page content is shifted to the right
          left: 60, // this is a hack to work on desktop
        }}
        ref={ref}
      >
        <Form.Input
          name="ingredient"
          value={value}
          onChange={onChange}
          type="text"
          placeholder="500g chicken breast, diced"
          fluid
          action
          style={{ margin: "10px 0" }}
          onKeyDown={onKeyDown}
        >
          <Button
            as={"div"}
            // @ts-ignore lightgrey is a valid color here
            color={"lightgrey"}
            icon={"grid layout"}
            disabled={!dragHandleProps}
            onClick={(e) => e.preventDefault()}
            {...dragHandleProps}
          />

          <input ref={inputRef} />

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
      </div>
    );
  }
);

function Steps() {
  const {
    state: { data, next },
    actions: { setNext, onAdd, onEdit, onDelete, onDragEnd },
    refs: { nextRef },
  } = useSortableSegment<HTMLTextAreaElement>();
  return (
    <Form.Field>
      <Segment>
        <Header>Method</Header>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {data.map((step, index) => (
                  <Draggable
                    isDragDisabled={DISABLE_DRAGGING}
                    key={index}
                    draggableId={step.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <DraggableStepTextArea
                        ref={provided.innerRef}
                        value={step.content}
                        onChange={(e) => onEdit(index, e.target.value)}
                        onDelete={() => onDelete(index)}
                        draggableProps={provided.draggableProps}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <DraggableStepTextArea
          textareaRef={nextRef}
          value={next}
          onChange={(e) => setNext(e.target.value)}
        />

        <Button
          primary
          style={{ marginTop: 20 }}
          onClick={(event) => {
            event.preventDefault();
            onAdd();
          }}
        >
          Add next step
        </Button>
      </Segment>
    </Form.Field>
  );
}

interface DraggableStepTextAreaProps {
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement> | undefined;
  onDelete?: () => void;
  draggableProps?: DraggableProvidedDraggableProps;
  dragHandleProps?: DraggableProvidedDragHandleProps | null | undefined;
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
}

const DraggableStepTextArea = React.forwardRef<
  HTMLDivElement,
  DraggableStepTextAreaProps
>(
  (
    { value, onChange, onDelete, draggableProps, dragHandleProps, textareaRef },
    ref
  ) => {
    return (
      <div
        {...draggableProps}
        style={{
          ...draggableProps?.style,
          // TODO: BUG - doesn't work on tablet or mobile
          // For some reasons the initial draggable dimensions are messed up
          // This is related to the the fact that the Sidebar its not fixed
          // and page content is shifted to the right
          left: 820, // this is a hack to work on desktop
        }}
        ref={ref}
      >
        <div style={{ display: "flex", width: "100%", margin: "10px 0" }}>
          <Button
            as={"div"}
            // @ts-ignore lightgrey is a valid color here
            color="lightgrey"
            icon={"grid layout"}
            disabled={!dragHandleProps}
            style={{
              marginRight: 0,
              borderRadius: 0,
              display: "grid",
              placeItems: "center",
            }}
            onClick={(e) => e.preventDefault()}
            {...dragHandleProps}
          />

          <div style={{ flex: 1 }}>
            <Form.Field>
              <textarea
                name="step"
                placeholder="First, boil the rice"
                value={value}
                onChange={onChange}
                ref={textareaRef}
                rows={3}
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              />
            </Form.Field>
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
      </div>
    );
  }
);

function convertFormDataToObj(formData: FormData) {
  return {
    title: formData.get("title"),
    description: formData.get("description"),
    image: { url: formData.get("imageUrl") },
    timings: {
      prepTime: {
        hours: formData.get("prepTimeHours") as any,
        minutes: formData.get("prepTimeMinutes") as any,
      },
      cookTime: {
        hours: formData.get("cookTimeHours") as any,
        minutes: formData.get("cookTimeMinutes") as any,
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
