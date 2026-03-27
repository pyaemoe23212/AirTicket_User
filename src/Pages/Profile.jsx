import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getUserBookings } from "../utils/api";

export default function Profile() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getUserBookings();
        setBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const toNumber = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };

  const formatUSD = (value) => "$" + toNumber(value).toFixed(2);

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
    if (h === 0) return r + "m";
    if (r === 0) return h + "h";
    return h + "h " + r + "m";
  };

  const getFlightInfo = (booking) => {
    const snap = booking?.flight_snapshot || {};
    const outbound = snap.outbound || null;
    const inbound = snap.inbound || null;

    if (outbound || inbound) {
      const outRoute = outbound
        ? (outbound.origin || "-") + " -> " + (outbound.destination || "-")
        : "-";
      const inRoute = inbound
        ? (inbound.origin || "-") + " -> " + (inbound.destination || "-")
        : "-";

      const route =
        outbound && inbound
          ? outRoute + " / " + inRoute
          : outRoute !== "-"
            ? outRoute
            : inRoute;

      const airline =
        (outbound && outbound.airline) ||
        (inbound && inbound.airline) ||
        snap.airline ||
        "-";

      const flightNumber =
        (outbound && outbound.flight_number) ||
        (inbound && inbound.flight_number) ||
        snap.flight_number ||
        "-";

      const departure =
        (outbound && outbound.departure_time) ||
        (inbound && inbound.departure_time) ||
        snap.departure_time ||
        "-";

      const arrival =
        (inbound && inbound.arrival_time) ||
        (outbound && outbound.arrival_time) ||
        snap.arrival_time ||
        "-";

      const totalDuration =
        toNumber(outbound && outbound.duration_minutes) +
        toNumber(inbound && inbound.duration_minutes);

      return {
        airline,
        flightNumber,
        route,
        departure,
        arrival,
        duration: totalDuration > 0 ? formatDuration(totalDuration) : "-",
        basePrice: snap.base_price_usd,
        finalPrice: booking.final_price_usd ?? snap.final_price_usd,
      };
    }

    return {
      airline: snap.airline || "-",
      flightNumber: snap.flight_number || "-",
      route: snap.route || ((snap.origin || "-") + " -> " + (snap.destination || "-")),
      departure: snap.departure_time || "-",
      arrival: snap.arrival_time || "-",
      duration: formatDuration(snap.duration_minutes),
      basePrice: snap.base_price_usd,
      finalPrice: booking.final_price_usd ?? snap.final_price_usd,
    };
  };

  const stats = useMemo(() => {
    const totalSpent = bookings.reduce((sum, b) => sum + toNumber(b.final_price_usd), 0);
    const cancelled = bookings.filter(
      (b) => String(b.status || "").toUpperCase() === "CANCELLED"
    ).length;
    const avg = bookings.length ? totalSpent / bookings.length : 0;

    return { totalSpent, cancelled, avg };
  }, [bookings]);

  const getBookingStatusClass = (status) => {
    const s = String(status || "").toUpperCase();
    if (s === "COMPLETED" || s === "CONFIRMED") {
      return "border-green-200 bg-green-50 text-green-700";
    }
    if (s === "CANCELLED") {
      return "border-red-200 bg-red-50 text-red-700";
    }
    if (s === "PENDING") {
      return "border-yellow-200 bg-yellow-50 text-yellow-700";
    }
    return "border-gray-300 bg-gray-100 text-gray-700";
  };

  const getPaymentStatusClass = (status) => {
    const s = String(status || "").toUpperCase();
    if (s === "PAID") {
      return "border-green-200 bg-green-50 text-green-700";
    }
    if (s === "FAILED") {
      return "border-red-200 bg-red-50 text-red-700";
    }
    if (s === "PENDING" || s === "UNPAID") {
      return "border-yellow-200 bg-yellow-50 text-yellow-700";
    }
    return "border-gray-300 bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl bg-white px-6 py-8 text-sm text-gray-600 md:px-10">
        Loading bookings...
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl bg-white px-6 py-8 text-gray-800 md:px-10">
      <div className="mb-7 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl leading-none text-black transition hover:text-gray-600"
          aria-label="Back"
        >
          ←
        </Link>

        <Link
          to="/edit-info"
          className="bg-gray-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-900"
        >
          Edit info
        </Link>
      </div>

      <div className="border-b border-gray-200 pb-7">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 min-w-[56px] rounded-full border border-gray-400 bg-gray-300" />
          <div>
            <h2 className="text-3xl font-normal leading-tight text-gray-800">Sarah Johnson</h2>
            <p className="mt-1 text-sm text-gray-500">sarah.johnson@airline.com</p>
          </div>
        </div>
      </div>

      <section className="border-b border-gray-200 py-7">
        <h3 className="mb-5 text-2xl font-normal text-gray-800">Personal Information</h3>

        <div className="grid grid-cols-1 gap-x-14 gap-y-5 md:grid-cols-2">
          <div>
            <p className="mb-1 text-xs text-gray-500">Customer ID</p>
            <p className="text-base text-gray-800">USR-001</p>
          </div>

          <div>
            <p className="mb-1 text-xs text-gray-500">Email Address</p>
            <p className="text-base text-gray-800">sarah.johnson@airline.com</p>
          </div>

          <div>
            <p className="mb-1 text-xs text-gray-500">Phone Number</p>
            <p className="text-base text-gray-800">+1 (555) 123-4567</p>
          </div>

          <div>
            <p className="mb-1 text-xs text-gray-500">Registration Date</p>
            <p className="text-base text-gray-800">Jan 15, 2024</p>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 py-7">
        <h3 className="mb-4 text-2xl font-normal text-gray-800">Booking Statistics</h3>

        <div className="grid grid-cols-2 border border-gray-200 md:grid-cols-4">
          <div className="px-4 py-3">
            <p className="mb-1 text-xs text-gray-500">Total Bookings</p>
            <p className="text-3xl leading-tight text-gray-800">{bookings.length}</p>
          </div>

          <div className="px-4 py-3">
            <p className="mb-1 text-xs text-gray-500">Total Spent</p>
            <p className="text-3xl leading-tight text-gray-800">{formatUSD(stats.totalSpent)}</p>
          </div>

          <div className="px-4 py-3">
            <p className="mb-1 text-xs text-gray-500">Cancelled</p>
            <p className="text-3xl leading-tight text-gray-800">{stats.cancelled}</p>
          </div>

          <div className="px-4 py-3">
            <p className="mb-1 text-xs text-gray-500">Average Booking</p>
            <p className="text-3xl leading-tight text-gray-800">{formatUSD(stats.avg)}</p>
          </div>
        </div>
      </section>

      <section className="py-7">
        <h3 className="mb-4 text-2xl font-normal text-gray-800">Recent Bookings</h3>

        <div className="overflow-x-auto border border-gray-200">
          <table className="w-full min-w-[1200px] text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 text-left font-medium">Booking ID</th>
                <th className="p-3 text-left font-medium">Flight No.</th>
                <th className="p-3 text-left font-medium">Route</th>
                <th className="p-3 text-left font-medium">Departure</th>
                <th className="p-3 text-left font-medium">Adults</th>
                <th className="p-3 text-left font-medium">Base Price</th>
                <th className="p-3 text-left font-medium">Final Price</th>
                <th className="p-3 text-left font-medium">My Status</th>
                <th className="p-3 text-left font-medium">Payment Status</th>
                <th className="p-3 text-left font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {bookings.length === 0 && (
                <tr>
                  <td className="p-4 text-center text-gray-500" colSpan={10}>
                    No bookings found
                  </td>
                </tr>
              )}

              {bookings.map((b) => {
                const f = getFlightInfo(b);

                return (
                  <tr key={b.booking_id} className="border-t border-gray-200 text-gray-700">
                    <td className="p-3">
                      <div className="max-w-[190px] break-all text-xs">{b.booking_id || "-"}</div>
                    </td>
                    <td className="p-3">{f.flightNumber}</td>
                    <td className="p-3">{f.route}</td>
                    <td className="p-3 whitespace-nowrap">{formatDateTime(f.departure)}</td>
                    <td className="p-3">{b.adults ?? 1}</td>
                    <td className="p-3">{formatUSD(f.basePrice)}</td>
                    <td className="p-3">{formatUSD(f.finalPrice)}</td>

                    <td className="p-3">
                      <span
                        className={
                          "inline-flex items-center rounded border px-2 py-0.5 text-xs " +
                          getBookingStatusClass(b.status)
                        }
                      >
                        {b.status || "-"}
                      </span>
                    </td>

                    <td className="p-3">
                      <span
                        className={
                          "inline-flex items-center rounded border px-2 py-0.5 text-xs " +
                          getPaymentStatusClass(b.payment_status)
                        }
                      >
                        {b.payment_status || "-"}
                      </span>
                    </td>

                    <td className="p-3">
                      <button
                        type="button"
                        className="inline-flex items-center rounded border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}