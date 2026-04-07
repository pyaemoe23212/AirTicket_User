import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyContact, createContact, updateContact, createBooking, addPassengers } from "../utils/api";

const createEmptyPassenger = () => ({
  givenName: "",
  lastName: "",
  passport: "",
  gender: "",
  dob: "",
  nationality: "",
  phone: "",
});

export default function BookingForm({ selectedFlights = [], tripType, initialAdults = 1 }) {
  const navigate = useNavigate();
  const normalizedAdults = Math.max(1, Number(initialAdults) || 1);

  const [contact, setContact] = useState({
    givenName: "",
    lastName: "",
    email: "",
    country: "",
    phone: "",
    id: null,
    createdAt: null,
  });

  const [contactExists, setContactExists] = useState(false);
  const [isLoadingContact, setIsLoadingContact] = useState(true);
  const [error, setError] = useState(null);
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [passenger, setPassenger] = useState(() =>
    Array.from({ length: normalizedAdults }, createEmptyPassenger)
  );

  const [isConfirming, setIsConfirming] = useState(false);

  // Fetch contact on page load (no booking creation)
  useEffect(() => {
    const fetchContact = async () => {
      try {
        setIsLoadingContact(true);
        const existingContact = await getMyContact();
        setContact({
          givenName: existingContact.given_name,
          lastName: existingContact.last_name,
          email: existingContact.email,
          country: existingContact.country_of_residence,
          phone: existingContact.phone_number,
          id: existingContact.id,
          createdAt: existingContact.created_at,
        });
        setContactExists(true);
      } catch (err) {
        setContactExists(false);
      } finally {
        setIsLoadingContact(false);
      }
    };

    fetchContact();
  }, []);

  const handleContactChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleCreateContact = async () => {
    try {
      setIsSavingContact(true);
      setError(null);
      
      const contactData = {
        given_name: contact.givenName,
        last_name: contact.lastName,
        email: contact.email,
        country_of_residence: contact.country,
        phone_number: contact.phone,
      };
      
      await createContact(contactData);
      
      setContactExists(true);
      setIsEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create contact");
    } finally {
      setIsSavingContact(false);
    }
  };

  const handleUpdateContact = async () => {
    try {
      setIsSavingContact(true);
      setError(null);
      
      const contactData = {
        given_name: contact.givenName,
        last_name: contact.lastName,
        email: contact.email,
        country_of_residence: contact.country,
        phone_number: contact.phone,
      };
      
      await updateContact(contactData);
      
      setIsEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update contact");
    } finally {
      setIsSavingContact(false);
    }
  };

  const handlePassengerChange = (index, e) => {
    const updatedPassengers = [...passenger];
    updatedPassengers[index][e.target.name] = e.target.value;
    setPassenger(updatedPassengers);
  };

  const handleAddPassenger = () => {
    if (passenger.length >= normalizedAdults) return;
    setPassenger([...passenger, createEmptyPassenger()]);
  };

  const handleConfirm = async () => {
    try {
      setError(null);

      // Step 1: Ensure contact exists
      if (!contactExists) {
        setError("Please create a contact first");
        return;
      }

      // Step 2: Validate at least one passenger
      if (!passenger.length || !passenger[0].givenName) {
        setError("Please add at least one passenger");
        return;
      }

      setIsConfirming(true);

      // Step 3: Create booking with flight and passenger count
      const outboundFlight = selectedFlights[0];
      if (!outboundFlight) {
        setError("No flight selected");
        setIsConfirming(false);
        return;
      }

      const flightSnapshot = outboundFlight.flight_snapshot || outboundFlight;

      const bookingPayload = {
        type: outboundFlight.type || (tripType === "round-trip" ? "ROUND_TRIP" : "ONE_WAY"),
        adults: passenger.length, // Use actual passenger count
        bundle_key: outboundFlight.bundle_key || outboundFlight.external_flight_id,
        airline_code: flightSnapshot.outbound?.airline_code || flightSnapshot.airline_code,
        flight_number: flightSnapshot.outbound?.flight_number || flightSnapshot.flight_number,
        flight_snapshot: flightSnapshot,
      };

      console.log("=== CREATING COMPLETE BOOKING ===");
      console.log(JSON.stringify(bookingPayload, null, 2));

      const bookingResponse = await createBooking(bookingPayload);
      
      console.log("=== BOOKING CREATED ===");
      console.log(bookingResponse);

      if (!bookingResponse.booking_id) {
        setError("Failed to get booking ID");
        setIsConfirming(false);
        return;
      }

      // Step 4: Add passengers to the booking
      const passengersPayload = {
        passengers: passenger.map((p) => ({
          booking_id: bookingResponse.booking_id,
          given_name: p.givenName,
          last_name: p.lastName,
          passport_number: p.passport,
          gender: p.gender,
          date_of_birth: p.dob,
          nationality: p.nationality,
          phone_number: p.phone,
        }))
      };

      console.log("=== ADDING PASSENGERS TO BOOKING ===");
      console.log("Booking ID:", bookingResponse.booking_id);
      console.log(JSON.stringify(passengersPayload, null, 2));

      const passengersResponse = await addPassengers(bookingResponse.booking_id, passengersPayload);
      
      console.log("=== PASSENGERS ADDED ===");
      console.log(passengersResponse);

      // Step 5: Navigate to profile
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete booking");
      console.error("=== BOOKING CONFIRMATION ERROR ===");
      console.error(err.response?.data || err);
    } finally {
      setIsConfirming(false);
    }
  };

  if (isLoadingContact) {
    return (
      <div className="bg-gray-100 min-h-screen py-10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading booking information...</p>
        </div>
      </div>
    );
  }

  if (!selectedFlights || selectedFlights.length === 0) {
    return (
      <div className="bg-gray-100 min-h-screen py-10 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 p-8 rounded text-red-600">
          <p className="text-lg font-medium">No flight selected</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-red-600 underline">
            Go back and select a flight
          </button>
        </div>
      </div>
    );
  }

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

        {/* INFO BANNER */}
        <div className="bg-blue-50 border border-blue-200 p-4 mb-8 rounded">
          <p className="text-sm text-blue-700">
            Booking will be created once you confirm with all passenger details included.
          </p>
        </div>

        {/* SELECTED FLIGHT */}
        <div className="border border-gray-300 p-6 mb-8">
          <h2 className="text-sm font-medium mb-4">Your Selected Flight</h2>
          {selectedFlights.map((f, i) => (
            <div key={i}>
              <div className="flex justify-between items-center py-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 border"></div>
                  <p className="text-sm text-gray-700">
                    {f.from || "New York"} ({f.fromCode || "JFK"})
                    <span className="mx-4 text-gray-400">——</span>
                    {f.to || "London"} ({f.toCode || "LHR"})
                  </p>
                </div>
                <p className="text-xs text-gray-500 whitespace-nowrap">
                  {f.date || "Mon, Jan 15"} &nbsp;&nbsp;
                  {f.departureTime || "9:30 AM"} - {f.arrivalTime || "9:45 PM"}
                </p>
              </div>
              {i !== selectedFlights.length - 1 && (
                <div className="border-t border-gray-200"></div>
              )}
            </div>
          ))}
        </div>

        {/* CONTACT */}
        <div className="border border-gray-300 p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-medium">Contact details</h2>
            {contactExists && !isEditMode && (
              <button
                onClick={() => setIsEditMode(true)}
                className="text-xs text-blue-500 underline"
              >
                Edit
              </button>
            )}
            {isEditMode && (
              <button
                onClick={() => setIsEditMode(false)}
                className="text-xs text-gray-500 underline"
              >
                Cancel
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500 mb-6">
            This is where your confirmation will be sent
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs p-3 mb-4 rounded">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs block mb-1">Given names</label>
              <input
                name="givenName"
                value={contact.givenName}
                placeholder="Enter given names"
                onChange={handleContactChange}
                disabled={isSavingContact || (contactExists && !isEditMode)}
                className="border border-gray-300 p-2 w-full text-sm disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="text-xs block mb-1">Last name</label>
              <input
                name="lastName"
                value={contact.lastName}
                placeholder="Enter last name"
                onChange={handleContactChange}
                disabled={isSavingContact || (contactExists && !isEditMode)}
                className="border border-gray-300 p-2 w-full text-sm disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="text-xs block mb-1">Email</label>
              <input
                name="email"
                value={contact.email}
                placeholder="Enter email"
                onChange={handleContactChange}
                disabled={isSavingContact || (contactExists && !isEditMode)}
                className="border border-gray-300 p-2 w-full text-sm disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="text-xs block mb-1">
                Country / region of residence
              </label>
              <input
                name="country"
                value={contact.country}
                placeholder="Enter Country"
                onChange={handleContactChange}
                disabled={isSavingContact || (contactExists && !isEditMode)}
                className="border border-gray-300 p-2 w-full text-sm disabled:bg-gray-100"
              />
            </div>

            <div className="md:col-span-2 mt-6 bg-gray-50 p-4 border border-gray-300">
              <label className="text-xs block mb-1">Phone number</label>
              <input
                name="phone"
                value={contact.phone}
                placeholder="+1 (555) 000-0000"
                onChange={handleContactChange}
                disabled={isSavingContact || (contactExists && !isEditMode)}
                className="border border-gray-300 p-2 w-full text-sm disabled:bg-gray-100"
              />
            </div>
          </div>

          {contactExists && contact.id && (
            <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-300">
              <div>
                <label className="text-xs block mb-1 text-gray-600">Contact ID</label>
                <input
                  type="text"
                  value={contact.id}
                  disabled
                  className="border border-gray-300 p-2 w-full text-sm bg-gray-50"
                />
              </div>

              <div>
                <label className="text-xs block mb-1 text-gray-600">Created At</label>
                <input
                  type="text"
                  value={contact.createdAt ? new Date(contact.createdAt).toLocaleString() : ""}
                  disabled
                  className="border border-gray-300 p-2 w-full text-sm bg-gray-50"
                />
              </div>
            </div>
          )}

          {!contactExists && (
            <button
              onClick={handleCreateContact}
              disabled={isSavingContact}
              className="mt-4 bg-blue-600 text-white px-6 py-2 text-sm disabled:bg-gray-400"
            >
              {isSavingContact ? "Saving..." : "Create Contact"}
            </button>
          )}
          {contactExists && isEditMode && (
            <button
              onClick={handleUpdateContact}
              disabled={isSavingContact}
              className="mt-4 bg-blue-600 text-white px-6 py-2 text-sm disabled:bg-gray-400"
            >
              {isSavingContact ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>

        {/* PASSENGERS */}
        {passenger.map((p, index) => (
          <div key={index} className="border border-gray-300 p-6 mb-6">
            <h2 className="text-sm font-medium mb-1">Passenger {index + 1}</h2>
            <p className="text-xs text-gray-500 mb-4">
              Passenger details must match your passport or photo ID
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs block mb-1">Given names</label>
                <input
                  name="givenName"
                  value={p.givenName}
                  onChange={(e) => handlePassengerChange(index, e)}
                  placeholder="Enter given names"
                  className="border border-gray-300 p-2 w-full text-sm"
                />
              </div>

              <div>
                <label className="text-xs block mb-1">Last name</label>
                <input
                  name="lastName"
                  value={p.lastName}
                  onChange={(e) => handlePassengerChange(index, e)}
                  placeholder="Enter last name"
                  className="border border-gray-300 p-2 w-full text-sm"
                />
              </div>

              <div>
                <label className="text-xs block mb-1">Passport number</label>
                <input
                  name="passport"
                  value={p.passport}
                  onChange={(e) => handlePassengerChange(index, e)}
                  placeholder="Enter Passport Number"
                  className="border border-gray-300 p-2 w-full text-sm"
                />
              </div>
              
              <div>
                <label className="text-xs block mb-1">Gender on ID</label>
                <select
                  name="gender"
                  value={p.gender}
                  onChange={(e) => handlePassengerChange(index, e)}
                  className="border border-gray-300 p-2 w-full text-sm bg-white"
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                </select>
              </div>

              <div>
                <label className="text-xs block mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={p.dob}
                  onChange={(e) => handlePassengerChange(index, e)}
                  className="border border-gray-300 p-2 w-full text-sm"
                />
              </div>

              <div>
                <label className="text-xs block mb-1">Nationality</label>
                <input
                  name="nationality"
                  value={p.nationality}
                  onChange={(e) => handlePassengerChange(index, e)}
                  placeholder="Enter Nationality"
                  className="border border-gray-300 p-2 w-full text-sm"
                />
              </div>

              <div className="md:col-span-2 mt-6 bg-gray-50 p-4 border border-gray-300">
                <label className="text-xs block mb-1">Phone number</label>
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
            Cancel
          </button>

          <div className="flex gap-4">
            {passenger.length < normalizedAdults && (
              <button
                onClick={handleAddPassenger}
                className="bg-black text-white px-8 py-2 text-sm"
              >
                Add Passenger
              </button>
            )}

            <button
              onClick={handleConfirm}
              disabled={isConfirming}
              className="bg-black text-white px-8 py-2 text-sm disabled:bg-gray-400"
            >
              {isConfirming ? "Confirming..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}