import React, { useState, useEffect, useContext } from "react";
import { Mail, User, FileText, Save, AlertCircle } from "lucide-react";
import { BeatLoader } from "react-spinners";
import { getProfile, editProfile } from "../endpoint/api";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { MdEdit } from "react-icons/md";
import { Context } from "../context/Context";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { setProfile, profile } = useContext(Context);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    username: "",
    bio: "",
    image: "",
  });

  const maxBioLength = 500;
  const maxFileSize = 5 * 1024 * 1024; // 5MB

  // 🔹 Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const profileData = await getProfile();

        if (!profileData || !profileData.user) {
          throw new Error("Invalid profile data format received.");
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);

        setFormData({
          email: profileData.user.email || "",
          first_name: profileData.user.first_name || "",
          last_name: profileData.user.last_name || "",
          username: profileData.user.username || "",
          bio: profileData.bio || "",
          image: profileData.image || "",
        });

        setPreview(profileData.image || "");
      } catch (error) {
        console.error("Error fetching profile:", error);

        if (error.response) {
          // Backend responded but with an error
          toast.error(
            error.response.data?.message ||
              "Failed to load profile. Please try again."
          );
          setError(
            error.response.data?.message ||
              "Failed to load profile. Please try again later."
          );
        } else if (error.request) {
          // Network issue
          toast.error("Network error: Please check your internet connection.");
          setError("Network error: Unable to connect to the server.");
        } else {
          // Unexpected
          toast.error("An unexpected error occurred.");
          setError("An unexpected error occurred while loading your profile.");
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  // 🔹 Handle input changes with validation
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "username" && value.length > 0) {
      const usernameRegex = /^[a-zA-Z0-9_]*$/;
      if (!usernameRegex.test(value)) {
        toast.warn(
          "Username can only contain letters, numbers, and underscores"
        );
        return;
      }
    }

    if (["first_name", "last_name"].includes(name)) {
      const nameRegex = /^[a-zA-Z\s]*$/;
      if (!nameRegex.test(value)) {
        toast.warn("Name can only contain letters and spaces");
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Handle file uploads safely
  const handleFileChange = (e) => {
    const image = e.target.files[0];
    if (!image) return;

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!validTypes.includes(image.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, GIF, or WebP)");
      e.target.value = "";
      return;
    }

    if (image.size > maxFileSize) {
      toast.error("Image size must be less than 5MB");
      e.target.value = "";
      return;
    }

    try {
      setFile(image);
      const previewUrl = URL.createObjectURL(image);
      setPreview(previewUrl);
      setFormData((prev) => ({ ...prev, image }));
      toast.success("Image selected successfully");
    } catch (err) {
      console.error("Error processing image:", err);
      toast.error("Failed to process image");
      e.target.value = "";
    }
  };

  // 🔹 Save profile changes
  const handleSave = async (e) => {
    e.preventDefault();

    setSaveLoading(true);
    setError(null);

    try {
      const submitData = new FormData();
      submitData.append("first_name", formData.first_name.trim());
      submitData.append("last_name", formData.last_name.trim());
      submitData.append("username", formData.username.trim());
      submitData.append("bio", formData.bio.trim());

      if (file) submitData.append("image", file);

      const response = await editProfile(submitData);

      if (!response || response.error) {
        throw new Error(
          response?.error || "Failed to save profile. Please try again."
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);

      // ✅ Update context and UI
      setProfile((prev) => ({
        ...prev,
        ...formData,
        image: preview,
      }));

      toast.success("Profile updated successfully!");
      setFile(null);
    } catch (error) {
      console.error("Error saving profile:", error);

      if (error.response) {
        toast.error(
          error.response.data?.message || "Failed to update profile."
        );
        setError(error.response.data?.message || "Profile update failed.");
      } else if (error.request) {
        toast.error("Network error: Please check your connection.");
        setError("Network error: Unable to reach the server.");
      } else {
        toast.error(error.message || "Unexpected error occurred.");
        setError(error.message || "Unexpected error occurred while saving.");
      }
    } finally {
      setSaveLoading(false);
    }
  };

  // 🔹 Fallback for initials
  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0)?.toUpperCase() || "";
    const last = lastName?.charAt(0)?.toUpperCase() || "";
    return `${first}${last}`;
  };

  // 🔹 Loading state
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <BeatLoader color="#dc2626" />
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  // 🔹 Error fallback screen
  if (error && !formData.email) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4 px-4">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <h2 className="text-xl font-semibold text-gray-800">
          Unable to Load Profile
        </h2>
        <p className="text-gray-600 text-center max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  // 🔹 Main content
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-4xl space-y-8">
        {/* Profile Picture */}
        <div className="relative w-24 h-24 md:w-40 md:h-40 mx-auto mb-3">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border border-gray-200 shadow-sm"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
                toast.error("Failed to load image");
              }}
            />
          ) : (
            <div className="bg-red-500 w-full h-full text-white font-semibold text-5xl rounded-full flex items-center justify-center">
              <h1>{getInitials(formData.first_name, formData.last_name)}</h1>
            </div>
          )}

          {/* Hidden fallback avatar */}
          <div
            className="bg-red-500 w-full h-full text-white font-semibold text-5xl rounded-full items-center justify-center absolute top-0 left-0"
            style={{ display: "none" }}
          >
            <h1>{getInitials(formData.first_name, formData.last_name)}</h1>
          </div>

          <label className="absolute bottom-1 right-1 bg-gray-500 text-white p-2 rounded-full cursor-pointer hover:bg-gray-600 transition">
            <MdEdit className="w-4 h-4" />
            <input
              type="file"
              name="image"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Profile Form */}
        <form
          onSubmit={handleSave}
          className="bg-card border border-border rounded-2xl p-8 shadow-sm space-y-6"
        >
          {/* Email */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-medium">
              <Mail className="w-4 h-4 text-primary" /> Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-600 focus:ring-red-500 cursor-not-allowed"
            />
          </div>

          {/* First & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="flex items-center gap-2 mb-2 font-medium">
                <User className="w-4 h-4 text-primary" /> First Name
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                maxLength={50}
                className="w-full px-4 py-2 border rounded-md bg-background focus:ring-2 focus:ring-red-400 resize-none focus:outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 mb-2 font-medium">
                <User className="w-4 h-4 text-primary" /> Last Name
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                maxLength={50}
                className="w-full px-4 py-2 border rounded-md bg-background focus:ring-2 focus:ring-red-400 resize-none focus:outline-none"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-medium">
              <User className="w-4 h-4 text-primary" /> Username
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={3}
              maxLength={30}
              className="w-full px-4 py-2 border rounded-md bg-background focus:ring-2 focus:ring-red-400 resize-none focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              3–30 characters, letters, numbers, and underscores only
            </p>
          </div>

          {/* Bio */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-medium">
              <FileText className="w-4 h-4 text-primary" /> Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              maxLength={maxBioLength}
              placeholder="Tell us about yourself..."
              className="w-full px-4 py-2 border rounded-md bg-background focus:ring-2 focus:ring-red-400 resize-none focus:outline-none min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {formData.bio.length}/{maxBioLength} characters
            </p>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saveLoading}
            className="w-full h-[50px] flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-red-500 text-white font-medium hover:bg-red-500/90 transition-all transform hover:scale-105 active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {saveLoading ? (
              <BeatLoader size={10} color="#fff" />
            ) : (
              <>
                <Save className="w-5 h-5" /> Save Changes
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Profile;
