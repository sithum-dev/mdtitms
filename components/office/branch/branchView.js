import { ChevronRightIcon, SearchIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { FolderIcon, UsersIcon } from "@heroicons/react/outline";
import Programs from "../../training-plans/BranchViewData";
import Users from "../../users/user-section";

function index() {
  const [activeSection, setActiveSection] = useState("programs");
  return (
    <div className="mt-2">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="">
          <div className="h-screen bg-white rounded-lg mx-2 py-4">
            {/* Header */}
            <div className="mt-2">
              <div
                className={`flex gap-3 items-center relative shadow-md px-3 py-3 mt-2 mx-3 rounded-lg cursor-pointer ${
                  activeSection == "programs"
                    ? "bg-gradient-dark text-white"
                    : "hover:scale-105 transition duration-300 ease-in-out"
                }`}
                onClick={() => setActiveSection("programs")}
              >
                <div className="bg-white p-2 rounded-full">
                  <FolderIcon className="h-7 w-7 text-gray-700" />
                </div>
                Programs
                <ChevronRightIcon className="h-5 absolute right-1" />
              </div>
              <div
                className={`flex gap-3 items-center relative shadow-md px-3 py-3 mt-2 mx-3 rounded-lg cursor-pointer ${
                  activeSection == "officers"
                    ? "bg-gradient-dark text-white"
                    : "hover:scale-105 transition duration-300 ease-in-out"
                }`}
                onClick={() => setActiveSection("officers")}
              >
                <div className="bg-white p-2 rounded-full">
                  <UsersIcon className="h-7 w-7 text-gray-700" />
                </div>
                Officers
                <ChevronRightIcon className="h-5 absolute right-1" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-4">
          {activeSection == "programs" ? <Programs /> : <Users />}
        </div>
      </div>
    </div>
  );
}

export default index;
