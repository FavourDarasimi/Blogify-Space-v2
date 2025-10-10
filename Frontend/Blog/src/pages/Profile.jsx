import React from "react";
import { useEffect, useState } from "react";
import { getProfile } from "../endpoint/api";
import { IoIosMail, IoIosCall } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import EditProfile from "../components/EditProfile";
import CreateProfile from "../components/CreateProfile";
import { CiEdit } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";

const Profile = () => {
  const [userProfile, setUserProfile] = useState([]);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        setUserProfile(profile);
      } catch (error) {}
    };
    fetchProfile();
  }, [show]);

  const name = (username) => {
    var newName = username.replace(/ /g, "").toLowerCase();
    return newName;
  };
  return (
    <div className="pt-32 flex flex-col items-center">
      {show ? (
        userProfile ? (
          <EditProfile setShow={setShow} setUserProfile={setUserProfile} />
        ) : (
          <CreateProfile setShow={setShow} />
        )
      ) : (
        ""
      )}
      <div className=" bg-dark-white lg:w-50% md:w-70% sm:w-90%  h-fit lg:p-10 md:p-10 sm:p-5 rounded-xl gap-y-3">
        <div className="flex justify-between">
          <div className="flex items-center  gap-3">
            {userProfile.image ? (
              <img
                src={`${userProfile.image}`}
                alt={userProfile.user}
                className="lg:w-44 lg:h-44 md:w-44 md:h-44 sm:w-24 sm:h-24 rounded-full lg:ml-3"
              />
            ) : (
              <FaUserCircle className="lg:w-44 lg:h-44 md:w-44 md:h-44 sm:w-24 sm:h-24 rounded-full lg:ml-3" />
            )}
            <div className="flex flex-col gap-2">
              <p className="lg:text-3xl md:text-3xl sm:text-18 font-semibold">
                {userProfile.username}
              </p>
              {userProfile.username ? (
                <p className="text-neutral-400 lg:text-18 md:text-18 sm:text-14">
                  @{name(userProfile.username)}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div>
            {userProfile ? (
              <button
                onClick={() => setShow(true)}
                className="flex items-center gap-1 bg-blue-600 border-bordercol border-1 p-2 rounded-md text-white lg:text-15 md:text-15 sm:text-xs"
              >
                <CiEdit className="w-5 h-5" />
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => setShow(true)}
                className="flex items-center gap-1 bg-blue-600 border-bordercol border-1 p-2 rounded-md text-white lg:text-15 md:text-15 sm:text-xs"
              >
                <FaUserCircle className="w-5 h-5" />
                Create Profile
              </button>
            )}
          </div>
        </div>

        <div className="">
          <p className="lg:text-2xl md:text-2xl sm:text-17 font-semibold pt-5">About Me</p>
          <p className="lg:text-16 md:text-16 sm:text-14">{userProfile.bio}</p>
        </div>

        <div>
          <p className="lg:text-2xl md:text-2xl sm:text-17 font-semibold pt-5 ">
            Contact Information
          </p>
          <div className=" flex flex-col gap-y-4 pt-3">
            <div className="flex gap-x-3 ">
              <IoIosMail className="w-7 h-7" />
              <p className="lg:text-16 md:text-16 sm:text-14">{userProfile.email}</p>
            </div>
            <div className="flex gap-x-3">
              <IoIosCall className="w-7 h-7" />
              <p className="lg:text-16 md:text-16 sm:text-14">{userProfile.phone_number}</p>
            </div>
            <div className="flex gap-x-3">
              <FaLocationDot className="w-7 h-7" />
              <p className="lg:text-16 md:text-16 sm:text-14">{userProfile.location}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
