import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchAlbums, removeAlbum } from "../features/listAlbumSlice";

const ListAlbum: React.FC = () => {
  const dispatch = useAppDispatch();
  const { albums, loading, error } = useAppSelector((state) => state.albums);

  useEffect(() => {
    dispatch(fetchAlbums());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <p>All Albums List</p>
      <br />
      <div>
        <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Album Color</b>
          <b>Action</b>
        </div>
        {albums.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5"
          >
            <img className="w-12" src={item.image} alt="" />
            <p>{item.name}</p>
            <p>{item.desc}</p>
            <input type="color" value={item.bgColor} readOnly />
            <p
              onClick={() => dispatch(removeAlbum(item._id))}
              className="cursor-pointer"
            >
              X
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListAlbum;
