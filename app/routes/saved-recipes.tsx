import { Outlet } from "@remix-run/react";

export default function SavedRoute() {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
