import React from "react";

import "./MainContainer.css";

export default function MainContainer({ children }) {
  return (
    <div className="main-container">
      <div className="children-container">{children}</div>
      <div id="background-div"></div>
    </div>
  );
}
