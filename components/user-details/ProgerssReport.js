import { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../redux/reducers/userSlice";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Skeleton from "react-loading-skeleton";
import WaterIntakeChart from "../charts/WaterIntakeChart";
import WeightChart from "../charts/WeightChart";
import { UserData } from "../../demoData/data";

function ProgerssReport() {
  const [dataLoading, setDataLoading] = useState(true);
  const userGet = useSelector(selectUser);
  const dispatch = useDispatch();
  const [openTab, setOpenTab] = useState(1);
  const [waterIntakeData, setWaterIntakeData] = useState(null);
  const [weightData, setWeightData] = useState(null);

  const [bodyMesurementTypes, setBodyMesurementTypes] = useState(null);

  const [enabledMesurements, setEnabledMesurements] = useState(null);
  const [selectedMesurementsArry, setSelectedMesurementsArry] = useState([]);
  const [mesurementsUpdate, setMesurementsUpdate] = useState(null);

  const [data, setData] = useState(null);

  useEffect(async () => {
    if (userGet) {
      // get Progerss Report data by user id
      setDataLoading(true);
      await axios({
        method: "GET",
        url: "/api/progressReport/" + userGet.userid,
      })
        .then((res) => {
          let enabled = {};

          res.data.data.bodyMeasurementHistory.forEach((data) => {
            console.log(res.data.data.bodyMeasurementHistory);
            enabled = { ...enabled, [data.id]: true };
          });
          setEnabledMesurements(enabled);
          setData(res.data.data);
          if (res.data.data.weeklyProgressImagesUrl.length > 0) {
            setOpenTab(
              res.data.data.weeklyProgressImagesUrl[
                res.data.data.weeklyProgressImagesUrl.length - 1
              ]._id
            );
          }
          setWaterIntakeDataHistory(res.data.data.waterIntakeHistory);
          weightLostHistory(res.data.data.weightLostHistory);
          setDataLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      return userGet;
    }
  }, [userGet]);

  const handleTags = (e) => {
    setEnabledMesurements({
      ...enabledMesurements,
      [e.target.value]: e.target.checked,
    });
    setMesurementsUpdate(true);
  };

  useEffect(async () => {
    if (enabledMesurements) {
      // Selected tags into array
      var keys = Object.keys(enabledMesurements);

      var filtered = keys.filter(function (key) {
        return enabledMesurements[key];
      });

      if (filtered.length > 0) {
        setSelectedMesurementsArry(filtered);
      } else {
        setSelectedMesurementsArry([]);
      }
    }
  }, [enabledMesurements]);

  useEffect(async () => {
    if (mesurementsUpdate) {
      let cancel;
      await axios({
        method: "POST",
        url: "/api/mesurements/updateListByUser",
        params: { uid: userGet.userid },
        data: { bodyMeasurementsList: selectedMesurementsArry },
        cancelToken: new axios.CancelToken((c) => (cancel = c)),
      })
        .then((res) => {})
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });
      return () => cancel();
    } else {
      return mesurementsUpdate;
    }
  }, [selectedMesurementsArry]);

  useEffect(async () => {
    await axios({
      method: "GET",
      url: "/api/mesurements/getAllTypes",
    })
      .then((res) => {
        setBodyMesurementTypes(res.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const setWaterIntakeDataHistory = (data) => {
    if (data.length > 0) {
      setWaterIntakeData({
        labels: data.map((data) => dayjs(data.createdAt).format("MMM-DD")),
        datasets: [
          {
            label: "Users Gained",
            data: data.map((data) => data.value),
            fill: true,
            lineTension: 0.4,
            backgroundColor: "rgba(220,151,76,0.4)",
            borderColor: "rgba(220,127,25,1)",
            radius: 10,
          },
          {
            label: "Daily Limit (3L)",
            data: data.map((data) => 3000),
            fill: false,
            backgroundColor: "rgba(22,22,22,0.98)",
            borderColor: "rgba(22,22,22,1)",
            radius: 0,
          },
        ],
      });
    } else {
      setWaterIntakeData({
        datasets: [],
      });
    }
  };

  const weightLostHistory = (data) => {
    if (data.length > 0) {
      setWeightData({
        labels: data.map((data) => dayjs(data.createdAt).format("MMM-DD")),
        datasets: [
          {
            label: "Users Gained",
            data: data.map((data) => data.value),
            fill: true,
            lineTension: 0.4,
            backgroundColor: "rgba(220,151,76,0.4)",
            borderColor: "rgba(220,127,25,1)",
            radius: 10,
          },
        ],
      });
    } else {
      setWeightData({
        datasets: [],
      });
    }
  };

  return (
    <div>
      <div>
        {/* Progress Report */}
        <div className="main-container">
          <div className="header">
            <div className="title">
              <div className="header-circle"></div>Progress Report
            </div>
          </div>
          <div className="overflow-x-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-w-2 scrolling-touch">
            {dataLoading ? (
              <Skeleton count={5} height={30} />
            ) : (
              <table className="border-separate space-y-3 text-xs w-full">
                <thead className="">
                  <tr>
                    <th className="p-3 text-left w-10"></th>
                    {data?.bodyMeasurementHistory[0]?.values
                      .slice(0)
                      .reverse()
                      .map((data, key) => {
                        return (
                          <th className="p-1 text-left text-gray-500" key={key}>
                            {dayjs(data.createdAt).format("MMM-DD")}
                          </th>
                        );
                      })}
                  </tr>
                </thead>
                <tbody>
                  {bodyMesurementTypes?.map((dataSet, key) => {
                    let mesurementData = data.bodyMeasurementHistory.find(
                      (x) => x.identifier === dataSet.identifier
                    );

                    return (
                      <tr className="lg:text-black" key={key}>
                        <td className="px-1 py-1">
                          <div className="flex justify-between items-center whitespace-nowrap bg-gradient-dark rounded-md text-white">
                            <p className="px-2 py-2">
                              {dataSet.name} ({dataSet.measurementUnit})
                            </p>
                            <div className="overview-tags flex items-center mr-2">
                              <input
                                id={dataSet.name}
                                type="checkbox"
                                name="user_tag"
                                className="hidden"
                                value={dataSet._id}
                                onChange={handleTags}
                                checked={
                                  enabledMesurements &&
                                  dataSet._id in enabledMesurements
                                    ? enabledMesurements[dataSet._id]
                                    : false
                                }
                              />
                              <label
                                htmlFor={dataSet.name}
                                className="custom-radio-btn-2"
                              >
                                <span className="mr-0 !important"></span>
                              </label>
                            </div>
                          </div>
                        </td>
                        {mesurementData?.values
                          .slice(0)
                          .reverse()
                          .map((count, key) => {
                            let lastValue = null;
                            return (
                              <td key={key}>
                                <p
                                  className="flex justify-between gap-1 px-2 py-2 bg-white rounded-md"
                                  key={key}
                                >
                                  {count.value}
                                  {(() => {
                                    if (key == 0) {
                                      return (
                                        <ChevronDownIcon className="w-5 text-[#147AD6]" />
                                      );
                                    } else if (lastValue < count.value) {
                                      lastValue = count.value;
                                      return (
                                        <ChevronUpIcon className="w-5 text-[#e59744]" />
                                      );
                                    } else if (lastValue >= count.value) {
                                      lastValue = count.value;
                                      return (
                                        <ChevronDownIcon className="w-5 text-[#147AD6]" />
                                      );
                                    }
                                  })()}
                                </p>
                              </td>
                            );
                          })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
        {/* Weight */}
        <div className="main-container">
          <div className="header">
            <div className="title">
              <div className="header-circle"></div>Weight
            </div>
          </div>
          <div className="overflow-x-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-w-2 scrolling-touch">
            {dataLoading ? (
              <Skeleton height={30} />
            ) : (
              (() => {
                let lastValue = null;
                return (
                  <>
                    <WeightChart chartData={weightData} />
                    <table className="border-separate space-y-3 text-xs w-full">
                      <thead className="">
                        <tr>
                          <th className="p-3 text-left"></th>
                          {data?.weightLostHistory
                            .slice(0)
                            .reverse()
                            .map((data, key) => {
                              return (
                                <th
                                  className="p-1 text-left text-gray-500"
                                  key={key}
                                >
                                  {dayjs(data.createdAt).format("MMM-DD")}
                                </th>
                              );
                            })}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="lg:text-black">
                          {data?.weightLostHistory[0] ? (
                            <td className="px-1 py-1">
                              <div className="flex justify-between items-center whitespace-nowrap bg-gradient-dark rounded-md text-white">
                                <p className="px-2 py-2">Body weight (Kg)</p>
                              </div>
                            </td>
                          ) : (
                            <tr>No Data Available Right Now</tr>
                          )}

                          {data?.weightLostHistory
                            .slice(0)
                            .reverse()
                            .map((data, key) => {
                              return (
                                <td key={key}>
                                  <p className="flex gap-1 justify-between px-2 py-2 bg-white rounded-md">
                                    {data.value}
                                    {(() => {
                                      // let lastValue;
                                      if (key == 0) {
                                        return (
                                          <ChevronDownIcon className="w-5 text-[#147AD6]" />
                                        );
                                      } else if (lastValue < data.value) {
                                        lastValue = data.value;
                                        return (
                                          <ChevronUpIcon className="w-5 text-[#e59744]" />
                                        );
                                      } else if (lastValue >= data.value) {
                                        lastValue = data.value;
                                        return (
                                          <ChevronDownIcon className="w-5 text-[#147AD6]" />
                                        );
                                      }
                                    })()}
                                  </p>
                                </td>
                              );
                            })}
                        </tr>
                      </tbody>
                    </table>
                  </>
                );
              })()
            )}
          </div>
        </div>
        {/* Image Update */}
        <div className="main-container col-span-2">
          <div className="header">
            <div className="title">
              <div className="header-circle"></div>Image Update
            </div>
          </div>
          {dataLoading ? (
            <Skeleton height={90} />
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {data?.weeklyProgressImagesUrl[0] ? (
                <>
                  <div className="h-[250px] mt-2 overflow-y-auto w-40">
                    <ul
                      className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
                      role="tablist"
                    >
                      {data?.weeklyProgressImagesUrl.reverse().map((data) => {
                        return (
                          <li
                            className="-mb-px mr-2 flex-auto text-center"
                            key={data._id}
                          >
                            <a
                              className={
                                "relative flex text-xs px-2 py-1 border-b border-gray-700 cursor-pointer hover:bg-gray-400 w-full " +
                                (openTab === data._id
                                  ? "text-white bg-gradient-dark"
                                  : " ")
                              }
                              onClick={(e) => {
                                e.preventDefault();
                                setOpenTab(data._id);
                              }}
                              data-toggle="tab"
                              href={"#link_" + data._id}
                              role="tablist"
                            >
                              {dayjs(data.createdAt).format("MMM-DD")} Update
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="col-span-3">
                    <div className="px-4 py-5 flex-auto">
                      <div className="tab-content tab-space">
                        {data?.weeklyProgressImagesUrl.reverse().map((data) => {
                          return (
                            <div
                              className={
                                openTab === data._id ? "block" : "hidden"
                              }
                              id={"#link_" + data._id}
                            >
                              <div className="grid grid-cols-3 gap-1">
                                <div className="relative border-4 border-gray-600 bg-gray-700 rounded-md">
                                  {data.url.front ? (
                                    <img src={data.url.front} alt="" />
                                  ) : (
                                    <div className="h-44 flex justify-center items-center text-gray-400">
                                      Image not <br></br> available
                                    </div>
                                  )}

                                  <h3 className="absolute text-sm text-center text-white bottom-2 w-full mx-auto">
                                    <span className="bg-[#444444c0] px-3 py-1 rounded-2xl">
                                      Front
                                    </span>
                                  </h3>
                                </div>
                                <div className="relative border-4 border-gray-600 bg-gray-700 rounded-md">
                                  {data.url.back ? (
                                    <img src={data.url.back} alt="" />
                                  ) : (
                                    <div className="h-44 flex justify-center items-center text-gray-400">
                                      Image not <br></br> available
                                    </div>
                                  )}
                                  <h3 className="absolute text-sm text-center text-white bottom-2 w-full mx-auto">
                                    <span className="bg-[#444444c0] px-3 py-1 rounded-2xl">
                                      Back
                                    </span>
                                  </h3>
                                </div>
                                <div className="relative border-4 border-gray-600 bg-gray-700 rounded-md">
                                  {data.url.side ? (
                                    <img src={data.url.side} alt="" />
                                  ) : (
                                    <div className="h-44 flex justify-center items-center text-gray-400">
                                      Image not <br></br> available
                                    </div>
                                  )}
                                  <h3 className="absolute text-sm text-center text-white bottom-2 w-full mx-auto">
                                    <span className="bg-[#444444c0] px-3 py-1 rounded-2xl">
                                      Side
                                    </span>
                                  </h3>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-xs px-1 py-3 col-span-3">
                  No Data Available Right Now
                </p>
              )}
            </div>
          )}
        </div>
        {/* Daily Water Intake */}
        <div className="main-container">
          <div className="header">
            <div className="title">
              <div className="header-circle"></div>Daily Water Intake
            </div>
          </div>
          {waterIntakeData ? (
            <WaterIntakeChart chartData={waterIntakeData} />
          ) : (
            <p className="text-xs px-1 py-3">No Data Available Right Now</p>
          )}
        </div>

        <div className="main-container">
          <div className="header">
            <div className="title">
              <div className="header-circle"></div>Additional Notes
            </div>
          </div>
          <div className="flex gap-3 flex-wrap mt-2">
            {data?.weeklyProgressNotes
              .slice(0)
              .reverse()
              .map((note, key) => {
                return (
                  <div key={key} className="bg-white px-3 py-2 w-52 rounded-md">
                    <p className="text-xs font-rubik font-bold">
                      {dayjs(note.createdAt).format("YYYY/MM/DD")}
                    </p>
                    <p className="pt-1">{note.value}</p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgerssReport;
