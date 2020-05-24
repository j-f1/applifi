import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { StateProvider } from "./State";
import tokenReducer from "./Modules/token";

const initialState = {
  token: "",
};

const mainReducer = ({ token }, action) => ({
  token: tokenReducer(token, action),
});

ReactDOM.render(
  <StateProvider initialState={initialState} reducer={mainReducer}>
    <App />
  </StateProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
