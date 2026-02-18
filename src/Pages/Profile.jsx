import { Link } from "react-router";
import { useEffect, useState } from "react";

export default function Profile() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bookings") || "[]");
    setBookings(stored);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-300" />
          <div>
            <h2 className="text-lg font-semibold">Sarah Johnson</h2>
            <p className="text-sm text-gray-500">sarah.johnson@airline.com</p>
          </div>
        </div>

        <Link
          to="/edit-info"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
        >
          Edit info
        </Link>
      </div>

      {/* Recent Bookings */}
      <div className="border rounded p-6">
        <h3 className="font-medium mb-4">Recent Bookings</h3>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-2">Booking ID</th>
              <th className="p-2">Type</th>
              <th className="p-2">Flights</th>
              <th className="p-2">Total</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-2 text-gray-400">
                  No bookings yet
                </td>
              </tr>
            ) : (
              bookings.map((b) => {
                const total = (b.selectedFlights || []).reduce(
                  (sum, f) => sum + (f.price || 0),
                  0
                );

                return (
                  <tr key={b.id} className="border-t">
                    <td className="p-2">{b.id}</td>
                    <td className="p-2">{b.tripType}</td>
                    <td className="p-2">
                      {(b.selectedFlights || [])
                        .map((f) => f.flightNumber)
                        .join(" + ")}
                    </td>
                    <td className="p-2">${total}</td>
                    <td className="p-2">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
