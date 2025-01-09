import { configureStore } from "@reduxjs/toolkit";
import songReducer from "./features/songSlice";
import albumReducer from "./features/albumSlice";
import listAlbumReducer from "./features/listAlbumSlice";
import songsReducer from "./features/listSongSlice";

const store = configureStore({
  reducer: {
    song: songReducer,
    album: albumReducer,
    albums: listAlbumReducer,
    songs: songsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
