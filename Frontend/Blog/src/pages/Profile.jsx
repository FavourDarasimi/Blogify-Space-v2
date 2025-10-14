import React, { useState, useEffect } from "react";
import { Mail, User, FileText, Save, BookOpen, Eye } from "lucide-react";
import { BeatLoader } from "react-spinners";
import { getProfile, editProfile } from "../endpoint/api";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    username: "",
    bio: "",
    image: "",
  });

  const maxBioLength = 500;

  // 🔹 Fetch profile data once
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const profile = await getProfile();
        setFormData({
          email: profile.user.email || "",
          first_name: profile.user.first_name || "",
          last_name: profile.user.last_name || "",
          username: profile.user.username || "",
          bio: profile.bio || "",
          image: profile.image || "",
        });
        setPreview(profile.image || "");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 🔹 Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Handle file uploads and preview
  const handleFileChange = (e) => {
    const image = e.target.files[0];
    if (image) {
      setFile(image);
      setPreview(URL.createObjectURL(image));
      setFormData((prev) => ({ ...prev, image }));
    }
  };

  // 🔹 Save profile changes
  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      await editProfile({ ...formData, image: file });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaveLoading(false);
      toast.success("Profile Saved Successfully!");
    } catch (error) {
      console.error(error);
      setSaveLoading(false);
      alert("Failed to save profile.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <BeatLoader color="#dc2626" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-4xl space-y-8">
        {/* Profile Picture */}
        <div className="text-center">
          <img
            src={preview || "/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mx-auto mb-3"
          />
          <label className="cursor-pointer text-sm text-red-600 hover:underline">
            Change Image
            <input
              type="file"
              name="image"
              accept="image/*"
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
              className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-600 focus:ring-red-500"
            />
          </div>

          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="flex items-center gap-2 mb-2 font-medium">
                <User className="w-4 h-4 text-primary" /> First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md bg-background focus:ring-2 focus:ring-red-400 resize-none focus:outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 mb-2 font-medium">
                <User className="w-4 h-4 text-primary" /> Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md bg-background focus:ring-2 focus:ring-red-400 resize-none focus:outline-none"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="flex items-center gap-2 mb-2 font-medium">
              <User className="w-4 h-4 text-primary" /> Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md bg-background focus:ring-2 focus:ring-red-400 resize-none focus:outline-none"
            />
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
            className="w-full h-[50px] flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-red-500 text-white font-medium hover:bg-red-500/90 transition-all transform hover:scale-105 active:scale-95 shadow-md"
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
