import React, { useEffect, useState } from "react";
import "./ScrollToTopButton.module.css";

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <button
      className={`scroll-to-top ${isVisible ? "active" : ""}`}
      onClick={scrollToTop}
    >
      Top
    </button>
  );
};

export default ScrollToTopButton;
