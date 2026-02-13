// Base URL for your API (update with your real backend URL)
const API_BASE_URL = "https://your-api-domain.com/api"; // Placeholder

// Mock delay to simulate async behavior (optional, remove if not needed)
const mockDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Login API (Mock)
export const loginUser = async (email, password) => {
  await mockDelay(500); // Simulate network delay
  // Mock validation: Assume success if email and password are provided
  if (!email || !password) {
    throw new Error("Invalid credentials");
  }
  return { token: "mock-bearer-token-12345" }; // Mock token
};

// Register API (Mock)
export const registerUser = async (username, email, password) => {
  await mockDelay(500); // Simulate network delay
  // Mock validation: Assume success if all fields are provided
  if (!username || !email || !password) {
    throw new Error("All fields are required");
  }
  return { token: "mock-bearer-token-67890" }; // Mock token for auto-login
};

// Forgot Password API (Mock)
export const forgotPassword = async (email) => {
  await mockDelay(500); // Simulate network delay
  // Mock validation: Assume success if email is provided
  if (!email) {
    throw new Error("Email is required");
  }
  return { message: "Reset link sent" };
};
