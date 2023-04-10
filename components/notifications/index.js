import History from "./History";
import PushNotifications from "./PushNotifications";
import SideBar from "./SideBar";

function index() {
  return (
    <div className="mt-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="">
          <SideBar />
        </div>
        <div className="col-span-2">
          <PushNotifications />
        </div>
        <div className="">
          <History />
        </div>
      </div>
    </div>
  );
}

export default index;
