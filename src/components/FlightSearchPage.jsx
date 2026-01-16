import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import HeroSection from "./HeroSection";
import SearchForm from "./SearchForm";
import MultiCitySearchForm from "./MultiCitySearchForm";
import ResultsSection from "./ResultsSection";
import AboutSection from "./AboutSection";

const FlightSearchPage = ({
  initialTripType = "round-trip",
  pageTitle = "Available Flights",
  selectDestinationPath = "/departure",
  showSelectedPreviousFlight = false,
}) => {
  const { state } = useLocation();
  
  // Get values from state
  const outboundFlight = state?.outboundFlight;
  const previousFlight = state?.flight || state?.outboundFlight;
  const isReturnPage = state?.isReturnPage || false;
  const tripTypeFromState = state?.tripType;

  const [tripType, setTripType] = useState(tripTypeFromState || initialTripType);
  const navigate = useNavigate();

  const handleSearch = (searchData) => {
    navigate("/departure", { 
      state: { 
        tripType, 
        searchData,
        isFromSearch: true 
      } 
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
          tripType 
        } 
      });
    } else if (tripType === "round-trip") {
      // Departure page for round-trip: selected outbound -> /return
      navigate("/return", { state: { outboundFlight: flight, tripType, isReturnPage: true } });
    } else if (tripType === "one-way") {
      // One-Way: /departure -> /booking
      navigate("/booking", { state: { flight, tripType } });
    } else if (tripType === "multi-city") {
      // Multi-City: /departure -> /booking
      navigate("/booking", { state: { flights: flight, tripType } });
    }
  };

  const handleTripTypeChange = (newTripType) => {
    setTripType(newTripType);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      
      {tripType === "multi-city" ? (
        <MultiCitySearchForm 
          tripType={tripType} 
          onTripTypeChange={handleTripTypeChange}
          onSearch={handleSearch}
        />
      ) : (
        <SearchForm 
          tripType={tripType} 
          onTripTypeChange={handleTripTypeChange}
          onSearch={handleSearch}
        />
      )}
      
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