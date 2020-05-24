import React from "react";
import MainContainer from "Components/MainContainer";
import { authLink } from "Helpers/spotify";

import "./Home.css";

export default function Home() {
  return (
    <MainContainer>
      <div className="home-container">
        <h1>Copyfi App</h1>
        <p>
          Copyfi is an application that can copy any Spotify playlist to your
          Spotify account, where you have full control. It's great for
          retrieving playlists from an old or lost account!
        </p>
        <h3>Spotify Access</h3>
        <p>
          This application requires access to your Spotify account. All
          authentication is done on the client side only; data is not kept in
          any server or database.
        </p>
        <h3>Want to contribute?</h3>
        <p>
          You can find the source of this web app{" "}
          <a href="https://github.com/LfxB/copyfi">here</a>. You can also inform
          me of any issues there.
        </p>
        <a className="btn-link" href={authLink}>
          Sign in with Spotify
        </a>
      </div>
    </MainContainer>
  );
}
