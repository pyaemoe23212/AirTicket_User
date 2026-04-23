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

  return `${y}-${mo}-${d}`;
};

const makeInitialSearchData = (initialValues) => ({
  from: initialValues?.origin || initialValues?.from || "",
  to: initialValues?.destination || initialValues?.to || "",
  departureDate:
    initialValues?.departure_date ||
    initialValues?.departureDate ||
    "2026-04-10",
  returnDate:
    initialValues?.return_date ||
    initialValues?.returnDate ||
    "2026-04-15",
  passengers: Math.max(
    1,
    Number(initialValues?.adults || initialValues?.passengers || 1)
  ),
});

const SearchForm = ({
  tripType,
  onTripTypeChange,
  onSearch,
  initialValues,
}) => {
  const [searchData, setSearchData] = useState(() =>
    makeInitialSearchData(initialValues)
  );
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
    <div className="max-w-6xl mx-auto px-4 relative z-20">
      <div className="bg-white rounded-2xl shadow-[0_16px_40px_rgba(15,23,42,0.12)] p-5 md:p-6">
        <div className="flex items-center gap-6 mb-5">
          {["round-trip", "one-way"].map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 cursor-pointer text-sm text-gray-700"
            >
              <input
                type="radio"
                name="tripType"
                value={type}
                checked={tripType === type}
                onChange={(e) => onTripTypeChange(e.target.value)}
                className="accent-blue-600"
              />
              <span>{type === "round-trip" ? "Round-trip" : "One-way"}</span>
            </label>
          ))}
        </div>

        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
        >
          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-gray-500 mb-2">
              Leaving from
            </label>
            <input
              type="text"
              placeholder="City or Airport"
              value={searchData.from}
              onChange={(e) =>
                setSearchData({ ...searchData, from: e.target.value })
              }
              className="w-full h-11 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-gray-500 mb-2">
              Going to
            </label>
            <div className="relative flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setSearchData((prev) => ({
                    ...prev,
                    from: prev.to,
                    to: prev.from,
                  }))
                }
                className="hidden md:flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h10m0 0l-3-3m3 3l-3 3M16 17H6m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              </button>

              <input
                type="text"
                placeholder="City or Airport"
                value={searchData.to}
                onChange={(e) =>
                  setSearchData({ ...searchData, to: e.target.value })
                }
                className="w-full h-11 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div
            className={tripType === "round-trip" ? "md:col-span-2" : "md:col-span-3"}
          >
            <label className="block text-xs font-medium text-gray-500 mb-2">
              Dates
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
              className="w-full h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-blue-500"
              required
            />
          </div>

          {tripType === "round-trip" && (
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-2 opacity-0">
                Return
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
                className="w-full h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-blue-500"
                required
              />
            </div>
          )}

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-2">
              Passengers
            </label>
            <div className="h-11 rounded-lg border border-gray-200 bg-white px-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() =>
                  setSearchData((prev) => ({
                    ...prev,
                    passengers: Math.max(1, Number(prev.passengers) - 1),
                  }))
                }
                className="w-6 h-6 flex items-center justify-center rounded border border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                -
              </button>

              <span className="text-sm font-medium text-gray-700">
                {searchData.passengers}
              </span>

              <button
                type="button"
                onClick={() =>
                  setSearchData((prev) => ({
                    ...prev,
                    passengers: Number(prev.passengers) + 1,
                  }))
                }
                className="w-6 h-6 flex items-center justify-center rounded border border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                +
              </button>
            </div>
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              className="w-full md:w-auto min-w-[160px] h-11 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Search Flights
            </button>
          </div>
        </form>

        {dateError && <p className="mt-3 text-sm text-red-600">{dateError}</p>}
      </div>
    </div>
  );
};

export default SearchForm;