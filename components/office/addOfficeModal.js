import axios from "axios";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";

const AddOfficeModal = ({
  setAddNewOfficeModal,
  setDataRelaod,
  dataRelaod,
}) => {
  const [loading, setLoading] = useState(null);

  const officeNameRef = useRef();
  const headOfficeRef = useRef();
  const telRef = useRef();
  const faxRef = useRef();
  const webRef = useRef();
  const emailRef = useRef();

  const notificationsSettings = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

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
      method: "POST",
      url: "/api/offices/createOffice",
      data: { data: data },
    })
      .then((res) => {
        setDataRelaod(dataRelaod ? null : true);
        toast.success("New office added successfully!", notificationsSettings);
      })
      .catch((e) => {
        console.log(e);
      });

    setLoading(false);
    setAddNewOfficeModal(false);
  };
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between px-5 py-3 border-b border-solid border-blueGray-200 rounded-t bg-gradient-dark">
              <h3 className="text-xl font-semibold text-white">
                Add New Office
              </h3>
              <button
                className="ml-auto bg-transparent border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setAddNewOfficeModal(false)}
              >
                ×
              </button>
            </div>
            {/*body*/}
            <div className="relative px-6 py-3 flex-auto">
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
                    Submit
                  </button>
                </div>
              </form>
            </div>
            {/*footer*/}
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default AddOfficeModal;
