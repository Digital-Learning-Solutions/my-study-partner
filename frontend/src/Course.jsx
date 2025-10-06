// import CoursesNavbar from "./components/CourceNavbar";
import { Route, Routes } from "react-router-dom";
import CourseLanding from "./pages/Courses/CourceLanding";
import Category from "./pages/Courses/Category";
import CourseModulesPage from "./pages/Courses/CourseModulesPage";
import ModuleVideosPage from "./pages/Courses/ModuleVideoPage";

export default function Cource() {
  return (
    <div>
      {/* <CoursesNavbar /> */}

      <main className="flex-1 container mx-auto p-4">
        <Routes>
          <Route index element={<CourseLanding />} />
          <Route path=":subject" element={<Category />} />
          <Route path=":subject/:id" element={<CourseModulesPage />} />
          <Route path=":subject/:id/:title" element={<ModuleVideosPage />} />
        </Routes>
      </main>
    </div>
  );
}
