import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/reducers/userSlice";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const EditUserDetails = () => {
  const userGet = useSelector(selectUser);
  const [loading, setLoading] = useState(null);
  const [optionsData, setOptionsData] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const nicRef = useRef();
  const perFileNoRef = useRef();
  const appDateRef = useRef();
  const dobRef = useRef();
  const scaleRef = useRef();
  const serviceRef = useRef();
  const postRef = useRef();
  const gradeRef = useRef();
  const serviceCategoryRef = useRef();
  const belongingToRef = useRef();
  const employmentStatusRef = useRef();
  const levelRef = useRef();
  const titleRef = useRef();
  const initialsRef = useRef();
  const initialsNameRef = useRef();
  const lastNameRef = useRef();
  const commonNameRef = useRef();
  const sexRef = useRef();
  const perAddRef = useRef();
  const emailRef = useRef();
  const mobileNoRef = useRef();
  const currentStateRef = useRef();

  const notificationsSettings = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  useEffect(async () => {
    if (userGet) {
      // get user data bt id
      setUserLoading(true);
      await axios({
        method: "GET",
        url: "/api/users/" + userGet.userid,
      })
        .then((res) => {
          setDataToFields(res.data.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      return userGet;
    }
  }, [userGet]);

  const setDataToFields = (data) => {
    nicRef.current.value = data.nic;
    perFileNoRef.current.value = data.perFileNo;
    appDateRef.current.value = dayjs(data.appDate).format("YYYY-MM-DD");
    dobRef.current.value = dayjs(data.dob).format("YYYY-MM-DD");
    scaleRef.current.value = data.scaleCode._id;
    serviceRef.current.value = data.serviceCode._id;
    postRef.current.value = data.postCode._id;
    gradeRef.current.value = data.grade;
    serviceCategoryRef.current.value = data.serviceCategory;
    belongingToRef.current.value = data.belongingTo;
    employmentStatusRef.current.value = data.employmentStatus;
    levelRef.current.value = data.level;
    titleRef.current.value = data.title;
    initialsRef.current.value = data.initials;
    initialsNameRef.current.value = data.initialsName;
    lastNameRef.current.value = data.lastName;
    commonNameRef.current.value = data.commonName;
    sexRef.current.value = data.sex;
    perAddRef.current.value = data.perAdd;
    emailRef.current.value = data.email;
    mobileNoRef.current.value = data.mobileNo;
    currentStateRef.current.value = data.currentState;
  };

  const fetchData = async () => {
    await axios({
      method: "GET",
      url: "/api/users/getCreateUserData",
    })
      .then((res) => {
        setOptionsData(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    let data = {
      nic: nicRef.current.value,
      perFileNo: perFileNoRef.current.value,
      appDate: appDateRef.current.value,
      dob: dobRef.current.value,
      scaleCode: scaleRef.current.value,
      serviceCode: serviceRef.current.value,
      postCode: postRef.current.value,
      grade: gradeRef.current.value,
      serviceCategory: serviceCategoryRef.current.value,
      belongingTo: belongingToRef.current.value,
      employmentStatus: employmentStatusRef.current.value,
      level: levelRef.current.value,
      title: titleRef.current.value,
      initials: initialsRef.current.value,
      initialsName: initialsNameRef.current.value,
      lastName: lastNameRef.current.value,
      commonName: commonNameRef.current.value,
      sex: sexRef.current.value,
      perAdd: perAddRef.current.value,
      email: emailRef.current.value,
      mobileNo: mobileNoRef.current.value,
      currentState: currentStateRef.current.value,
      status: 1,
    };

    await axios({
      method: "POST",
      url: "/api/users/updateUser",
      data: { data: data },
      params: { uid: userGet.userid },
    })
      .then((res) => {
        // setDataRelaod(dataRelaod ? null : true);
        toast.success("Officer Updated successfully!", notificationsSettings);
      })
      .catch((e) => {
        console.log(e);
      });

    setLoading(false);
  };

  return (
    <div className="relativepy-3 flex-auto">
      <form onSubmit={onSubmit}>
        <div className="my-4 px-2 grid grid-cols-3">
          <div className="form-col">
            <div className="flex items-baseline gap-1 text-sm mx-3">
              <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
              Title
            </div>
            <select className="form-control" ref={titleRef}>
              <option value="">Select Option</option>
              <option value="Dr">Dr</option>
              <option value="Miss">Miss</option>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Ms">Ms</option>
              <option value="Rev">Rev</option>
            </select>
          </div>
          <div className="form-col">
            <div className="flex items-baseline gap-1 text-sm mx-3">
              <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
              Initials
            </div>
            <input
              className="form-control"
              type="text"
              placeholder="Initials"
              ref={initialsRef}
            />
          </div>
          <div className="form-col">
            <div className="flex items-baseline gap-1 text-sm mx-3">
              <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
              Initials Name
            </div>
            <input
              className="form-control"
              type="text"
              placeholder="Initials Name"
              ref={initialsNameRef}
            />
          </div>
          <div className="form-col">
            <div className="flex items-baseline gap-1 text-sm mx-3">
              <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
              Last Name
            </div>
            <input
              className="form-control"
              type="text"
              placeholder="Last Name"
              ref={lastNameRef}
            />
          </div>
          <div className="form-col">
            <div className="flex items-baseline gap-1 text-sm mx-3">
              <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
              Common Name
            </div>
            <input
              className="form-control"
              type="text"
              placeholder="Common Name"
              ref={commonNameRef}
            />
          </div>
          <div className="form-col">
            <div className="flex items-baseline gap-1 text-sm mx-3">
              <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
              Sex
            </div>
            <select className="form-control" ref={sexRef}>
              <option value="">Select Option</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="form-col">
            <div className="flex items-baseline gap-1 text-sm mx-3">
              <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
              Permenant Address
            </div>
            <input
              className="form-control"
              type="text"
              placeholder="Permenant Address"
              ref={perAddRef}
            />
          </div>
          <div className="form-col">
            <div className="flex items-baseline gap-1 text-sm mx-3">
              <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
              Email
            </div>
            <input
              className="form-control"
              type="email"
              placeholder="Email"
              ref={emailRef}
            />
          </div>
          <div className="form-col">
            <div className="flex items-baseline gap-1 text-sm mx-3">
              <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
              Mobile Number
            </div>
            <input
              className="form-control"
              type="text"
              placeholder="Mobile Number"
              ref={mobileNoRef}
            />
          </div>
          <div className="form-col">
            <div className="flex items-baseline gap-1 text-sm mx-3">
              <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
              NIC
            </div>
            <input
              className="form-control"
              type="text"
              placeholder="NIC"
              ref={nicRef}
              required
            />
          </div>
          <div className="form-col">
            <div className="flex items-baseline gap-1 text-sm mx-3">
              <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
              Per File No
            </div>
            <input
              className="form-control"
              type="text"
              placeholder="Per File No"
              ref={perFileNoRef}
              required
            />
          </div>
          <div className="form-col">
            <div className="flex items-baseline gap-1 text-sm mx-3">
              <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
              Appointment Date
            </div>
            <input
              className="form-control"
              type="date"
              ref={appDateRef}
              required
            />
          </div>
          <div className="form-col">
            <div className="flex items-baseline gap-1 text-sm mx-3">
              <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
              Date of Birth
            </div>
            <input className="form-control" type="date" ref={dobRef} required />
          </div>
          <div className="form-col">
            <div className="flex items-baseline gap-1 text-sm mx-3">
              <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
              Scale
            </div>
            <select className="form-control" ref={scaleRef} required>
              <option value="">Select Scale</option>
              {optionsData?.scales.data.map((scale, key) => {
                return (
                  <option value={scale._id} key={key}>
                    {scale.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-col">
            <div className="flex items-baseline gap-1 text-sm mx-3">
              <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
              Service
            </div>
            <select className="form-control" ref={serviceRef} required>
              <option value="">Select Service</option>
              {optionsData?.servies.data.map((servie, key) => {
                return (
                  <option value={servie._id} key={key}>
                    {servie.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-col">
            <div className="flex items-baseline gap-1 text-sm mx-3">
              <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
              Post
            </div>
            <select className="form-control" ref={postRef} required>
              <option value="">Select Post</option>
              {optionsData?.posts.data.map((post, key) => {
                return (
                  <option value={post._id} key={key}>
                    {post.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-col">
            <div className="flex items-baseline gap-1 text-sm mx-3">
              <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
              Grade
            </div>
            <input
              className="form-control"
              type="text"
              placeholder="Grade"
              ref={gradeRef}
            />
          </div>
          <div className="form-col">
            <div className="flex items-baseline gap-1 text-sm mx-3">
              <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
              Service Category
            </div>
            <select className="form-control" ref={serviceCategoryRef} required>
              <option value="">Select Category</option>
              <option value="Combined">Combined</option>
              <option value="Closed">Closed</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-col">
            <div className="flex items-baseline gap-1 text-sm mx-3">
              <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
              Belonging To
            </div>
            <select className="form-control" ref={belongingToRef} required>
              <option value="">Select Option</option>
              <option value="Central Government">Central Government</option>
              <option value="Provincial Council">Provincial Council</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-col">
            <div className="flex items-baseline gap-1 text-sm mx-3">
              <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
              Employment Status
            </div>
            <input
              className="form-control"
              type="text"
              placeholder="Employment Status"
              ref={employmentStatusRef}
            />
          </div>
          <div className="form-col">
            <div className="flex items-baseline gap-1 text-sm mx-3">
              <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
              Level
            </div>
            <select className="form-control" ref={levelRef}>
              <option value="">Select Option</option>
              <option value="Primary">Primary</option>
              <option value="Secondary">Secondary</option>
              <option value="Senior">Senior</option>
              <option value="Teritory">Teritory</option>
            </select>
          </div>
          <div className="form-col">
            <div className="flex items-baseline gap-1 text-sm mx-3">
              <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
              Current State
            </div>
            <select className="form-control" ref={currentStateRef}>
              <option value="">Select Option</option>
              <option value="Working">Working</option>
              <option value="Transfered">Transfered</option>
              <option value="Secondment">Secondment</option>
              <option value="Transfered">Transfered</option>
              <option value="Retired">Retired</option>
              <option value="Interdict">Interdict</option>
              <option value="Injured">Injured</option>
              <option value="Dismissed">Dismissed</option>
              <option value="Disabled">Disabled</option>
              <option value="Dead">Dead</option>
            </select>
          </div>
        </div>
        <div className="text-center mt-4">
          <button
            className={
              loading
                ? "bg-gray-500 text-white px-10 py-2 text-sm rounded-full cursor-wait"
                : "bg-gradient-dark text-white px-10 py-2 text-sm rounded-full"
            }
            disabled={loading}
            type="submit"
          >
            Edit User
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserDetails;
