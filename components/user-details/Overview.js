import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../redux/reducers/userSlice";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import { PlusCircleIcon } from "@heroicons/react/outline";
import { Line } from "chart.js";

function Overview() {
  const userGet = useSelector(selectUser);
  const dispatch = useDispatch();
  dayjs.extend(relativeTime);

  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBankslipData, setSelectedBankslipData] = useState(null);
  const [subscriptionStatusColor, setSubscriptionStatusColor] =
    useState("bg-[#ffff]");

  const remarksRef = useRef(null);
  const subLogRemarksRef = useRef(null);

  const notificationsSettings = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  useEffect(async () => {
    if (userGet) {
      // get user data bt id
      setUserLoading(true);
      await axios({
        method: "GET",
        url: "/api/users/" + userGet.userid,
      })
        .then((res) => {
          setUser(res.data.data);
          setUserLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      return userGet;
    }
  }, [userGet]);

  return (
    <div>
      {/* User Details */}
      <div
        className={`main-user-details ${
          userLoading ? "bg-white" : "bg-gradient-dark "
        }`}
      >
        {userLoading ? (
          <Skeleton width={150} height={120} />
        ) : (
          <img
            src={
              user?.profileImageUrl
                ? user?.profileImageUrl
                : "/images/profile-pic.png"
            }
            alt="profile image"
          />
        )}

        <div>
          <div className="user-details">
            <span>Name</span>
            <label>
              : {userLoading ? <Skeleton width={150} /> : user?.name}
            </label>
            <span>Country</span>
            <label>
              : {userLoading ? <Skeleton width={150} /> : user?.country}
            </label>
            <span>Email</span>
            <label>
              : {userLoading ? <Skeleton width={150} /> : user?.email}
            </label>
            <span>Mobile</span>
            <label>
              : {userLoading ? <Skeleton width={150} /> : user?.mobileNumber}
            </label>
          </div>
        </div>

        {userLoading ? (
          <Skeleton width={150} height={120} />
        ) : (
          <div
            className={`${subscriptionStatusColor} mx-2 my-2 rounded-lg w-40`}
          ></div>
        )}
      </div>
      <div className="additional-user-details">
        <div className="rounded-lg px-2 py-3 grid grid-cols-1 gap-1 text-sm items-center bg-gray-300">
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
        <div className="rounded-lg px-2 py-3 grid grid-cols-1 gap-1 text-sm items-center bg-gray-300">
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      </div>

      {/* Modal Update */}
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between px-5 py-3 border-b border-solid border-blueGray-200 rounded-t bg-gradient-dark">
                  <h3 className="text-xl font-semibold text-white">
                    Review bank slip
                  </h3>
                  <button
                    className="ml-auto bg-transparent border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    ×
                  </button>
                </div>
                {/*body*/}
                <div className="relative px-6 py-3 flex-auto">
                  <img
                    className="h-80"
                    src={selectedBankslipData.imgUrl}
                    alt=""
                  />
                </div>
                {/*footer*/}
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
}

export default Overview;
