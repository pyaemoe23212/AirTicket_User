import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const loginUser = async (email, password) => {
  const response = await apiClient.post("/auth/customer/login", {
    email,
    password,
  });
  return response.data;
};

export const registerUser = async (payload) => {
  const response = await apiClient.post("/auth/customer/signup", payload);
  return response.data;
};

export const refreshToken = async () => {
  const response = await apiClient.post("/auth/customer/token");
  return response.data;
};

// Booking APIs
export const createBooking = async (bookingData) => {
  const response = await apiClient.post("/bookings/", bookingData);
  return response.data;
};

export const addPassengers = async (bookingId, passengersData) => {
  const response = await apiClient.post(
    `/bookings/${bookingId}/passengers`,
    passengersData,
  );
  return response.data;
};

export const getUserBookings = async () => {
  const response = await apiClient.get("/bookings/me");
  return response.data;
};

export const getBookingDetail = async (bookingId) => {
  const response = await apiClient.get(`/bookings/${bookingId}`);
  return response.data;
};

// Contact APIs
export const createOrUpdateContact = async (contactData) => {
  const response = await apiClient.post("/contact/", contactData);
  return response.data;
};

export const getMyContact = async () => {
  const response = await apiClient.get("/contact/me");
  return response.data;
};

export const updateContact = async (contactData) => {
  const response = await apiClient.put("/contact/me", contactData);
  return response.data;
};

// Flight APIs
export const searchFlights = async (searchParams) => {
  const response = await apiClient.get("/flights/search", {
    params: searchParams,
  });
  return response.data;
};

export const searchRoundTripFlights = async (searchParams) => {
  const response = await apiClient.get("/flights/search-round-trip", {
    params: searchParams,
  });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await apiClient.post("/auth/customer/forgot-password", {
    email,
  });
  return response.data;
};
