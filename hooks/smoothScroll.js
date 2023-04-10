import { useEffect } from "react";
import Scrollbar from "smooth-scrollbar";
import OverscrollPlugin from "smooth-scrollbar";

// const overscrollOptions = {
//   enable: true,
//   effect: "bounce",
//   damping: 0.15,
//   maxOverscroll: 150,
// };

const options = {
  damping: 0.07,
  // plugins: {
  //   overscroll: { ...overscrollOptions },
  // },
};

function smoothScroll() {
  useEffect(() => {
    // Scrollbar.use(OverscrollPlugin);
    Scrollbar.init(document.body, options);

    return () => {
      if (Scrollbar) Scrollbar.destroy(document.body);
    };
  }, []);

  return null;
}

export default smoothScroll;
