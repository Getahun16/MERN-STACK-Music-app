import { FormEvent } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  addAlbumAsync,
  setImage,
  setColor,
  setName,
  setDesc,
  setLoading,
} from "../features/albumSlice";

// Helper function to convert file to base64 string
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file); // Convert file to base64 string
  });
};

const AddAlbum = () => {
  const dispatch = useAppDispatch();
  const { image, color, name, desc, loading } = useAppSelector(
    (state) => state.album
  );

  const onSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("desc", desc);

      // If image exists, append the base64 string to the formData
      if (image) formData.append("image", image); // Sending base64 image string

      formData.append("bgColor", color);

      const response = await dispatch(addAlbumAsync(formData)).unwrap();
      if (response.success) {
        toast.success("Album added");
        dispatch(setDesc(""));
        dispatch(setImage(null)); // Reset image after success
        dispatch(setName(""));
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Error occurred");
    }
    dispatch(setLoading(false));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      try {
        const base64Image = await convertFileToBase64(file); // Convert to base64
        dispatch(setImage(base64Image)); // Store base64 string in Redux
      } catch (error) {
        toast.error("Failed to convert image");
      }
    } else {
      dispatch(setImage(null)); // Reset image if no file is selected
    }
  };

  return loading ? (
    <div className="grid place-items-center min-h-[80vh]">
      <div className="w-16 h-16 place-self-center border-4 border-gray-400 border-t-green-800 rounded-full animate-spin"></div>
    </div>
  ) : (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-start gap-8 text-gray-600 mb-10"
    >
      <div className="flex flex-col gap-4">
        <p>Upload Image</p>
        <input
          onChange={handleImageChange} // Handle image change
          type="file"
          id="image"
          accept="image/*"
          hidden
        />
        <label htmlFor="image">
          <img
            className="w-24 cursor-pointer"
            src={image ? image : assets.upload_area} // Display base64 image or placeholder
            alt="Upload"
          />
        </label>
      </div>
      <div className="flex flex-col gap-2.5">
        <p>Album name</p>
        <input
          onChange={(e) => dispatch(setName(e.target.value))}
          value={name}
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          type="text"
          placeholder="Type Here"
          required
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <p>Album description</p>
        <input
          onChange={(e) => dispatch(setDesc(e.target.value))}
          value={desc}
          className="bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]"
          type="text"
          placeholder="Type Here"
          required
        />
      </div>
      <div className="flex flex-col gap-3">
        <p>Background Color</p>
        <input
          onChange={(e) => dispatch(setColor(e.target.value))}
          value={color}
          type="color"
        />
      </div>
      <button className="text-base bg-black text-white py-2.5 px-14  cursor-pointer">
        ADD
      </button>
    </form>
  );
};

export default AddAlbum;
