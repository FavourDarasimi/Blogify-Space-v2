import React, { useContext, useState } from "react";
import cancel from "../assets/icons8-cross-24.png";
import lock from "../assets/icons8-lock-30.png";
import { Link, useNavigate } from "react-router-dom";
import { login, signup } from "../endpoint/api";
import { Context } from "../context/Context";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BeatLoader } from "react-spinners";
import { AlertCircle } from "lucide-react";

const AccountAccess = ({ setShowLogin }) => {
  const { setIsAuth, checkIfUserIsAuth } = useContext(Context);
  const [currentStatus, setCurrentStatus] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const nav = useNavigate();

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Username validation regex (alphanumeric and underscores)
  const usernameRegex = /^[a-zA-Z0-9_]+$/;

  // Name validation regex (letters and spaces only)
  const nameRegex = /^[a-zA-Z\s]+$/;

  // Clear errors
  const clearErrors = () => {
    setErrors({});
  };

  // Validate login form
  const validateLoginForm = () => {
    const newErrors = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate signup form
  const validateSignupForm = () => {
    const newErrors = {};

    // Username validation
    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (username.length > 30) {
      newErrors.username = "Username must be less than 30 characters";
    } else if (!usernameRegex.test(username)) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
    }

    // First name validation
    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (!nameRegex.test(firstName)) {
      newErrors.firstName = "First name can only contain letters";
    } else if (firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    // Last name validation
    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (!nameRegex.test(lastName)) {
      newErrors.lastName = "Last name can only contain letters";
    } else if (lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change with validation
  const handleInputChange = (field, value) => {
    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Update field value
    switch (field) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "username":
        setUsername(value);
        break;
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      default:
        break;
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    clearErrors();

    // Validate form

    setLoading(true);

    try {
      const data = await login(email.trim(), password);

      // Check authentication
      await checkIfUserIsAuth();

      toast.success("Login successful! Welcome back.");
      setShowLogin(false);
      nav("/");
    } catch (error) {
      toast.error("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle signup
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    clearErrors();

    // Validate form
    if (!validateSignupForm()) {
      // Show first error in toast
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      return;
    }

    setLoading(true);

    try {
      const data = await signup(
        username.trim(),
        firstName.trim(),
        lastName.trim(),
        email.trim(),
        password
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
      toast.success("Account created successfully! Please login.");

      // Clear form
      setUsername("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");

      // Switch to login
      setCurrentStatus("login");
    } catch (error) {
      setLoading(false);
      if (error.username) {
        for (var i = 0; i <= error.username.length; i++) {
          toast.error(error.username[i]);
        }
      }
      if (error.email) {
        for (var i = 0; i <= error.email.length; i++) {
          toast.error(error.email[i]);
        }
      }
      // Handle specific error cases
    }
  };

  // Handle form switch
  const handleFormSwitch = (status) => {
    setCurrentStatus(status);
    clearErrors();
    // Clear form fields when switching
    if (status === "login") {
      setUsername("");
      setFirstName("");
      setLastName("");
    }
  };

  return (
    <div className="fixed z-50 inset-0 bg-black w-full bg-opacity-50 grid place-items-center p-4">
      <form
        className="rounded-3xl bg-white w-full max-w-md h-fit animate-2smoothfade relative overflow-y-auto max-h-[90vh]"
        onSubmit={(e) => {
          currentStatus === "login" ? handleLogin(e) : handleSignupSubmit(e);
        }}
      >
        {/* Close button */}
        <div className="w-full flex justify-end pt-4 pr-4 sticky top-0 bg-white z-10">
          <img
            src={cancel}
            alt="Close"
            className="w-6 h-6 cursor-pointer hover:opacity-70 transition"
            onClick={() => setShowLogin(false)}
          />
        </div>

        <div className="flex flex-col gap-3 px-6 sm:px-10 pb-10">
          {/* Header */}
          <div className="flex flex-col">
            <h1 className="text-center text-2xl font-semibold">
              {currentStatus === "login" ? "Sign in" : "Sign up"}
            </h1>
            <div className="flex gap-2 text-xs justify-center">
              <img src={lock} alt="" className="w-6" />
              <p className="flex items-center text-gray-600">
                All data will be encrypted
              </p>
            </div>
          </div>

          {/* Signup fields */}
          {currentStatus === "signup" && (
            <div className="flex flex-col gap-3">
              {/* Username */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`border rounded-xl p-2 h-12 outline-none focus:ring-2 ${
                    errors.username
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-red-400"
                  }`}
                  value={username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  placeholder="Enter username"
                  maxLength={30}
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.username}
                  </p>
                )}
              </div>

              {/* First and Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`border rounded-xl p-2 h-12 outline-none focus:ring-2 ${
                      errors.firstName
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-red-400"
                    }`}
                    value={firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    placeholder="First name"
                    maxLength={50}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-semibold mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`border rounded-xl p-2 h-12 outline-none focus:ring-2 ${
                      errors.lastName
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-red-400"
                    }`}
                    value={lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    placeholder="Last name"
                    maxLength={50}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className={`border rounded-xl p-2 h-12 outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-red-400"
              }`}
              value={email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              className={`border rounded-xl p-2 h-12 outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-red-400"
              }`}
              value={password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder={
                currentStatus === "signup"
                  ? "Min 8 characters"
                  : "Enter password"
              }
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.password}
              </p>
            )}
            {currentStatus === "signup" && !errors.password && (
              <p className="text-gray-500 text-xs mt-1">
                Must contain uppercase, lowercase, and number
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="py-3 w-full rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <BeatLoader size={10} color="#fff" />
            ) : currentStatus === "login" ? (
              "Sign in"
            ) : (
              "Sign up"
            )}
          </button>

          {/* Terms checkbox */}
          <div className="flex items-start gap-3">
            <input type="checkbox" className="mt-1 cursor-pointer" required />
            <p className="text-gray-600 text-xs">
              By continuing, I agree to the terms of use & privacy policy.
            </p>
          </div>

          {/* Switch form */}
          {currentStatus === "login" ? (
            <p className="text-center text-sm">
              Create an Account?
              <span
                onClick={() => handleFormSwitch("signup")}
                className="cursor-pointer ml-1 text-red-500 font-semibold hover:underline"
              >
                Click here
              </span>
            </p>
          ) : (
            <p className="text-center text-sm">
              Already have an Account?
              <span
                onClick={() => handleFormSwitch("login")}
                className="cursor-pointer ml-1 text-red-500 font-semibold hover:underline"
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
