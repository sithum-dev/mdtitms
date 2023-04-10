import quotes from "../../demoData/quotes.json";

function PushNotifications() {
  return (
    <div>
      <div className="h-[600px] bg-white rounded-lg mx-2 pl-6 py-4">
        {/* Subscription Header */}
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <p>Push Notifications</p>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default PushNotifications;
