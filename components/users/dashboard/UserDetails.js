import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../../redux/reducers/userSlice";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Skeleton from "react-loading-skeleton";

function UserDetails() {
  const userGet = useSelector(selectUser);
  dayjs.extend(relativeTime);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [subscriptionStatusColor, setSubscriptionStatusColor] =
    useState("bg-[#ffff]");

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
          <div className="user-details mx-5">
            <span>Name</span>
            <label>
              :{" "}
              {userLoading ? (
                <Skeleton width={150} />
              ) : (
                user?.initials + " " + user?.lastName
              )}
            </label>
            <span className="mr-3">NIC </span>
            <label>
              : {userLoading ? <Skeleton width={150} /> : user?.nic}
            </label>
            <span>Email</span>
            <label>
              : {userLoading ? <Skeleton width={150} /> : user?.email}
            </label>
            <span>Mobile</span>
            <label>
              : {userLoading ? <Skeleton width={150} /> : user?.mobileNo}
            </label>
          </div>
        </div>

        {userLoading ? (
          <Skeleton width={150} height={120} />
        ) : (
          <div
            className={`${subscriptionStatusColor} mx-2 my-2 rounded-lg w-40`}
          >
            <div className="text-sm text-center pt-2">Current Status</div>

            <div className="text-center bg-gradient-dark mx-4 py-1 rounded-lg text-white mt-5 mb-2">
              <p className="font-bold text-md"></p>
              <p className="text-sm">{user?.currentState}</p>
              <p className="text-sm"></p>
            </div>
          </div>
        )}
      </div>
      <div className="additional-user-details">
        {userLoading ? (
          <div className="rounded-lg px-2 py-3 grid grid-cols-1 gap-1 text-sm items-center bg-gray-300">
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        ) : (
          <div className="user-details">
            <span>Title</span>
            <label>: {user?.title}</label>
            <span>Initials</span>
            <label>: {user?.initials}</label>
            <span>Initials Name</span>
            <label>: {user?.initialsName}</label>
            <span>Common Name</span>
            <label>: {user?.commonName}</label>
            <span>Last Name</span>
            <label>: {user?.lastName}</label>
            <span>Date Of Birth</span>
            <label>: {dayjs(user?.dob).format("YYYY-MM-DD")}</label>
            <span>Age</span>
            <label>: {dayjs(user?.dob).fromNow(true)}</label>
            <span>Gender</span>
            <label>: {user?.sex}</label>
            <span>Address</span>
            <label>: {user?.perAdd}</label>
          </div>
        )}

        {userLoading ? (
          <div className="rounded-lg px-2 py-3 grid grid-cols-1 gap-1 text-sm items-center bg-gray-300">
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        ) : (
          <div className="user-details">
            <span>Appointed Date</span>
            <label>: {dayjs(user?.appDate).format("YYYY-MM-DD")}</label>
            <span>Belonging To</span>
            <label>: {user?.belongingTo}</label>
            <span>Grade</span>
            <label>: {user?.grade}</label>
            <span>Level</span>
            <label>: {user?.level}</label>
            <span>Per File No</span>
            <label>: {user?.perFileNo}</label>
            <span>Post</span>
            <label>: {user?.postCode?.name}</label>
            <span>Scale</span>
            <label>: {user?.scaleCode?.name}</label>
            <span>Service Category</span>
            <label>: {user?.serviceCategory}</label>
            <span>Service</span>
            <label>: {user?.serviceCode?.name}</label>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDetails;
