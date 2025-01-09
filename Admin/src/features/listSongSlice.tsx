// songSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../App";
import { toast } from "react-toastify";

// Define Song type
interface Song {
  _id: string;
  image: string;
  name: string;
  album: string;
  duration: string;
}

// Define the initial state type
interface SongState {
  songs: Song[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: SongState = {
  songs: [],
  loading: false,
  error: null,
};

// Thunk to fetch songs
export const fetchSongs = createAsyncThunk("songs/fetchSongs", async () => {
  try {
    const response = await axios.get(`${url}/api/song/list`);
    if (response.data.success) {
      return response.data.songs as Song[];
    }
    return [];
  } catch (error) {
    toast.error("Error Occurred while fetching songs");
    throw error;
  }
});

// Thunk to remove song
export const removeSong = createAsyncThunk(
  "songs/removeSong",
  async (id: string, { dispatch }) => {
    try {
      const response = await axios.post(`${url}/api/song/remove`, { id });
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(fetchSongs()); // Re-fetch songs after deletion
      }
    } catch (error) {
      toast.error("Error Occurred while removing song");
      throw error;
    }
  }
);

// Song slice
const listSongSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSongs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSongs.fulfilled, (state, action: PayloadAction<Song[]>) => {
        state.songs = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchSongs.rejected, (state, action) => {
        state.loading = false;
        state.error = "Failed to load songs";
      });
  },
});

export default listSongSlice.reducer;
