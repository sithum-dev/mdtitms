import { useRouter } from "next/router";
import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { setUser, selectUser } from "../redux/reducers/userSlice";

function NavBar() {
  const router = useRouter();
  const userGet = useSelector(selectUser);

  return (
    <nav className="main-nav-bar">
      <button
        className={`btn-c md:px-froce-16 md:ml-20 ${
          router.pathname == "/" && "active-btn"
        }`}
        onClick={() => router.push("/")}
      >
        Offices
      </button>
      <button
        className={`btn-c ${
          router.pathname == "/trainingPlans" && "active-btn"
        }`}
        onClick={() => router.push("/trainingPlans")}
      >
        Training Plans
      </button>
    </nav>
  );
}

export default NavBar;
