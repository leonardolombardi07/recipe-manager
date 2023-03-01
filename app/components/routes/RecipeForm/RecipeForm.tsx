import {
  Form as RemixForm,
  useActionData,
  useNavigation,
  useNavigate,
  useLocation,
} from "@remix-run/react";
import React from "react";
import type { InputOnChangeData, DropdownProps } from "semantic-ui-react";
import { Form, Button, Segment, Header, Label } from "semantic-ui-react";
import type { Recipe } from "types";
import FastFormInput from "~/components/collections/Form/FastFormInput";
import FastFormTextArea from "~/components/collections/Form/FastFormTextArea";
import type {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
  DropResult,
} from "react-beautiful-dnd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import RecipeRoute from "~/components/routes/RecipeRoute";
import { reorder } from "~/utils/array";
import { getValidatedForm } from "./utils";
import { DIFICULTY_OPTIONS, HOUR_OPTIONS, MINUTE_OPTIONS } from "./constants";
import type { action } from "./action";
import type { FormValues } from "./types";
import { useRootData } from "~/root";
import ImageUploader from "~/components/elements/ImageUploader";
import { Media } from "~/services/media";

interface RecipeFormRouteProps {
  header: string;
  initialValues: FormValues;
  confirmButton: string;
}

export default function RecipeFormRoute({
  header,
  initialValues,
  confirmButton,
}: RecipeFormRouteProps) {
  const navigation = useNavigation();
  const { user } = useRootData();

  if (navigation.formData && user) {
    const validatedForm = getValidatedForm(navigation.formData, user);
    if (!validatedForm.hasErrors) {
      return (
        <RecipeRoute
          recipe={validatedForm.values}
          canDelete={false}
          canEdit={false}
          canGoBack={false}
          canRate={false}
        />
      );
    }
  }

  return (
    <Segment padded style={{ minHeight: "100vh" }}>
      <Header as="h1">{header}</Header>
      <Segment>
        <RecipeForm
          initialValues={initialValues}
          confirmButton={confirmButton}
        />
      </Segment>
    </Segment>
  );
}

interface RecipeFormProps {
  initialValues: FormValues;
  confirmButton: string;
}

function RecipeForm({ initialValues, confirmButton }: RecipeFormProps) {
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  function getDefaultValue<K extends keyof FormValues>(key: K) {
    if (actionData?.values) return actionData.values[key]; // If Javascript disabled
    return initialValues[key];
  }

  function getDefaultImage() {
    const defaultImage = getDefaultValue("image");
    if (typeof defaultImage === "string") return defaultImage;
    if (defaultImage instanceof File) return ""; // this should be impossible
    return defaultImage?.url || null;
  }

  function onCancel(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    navigate(-1);
  }

  return (
    <Form
      as={RemixForm}
      method="post"
      action={pathname}
      encType="multipart/form-data"
    >
      <Form.Group>
        <ImageUploader
          width={300}
          name="image"
          initialImage={getDefaultImage()}
        />

        <div style={{ width: "100%", margin: 10 }}>
          <FastFormInput
            name="title"
            label="Recipe Title (keep it short and descriptive)"
            placeholder="e.g Momma's Apple Pie"
            required={process.env.NODE_ENV === "production"}
            error={actionData?.errors?.title}
            defaultValue={getDefaultValue("title")}
          />

          <FastFormTextArea
            name="description"
            label="Short Intro (10-15 words)"
            placeholder="Tell us about your recipe"
            error={actionData?.errors?.description}
            defaultValue={getDefaultValue("description")}
          />

          <Timings initialTimings={getDefaultValue("timings")} />

          <Form.Group widths={"equal"}>
            <DifficultyInput
              initialDifficulty={getDefaultValue("difficulty")}
            />
            <Servings initialServings={getDefaultValue("servings")} />
          </Form.Group>
        </div>
      </Form.Group>

      <Form.Group widths={"equal"}>
        <Ingredients initialIngredients={getDefaultValue("ingredients")} />
        <Steps initialSteps={getDefaultValue("steps")} />
      </Form.Group>

      <Form.Group inline style={{ marginTop: 30 }}>
        <Button onClick={onCancel} size={"huge"}>
          Cancel
        </Button>

        <Button primary size="huge">
          {confirmButton}
        </Button>
      </Form.Group>
    </Form>
  );
}

function Timings({
  initialTimings,
}: {
  initialTimings: FormValues["timings"];
}) {
  const [timings, setTimings] = React.useState(initialTimings);
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
          options={HOUR_OPTIONS}
          label={"Prep Time (approx.)"}
          placeholder="0 hours"
          error={actionData?.errors?.timings?.prepTime?.hours}
          fluid
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
            children: () => <ResponsiveTimingsLabel />,
          }}
          options={MINUTE_OPTIONS}
          placeholder="0 mins"
          error={actionData?.errors?.timings?.prepTime?.minutes}
          fluid
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
          options={HOUR_OPTIONS}
          label={"Cook Time (approx.)"}
          placeholder="0 hours"
          error={actionData?.errors?.timings?.cookTime?.hours}
          fluid
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
            children: () => <ResponsiveTimingsLabel />,
          }}
          options={MINUTE_OPTIONS}
          placeholder="0 mins"
          error={actionData?.errors?.timings?.cookTime?.minutes}
          fluid
        />
      </Form.Group>

      <FastFormInput
        name="extraTime"
        label="Any Extra Time (Optional)"
        placeholder="e.g plus resting"
        error={actionData?.errors?.timings?.extraTime}
        defaultValue={initialTimings.extraTime}
      />
    </Segment>
  );
}

function ResponsiveTimingsLabel() {
  return (
    <React.Fragment>
      <Media at="mobile">{null}</Media>

      <Media greaterThan="mobile">
        <label style={{ color: "transparent" }}>{"-"}</label>
      </Media>
    </React.Fragment>
  );
}

function DifficultyInput({
  initialDifficulty,
}: {
  initialDifficulty: FormValues["difficulty"];
}) {
  const actionData = useActionData<typeof action>();
  const [difficulty, setDifficulty] = React.useState(initialDifficulty);

  return (
    <React.Fragment>
      <input hidden readOnly name="difficulty" value={difficulty} />
      <Form.Select
        name="difficulty"
        value={difficulty}
        onChange={(_, data) =>
          setDifficulty(data.value as Recipe["difficulty"])
        }
        selection
        options={DIFICULTY_OPTIONS}
        label={"Difficulty level"}
        placeholder="Easy"
        error={actionData?.errors?.difficulty}
      />
    </React.Fragment>
  );
}

function Servings({
  initialServings,
}: {
  initialServings: FormValues["servings"];
}) {
  const actionData = useActionData<typeof action>();
  const [servingsType, setServingsType] = React.useState<
    FormValues["servings"]["type"]
  >(initialServings.type);

  function onChangeServingType(
    event: React.MouseEvent<HTMLButtonElement>,
    type: Recipe["servings"]["type"]
  ) {
    event.preventDefault();
    setServingsType(type);
  }

  return (
    <Form.Field>
      <input hidden readOnly name="servingsType" value={servingsType} />

      <div style={{ display: "flex", flexDirection: "column" }}>
        <Label basic style={{ border: 0, fontSize: 13, paddingLeft: 0 }}>
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
        error={actionData?.errors?.servings?.value}
        defaultValue={initialServings.value}
      />
    </Form.Field>
  );
}

function useSortableSegment<Element extends { focus: () => void }>(
  initialData: string[]
) {
  const [data, setData] = React.useState<string[]>(initialData);
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

function Ingredients({ initialIngredients }: { initialIngredients: string[] }) {
  const {
    state: { data, next },
    actions: { setNext, onAdd, onEdit, onDelete, onDragEnd },
    refs: { nextRef },
  } = useSortableSegment<HTMLInputElement>(initialIngredients);
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
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement> | undefined;
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
            icon={"grid layout"}
            disabled={!dragHandleProps}
            onClick={(e) => e.preventDefault()}
            style={{ backgroundColor: "lightgrey" }}
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

function Steps({ initialSteps }: { initialSteps: string[] }) {
  const {
    state: { data, next },
    actions: { setNext, onAdd, onEdit, onDelete, onDragEnd },
    refs: { nextRef },
  } = useSortableSegment<HTMLTextAreaElement>(initialSteps);
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
  onChange: React.ChangeEventHandler<HTMLTextAreaElement> | undefined;
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
            icon={"grid layout"}
            disabled={!dragHandleProps}
            style={{
              backgroundColor: "lightgrey",
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
