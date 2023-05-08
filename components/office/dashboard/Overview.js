import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectOffice } from "../../../redux/reducers/officeSlice";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Skeleton from "react-loading-skeleton";
import GetUserData from "../../../hooks/getOfficeDataById";

function Overview() {
  dayjs.extend(relativeTime);
  const officeGet = useSelector(selectOffice);

  const { office, OfficeLoading } = GetUserData(officeGet);

  return (
    <div>
      {/* User Details */}

      <div className="additional-user-details">
        {OfficeLoading ? (
          <div className="rounded-lg px-2 py-3 grid grid-cols-1 gap-1 text-sm items-center bg-gray-300">
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        ) : (
          <div className="user-details">
            <span>Name</span>
            <label>: {office?.officeName}</label>
            <span>Head Office</span>
            <label>: {office?.officeHead}</label>
            <span>Telephone</span>
            <label>: {office?.telephone}</label>
          </div>
        )}

        {OfficeLoading ? (
          <div className="rounded-lg px-2 py-3 grid grid-cols-1 gap-1 text-sm items-center bg-gray-300">
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        ) : (
          <div className="user-details">
            <span>Fax</span>
            <label>: {office?.fax}</label>
            <span>Web</span>
            <label>: {office?.web}</label>
            <span>Email</span>
            <label>: {office?.email}</label>
          </div>
        )}
      </div>
    </div>
  );
}

export default Overview;
