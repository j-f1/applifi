import React from "react";
import NavBar from "./NavBar";

import "./MainContainer.css";

export default function MainContainer({ children }) {
  return (
    <div className="main-container">
      <NavBar />
      <div className="children-container">{children}</div>
      <div id="background-div"></div>
    </div>
  );
}
