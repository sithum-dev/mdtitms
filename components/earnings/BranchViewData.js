import React, { useRef } from "react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import DataTable from "react-data-table-component";
import EarningsChart from "../charts/EarningsChart";
import Skeleton from "react-loading-skeleton";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import parse from "html-react-parser";

import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

const notificationsSettings = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

const Content = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [totalData, setTotalData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [dataLoad, setDataLoad] = useState(null);

  const [planData, setPlanData] = useState(null);

  const [rangeState, setRangeState] = useState("rangePresets");

  const courseCode = useRef(null);
  const courseName = useRef(null);
  const targetGroup = useRef(null);
  const startDate = useRef(null);
  const endDate = useRef(null);

  const planHtmlRef = useRef(null);

  const editor = useRef();

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
    {
      name: "Start Date",
      selector: (row) => dayjs(row.startDate).format("YYYY-MM-DD"),
      // width: "25%",
    },
    {
      name: "End Date",
      selector: (row) => dayjs(row.endDate).format("YYYY-MM-DD"),
      // width: "25%",
    },
    {
      name: "Action",
      selector: (row) => (
        <div
          onClick={() => viewTrainingPlan(row._id)}
          className="bg-gradient-dark px-3 py-2 rounded-md text-white cursor-pointer"
        >
          View
        </div>
      ),
      width: "10%",
    },
  ];

  const viewTrainingPlan = async (id) => {
    const response = await fetch("/api/trainingPlans/" + id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();
    setPlanData(res.data);

    setShowModal(true);
  };

  const buttonList = [
    ["undo", "redo"],
    ["align", "fontSize", "formatBlock", "hiliteColor"],
    ["paragraphStyle"],
    ["bold", "underline", "italic", "strike", "subscript", "superscript"],
    ["fontColor", "hiliteColor", "textStyle"],
    ["removeFormat"],
    ["image", "table", "link"],
    ["fullScreen"],
  ];

  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

  useEffect(() => {
    fetchData(1, perPage);
  }, [perPage, rangeState, dataLoad]);

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
          console.log();
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

  const handlePageChange = (page) => {
    fetchData(page, perPage);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    let data = {
      planName: courseName.current.value,
      planCode: courseCode.current.value,
      group: targetGroup.current.value,
      startDate: startDate.current.value,
      endDate: endDate.current.value,
      content: editor.current.getContents(),
    };

    const response = await fetch("/api/trainingPlans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();

    courseName.current.value = "";
    courseCode.current.value = "";
    targetGroup.current.value = "";
    startDate.current.value = "";
    endDate.current.value = "";
    editor.current.setContents("");

    toast.success(
      "New training plan added successfully!",
      notificationsSettings
    );

    setDataLoad(dataLoad ? null : true);

    setLoading(false);
  };

  const handleImageUploadBefore = (files, info, uploadHandler) => {
    // if (imageUpload == null) return;

    const imageRef = ref(storage, `html_editer/${v4()}${files[0].name}`);

    uploadBytes(imageRef, files[0]).then((snapshot) => {
      console.log(snapshot);
      // const response = {
      //   // The response must have a "result" array.
      //   result: [
      //     {
      //       url: `https://firebasestorage.googleapis.com/v0/b/leansl.appspot.com/o/html_editer%2F${snapshot.metadata.name}?alt=media`,
      //       name: files[0].name,
      //       size: files[0].size,
      //     },
      //   ],
      // };
      // uploadHandler(response);
    });
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
        </div>
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
                    {parse(planData?.content)}
                  </div>
                  <div className="px-1 mt-4 py-2 grid grid-cols-3 gap-2">
                    <p>
                      Name :{" "}
                      <span className="font-semibold">
                        {planData?.planName}
                      </span>
                    </p>
                    <p>
                      Code :{" "}
                      <span className="font-semibold">
                        {planData?.planCode}
                      </span>
                    </p>
                    <p>
                      Group :{" "}
                      <span className="font-semibold">{planData?.group}</span>
                    </p>
                    <p>
                      Start Date :{" "}
                      <span className="font-semibold">
                        {dayjs(planData?.startDate).format("YYYY-MM-DD")}
                      </span>
                    </p>
                    <p>
                      End Date :{" "}
                      <span className="font-semibold">
                        {dayjs(planData?.endDate).format("YYYY-MM-DD")}
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
    </>
  );
};

export default Content;
