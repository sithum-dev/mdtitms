import { useEffect, useRef, useState } from "react";
import { ChevronRight, Plus } from "react-feather";
import dynamic from "next/dynamic";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, Modifier } from "draft-js";
import draftToHtml from "draftjs-to-html";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../redux/reducers/userSlice";
import dayjs from "dayjs";
import { ContentState } from "draft-js";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { storage } from "../../firebase";
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((module) => module.Editor),
  {
    ssr: false,
  }
);

const htmlToDraft =
  typeof window === "object" && require("html-to-draftjs").default;

function WorkoutPlan() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const userGet = useSelector(selectUser);

  const [workoutPlansData, setWorkoutPlansData] = useState(null);
  const [workoutVideos, setWorkoutVideos] = useState(null);
  const [workoutTemplatesData, setWorkoutTemplatesData] = useState(null);
  const [workoutLoading, setWorkoutLoading] = useState(null);
  const [templateLoading, setTemplateLoading] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [textEditerShow, setTextEditerShow] = useState(false);
  const textEditerRef = useRef(null);
  const templateCheckBoxRef = useRef();
  const templateNameRef = useRef();
  const [showTemplateName, setShowTemplateName] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);

  const editor = useRef();

  const notificationsSettings = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
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

  useEffect(async () => {
    if (userGet) {
      await axios({
        method: "GET",
        url: "/api/workoutPlan/" + userGet.userid,
      })
        .then((res) => {
          editor.current.hide();
          setWorkoutPlansData(res.data.data[0]);
          setSelectedWorkout(res.data.data[0]?.workoutPlans[0]?._id);
          setWorkoutPlan(res.data.data[0]?._id);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      return userGet;
    }
  }, [userGet, workoutLoading]);

  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

  //Set workout plans templates
  useEffect(async () => {
    await axios({
      method: "GET",
      url: "/api/workoutPlan/getTemplates",
    })
      .then((res) => {
        return setWorkoutTemplatesData(res.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
    return () => {};
  }, [templateLoading]);

  //Set workout videos data
  useEffect(async () => {
    await axios({
      method: "GET",
      url: "/api/workoutPlan/getWorkoutVideos",
    })
      .then((res) => {
        return setWorkoutVideos(res.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
    return () => {};
  }, []);

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  const resetWorkout = () => {
    editor.current.setContents("");
  };

  const newWorkoutSet = () => {
    setTextEditerShow(true);
    editor.current.show();
    // setEditorState(EditorState.createEmpty());
    setSelectedWorkout(null);
    textEditerRef.current.scrollIntoView();
  };

  const showTemplateText = () => {
    if (templateCheckBoxRef.current.checked) {
      setShowTemplateName(true);
    } else {
      setShowTemplateName(false);
    }
  };

  const saveWorkout = async () => {
    // const rawContentState = convertToRaw(editorState.getCurrentContent());

    let data = {
      userId: userGet.userid,
      workoutPlansData: editor.current.getContents(),
      workoutPlanId: workoutPlan && workoutPlan,
      subWorkoutPlanId: selectedWorkout && selectedWorkout,
      saveAsTemplate: templateCheckBoxRef.current.checked,
      templateName: templateNameRef.current.value,
    };

    await axios({
      method: "POST",
      url: "/api/workoutPlan/" + userGet.userid,
      data: data,
    })
      .then((res) => {
        editor.current.setContents("");
        setWorkoutLoading(workoutLoading ? null : true);
        setTemplateLoading(templateLoading ? null : true);
        // setEditorState(EditorState.createEmpty());
        setTextEditerShow(false);
        editor.current.hide();
        toast.success(
          "Workout plan updated successfully!",
          notificationsSettings
        );
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const loadHtmlToEditer = ({ content }) => {
    editor.current.insertHTML(content, true, true);
  };

  const addWorkoutTemplate = ({ content }) => {
    loadHtmlToEditer({ content });
  };

  const deleteWorkoutPlan = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios({
          method: "DELETE",
          url:
            "/api/workoutPlan/" +
            userGet.userid +
            "/?workoutId=" +
            workoutPlan +
            "&subWorkoutId=" +
            selectedWorkout,
        })
          .then((res) => {
            setWorkoutLoading(workoutLoading ? null : true);
          })
          .catch((e) => {
            console.log(e);
          });
        Swal.fire("Deleted!", "Workout Plan has been deleted.", "success");
      }
    });
  };

  const editWorkoutPlan = async () => {
    editor.current.setContents("");
    await axios({
      method: "GET",
      url:
        "/api/workoutPlan/byID/?workoutId=" +
        workoutPlan +
        "&subWorkoutId=" +
        selectedWorkout,
    })
      .then((res) => {
        setTextEditerShow(true);
        textEditerRef.current.scrollIntoView();
        editor.current.insertHTML(
          res.data.data[0].workoutPlans.content,
          true,
          true
        );
        editor.current.show();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  //Load workout video to textEditer
  const loadWorkoutVideo = (id, title) => {
    const html = '<a href="workout:' + id + '">' + title + "</a>";
    editor.current.insertHTML(html, true, true);
  };

  const handleImageUploadBefore = (files, info, uploadHandler) => {
    // if (imageUpload == null) return;

    const imageRef = ref(storage, `html_editer/${v4()}${files[0].name}`);

    uploadBytes(imageRef, files[0]).then((snapshot) => {
      const response = {
        // The response must have a "result" array.
        result: [
          {
            url: `https://firebasestorage.googleapis.com/v0/b/leansl.appspot.com/o/html_editer%2F${snapshot.metadata.name}?alt=media`,
            name: files[0].name,
            size: files[0].size,
          },
        ],
      };

      uploadHandler(response);
    });
  };

  return (
    <div className="meal-plan-container grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Workout Plans */}
      <div className="main-container col-span-2">
        <div className="header">
          <div className="title">
            <div className="header-circle"></div>Workout Plans
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 mt-2">
          <div className="h-[250px] mt-2 overflow-y-auto">
            {workoutPlansData
              ? workoutPlansData.workoutPlans.map((plan, key) => {
                  if (selectedWorkout == plan._id) {
                    return (
                      <div
                        key={plan._id}
                        className="relative flex justify-between items-center bg-gradient-dark text-white text-sm px-2 py-2 cursor-pointer"
                        onClick={() => setSelectedWorkout(plan._id)}
                      >
                        {dayjs(plan.assignedDate).format("YYYY/MM/DD")} Workout
                        plan
                        <div className="flex gap-2">
                          <button
                            className={` ${
                              workoutPlansData && selectedWorkout
                                ? "bg-white px-3 py-1 rounded-md hover:bg-gradient-dark text-gray-900 text-xs hover:text-white"
                                : "bg-gray-200 px-5 py-2 rounded-md text-gray-700"
                            }`}
                            disabled={
                              workoutPlansData && selectedWorkout ? false : true
                            }
                            onClick={editWorkoutPlan}
                          >
                            Edit
                          </button>
                          <button
                            className={` ${
                              workoutPlansData && selectedWorkout
                                ? "bg-white px-3 py-1 rounded-md hover:bg-gradient-dark text-gray-900 text-xs hover:text-white"
                                : "bg-gray-200 px-5 py-2 rounded-md text-gray-700"
                            }`}
                            disabled={
                              workoutPlansData && selectedWorkout ? false : true
                            }
                            onClick={deleteWorkoutPlan}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={plan._id}
                        className="relative flex justify-between items-center text-sm px-3 py-2 border-b border-gray-700 cursor-pointer hover:bg-gray-400"
                        onClick={() => setSelectedWorkout(plan._id)}
                      >
                        {dayjs(plan.assignedDate).format("YYYY/MM/DD")} Workout
                        plan
                      </div>
                    );
                  }
                })
              : "No workout plans are available"}
          </div>
          {/* <div>
            <p className="text-gray-700 text-sm">
              {workoutPlansData && workoutPlansData.instructions}
            </p>
            <div className="flex flex-col gap-2 mx-5 mt-2">
              <button
                className="bg-white px-5 py-2 rounded-md hover:bg-gradient-dark hover:text-white"
                onClick={newWorkoutSet}
              >
                Add new
              </button>
              <button
                className={` ${
                  workoutPlansData && selectedWorkout
                    ? "bg-white px-5 py-2 rounded-md hover:bg-gradient-dark hover:text-white"
                    : "bg-gray-200 px-5 py-2 rounded-md text-gray-700"
                }`}
                disabled={workoutPlansData && selectedWorkout ? false : true}
                onClick={editWorkoutPlan}
              >
                Edit
              </button>
              <button
                className={` ${
                  workoutPlansData && selectedWorkout
                    ? "bg-white px-5 py-2 rounded-md hover:bg-gradient-dark hover:text-white"
                    : "bg-gray-200 px-5 py-2 rounded-md text-gray-700"
                }`}
                disabled={workoutPlansData && selectedWorkout ? false : true}
                onClick={deleteWorkoutPlan}
              >
                Remove
              </button>
            </div>
          </div> */}
        </div>
      </div>
      {/* Workout Plan Templates */}
      <div className="main-container">
        <div className="header">
          <div className="title">
            <div className="header-circle"></div>Workout plan Templates
          </div>
        </div>
        <div className="h-[250px] mt-2 overflow-y-auto">
          {workoutTemplatesData?.map((template) => {
            return (
              <div
                key={template._id}
                className="text-sm bg-white rounded-md px-2 py-2 mb-2 hover:bg-gray-100 cursor-pointer"
                onClick={() =>
                  addWorkoutTemplate({ content: template.content })
                }
              >
                {template.name}
              </div>
            );
          })}
        </div>
      </div>
      {/* Workout Plan History */}
      <div className="main-container col-span-2">
        <div className="header">
          <div className="title">
            <div className="header-circle"></div>Workout Plan Editor
          </div>
          <button
            className="flex justify-between items-center bg-white px-3 py-1 rounded-md hover:bg-gradient-dark hover:text-white"
            onClick={newWorkoutSet}
          >
            Add new
            <Plus className="h-4" />
          </button>
        </div>
        <p ref={textEditerRef}></p>
        <div className="mt-2 mb-5">
          <SunEditor
            setDefaultStyle="height: 300px"
            setOptions={{
              height: 200,
              buttonList: buttonList,
            }}
            getSunEditorInstance={getSunEditorInstance}
            onImageUploadBefore={handleImageUploadBefore}
          />
        </div>
        {textEditerShow && (
          <>
            <input
              className={`px-2 py-1 outline-none rounded-md w-full mb-7 ${
                !showTemplateName && "opacity-0"
              }`}
              type="text"
              ref={templateNameRef}
              placeholder="Template Name"
            />
            <div className="flex bg-gradient-dark -mx-3 -my-3 px-2 py-2 rounded-b-lg justify-between">
              <div className="custom-checkbox flex items-center mr-2 mb-2">
                <input
                  id="save_template2"
                  type="checkbox"
                  name="user_tag"
                  className="hidden"
                  ref={templateCheckBoxRef}
                  onChange={showTemplateText}
                />
                <label htmlFor="save_template2" className="custom-radio-btn">
                  <span></span>
                  Save as a template
                </label>
              </div>
              <div>
                <button
                  className="bg-white text-sm md:text-base px-1 md:px-5 py-2 rounded-md mr-2 hover:bg-gray-300"
                  onClick={saveWorkout}
                >
                  Assign
                </button>
                <button
                  className="bg-white text-sm md:text-base px-1 md:px-5 py-2 rounded-md hover:bg-gray-300"
                  onClick={resetWorkout}
                >
                  Discard
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="main-container">
        <div className="header">
          <div className="title">
            <div className="header-circle"></div>Workout Videos
          </div>
        </div>
        <div className="h-[250px] mt-2 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-w-2 scrolling-touch">
          {workoutVideos?.map((video) => {
            return (
              <div
                key={video._id}
                className="text-sm bg-white rounded-md px-2 py-2 mb-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => loadWorkoutVideo(video._id, video.title)}
              >
                {video.title}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default WorkoutPlan;
