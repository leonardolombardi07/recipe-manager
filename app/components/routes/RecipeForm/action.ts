import type { ActionArgs } from "@remix-run/node";
import { unstable_parseMultipartFormData as parseMultipartFormData } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import * as Firebase from "~/services/firebase";
import { getValidatedForm } from "./utils";
import { badRequest } from "~/utils/action";
import * as Cookies from "~/services/cookies";
import { createFileUploadHandler } from "~/utils/upload";

export async function action(
  { request, params }: ActionArgs,
  type: "create" | "edit"
) {
  const formData = await parseMultipartFormData(
    request,
    createFileUploadHandler({
      filter: ({ name, filename }) => {
        return Boolean(name === "image" && filename);
      },
      upload: async ({ filename, buffer }) => {
        const uniqueId = (filename || "") + Date.now() + Math.random();
        return Firebase.uploadImage(`images/recipes/${uniqueId}`, buffer);
      },
    })
  );

  const user = await Cookies.getAuthenticatedUser(request);
  const validatedForm = getValidatedForm(formData, user);

  if (validatedForm.hasErrors) {
    return badRequest({
      values: validatedForm.values,
      errors: validatedForm.errors,
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

// TODO: delete later... this is just to test optimist ui
function wait(ms: number) {
  return new Promise((r, reject) => {
    setTimeout(() => {
      r("");
    }, ms);
  });
}
