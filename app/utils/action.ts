import { json } from "@remix-run/node";

function badRequest<T>(data: T) {
  return json(data, { status: 400 });
}

export { badRequest };
