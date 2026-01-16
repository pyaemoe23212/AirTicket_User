import FlightSearchPage from "../components/FlightSearchPage";

export default function Return() {
  return (
    <FlightSearchPage
      initialTripType="round-trip"
      pageTitle="Returning..."
      showSelectedPreviousFlight={true}
    />
  );
}