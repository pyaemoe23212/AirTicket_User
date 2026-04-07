import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getBookingDetail } from "../utils/api";

export default function BookingView() {
  const navigate = useNavigate();
  const { bookingId } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getBookingDetail(bookingId);
        setBooking(data || null);
      } catch (err) {
        setError(err?.response?.data?.detail || "Failed to load booking detail");
        setBooking(null);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) fetchBooking();
  }, [bookingId]);

  const toNumber = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };

  const formatUSD = (value) => "$" + toNumber(value).toFixed(2);
  const formatMMK = (value) => "MMK " + toNumber(value).toLocaleString();

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
    if (h === 0) return r + " minutes";
    if (r === 0) return h + "h";
    return h + "h " + r + "m";
  };

  const statusBadge = (status) => {
    const s = String(status || "").toUpperCase();
    if (s === "CONFIRMED" || s === "COMPLETED") return "bg-green-100 text-green-700";
    if (s === "PENDING") return "bg-yellow-100 text-yellow-700";
    if (s === "CANCELLED") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const paymentBadge = (status) => {
    const s = String(status || "").toUpperCase();
    if (s === "PAID") return "bg-green-100 text-green-700";
    if (s === "FAILED") return "bg-red-100 text-red-700";
    if (s === "PENDING" || s === "UNPAID") return "bg-yellow-100 text-yellow-700";
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
    return {
      outbound: snap.outbound || null,
      inbound: snap.inbound || null,
      oneWay: !snap.outbound && !snap.inbound ? snap : null,
    };
  }, [booking]);

  const passengers = useMemo(() => {
    if (!booking) return [];
    if (Array.isArray(booking.passengers)) return booking.passengers;
    if (Array.isArray(booking.passenger_details)) return booking.passenger_details;
    if (Array.isArray(booking.passenger_list)) return booking.passenger_list;
    return [];
  }, [booking]);

  const ticketUrl =
    booking?.ticket_file_url ||
    booking?.ticket_url ||
    booking?.ticket_file ||
    booking?.uploaded_file_url ||
    "";

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

  const FlightSection = ({ title, data }) => {
    if (!data) return null;
    return (
      <section className="border-t border-gray-200 px-6 py-6">
        <h3 className="mb-5 text-2xl font-semibold text-gray-900">{title}</h3>
        <div className="grid grid-cols-1 gap-y-6 md:grid-cols-3 md:gap-x-12">
          <div>
            <p className="text-sm text-gray-500">Airline & Flight</p>
            <p className="text-lg font-medium text-gray-900">{data.flight_number || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Route</p>
            <p className="text-lg font-medium text-gray-900">
              {(data.origin || "-") + " → " + (data.destination || "-")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Departure</p>
            <p className="text-lg font-medium text-gray-900">{formatDateTime(data.departure_time)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Arrival</p>
            <p className="text-lg font-medium text-gray-900">{formatDateTime(data.arrival_time)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Duration</p>
            <p className="text-lg font-medium text-gray-900">{formatDuration(data.duration_minutes)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Airline Name</p>
            <p className="text-lg font-medium text-gray-900">{data.airline || "-"}</p>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8 text-gray-800 md:px-10">
      <div className="mb-5 flex items-center justify-between">
        <Link to="/profile" className="text-sm text-gray-600 underline hover:text-gray-900">
          Back to Profile
        </Link>
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
            <p className="mt-1 text-base text-gray-500">Booked on {formatDate(booking.created_at)}</p>
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
          <h2 className="mb-5 text-2xl font-semibold text-gray-900">Booking Information</h2>
          <div className="grid grid-cols-1 gap-y-6 md:grid-cols-3 md:gap-x-12">
            <div>
              <p className="text-sm text-gray-500">Booking Code</p>
              <p className="text-xl font-semibold text-gray-900">{booking.booking_code || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Booking ID</p>
              <p className="break-all text-base text-gray-900">{booking.booking_id || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Trip Type</p>
              <p className="text-xl font-semibold text-gray-900">{tripTypeLabel}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Number of Adults</p>
              <p className="text-xl font-semibold text-gray-900">{booking.adults ?? 1}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Base Price (USD)</p>
              <p className="text-xl font-semibold text-gray-900">{formatUSD(booking.base_price_usd)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Final Price (USD)</p>
              <p className="text-xl font-semibold text-gray-900">{formatUSD(booking.final_price_usd)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Final Price (MMK)</p>
              <p className="text-xl font-semibold text-gray-900">{formatMMK(booking.final_price_mmk)}</p>
            </div>
          </div>
        </section>

        {(outbound || oneWay) && (
          <FlightSection title={outbound ? "Outbound Flight" : "Flight"} data={outbound || oneWay} />
        )}
        {inbound && <FlightSection title="Inbound Flight" data={inbound} />}

        <section className="border-t border-gray-200 px-6 py-6">
          <h3 className="mb-4 text-2xl font-semibold text-gray-900">Passengers</h3>

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
                <div key={p.id || idx} className="rounded border border-gray-300 p-4">
                  <h4 className="mb-3 text-lg font-semibold text-gray-900">Passenger {idx + 1}</h4>
                  <div className="grid grid-cols-1 gap-y-4 md:grid-cols-3 md:gap-x-10">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="text-lg font-medium text-gray-900">{fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Passport Number</p>
                      <p className="text-lg font-medium text-gray-900">
                        {p.passport_number || p.passport || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="text-lg font-medium text-gray-900">{p.gender || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="text-lg font-medium text-gray-900">
                        {formatDate(p.date_of_birth || p.dob)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nationality</p>
                      <p className="text-lg font-medium text-gray-900">{p.nationality || "-"}</p>
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
            <h3 className="text-2xl font-semibold text-gray-900">Payment & Status</h3>
            <button
              type="button"
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              View Audit
            </button>
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
              <p className="text-lg font-semibold text-gray-900">{formatDateTime(booking.created_at)}</p>
            </div>
          </div>
        </section>

        <section className="border-t border-gray-200 px-6 py-6">
          <h3 className="mb-4 text-2xl font-semibold text-gray-900">Ticket File</h3>
          <div className="flex flex-col items-start justify-between gap-3 rounded border border-gray-200 bg-gray-50 p-4 md:flex-row md:items-center">
            <p className="text-sm text-gray-700">
              {ticketUrl ? "Download to see the uploaded file." : "No ticket file uploaded yet."}
            </p>

            {ticketUrl ? (
              <a
                href={ticketUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Download
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="rounded bg-gray-300 px-6 py-2 text-sm font-medium text-gray-600"
              >
                Download
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}