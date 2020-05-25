# Applifi

![Website](https://img.shields.io/website/https/applifi.netlify.app.svg?style=popout-square)

A Web App to copy Spotify playlists to your Apple Music account.

Currently deployed on [applifi.netlify.app](https://applifi.netlify.app/).

## Contributing

Clone this repository.

Before you can code, you will need a Spotify account and do a bit of setting up.

Go to the [Spotify Developers](https://developer.spotify.com/dashboard) page and log in. Click on `Create a client ID` or `Create an App` (they do the same thing). Fill in the form and submit. You will be redirected to a new page where you can see your new app's Client ID. The Client Secret is not required for this application.

### Setting up the Developer Environment

The Client ID that is passed to the Spotify API should be stored as an environment variable.

After cloning this repo, create a file called `.env.development` in the root directory, containing the following:

```
REACT_APP_CLIENT_ID=INSERT_YOUR_CLIENT_ID_HERE
MUSIC_KIT_PRIVATE_KEY=INSERT_YOUR_PRIVATE_KEY_HERE
```

Replace `INSERT_YOUR_CLIENT_ID_HERE` with your actual client ID.

Note that you must add anywhere you run the server to your Spotify app's Redirect URI whitelist; you can find it in the your app's dashboard page under `Edit Settings`.

Replace `INSERT_YOUR_PRIVATE_KEY_HERE` with your MusicKit Private key which can be created by following the [instructions in the docs](https://developer.apple.com/documentation/applemusicapi/getting_keys_and_creating_tokens). When you follow those steps, you’ll end up with a `[appname]-MusicKit-AuthKey_[id].p8` file which contains a private key similar to this one:

```
-----BEGIN PRIVATE KEY-----
8c71D63X2N77WgOuGCeIEfV1uHyoSNADQEpeEGfNhReKhq/yRWRhF+Cv6rMx/vNd
B5/WLX6ns4k75vT+QO/4PRjUv5VK4xufasf68O/mdSme9sxpxskYI5tVLBzOZu7b
+UoG+EeUVN+51c40WnMU4zbUBd79RdLBRWIq4KP4Fp1nRFfePkO7/C2G0ZAdpbvJ
Z+TA/1F8
-----END PRIVATE KEY-----
```

Remove the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines, and put the key content onto one line, yielding something like this:

```
8c71D63X2N77WgOuGCeIEfV1uHyoSNADQEpeEGfNhReKhq/yRWRhF+Cv6rMx/vNdB5/WLX6ns4k75vT+QO/4PRjUv5VK4xufasf68O/mdSme9sxpxskYI5tVLBzOZu7b+UoG+EeUVN+51c40WnMU4zbUBd79RdLBRWIq4KP4Fp1nRFfePkO7/C2G0ZAdpbvJZ+TA/1F8
```

That is the value you should replace `INSERT_YOUR_PRIVATE_KEY_HERE` with.

Alternatively, if you do not have an Apple Developer account, you can delete `src/lambda/gen-musickit-key.js` and rename `src/lambda/gen-musickit-key-alternate.js` to replace it. Then, go to https://applifi.netlify.app/.netlify/functions/gen-musickit-key and paste the key into the file for local testing. Note that the key expires every 48 hours, so you’ll have to go back to that page to make a new key when that happens.

Now you can start coding. Feel free to create a Pull Request!
