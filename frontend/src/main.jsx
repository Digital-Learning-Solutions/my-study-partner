import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import "./index.css";
import Quiz from "./Quiz";
import Course from "./Course";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/quiz/*" element={<Quiz />} />
      <Route path="/courses/*" element={<Course />} />
    </Routes>
  </BrowserRouter>
);
