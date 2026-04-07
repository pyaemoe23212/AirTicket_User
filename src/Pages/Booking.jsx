import { useLocation, useNavigate } from "react-router";
import BookingForm from "../components/BookingForm";

export default function Booking() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const tripType = state?.tripType;
  const outbound = state?.outboundFlight;
  const ret = state?.returnFlight;

  if (!outbound) {
    navigate("/departure");
    return null;
  }

  const selectedFlights = [
    { ...outbound, label: "Outbound" },
    ...(tripType === "round-trip" && ret ? [{ ...ret, label: "Return" }] : []),
  ];

  const initialAdults = Math.max(1, Number(state?.searchData?.adults || state?.searchData?.passengers || outbound?.adults || 1));

  return (<BookingForm selectedFlights={selectedFlights} tripType={tripType} initialAdults={initialAdults} />);
}
