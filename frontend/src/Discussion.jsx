// import CoursesNavbar from "./components/CourceNavbar";
import { Route, Routes } from "react-router-dom";
import SectionPage from "./pages/Discussions/SectionPage";
import DiscussionPage from "./pages/Discussions/DiscussionPage";

export default function Discussion() {
  return (
    <div>
      {/* <CoursesNavbar /> */}

      <main className="flex-1 container mx-auto p-4">
        <Routes>
          <Route index element={<DiscussionPage />} />
          <Route path="section/:name" element={<SectionPage />} />
        </Routes>
      </main>
    </div>
  );
}
