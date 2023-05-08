import { useCallback, useEffect, useRef, useState } from "react";
import {
  SearchIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CheckIcon,
} from "@heroicons/react/solid";
import dayjs from "dayjs";
import useUserSearch from "../../../hooks/useUserSearch";
import { useSelector, useDispatch } from "react-redux";
import { setUser, selectUser } from "../../../redux/reducers/userSlice";
import Skeleton from "react-loading-skeleton";
import { Plus } from "react-feather";
import AddOfficerModal from "../AddOfficerModal";

function UserSelectBar() {
  const [query, setQuery] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [addNewOfficerModal, setAddNewOfficerModal] = useState(false);

  const observer = useRef();

  const userGet = useSelector(selectUser);
  const dispatch = useDispatch();

  const { loading, error, users, hasMore } = useUserSearch(query, pageNum);

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

  return (
    <div className="h-full bg-white rounded-lg md:rounded-l-none mx-2 md:mx-0 px-4 py-8">
      <div className="flex justify-end mb-3">
        <button
          className="flex justify-between items-center text-sm px-3 py-1 rounded-md bg-gradient-dark text-white"
          onClick={() => {
            setAddNewOfficerModal(true);
          }}
        >
          <Plus className="h-4" /> Add New Officer
        </button>
      </div>
      {/* Search Box */}
      <div className="relative">
        <input
          className="bg-gray-300 opacity-90 outline-none rounded-2xl w-full h-8 px-3 text-sm"
          type="text"
          placeholder="Search officers here"
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
                    <p className="text-sm">
                      {user.initials} {user.lastName}
                    </p>
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
                    <p className="text-sm">
                      {user.initials} {user.lastName}
                    </p>
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
      {/* Modal Add New */}
      {addNewOfficerModal ? (
        <AddOfficerModal
          setAddNewOfficeModal={setAddNewOfficerModal}
          // setDataRelaod={setDataRelaod}
          // dataRelaod={dataRelaod}
        />
      ) : null}
    </div>
  );
}

export default UserSelectBar;
