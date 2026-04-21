import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getCustomerMe, getUserBookings, resetPassword } from "../utils/api";

export default function Profile() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetFormData, setResetFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [customerData, bookingsData] = await Promise.all([
          getCustomerMe(),
          getUserBookings(),
        ]);

        setCustomer(customerData || null);
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        setCustomer(null);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
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

  const formatDate = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString();
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

  const handleResetPasswordClick = () => {
    setShowResetModal(true);
    setResetError("");
    setResetSuccess(false);
    setResetFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleResetFormChange = (e) => {
    const { name, value } = e.target;
    setResetFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetError("");

    if (!resetFormData.currentPassword) {
      setResetError("Current password is required");
      return;
    }

    if (resetFormData.newPassword !== resetFormData.confirmPassword) {
      setResetError("New passwords do not match");
      return;
    }

    if (resetFormData.newPassword.length < 8) {
      setResetError("Password must be at least 8 characters");
      return;
    }

    setResetting(true);

    try {
      await resetPassword(resetFormData.currentPassword, resetFormData.newPassword);
      setResetSuccess(true);
      setTimeout(() => {
        setShowResetModal(false);
        setResetFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }, 2000);
    } catch (err) {
      setResetError(
        err?.response?.data?.message || err.message || "Failed to reset password"
      );
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl bg-white px-6 py-8 text-sm text-gray-600 md:px-10">
        Loading profile...
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

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleResetPasswordClick}
            className="bg-gray-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-900 cursor-pointer"
          >
            Reset Password
          </button>

          <Link
            to="/edit-info"
            className="bg-gray-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-900"
          >
            Edit info
          </Link>
        </div>
      </div>

      <div className="border-b border-gray-200 pb-7">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 min-w-[56px] rounded-full border border-gray-400 bg-gray-300" />
          <div>
            <h2 className="text-3xl font-normal leading-tight text-gray-800">
              {customer?.full_name || "Customer"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">{customer?.email || "-"}</p>
          </div>
        </div>
      </div>

      <section className="border-b border-gray-200 py-7">
        <h3 className="mb-5 text-2xl font-normal text-gray-800">Personal Information</h3>

        <div className="grid grid-cols-1 gap-x-14 gap-y-5 md:grid-cols-2">
          <div>
            <p className="mb-1 text-xs text-gray-500">Customer ID</p>
            <p className="text-base text-gray-800">{customer?.id || "-"}</p>
          </div>

          <div>
            <p className="mb-1 text-xs text-gray-500">Email Address</p>
            <p className="text-base text-gray-800">{customer?.email || "-"}</p>
          </div>

          <div>
            <p className="mb-1 text-xs text-gray-500">Phone Number</p>
            <p className="text-base text-gray-800">{customer?.phone || "-"}</p>
          </div>

          <div>
            <p className="mb-1 text-xs text-gray-500">Registration Date</p>
            <p className="text-base text-gray-800">{formatDate(customer?.created_at)}</p>
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
                      <div className="max-w-[190px] break-all text-xs">{b.booking_code || "-"}</div>
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
                        onClick={() => navigate("/bookings/" + b.booking_id)}
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

      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
            <div className="p-6">
              {resetSuccess ? (
                <div className="text-center py-6">
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Password Reset Successful</h3>
                  <p className="text-gray-600 text-sm">Your password has been changed successfully.</p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Reset Password</h3>
                  </div>

                  {resetError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm">{resetError}</p>
                    </div>
                  )}

                  <form onSubmit={handleResetSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={resetFormData.currentPassword}
                        onChange={handleResetFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                        placeholder="Enter current password"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={resetFormData.newPassword}
                        onChange={handleResetFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                        placeholder="Enter new password"
                        required
                        minLength="8"
                      />
                      <p className="text-xs text-gray-500 mt-1">At least 8 characters</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={resetFormData.confirmPassword}
                        onChange={handleResetFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                        placeholder="Confirm password"
                        required
                        minLength="8"
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowResetModal(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={resetting}
                        className="flex-1 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        {resetting ? "Resetting..." : "Reset Password"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}