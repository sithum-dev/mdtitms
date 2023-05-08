import { useState, useEffect } from "react";
import UserDetails from "./UserDetails";
import EditUserDetails from "../../users/EditUserDetails";
import TrainingPlans from "../../users/dashboard/TrainingPlans";

function index() {
  const [openTab, setOpenTab] = useState(1);
  const color = "pink";

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
                Officer Details
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
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
                href="#link4"
                role="tablist"
              >
                Assigned Plans
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
                Edit User Details
              </a>
            </li>
          </ul>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                  <UserDetails />
                </div>
                <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                  <TrainingPlans />
                </div>
                <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                  <EditUserDetails />
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
