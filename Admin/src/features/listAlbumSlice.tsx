import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../App";
import { toast } from "react-toastify";

// Define Album type
interface Album {
  _id: string;
  image: string;
  name: string;
  desc: string;
  bgColor: string;
}

// Define the initial state type
interface AlbumState {
  albums: Album[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AlbumState = {
  albums: [],
  loading: false,
  error: null,
};

// Thunk to fetch albums
export const fetchAlbums = createAsyncThunk("albums/fetchAlbums", async () => {
  try {
    const response = await axios.get(`${url}/api/album/list`);
    if (response.data.success) {
      return response.data.albums as Album[];
    }
    return [];
  } catch (error) {
    toast.error("Error Occurred while fetching albums");
    throw error;
  }
});

export const removeAlbum = createAsyncThunk(
  "albums/removeAlbum",
  async (id: string, { dispatch }) => {
    try {
      const response = await axios.post(`${url}/api/album/remove`, { id });
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(fetchAlbums()); // Re-fetch albums after deletion
      }
    } catch (error) {
      toast.error("Error Occurred while removing album");
      throw error;
    }
  }
);

// Album slice
const listAlbumSlice = createSlice({
  name: "albums",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlbums.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchAlbums.fulfilled,
        (state, action: PayloadAction<Album[]>) => {
          state.albums = action.payload;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(fetchAlbums.rejected, (state, action) => {
        state.loading = false;
        state.error = "Failed to load albums";
      });
  },
});

export default listAlbumSlice.reducer;
