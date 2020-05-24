import React from "react";

import MainContainer from "Components/MainContainer";
import Spinner from "Assets/spinner-200px.svg";

import "./Loading.css";

export default function Loading() {
  return (
    <MainContainer>
      <div className="loading-container">
        <img src={Spinner} alt={"Loading..."} />
      </div>
    </MainContainer>
  );
}
