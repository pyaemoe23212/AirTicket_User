import { useState } from "react";

export default function BookingForm({ selectedFlights = [] }) {
  const [form, setForm] = useState({
    givenName: "",
    lastName: "",
    gender: "",
    dob: "",
    nationality: "",
    phone: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 text-gray-800">

      {/* ===================== PAGE TITLE ===================== */}
      <h1 className="text-2xl font-semibold mb-4">Review &amp; Passenger Info</h1>

      {/* ===================== SELECTED FLIGHT BOX ===================== */}
      <div className="bg-white border rounded-sm p-4 mb-6">
        <h2 className="text-sm font-semibold mb-3">Your Selected Flight</h2>

        {selectedFlights.length === 0 ? (
          <p className="text-xs text-gray-500">No flights selected</p>
        ) : (
          selectedFlights.map((flight, idx) => (
            <div key={idx} className="flex justify-between items-center border rounded-sm p-3 mb-2 text-xs">
              <div>
                <p className="font-medium">
                  {flight.from} — {flight.to}
                </p>
              </div>
              <div className="text-right">
                <p>{flight.date}</p>
                <p className="text-gray-500">{flight.time}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ===================== PASSENGER FORM ===================== */}
      <div className="bg-white p-6 rounded-sm border text-sm">
        <h2 className="text-base font-semibold mb-4">Who's traveling?</h2>

        <div className="flex justify-end mb-3">
          <button className="text-blue-600 hover:underline text-xs">Sign in</button>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Given Name */}
          <div>
            <label className="block mb-1 text-xs font-medium">Given names</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              name="givenName"
              placeholder="Enter given names"
              value={form.givenName}
              onChange={handleChange}
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block mb-1 text-xs font-medium">Last name</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              name="lastName"
              placeholder="Enter last name"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block mb-1 text-xs font-medium">Gender on ID</label>
            <select
              name="gender"
              className="w-full border rounded px-3 py-2 text-sm"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block mb-1 text-xs font-medium">Date of birth</label>
            <input
              type="date"
              name="dob"
              className="w-full border rounded px-3 py-2 text-sm"
              value={form.dob}
              onChange={handleChange}
            />
          </div>

          {/* Nationality */}
          <div>
            <label className="block mb-1 text-xs font-medium">Nationality</label>
            <select
              name="nationality"
              className="w-full border rounded px-3 py-2 text-sm"
              value={form.nationality}
              onChange={handleChange}
            >
              <option value="">Select country</option>
              <option value="USA">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="Canada">Canada</option>
            </select>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t pt-4 mt-4">
          <h3 className="text-sm font-medium mb-2">Contact Information</h3>
          <label className="block mb-1 text-xs font-medium">Phone number</label>
          <input
            className="w-full border rounded px-3 py-2 text-sm"
            name="phone"
            placeholder="+1 (555) 000-0000"
            value={form.phone}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500 mt-1">
            We'll send booking confirmation and updates to this number
          </p>
        </div>

        {/* Cancel + Confirm */}
        <div className="flex justify-between items-center mt-6">
          <label className="flex items-center text-xs">
            <input type="checkbox" className="mr-2" /> Cancel Booking
          </label>

          <button className="bg-black text-white px-6 py-2 text-sm rounded hover:bg-gray-800">
            Confirm
          </button>
        </div>

      </div>
    </div>
  );
}
