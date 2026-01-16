import { mockFlights } from "../data/mockFlights";
import FlightCard from "./FlightCard";

const ResultsSection = ({ pageTitle, previousFlight, showSelectedPreviousFlight, onSelectFlight }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 mt-12 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{pageTitle}</h2>
          <div className="bg-white rounded-lg shadow p-6 sticky top-24">
            <h3 className="font-semibold text-gray-800 mb-4">Message us</h3>
            <p className="text-sm text-gray-600 mb-2">For more information</p>
            <button className="text-blue-600 text-sm font-medium hover:underline">
              Call us
            </button>
            <p className="text-sm text-gray-600 mt-4">For more information</p>
          </div>
        </div>

        {/* Flight Cards */}
        <div className="lg:col-span-3">
          {showSelectedPreviousFlight && previousFlight && (
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <p className="font-semibold">Selected flight:</p>
              <p>
                {previousFlight.airline} • {previousFlight.flightNumber}
              </p>
              <p>
                {previousFlight.departureTime} – {previousFlight.arrivalTime}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {mockFlights.map((flight) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                onSelect={() => onSelectFlight(flight)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;