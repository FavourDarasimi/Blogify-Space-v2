import React, { useState } from "react";
import { createProfile } from "../endpoint/api";
import cancel from "../assets/icons8-cross-24.png";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateProfile = ({ setShow }) => {
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createProfile(phoneNumber, location, bio, image);
      setShow(false);
      if (res.status === 201) {
        toast.success("Profile Created Successful");
      }
      nav("/profile/");
    } catch (error) {
      for (var i = 0; i < JSON.stringify(error).length; i++) {
        var err = JSON.stringify(Object.values(error)[i])
          .replace(/[\[\]]/g, "")
          .replace(/"/g, "");

        toast.error(err.charAt(0).toUpperCase() + err.slice(1));
      }
    }
  };
  return (
    <div className="pt-28 flex flex-col items-center fixed z-1 inset-0  bg-black w-100%  bg-opacity-50 ">
      <form
        className="lg:w-30% md:w-60% sm:w-90% bg-white  flex flex-col  h-fit rounded-xmd"
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
            Create Profile
          </h1>
          <div className="flex flex-col">
            <label className="lg:text-16 md:text-15 sm:text-13 font-semibold">Phone Number</label>
            <input
              value={phoneNumber}
              type="text"
              className="border-1 rounded-xl p-2 lg:h-14 md:h-14 sm:h-12 font-semibold outline-none border-textcol"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="lg:text-16 md:text-15 sm:text-13 font-semibold">Location</label>
            <input
              value={location}
              type="text"
              className="border-1 rounded-xl p-2 lg:h-14 md:h-14 sm:h-12 font-semibold outline-none border-textcol"
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="lg:text-16 md:text-15 sm:text-13 font-semibold">Bio</label>
            <textarea
              value={bio}
              className="border-1 rounded-xl p-2  h-36 font-semibold outline-none border-textcol"
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="lg:text-16 md:text-15 sm:text-13 font-semibold">
              Profile Picture
            </label>
            <input
              type="file"
              className=" text-sm text-gray-400 font-semibold bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded   "
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <button
            type="submit"
            className="border-bordercol border-1 py-3 sm:w-full md:w-full rounded-full bg-dark-white lg:w-full text-xssl"
          >
            Create Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProfile;
