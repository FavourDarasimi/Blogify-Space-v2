import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { Context } from "../context/Context";
import { logout } from "../endpoint/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { checkIfUserIsAuth, setShowCreatePost, isAuth, setIsAuth } =
    useContext(Context);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const fetchAuth = async () => {
      await checkIfUserIsAuth();
    };
    fetchAuth();
  }, [isAuth]);

  const handleLogout = async () => {
    await logout();
    toast.success("User logged out");
    setIsAuth(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 flex h-20 items-center justify-between max-w-7xl">
        {/* Left Side */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight font-serif text-gray-900 hover:text-red-500 transition-colors"
          >
            BLOGIFY SPACE
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm md:text-base lg:text-lg font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-red-500 after:transition-all hover:after:w-full ${
                isActive("/")
                  ? "text-gray-900 after:w-full"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Home
            </Link>
            <Link
              to="/trending"
              className={`text-sm md:text-base lg:text-lg font-medium transition-colors ${
                isActive("/trending")
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Trending
            </Link>
            <Link
              to="/latest"
              className={`text-sm md:text-base lg:text-lg font-medium transition-colors ${
                isActive("/latest")
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Latest
            </Link>
            <Link
              to="/categories"
              className={`text-sm md:text-base lg:text-lg font-medium transition-colors ${
                isActive("/categories")
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Categories
            </Link>
          </nav>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Search Button */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-3 rounded-full hover:bg-red-500 hover:text-white transition-colors duration-700"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Auth Buttons (Desktop) */}
          {isAuth ? (
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => setShowCreatePost(true)}
                className="px-4 py-2 text-sm md:text-base rounded-md hover:bg-red-500 hover:text-white transition-colors duration-700"
              >
                Add Post
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm md:text-base bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login/">
                <button className="px-4 py-2 text-sm md:text-base rounded-md hover:bg-red-500 hover:text-white transition-colors duration-700">
                  Sign In
                </button>
              </Link>
              <Link to="/login/">
                <button className="px-4 py-2 text-sm md:text-base bg-red-500 text-white rounded-full hover:bg-red-400 transition-colors duration-700">
                  Get Started
                </button>
              </Link>
            </div>
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
        <div className="lg:hidden border-t  bg-white z-10 w-[50%] m-3 rounded-xl right-0 shadow-xl absolute">
          <nav className=" pb-4 flex flex-col gap-4">
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
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowCreatePost(true);
                    }}
                    className="px-4 py-2 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-700"
                  >
                    Add Post
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login/">
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-2 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-700 w-full"
                    >
                      Sign In
                    </button>
                  </Link>
                  <Link to="/login/">
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-400 transition-colors duration-700 w-full"
                    >
                      Get Started
                    </button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Search Bar */}
      {searchOpen && (
        <div className="absolute w-full z-10 transition-all duration-1000">
          <div className="w-[70%] mx-auto py-4">
            <input
              type="search"
              placeholder="Search articles..."
              className="w-full h-12 rounded-full border border-gray-300 bg-white px-6 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
