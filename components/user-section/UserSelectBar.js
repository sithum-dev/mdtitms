import { useCallback, useEffect, useRef, useState } from "react";
import {
  SearchIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CheckIcon,
  ArrowPathIcon,
} from "@heroicons/react/solid";
import subscriptionStatus from "../../demoData/subscriptionFilters.json";
import dayjs from "dayjs";
import useUserSearch from "../../hooks/useUserSearch";
import { useSelector, useDispatch } from "react-redux";
import { setUser, selectUser } from "../../redux/reducers/userSlice";
import Skeleton from "react-loading-skeleton";
import axios from "axios";

function UserSelectBar() {
  const [query, setQuery] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [tags, setTags] = useState(null);
  const [selectedTags, setSelectedTags] = useState(null);
  const [tagfilter, setTagFilter] = useState(null);
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [dateFilter, setDateFilter] = useState("Descending");

  const observer = useRef();

  const userGet = useSelector(selectUser);
  const dispatch = useDispatch();

  const { loading, error, users, hasMore } = useUserSearch(
    query,
    pageNum,
    tagfilter,
    dateFilter
  );

  const lastUserElimentRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          //Change page page number
          setPageNum((prevPagenumber) => prevPagenumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    if (selectedTags) {
      // Selected tags into array
      var keys = Object.keys(selectedTags);

      var filteredTags = keys.filter(function (key) {
        return selectedTags[key];
      });

      if (filteredTags.length > 0) {
        setTagFilter(filteredTags);
      } else {
        setTagFilter(null);
      }
    }
  }, [selectedTags]);

  useEffect(async () => {
    await axios({
      method: "GET",
      url: "/api/tags",
    })
      .then((res) => {
        setTags(res.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  useEffect(() => {
    if (!userGet && users[0]) {
      dispatch(
        setUser({
          userid: users[0]._id,
          userName: users[0].name,
        })
      );
    }
  }, [users]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPageNum(1);
  };

  const selectNewUser = (id, name) => {
    dispatch(
      setUser({
        userid: id,
        userName: name,
      })
    );
  };

  const handleTagsFilter = (e) => {
    setSelectedTags({ ...selectedTags, [e.target.value]: e.target.checked });
    setPageNum(1);
  };

  return (
    <div className="h-full bg-white rounded-lg md:rounded-l-none mx-2 md:mx-0 pl-6 px-4 py-8">
      {/* Search Box */}
      <div className="relative">
        <input
          className="bg-gray-300 opacity-90 outline-none rounded-2xl w-full h-8 px-3 text-sm"
          type="text"
          placeholder="Search people here"
          onChange={handleSearch}
        />
        <SearchIcon className="absolute h-6 top-1 right-2 text-gray-500" />
      </div>
      {/* Users Header */}
      <div className="mt-4">
        <div className="flex items-center gap-2">
          <p>Officers</p>
          <div className="w-full h-[1px] bg-gray-400"></div>
          {/* <div className="bg-gray-300 p-1 rounded-full cursor-pointer hover:bg-gray-500">
            <ChevronDownIcon className="h-5" />
          </div> */}
        </div>
        {/* Subscriptin Filters */}
        <div className="flex relative w-full justify-end">
          <div
            className="flex items-center text-sm px-4 cursor-pointer"
            onClick={() => setFilterDropdown(filterDropdown ? false : true)}
          >
            Last Updated Date
            <ChevronDownIcon className="h-6 w-6 text-gray-700" />
          </div>
          {filterDropdown && (
            <div className="absolute z-50 top-7 right-5 text-sm bg-white shadow-2xl rounded-md border">
              <div className="px-4 py-2">
                <p className="text-gray-600 text-xs pb-2">ORDER</p>
                <div className="flex flex-col gap-1">
                  <span
                    className="flex items-center gap-2 px-2 py-1 hover:bg-gray-300 rounded-sm cursor-pointer"
                    onClick={() => setDateFilter("Ascending")}
                  >
                    <CheckIcon
                      className={`h-4 w-4 text-green-600 ${
                        dateFilter != "Ascending" && "opacity-0"
                      }`}
                    />{" "}
                    Ascending
                  </span>
                  <span
                    className="flex items-center gap-2 px-2 py-1 hover:bg-gray-300 rounded-sm cursor-pointer"
                    onClick={() => setDateFilter("Descending")}
                  >
                    <CheckIcon
                      className={`h-4 w-4 text-green-600 ${
                        dateFilter != "Descending" && "opacity-0"
                      }`}
                    />{" "}
                    Descending
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Users */}
        <div className="h-[400px] md:h-[500px] mt-4 px-3 overflow-y-auto">
          {users.map((user, key) => {
            if (users.length == key + 1) {
              return (
                <div
                  key={key}
                  ref={lastUserElimentRef}
                  className={`flex gap-3 items-center relative shadow-md px-2 py-2 mt-2 rounded-lg cursor-pointer ${
                    userGet?.userid == user._id
                      ? "bg-gradient-dark text-white"
                      : "hover:scale-105 transition duration-300 ease-in-out"
                  }`}
                  onClick={() => selectNewUser(user._id, user.name)}
                >
                  <img
                    className="h-12 w-12 rounded-full"
                    src={
                      user.profileImageUrl
                        ? user.profileImageUrl
                        : "/images/man.png"
                    }
                    alt="profile image"
                  />
                  <div>
                    <p className="text-sm">{user.name}</p>
                    <p className="text-xs">
                      Last updated {dayjs(user.updatedAt).format("YYYY/MM/DD")}
                    </p>
                  </div>
                  <ChevronRightIcon className="h-5 absolute right-1" />
                </div>
              );
            } else {
              return (
                <div
                  key={user._id}
                  className={`flex gap-3 items-center relative shadow-md px-2 py-2 mt-2 rounded-lg cursor-pointer ${
                    userGet?.userid == user._id
                      ? "bg-gradient-dark text-white"
                      : "hover:scale-105 transition duration-300 ease-in-out"
                  }`}
                  onClick={() => selectNewUser(user._id, user.name)}
                >
                  <img
                    className="h-12 w-12 rounded-full"
                    src={
                      user.profileImageUrl
                        ? user.profileImageUrl
                        : "/images/man.png"
                    }
                    alt="profile image"
                  />
                  <div>
                    <p className="text-sm">{user.name}</p>
                    <p className="text-xs">
                      Last updated {dayjs(user.updatedAt).format("YYYY/MM/DD")}
                    </p>
                  </div>
                  <ChevronRightIcon className="h-5 absolute right-1" />
                </div>
              );
            }
          })}

          {loading && (
            <div>
              <div className="flex gap-3 items-center relative shadow-md px-2 py-2 mt-2 rounded-lg">
                <Skeleton circle width={50} height={50} />
                <Skeleton count={2} width={200} />
              </div>
              <div className="flex gap-3 items-center relative shadow-md px-2 py-2 mt-2 rounded-lg">
                <Skeleton circle width={50} height={50} />
                <Skeleton count={2} width={200} />
              </div>
              <div className="flex gap-3 items-center relative shadow-md px-2 py-2 mt-2 rounded-lg">
                <Skeleton circle width={50} height={50} />
                <Skeleton count={2} width={200} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserSelectBar;
