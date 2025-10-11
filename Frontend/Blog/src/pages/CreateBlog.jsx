import React, { useEffect, useState, useContext } from "react";
import { getCategories, addPost } from "../endpoint/api";
import { Context } from "../context/Context";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import cancel from "../assets/icons8-cross-24.png";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { BeatLoader } from "react-spinners";

export default function CreateBlog() {
  const { setShowCreatePost } = useContext(Context);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // ✅ single
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState();

  const nav = useNavigate();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast.error("Image must be smaller than 1MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (!title.trim()) {
      setLoading(false);
      return toast.error("Please enter a title");
    }
    if (!body.trim()) {
      setLoading(false);
      return toast.error("Please enter content");
    }
    if (!selectedCategory) {
      setLoading(false);
      return toast.error("Please select a category");
    }

    try {
      const res = await addPost(selectedCategory, title, body, imageFile);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoading(false);
      toast.success("Post Created Successfully!");
      nav(`/detail/${res.data.id}`);

      if (res.status === 201) {
      }
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoading(false);
      toast.error("Error creating post");
      console.log(error);
    }
  };

  return (
    <div className="mt-5 flex items-center justify-center  p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 md:p-8"
      >
        {/* Close Button */}

        {/* Header */}
        <h1 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-6">
          Create Post
        </h1>

        {/* Category Selection */}
        <div className="space-y-3 mb-6">
          <label className="text-base font-semibold text-gray-800">
            Category
          </label>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.name)} // ✅ select one
                className={`px-4 py-2 line-clamp-1 rounded-lg text-sm font-medium border-2 transition-all ${
                  selectedCategory === cat.name
                    ? "bg-red-50 text-red-700 border-red-500"
                    : "bg-gray-100 text-gray-700 border-transparent hover:border-red-300"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2 mb-6">
          <label
            htmlFor="title"
            className="text-base font-semibold text-gray-800"
          >
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter an engaging title..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 text-base"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col mb-6">
          <label className="font-semibold mb-1">Content</label>
          <ReactQuill
            value={body}
            onChange={setBody}
            placeholder="Write your story..."
            className="rounded-xl bg-white"
            theme="snow"
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "blockquote"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"],
              ],
            }}
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-2 mb-6">
          <label
            htmlFor="image"
            className="text-base font-semibold text-gray-800"
          >
            Featured Image
          </label>
          {imagePreview ? (
            <div className="relative group rounded-xl overflow-hidden border-2 border-gray-200">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <label
              htmlFor="image"
              className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
            >
              <p className="text-gray-700 font-medium">
                Click to upload an image
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 1MB</p>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setTitle("");
              setBody("");
              setSelectedCategory("");
              setImageFile(null);
              setImagePreview(null);
            }}
            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
          >
            Clear All
          </button>
          <button
            type="submit"
            className=" gap-3 px-6 w-[200px] py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            {loading ? <BeatLoader size={10} /> : "Publish Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
