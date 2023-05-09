import React, { useRef } from "react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import DataTable from "react-data-table-component";
import Skeleton from "react-loading-skeleton";
import dayjs from "dayjs";
import { forEach } from "draft-js-table/lib/blockRenderMap";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/reducers/userSlice";
import { toast } from "react-toastify";
import { Check, Plus } from "react-feather";

const notificationsSettings = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

const AssignPlan = ({
  viewTrainingPlan,
  setAssignPlansState,
  plansData,
  isPlansUpdate,
  setPlansUpdate,
}) => {
  const userGet = useSelector(selectUser);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const [dataLoad, setDataLoad] = useState(null);

  const [selected, setSelected] = useState([]);

  const columns = [
    {
      name: "Code",
      selector: (row) => row.planCode,
      // width: "50%",
    },
    {
      name: "Name",
      // cell: (row) => <img src={row.coverimage} width={50} alt={row.name}></img>,
      selector: (row) => row.planName,
      // width: "25%",
    },
    {
      name: "Group",
      selector: (row) => row.group,
      // width: "25%",
    },
    // {
    //   name: "Start Date",
    //   selector: (row) => dayjs(row.startDate).format("YYYY-MM-DD"),
    //   // width: "25%",
    // },
    // {
    //   name: "End Date",
    //   selector: (row) => dayjs(row.endDate).format("YYYY-MM-DD"),
    //   // width: "25%",
    // },
    {
      name: "Action",
      selector: (row) => (
        <div className="flex gap-3">
          <div
            onClick={() => viewTrainingPlan(row._id)}
            className="bg-gradient-dark px-3 py-2 rounded-md text-white cursor-pointer"
          >
            View
          </div>
          {selected.includes(row._id) ? (
            <div
              onClick={() => unassignPlan(row._id)}
              className="flex gap-1 items-center bg-green-700 px-3 py-1 rounded-md text-white cursor-pointer"
            >
              <Check className="w-3" />
              Assigned
            </div>
          ) : (
            <div
              onClick={() => assignPlan(row._id)}
              className="flex gap-1 items-center bg-gradient-dark px-3 py-1 rounded-md text-white cursor-pointer"
            >
              <Plus className="w-3" />
              Assign
            </div>
          )}
        </div>
      ),
      width: "23%",
    },
  ];

  useEffect(() => {
    plansData?.forEach((plan) => {
      setSelected((prevState) => [...prevState, plan._id]);
    });
  }, []);

  const assignPlan = async (id) => {
    setSelected([...selected, id]);
    await axios({
      method: "POST",
      url: "/api/users/assignTrainingPlan",
      data: { plansList: [id] },
      params: { id: userGet.userid },
    })
      .then((res) => {
        setPlansUpdate(isPlansUpdate ? null : true);
        toast.success(
          "Training plan successfully assigned to user!",
          notificationsSettings
        );
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const unassignPlan = async (id) => {
    setSelected(selected.filter((item) => item !== id));
    await axios({
      method: "POST",
      url: "/api/users/unassignTrainingPlan",
      params: { id: userGet.userid, planId: id },
    })
      .then((res) => {
        setPlansUpdate(isPlansUpdate ? null : true);
        toast.success(
          "Training plan removed from user successfully!",
          notificationsSettings
        );
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const fetchData = async (page, per_page) => {
    setIsLoaded(false);
    // let start = page * per_page - per_page;

    fetch(`/api/trainingPlans/getAll`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pageNumber: page,
        pageSize: per_page,
      }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setItems(result.data);
          setTotalRows(result.total);
          setIsLoaded(true);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  useEffect(() => {
    fetchData(1, perPage);
  }, [perPage, dataLoad]);

  const handlePageChange = (page) => {
    fetchData(page, perPage);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
  };

  return (
    <>
      <div className="bg-white rounded-md mx-2 px-2 py-3">
        {/* Data Table */}
        <div className="mx-4 text-2xl mt-3">All Training Plans</div>
        <div className="my-6">
          <DataTable
            columns={columns}
            data={items}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerRowsChange}
          />
          <div className="flex justify-center mx-2 my-2">
            <button
              onClick={() => setAssignPlansState(false)}
              className="bg-gradient-dark text-white px-10 py-2 text-sm rounded-full"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignPlan;
