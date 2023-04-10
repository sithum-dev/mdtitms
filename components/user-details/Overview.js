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
  const [subLoading, setSubLoading] = useState(true);
  const [isSubDataUpdate, setIsSubDataUpdate] = useState(null);
  const [tags, setTags] = useState(null);
  const [selectedTags, setSelectedTags] = useState(null);
  const [selectedTagsArry, setSelectedTagsArry] = useState(null);
  const [tagUpdate, setTagUpdate] = useState(null);
  const [remarks, setRemarks] = useState(false);
  const [remarksEdit, setRemarksEdit] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [subscriptionLogsData, setSubscriptionLogsData] = useState(null);
  const [subscriptionLogsDataLoading, setSubscriptionLogsDataLoading] =
    useState(false);
  const [subscriptionLogsDataError, setSubscriptionLogsDataError] =
    useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalButtons, setShowModalButtons] = useState(false);
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

  const handleTags = (e) => {
    setSelectedTags({ ...selectedTags, [e.target.value]: e.target.checked });
    setTagUpdate(true);
  };

  useEffect(async () => {
    if (selectedTags) {
      // Selected tags into array
      var keys = Object.keys(selectedTags);

      var filtered = keys.filter(function (key) {
        return selectedTags[key];
      });

      if (filtered.length > 0) {
        setSelectedTagsArry(filtered);
      } else {
        setSelectedTagsArry(null);
      }
    }
  }, [selectedTags]);

  useEffect(async () => {
    if (tagUpdate) {
      let cancel;
      await axios({
        method: "POST",
        url: "/api/tags",
        params: { uid: userGet.userid },
        data: { tagsList: selectedTagsArry },
        cancelToken: new axios.CancelToken((c) => (cancel = c)),
      })
        .then((res) => {})
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });
      return () => cancel();
    } else {
      return tagUpdate;
    }
  }, [selectedTagsArry]);

  useEffect(async () => {
    await axios({
      method: "GET",
      url: "/api/tags",
      params: { type: "User Related" },
    })
      .then((res) => {
        document
          .querySelectorAll("input[type=checkbox]")
          .forEach((el) => (el.checked = false));
        setTags(res.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [userLoading]);

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

  useEffect(async () => {
    if (userGet) {
      // get user subscription data by user _id
      let subId;
      await axios({
        method: "GET",
        url: "/api/subscriptions/getSubscriptionByUserId",
        params: { uid: userGet.userid },
      })
        .then((res) => {
          setSubscriptionData(res.data.data);
          if (res.data.data.subscription != null) {
            subId = res.data.data.subscription._id;
          }
          setSubLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });

      setSubscriptionLogsData(null);
      if (subId) {
        //Get subscription Logs By SubID
        await axios({
          method: "GET",
          url: "/api/subscriptions/getSubscriptionLogsById",
          params: { id: subId },
        })
          .then((res) => {
            setSubscriptionLogsData(res.data.data);
            setSubLoading(false);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    } else {
      return userGet;
    }
  }, [userGet, isSubDataUpdate]);

  const updateBankSlipStatus = async (id, status) => {
    await axios({
      method: "POST",
      url: "/api/subscriptions/updateSubscriptionLogDetails",
      params: {
        subId: subscriptionData.subscription._id,
        logId: id,
        status: status,
      },
    })
      .then((res) => {
        setIsSubDataUpdate(isSubDataUpdate ? null : true);
        toast.success(
          "BankSlip status updated successfully!",
          notificationsSettings
        );
        setShowModal(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

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
          >
            {/* <div className="text-xs text-center pt-2">Subscription Status</div>

            <div className="text-center bg-gradient-dark mx-4 py-1 rounded-lg text-white mt-1 mb-2">
              <p className="font-bold text-md">
                {subLoading ? (
                  <Skeleton width={50} />
                ) : (
                  (() => {
                    if (
                      subscriptionData != null &&
                      subscriptionData.subscription != null
                    ) {
                      const today = dayjs(
                        subscriptionData?.subscription.expiryDate
                      );
                      return today.diff(Date.now(), "day") + 1;
                    } else {
                      return 0;
                    }
                  })()
                )}
              </p>
              <p className="text-sm">Days Left</p>
              <p className="text-sm">
                ({" "}
                {subLoading ? (
                  <Skeleton width={50} />
                ) : (
                  (() => {
                    if (
                      subscriptionData != null &&
                      subscriptionData.subscription != null
                    ) {
                      const today = dayjs(
                        subscriptionData?.subscription.expiryDate
                      );
                      return today.diff(Date.now(), "week") + 1;
                    } else {
                      return 0;
                    }
                  })()
                )}{" "}
                Weeks )
              </p>
            </div> */}
          </div>
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
                {showModalButtons && (
                  <div className="flex items-center justify-between px-6 py-3 border-t border-solid border-blueGray-200 rounded-b bg-gray-300">
                    <div>
                      <button
                        className="bg-white px-4 py-2 rounded-md"
                        onClick={() =>
                          updateBankSlipStatus(
                            selectedBankslipData.logId,
                            "Resubmit"
                          )
                        }
                      >
                        Resubmit
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="bg-white px-4 py-2 rounded-md"
                        onClick={() =>
                          updateBankSlipStatus(
                            selectedBankslipData.logId,
                            "Declined"
                          )
                        }
                      >
                        Decline
                      </button>
                      <button
                        className="bg-gradient-dark text-white px-4 py-2 rounded-md"
                        onClick={() =>
                          updateBankSlipStatus(
                            selectedBankslipData.logId,
                            "Successful"
                          )
                        }
                      >
                        Successful
                      </button>
                    </div>
                  </div>
                )}
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
