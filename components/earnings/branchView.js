import { ChevronRightIcon, SearchIcon } from "@heroicons/react/solid";
import { useState } from "react";
import {
  CashIcon,
  FolderAddIcon,
  FolderIcon,
  UsersIcon,
} from "@heroicons/react/outline";
import Earnings from "./BranchViewData";
import Subscriptions from "./subscription";

function index() {
  const [activeSection, setActiveSection] = useState("earnings");
  return (
    <div className="mt-2">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="">
          <div className="h-screen bg-white rounded-lg mx-2 pl-6 py-4">
            {/* Header */}
            <div className="mt-2">
              <div
                className={`flex gap-3 items-center relative shadow-md px-3 py-3 mt-2 mx-3 rounded-lg cursor-pointer ${
                  activeSection == "earnings"
                    ? "bg-gradient-dark text-white"
                    : "hover:scale-105 transition duration-300 ease-in-out"
                }`}
                onClick={() => setActiveSection("earnings")}
              >
                <div className="bg-white p-2 rounded-full">
                  <FolderIcon className="h-7 w-7 text-gray-700" />
                </div>
                Programs
                <ChevronRightIcon className="h-5 absolute right-1" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-3">
          {activeSection == "earnings" ? <Earnings /> : <Subscriptions />}
        </div>
      </div>
    </div>
  );
}

export default index;
