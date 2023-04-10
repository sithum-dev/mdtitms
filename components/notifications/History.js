import quotes from "../../demoData/quotes.json";

function History() {
  return (
    <div>
      <div className="h-full bg-white rounded-lg mx-2 pl-2 py-4">
        {/* Subscription Header */}
        <div className="mt-2">
          <div className="flex items-center gap-2 pl-2">
            <p className="border-r-2 pr-2">History</p>
            <p className="text-sm text-gray-600">Scheduled</p>
          </div>
          <div className="w-full h-[1px] bg-gray-600 mt-2"></div>
          {/* Quotes */}
          <div className="h-[500px] md:h-[600px] mt-4 px-2 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-w-2 scrolling-touch">
            {quotes.map((quote, key) => {
              return (
                <div
                  key={key + 1}
                  className={`flex gap-3 items-center relative shadow-md px-2 py-2 rounded-lg cursor-pointer`}
                >
                  <div>
                    <div className="pb-2 flex justify-between">
                      <p className="text-sm">06/07/2020 | 08.00 AM</p>
                      <p className="bg-gradient-dark text-white px-2 py-1 rounded-lg text-xs">
                        New user
                      </p>
                    </div>
                    <p className="text-sm">{quote.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;
