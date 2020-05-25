/* globals MusicKit: false */
import React, { useState, useRef, useCallback } from "react";
import MainContainer from "Components/MainContainer";
import CopyPage from "./Copy";

let configured = false;

/** @returns {MusicKit.MusicKitInstance} */
function useMusicKit() {
  const ref = useRef();
  const [, forceUpdate] = useState();
  if (!ref.current) {
    const init = () => {
      ref.current = MusicKit.getInstance();
      forceUpdate(Math.random());
    };
    if (configured === true) {
      init();
    } else if (configured) {
      configured.then(init);
    } else {
      configured = fetch("/.netlify/functions/gen-musickit-key")
        .then((res) => res.text())
        .then((developerToken) => {
          MusicKit.configure({
            developerToken,
            declarativeMarkup: false,
            storefrontId: "us",
            app: {
              name: "Applifi",
              build: "2020.5.25",
            },
          });

          configured = true;
          init();
        });
    }
  }
  return ref.current;
}

export default function PostSpotify({ location }) {
  const spotifyToken = new URLSearchParams(location.hash.slice(1)).get(
    "access_token"
  );

  const music = useMusicKit();
  const [ready, setReady] = useState(null);
  const auth = useCallback(() => {
    setReady(false);
    music
      .authorize()
      .then(() => setReady(true))
      .catch((err) => {
        debugger;
      });
  }, [music]);
  return ready ? (
    <CopyPage spotifyToken={spotifyToken} music={music} />
  ) : (
    <MainContainer>
      <div className="app-screen">
        <div style={{ textAlign: "center" }}>
          <h1>Sign in with Apple Music to continue.</h1>
          <p>
            This application requires access to your Apple Music account. Just
            like with the Spotify account, all authentication is done on the
            client side only; data is not kept in any server or database. We
            will add the playlist to your account. This will result in all the
            songs in the playlist being added to your library. Unfortunately,
            there’s no way to add only the playlist without adding the songs.
          </p>
          <button disabled={!music} className="btn-link" onClick={auth}>
            Sign in with Apple Music
          </button>
        </div>
      </div>
    </MainContainer>
  );
}
