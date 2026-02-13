import { Link } from "react-router";

export default function Profile() {
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

      {/* Personal Info */}
      <div className="bg-white border rounded p-6 mb-6">
        <h3 className="font-semibold mb-4">Personal Information</h3>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-gray-500">Customer ID</p>
            <p>USR-001</p>
          </div>
          <div>
            <p className="text-gray-500">Email Address</p>
            <p>sarah.johnson@airline.com</p>
          </div>
          <div>
            <p className="text-gray-500">Phone Number</p>
            <p>+1 (555) 123-4567</p>
          </div>
          <div>
            <p className="text-gray-500">Registration Date</p>
            <p>Jan 15, 2024</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border rounded p-6 mb-6">
        <h3 className="font-medium mb-4">Booking Statistics</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-gray-500 text-sm">Total Bookings</p>
            <p className="text-lg font-semibold">12</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Spent</p>
            <p className="text-lg font-semibold">$4,580</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Cancelled</p>
            <p className="text-lg font-semibold">2</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Avg Booking</p>
            <p className="text-lg font-semibold">$382</p>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="border rounded p-6">
        <h3 className="font-medium mb-4">Recent Bookings</h3>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-2">Booking ID</th>
              <th className="p-2">Route</th>
              <th className="p-2">Date</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-2">BK-10245</td>
              <td className="p-2">JFK → LHR</td>
              <td className="p-2">Jan 15, 2024</td>
              <td className="p-2">$520</td>
              <td className="p-2">
                <span className="px-2 py-1 bg-green-100 text-green-700">
                  Completed
                </span>
              </td>
            </tr>

            <tr className="border-t">
              <td className="p-2">BK-8231</td>
              <td className="p-2">LAX → NRT</td>
              <td className="p-2">Dec 22, 2023</td>
              <td className="p-2">$780</td>
              <td className="p-2">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                  Completed
                </span>
              </td>
            </tr>

            <tr className="border-t">
              <td className="p-2">BK-7958</td>
              <td className="p-2">SFO → CDG</td>
              <td className="p-2">Nov 10, 2023</td>
              <td className="p-2">$650</td>
              <td className="p-2">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                  Completed
                </span>
              </td>
            </tr>

            <tr className="border-t">
              <td className="p-2">BK-7654</td>
              <td className="p-2">MIA → MAD</td>
              <td className="p-2">Oct 5, 2023</td>
              <td className="p-2">$490</td>
              <td className="p-2">
                <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-600">
                  Cancelled
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
