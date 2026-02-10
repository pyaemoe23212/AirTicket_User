import { useState } from "react";

export default function BookingForm({ selectedFlights = [] }) {
  const [contact, setContact] = useState({
    givenName: "",
    lastName: "",
    email: "",
    country: "",
    phone: "",
  });

  const [passenger, setPassenger] = useState({
    givenName: "",
    lastName: "",
    passport: "",
    gender: "",
    dob: "",
    nationality: "",
    phone: "",
  });

  const handleContactChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handlePassengerChange = (e) => {
    setPassenger({ ...passenger, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 text-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Review & Passenger Info</h1>
        <button className="text-xs text-gray-500 underline">Change Flight</button>
      </div>

      {/* Selected Flight */}
      <div className="bg-white border p-4 mb-4">
        <h2 className="text-sm font-semibold mb-2">Your Selected Flight</h2>

        {selectedFlights.length === 0 ? (
          <p className="text-xs text-gray-400">No flights selected</p>
        ) : (
          selectedFlights.map((f, i) => (
            <div key={i} className="flex justify-between items-center border-b py-2 text-xs">
              <div className="flex gap-2 items-center">
                <input type="checkbox" />
                <p>{f.from} — {f.to}</p>
              </div>
              <p className="text-gray-500">{f.date} • {f.time}</p>
            </div>
          ))
        )}
      </div>

      {/* Contact Details */}
      <div className="bg-white border p-4 mb-4">
        <h2 className="text-sm font-semibold mb-2">Contact details</h2>
        <p className="text-xs text-gray-500 mb-3">This is where your confirmation will be sent</p>

        <div className="grid grid-cols-2 gap-3">
          <input name="givenName" onChange={handleContactChange} placeholder="Enter given names" className="border p-2 text-sm" />
          <input name="lastName" onChange={handleContactChange} placeholder="Enter last name" className="border p-2 text-sm" />
          <input name="email" onChange={handleContactChange} placeholder="Enter email" className="border p-2 text-sm" />
          <input name="country" onChange={handleContactChange} placeholder="Country / region of residence" className="border p-2 text-sm" />
        </div>

        <input
          name="phone"
          onChange={handleContactChange}
          placeholder="+1 (555) 000-0000"
          className="border p-2 text-sm w-full mt-3"
        />
      </div>

      {/* Passenger */}
      <div className="bg-white border p-4 mb-4">
        <h2 className="text-sm font-semibold mb-1">Passenger 1:</h2>
        <p className="text-xs text-gray-500 mb-3">Passenger details must match your passport or photo ID</p>

        <div className="grid grid-cols-3 gap-3">
          <input name="givenName" onChange={handlePassengerChange} placeholder="Enter given names" className="border p-2 text-sm" />
          <input name="lastName" onChange={handlePassengerChange} placeholder="Enter last name" className="border p-2 text-sm" />
          <input name="passport" onChange={handlePassengerChange} placeholder="Enter Passport Number" className="border p-2 text-sm" />

          <input name="gender" onChange={handlePassengerChange} placeholder="Enter Gender" className="border p-2 text-sm" />
          <input type="date" name="dob" onChange={handlePassengerChange} className="border p-2 text-sm" />
          <input name="nationality" onChange={handlePassengerChange} placeholder="Enter Nationality" className="border p-2 text-sm" />
        </div>

        <input
          name="phone"
          onChange={handlePassengerChange}
          placeholder="+1 (555) 000-0000"
          className="border p-2 text-sm w-full mt-3"
        />
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center">
        <label className="text-xs">
          <input type="checkbox" className="mr-2" />
          Cancel Booking
        </label>

        <div className="flex gap-3">
          <button className="bg-black text-white px-6 py-2 text-sm">
            Add Passenger
          </button>
          <button className="bg-black text-white px-6 py-2 text-sm">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
