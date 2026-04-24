import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyContact,
  createContact,
  updateContact,
  createBooking,
  addPassengers,
} from "../utils/api";

const createEmptyPassenger = () => ({
  givenName: "",
  lastName: "",
  passport: "",
  gender: "",
  dob: "",
  nationality: "",
  phone: "",
});

// SVG icons
const EmailIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M3 8l9 6 9-6" />
    <rect x="3" y="6" width="18" height="12" rx="2" />
  </svg>
);

const PhoneIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 01-2.18 2A19.86 19.86 0 013 5.18 2 2 0 015 3h3a2 2 0 012 1.72c.12.9.33 1.78.63 2.61a2 2 0 01-.45 2.11L9.91 10.91a16 16 0 006.18 6.18l1.47-1.47a2 2 0 012.11-.45c.83.3 1.71.51 2.61.63A2 2 0 0122 16.92z" />
  </svg>
);

const LocationIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 21s-6-5.33-6-10a6 6 0 1112 0c0 4.67-6 10-6 10z" />
    <circle cx="12" cy="11" r="2" />
  </svg>
);

const CalendarIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const PassportIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <circle cx="12" cy="10" r="3" />
    <path d="M8 16h8" />
  </svg>
);

const inputClass =
  "w-full rounded border border-gray-300 bg-white p-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100";

const inputWithIconClass =
  "w-full rounded border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100";

const InputWithIcon = ({ icon, className = "", ...props }) => (
  <div className="relative">
    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      {icon}
    </span>
    <input {...props} className={`${inputWithIconClass} ${className}`} />
  </div>
);

const formatTime = (iso) => {
  if (!iso) return "--:--";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "--:--";
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const formatDate = (iso) => {
  if (!iso) return "--";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "--";
  return d.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const formatDateForInputDisplay = (dateValue) => {
  if (!dateValue) return "";
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return "";
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};

const getFlightDisplayData = (flight) => {
  const snapshot = flight?.flight_snapshot || flight;
  const isRoundTrip = flight?.type === "ROUND_TRIP";

  const segment = isRoundTrip && snapshot?.outbound ? snapshot.outbound : snapshot;

  const fromCode =
    segment?.origin ||
    segment?.from ||
    segment?.fromCode ||
    segment?.departure_airport_code ||
    segment?.departure_iata ||
    segment?.origin_code ||
    "RGN";

  const toCode =
    segment?.destination ||
    segment?.to ||
    segment?.toCode ||
    segment?.arrival_airport_code ||
    segment?.arrival_iata ||
    segment?.destination_code ||
    "BKK";

  const fromName =
    segment?.origin_city ||
    segment?.from_city ||
    segment?.departure_city ||
    segment?.origin_name ||
    segment?.fromName ||
    fromCode;

  const toName =
    segment?.destination_city ||
    segment?.to_city ||
    segment?.arrival_city ||
    segment?.destination_name ||
    segment?.toName ||
    toCode;

  const departureIso = segment?.departure_time;
  const arrivalIso = segment?.arrival_time;

  return {
    fromName,
    fromCode,
    toName,
    toCode,
    date: formatDate(departureIso),
    departureTime: formatTime(departureIso),
    arrivalTime: formatTime(arrivalIso),
  };
};

export default function BookingForm({
  selectedFlights = [],
  tripType,
  initialAdults = 1,
}) {
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
    if (isConfirming) return;

    try {
      setError(null);

      console.log("===== CONFIRM BOOKING CLICKED =====");
      console.log("CONTACT:", contact);
      console.log("PASSENGERS:", passenger);
      console.log("SELECTED FLIGHTS:", selectedFlights);
      console.log("TRIP TYPE:", tripType);

      if (!contactExists) {
        setError("Please create a contact first");
        return;
      }

      if (!passenger.length || !passenger[0].givenName) {
        setError("Please add at least one passenger");
        return;
      }

      setIsConfirming(true);

      const outboundFlight = selectedFlights[0];

      if (!outboundFlight) {
        setError("No flight selected");
        return;
      }

      const flightSnapshot = outboundFlight.flight_snapshot || outboundFlight;

      const bookingPayload = {
        type:
          outboundFlight.type ||
          (tripType === "round-trip" ? "ROUND_TRIP" : "ONE_WAY"),
        adults: passenger.length,
        bundle_key:
          outboundFlight.bundle_key || outboundFlight.external_flight_id,
        airline_code:
          flightSnapshot.outbound?.airline_code || flightSnapshot.airline_code,
        flight_number:
          flightSnapshot.outbound?.flight_number || flightSnapshot.flight_number,
        flight_snapshot: flightSnapshot,
      };

      console.log("BOOKING PAYLOAD:", bookingPayload);

      const bookingResponse = await createBooking(bookingPayload);

      console.log("BOOKING RESPONSE:", bookingResponse);

      if (!bookingResponse.booking_id) {
        setError("Failed to get booking ID");
        return;
      }

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
        })),
      };

      console.log("PASSENGERS PAYLOAD:", passengersPayload);

      await addPassengers(bookingResponse.booking_id, passengersPayload);

      console.log("===== BOOKING SUCCESS =====");

      navigate("/profile");
    } catch (err) {
      console.error("BOOKING ERROR:", err?.response?.data || err);
      setError(err.response?.data?.message || "Failed to complete booking");
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
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-red-600 underline"
          >
            Go back and select a flight
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-5xl mx-auto bg-white border border-gray-300 p-8 text-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium">Review & Passenger Info</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 underline"
          >
            Change flight
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 mb-8 rounded">
          <p className="text-sm text-blue-700">
            Booking will be created once you confirm with all passenger details
            included.
          </p>
        </div>

        <div className="border border-gray-300 p-6 mb-8">
          <h2 className="text-sm font-medium mb-4">Your Selected Flight</h2>

          {selectedFlights.map((f, i) => {
            const display = getFlightDisplayData(f);

            return (
              <div key={i}>
                <div className="flex justify-between items-center py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-200 border"></div>
                    <p className="text-sm text-gray-700">
                      {display.fromName} ({display.fromCode})
                      <span className="mx-4 text-gray-400">——</span>
                      {display.toName} ({display.toCode})
                    </p>
                  </div>

                  <p className="text-xs text-gray-500 whitespace-nowrap">
                    {display.date} &nbsp;&nbsp;
                    {display.departureTime} - {display.arrivalTime}
                  </p>
                </div>

                {i !== selectedFlights.length - 1 && (
                  <div className="border-t border-gray-200"></div>
                )}
              </div>
            );
          })}
        </div>

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
                className={`${inputClass} disabled:bg-gray-100`}
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
                className={`${inputClass} disabled:bg-gray-100`}
              />
            </div>

            <div>
              <label className="text-xs block mb-1">Email</label>
              <InputWithIcon
                icon={EmailIcon}
                name="email"
                value={contact.email}
                placeholder="Enter email"
                onChange={handleContactChange}
                disabled={isSavingContact || (contactExists && !isEditMode)}
                className="disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="text-xs block mb-1">
                Country / region of residence
              </label>
              <InputWithIcon
                icon={LocationIcon}
                name="country"
                value={contact.country}
                placeholder="Enter Country / region"
                onChange={handleContactChange}
                disabled={isSavingContact || (contactExists && !isEditMode)}
                className="disabled:bg-gray-100"
              />
            </div>

            <div className="md:col-span-2 mt-6 bg-gray-50 p-4 border border-gray-300 rounded">
              <label className="text-xs block mb-1">Phone number</label>
              <InputWithIcon
                icon={PhoneIcon}
                name="phone"
                value={contact.phone}
                placeholder="+1 (555) 000-0000"
                onChange={handleContactChange}
                disabled={isSavingContact || (contactExists && !isEditMode)}
                className="disabled:bg-gray-100"
              />
            </div>
          </div>

          {contactExists && contact.id && (
            <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-300">
              <div>
                <label className="text-xs block mb-1 text-gray-600">
                  Contact ID
                </label>
                <input
                  type="text"
                  value={contact.id}
                  disabled
                  className={`${inputClass} bg-gray-50`}
                />
              </div>

              <div>
                <label className="text-xs block mb-1 text-gray-600">
                  Created At
                </label>
                <input
                  type="text"
                  value={
                    contact.createdAt
                      ? new Date(contact.createdAt).toLocaleString()
                      : ""
                  }
                  disabled
                  className={`${inputClass} bg-gray-50`}
                />
              </div>
            </div>
          )}

          {!contactExists && (
            <button
              onClick={handleCreateContact}
              disabled={isSavingContact}
              className="mt-4 bg-blue-600 text-white px-6 py-2 text-sm rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSavingContact ? "Saving..." : "Create Contact"}
            </button>
          )}

          {contactExists && isEditMode && (
            <button
              onClick={handleUpdateContact}
              disabled={isSavingContact}
              className="mt-4 bg-blue-600 text-white px-6 py-2 text-sm rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSavingContact ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>

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
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-xs block mb-1">Last name</label>
                <input
                  name="lastName"
                  value={p.lastName}
                  onChange={(e) => handlePassengerChange(index, e)}
                  placeholder="Enter last name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-xs block mb-1">Passport Number</label>
                <InputWithIcon
                  icon={PassportIcon}
                  name="passport"
                  value={p.passport}
                  onChange={(e) => handlePassengerChange(index, e)}
                  placeholder="Enter Passport Number"
                />
              </div>

              <div>
                <label className="text-xs block mb-1">Gender on ID</label>
                <select
                  name="gender"
                  value={p.gender}
                  onChange={(e) => handlePassengerChange(index, e)}
                  className={inputClass}
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                </select>
              </div>

              <div>
                <label className="text-xs block mb-1">Date of Birth</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {CalendarIcon}
                  </span>

                  <input
                    type="text"
                    value={formatDateForInputDisplay(p.dob)}
                    placeholder="MM/DD/YYYY"
                    readOnly
                    onClick={() => {
                      const el = document.getElementById(`dob-${index}`);
                      if (el?.showPicker) {
                        el.showPicker();
                      } else if (el) {
                        el.click();
                      }
                    }}
                    className={inputWithIconClass + " cursor-pointer"}
                  />

                  <input
                    id={`dob-${index}`}
                    type="date"
                    value={p.dob}
                    onChange={(e) =>
                      handlePassengerChange(index, {
                        target: { name: "dob", value: e.target.value },
                      })
                    }
                    className="absolute inset-0 opacity-0 pointer-events-none"
                    tabIndex={-1}
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs block mb-1">Nationality</label>
                <InputWithIcon
                  icon={LocationIcon}
                  name="nationality"
                  value={p.nationality}
                  onChange={(e) => handlePassengerChange(index, e)}
                  placeholder="Enter Nationality"
                />
              </div>

              <div className="md:col-span-2 mt-6 bg-gray-50 p-4 border border-gray-300 rounded">
                <label className="text-xs block mb-1">Phone number</label>
                <InputWithIcon
                  icon={PhoneIcon}
                  name="phone"
                  value={p.phone}
                  onChange={(e) => handlePassengerChange(index, e)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>
        ))}

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
                className="bg-black text-white px-8 py-2 text-sm rounded hover:bg-gray-900"
              >
                Add Passenger
              </button>
            )}

            <button
              onClick={handleConfirm}
              disabled={isConfirming}
              className="bg-black text-white px-8 py-2 text-sm rounded disabled:bg-gray-400 hover:bg-gray-900"
            >
              {isConfirming ? "Confirming..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}