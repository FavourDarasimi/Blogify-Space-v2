import { useState } from "react";
import Navbar from "./components/Navbar";
import AccountAccess from "./components/AccountAccess";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CategoryBlogs from "./pages/CategoryBlogs";
import BlogDetail from "./pages/BlogDetail";
import { useContext } from "react";
import { Context } from "./context/Context";
import Profile from "./pages/Profile";
import CreateBlog from "./pages/CreateBlog";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SavedPost from "./pages/SavedPost";

function App() {
  const [setShowLogin] = useState(false);
  const { showCreatePost } = useContext(Context);

  return (
    <div className="bg-white min-h-screen text-textcol2 ">
      {showCreatePost ? <CreateBlog /> : ""}
      <Navbar setShowLogin={setShowLogin} />
      <Routes>
        <Route
          path="/login/"
          element={<AccountAccess setShowLogin={setShowLogin} />}
        />
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<CategoryBlogs />} />
        <Route path="/detail/:postId" element={<BlogDetail />} />
        <Route path="/profile/" element={<Profile />} />
        <Route path="/saved/post/" element={<SavedPost />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
