import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { url } from "../App";

interface SongState {
  image: File | null;
  song: File | null;
  name: string;
  desc: string;
  album: string;
  loading: boolean;
  albumData: { name: string }[];
}

const initialState: SongState = {
  image: null,
  song: null,
  name: "",
  desc: "",
  album: "none",
  loading: false,
  albumData: [],
};

// Async action to add a song
export const addSongAsync = createAsyncThunk(
  "song/addSongAsync",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/api/song/add`, formData);
      if (response.data.success) {
        toast.success("Song added");
        return response.data;
      } else {
        toast.error("Something went wrong");
        return rejectWithValue("Failed to add song");
      }
    } catch (error) {
      toast.error("Error occurred");
      return rejectWithValue("Error occurred");
    }
  }
);

// Async action to load album data
export const loadAlbumDataAsync = createAsyncThunk(
  "song/loadAlbumDataAsync",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/api/album/list`);
      if (response.data.success) {
        return response.data.albums;
      } else {
        toast.error("Unable to load albums data");
        return rejectWithValue("Failed to load album data");
      }
    } catch (error) {
      toast.error("Error occurred");
      return rejectWithValue("Error occurred");
    }
  }
);

const songSlice = createSlice({
  name: "song",
  initialState,
  reducers: {
    setImage: (state, action: PayloadAction<File | null>) => {
      state.image = action.payload;
    },
    setSong: (state, action: PayloadAction<File | null>) => {
      state.song = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setDesc: (state, action: PayloadAction<string>) => {
      state.desc = action.payload;
    },
    setAlbum: (state, action: PayloadAction<string>) => {
      state.album = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addSongAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addSongAsync.fulfilled, (state) => {
        state.loading = false;
        // Reset form fields after successful submission
        state.name = "";
        state.desc = "";
        state.album = "none";
        state.image = null;
        state.song = null;
      })
      .addCase(addSongAsync.rejected, (state) => {
        state.loading = false;
      })
      .addCase(loadAlbumDataAsync.fulfilled, (state, action) => {
        state.albumData = action.payload;
      });
  },
});

export const { setImage, setSong, setName, setDesc, setAlbum, setLoading } =
  songSlice.actions;
export default songSlice.reducer;
