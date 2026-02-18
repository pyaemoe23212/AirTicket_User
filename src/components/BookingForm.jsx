import { useState } from "react";
import { useNavigate } from "react-router";

export default function BookingForm({ selectedFlights = [], tripType }) {
  const navigate = useNavigate();

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

  const handleConfirm = () => {
    const booking = {
      id: `BK-${Date.now()}`,
      createdAt: new Date().toISOString(),
      tripType,
      selectedFlights,
      contact,
      passenger,
      status: "Confirmed",
    };

    const existing = JSON.parse(localStorage.getItem("bookings") || "[]");
    localStorage.setItem("bookings", JSON.stringify([booking, ...existing]));

    navigate("/profile");
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 text-gray-800 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Review & Passenger Info</h1>
      </div>

      {/* Selected Flights */}
      <div className="bg-white border p-4 mb-4 rounded">
        <h2 className="text-sm font-semibold mb-2">Your Selected Flights</h2>

        {selectedFlights.length === 0 ? (
          <p className="text-xs text-gray-400">No flights selected</p>
        ) : (
          selectedFlights.map((f, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-b py-2 text-xs"
            >
              <div className="flex gap-2 items-center">
                <span className="px-2 py-1 bg-gray-100 rounded text-[10px]">
                  {f.label || (i === 0 ? "Outbound" : "Return")}
                </span>
                <p>
                  {f.airline} • {f.flightNumber} • {f.departureTime} →{" "}
                  {f.arrivalTime}
                </p>
              </div>
              <p className="text-gray-500">${f.price}</p>
            </div>
          ))
        )}
      </div>

      {/* Contact */}
      <div className="bg-white border p-4 mb-4 rounded">
        <h2 className="text-sm font-semibold mb-2">Contact details</h2>

        <div className="grid grid-cols-2 gap-3">
          <input name="givenName" onChange={handleContactChange} placeholder="Enter given names" className="border p-2 text-sm" />
          <input name="lastName" onChange={handleContactChange} placeholder="Enter last name" className="border p-2 text-sm" />
          <input name="email" onChange={handleContactChange} placeholder="Enter email" className="border p-2 text-sm" />
          <input name="country" onChange={handleContactChange} placeholder="Country / region of residence" className="border p-2 text-sm" />
        </div>

        <input name="phone" onChange={handleContactChange} placeholder="+1 (555) 000-0000" className="border p-2 text-sm w-full mt-3" />
      </div>

      {/* Passenger */}
      <div className="bg-white border p-4 mb-4 rounded">
        <h2 className="text-sm font-semibold mb-1">Passenger 1:</h2>

        <div className="grid grid-cols-3 gap-3">
          <input name="givenName" onChange={handlePassengerChange} placeholder="Enter given names" className="border p-2 text-sm" />
          <input name="lastName" onChange={handlePassengerChange} placeholder="Enter last name" className="border p-2 text-sm" />
          <input name="passport" onChange={handlePassengerChange} placeholder="Enter Passport Number" className="border p-2 text-sm" />

          <input name="gender" onChange={handlePassengerChange} placeholder="Enter Gender" className="border p-2 text-sm" />
          <input type="date" name="dob" onChange={handlePassengerChange} className="border p-2 text-sm" />
          <input name="nationality" onChange={handlePassengerChange} placeholder="Enter Nationality" className="border p-2 text-sm" />
        </div>

        <input name="phone" onChange={handlePassengerChange} placeholder="+1 (555) 000-0000" className="border p-2 text-sm w-full mt-3" />
      </div>

      <div className="flex justify-end">
        <button onClick={handleConfirm} className="bg-black text-white px-6 py-2 text-sm rounded">
          Confirm
        </button>
      </div>
    </div>
  );
}
