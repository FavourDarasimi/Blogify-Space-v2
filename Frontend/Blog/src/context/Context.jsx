import axios from "axios";
import { createContext, useState } from "react";
import { useLocation } from "react-router-dom";
export const Context = createContext(null);

const ContextProvider = (props) => {
  const [categoryPosts, setCategoryPosts] = useState([]);
  const [isActive, setIsActive] = useState("");
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  const checkIfUserIsAuth = async () => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
  };

  const contextValue = {
    categoryPosts,
    setCategoryPosts,
    isActive,
    setIsActive,
    isHomePage,
    checkIfUserIsAuth,
    showCreatePost,
    setShowCreatePost,
    isAuth,
    setIsAuth,
  };
  return <Context.Provider value={contextValue}>{props.children}</Context.Provider>;
};

export default ContextProvider;
