import React from "react";
import { useState } from "react";
import { useRef } from "react";
import GetUserData from "../../hooks/getOfficeDataById";
import { useSelector, useDispatch } from "react-redux";
import { selectOffice } from "../../redux/reducers/officeSlice";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const EditOfficeDetails = () => {
  const [loading, setLoading] = useState(null);
  const [loadingLogin, setLoadingLogin] = useState(null);
  const [passReqStatus, setPassReqStatus] = useState(null);
  const officeGet = useSelector(selectOffice);
  const { office, officeReload, setOfficeReload } = GetUserData(officeGet);

  const officeNameRef = useRef();
  const headOfficeRef = useRef();
  const telRef = useRef();
  const faxRef = useRef();
  const webRef = useRef();
  const emailRef = useRef();

  const userNameRef = useRef();
  const passwordRef = useRef();
  const confPasswordRef = useRef();

  const notificationsSettings = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  useEffect(() => {
    if (office) {
      officeNameRef.current.value = office.officeName;
      headOfficeRef.current.value = office.officeHead;
      telRef.current.value = office.telephone;
      faxRef.current.value = office.fax;
      webRef.current.value = office.web;
      emailRef.current.value = office.email;
    }
  }, [office]);

  const getOfficeApiUserData = async () => {
    await axios({
      method: "PUT",
      url: "/api/offices/getOfficeApiUserData",
      params: { id: officeGet.officeid },
    })
      .then((res) => {
        if (res.data.data) {
          userNameRef.current.value = res.data.data.username;
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (officeGet) {
      getOfficeApiUserData();
    }
  }, [officeGet]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    let data = {
      officeName: officeNameRef.current.value,
      officeHead: headOfficeRef.current.value,
      telephone: telRef.current.value,
      fax: faxRef.current.value,
      web: webRef.current.value,
      email: emailRef.current.value,
    };

    await axios({
      method: "PUT",
      url: "/api/offices/updateOfficeById",
      data: { data: data },
      params: { id: officeGet.officeid },
    })
      .then((res) => {
        setOfficeReload(officeReload ? null : true);
        toast.success("Office updated successfully!", notificationsSettings);
      })
      .catch((e) => {
        console.log(e);
      });

    setLoading(false);
  };

  const onSubmitEdit = async (event) => {
    event.preventDefault();
    setLoadingLogin(true);

    let data = {
      username: userNameRef.current.value,
      password: passwordRef.current.value,
      officeId: officeGet.officeid,
    };

    await axios({
      method: "PUT",
      url: "/api/offices/updateOfficeApiUserData",
      data: { data: data },
    })
      .then((res) => {
        toast.success("Office updated successfully!", notificationsSettings);
      })
      .catch((e) => {
        console.log(e);
      });

    setLoadingLogin(false);
    passwordRef.current.value == "";
    confPasswordRef.current.value == "";
  };
  return (
    <div className="relative px-6 py-3 flex-auto">
      <h1 className="text-gray-700 font-semibold">Edit Office Data</h1>
      <form onSubmit={onSubmit}>
        <div className="my-4 px-7 grid grid-cols-3">
          <div className="form-col">
            <div className="flex items-baseline gap-1 text-sm mx-3">
              <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
              Office Name
            </div>
            <input
              className="form-control"
              type="text"
              placeholder="Office Name"
              ref={officeNameRef}
              required
            />
          </div>
          <div className="form-col">
            <div className="flex items-baseline gap-1 text-sm mx-3">
              <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
              Office Head
            </div>
            <input
              className="form-control"
              type="text"
              placeholder="Head Office"
              ref={headOfficeRef}
              required
            />
          </div>
          <div className="form-col">
            <div className="flex items-baseline gap-1 text-sm mx-3">
              <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
              Telephone
            </div>
            <input
              className="form-control"
              type="tel"
              placeholder="Telephone"
              ref={telRef}
            />
          </div>
          <div className="form-col">
            <div className="flex items-baseline gap-1 text-sm mx-3">
              <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
              Fax
            </div>
            <input
              className="form-control"
              type="tel"
              placeholder="Fax"
              ref={faxRef}
            />
          </div>
          <div className="form-col">
            <div className="flex items-baseline gap-1 text-sm mx-3">
              <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
              Web
            </div>
            <input
              className="form-control"
              type="url"
              placeholder="Website URL"
              ref={webRef}
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
        </div>
        <div className="text-center mt-4">
          <button
            className={
              loading
                ? "bg-gray-500 text-white px-10 py-2 text-sm rounded-full cursor-wait"
                : "bg-gradient-dark text-white px-10 py-2 text-sm rounded-full"
            }
            type="submit"
          >
            Edit Data
          </button>
        </div>
      </form>
      <hr className="w-full h-[2px] bg-gray-700 my-5" />
      <div>
        <h1 className="text-gray-700 font-semibold">Branch Login Management</h1>
        <form onSubmit={onSubmitEdit}>
          <div className="my-4 px-7 grid grid-cols-3">
            <div className="form-col">
              <div className="flex items-baseline gap-1 text-sm mx-3">
                <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
                User Name
              </div>
              <input
                className="form-control"
                type="text"
                placeholder="User Name"
                ref={userNameRef}
                required
              />
            </div>
            <div className="form-col">
              <div className="flex items-baseline gap-1 text-sm mx-3">
                <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
                Password
              </div>
              <input
                className="form-control"
                type="password"
                placeholder="Password"
                ref={passwordRef}
                required={passReqStatus ? false : true}
              />
            </div>
            <div className="form-col">
              <div className="flex items-baseline gap-1 text-sm mx-3">
                <div className="bg-gradient-dark h-2 w-2 rounded-full"></div>
                Confirm Password
              </div>
              <input
                className="form-control"
                type="password"
                placeholder="confirm password"
                ref={confPasswordRef}
                required={passReqStatus ? false : true}
              />
            </div>
          </div>
          <div className="text-center mt-4">
            <button
              className={
                loadingLogin
                  ? "bg-gray-500 text-white px-10 py-2 text-sm rounded-full cursor-wait"
                  : "bg-gradient-dark text-white px-10 py-2 text-sm rounded-full"
              }
              type="submit"
            >
              Update Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOfficeDetails;
