// src/pages/Return.jsx
import { useLocation } from "react-router";
import { useState } from "react";
import { mockFlights } from "../data/mockFlights";
import FlightCard from "../components/FlightCard";
import { useNavigate } from "react-router";

const Return = () => {
  const { state } = useLocation();
  const outboundFlight = state?.outboundFlight;
  const [tripType, setTripType] = useState("round-trip");
  const navigate = useNavigate();

  const handleSelectFlight = (returnFlight) => {
    // Pass both flights to Booking
    navigate("/booking", { state: { outboundFlight, returnFlight } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gray-200 h-64 flex items-center justify-center">
        <div className="text-center">  
          <p className="text-gray-600">[HERO IMAGE PLACEHOLDER]</p>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-7xl mx-auto px-4 mt-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Trip Type Tabs */}
          <div className="flex gap-8 mb-6 border-b border-gray-200 pb-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="tripType"
                value="round-trip"
                checked={tripType === "round-trip"}
                onChange={(e) => setTripType(e.target.value)}
                className="mr-3 w-5 h-5"
              />
              <span className="text-lg font-medium text-gray-800">Round-trip</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="tripType"
                value="one-way"
                checked={tripType === "one-way"}
                onChange={(e) => setTripType(e.target.value)}
                className="mr-3 w-5 h-5"
              />
              <span className="text-lg font-medium text-gray-700">One-way</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="tripType"
                value="multi-city"
                checked={tripType === "multi-city"}
                onChange={(e) => setTripType(e.target.value)}
                className="mr-3 w-5 h-5"
              />
              <span className="text-lg font-medium text-gray-700">Multi-city</span>
            </label>
            <label className="flex items-center cursor-pointer ml-auto">
              <input type="checkbox" className="mr-3 w-5 h-5" />
              <span className="text-lg font-medium text-gray-700">Nonstop</span>
            </label>
          </div>

          {/* Search Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Leaving from</label>
              <input
                type="text"
                placeholder="City or Airport"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-1 flex justify-center">
              <button className="bg-gray-200 p-3 rounded-full hover:bg-gray-300 transition">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Going to</label>
              <input
                type="text"
                placeholder="City or Airport"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dates</label>
              <input
                type="text"
                defaultValue="Jan 15 - Jan 22"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                readOnly
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Passengers & Class</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>1 Adult, Economy</option>
              </select>
            </div>

            <div className="md:col-span-1">
              <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Flight Results */}
      <div className="max-w-7xl mx-auto px-4 mt-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Returning...</h2>
            <div className="bg-white rounded-lg shadow p-6 top-24">
              <h3 className="font-semibold text-gray-800 mb-4">Message us</h3>
              <p className="text-sm text-gray-600 mb-2">For more information</p>
              <button className="text-gray-600text-sm font-medium hover:underline">Call us</button>
              <p className="text-sm text-gray-600 mt-4">For more information</p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Flights</h2>

            {outboundFlight && (
              <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold">Selected Departure Flight:</p>
                <p>{outboundFlight.airline} • {outboundFlight.flightNumber}</p>
                <p>{outboundFlight.departureTime} – {outboundFlight.arrivalTime}</p>
              </div>
            )}

            <div className="space-y-4">
              {mockFlights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} onSelect={handleSelectFlight} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div className="max-w-7xl mx-auto px-20 py-16 white shadow-lg border border-gray-300">
        <div className="mb-10">
          <div className="flex items-center justify-start">
            <span className="block w-16 h-0.5 bg-gray-400 mr-4"></span>
            <h2 className="text-3xl font-semibold text-gray-800">About Us</h2>
            <span className="block w-16 h-0.5 bg-gray-200 ml-4"></span>
            <span className="block w-16 h-0.5 bg-gray-200 "></span>
            <span className="block w-16 h-0.5 bg-gray-200 "></span>
            <span className="block w-16 h-0.5 bg-gray-200 "></span>
            <span className="block w-16 h-0.5 bg-gray-200 "></span>
            <span className="block w-16 h-0.5 bg-gray-200 "></span>
            <span className="block w-16 h-0.5 bg-gray-200 "></span>
            <span className="block w-16 h-0.5 bg-gray-200 "></span>
            <span className="block w-16 h-0.5 bg-gray-200 "></span>
            <span className="block w-16 h-0.5 bg-gray-200 "></span>
            <span className="block w-16 h-0.5 bg-gray-200 "></span>
            <span className="block w-16 h-0.5 bg-gray-200 "></span>
            <span className="block w-16 h-0.5 bg-gray-200 "></span>
            
          </div>
        </div>

        <div className="max-w-6xl mx-2 ">
          <p className="text-lg text-gray-600 leading-relaxed ">
            We are a leading airline booking platform dedicated to transforming
            the way travelers discover and book flights worldwide. Our platform
            connects millions of passengers with thousands of airlines, offering
            comprehensive flight options, competitive pricing, and real-time
            availability.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Return;