import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import HeroSection from "../components/HeroSection";
import SearchForm from "../components/SearchForm";
import ResultsSection from "../components/ResultsSection";
import AboutSection from "../components/AboutSection";
import { searchFlights, searchRoundTripFlights } from "../utils/api";

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

const toUiFlight = (f, index) => {
  // round-trip bundle shape
  if (f?.outbound && f?.inbound) {
    return {
      id: f.bundle_key || `BUNDLE-${index}`,
      bundleKey: f.bundle_key,
      adults: f.adults,
      airline: f.outbound.airline || "Unknown Airline",
      flightNumber: f.outbound.flight_number || "-",
      departureTime: formatTime(f.outbound.departure_time),
      arrivalTime: formatTime(f.outbound.arrival_time),
      duration: f.outbound.duration_minutes
        ? `${f.outbound.duration_minutes} min`
        : "-",
      stops: 0,
      class: "Economy",
      price: f.final_price_usd ?? f.base_price_usd ?? 0,
      priceMMK: f.final_price_mmk ?? null,
      origin: f.outbound.origin,
      destination: f.outbound.destination,
      outbound: f.outbound,
      inbound: f.inbound,
    };
  }

  // one-way shape
  return {
    id:
      f.id ||
      f.flight_id ||
      f.external_flight_id ||
      `${f.flight_number || "F"}-${index}`,
    airline: f.airline || f.airline_name || "Unknown Airline",
    flightNumber: f.flightNumber || f.flight_number || "-",
    departureTime: formatTime(f.departureTime || f.departure_time),
    arrivalTime: formatTime(f.arrivalTime || f.arrival_time),
    duration:
      f.duration || (f.duration_minutes ? `${f.duration_minutes} min` : "-"),
    stops: f.stops ?? f.stop_count ?? 0,
    class: f.class || f.cabin_class || "Economy",
    price: f.price ?? f.final_price_usd ?? f.fare ?? f.amount ?? 0,
    origin: f.origin || f.from,
    destination: f.destination || f.to,
  };
};

const pickList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.flights)) return res.flights;
  if (Array.isArray(res?.results)) return res.results;
  if (Array.isArray(res?.items)) return res.items;
  if (Array.isArray(res?.data)) return res.data;
  return [];
};

const FlightSearchPage = ({
  initialTripType = "round-trip",
  pageTitle = "Available Flights",
  showSelectedPreviousFlight = false,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isReturnPage = location.pathname === "/return";

  const state = location.state || {};
  const tripTypeFromState = state.tripType;
  const outboundFlight = state.outboundFlight;
  const previousFlight = state.outboundFlight || state.flight;

  const [tripType, setTripType] = useState(
    tripTypeFromState || initialTripType,
  );
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSearch, setActiveSearch] = useState(state.searchData || null);

  const buildParams = (raw) => {
    const origin = (raw?.origin || raw?.from || "").toUpperCase();
    const destination = (raw?.destination || raw?.to || "").toUpperCase();
    const departure_date =
      raw?.departure_date || raw?.departureDate || raw?.date || "";
    const return_date = raw?.return_date || raw?.returnDate || "";

    return {
      origin,
      destination,
      departure_date,
      return_date, // keep for round-trip
      adults: Number(raw?.adults || raw?.passengers || 1),
      page: Number(raw?.page || 1),
    };
  };

  const executeSearch = async (raw) => {
    try {
      setLoading(true);
      setError("");
      setActiveSearch(raw);

      const params = buildParams(raw);

      // Always single-leg search for selection flow:
      // Departure page: RGN -> BKK
      // Return page: BKK -> RGN (swapped in buildParams when isReturnPage)
      let res;
      if (tripType === "round-trip") {
        res = await searchRoundTripFlights(params);
      } else {
        res = await searchFlights(params);
      }

      setFlights(pickList(res).map(toUiFlight));
    } catch (e) {
      setError(e.message || "Failed to fetch flights");
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state.searchData) {
      executeSearch(state.searchData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  const handleSearch = (searchData) => {
    const targetPath = isReturnPage
      ? "/return"
      : tripType === "one-way"
        ? "/one-way"
        : "/departure";

    if (location.pathname !== targetPath) {
      navigate(targetPath, { state: { tripType, searchData } });
      return;
    }

    executeSearch(searchData);
  };

  const handleSelectFlight = (flight) => {
    if (tripType === "round-trip") {
      if (!isReturnPage) {
        navigate("/return", {
          state: {
            tripType,
            outboundFlight: flight,
            searchData: activeSearch,
          },
        });
        return;
      }

      // return page selection -> booking with both flights
      navigate("/booking", {
        state: {
          tripType,
          outboundFlight,
          returnFlight: flight,
        },
      });
      return;
    }

    navigate("/booking", {
      state: { tripType, outboundFlight: flight },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <SearchForm
        tripType={tripType}
        onTripTypeChange={setTripType}
        onSearch={handleSearch}
      />

      <ResultsSection
        pageTitle={pageTitle}
        previousFlight={previousFlight}
        showSelectedPreviousFlight={showSelectedPreviousFlight}
        onSelectFlight={handleSelectFlight}
        flights={flights}
        loading={loading}
        error={error}
        onRetry={() => activeSearch && executeSearch(activeSearch)}
      />

      <AboutSection />
    </div>
  );
};

export default FlightSearchPage;
