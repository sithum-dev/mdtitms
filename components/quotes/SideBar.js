import { ChevronRightIcon, SearchIcon } from "@heroicons/react/solid";
import quotes from "../../demoData/quotes.json";

function SideBar() {
  return (
    <div className="">
      <div className="h-full bg-white rounded-lg mx-2 pl-6 py-4">
        {/* Subscription Header */}
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <p>Quotes Library</p>
          </div>
          {/* Search Box */}
          <div className="relative mt-4 mx-3">
            <input
              className="bg-gray-300 opacity-90 outline-none rounded-2xl w-full h-8 px-3 text-sm"
              type="text"
              placeholder="Search quotes"
            />
            <SearchIcon className="absolute h-6 top-1 right-2 text-gray-500" />
          </div>
          {/* Quotes */}
          <div className="h-[500px] md:h-[600px] mt-4 px-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-w-2 scrolling-touch">
            {quotes.map((quote, key) => {
              return (
                <div
                  key={key + 1}
                  className={`flex gap-3 items-center relative shadow-md px-2 py-2 rounded-lg cursor-pointer ${
                    quote.active
                      ? "bg-gradient-dark text-white"
                      : "hover:scale-105 transition duration-300 ease-in-out"
                  }`}
                >
                  <div>
                    <p className="text-sm">{quote.content}</p>
                  </div>
                  <ChevronRightIcon className="h-5 absolute right-1" />
                </div>
              );
            })}
          </div>
          {/* Action Buttons */}
          <div className="flex justify-center md:justify-end gap-2 mt-4">
            <button className="bg-gradient-dark text-white px-4 py-2 rounded-lg">
              Add New
            </button>
            <button className="bg-gradient-dark text-white px-4 py-2 rounded-lg">
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
