import type { UploadHandler, UploadHandlerPart } from "@remix-run/node";
import {
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
} from "@remix-run/node";

interface FilterArgs {
  name: string;
  filename?: string;
  contentType: string;
}

interface UploadArgs extends FilterArgs {
  buffer: Buffer;
}

interface FileUploadHandlerOptions {
  filter: (args: FilterArgs) => boolean | Promise<boolean>;
  upload: (args: UploadArgs) => Promise<string | null | undefined>;
}

function createFileUploadHandler(
  options: FileUploadHandlerOptions
): UploadHandler {
  return composeUploadHandlers(
    _createFileUploadHandler(options),
    createMemoryUploadHandler() // Make fields that are not files persist in memory
  );
}

function _createFileUploadHandler({
  filter,
  upload,
}: FileUploadHandlerOptions) {
  return async function fileUploadHandler(
    part: UploadHandlerPart
  ): Promise<File | string | null | undefined> {
    if (filter && !(await filter(part))) return undefined;

    const { data } = part;

    const chunks: Uint8Array[] = [];
    for await (const chunk of data) chunks.push(chunk);
    if (chunks.length === 0) return "";
    const buffer = Buffer.concat(chunks);

    const result = await upload({ ...part, buffer });
    return result;
  };
}

export { createFileUploadHandler };
