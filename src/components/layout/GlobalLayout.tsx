import { Outlet } from "react-router-dom";
import Header from "./Header";

export function GlobalLayout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="pt-16 flex-1">
        {/* 🔥 border는 이 레벨에서 */}
        <div className="mx-auto h-full w-full max-w-4xl md:border-x md:border-gray-200">
          {/* 실제 콘텐츠 */}
          <div className="px-4 py-10 md:px-6 lg:px-10">
            <Outlet />
          </div>
        </div>
      </main>

      <footer className="text-muted-foreground border-t py-10 text-center text-sm">
        © MOA
      </footer>
    </div>
  );
}
