import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../services/AuthService";
import ThemeToggle from "../components/ThemeToggle";

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
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <section className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg transition-colors dark:bg-gray-900 dark:shadow-black/30">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create Account
          </h1>

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

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Enter your full name"
              required
              autoComplete="name"
              className={inputClassName}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className={labelClassName}
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="you@example.com"
              required
              autoComplete="email"
              className={inputClassName}
            />
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className={labelClassName}
            >
              Phone number
            </label>

            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(event) =>
                setPhoneNumber(event.target.value)
              }
              placeholder="Enter your phone number"
              autoComplete="tel"
              className={inputClassName}
            />
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

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Create a password"
              required
              autoComplete="new-password"
              className={inputClassName}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className={labelClassName}
            >
              Confirm password
            </label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              placeholder="Confirm your password"
              required
              autoComplete="new-password"
              className={inputClassName}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:bg-blue-300 dark:disabled:bg-blue-900"
          >
            {submitting
              ? "Creating account..."
              : "Register"}
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