/* globals MusicKit: false */
import React, { useState, useRef, useCallback } from "react";
import { getHashFragment } from "Helpers/hash";
import MainContainer from "Components/MainContainer";
import CopyPage from "./Copy";

function useSpotifyToken(location) {
  let tokenRef = useRef(undefined);
  if (tokenRef.current === undefined) {
    let hash = getHashFragment(location);

    // hideHashFragment();

    if (!hash) {
      tokenRef.current = null;
      throw new Error();
    }

    tokenRef.current = hash.access_token;
  }

  return tokenRef.current;
}

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
  const spotifyToken = useSpotifyToken(location);

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
      <h1>Authorize with Apple Music to continue.</h1>
      <button className="btn-link" onClick={auth} disabled={ready === false}>
        Authorize with Apple Music
      </button>
    </MainContainer>
  );
}
