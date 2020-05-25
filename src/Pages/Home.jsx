import React from "react";
import MainContainer from "Components/MainContainer";

const authLink =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({
    client_id: process.env.REACT_APP_CLIENT_ID,
    redirect_uri: process.env.REACT_APP_REDIRECT_URI,
    response_type: "token",
  });

export default function Home() {
  return (
    <MainContainer>
      <div className="home-container">
        <h1>Applifi</h1>
        <p>
          Applifi is a tool for copying Spotify playlists to your Apple Music
          account. It uses <a href="https://odesli.co">Odesli</a>’s API to find
          the Apple Music versions of Spotify songs. The API isn’t 100%
          reliable, so you may have to manually add a few songs that it can’t
          find, but those songs will be listed for you once the process
          completes.
        </p>
        <h3>Spotify Access</h3>
        <p>
          This application requires access to an Spotify account. You only need
          to have a free account to use the tool. All authentication is done on
          the client side only; data is not kept in any server or database. You
          don’t need to own a Spotify playlist to copy it, it just has to be
          public.
        </p>
        <h3>Apple Music Access</h3>
        <p>
          This application requires access to your Apple Music account. Just
          like with the Spotify account, all authentication is done on the
          client side only; data is not kept in any server or database. We will
          add the playlist to your account. This will result in all the songs in
          the playlist being added to your library. Unfortunately, there’s no
          way to add only the playlist without adding the songs.
        </p>
        <p style={{ textAlign: "center" }}>
          <a className="btn-link" href={authLink}>
            Sign in with Spotify
          </a>
        </p>
        <h3>Want to contribute?</h3>
        <p>
          You can find the source of this web app{" "}
          <a href="https://github.com/j-f1/applifi">here</a>. You can also
          inform me of any issues there.
        </p>
      </div>
    </MainContainer>
  );
}
