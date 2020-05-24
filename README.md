# COPYFI

![Website](https://img.shields.io/website/https/eloquent-williams-1a7fe0.netlify.com.svg?style=popout-square)

A Web App to copy Spotify playlists to your account.

Currently deployed on [eloquent-williams-1a7fe0.netlify.com](https://eloquent-williams-1a7fe0.netlify.com/).

## Contributing

Clone this repository.

Before you can code, you will need a Spotify account and do a bit of setting up.

Go to the [Spotify Developers](https://developer.spotify.com/dashboard) page and log in. Click on `Create a client ID` or `Create an App` (they do the same thing). Fill in the form and submit. You will be redirected to a new page where you can see your new app's Client ID. The Client Secret is not required for this application.

### Setting up the Developer Environment

The Client ID and Redirect URI that is passed to the Spotify API should be stored as environment variables.

After cloning this repo, create a file called `.env.development.local` in the root directory, containing the following:

```js
REACT_APP_CLIENT_ID = INSERT_YOUR_CLIENT_ID_HERE;
REACT_APP_REDIRECT_URI = "http://localhost:3000/copy";
```

Replace `INSERT_YOUR_CLIENT_ID_HERE` with your actual client ID.

Replace the Redirect URI as well to match your local server address, if necessary. Also note that you must add it to your Spotify app's Redirect URI white-list as well; you can find it in the your app's dashboard page under `Edit Settings`.

Now you can start coding. Feel free to create a Pull Request!
