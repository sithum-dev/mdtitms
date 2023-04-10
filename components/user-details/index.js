import { useState, useEffect } from "react";
import MealPlan from "./MealPlan";
import Overview from "./Overview";
import ProgerssReport from "./ProgerssReport";
import WorkoutPlan from "./WorkoutPlan";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../redux/reducers/userSlice";
import axios from "axios";

function index() {
  const userGet = useSelector(selectUser);
  const [openTab, setOpenTab] = useState(1);
  const color = "pink";
  const [user, setUser] = useState(null);

  useEffect(async () => {
    if (userGet) {
      // get user data bt id
      await axios({
        method: "GET",
        url: "/api/users/" + userGet.userid,
      })
        .then((res) => {
          setUser(res.data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      return userGet;
    }
  }, [userGet]);

  return (
    <div className="mx-2 col-span-2">
      <div className="flex flex-wrap">
        <div className="w-full">
          <ul
            className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
            role="tablist"
          >
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs md:text-sm px-1 md:px-3 py-3 shadow-lg rounded-lg block leading-normal " +
                  (openTab === 1 ? "text-white bg-gradient-dark" : "bg-white")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(1);
                }}
                data-toggle="tab"
                href="#link1"
                role="tablist"
              >
                Overview
              </a>
            </li>
            {/* <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs md:text-sm px-1 md:px-3 py-3 shadow-lg rounded-lg block leading-normal " +
                  (openTab === 2 ? "text-white bg-gradient-dark" : "bg-white")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(2);
                }}
                data-toggle="tab"
                href="#link2"
                role="tablist"
              >
                Progress Report
              </a>
            </li> */}
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs md:text-sm px-1 md:px-3 py-3 shadow-lg rounded-lg block leading-normal" +
                  (openTab === 4
                    ? "text-white bg-gradient-dark"
                    : "text-" + color + "-600 bg-white")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(4);
                }}
                data-toggle="tab"
                href="#link4"
                role="tablist"
              >
                Assigned Programs
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "text-xs md:text-sm px-1 md:px-3 py-3 shadow-lg rounded-lg block leading-normal " +
                  (openTab === 3 ? "text-white bg-gradient-dark" : "bg-white")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(3);
                }}
                data-toggle="tab"
                href="#link3"
                role="tablist"
              >
                User Settings
              </a>
            </li>
            {/* <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  "flex gap-2 justify-center items-center text-xs md:text-sm px-1 md:px-3 py-2 shadow-lg rounded-lg leading-normal " +
                  (openTab === 5
                    ? "text-white bg-gradient-dark"
                    : "text-" + color + "-600 bg-white")
                }
                href={
                  "https://api.whatsapp.com/send/?phone=+940" +
                  user?.mobileNumber
                }
                target="_blank"
              >
                <img
                  className="w-7 h-7"
                  src="./images/whatsapp.png"
                  alt="whatsapp"
                />
                Chat
              </a>
            </li> */}
          </ul>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                  <Overview />
                </div>
                <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                  <ProgerssReport />
                </div>
                <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                  <MealPlan />
                </div>
                <div className={openTab === 4 ? "block" : "hidden"} id="link4">
                  <WorkoutPlan />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default index;
