import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getServices } from "./app";

const { storage } = getServices();

type RefUrl = `images/recipes/${string}`;

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
