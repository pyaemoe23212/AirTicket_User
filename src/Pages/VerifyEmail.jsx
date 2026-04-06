import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../utils/api";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    const run = async () => {
      try {
        const data = await verifyEmail(token);
        // Store token if returned in verification response
        if (data?.token || data?.access_token) {
          const authToken = data.token || data.access_token;
          localStorage.setItem("authToken", authToken);
        }
        setStatus("success");
        setMessage("Your email has been verified successfully!");
      } catch (err) {
        setStatus("error");
        setMessage(
          err?.response?.data?.message || err.message || "Email verification failed."
        );
      }
    };

    run();
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">Email Verification</h1>

        <div className="mb-6">
          {status === "loading" && (
            <div>
              <p className="text-gray-600">{message}</p>
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              </div>
            </div>
          )}

          {status === "success" && (
            <div>
              <div className="mb-4 text-4xl text-green-600">✓</div>
              <p className="text-gray-700">{message}</p>
            </div>
          )}

          {status === "error" && (
            <div>
              <div className="mb-4 text-4xl text-red-600">✗</div>
              <p className="text-gray-700">{message}</p>
            </div>
          )}
        </div>

        {status !== "loading" && (
          <Link
            to="/sign-in"
            className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Go to Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
