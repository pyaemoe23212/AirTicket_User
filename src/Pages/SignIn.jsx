import { useState } from "react";
import { loginUser, registerUser, forgotPassword } from "../utils/api"; // Import API functions

export default function SignIn({ open, setOpen }) {
  const [screen, setScreen] = useState("login"); // login | register | forgot
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "", // For register
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(formData.email, formData.password);
      localStorage.setItem("authToken", data.token); // Store bearer token
      setOpen(false); // Close modal on success
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const data = await registerUser(
        formData.username,
        formData.email,
        formData.password,
      );
      // Assuming register API returns a token for auto-login; if not, remove this line
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      setOpen(false); // Close modal on success
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await forgotPassword(formData.email);
      alert("Reset link sent"); // Or use a better UI notification
      setScreen("login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-lg shadow-lg p-6"
      >
        {/* LOGIN + REGISTER TABS */}
        {(screen === "login" || screen === "register") && (
          <div className="flex border-b mb-6">
            <button
              onClick={() => setScreen("login")}
              className={`flex-1 py-2 text-sm ${
                screen === "login"
                  ? "border-b-2 border-black font-semibold"
                  : "text-gray-500"
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setScreen("register")}
              className={`flex-1 py-2 text-sm ${
                screen === "register"
                  ? "border-b-2 border-black font-semibold"
                  : "text-gray-500"
              }`}
            >
              Register
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* ------------ LOGIN ------------ */}
        {screen === "login" && (
          <form onSubmit={handleLogin}>
            <input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full mb-3 border p-2 rounded"
              placeholder="Email / Username"
              required
            />
            <input
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full mb-3 border p-2 rounded"
              type="password"
              placeholder="Password"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <p
              className="text-xs text-center mt-3 cursor-pointer text-gray-600 hover:underline"
              onClick={() => setScreen("forgot")}
            >
              Forgot Password?
            </p>
          </form>
        )}

        {/* ------------ REGISTER ------------ */}
        {screen === "register" && (
          <form onSubmit={handleRegister}>
            <input
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full mb-3 border p-2 rounded"
              placeholder="Username"
              required
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full mb-3 border p-2 rounded"
              placeholder="Email"
              required
            />
            <input
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full mb-3 border p-2 rounded"
              type="password"
              placeholder="Password"
              required
            />
            <input
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full mb-3 border p-2 rounded"
              type="password"
              placeholder="Confirm Password"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        )}

        {/* ------------ FORGOT ------------ */}
        {screen === "forgot" && (
          <form onSubmit={handleForgotPassword}>
            <input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full mb-3 border p-2 rounded"
              placeholder="Email"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            <p
              className="text-xs text-center mt-3 text-blue-600 cursor-pointer"
              onClick={() => setScreen("login")}
            >
              Back to Login
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
