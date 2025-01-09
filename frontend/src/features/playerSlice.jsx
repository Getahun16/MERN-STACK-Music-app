// redux/playerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

// Async Thunks to fetch data from the API
export const fetchSongsData = createAsyncThunk(
  "player/fetchSongsData",
  async () => {
    const response = await axios.get(`${BASE_URL}/api/song/list`);
    return response.data.songs;
  }
);

export const fetchAlbumsData = createAsyncThunk(
  "player/fetchAlbumsData",
  async () => {
    const response = await axios.get(`${BASE_URL}/api/album/list`);
    return response.data.albums;
  }
);

const playerSlice = createSlice({
  name: "player",
  initialState: {
    songsData: [], // List of all songs
    albumsData: [], // List of all albums
    track: null, // Current track being played
    playStatus: false, // Status of playback (true = playing, false = paused)
    time: {
      currentTime: { minute: 0, second: 0 }, // Current playback time
      totalTime: { minute: 0, second: 0 }, // Total duration of the track
    },
    isShuffle: false, // Shuffle state
    isLoop: false, // Loop state
  },
  reducers: {
    // Actions for playback control
    play(state) {
      state.playStatus = true;
    },
    pause(state) {
      state.playStatus = false;
    },
    // Set the current track
    setTrack(state, action) {
      state.track = action.payload;
    },
    // Play the next track in the playlist
    nextTrack(state) {
      const currentIndex = state.songsData.findIndex(
        (song) => song._id === state.track?._id
      );
      if (currentIndex < state.songsData.length - 1) {
        state.track = state.songsData[currentIndex + 1];
      } else if (state.isLoop) {
        state.track = state.songsData[0]; // Loop to the first song
      } else if (state.isShuffle) {
        const randomIndex = Math.floor(Math.random() * state.songsData.length);
        state.track = state.songsData[randomIndex];
      }
    },
    // Play the previous track in the playlist
    previousTrack(state) {
      const currentIndex = state.songsData.findIndex(
        (song) => song._id === state.track?._id
      );
      if (currentIndex > 0) {
        state.track = state.songsData[currentIndex - 1];
      } else if (state.isLoop) {
        state.track = state.songsData[state.songsData.length - 1]; // Loop to the last song
      }
    },
    // Toggle shuffle mode
    toggleShuffle(state) {
      state.isShuffle = !state.isShuffle;
    },
    // Toggle loop mode
    toggleLoop(state) {
      state.isLoop = !state.isLoop;
    },
    // Update the playback time (current and total time)
    setTime(state, action) {
      state.time = action.payload;
    },
    // Set the song to play by ID (useful for selecting a track to play)
    playWithId(state, action) {
      const song = state.songsData.find((item) => item._id === action.payload);
      if (song) {
        state.track = song;
        state.playStatus = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSongsData.fulfilled, (state, action) => {
        state.songsData = action.payload;
        if (!state.track) {
          state.track = action.payload[0]; // Default to the first song if no track is set
        }
      })
      .addCase(fetchAlbumsData.fulfilled, (state, action) => {
        state.albumsData = action.payload;
      });
  },
});

export const {
  play,
  pause,
  setTrack,
  nextTrack,
  previousTrack,
  toggleShuffle,
  toggleLoop,
  setTime,
  playWithId,
} = playerSlice.actions;

export default playerSlice.reducer;
