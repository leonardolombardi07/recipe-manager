import type { ActionArgs, UploadHandlerPart } from "@remix-run/node";
import {
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import * as Firebase from "~/services/firebase";
import { getValidatedForm } from "./utils";
import { badRequest } from "~/utils/action";
import * as Cookies from "~/services/cookies";

export async function action(
  { request, params }: ActionArgs,
  type: "create" | "edit"
) {
  const formData = await parseMultipartFormData(request, createUploadHandler());
  const user = await Cookies.getAuthenticatedUser(request);
  const validatedForm = getValidatedForm(formData, user);

  if (validatedForm.hasErrors) {
    return badRequest({
      values: validatedForm.values,
      errors: validatedForm.errors,
      formError: `Form not submitted correctly.`,
    });
  }

  let id: string;

  if (type === "create") {
    id = await Firebase.createRecipe(validatedForm.values);
  } else {
    if (typeof params.recipeId !== "string") {
      throw badRequest(`No valid recipe id to edit the recipe`);
    }
    await Firebase.editRecipe(params.recipeId, validatedForm.values);
    id = params.recipeId;
  }

  await wait(5000);
  return redirect(`/own-recipes/${id}`);
}

function createUploadHandler() {
  return composeUploadHandlers(
    firebaseStorageUploadHandler,
    createMemoryUploadHandler() // Make fields that are not files persist in memory
  );
}

async function firebaseStorageUploadHandler({
  name,
  data,
  contentType,
}: UploadHandlerPart) {
  if (name !== "image") return;

  // This means the image is a string
  if (contentType === undefined) return;

  // Get buffer from data
  const chunks: Uint8Array[] = [];
  for await (const chunk of data) chunks.push(chunk);
  if (chunks.length === 0) return "";
  const buffer = Buffer.concat(chunks);

  const uniqueId = Date.now() + Math.random();
  const imageUrl = await Firebase.uploadImage(
    `images/recipes/${uniqueId}`,
    buffer
  );
  return imageUrl;
}

// TODO: delete later... this is just to test optimist ui
function wait(ms: number) {
  return new Promise((r, reject) => {
    setTimeout(() => {
      r("");
    }, ms);
  });
}
