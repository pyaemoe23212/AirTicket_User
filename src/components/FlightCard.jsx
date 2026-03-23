const FlightCard = ({ flight, onSelect }) => {
  // Handle undefined flight_snapshot
  const snapshot = flight?.flight_snapshot;
  const isRoundTrip = flight?.type === "ROUND_TRIP";
  
  // For round-trip, use outbound flight for display
  const flightData = isRoundTrip && snapshot?.outbound ? snapshot.outbound : snapshot;
  
  // Safely access price properties
  const priceMin = snapshot?.price_estimate_min_usd || flight?.final_price_usd;
  const priceMax = snapshot?.price_estimate_max_usd || flight?.final_price_usd;
  const priceDisplay = priceMin && priceMax && priceMin !== priceMax 
    ? `$${priceMin} - $${priceMax}` 
    : `$${priceMax || priceMin || flight?.final_price_usd || 0}`;

  const formatTime = (iso) => {
    if (!iso) return "--:--";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "--:--";
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Fallback values if flightData is undefined
  const airline = flightData?.airline || "Unknown Airline";
  const airline_code = flightData?.airline_code || "XX";
  const flightNumber = flightData?.flight_number || "-";
  const departureTime = formatTime(flightData?.departure_time);
  const arrivalTime = formatTime(flightData?.arrival_time);
  const duration = flightData?.duration_minutes ? `${flightData.duration_minutes} min` : "-";

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
          <p className="text-gray-700 font-medium">{airline}</p>
          <p className="text-sm text-gray-500">{airline_code}-{flightNumber}</p>
        </div>

        {/* Time */}
        <div className="ml-10">
          <p className="text-gray-700">
            {departureTime} - {arrivalTime}
          </p>
          <p className="text-sm text-gray-500">{duration}</p>
        </div>

        {/* Tags */}
        <div className="flex space-x-2 ml-10">
          <span className="border px-2 py-1 text-xs text-gray-600">
            {isRoundTrip ? "Round Trip" : "One Way"}
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        <p className="text-gray-700 font-semibold">{priceDisplay}</p>

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