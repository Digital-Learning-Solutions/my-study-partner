import { useState } from "react";
import CoursesNavbar from "./components/CourceNavbar";
import { Route,Routes } from "react-router-dom";
import CourseLanding from "./pages/Courses/CourceLanding";
import Subjects from "./pages/Courses/Subjects";


export default function LandingPage() {
  const [dark, setDark] = useState(false);

  return (
    <div >
      <CoursesNavbar/>

        
        <main className="flex-1 container mx-auto p-4">
        <Routes>
          <Route index element={<CourseLanding/>} />
          <Route path="category/:subject" element={<Subjects />} />
        </Routes>
        </main>
      </div>
  );
}
