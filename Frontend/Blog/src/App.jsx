import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import AccountAccess from "./components/AccountAccess";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import BlogDetail from "./pages/BlogDetail";
import { useContext } from "react";
import { Context } from "./context/Context";
import Profile from "./pages/Profile";
import CreateBlog from "./pages/CreateBlog";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SavedPost from "./pages/SavedPost";
import Trending from "./pages/Trending";
import Footer from "./components/Footer";
import Latest from "./pages/Latest";
import Categories from "./pages/Categories";
import CategoryPosts from "./pages/CategoryPosts";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const { showCreatePost } = useContext(Context);

  return (
    <div className="bg-white flex flex-col min-h-screen text-textcol2 relative">
      <ScrollToTop />
      <Navbar setShowLogin={setShowLogin} />
      {showLogin ? <AccountAccess setShowLogin={setShowLogin} /> : ""}
      <div className="flex-grow">
        <Routes>
          {/* <Route
            path="/login"
            element={}
          /> */}
          <Route path="/" element={<Home />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/latest" element={<Latest />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:categoryId" element={<CategoryPosts />} />
          <Route
            path="/detail/:postId"
            element={<BlogDetail setShowLogin={setShowLogin} />}
          />
          <Route path="/add/post" element={<CreateBlog />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/saved/post/" element={<SavedPost />} />
        </Routes>
      </div>
      <div cla>
        <Footer />
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
