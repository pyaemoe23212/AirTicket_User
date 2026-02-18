import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import HeroSection from "../components/HeroSection";
import SearchForm from "../components/SearchForm";
import ResultsSection from "../components/ResultsSection";
import AboutSection from "../components/AboutSection";

const FlightSearchPage = ({
  initialTripType = "round-trip",
  pageTitle = "Available Flights",
  showSelectedPreviousFlight = false,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ reliable step detection
  const isReturnPage = location.pathname === "/return";

  const state = location.state || {};
  const tripTypeFromState = state.tripType;
  const outboundFlight = state.outboundFlight;
  const previousFlight = state.outboundFlight || state.flight;

  const [tripType, setTripType] = useState(tripTypeFromState || initialTripType);

  const handleSearch = (searchData) => {
    navigate("/departure", {
      state: { tripType, searchData },
    });
  };

  const handleSelectFlight = (flight) => {
    // ✅ ROUND TRIP FLOW
    if (tripType === "round-trip") {
      if (!isReturnPage) {
        // select outbound → go /return
        navigate("/return", {
          state: {
            tripType,
            outboundFlight: flight,
          },
        });
      } else {
        // select return → go /booking with both
        if (!outboundFlight) {
          // if user refresh /return, outbound lost
          navigate("/departure", { state: { tripType } });
          return;
        }

        navigate("/booking", {
          state: {
            tripType,
            outboundFlight,
            returnFlight: flight,
          },
        });
      }
      return;
    }

    // ✅ ONE WAY FLOW
    if (tripType === "one-way") {
      navigate("/booking", {
        state: {
          tripType,
          outboundFlight: flight,
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <SearchForm tripType={tripType} onTripTypeChange={setTripType} onSearch={handleSearch} />

      <ResultsSection
        pageTitle={pageTitle}
        previousFlight={previousFlight}
        showSelectedPreviousFlight={showSelectedPreviousFlight}
        onSelectFlight={handleSelectFlight}
      />

      <AboutSection />
    </div>
  );
};

export default FlightSearchPage;
