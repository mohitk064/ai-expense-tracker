import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  verifyEmail,
  resendVerificationOtp,
} from "../services/AuthService";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [cooldown, setCooldown] = useState(60);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleVerify(event) {
    event.preventDefault();

    if (!email) {
      toast.error("Email information is missing");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      await verifyEmail({
        email,
        otp,
      });

      toast.success("Email verified successfully");

      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data ||
        "Email verification failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!email) {
      toast.error("Email information is missing");
      return;
    }

    try {
      await resendVerificationOtp({
        email,
      });

      toast.success("New OTP sent successfully");

      setCooldown(60);
    } catch (error) {
      const message =
        error.response?.data ||
        "Unable to resend OTP";

      toast.error(message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 px-4">

      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">

        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Verify your email
        </h1>

        <p className="mt-3 text-center text-gray-600 dark:text-gray-400">
          We sent a 6-digit verification code to
        </p>

        <p className="mt-1 text-center font-medium text-gray-900 dark:text-white">
          {email || "your email"}
        </p>

        <form
          onSubmit={handleVerify}
          className="mt-8 space-y-5"
        >

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Verification code
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(event) => {
                const value =
                  event.target.value.replace(/\D/g, "");

                setOtp(value);
              }}
              placeholder="Enter 6-digit OTP"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Verifying..."
              : "Verify Email"}
          </button>

        </form>

        <div className="mt-6 text-center">

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Didn't receive the code?
          </p>

          <button
            type="button"
            disabled={cooldown > 0}
            onClick={handleResend}
            className="mt-2 text-sm font-medium text-blue-600 disabled:text-gray-400"
          >
            {cooldown > 0
              ? `Resend OTP in ${cooldown}s`
              : "Resend OTP"}
          </button>

        </div>

      </div>

    </div>
  );
}