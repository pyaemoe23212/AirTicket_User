import { useEffect, useState } from "react";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const isValidDateString = (value) => {
  if (!DATE_RE.test(value)) return false;

  const [y, m, d] = value.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));

  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
};

const sanitizeDateInput = (value) => value.replace(/[^\d-]/g, "").slice(0, 10);

const normalizeDateInput = (value) => {
  const v = value.trim();
  const m = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!m) return v;
  const y = m[1];
  const mo = String(Number(m[2])).padStart(2, "0");
  const d = String(Number(m[3])).padStart(2, "0");
  return y + "-" + mo + "-" + d;
};

const makeInitialSearchData = (initialValues) => ({
  from: initialValues?.origin || initialValues?.from || "",
  to: initialValues?.destination || initialValues?.to || "",
  departureDate:
    initialValues?.departure_date || initialValues?.departureDate || "2026-04-10",
  returnDate:
    initialValues?.return_date || initialValues?.returnDate || "2026-04-15",
  passengers: Math.max(1, Number(initialValues?.adults || initialValues?.passengers || 1)),
});

const SearchForm = ({ tripType, onTripTypeChange, onSearch, initialValues }) => {
  const [searchData, setSearchData] = useState(() => makeInitialSearchData(initialValues));
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    if (!initialValues) return;
    setSearchData(makeInitialSearchData(initialValues));
  }, [initialValues]);

  const handleSearch = (e) => {
    e.preventDefault();
    setDateError("");

    const normalizedDeparture = normalizeDateInput(searchData.departureDate);
    const normalizedReturn = normalizeDateInput(searchData.returnDate);

    setSearchData((prev) => ({
      ...prev,
      departureDate: normalizedDeparture,
      returnDate: normalizedReturn,
    }));

    if (!isValidDateString(normalizedDeparture)) {
      setDateError("Departure date must be YYYY-MM-DD.");
      return;
    }

    if (tripType === "round-trip" && !isValidDateString(normalizedReturn)) {
      setDateError("Return date must be YYYY-MM-DD.");
      return;
    }

    const payload = {
      origin: searchData.from.trim().toUpperCase(),
      destination: searchData.to.trim().toUpperCase(),
      departure_date: normalizedDeparture,
      adults: Number(searchData.passengers),
      trip_type: tripType,
    };

    if (tripType === "round-trip") {
      payload.return_date = normalizedReturn;
    }

    onSearch(payload);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-10">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-wrap gap-6 md:gap-8 mb-6 border-b border-gray-200 pb-4">
          {["round-trip", "one-way"].map((type) => (
            <label key={type} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="tripType"
                value={type}
                checked={tripType === type}
                onChange={(e) => onTripTypeChange(e.target.value)}
                className="mr-3 w-5 h-5 text-blue-600"
              />
              <span className={tripType === type ? "text-lg font-medium text-gray-800" : "text-lg font-medium text-gray-700"}>
                {type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")}
              </span>
            </label>
          ))}

        </div>

        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
        >
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-500 mb-1">
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
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </button>
          </div>

          <div className="md:col-span-2">
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
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Departure date
            </label>
            <input
              type="date"
              value={searchData.departureDate}
              onChange={(e) =>
                setSearchData({
                  ...searchData,
                  departureDate: sanitizeDateInput(e.target.value),
                })
              }
              onBlur={() =>
                setSearchData((prev) => ({
                  ...prev,
                  departureDate: normalizeDateInput(prev.departureDate),
                }))
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
              required
            />
          </div>

          {tripType === "round-trip" && (
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Return date
              </label>
              <input
                type="date"
                value={searchData.returnDate}
                onChange={(e) =>
                  setSearchData({
                    ...searchData,
                    returnDate: sanitizeDateInput(e.target.value),
                  })
                }
                onBlur={() =>
                  setSearchData((prev) => ({
                    ...prev,
                    returnDate: normalizeDateInput(prev.returnDate),
                  }))
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
                required
              />
            </div>
          )}

          <div className="md:col-span-2 max-w-[180px]">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Number of passengers
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setSearchData((prev) => ({
                    ...prev,
                    passengers: Math.max(1, Number(prev.passengers) - 1),
                  }))
                }
                className="w-7 h-7 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200"
              >
                -
              </button>

              <input
                type="text"
                value={searchData.passengers}
                readOnly
                className="w-10 h-7 text-center text-sm border border-gray-300 rounded"
              />

              <button
                type="button"
                onClick={() =>
                  setSearchData((prev) => ({
                    ...prev,
                    passengers: Number(prev.passengers) + 1,
                  }))
                }
                className="w-7 h-7 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>

          <div className="md:col-span-1">
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Search
            </button>
          </div>
        </form>

        {dateError && <p className="mt-3 text-sm text-red-600">{dateError}</p>}
      </div>
    </div>
  );
};

export default SearchForm;