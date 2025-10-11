import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Layout from "./Layout";
import { StoredProvider } from "./context/StoredProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StoredProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Layout />} />
      </Routes>
    </BrowserRouter>
  </StoredProvider>
);
