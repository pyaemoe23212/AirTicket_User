import { useState } from "react";

export default function SignIn({ open, setOpen }) {
  const [screen, setScreen] = useState("login"); // login | register | forgot

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

        {/* ------------ LOGIN ------------ */}
        {screen === "login" && (
          <>
            <input className="w-full mb-3 border p-2 rounded" placeholder="Email / Username" />
            <input className="w-full mb-3 border p-2 rounded" type="password" placeholder="Password" />
            <button className="w-full bg-black text-white py-2 rounded">Sign In</button>

            <p
              className="text-xs text-center mt-3 cursor-pointer text-gray-600 hover:underline"
              onClick={() => setScreen("forgot")}
            >
              Forgot Password?
            </p>
          </>
        )}

        {/* ------------ REGISTER ------------ */}
        {screen === "register" && (
          <>
            <input className="w-full mb-3 border p-2 rounded" placeholder="Username" />
            <input className="w-full mb-3 border p-2 rounded" placeholder="Email" />
            <input className="w-full mb-3 border p-2 rounded" type="password" placeholder="Password" />
            <button className="w-full bg-black text-white py-2 rounded">Sign Up</button>
          </>
        )}

        {/* ------------ FORGOT ------------ */}
        {screen === "forgot" && (
          <>
            <input className="w-full mb-3 border p-2 rounded" placeholder="Email" />
            <button className="w-full bg-black text-white py-2 rounded">
              Send Reset Link
            </button>
            <p
              className="text-xs text-center mt-3 text-blue-600 cursor-pointer"
              onClick={() => setScreen("login")}
            >
              Back to Login
            </p>
          </>
        )}
      </div>
    </div>
  );
}
