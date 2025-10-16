import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, User, Bookmark } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { Context } from "../context/Context";
import { logout } from "../endpoint/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdAdd, MdLogout } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";

const Navbar = ({ setShowLogin }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    setShowCreatePost,
    isAuth,
    setIsAuth,
    profile,
    setProfile,
    isLoading,
  } = useContext(Context);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
      setIsAuth(false);
      setProfile(null); // clear profile data
      setUserMenu(false);
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Error logging out. Please try again.");
    }
  };

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".user-menu") &&
        !event.target.closest(".menu-button")
      ) {
        setUserMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Close search on ESC
  useEffect(() => {
    const handleEscape = (e) => e.key === "Escape" && setSearchOpen(false);
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const getInitials = (firstName, lastName) => {
    const initials = `${firstName.charAt(0).toUpperCase()}${lastName
      .charAt(0)
      .toUpperCase()} `;
    return initials;
  };

  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-xl">
        <div className="md:px-10 px-5 flex h-20 items-center justify-between">
          <div className="animate-pulse w-40 h-6 bg-gray-200 rounded" />
          <div className="animate-pulse w-32 h-8 bg-gray-200 rounded" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-xl">
      <div className="md:px-10 px-5 flex h-20 items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-20">
          <Link
            to="/"
            className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight font-serif text-gray-900 hover:text-red-500 transition-colors"
          >
            BLOGIFY SPACE
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {[
              { path: "/", label: "Home" },
              { path: "/trending", label: "Trending" },
              { path: "/latest", label: "Latest" },
              { path: "/categories", label: "Categories" },
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`relative font-medium text-gray-600 hover:text-red-500 transition-all duration-300 
             ${isActive(path) ? "text-red-600" : ""}
             after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-red-500 
             hover:after:w-full after:transition-all`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Side */}
        <div className="flex items-center md:gap-4 gap-1">
          {/* Search */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-3 rounded-full hover:bg-red-500 hover:text-white transition-colors duration-700"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Auth Buttons */}
          {isAuth ? (
            <>
              <Link to="/add/post">
                <button className="hidden lg:flex items-center gap-1 px-4 py-2 text-sm md:text-base rounded-md bg-red-500 hover:bg-red-600 text-white transition-colors duration-700">
                  <MdAdd />
                  Add Post
                </button>
              </Link>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="user-menu p-2 rounded-full hover:bg-red-500 hover:text-white border flex items-center gap-2 transition-colors duration-700"
                >
                  {profile?.image ? (
                    <img
                      src={profile?.image || "/default-avatar.png"}
                      alt="User avatar"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <FaRegCircleUser className="w-6 h-6" />
                  )}

                  <IoIosArrowDown className="h-4 w-4" />
                </button>

                {userMenu && (
                  <div className="menu-button absolute right-0 mt-2 bg-white border border-gray-200 shadow-lg rounded-xl w-60 py-2 z-50">
                    <div className="flex items-center gap-3 px-4 py-2">
                      {profile?.image ? (
                        <img
                          src={profile?.image || "/default-avatar.png"}
                          alt="User avatar"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="bg-red-500 w-12 h-12 text-white font-semibold text-xl rounded-full flex items-center justify-center">
                          <h1>
                            {getInitials(
                              profile?.user?.first_name || "User",
                              profile?.user?.last_name || ""
                            )}
                          </h1>
                        </div>
                      )}

                      <div>
                        <p className="font-semibold text-sm">
                          {profile?.user?.first_name || "User"}{" "}
                          {profile?.user?.last_name || ""}
                        </p>
                        <p className="text-xs text-gray-500">
                          {profile?.user?.email || ""}
                        </p>
                      </div>
                    </div>

                    <hr className="my-1" />

                    <Link
                      to="/profile"
                      onClick={() => setUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-gray-700 hover:text-red-500"
                    >
                      <User className="h-4 w-4" />
                      <span>View Profile</span>
                    </Link>
                    <Link
                      to="/saved/post"
                      onClick={() => setUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-gray-700 hover:text-red-500"
                    >
                      <Bookmark className="h-4 w-4" />
                      <span>Saved Posts</span>
                    </Link>

                    <hr className="my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-gray-700 hover:text-red-500"
                    >
                      <MdLogout className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="hidden md:block px-4 py-2 text-sm md:text-base rounded-md hover:bg-red-500 hover:text-white transition-colors duration-700"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-full h-10 w-10 lg:hidden hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-white z-10 w-[70%] m-3 rounded-xl right-0 shadow-xl absolute">
          <nav className="pb-4 flex flex-col gap-4">
            {["/", "/trending", "/latest", "/categories"].map((path) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors px-4 py-2 rounded-md ${
                  isActive(path)
                    ? "bg-red-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {path === "/"
                  ? "Home"
                  : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
              </Link>
            ))}

            <div className="pt-4 border-t flex flex-col gap-2 px-4">
              {isAuth ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/add/post");
                  }}
                  className="px-4 py-2 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-700"
                >
                  Add Post
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowLogin(true);
                    }}
                    className="px-4 py-2 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-700 w-full"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowLogin(true);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-400 transition-colors duration-700 w-full"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Search Bar */}
      {searchOpen && (
        <div className="absolute w-full z-10 backdrop-blur-lg border-b transition-all duration-500">
          <div className="w-[80%] mx-auto py-4">
            <input
              type="search"
              placeholder="Search articles..."
              className="w-full h-12 rounded-full border border-gray-300 px-6 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
