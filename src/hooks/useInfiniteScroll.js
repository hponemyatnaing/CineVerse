import { useEffect } from "react";

function useInfiniteScroll(callback) {
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.body.offsetHeight;

      if (scrollTop + windowHeight >= docHeight - 100) {
        callback();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [callback]);
}

export default useInfiniteScroll;
