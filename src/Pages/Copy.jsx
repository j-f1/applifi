/* globals MusicKit: false */
import React, { useState, useCallback, useEffect } from "react";
import MainContainer from "Components/MainContainer";
import useInputState from "Modules/useInput";
import { toast } from "react-toastify";
import tick from "Modules/promiseTick";
import "./Copy.css";

const placeholder = "open.spotify.com/playlist/37i9dQZEV";
const spotifyHeaders = (token) => ({
  Accept: "application/json",
  Authorization: `Bearer ${token}`,
});

async function getPlaylistInfo(token, playlistId) {
  let url = `https://api.spotify.com/v1/playlists/${playlistId}?fields=href%2Cname%2Cdescription`;
  let response = await fetch(url, {
    method: "GET",
    headers: spotifyHeaders(token),
  });
  let data = await response.json();
  return data;
}

async function getAllPlaylistTracks(token, playlistID, setProgress) {
  let tracks = [];
  let url = `https://api.spotify.com/v1/playlists/${playlistID}/tracks?fields=items(track(id,name,artists(name)))`;

  // Get playlist tracks only allow 100 at a time.
  // The spotify api kindly provides a 'next' property with a url
  // to get the next 100 tracks.
  do {
    const data = await fetch(url, {
      method: "GET",
      headers: spotifyHeaders(token),
    }).then((res) => res.json());

    if (data.error) {
      console.log(data);
      toast("Error in getPlaylistTracks. See console for details.");
      return [];
    }

    setProgress({
      description: `Gathered tracks ${tracks.length}–${
        tracks.length + data.items.length
      }`,
    });

    url = data.next;
    tracks = tracks.concat(data.items);
  } while (url);

  return tracks;
}

async function getAppleMeta(trackId) {
  console.log("fetching", trackId);
  await tick(60e3 / 8); // don’t overload the songlink API, which has a rate limit of 10 reqs per minute
  const songLinkData = await fetch(
    `https://api.song.link/v1-alpha.1/links?platform=spotify&type=song&id=${trackId}`
  ).then((res) => res.json());
  console.log(songLinkData);
  if (!songLinkData.linksByPlatform.appleMusic) {
    const firstKey = Object.keys(songLinkData.entitiesByUniqueId)[0];
    if (firstKey) {
      toast(
        `failed to get apple music data for “${songLinkData.entitiesByUniqueId[firstKey].title}” (spotify track ${trackId})`
      );
      return Object.assign(
        { error: true },
        songLinkData.entitiesByUniqueId[firstKey]
      );
    } else {
      toast(`failed to get apple music data for spotify track ${trackId}`);
      return { error: true };
    }
  }
  return songLinkData.entitiesByUniqueId[
    songLinkData.linksByPlatform.appleMusic.entityUniqueId
  ];
}

async function getAppleIds(tracks, setProgress) {
  const result = [];
  let i = 0;
  for (const item of tracks) {
    setProgress({
      description: `Converting “${item.track.name}” by ${item.track.artists
        .map((r) => r.name)
        .join(", ")}…`,
      complete: i,
      max: tracks.length,
    });
    const track = await getAppleMeta(item.track.id);
    result.push(track);
    i++;
  }
  return result;
}

async function convertSongs(spotifyToken, playlistID, setProgress) {
  const addedDescription = `Originally copied from https://open.spotify.com/playlist/${playlistID}`;
  setProgress({ description: "Fetching playlist metadata" });
  const playlist = await getPlaylistInfo(spotifyToken, playlistID);
  setProgress({ description: "Fetching playlist contents" });
  const spotifyTracks = await getAllPlaylistTracks(
    spotifyToken,
    playlistID,
    setProgress
  );
  console.log({ playlist, spotifyTracks });

  const tracks = await getAppleIds(spotifyTracks, setProgress);
  const result = await fetch(
    "https://api.music.apple.com/v1/me/library/playlists",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MusicKit.getInstance().developerToken}`,
        "Music-User-Token": MusicKit.getInstance().musicUserToken,
      },
      body: JSON.stringify({
        attributes: {
          name: playlist.name,
          description: playlist.description
            ? `${playlist.description} — ${addedDescription}`
            : addedDescription,
        },
        relationships: {
          tracks: {
            data: tracks
              .filter((t) => !t.error)
              .map((track) => ({ id: track.id, type: "songs" })),
          },
        },
      }),
    }
  ).then((res) => res.json());
  if (result.errors) {
    throw result.errors;
  } else {
    const [playlist] = result.data;
    return {
      name: playlist.attributes.name,
      skipped: tracks
        .map((t, i) => Object.assign(t, { i }))
        .filter((t) => t.error),
    };
  }
}

/** @param {{ spotifyToken: string, music: MusicKit.MusicKitInstance }} foo */
export default function CopyPage({ spotifyToken, music }) {
  const [playlistLink, onPlaylistLinkChange] = useInputState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(null);
  const onFormSubmit = useCallback((event) => {
    event.preventDefault();
    setProgress(null);
    setResult(null);
    setSubmitted(true);
  }, []);
  useEffect(() => {
    if (!submitted) return;
    let playlistLinkSegments = playlistLink.split("/").filter(Boolean);

    if (playlistLinkSegments.length === 0) {
      alert(
        "Your Playlist link isn't in the right format. Should look like this: " +
          placeholder
      );
      return;
    }

    // Split on ? in case there are query params in the pasted url
    const playlistID = playlistLinkSegments.pop().split("?")[0];

    convertSongs(spotifyToken, playlistID, setProgress)
      .then(setResult)
      .catch((error) => {
        console.log(error);
        toast("Error. See console for details.");
      })
      .finally(() => setProgress(null));
  }, [playlistLink, spotifyToken, submitted]);
  return (
    <MainContainer>
      <div className="app-screen">
        <div>
          <form className="copy-form" onSubmit={onFormSubmit}>
            <h3>Spotify Playlist link:</h3>
            <input
              autoFocus
              required
              className="copy-form-link-input"
              type="url"
              onChange={(event) => {
                setSubmitted(false);
                onPlaylistLinkChange(event);
              }}
              value={playlistLink}
              placeholder={placeholder}
            />
            <input
              className="copy-form-submit btn-link"
              type="submit"
              value="Copy!"
            />
          </form>
          {result ? (
            <>
              <h3>Copy complete!</h3>
              <p>
                You will be able to view the playlist “{result.name}” in Music
                on your device shortly.
              </p>
              {result.skipped.length ? (
                <>
                  <p>Tracks that could not be found on Apple Music</p>
                  <ul>
                    {result.skipped.map((t) => (
                      <li>
                        <em>{t.title}</em> by {t.artistName} (at position{" "}
                        {t.i + 1})
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </>
          ) : (
            <>
              <p>
                This will take a while to finish due to Odesli’s rate limits.
                Leave this page open while the process completes.
              </p>
              {progress && (
                <p style={{ textAlign: "center" }}>{progress.description}</p>
              )}
              {progress && (
                <p style={{ textAlign: "center" }}>
                  <progress
                    style={{ width: "50%" }}
                    max={progress.max}
                    value={progress.complete}
                  />
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </MainContainer>
  );
}
