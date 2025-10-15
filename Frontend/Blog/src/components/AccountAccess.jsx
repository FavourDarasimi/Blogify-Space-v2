import React, { useContext, useState } from "react";
import cancel from "../assets/icons8-cross-24.png";
import lock from "../assets/icons8-lock-30.png";
import { Link, useNavigate } from "react-router-dom";
import { login, signup } from "../endpoint/api";
import { Context } from "../context/Context";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BeatLoader } from "react-spinners";

const AccountAccess = ({ setShowLogin }) => {
  const { setIsAuth } = useContext(Context);
  const [currentStatus, setCurrentStatus] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState("");
  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      setIsAuth(true);
      setShowLogin(false);

      toast.success("User Logged In");

      nav("/");
    } catch (error) {
      for (var i = 0; i < JSON.stringify(error).length; i++) {
        var err = JSON.stringify(Object.values(error)[i])
          .replace(/[\[\]]/g, "")
          .replace(/"/g, "");
        toast.error(err.charAt(0).toUpperCase() + err.slice(1));
      }
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await signup(username, firstName, lastName, email, password);
      const log = await login(email, password);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
      setIsAuth(true);
      setShowLogin(false);
      toast.success("User Signed Up");
      toast.success("User Logged In");

      nav("/");
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
    <div className=" fixed z-1 inset-0  bg-black w-100%   bg-opacity-50 grid place-items-center  ">
      <form
        className=" rounded-3xl  bg-white w-fit h-fit animate-2smoothfade fixed"
        onSubmit={(e) => {
          currentStatus == "login" ? handleLogin(e) : handleSignupSubmit(e);
        }}
      >
        <div className="w-full flex justify-end pt-4 pr-4 ">
          <img
            src={cancel}
            alt=""
            className="w-6 h-6 cursor-pointer"
            onClick={() => setShowLogin(false)}
          />
        </div>
        <div className="flex flex-col gap-3 pl-10 pr-10 pb-10">
          <div className="flex flex-col">
            <h1 className="text-center text-2xl font-semibold">
              {currentStatus === "login" ? "Sign in" : "Sign up"}
            </h1>
            <div className="flex gap-2 text-xsl justify-center">
              <img src={lock} alt="" className="w-6" />
              <p className="flex items-center text-locktext">
                All data will be encrypted
              </p>
            </div>
          </div>
          {currentStatus === "signup" ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col">
                <label className="text-xsl font-semibold mb-1">Username</label>
                <input
                  type="text"
                  className="  border-1 rounded-xl p-2 l h-12 outline-none border-bordercol focus:outline-none focus:ring-2 focus:ring-red-400"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="text-xsl font-semibold mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="  border-1 rounded-xl p-2 2 h-12 outline-none border-bordercol focus:outline-none focus:ring-2 focus:ring-red-400"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xsl font-semibold mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="  border-1 rounded-xl p-2 h-12 outline-none border-bordercol focus:outline-none focus:ring-2 focus:ring-red-400"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="flex flex-col">
            <label className="text-xsl font-semibold mb-1">Email</label>
            <input
              type="email"
              className="  border-1 rounded-xl p-2  h-12 outline-none border-bordercol focus:outline-none focus:ring-2 focus:ring-red-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xsl font-semibold mb-1">Password</label>
            <input
              type="password"
              className="  border-1 rounded-xl p-2  h-12 outline-none border-bordercol focus:outline-none focus:ring-2 focus:ring-red-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className=" py-3 sm:w-72 md:w-80 rounded-full bg-red-500 text-white lg:w-full ">
            {loading ? (
              <BeatLoader size={10} color="#fff" />
            ) : currentStatus === "login" ? (
              "Sign in"
            ) : (
              "Sign up"
            )}
          </button>

          <div className="flex place-items-start  gap-3 lg:w-96 sm:w-72 md:w-80">
            <input type="checkbox" className="mt-2" required />
            <p className="text-myGrey text-xssl">
              By continuing, I agree to the terms of use & privacy policy.
            </p>
          </div>

          {currentStatus === "login" ? (
            <p className="text-center">
              Create an Account?
              <span
                onClick={() => setCurrentStatus("signup")}
                className="cursor-pointer ml-1 text-dark-yellow font-semibold"
              >
                Click here
              </span>
            </p>
          ) : (
            <p className="text-center">
              Already have an Account?
              <span
                onClick={() => setCurrentStatus("login")}
                className="cursor-pointer ml-1 text-dark-yellow font-semibold"
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default AccountAccess;
