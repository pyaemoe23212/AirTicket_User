import { useState } from "react";

const SearchForm = ({ tripType, onTripTypeChange, onSearch }) => {
  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    dates: "",
    passengers: "1 Adult, Economy"
  });

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchData);
  };

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

        {/* Search Fields */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leaving from
            </label>
            <input
              type="text"
              placeholder="City or Airport"
              value={searchData.from}
              onChange={(e) => setSearchData({ ...searchData, from: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-1 flex justify-center">
            <button
              type="button"
              className="bg-gray-200 p-3 rounded-full hover:bg-gray-300 transition"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Going to
            </label>
            <input
              type="text"
              placeholder="City or Airport"
              value={searchData.to}
              onChange={(e) => setSearchData({ ...searchData, to: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Dates</label>
            <input
              type="text"
              placeholder="Select dates"
              value={searchData.dates}
              onChange={(e) => setSearchData({ ...searchData, dates: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passengers & Class
            </label>
            <select 
              value={searchData.passengers}
              onChange={(e) => setSearchData({ ...searchData, passengers: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>1 Adult, Economy</option>
              <option>2 Adults, Economy</option>
              <option>1 Adult, Business</option>
            </select>
          </div>

          <div className="md:col-span-1">
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
        </form>
      </div>
    </div>
  );
};

export default SearchForm;