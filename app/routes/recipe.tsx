import { Outlet } from "@remix-run/react";

export default function RecipeRoute() {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
