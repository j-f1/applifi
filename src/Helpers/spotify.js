const authEndpoint = "https://accounts.spotify.com/authorize";

const clientId = process.env.REACT_APP_CLIENT_ID;

const redirectUri = process.env.REACT_APP_REDIRECT_URI;

const scopes = [
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
];

const makeid = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const authLink =
  authEndpoint +
  "?client_id=" +
  clientId +
  "&redirect_uri=" +
  redirectUri +
  "&scope=" +
  scopes.join("%20") +
  "&response_type=token&show_dialog=true&state=" +
  makeid(16);

export const getCurrentUserProfile = async (token) => {
  let response = await fetch(`https://api.spotify.com/v1/me`, {
    method: "GET",
    headers: new Headers({
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    }),
  });
  let data = await response.json();
  return data;
};

// export const getCurrentUserPlaylists = async (token) => {
//   let response = await fetch(`https://api.spotify.com/v1/me`, {
//     method: 'GET',
//     headers: new Headers({
//     Accept: "application/json",
//     Authorization: `Bearer ${token}`
//     })
//   });
//   let data = await response.json()
//   return data;
// }

export const createPlaylist = async (token, userId, name, description) => {
  let response = await fetch(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      method: "POST",
      headers: new Headers({
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify({
        name,
        description,
        public: true,
      }),
    }
  );
  let data = await response.json();
  return data;
};

export const getPlaylistInfo = async (token, playlistId) => {
  let url = `https://api.spotify.com/v1/playlists/${playlistId}?fields=fields%3Dhref%2Cname%2Cdescription`;
  let response = await fetch(url, {
    method: "GET",
    headers: new Headers({
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    }),
  });
  let data = await response.json();
  return data;
};

export const getPlaylistTracks = async (token, playlistId, next) => {
  let url = next
    ? next
    : `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  let response = await fetch(url, {
    method: "GET",
    headers: new Headers({
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    }),
  });
  let data = await response.json();
  return data;
};

export const addTracksToPlaylist = async (token, playlistId, tracklist) => {
  let response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      method: "POST",
      headers: new Headers({
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify({
        uris: tracklist,
      }),
    }
  );
  let data = await response.json();
  return data;
};

export const getCurrentPlaybackInfo = async (token) => {
  let response = await fetch("https://api.spotify.com/v1/me/player", {
    method: "GET",
    headers: new Headers({
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    }),
  });

  if (!response.ok) {
    return {
      error: true,
    };
  }

  return response.text().then((text) => {
    return text ? JSON.parse(text) : { error: true };
  });
};
