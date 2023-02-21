import { Outlet } from "@remix-run/react";

export default function OwnRoute() {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
