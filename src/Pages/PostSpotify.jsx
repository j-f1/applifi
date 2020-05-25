/* globals MusicKit: false */
import React, { useState, useRef, useCallback } from "react";
import MainContainer from "Components/MainContainer";
import CopyPage from "./Copy";

MusicKit.configure({
  developerToken: process.env.REACT_APP_MUSICKIT_KEY,
  declarativeMarkup: false,
  // storefrontId: "us",
  app: {
    name: "Applifi",
    build: "2020.5.24",
  },
});

/** @returns {MusicKit.MusicKitInstance} */
function useMusicKit() {
  const ref = useRef();
  if (!ref.current) {
    ref.current = MusicKit.getInstance();
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
          <button
            className="btn-link"
            onClick={auth}
            disabled={ready === false}
          >
            Sign in with Apple Music
          </button>
        </div>
      </div>
    </MainContainer>
  );
}
