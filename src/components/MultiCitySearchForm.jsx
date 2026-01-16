import { useState } from "react";

const MultiCitySearchForm = ({ tripType, onTripTypeChange, onSearch }) => {
  const [segments, setSegments] = useState([
    { from: "", to: "", date: "" },
    { from: "", to: "", date: "" },
  ]);
  const [passengers, setPassengers] = useState("1 Adult, Economy");

  const handleAddSegment = () => {
    setSegments([...segments, { from: "", to: "", date: "" }]);
  };

  const handleRemoveSegment = (index) => {
    if (segments.length > 2) {
      setSegments(segments.filter((_, i) => i !== index));
    }
  };

  const handleSegmentChange = (index, field, value) => {
    const newSegments = [...segments];
    newSegments[index][field] = value;
    setSegments(newSegments);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ segments, passengers });
  };

  // ...existing code...
  return (
    <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-10">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {/* Trip Type Tabs */}
        <div className="flex flex-wrap gap-6 md:gap-8 mb-6 border-b border-gray-200 pb-4">
          {["round-trip", "one-way", "multi-city"].map((type) => (
            <label key={type} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="tripType"
                value={type}
                checked={tripType === type}
                onChange={(e) => onTripTypeChange(e.target.value)}
                className="mr-3 w-5 h-5 text-blue-600"
              />
              <span
                className={`text-lg font-medium ${
                  tripType === type ? "text-gray-800" : "text-gray-700"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")}
              </span>
            </label>
          ))}
          <label className="flex items-center cursor-pointer ml-auto">
            <input type="checkbox" className="mr-3 w-5 h-5" />
            <span className="text-lg font-medium text-gray-700">Nonstop</span>
          </label>
        </div>

        {/* Multi-City Segments */}
        <form onSubmit={handleSearch} className="space-y-4">
          {segments.map((segment, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end pb-4 border-b border-gray-200 last:border-b-0">
              <div className="md:col-span-1 flex items-center">
                <span className="text-sm font-medium text-gray-600">Trip {index + 1}</span>
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <input
                  type="text"
                  placeholder="City or Airport"
                  value={segment.from}
                  onChange={(e) => handleSegmentChange(index, "from", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <input
                  type="text"
                  placeholder="City or Airport"
                  value={segment.to}
                  onChange={(e) => handleSegmentChange(index, "to", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={segment.date}
                  onChange={(e) => handleSegmentChange(index, "date", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                {segments.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSegment(index)}
                    className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Add Segment & Passengers */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end pt-4">
            <div className="md:col-span-6">
              <button
                type="button"
                onClick={handleAddSegment}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition"
              >
                + Add Another Trip
              </button>
            </div>

            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Passengers & Class</label>
              <select 
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>1 Adult, Economy</option>
                <option>2 Adults, Economy</option>
                <option>1 Adult, Business</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MultiCitySearchForm;