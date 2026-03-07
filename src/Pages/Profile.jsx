import { Link } from "react-router";
import { useEffect, useState } from "react";

export default function Profile() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bookings") || "[]");
    setBookings(stored);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white">

      {/* Top Header */}
      <div className="flex justify-between items-center mb-6">

        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-300"></div>

          <div>
            <h2 className="text-xl font-semibold">Sarah Johnson</h2>
            <p className="text-gray-500 text-sm">
              sarah.johnson@airline.com
            </p>
          </div>
        </div>

        <Link
          to="/edit-info"
          className="bg-black text-white px-4 py-2 text-sm rounded"
        >
          Edit info
        </Link>

      </div>

      <hr className="mb-6"/>

      {/* Personal Info */}
      <div className="grid grid-cols-2 gap-6 mb-8">

        <div>
          <p className="text-sm text-gray-500">Customer ID</p>
          <p className="font-medium">USR-001</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Email Address</p>
          <p className="font-medium">sarah.johnson@airline.com</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Phone Number</p>
          <p className="font-medium">+1 (555) 123-4567</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Registration Date</p>
          <p className="font-medium">Jan 15, 2024</p>
        </div>

      </div>

      {/* Booking Statistics */}
      <div className="grid grid-cols-4 border rounded mb-8">

        <div className="p-4">
          <p className="text-sm text-gray-500">Total Bookings</p>
          <p className="text-lg font-semibold">12</p>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-500">Total Spent</p>
          <p className="text-lg font-semibold">$4,580</p>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-500">Cancelled</p>
          <p className="text-lg font-semibold">2</p>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-500">Average Booking</p>
          <p className="text-lg font-semibold">$382</p>
        </div>

      </div>

      {/* Recent Bookings */}
      <div>

        <h3 className="font-semibold mb-4">Recent Bookings</h3>

        <table className="w-full text-sm border">

          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Booking ID</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Flights</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => {
              const total = (b.selectedFlights || []).reduce(
                (sum, f) => sum + (f.price || 0),
                0
              );

              return (
                <tr key={b.id} className="border-t">
                  <td className="p-3">{b.id}</td>
                  <td className="p-3">{b.tripType}</td>
                  <td className="p-3">
                    {(b.selectedFlights || [])
                      .map((f) => f.flightNumber)
                      .join(" + ")}
                  </td>
                  <td className="p-3">${total}</td>
                  <td className="p-3">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                      {b.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>

      </div>

    </div>
  );
}