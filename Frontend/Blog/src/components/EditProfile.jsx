import React, { useEffect, useState } from "react";
import { getProfile, editProfile } from "../endpoint/api";
import { useNavigate } from "react-router-dom";
import cancel from "../assets/icons8-cross-24.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProfile = ({ setShow, setUserProfile }) => {
  const [userProfile, setUserProfiles] = useState([]);
  const [profile, setProfile] = useState({ bio: "", image: "", phone_number: "", location: "" });
  const [message, setMessage] = useState([]);
  const [file, setFile] = useState(null);
  const [changed, setChanged] = useState(false);

  const nav = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();

        setUserProfiles(profile);
        setProfile(profile);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, [changed]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage({ ...message, [name]: value });
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    const { name, files } = e.target;
    setProfile({ ...profile, [name]: files[0] });
    setMessage({ ...message, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await editProfile({ ...profile, ["image"]: file });
      setUserProfile(res.data);
      setChanged(!changed);
      if (res.status === 200) {
        toast.success("Profile Edited Successful");
      }
      setShow(false);
    } catch (error) {
      console.error(error);
      for (var i = 0; i < JSON.stringify(error).length; i++) {
        var err = JSON.stringify(Object.values(error)[i])
          .replace(/[\[\]]/g, "")
          .replace(/"/g, "");
        toast.error(err.charAt(0).toUpperCase() + err.slice(1));
      }
    }
  };
  return (
    <div className="pt-28 flex flex-col items-center lg:justify-center fixed z-1 inset-0  bg-black w-100%  bg-opacity-50 ">
      <form
        encType="multipart/form-data"
        className="lg:w-30% md:w-60% sm:w-90%  bg-white  flex flex-col  h-fit rounded-xmd"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="w-full flex justify-end  pt-3 pr-3 ">
          <img
            src={cancel}
            alt=""
            className="w-6 h-6 cursor-pointer"
            onClick={() => setShow(false)}
          />
        </div>
        <div className="lg:px-10 md:px-10 sm:px-5  pb-5 flex flex-col lg:gap-5 md:gap-2 sm:gap-2">
          <h1 className="font-semibold text-center lg:text-3xl md:text-2xl sm:text-xl">
            Edit Profile
          </h1>
          <div className="flex flex-col">
            <label className="lg:text-16 md:text-15 sm:text-13 font-semibold">Phone Number</label>
            <input
              name="phone_number"
              value={message.phone_number || userProfile.phone_number}
              type="text"
              className="border-1 rounded-xl p-2 lg:h-14 md:h-14 sm:h-12 font-semibold outline-none border-textcol"
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className="flex flex-col">
            <label className="lg:text-16 md:text-15 sm:text-13 font-semibold">Location</label>
            <input
              name="location"
              value={message.location || userProfile.location}
              type="text"
              className="border-1 rounded-xl p-2 lg:h-14 md:h-14 sm:h-12 font-semibold outline-none border-textcol"
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className="flex flex-col">
            <label className="lg:text-16 md:text-15 sm:text-13 font-semibold">Bio</label>
            <textarea
              name="bio"
              value={message.bio || userProfile.bio}
              className="border-1 rounded-xl p-2  h-36 outline-none font-semibold border-textcol"
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className="flex flex-col">
            <label className="lg:text-16 md:text-15 sm:text-13 font-semibold">
              Profile Picture
            </label>
            {userProfile.image && <img src={`${userProfile.image}`} className="w-4 h-4" />}
            <input
              name="image"
              type="file"
              className=" text-sm text-gray-400 font-semibold bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded   "
              onChange={(e) => handleFileChange(e)}
            />
          </div>
          <button
            type="submit"
            className="border-bordercol border-1 py-3 sm:w-full md:w-full rounded-full bg-dark-white lg:w-full text-xssl"
          >
            Edit Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
