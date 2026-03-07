import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BookingForm({ selectedFlights = [], tripType }) {
  const navigate = useNavigate();

  const [contact, setContact] = useState({
    givenName: "",
    lastName: "",
    email: "",
    country: "",
    phone: "",
  });

  const [passenger, setPassenger] = useState([
    {
      givenName: "",
      lastName: "",
      passport: "",
      gender: "",
      dob: "",
      nationality: "",
      phone: "",
    },
  ]);

  const handleContactChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handlePassengerChange = (index, e) => {
    const updatedPassengers = [...passenger];
    updatedPassengers[index][e.target.name] = e.target.value;
    setPassenger(updatedPassengers);
  };

  const handleAddPassenger = () => {
    setPassenger([
      ...passenger,
      {
        givenName: "",
        lastName: "",
        passport: "",
        gender: "",
        dob: "",
        nationality: "",
        phone: "",
      },
    ]);
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
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-5xl mx-auto bg-white border border-gray-300 p-8 text-gray-800">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium">Review & Passenger Info</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 underline"
          >
            Change flight
          </button>
        </div>

        {/* SELECTED FLIGHT */}
        <div className="border border-gray-300 p-6 mb-8">

          <h2 className="text-sm font-medium mb-4">
            Your Selected Flight
          </h2>

          {selectedFlights.length === 0 ? (
            <p className="text-xs text-gray-400">
              No flights selected
            </p>
          ) : (
            selectedFlights.map((f, i) => (
              <div key={i}>

                <div className="flex justify-between items-center py-6">

                  {/* LEFT SIDE */}
                  <div className="flex items-center gap-4">

                    <div className="w-10 h-10 bg-gray-200 border"></div>

                    <p className="text-sm text-gray-700">
                      {f.from || "New York"} ({f.fromCode || "JFK"})
                      <span className="mx-4 text-gray-400">——</span>
                      {f.to || "London"} ({f.toCode || "LHR"})
                    </p>

                  </div>

                  {/* RIGHT SIDE */}
                  <p className="text-xs text-gray-500 whitespace-nowrap">
                    {f.date || "Mon, Jan 15"} &nbsp;&nbsp;
                    {f.departureTime || "9:30 AM"} - {f.arrivalTime || "9:45 PM"}
                  </p>

                </div>

                {/* Divider */}
                {i !== selectedFlights.length - 1 && (
                  <div className="border-t border-gray-200"></div>
                )}

              </div>
            ))
          )}

        </div>

        {/* CONTACT */}
        <div className="border border-gray-300 p-6 mb-8">

          <h2 className="text-sm font-medium">
            Contact details
          </h2>

          <p className="text-xs text-gray-500 mb-6">
            This is where your confirmation will be sent
          </p>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="text-xs block mb-1">
                Given names
              </label>
              <input
                name="givenName"
                placeholder="Enter given names"
                onChange={handleContactChange}
                className="border border-gray-300 p-2 w-full text-sm"
              />
            </div>

            <div>
              <label className="text-xs block mb-1">
                Last name
              </label>
              <input
                name="lastName"
                placeholder="Enter last name"
                onChange={handleContactChange}
                className="border border-gray-300 p-2 w-full text-sm"
              />
            </div>

            <div>
              <label className="text-xs block mb-1">
                Email
              </label>
              <input
                name="email"
                placeholder="Enter email"
                onChange={handleContactChange}
                className="border border-gray-300 p-2 w-full text-sm"
              />
            </div>

            <div>
              <label className="text-xs block mb-1">
                Country / region of residence
              </label>
              <input
                name="country"
                placeholder="Enter Country"
                onChange={handleContactChange}
                className="border border-gray-300 p-2 w-full text-sm"
              />
            </div>

            <div className="md:col-span-2 mt-6 bg-gray-50 p-4 border border-gray-300">
              <label className="text-xs block mb-1">
                Phone number
              </label>
              <input
                name="phone"
                placeholder="+1 (555) 000-0000"
                onChange={handleContactChange}
                className="border border-gray-300 p-2 w-full text-sm"
              />
            </div>

          </div>
        </div>

        {/* PASSENGERS */}
        {passenger.map((p, index) => (
          <div key={index} className="border border-gray-300 p-6 mb-6">

            <h2 className="text-sm font-medium mb-1">
              Passenger {index + 1}
            </h2>

            <p className="text-xs text-gray-500 mb-4">
              Passenger details must match your passport or photo ID
            </p>

            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <label className="text-xs block mb-1">
                  Given names
                </label>
                <input
                  name="givenName"
                  value={p.givenName}
                  onChange={(e) => handlePassengerChange(index, e)}
                  placeholder="Enter given names"
                  className="border border-gray-300 p-2 w-full text-sm"
                />
              </div>

              <div>
                <label className="text-xs block mb-1">
                  Last name
                </label>
                <input
                  name="lastName"
                  value={p.lastName}
                  onChange={(e) => handlePassengerChange(index, e)}
                  placeholder="Enter last name"
                  className="border border-gray-300 p-2 w-full text-sm"
                />
              </div>

              <div>
                <label className="text-xs block mb-1">
                  Passport number
                </label>
                <input
                  name="passport"
                  value={p.passport}
                  onChange={(e) => handlePassengerChange(index, e)}
                  placeholder="Enter Passport Number"
                  className="border border-gray-300 p-2 w-full text-sm"
                />
              </div>

              <div>
                <label className="text-xs block mb-1">
                  Gender on ID
                </label>
                <input
                  name="gender"
                  value={p.gender}
                  onChange={(e) => handlePassengerChange(index, e)}
                  placeholder="Enter Gender"
                  className="border border-gray-300 p-2 w-full text-sm"
                />
              </div>

              <div>
                <label className="text-xs block mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={p.dob}
                  onChange={(e) => handlePassengerChange(index, e)}
                  className="border border-gray-300 p-2 w-full text-sm"
                />
              </div>

              <div>
                <label className="text-xs block mb-1">
                  Nationality
                </label>
                <input
                  name="nationality"
                  value={p.nationality}
                  onChange={(e) => handlePassengerChange(index, e)}
                  placeholder="Enter Nationality"
                  className="border border-gray-300 p-2 w-full text-sm"
                />
              </div>

              <div className="md:col-span-2 mt-6 bg-gray-50 p-4 border border-gray-300">
                <label className="text-xs block mb-1">
                  Phone number
                </label>
                <input
                  name="phone"
                  value={p.phone}
                  onChange={(e) => handlePassengerChange(index, e)}
                  placeholder="+1 (555) 000-0000"
                  className="border border-gray-300 p-2 w-full text-sm"
                />
              </div>

            </div>
          </div>
        ))}

        {/* BUTTONS */}
        <div className="flex justify-between items-center mt-10">

          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:underline"
          >
            Cancel Booking
          </button>

          <div className="flex gap-4">

            <button
              onClick={handleAddPassenger}
              className="bg-black text-white px-8 py-2 text-sm"
            >
              Add Passenger
            </button>

            <button
              onClick={handleConfirm}
              className="bg-black text-white px-8 py-2 text-sm"
            >
              Confirm
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}