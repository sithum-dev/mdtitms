import { useState } from "react";

function ViewAssignedUsers({ planUsersDetails, setShowModalUserData }) {
  const [keyList, setKeyList] = useState(Object.keys(planUsersDetails));
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-5xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between px-5 py-3 border-b border-solid border-blueGray-200 rounded-t bg-gradient-dark">
              <h3 className="text-xl font-semibold text-white">Plan Details</h3>
              <button
                className="ml-auto bg-transparent border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setShowModalUserData(false)}
              >
                ×
              </button>
            </div>
            {/*body*/}
            {keyList?.map((id, key) => {
              return (
                <div className="relative px-6 py-3 flex-auto" key={key}>
                  <h1>{planUsersDetails[id][0].office.officeName}</h1>
                  <div className="overflow-x-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-w-2 scrolling-touch">
                    <table className="user-table text-gray-400 border-separate space-y-3 text-xs w-full">
                      <thead className="bg-gradient-dark text-white">
                        <tr>
                          <th className="p-3 text-left">#</th>
                          <th className="p-3 text-left">Name</th>
                          <th className="p-3 text-left">Per File No</th>
                          <th className="p-3 text-left">Level</th>
                          <th className="p-3 text-right">Service Category</th>
                        </tr>
                      </thead>
                      <tbody>
                        {planUsersDetails[id]?.map((user, key) => {
                          return (
                            <tr
                              className="bg-gray-300 lg:text-black"
                              key={key + 1}
                            >
                              <td className="p-3">{key + 1}</td>
                              <td className="p-3">
                                {user.users.initials} {user.users.lastName}
                              </td>
                              <td className="p-3">{user.users.perFileNo}</td>
                              <td className="p-3">{user.users.level}</td>
                              <td className="p-3">
                                {user.users.serviceCategory}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}

            {/*footer*/}
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}

export default ViewAssignedUsers;
