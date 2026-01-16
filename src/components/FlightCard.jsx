const FlightCard = ({ flight, onSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition p-6 flex items-center justify-between">
      <div className="flex items-center space-x-6 flex-1">
        {/* Airline Logo */}
        <div className="bg-gray-200 border  w-16 h-16 flex items-center justify-center f">
            <span className="text-s font-bold text-gray-400 w-13 ">Logo</span>
        </div>


        {/* Flight Details */}
        <div>
          <p className="font-semibold text-gray-800">{flight.airline}</p>
          <p className="text-sm text-gray-600">{flight.flightNumber}</p>
        </div>

        {/* Time */}
        <div>
          <p className="text-lg font-semibold">{flight.departureTime} – {flight.arrivalTime}</p>
          <p className="text-sm text-gray-600">{flight.duration}</p>
        </div>

        {/* Stops & Class */}
        <div>
          <p className="text-gray-800 font-medium">{flight.stops}</p>
          <p className="text-sm text-gray-600">{flight.class}</p>
        </div>
      </div>

      {/* Price & Select */}
      <div className="text-right">
        <p className="text-2xl font-bold text-gray-800">${flight.price}</p>
        <button
          onClick={() => onSelect(flight)}
          className="mt-2 bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-900 transition"
        >
          Select
        </button>
      </div>
    </div>
  );
};

export default FlightCard;