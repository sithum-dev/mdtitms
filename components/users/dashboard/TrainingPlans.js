import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../../redux/reducers/userSlice";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Skeleton from "react-loading-skeleton";
import { Plus } from "react-feather";
import parse from "html-react-parser";

function TrainingPlans() {
  const userGet = useSelector(selectUser);
  dayjs.extend(relativeTime);
  const [plansLoading, setPlansLoading] = useState(false);
  const [plansData, setPlansData] = useState(null);
  const [plansViewData, setPlanViewData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(async () => {
    if (userGet) {
      // get user data bt id
      setPlansLoading(true);
      await axios({
        method: "GET",
        url: "/api/users/" + userGet.userid,
      })
        .then((res) => {
          setPlansData(res.data.data.trainingPlansList);

          setPlansLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      return userGet;
    }
  }, [userGet]);

  const viewTrainingPlan = async (id) => {
    const response = await fetch("/api/trainingPlans/" + id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();
    setPlanViewData(res.data);

    setShowModal(true);
  };

  return (
    <div>
      <div className="main-container">
        <div className="header my-2">
          <div className="title">
            <div className="header-circle"></div>Training Plans
          </div>
          <button
            className="flex justify-between items-center text-sm px-3 py-1 rounded-md bg-gradient-dark text-white"
            onClick={() => {
              // setAddNewOfficerModal(true);
            }}
          >
            <Plus className="h-4" /> Assign New Training Plan
          </button>
        </div>
        {plansLoading ? (
          <Skeleton count={2} height={30} />
        ) : (
          <div className="overflow-x-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-w-2 scrolling-touch">
            <table className="payment-table text-gray-400 border-separate space-y-3 text-xs w-full">
              <thead className="bg-gradient-dark text-white">
                <tr>
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Code</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Start Date</th>
                  <th className="p-3 text-left">End Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plansData?.map((plan, key) => {
                  return (
                    <tr className="bg-white lg:text-black" key={key + 1}>
                      <td className="p-3">{key + 1}</td>
                      <td className="p-3">{plan.planCode}</td>
                      <td className="p-3">{plan.planName}</td>
                      <td className="p-3">
                        {dayjs(plan.startDate).format("YYYY/MM/DD")}
                      </td>
                      <td className="p-3">
                        {dayjs(plan.endDate).format("YYYY/MM/DD")}
                      </td>
                      <td className="p-3 flex justify-end">
                        <div
                          onClick={() => viewTrainingPlan(plan._id)}
                          className="bg-gradient-dark px-3 py-1 rounded-md text-white cursor-pointer w-14 text-center"
                        >
                          View
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Modal View */}
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-[700px] bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between px-5 py-3 border-b border-solid border-blueGray-200 rounded-t bg-gradient-dark">
                  <h3 className="text-xl font-semibold text-white">
                    View Training Plan Data
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
                  <p className="text-lg px-1 py-2">Content</p>
                  <div className="bg-gray-200 px-2 py-2 rounded-md">
                    {parse(plansViewData?.content)}
                  </div>
                  <div className="px-1 mt-4 py-2 grid grid-cols-3 gap-5">
                    <p className="col-span-2">
                      Name :{" "}
                      <span className="font-semibold">
                        {plansViewData?.planName}
                      </span>
                    </p>
                    <p>
                      Code :{" "}
                      <span className="font-semibold">
                        {plansViewData?.planCode}
                      </span>
                    </p>
                    <p>
                      Group :{" "}
                      <span className="font-semibold">
                        {plansViewData?.group}
                      </span>
                    </p>
                    <p>
                      Start Date :{" "}
                      <span className="font-semibold">
                        {dayjs(plansViewData?.startDate).format("YYYY-MM-DD")}
                      </span>
                    </p>
                    <p>
                      End Date :{" "}
                      <span className="font-semibold">
                        {dayjs(plansViewData?.endDate).format("YYYY-MM-DD")}
                      </span>
                    </p>
                  </div>
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

export default TrainingPlans;
