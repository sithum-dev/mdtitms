import ChatBox from "./ChatBox";
import UserSelectBar from "./UserSelectBar";

function index() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
      <div>
        <UserSelectBar />
      </div>
    </div>
  );
}

export default index;
