import { useRouter } from "next/router";
import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { setUser, selectUser } from "../redux/reducers/userSlice";
import { parseCookies } from "nookies";

function NavBar() {
  const cookies = parseCookies();
  const router = useRouter();
  const userGet = useSelector(selectUser);

  return (
    <nav className="main-nav-bar">
      {cookies.userRole === "admin" && (
        <>
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
            Training Plan
          </button>
        </>
      )}
      {cookies.userRole === "branch" && (
        <>
          <button
            className={`btn-c md:px-froce-16 md:ml-20 ${
              router.pathname == "/dashboard/office" && "active-btn"
            }`}
            onClick={() => router.push("/dashboard/office")}
          >
            officers
          </button>
          <button
            className={`btn-c ${
              router.pathname == "/trainingPlans/office" && "active-btn"
            }`}
            onClick={() => router.push("/trainingPlans/office")}
          >
            Training Plan
          </button>
        </>
      )}
    </nav>
  );
}

export default NavBar;
