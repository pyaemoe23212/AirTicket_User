const FlightCard = ({ flight, onSelect }) => {
  return (
    <div className="border border-gray-300 p-4 flex items-center justify-between bg-white">

      {/* Left Section */}
      <div className="flex items-center space-x-6">

        {/* Logo */}
        <div className="w-14 h-14 border bg-gray-200 flex items-center justify-center text-xs text-gray-500">
          [LOGO]
        </div>

        {/* Airline Info */}
        <div>
          <p className="text-gray-700 font-medium">{flight.airline}</p>
          <p className="text-sm text-gray-500">{flight.flightNumber}</p>
        </div>

        {/* Time */}
        <div className="ml-10">
          <p className="text-gray-700">
            {flight.departureTime} - {flight.arrivalTime}
          </p>
          <p className="text-sm text-gray-500">{flight.duration}</p>
        </div>

        {/* Tags */}
        <div className="flex space-x-2 ml-10">
          <span className="border px-2 py-1 text-xs text-gray-600">
            {flight.stops}
          </span>
          <span className="border px-2 py-1 text-xs text-gray-600">
            {flight.class}
          </span>
        </div>

      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6">

        <p className="text-gray-700">${flight.price}</p>

        <button
          onClick={() => onSelect(flight)}
          className="bg-gray-700 text-white px-4 py-1 text-sm"
        >
          Select
        </button>

      </div>

    </div>
  );
};

export default FlightCard;