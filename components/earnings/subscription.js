import React, { useRef } from "react";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import EarningsChart from "../charts/EarningsChart";
import { UserData } from "../../demoData/data";
import dayjs from "dayjs";
import Skeleton from "react-loading-skeleton";

const columns = [
  {
    name: "Date",
    selector: (row) => (
      <div className="bg-[#BD2652] text-white px-4 py-2 rounded-md">
        {row._id}
      </div>
    ),
    // width: "50%",
  },
  {
    name: "Active users",
    selector: (row) => (
      <div className="text-base">{row.Ongoing ? row.Ongoing : 0}</div>
    ),
  },
  {
    name: "Completed",
    selector: (row) => (
      <div className="text-base">{row.Expired ? row.Expired : 0}</div>
    ),
  },
  {
    name: "Paused",
    selector: (row) => (
      <div className="text-base">{row.Pause ? row.Pause : 0}</div>
    ),
  },
  {
    name: "Pending",
    selector: (row) => (
      <div className="text-base">{row.Pending ? row.Pending : 0}</div>
    ),
  },
  {
    name: "Canceled",
    selector: (row) => (
      <div className="text-base">{row.Cancel ? row.Cancel : 0}</div>
    ),
  },
  {
    name: "Total Count",
    // cell: (row) => <img src={row.coverimage} width={50} alt={row.name}></img>,
    selector: (row) => (
      <div className="text-base">
        {(row.Ongoing ? row.Ongoing : 0) +
          (row.Expired ? row.Expired : 0) +
          (row.Pause ? row.Pause : 0) +
          (row.Pending ? row.Pending : 0) +
          (row.Cancel ? row.Cancel : 0)}
      </div>
    ),
  },
];

const Subscription = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [totalData, setTotalData] = useState(null);
  const [earningsDataSet, setEarningsDataSet] = useState(null);

  const [rangeState, setRangeState] = useState("rangePresets");
  const rangeTypeRef = useRef(null);
  const dateRef = useRef(null);

  const toDateRef = useRef(null);
  const fromDateRef = useRef(null);

  const earningsData = (data) => {
    if (data.length > 0) {
      setEarningsDataSet({
        labels: data.map((data) => dayjs(data._id).format("MMM-DD")),
        datasets: [
          {
            label: "Earnings",
            data: data.map((data) => data.count),
            backgroundColor: "rgba(220,151,76,0.4)",
            borderColor: "rgba(220,127,25,1)",
            radius: 10,
          },
        ],
      });
    } else {
      setEarningsDataSet({
        datasets: [],
      });
    }
  };

  useEffect(() => {
    fetchData(1, perPage);
  }, [perPage, rangeState]);

  const fetchData = async (page, per_page) => {
    let start = page * per_page - per_page;

    let gte;
    let lte = dayjs(new Date()).format("YYYY-MM-DD");

    fetch(`api/dashboard/getSubscriptionReport`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start: start,
        limit: per_page,
        gte: gte,
        lte: lte,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setItems(result.data[0]?.paginatedResult);
          setTotalData({
            active: result.data?.[0]?.totalCount?.find(
              (o) => o._id === "Ongoing"
            ),
            paused: result.data?.[0]?.totalCount?.find(
              (o) => o._id === "Pause"
            ),
            pending: result.data?.[0].totalCount?.find(
              (o) => o._id === "Pending"
            ),
            cancel: result.data?.[0].totalCount?.find(
              (o) => o._id === "Cancel"
            ),
            expired: result.data?.[0].totalCount?.find(
              (o) => o._id === "Expired"
            ),
          });

          setTotalRows(result.data?.[0].totalCount[0]?.totalCount);
          setIsLoaded(true);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );

    fetch(`api/dashboard/getsubScriptionGraph`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gte: gte,
        lte: lte,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          earningsData(result.data?.[0].paginatedResult);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  const handlePageChange = (page) => {
    fetchData(page, perPage);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
  };

  const handleDateRangeChange = () => {
    fetchData(1, perPage);
  };
  return <></>;
};

export default Subscription;
