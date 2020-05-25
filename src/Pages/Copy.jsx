import React, { useState, useCallback, useEffect } from "react";
import MainContainer from "Components/MainContainer";
import useInputState from "Modules/useInput";
import { getPlaylistInfo } from "Helpers/spotify";
import { toast } from "react-toastify";
import tick from "Modules/promiseTick";
import "./Copy.css";

const placeholder = "open.spotify.com/playlist/37i9dQZEV";

async function getAllPlaylistTracks(spotifyToken, playlistID) {
  let tracks = [];
  let next = `https://api.spotify.com/v1/playlists/${playlistID}/tracks?fields=items(track(id))`;
  let index = 0;

  // Get playlist tracks only allow 100 at a time.
  // The spotify api kindly provides a 'next' property with a url
  // to get the next 100 tracks.
  do {
    const data = await fetch(next, {
      method: "GET",
      headers: new Headers({
        Accept: "application/json",
        Authorization: `Bearer ${spotifyToken}`,
      }),
    }).then((res) => res.json());

    if (data.error) {
      console.log(JSON.stringify(data, null, 4));
      toast("Error in getPlaylistTracks. See console for details.");
      return [];
    }

    toast(`Gathered track set ${index + 1}`);

    next = data.next;
    tracks = tracks.concat(data.items);
    index++;
  } while (next);

  return tracks;
}

async function getAppleId(trackId, progress) {
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
        `failed to get apple music data for “${songLinkData.entitiesByUniqueId[firstKey].title}” (spotify track ${trackId}) [${progress}]`
      );
      return Object.assign(
        { error: true },
        songLinkData.entitiesByUniqueId[firstKey]
      );
    } else {
      toast(
        `failed to get apple music data for spotify track ${trackId} [${progress}]`
      );
      return { error: true };
    }
  }
  toast(
    `fetched apple music data for “${
      songLinkData.entitiesByUniqueId[
        songLinkData.linksByPlatform.appleMusic.entityUniqueId
      ].title
    }” [${progress}]`
  );
  return songLinkData.entitiesByUniqueId[
    songLinkData.linksByPlatform.appleMusic.entityUniqueId
  ];
}

async function getAppleIds(tracks) {
  const result = [];
  let i = 0;
  for (const item of tracks) {
    result.push(await getAppleId(item.track.id, `${i + 1}/${tracks.length}`));
    i++;
  }
  return result;
}

/** @param {{ spotifyToken: string, music: MusicKit.MusicKitInstance }} foo */
export default function CopyPage({ spotifyToken, music }) {
  const [playlistLink, onPlaylistLinkChange] = useInputState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const onFormSubmit = useCallback((event) => {
    event.preventDefault();
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

    const addedDescription = `Originally copied from https://open.spotify.com/playlist/${playlistID}`;

    Promise.all([
      getPlaylistInfo(spotifyToken, playlistID).then(
        (pl) => (console.log("playlistInfo", pl), pl)
      ),
      getAllPlaylistTracks(spotifyToken, playlistID)
        .then((tr) => (console.log("tracks", tr), tr))
        .then(getAppleIds),
    ])
      .then(([playlistInfo, tracks]) =>
        fetch("https://api.music.apple.com/v1/me/library/playlists", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${music.developerToken}`,
            "Music-User-Token": music.musicUserToken,
          },
          body: JSON.stringify({
            attributes: {
              name: playlistInfo.name,
              description: playlistInfo.description
                ? `${playlistInfo.description} — ${addedDescription}`
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
        })
          .then((res) => res.json())
          .then((result) => ({ result, tracks }))
      )
      .then(({ result, tracks }) => {
        if (result.errors) {
          throw result.errors;
        } else {
          const [playlist] = result.data;
          setResult({
            name: playlist.attributes.name,
            skipped: tracks.filter((t) => t.error),
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast("Error. See console for details.");
      });

    toast("Retrieved playlist");
  }, [
    music.api,
    music.developerToken,
    music.musicUserToken,
    music.playli,
    playlistLink,
    spotifyToken,
    submitted,
  ]);
  return (
    <MainContainer>
      <div className="copy-container">
        <div className="copy-centered">
          <form className="copy-form" onSubmit={onFormSubmit}>
            <h3>Spotify Playlist link:</h3>
            <input
              required
              className="copy-form-link-input"
              type="text"
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
              <h3>Result</h3>
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
                        <em>{t.title}</em> by {t.artistName}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </>
          ) : (
            <p>This will take a while to finish due to Odesli’s rate limits.</p>
          )}
        </div>
      </div>
    </MainContainer>
  );
}
