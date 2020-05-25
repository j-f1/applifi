import React, { useState, useCallback } from "react";
import { NavLink } from "react-router-dom";

import "./NavBar.css";

export default function NavBar() {
  const [navbarClassName, setNavbarClassName] = useState("main-nav");

  const toggleResponsiveMenu = useCallback(() => {
    if (navbarClassName === "main-nav") {
      setNavbarClassName("main-nav navbar-mobile");
    } else {
      setNavbarClassName("main-nav");
    }
  }, [navbarClassName]);

  return (
    <nav className="navbar">
      <span className="navbar-toggle" onClick={toggleResponsiveMenu}>
        <i className="material-icons">menu</i>
      </span>
      <NavLink to="/" className="logo">
        applifi
      </NavLink>
      <ul className={navbarClassName}>
        <li>
          <a
            href="https://open.spotify.com"
            className="nav-links"
            target="_blank"
            rel="noopener noreferrer"
          >
            Go To Spotify
          </a>
        </li>
        <li>
          <a
            href="https://github.com/j-f1/applifi"
            className="nav-links"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source
          </a>
        </li>
      </ul>
    </nav>
  );
}
