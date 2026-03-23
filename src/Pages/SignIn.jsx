import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function SignIn({ open = true, setOpen }) {
  const [screen, setScreen] = useState("login");
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { login, register, loading, error: authError } = useAuth();
  const [error, setError] = useState("");

  const isModal = typeof setOpen === "function";
  if (isModal && !open) return null;

  const close = () => {
    if (isModal) setOpen(false);
  };

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(formData.email, formData.password);
      close();
      window.location.reload();
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        phone: formData.phone,
      });
      close();
      window.location.reload();
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };

  const displayError = error || authError;

  return (
    <div
      className={`${isModal ? "fixed inset-0 bg-black/40" : ""} flex items-center justify-center z-50`}
      onClick={isModal ? close : undefined}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-lg shadow-lg p-6"
      >
        <div className="flex border-b mb-6">
          <button
            onClick={() => setScreen("login")}
            className={`flex-1 py-2 text-sm ${screen === "login" ? "border-b-2 border-black font-semibold" : "text-gray-500"}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setScreen("register")}
            className={`flex-1 py-2 text-sm ${screen === "register" ? "border-b-2 border-black font-semibold" : "text-gray-500"}`}
          >
            Sign Up
          </button>
        </div>

        {displayError && <p className="text-red-500 text-sm mb-4">{displayError}</p>}

        {screen === "login" && (
          <form onSubmit={handleLogin}>
            <input
              name="email"
              value={formData.email}
              onChange={onChange}
              className="w-full mb-3 border p-2 rounded"
              placeholder="Email"
              required
            />
            <input
              name="password"
              value={formData.password}
              onChange={onChange}
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
          </form>
        )}

        {screen === "register" && (
          <form onSubmit={handleRegister}>
            <input
              name="full_name"
              value={formData.full_name}
              onChange={onChange}
              className="w-full mb-3 border p-2 rounded"
              placeholder="Full Name"
              required
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={onChange}
              className="w-full mb-3 border p-2 rounded"
              placeholder="Phone"
              required
            />
            <input
              name="email"
              value={formData.email}
              onChange={onChange}
              className="w-full mb-3 border p-2 rounded"
              placeholder="Email"
              required
            />
            <input
              name="password"
              value={formData.password}
              onChange={onChange}
              className="w-full mb-3 border p-2 rounded"
              type="password"
              placeholder="Password"
              required
            />
            <input
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={onChange}
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
      </div>
    </div>
  );
}
