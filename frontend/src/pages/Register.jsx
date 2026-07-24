import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/AuthService";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      password,
      confirmPassword,
      phoneNumber,
      dob,
    };

    try {
      setSubmitting(true);

      await register(registerRequest);

      navigate("/login", {
        replace: true,
        state: {
          message: "Registration successful. Please log in.",
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

  return (
    <div>
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <br />

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label htmlFor="email">Email</label>
          <br />

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label htmlFor="phoneNumber">Phone Number</label>
          <br />

          <input
            id="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={(event) =>
              setPhoneNumber(event.target.value)
            }
            required
          />
        </div>

        <br />

        <div>
          <label htmlFor="dob">Date of Birth</label>
          <br />

          <input
            id="dob"
            type="date"
            value={dob}
            onChange={(event) => setDob(event.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label htmlFor="password">Password</label>
          <br />

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />
        </div>

        <br />

        <div>
          <label htmlFor="confirmPassword">
            Confirm Password
          </label>
          <br />

          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            required
          />
        </div>

        <br />

        <button type="submit" disabled={submitting}>
          {submitting ? "Creating Account..." : "Register"}
        </button>

        {error && <p>{error}</p>}
      </form>

      <p>
        Already have an account?{" "}
        <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;