// Base URL for your API (update with your real backend URL)
const API_BASE_URL = "/api/api"; // was "/api"

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Login API
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/customer/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }
  return await response.json(); // Expected: { token: "..." }
};

// Register API
export const registerUser = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/auth/customer/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
      full_name: payload.full_name,
      phone: payload.phone,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error?.detail?.[0]?.msg || error.message || "Registration failed",
    );
  }

  return await response.json(); // Expected: { token: "..." } for auto-login
};

// Refresh Token API (assuming /token is for refresh)
export const refreshToken = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/customer/token`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    // Body might include refresh token if needed; adjust based on API
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Token refresh failed");
  }
  return await response.json(); // Expected: { token: "..." }
};

// Create Booking API
export const createBooking = async (bookingData) => {
  const response = await fetch(`${API_BASE_URL}/bookings/`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData), // e.g., { flightId, passengers, etc. }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Booking creation failed");
  }
  return await response.json(); // Expected: Booking object
};

// Add Passengers to Booking API
export const addPassengers = async (bookingId, passengersData) => {
  const response = await fetch(
    `${API_BASE_URL}/bookings/${bookingId}/passengers`,
    {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(passengersData), // e.g., Array of passenger objects
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Adding passengers failed");
  }
  return await response.json(); // Expected: Updated booking
};

// List My Bookings API
export const getUserBookings = async () => {
  const response = await fetch(`${API_BASE_URL}/bookings/me`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch bookings");
  }
  return await response.json(); // Expected: Array of bookings
};

// Get My Booking Detail API
export const getBookingDetail = async (bookingId) => {
  const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch booking detail");
  }
  return await response.json(); // Expected: Booking object
};

// Create or Update Contact API
export const createOrUpdateContact = async (contactData) => {
  const response = await fetch(`${API_BASE_URL}/contact/`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contactData), // e.g., { name, email, phone }
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Contact update failed");
  }
  return await response.json(); // Expected: Contact object
};

// Get My Contact API
export const getMyContact = async () => {
  const response = await fetch(`${API_BASE_URL}/contact/me`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch contact");
  }
  return await response.json(); // Expected: Contact object
};

// Search Flights API
export const searchFlights = async (searchParams) => {
  const params = new URLSearchParams({
    origin: searchParams.origin,
    destination: searchParams.destination,
    departure_date: searchParams.departure_date,
    page: String(searchParams.page || 1),
    adults: String(searchParams.adults || 1),
  });

  const response = await fetch(
    `${API_BASE_URL}/flights/search?${params.toString()}`,
  );
  if (!response.ok) throw new Error("Flight search failed");
  return await response.json();
};

// Search Round Trip Flights API
export const searchRoundTripFlights = async (searchParams) => {
  const params = new URLSearchParams({
    origin: (searchParams.origin || "").toUpperCase(),
    destination: (searchParams.destination || "").toUpperCase(),
    departure_date: searchParams.departure_date || "",
    page: String(searchParams.page || 1),
    adults: String(searchParams.adults || searchParams.passengers || 1),
  });

  // Do NOT send undefined
  if (searchParams.return_date) {
    params.set("return_date", searchParams.return_date);
  }

  const response = await fetch(
    `${API_BASE_URL}/flights/search-round-trip?${params.toString()}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.detail?.[0]?.msg || "Round-trip search failed");
  }

  return await response.json();
};

// Forgot Password API (not in listed endpoints; remove if not needed)
export const forgotPassword = async (email) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/customer/forgot-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Forgot password failed");
  }
  return await response.json(); // Expected: { message: "..." }
};
