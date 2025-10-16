// src/context/Context.jsx
import { createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../endpoint/api";

export const Context = createContext(null);

const ContextProvider = (props) => {
  const [categoryPosts, setCategoryPosts] = useState([]);
  const [isActive, setIsActive] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null); // 👈 NEW

  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const checkIfUserIsAuth = async () => {
    try {
      const response = await api.get("/account/is-Authenticated/");
      setIsAuth(response.data.isAuthenticated);
      if (response.data.isAuthenticated) {
        // fetch profile once authenticated
        const profileRes = await api.get("/account/profile");
        setProfile(profileRes.data);
      }
    } catch (error) {
      setIsAuth(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkIfUserIsAuth();
  }, []);

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
    isLoading,
    profile, // 👈 added
    setProfile, // 👈 added
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
