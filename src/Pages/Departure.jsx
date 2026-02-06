import FlightSearchPage from "./FlightSearchPage";

export default function Departure() {
  return (
    <FlightSearchPage
      initialTripType="round-trip"
      pageTitle="Departure..."
      selectDestinationPath="/return"
    />
  );
}
