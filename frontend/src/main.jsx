import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Layout from "./Layout";
import CourseLanding from "./pages/Courses/CourceLanding";
import Discussion from "./pages/Discussions/Discussion";
import Quiz from "./Quiz";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/*" element={<Layout />} />
    </Routes>
  </BrowserRouter>
);
