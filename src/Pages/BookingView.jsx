import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getBookingDetail,
  getSecureTicket,
  getTicketStatus,
} from "../utils/api";

export default function BookingView() {
  const navigate = useNavigate();
  const { bookingId } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [ticketStatus, setTicketStatus] = useState(null);
  const [ticketStatusLoading, setTicketStatusLoading] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getBookingDetail(bookingId);

        console.log("BOOKING ID:", bookingId);
        console.log("BOOKING DETAIL:", data);
        console.log("FLIGHT SNAPSHOT:", data?.flight_snapshot);

        setBooking(data || null);
      } catch (err) {
        setError(
          err?.response?.data?.detail ||
            err?.response?.data?.message ||
            "Failed to load booking detail"
        );
        setBooking(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchTicketStatus = async () => {
      try {
        setTicketStatusLoading(true);
        const statusData = await getTicketStatus(bookingId);
        setTicketStatus(statusData || null);
      } catch (err) {
        setTicketStatus(null);
      } finally {
        setTicketStatusLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
      fetchTicketStatus();
    }
  }, [bookingId]);

  const toNumber = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };

  const formatMMK = (value) => "MMK " + toNumber(value).toLocaleString();

  const getEstimatePriceMMK = () => {
    if (!booking) return "-";

    const snap = booking.flight_snapshot || {};
    const priceMinMMK =
      snap?.price_estimate_min_mmk ||
      snap?.outbound?.price_estimate_min_mmk ||
      booking.price_estimate_min_mmk ||
      booking.final_price_mmk;

    const priceMaxMMK =
      snap?.price_estimate_max_mmk ||
      snap?.outbound?.price_estimate_max_mmk ||
      booking.price_estimate_max_mmk ||
      booking.final_price_mmk;

    if (priceMinMMK && priceMaxMMK && priceMinMMK !== priceMaxMMK) {
      return `${formatMMK(priceMinMMK)} - ${formatMMK(priceMaxMMK)}`;
    }

    return formatMMK(priceMaxMMK || priceMinMMK || 0);
  };

  const formatDate = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString();
  };

  const formatDateTime = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString();
  };

  const formatDuration = (minutes) => {
    const m = Number(minutes);
    if (!Number.isFinite(m) || m <= 0) return "-";

    const h = Math.floor(m / 60);
    const r = m % 60;

    if (h === 0) return `${r} minutes`;
    if (r === 0) return `${h}h`;
    return `${h}h ${r}m`;
  };

  const getValue = (...values) => {
    return values.find((value) => value !== undefined && value !== null && value !== "") || "-";
  };

  const statusBadge = (status) => {
    const s = String(status || "").toUpperCase();

    if (s === "CONFIRMED" || s === "COMPLETED") {
      return "bg-green-100 text-green-700";
    }

    if (s === "PENDING" || s === "PROCESSING") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (s === "CANCELLED") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  const paymentBadge = (status) => {
    const s = String(status || "").toUpperCase();

    if (s === "PAID") return "bg-green-100 text-green-700";
    if (s === "FAILED") return "bg-red-100 text-red-700";

    if (s === "PENDING" || s === "UNPAID") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  const tripTypeLabel = useMemo(() => {
    if (!booking?.type) return "-";
    if (booking.type === "ROUND_TRIP") return "Round Trip";
    if (booking.type === "ONE_WAY") return "One Way";
    return booking.type;
  }, [booking]);

  const flightData = useMemo(() => {
    const snap = booking?.flight_snapshot || {};

    const outbound =
      snap.outbound ||
      snap.departure ||
      snap.departure_flight ||
      snap.outbound_flight ||
      snap.departureFlight ||
      snap.outboundFlight ||
      null;

    const inbound =
      snap.inbound ||
      snap.return ||
      snap.return_flight ||
      snap.inbound_flight ||
      snap.returnFlight ||
      snap.inboundFlight ||
      null;

    const oneWay =
      !outbound && !inbound && Object.keys(snap).length > 0 ? snap : null;

    return {
      outbound,
      inbound,
      oneWay,
    };
  }, [booking]);

  const passengers = useMemo(() => {
    if (!booking) return [];

    if (Array.isArray(booking.passengers)) return booking.passengers;
    if (Array.isArray(booking.passenger_details)) return booking.passenger_details;
    if (Array.isArray(booking.passenger_list)) return booking.passenger_list;

    return [];
  }, [booking]);

  const handleDownloadTicket = async () => {
    try {
      setDownloading(true);

      const blob = await getSecureTicket(bookingId);
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download =
        booking.original_ticket_name ||
        booking.original_name ||
        `ticket-${booking.booking_code || bookingId}.pdf`;

      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert("Failed to download ticket: " + (err.message || "Unknown error"));
    } finally {
      setDownloading(false);
    }
  };

  const FlightSection = ({ title, data }) => {
    if (!data) return null;

    const airlineCode = getValue(data.airline_code, data.carrier_code);
    const flightNumber = getValue(data.flight_number, data.number);
    const airlineName = getValue(data.airline, data.airline_name, data.carrier_name);
    const origin = getValue(
      data.origin,
      data.from,
      data.departure_airport_code,
      data.departure_iata,
      data.origin_code
    );
    const destination = getValue(
      data.destination,
      data.to,
      data.arrival_airport_code,
      data.arrival_iata,
      data.destination_code
    );
    const departureTime = getValue(
      data.departure_time,
      data.departureTime,
      data.departure_datetime
    );
    const arrivalTime = getValue(
      data.arrival_time,
      data.arrivalTime,
      data.arrival_datetime
    );

    return (
      <section className="border-t border-gray-200 px-6 py-6">
        <h3 className="mb-5 text-2xl font-semibold text-gray-900">{title}</h3>

        <div className="grid grid-cols-1 gap-y-6 md:grid-cols-3 md:gap-x-12">
          <div>
            <p className="text-sm text-gray-500">Airline & Flight</p>
            <p className="text-lg font-medium text-gray-900">
              {[airlineCode !== "-" ? airlineCode : "", flightNumber !== "-" ? flightNumber : ""]
                .filter(Boolean)
                .join("-") || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Route</p>
            <p className="text-lg font-medium text-gray-900">
              {origin} → {destination}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Departure</p>
            <p className="text-lg font-medium text-gray-900">
              {formatDateTime(departureTime)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Arrival</p>
            <p className="text-lg font-medium text-gray-900">
              {formatDateTime(arrivalTime)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Duration</p>
            <p className="text-lg font-medium text-gray-900">
              {formatDuration(data.duration_minutes || data.duration)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Airline Name</p>
            <p className="text-lg font-medium text-gray-900">{airlineName}</p>
          </div>
        </div>
      </section>
    );
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 py-8 text-sm text-gray-600 md:px-10">
        Loading booking detail...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 py-8 md:px-10">
        <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-4 rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Back
        </button>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 py-8 text-sm text-gray-600 md:px-10">
        Booking not found.
      </div>
    );
  }

  const { outbound, inbound, oneWay } = flightData;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8 text-gray-800 md:px-10">
      <div className="mb-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Back
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
        <div className="flex items-center justify-between border-b border-gray-300 px-6 py-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              Booking {booking.booking_code || "-"}
            </h1>
            <p className="mt-1 text-base text-gray-500">
              Booked on {formatDate(booking.created_at)}
            </p>
          </div>

          <span
            className={
              "inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold " +
              statusBadge(booking.status)
            }
          >
            {booking.status || "-"}
          </span>
        </div>

        <section className="px-6 py-6">
          <h2 className="mb-5 text-2xl font-semibold text-gray-900">
            Booking Information
          </h2>

          <div className="grid grid-cols-1 gap-y-6 md:grid-cols-3 md:gap-x-12">
            <div>
              <p className="text-sm text-gray-500">Booking Code</p>
              <p className="text-xl font-semibold text-gray-900">
                {booking.booking_code || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Booking ID</p>
              <p className="break-all text-base text-gray-900">
                {booking.booking_id || booking.id || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Trip Type</p>
              <p className="text-xl font-semibold text-gray-900">
                {tripTypeLabel}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Number of Adults</p>
              <p className="text-xl font-semibold text-gray-900">
                {booking.adults ?? 1}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Estimate Price (MMK)</p>
              <p className="text-xl font-semibold text-gray-900">
                {getEstimatePriceMMK()}
              </p>
            </div>
          </div>
        </section>

        {(outbound || oneWay) && (
          <FlightSection
            title={outbound ? "Outbound Flight" : "Flight"}
            data={outbound || oneWay}
          />
        )}

        {inbound && <FlightSection title="Inbound Flight" data={inbound} />}

        {!outbound && !inbound && !oneWay && (
          <section className="border-t border-gray-200 px-6 py-6">
            <h3 className="mb-4 text-2xl font-semibold text-gray-900">
              Flight Information
            </h3>
            <div className="rounded border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700">
              No flight details found in this booking.
            </div>
          </section>
        )}

        <section className="border-t border-gray-200 px-6 py-6">
          <h3 className="mb-4 text-2xl font-semibold text-gray-900">
            Passengers
          </h3>

          {passengers.length === 0 && (
            <div className="rounded border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
              No passengers found.
            </div>
          )}

          <div className="space-y-4">
            {passengers.map((p, idx) => {
              const fullName =
                p.full_name ||
                [p.given_name, p.last_name].filter(Boolean).join(" ") ||
                [p.givenName, p.lastName].filter(Boolean).join(" ") ||
                "-";

              return (
                <div
                  key={p.id || idx}
                  className="rounded border border-gray-300 p-4"
                >
                  <h4 className="mb-3 text-lg font-semibold text-gray-900">
                    Passenger {idx + 1}
                  </h4>

                  <div className="grid grid-cols-1 gap-y-4 md:grid-cols-3 md:gap-x-10">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="text-lg font-medium text-gray-900">
                        {fullName}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Passport Number</p>
                      <p className="text-lg font-medium text-gray-900">
                        {p.passport_number || p.passport || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="text-lg font-medium text-gray-900">
                        {p.gender || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="text-lg font-medium text-gray-900">
                        {formatDate(p.date_of_birth || p.dob)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Nationality</p>
                      <p className="text-lg font-medium text-gray-900">
                        {p.nationality || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="text-lg font-medium text-gray-900">
                        {p.phone_number || p.phone || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-t border-gray-200 px-6 py-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-gray-900">
              Payment & Status
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-y-4 md:grid-cols-3 md:gap-x-12">
            <div>
              <p className="text-sm text-gray-500">Payment Status</p>
              <span
                className={
                  "mt-1 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold " +
                  paymentBadge(booking.payment_status)
                }
              >
                {booking.payment_status || "-"}
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-500">Booking Status</p>
              <span
                className={
                  "mt-1 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold " +
                  statusBadge(booking.status)
                }
              >
                {booking.status || "-"}
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-500">Booked Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDateTime(booking.created_at)}
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-gray-200 px-6 py-6">
          <h3 className="mb-4 text-2xl font-semibold text-gray-900">
            Ticket File
          </h3>

          {ticketStatusLoading ? (
            <div className="rounded border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
              Loading ticket status...
            </div>
          ) : ticketStatus?.has_ticket ? (
            <div className="space-y-4">
              <div className="rounded border border-green-200 bg-green-50 p-4">
                <p className="mb-2 text-sm font-medium text-green-700">
                  Ticket Uploaded
                </p>

                {ticketStatus?.ticket_uploaded_at && (
                  <p className="text-xs text-green-600">
                    Uploaded on{" "}
                    {formatDateTime(ticketStatus.ticket_uploaded_at)}
                  </p>
                )}
              </div>

              <button
                disabled={downloading}
                onClick={handleDownloadTicket}
                className="rounded bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {downloading ? "Downloading..." : "Download Ticket"}
              </button>
            </div>
          ) : (
            <div className="rounded border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm font-medium text-yellow-700">
                No Ticket Uploaded Yet
              </p>
              <p className="mt-1 text-xs text-yellow-600">
                The ticket file will be available once it has been uploaded by
                the airline or administrator.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}