import { useState } from "react";

export default function SignIn() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("login"); // "login" or "register"

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-black text-white rounded-md"
      >
        Sign In / Register
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 animate-fadeIn"
          >
            {/* Tabs */}
            <div className="flex border-b mb-4">
              <button
                className={`flex-1 py-2 text-center ${
                  tab === "login"
                    ? "border-b-2 border-black font-semibold"
                    : "text-gray-500"
                }`}
                onClick={() => setTab("login")}
              >
                Log In
              </button>
              <button
                className={`flex-1 py-2 text-center ${
                  tab === "register"
                    ? "border-b-2 border-black font-semibold"
                    : "text-gray-500"
                }`}
                onClick={() => setTab("register")}
              >
                Register
              </button>
            </div>

            {/* Login Form */}
            {tab === "login" && (
              <form className="space-y-3">
                <input
                  type="text"
                  placeholder="Email/Username"
                  className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                />
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
                >
                  Sign In
                </button>
                <p className="text-sm text-right text-gray-600 hover:underline cursor-pointer">
                  Forgot Password?
                </p>
                <p className="text-sm text-center">
                  Don't have an account?{" "}
                  <span
                    className="text-blue-600 cursor-pointer hover:underline"
                    onClick={() => setTab("register")}
                  >
                    Register
                  </span>
                </p>
              </form>
            )}

            {/* Register Form */}
            {tab === "register" && (
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                />
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
                >
                  Register
                </button>
                <p className="text-sm text-center">
                  Already have an account?{" "}
                  <span
                    className="text-blue-600 cursor-pointer hover:underline"
                    onClick={() => setTab("login")}
                  >
                    Sign In
                  </span>
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}  