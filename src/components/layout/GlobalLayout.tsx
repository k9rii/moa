import { Outlet } from "react-router-dom";
import Header from "./Header";

export function GlobalLayout() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Header 높이(h-16 = 64px) 만큼 padding-top */}
      <main
        className="
          mx-auto
          w-full
          max-w-5xl
          px-4
          pt-20
          pb-10
          md:px-8
          lg:px-10
          md:border-x
          md:border-gray-200
        "
      >
        <Outlet />
      </main>

      <footer className="border-t py-10 text-center text-gray-400">
        © MOA
      </footer>
    </div>
  );
}
