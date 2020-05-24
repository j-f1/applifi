import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Pages/Home";
import Copy from "./Pages/Copy";

import "./App.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/copy" exact component={Copy} />
      </Switch>
      <ToastContainer
        className="toast-container"
        bodyClassName="toast-body"
        toastClassName="toast-class"
        progressClassName="toast-progress"
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover={false}
      />
    </Router>
  );
}

export default App;
