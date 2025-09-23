
import About from "../../components/About";
import CoursesNavbar from "../../components/CourceNavbar";
import Hero from "../../components/Hero";
import TopCourses from "../../components/TopCources";
import WhatWeProvide from "../../components/WhatWeProvide";


export default function CourseLanding() {
  return (
    <div >
        {/* Sections */}
        <Hero />
        <WhatWeProvide />
        <TopCourses />
        <About />
      </div>
  );
}
