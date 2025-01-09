import { FormEvent, useEffect } from "react";
import { assets } from "../assets/assets";

import { useAppDispatch, useAppSelector } from "../hooks";
import {
  addSongAsync,
  loadAlbumDataAsync,
  setImage,
  setSong,
  setName,
  setDesc,
  setAlbum,
} from "../features/songSlice";

const AddSong = () => {
  const dispatch = useAppDispatch();
  const { image, song, name, desc, album, loading, albumData } = useAppSelector(
    (state) => state.song
  );

  const onSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("desc", desc);
    if (image) formData.append("image", image);
    if (song) formData.append("audio", song);
    formData.append("album", album);

    dispatch(addSongAsync(formData));
  };

  useEffect(() => {
    dispatch(loadAlbumDataAsync());
  }, [dispatch]);

  return loading ? (
    <div className="grid place-items-center min-h-[80vh]">
      <div className="w-16 h-16 place-self-center border-4 border-gray-400 border-t-green-800 rounded-full animate-spin"></div>
    </div>
  ) : (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-start gap-8 text-gray-600 mb-10"
    >
      <div className="flex gap-8">
        <div className="flex flex-col gap-4">
          <p>Upload song</p>
          <input
            onChange={(e) =>
              dispatch(setSong(e.target.files ? e.target.files[0] : null))
            }
            type="file"
            id="song"
            accept="audio/*"
            hidden
          />
          <label htmlFor="song">
            <img
              src={song ? assets.upload_added : assets.upload_song}
              alt=""
              className="w-24 cursor-pointer"
            />
          </label>
        </div>
        <div className="flex flex-col gap-4">
          <p>Upload Image</p>
          <input
            onChange={(e) =>
              dispatch(setImage(e.target.files ? e.target.files[0] : null))
            }
            type="file"
            id="image"
            accept="image/*"
            hidden
          />
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt=""
              className="w-24 cursor-pointer"
            />
          </label>
        </div>
      </div>
      <div className="flex flex-col gap-2 ">
        <p>Song name</p>
        <input
          onChange={(e) => dispatch(setName(e.target.value))}
          value={name}
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          placeholder="Type Here"
          required
          type="text"
        />
      </div>
      <div className="flex flex-col gap-2 ">
        <p>Song description</p>
        <input
          onChange={(e) => dispatch(setDesc(e.target.value))}
          value={desc}
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          placeholder="Type Here"
          required
          type="text"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p>Album</p>
        <select
          onChange={(e) => dispatch(setAlbum(e.target.value))}
          value={album}
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[150px]"
        >
          <option value="none">None</option>
          {albumData.map((item, index) => (
            <option key={index} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="text-base bg-black text-white py-2.5 px-14 cursor-pointer"
      >
        ADD
      </button>
    </form>
  );
};

export default AddSong;
