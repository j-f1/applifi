import React from "react";
import { StateContext } from "State";
import { setToken } from "Modules/token";
import { getHashFragment, hideHashFragment } from "Helpers/hash";
import {
  getCurrentUserProfile,
  createPlaylist,
  getPlaylistInfo,
  getPlaylistTracks,
  addTracksToPlaylist
} from "Helpers/spotify";
import MainContainer from "Components/MainContainer";
import Loading from "Components/Loading";
import SomethingWentWrong from "Components/SomethingWentWrong";

import "./Copy.css";

const placeholder = "open.spotify.com/playlist/37i9dQZEV";

export default class Copy extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false,
      errorMsg: "",
      currentUser: "",
      playlistToCopy: "",
      isCopying: false,
      copyCompleted: false,
      newPlaylistUrl: ""
    };
  }

  componentDidMount = async () => {
    const { location } = this.props;

    let hash = getHashFragment(location);

    hideHashFragment();

    if (!hash) {
      this.setState({
        error: true
      });
      return;
    }

    let token = hash.access_token;

    if (!token) {
      this.setState({
        error: true,
        errorMsg: "No access token returned by Spotify. Please try again later."
      });
    }

    // const [ { token }, dispatch ] = this.context;
    let dispatch = this.context[1];

    let userData = await getCurrentUserProfile(token);

    if (userData.error) {
      this.setState({
        error: true,
        errorMsg: JSON.stringify(userData, null, 4)
      });
      return;
    }

    this.setState({
      currentUser: userData
    });

    dispatch(setToken(token));
  };

  onFormSubmit = async e => {
    e.preventDefault();

    setTimeout(async () => {
      let { currentUser, playlistToCopy } = this.state;

      let playlistToCopyArr = playlistToCopy.split("/").filter(Boolean);

      if (playlistToCopyArr.length === 0) {
        alert(
          "Your 'Playlist to copy' link isn't in the right format. Should look like this: " +
            placeholder +
            ""
        );
        return;
      }

      playlistToCopy = playlistToCopyArr.pop();

      const [{ token }] = this.context;

      let tracks = [];
      let data = undefined;
      let next = undefined;
      let index = 0;

      let playlistInfo = await getPlaylistInfo(token, playlistToCopy);

      if (playlistInfo.error) {
        this.setState({
          error: true,
          errorMsg: JSON.stringify(playlistInfo, null, 4)
        });
        return;
      }

      // Create new playlist with the same name
      let newPlaylist = await createPlaylist(
        token,
        currentUser.id,
        playlistInfo.name,
        playlistInfo.description
      );

      if (newPlaylist.error) {
        this.setState({
          error: true,
          errorMsg: JSON.stringify(newPlaylist, null, 4)
        });
        return;
      }

      // Get playlist tracks only allow 100 at a time.
      // The spotify api kindly provides a 'next' property with a url
      // to get the next 100 tracks.
      do {
        data = await getPlaylistTracks(token, playlistToCopy, next);

        if (data.error) {
          this.setState({
            error: true,
            errorMsg: JSON.stringify(data, null, 4)
          });
          return;
        }

        next = data.next;
        tracks[index] = data.items;
        index++;
      } while (next);

      // 'Add tracks to playlists' only allows 100 tracks at a time
      for (let i = 0; i < tracks.length; i++) {
        let tracklist = tracks[i].reduce((result, item) => {
          if (!item.is_local) {
            result.push(item.track.uri);
          }
          return result;
        }, []);

        let returnedData = await addTracksToPlaylist(
          token,
          newPlaylist.id,
          tracklist
        );

        if (returnedData.error) {
          this.setState({
            error: true,
            errorMsg: JSON.stringify(returnedData, null, 4)
          });
          return;
        }
      }

      this.setState({
        isCopying: false,
        copyCompleted: true,
        newPlaylistUrl: newPlaylist.external_urls.spotify
      });
    }, 1000);

    this.setState({
      isCopying: true
    });
  };

  onChangePlaylistToCopy = e => {
    this.setState({
      playlistToCopy: e.target.value
    });
  };

  onReset = () => {
    this.setState({
      playlistToCopy: "",
      isCopying: false,
      copyCompleted: false,
      newPlaylistUrl: ""
    });
  };

  render = () => {
    const {
      error,
      errorMsg,
      currentUser,
      playlistToCopy,
      isCopying,
      copyCompleted,
      newPlaylistUrl
    } = this.state;

    if (error) {
      return <SomethingWentWrong message={errorMsg} />;
    }

    if (!currentUser || isCopying) {
      return <Loading />;
    }

    if (copyCompleted) {
      return (
        <MainContainer>
          <div className="copy-container">
            <div className="copy-again">
              <h1>Playlist created!</h1>
              <p>
                You can find it{" "}
                <a
                  href={newPlaylistUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  here
                </a>
                .
              </p>
              <button onClick={this.onReset} className="btn-link">
                Copy another playlist
              </button>
            </div>
          </div>
        </MainContainer>
      );
    }

    return (
      <MainContainer>
        <div className="copy-container">
          <div className="copy-centered">
            <h1>{`Welcome, ${currentUser.id}`}</h1>
            <form className="copy-form" onSubmit={this.onFormSubmit}>
              <h3>Playlist link</h3>
              <input
                required
                className="copy-form-link-input"
                type="text"
                onChange={this.onChangePlaylistToCopy}
                value={playlistToCopy}
                placeholder={placeholder}
              />
              <input
                className="copy-form-submit btn-link"
                type="submit"
                value="Copy!"
              />
            </form>
          </div>
        </div>
      </MainContainer>
    );
  };
}
Copy.contextType = StateContext;
