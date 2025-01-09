import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../App";

interface AlbumState {
  image: string | null;
  color: string;
  name: string;
  desc: string;
  loading: boolean;
}

const initialState: AlbumState = {
  image: null,
  color: "#121212",
  name: "",
  desc: "",
  loading: false,
};

// Async action for adding an album
export const addAlbumAsync = createAsyncThunk(
  "album/addAlbumAsync",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/api/album/add`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to add album");
    }
  }
);

const albumSlice = createSlice({
  name: "album",
  initialState,
  reducers: {
    setImage: (state, action: PayloadAction<string | null>) => {
      state.image = action.payload;
    },
    setColor: (state, action: PayloadAction<string>) => {
      state.color = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setDesc: (state, action: PayloadAction<string>) => {
      state.desc = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addAlbumAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAlbumAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addAlbumAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setImage, setColor, setName, setDesc, setLoading } =
  albumSlice.actions;
export default albumSlice.reducer;
