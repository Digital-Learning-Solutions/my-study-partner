import React from "react";
import Landing from "./pages/Landing/Landing";
import Home from "./Home";

function Intro() {
  const userId = localStorage.getItem("userId");
  if (userId) {
    return <Landing />;
  } else {
    return <Home />;
  }
}

export default Intro;
