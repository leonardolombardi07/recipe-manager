import { Form as SUIForm, Button, Segment } from "semantic-ui-react";
import * as Firebase from "~/services/firebase";
import React from "react";
import { useRootData } from "~/root";
import type { ActionArgs } from "@remix-run/node";
import { unstable_parseMultipartFormData as parseMultipartFormData } from "@remix-run/node";
import { createFileUploadHandler } from "~/utils/upload";
import * as Cookies from "~/services/cookies";
import { Form as RemixForm } from "@remix-run/react";
import ImageUploader from "~/components/elements/ImageUploader";

export async function action({ request }: ActionArgs) {
  const formData = await parseMultipartFormData(
    request,
    createFileUploadHandler({
      filter: ({ name, filename }) => Boolean(name === "photoURL" && filename),
      upload: async ({ filename, buffer }) => {
        const uniqueId = (filename || "") + Date.now() + Math.random();
        return await Firebase.uploadImage(`images/users/${uniqueId}`, buffer);
      },
    })
  );

  // The validation happened on the client because
  // at this point we already uploaded an image to the database
  const displayName = String(formData.get("displayName"));

  let photoURL = formData.get("photoURL");
  if (typeof photoURL !== "string") {
    photoURL = "";
  }

  const user = await Cookies.getAuthenticatedUser(request);
  await Firebase.Server.updateUser(user.jwt, {
    displayName,
    photoURL,
  });

  return null;
}

export default function SettingsProfileRoute() {
  const { user } = useRootData();
  const [displayName, setDisplayName] = React.useState(user?.displayName || "");

  const displayError =
    displayName.length < 3
      ? "Display name must have more than 3 characters"
      : null;

  return (
    <Segment basic style={{ padding: 0 }}>
      <p>
        This information will appear on your public profile and can be seen by
        other members.
      </p>

      <SUIForm
        as={RemixForm}
        method="post"
        action={"/settings/profile"}
        encType="multipart/form-data"
      >
        <ImageUploader initialImage={user?.photoURL || ""} name="photoURL" />

        <SUIForm.Group widths="equal">
          <SUIForm.Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            name="displayName"
            label="Display name"
            placeholder="Display name"
            required
            error={displayError}
          />
        </SUIForm.Group>

        <Button disabled={Boolean(displayError)} primary>
          Save changes
        </Button>
      </SUIForm>
    </Segment>
  );
}
