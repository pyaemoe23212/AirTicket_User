import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword } from "../utils/api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError("Reset token is missing.");
    }
  }, [token]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, formData.password);
      setSuccess(true);
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AirTicket</h1>
          <p className="text-gray-600">Create a New Password</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            {!tokenValid ? (
              <div className="text-center py-8">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0-6a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h2>
                <p className="text-gray-600 mb-6">{error}</p>

                <Link
                  to="/forgot-password"
                  className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
                >
                  Request New Link
                </Link>
              </div>
            ) : success ? (
              <div className="text-center py-8">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset</h2>
                <p className="text-gray-600 mb-6">
                  Your password has been reset successfully. You can now sign in with your new password.
                </p>

                <Link
                  to="/sign-in"
                  className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
                >
                  Go to Sign In
                </Link>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
                <p className="text-gray-600 mb-6">
                  Enter your new password below.
                </p>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={onChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                      placeholder="••••••••"
                      required
                      minLength="8"
                    />
                    <p className="text-xs text-gray-500 mt-1">At least 8 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={onChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                      placeholder="••••••••"
                      required
                      minLength="8"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              </>
            )}

            {!tokenValid || success ? null : (
              <div className="border-t border-gray-200 mt-6 pt-6 text-center">
                <Link to="/sign-in" className="text-black font-medium hover:underline">
                  ← Back to Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}