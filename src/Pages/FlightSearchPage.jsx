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
  const { state } = useLocation();

  // Get values from state
  const outboundFlight = state?.outboundFlight;
  const previousFlight = state?.flight || state?.outboundFlight;
  const isReturnPage = state?.isReturnPage || false;
  const tripTypeFromState = state?.tripType;

  const [tripType, setTripType] = useState(
    tripTypeFromState || initialTripType,
  );
  const navigate = useNavigate();

  const handleSearch = (searchData) => {
    navigate("/departure", {
      state: {
        tripType,
        searchData,
        isFromSearch: true,
      },
    });
  };

  const handleSelectFlight = (flight) => {
    console.log("isReturnPage:", isReturnPage);
    console.log("outboundFlight:", outboundFlight);
    console.log("selectedFlight:", flight);

    if (isReturnPage && outboundFlight) {
      // Return page: selected return flight -> /booking with both flights
      navigate("/booking", {
        state: {
          outboundFlight: outboundFlight,
          returnFlight: flight,
          tripType,
        },
      });
    } else if (tripType === "round-trip") {
      // Departure page for round-trip: selected outbound -> /return
      navigate("/return", {
        state: { outboundFlight: flight, tripType, isReturnPage: true },
      });
    } else if (tripType === "one-way") {
      // One-Way: /departure -> /booking
      navigate("/booking", { state: { flight, tripType } });
    }
  };

  const onTripTypeChange = (newTripType) => {
    setTripType(newTripType);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <SearchForm
        tripType={tripType}
        onTripTypeChange={onTripTypeChange}
        onSearch={handleSearch}
      />

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
