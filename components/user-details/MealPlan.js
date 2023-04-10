import { useEffect, useRef, useState } from "react";
import { ChevronRight, Plus, Table, XCircle } from "react-feather";
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

// import { buttonList } from "suneditor-react";

import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

const htmlToDraft =
  typeof window === "object" && require("html-to-draftjs").default;

function MealPlan() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const userGet = useSelector(selectUser);

  const [mealPlansData, setMealPlansData] = useState(null);
  const [recipieTemplates, setRecipieTemplates] = useState(null);
  const [mealPlanTemplatesData, setMealPlanTemplatesData] = useState(null);
  const [mealPlanLoading, setMealPlanLoading] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [textEditerShow, setTextEditerShow] = useState(false);
  const textEditerRef = useRef(null);
  const templateCheckBoxRef = useRef();
  const templateNameRef = useRef();
  const [showTemplateName, setShowTemplateName] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
        url: "/api/mealPlan/" + userGet.userid,
      })
        .then((res) => {
          editor.current.hide();
          setMealPlansData(res.data.data[0]);
          setSelectedMealPlan(res.data.data[0]?.mealPlans[0]?._id);
          setMealPlan(res.data.data[0]?._id);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      return userGet;
    }
  }, [userGet, mealPlanLoading]);

  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

  //Get Meal Plan Templates
  useEffect(async () => {
    await axios({
      method: "GET",
      url: "/api/mealPlan/getTemplates",
    })
      .then((res) => {
        return setMealPlanTemplatesData(res.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
    return () => {};
  }, [mealPlanLoading]);

  useEffect(async () => {
    await axios({
      method: "GET",
      url: "/api/mealPlan/getRecipeTemplates",
    })
      .then((res) => {
        return setRecipieTemplates(res.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
    return () => {};
  }, []);

  const resetWorkout = () => {
    editor.current.setContents("");
  };

  const newMealPlanSet = () => {
    setTextEditerShow(true);
    editor.current.show();
    setSelectedMealPlan(null);
    textEditerRef.current.scrollIntoView();
    // editor.current.setContents("<p></p>");
  };

  const saveWorkout = async () => {
    let data = {
      userId: userGet.userid,
      mealPlansData: editor.current.getContents(),
      mealPlanId: mealPlan && mealPlan,
      subMealPlanId: selectedMealPlan && selectedMealPlan,
      saveAsTemplate: templateCheckBoxRef.current.checked,
      templateName: templateNameRef.current.value,
    };

    await axios({
      method: "POST",
      url: "/api/mealPlan/" + userGet.userid,
      data: data,
    })
      .then((res) => {
        editor.current.setContents("");
        setMealPlanLoading(mealPlanLoading ? null : true);
        toast.success("Meal plan updated successfully!", notificationsSettings);
        setTextEditerShow(false);
        editor.current.hide();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const addMealPlanTemplate = ({ content }) => {
    editor.current.insertHTML(content, true, true);
  };

  const editMealPlan = async () => {
    editor.current.setContents("");
    await axios({
      method: "GET",
      url:
        "/api/mealPlan/byID/?dietPlanId=" +
        mealPlan +
        "&subDietPlanId=" +
        selectedMealPlan,
    })
      .then((res) => {
        textEditerRef.current.scrollIntoView();
        editor.current.insertHTML(
          res.data.data[0].mealPlans.content,
          true,
          true
        );
        editor.current.show();
        setTextEditerShow(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteMealPlan = async () => {
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
            "/api/mealPlan/" +
            userGet.userid +
            "/?dietPlanId=" +
            mealPlan +
            "&subDietPlanId=" +
            selectedMealPlan,
        })
          .then((res) => {
            setMealPlanLoading(mealPlanLoading ? null : true);
          })
          .catch((e) => {
            console.log(e);
          });
        Swal.fire("Deleted!", "Meal Plan has been deleted.", "success");
      }
    });
  };

  const showTemplateText = () => {
    if (templateCheckBoxRef.current.checked) {
      setShowTemplateName(true);
    } else {
      setShowTemplateName(false);
    }
  };

  //Load Recipie Template to HTML Editor
  const loadRecipieTemplate = (id, title) => {
    const html = '<a href="recipe:' + id + '">' + title + "</a>";
    editor.current.insertHTML(html, true, true);
  };

  const handleImageUploadBefore = (files, info, uploadHandler) => {
    // if (imageUpload == null) return;

    const imageRef = ref(storage, `html_editer/${v4()}${files[0].name}`);

    uploadBytes(imageRef, files[0]).then((snapshot) => {
      console.log(snapshot);
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
      {/* Meal Plans */}
      <div className="main-container col-span-2">
        <div className="header">
          <div className="title">
            <div className="header-circle"></div>Meal Plans
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 mt-2">
          <div className="h-[250px] mt-2 overflow-y-auto">
            {mealPlansData
              ? mealPlansData.mealPlans.map((plan, key) => {
                  if (selectedMealPlan == plan._id) {
                    return (
                      <div
                        key={plan._id}
                        className="relative flex justify-between items-center bg-gradient-dark text-white text-sm px-2 py-2 cursor-pointer"
                        onClick={() => setSelectedMealPlan(plan._id)}
                      >
                        {dayjs(plan.assignedDate).format("YYYY/MM/DD")} Meal
                        plan
                        <div className="flex gap-2">
                          <button
                            className={` ${
                              mealPlansData && selectedMealPlan
                                ? "bg-white px-3 py-1 rounded-md hover:bg-gradient-dark text-gray-900 text-xs hover:text-white"
                                : "bg-gray-200 px-5 py-2 rounded-md text-gray-700"
                            }`}
                            disabled={
                              mealPlansData && selectedMealPlan ? false : true
                            }
                            onClick={editMealPlan}
                          >
                            Edit
                          </button>
                          <button
                            className={` ${
                              mealPlansData && selectedMealPlan
                                ? "bg-white px-3 py-1 rounded-md hover:bg-gradient-dark text-gray-900 text-xs hover:text-white"
                                : "bg-gray-200 px-5 py-2 rounded-md text-gray-700"
                            }`}
                            disabled={
                              mealPlansData && selectedMealPlan ? false : true
                            }
                            onClick={deleteMealPlan}
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
                        onClick={() => setSelectedMealPlan(plan._id)}
                      >
                        {dayjs(plan.assignedDate).format("YYYY/MM/DD")} Meal
                        plan
                      </div>
                    );
                  }
                })
              : "No workout plans are available"}
          </div>
        </div>
      </div>
      {/* Meal Plan Templates */}
      <div className="main-container">
        <div className="header">
          <div className="title">
            <div className="header-circle"></div>Meal plan Templates
          </div>
        </div>
        <div className="h-[250px] mt-2 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-w-2 scrolling-touch">
          {mealPlanTemplatesData?.map((template) => {
            return (
              <div
                key={template._id}
                className="text-sm bg-white rounded-md px-2 py-2 mb-2 hover:bg-gray-100 cursor-pointer"
                onClick={() =>
                  addMealPlanTemplate({ content: template.content })
                }
              >
                {template.name}
              </div>
            );
          })}
        </div>
      </div>
      {/* Meal Plan History */}
      <div className="main-container col-span-2">
        <div className="header">
          <div className="title">
            <div className="header-circle"></div>Meal Plan Editer
          </div>
          <button
            className="flex justify-between items-center bg-white px-3 py-1 rounded-md hover:bg-gradient-dark hover:text-white"
            onClick={newMealPlanSet}
          >
            Add new <Plus className="h-4" />
          </button>
        </div>
        <p ref={textEditerRef}></p>
        <div className="mt-2 mb-2 relative">
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
                  id="save_template1"
                  type="checkbox"
                  name="user_tag"
                  className="hidden"
                  ref={templateCheckBoxRef}
                  onChange={showTemplateText}
                />
                <label htmlFor="save_template1" className="custom-radio-btn">
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
            <div className="header-circle"></div>Recipie Templates
          </div>
        </div>
        <div className="h-[250px] mt-2 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-w-2 scrolling-touch">
          {recipieTemplates?.map((recipie) => {
            return (
              <div
                key={recipie._id}
                className="text-sm bg-white rounded-md px-2 py-2 mb-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => loadRecipieTemplate(recipie._id, recipie.title)}
              >
                {recipie.title}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MealPlan;
