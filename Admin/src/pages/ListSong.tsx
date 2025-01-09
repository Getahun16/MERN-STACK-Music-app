// ListSong.tsx
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchSongs, removeSong } from "../features/listSongSlice";

const ListSong: React.FC = () => {
  const dispatch = useAppDispatch();
  const { songs, loading, error } = useAppSelector((state) => state.songs);

  useEffect(() => {
    dispatch(fetchSongs());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <p>All Songs List</p>
      <br />
      <div>
        <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
          <b>Image</b>
          <b>Name</b>
          <b>Album</b>
          <b>Duration</b>
          <b>Action</b>
        </div>
        {songs.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5"
          >
            <img className="w-12" src={item.image} alt="" />
            <p>{item.name}</p>
            <p>{item.album}</p>
            <p>{item.duration}</p>
            <p
              className="cursor-pointer "
              onClick={() => dispatch(removeSong(item._id))}
            >
              X
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListSong;
