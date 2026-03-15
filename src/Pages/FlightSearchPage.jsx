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
      type: "ROUND_TRIP",
      adults: f.adults,
      bundle_key: f.bundle_key,
      flight_snapshot: {
        bundle_key: f.bundle_key,
        adults: f.adults,
        outbound: {
          airline: f.outbound.airline,
          airline_code: f.outbound.airline_code,
          flight_number: f.outbound.flight_number,
          origin: f.outbound.origin,
          destination: f.outbound.destination,
          route: f.outbound.route,
          departure_time: f.outbound.departure_time,
          arrival_time: f.outbound.arrival_time,
          duration_minutes: f.outbound.duration_minutes,
        },
        inbound: {
          airline: f.inbound.airline,
          airline_code: f.inbound.airline_code,
          flight_number: f.inbound.flight_number,
          origin: f.inbound.origin,
          destination: f.inbound.destination,
          route: f.inbound.route,
          departure_time: f.inbound.departure_time,
          arrival_time: f.inbound.arrival_time,
          duration_minutes: f.inbound.duration_minutes,
        },
        base_price_usd: f.base_price_usd,
        final_price_usd: f.final_price_usd,
        final_price_mmk: f.final_price_mmk,
        price_estimate_min_usd: f.price_estimate_min_usd,
        price_estimate_max_usd: f.price_estimate_max_usd,
        price_estimate_min_mmk: f.price_estimate_min_mmk,
        price_estimate_max_mmk: f.price_estimate_max_mmk,
        requires_admin_confirmation: f.requires_admin_confirmation,
      },
      final_price_usd: f.final_price_usd,
      final_price_mmk: f.final_price_mmk,
    };
  }

  // one-way shape
  return {
    type: "ONE_WAY",
    adults: f.adults,
    bundle_key: f.external_flight_id,
    flight_snapshot: {
      external_flight_id: f.external_flight_id,
      airline: f.airline,
      airline_code: f.airline_code,
      flight_number: f.flight_number,
      origin: f.origin,
      destination: f.destination,
      route: f.route,
      departure_time: f.departure_time,
      arrival_time: f.arrival_time,
      duration_minutes: f.duration_minutes,
      baggage_carry_on_kg: f.baggage_carry_on_kg,
      baggage_checked_kg: f.baggage_checked_kg,
      baggage_fee: f.baggage_fee,
      baggage_info_url: f.baggage_info_url,
      base_price_usd: f.base_price_usd,
      final_price_usd: f.final_price_usd,
      final_price_mmk: f.final_price_mmk,
      price_estimate_min_usd: f.price_estimate_min_usd,
      price_estimate_max_usd: f.price_estimate_max_usd,
      price_estimate_min_mmk: f.price_estimate_min_mmk,
      price_estimate_max_mmk: f.price_estimate_max_mmk,
      requires_admin_confirmation: f.requires_admin_confirmation,
    },
    final_price_usd: f.final_price_usd,
    final_price_mmk: f.final_price_mmk,
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
