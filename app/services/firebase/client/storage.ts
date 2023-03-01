import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getServices } from "./app";

const { storage } = getServices();

type Folder = "recipes" | "users";
type RefUrl = `images/${Folder}/${string}`;

async function uploadImage(
  refUrl: RefUrl,
  data: Blob | Uint8Array | ArrayBuffer
) {
  const selectedRef = ref(storage, refUrl);
  await uploadBytes(selectedRef, data);
  const url = await getDownloadURL(selectedRef);
  return url;
}

export { uploadImage };
