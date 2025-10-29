// import CoursesNavbar from "./components/CourceNavbar";
import { Route, Routes } from "react-router-dom";
import DiscussionHome from "./pages/Discussions/DiscussionHome";
import DiscussionView from "./pages/Discussions/DiscussionView";
import { DiscussionProvider } from "./context/DiscussionProvider";

export default function Discussion() {
  return (
    <div>
      {/* <CoursesNavbar /> */}

      <main className="flex-1 container mx-auto p-4">
        <DiscussionProvider>
          <Routes>
            <Route index element={<DiscussionHome />} />
            <Route
              path="section/:sectionKey/:id"
              element={<DiscussionView />}
            />
            {/* New route to allow linking directly to a section */}
            <Route path="section/:sectionKey" element={<DiscussionHome />} />
          </Routes>
        </DiscussionProvider>
      </main>
    </div>
  );
}
