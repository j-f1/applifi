import React from "react";
import MainContainer from "Components/MainContainer";
import { authLink } from "Helpers/spotify";

import "./Home.css";

export default function Home() {
  return (
    <MainContainer>
      <div className="home-container">
        <h1>Applifi App</h1>
        <p>
          Applifi is an application that can copy any Spotify playlist to your
          Apple Music account. It uses <a href="https://odesli.co">Odesli</a>’s
          API to find the Apple Music versions of Spotify songs.
        </p>
        <h3>Spotify Access</h3>
        <p>
          This application requires access to an Spotify account. You only need
          to sign up for a free account to use the tool. All authentication is
          done on the client side only; data is not kept in any server or
          database.
        </p>
        <h3>Apple Music Access</h3>
        <p>
          This application requires access to your Apple Music account. Just
          like with the Spotify account, all authentication is done on the
          client side only; data is not kept in any server or database.
        </p>
        <h3>Want to contribute?</h3>
        <p>
          You can find the source of this web app{" "}
          <a href="https://github.com/j-f1/applifi">here</a>. You can also
          inform me of any issues there.
        </p>
        <a className="btn-link" href={authLink}>
          Sign in with Spotify
        </a>
      </div>
    </MainContainer>
  );
}
