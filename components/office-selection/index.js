import OfficeSelectBar from "./OfficeSelectBar";

function index() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
      <div>
        <OfficeSelectBar />
      </div>
    </div>
  );
}

export default index;
