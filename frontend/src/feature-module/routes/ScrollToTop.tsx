import { useEffect } from "react";
import { useLocation } from "react-router";

const ScrollToTop = () => {
  const { hash, pathname, search } = useLocation();

  useEffect(() => {
    if (hash) {
      return;
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [hash, pathname, search]);

  return null;
};

export default ScrollToTop;
