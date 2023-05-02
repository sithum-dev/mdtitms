import { useCallback, useEffect, useRef, useState } from "react";
import {
  SearchIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CheckIcon,
} from "@heroicons/react/solid";
import dayjs from "dayjs";
import useOfficeSearch from "../../hooks/useOfficeSearch";
import { useSelector, useDispatch } from "react-redux";
import { setOffice, selectOffice } from "../../redux/reducers/officeSlice";
import Skeleton from "react-loading-skeleton";
import axios from "axios";
import { Plus } from "react-feather";
import AddOfficeModal from "../office/addOfficeModal";

function UserSelectBar() {
  const [query, setQuery] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [addNewOfficeModal, setAddNewOfficeModal] = useState(false);
  const [dataRelaod, setDataRelaod] = useState(null);

  const observer = useRef();

  const officeGet = useSelector(selectOffice);
  const dispatch = useDispatch();

  const { loading, error, offices, hasMore } = useOfficeSearch(
    query,
    pageNum,
    dataRelaod
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
    if (!officeGet && offices[0]) {
      dispatch(
        setOffice({
          officeid: offices[0]._id,
        })
      );
    }
  }, [offices]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPageNum(1);
  };

  const selectNewOffice = (id) => {
    dispatch(
      setOffice({
        officeid: id,
      })
    );
  };

  return (
    <div className="h-full bg-white rounded-lg md:rounded-l-none mx-2 md:mx-0 pl-6 px-4 py-8">
      <div className="flex justify-end mb-3">
        <button
          className="flex justify-between items-center text-sm px-3 py-1 rounded-md bg-gradient-dark text-white"
          onClick={() => {
            setAddNewOfficeModal(true);
          }}
        >
          Add New Office <Plus className="h-4" />
        </button>
      </div>

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
          <p>Offices</p>
          <div className="w-full h-[1px] bg-gray-400"></div>
        </div>
        {/* Offices */}
        <div className="h-[400px] md:h-[500px] mt-4 px-3 overflow-y-auto">
          {offices.map((office, key) => {
            if (offices.length == key + 1) {
              return (
                <div
                  key={key}
                  ref={lastUserElimentRef}
                  className={`flex gap-3 items-center relative shadow-md px-2 py-2 mt-2 rounded-lg cursor-pointer ${
                    officeGet?.officeid == office._id
                      ? "bg-gradient-dark text-white"
                      : "hover:scale-105 transition duration-300 ease-in-out"
                  }`}
                  onClick={() => selectNewOffice(office._id)}
                >
                  <img
                    className="h-12 w-12 rounded-full"
                    src={
                      office.profileImageUrl
                        ? office.profileImageUrl
                        : "/images/man.png"
                    }
                    alt="profile image"
                  />
                  <div>
                    <p className="text-sm">{office.officeName}</p>
                    <p className="text-xs">
                      Last updated{" "}
                      {dayjs(office.updatedAt).format("YYYY/MM/DD")}
                    </p>
                  </div>
                  <ChevronRightIcon className="h-5 absolute right-1" />
                </div>
              );
            } else {
              return (
                <div
                  key={office._id}
                  className={`flex gap-3 items-center relative shadow-md px-2 py-2 mt-2 rounded-lg cursor-pointer ${
                    officeGet?.officeid == office._id
                      ? "bg-gradient-dark text-white"
                      : "hover:scale-105 transition duration-300 ease-in-out"
                  }`}
                  onClick={() => selectNewOffice(office._id)}
                >
                  <img
                    className="h-12 w-12 rounded-full"
                    src={
                      office.profileImageUrl
                        ? office.profileImageUrl
                        : "/images/man.png"
                    }
                    alt="profile image"
                  />
                  <div>
                    <p className="text-sm">{office.officeName}</p>
                    <p className="text-xs">
                      Last updated{" "}
                      {dayjs(office.updatedAt).format("YYYY/MM/DD")}
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
      {addNewOfficeModal ? (
        <AddOfficeModal
          setAddNewOfficeModal={setAddNewOfficeModal}
          setDataRelaod={setDataRelaod}
          dataRelaod={dataRelaod}
        />
      ) : null}
    </div>
  );
}

export default UserSelectBar;
