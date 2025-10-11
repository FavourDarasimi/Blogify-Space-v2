import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const timeout = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 0);
    return () => clearTimeout(timeout);
  }, [pathname]);
  return null;
};

export default ScrollToTop;
