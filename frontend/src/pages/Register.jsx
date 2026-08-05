import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../services/AuthService";
import ThemeToggle from "../components/ThemeToggle";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  WalletCards,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] =
    useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] =
    useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const registerRequest = {
      name,
      email,
      phoneNumber,
      dob,
      password,
      confirmPassword,
    };

    try {
      setSubmitting(true);

      await register(registerRequest);

      navigate("/login", {
        replace: true,
        state: {
          message:
            "Registration successful. Please log in.",
        },
      });
    } catch (error) {
      console.error("Registration failed:", error);

      setError(
        error.response?.data?.message ??
        "Unable to create account"
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputClassName =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-900";

  const labelClassName =
    "mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10 transition-colors dark:bg-gray-950">

      <section className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg transition-colors dark:bg-gray-900 dark:shadow-black/30">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-600/20">
              <WalletCards size={24} />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Expense<span className="text-blue-600 dark:text-blue-400">AI</span>
            </h1>
          </div>

          <h2 className="mt-3 text-xl font-semibold text-gray-800 dark:text-gray-200">
            Create Account
          </h2>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Start tracking your expenses today
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className={labelClassName}
            >
              Full name
            </label>

            <div className="relative">
              <User
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your full name"
                required
                autoComplete="name"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-11 pr-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-900"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className={labelClassName}
            >
              Email
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-11 pr-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-900"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className={labelClassName}
            >
              Phone number
            </label>

            <div className="relative">
              <Phone
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(event) =>
                  setPhoneNumber(event.target.value)
                }
                placeholder="Enter your phone number"
                autoComplete="tel"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-11 pr-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-900"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="dob"
              className={labelClassName}
            >
              Date of birth
            </label>

            <input
              id="dob"
              type="date"
              value={dob}
              onChange={(event) =>
                setDob(event.target.value)
              }
              required
              className={inputClassName}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className={labelClassName}
            >
              Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a password"
                required
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-11 pr-11 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-900"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className={labelClassName}
            >
              Confirm password
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Confirm your password"
                required
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-11 pr-11 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-900"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((prev) => !prev)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-blue-300 dark:disabled:bg-blue-900"
          >
            <span className="flex items-center justify-center gap-2">
              <UserPlus size={18} />

              {submitting
                ? "Creating account..."
                : "Register"}
            </span>
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}

export default Register;