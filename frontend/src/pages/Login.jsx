import axios from "axios";
import { useState } from "react";
import { login } from "../services/AuthService";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogin() {
    const loginRequest = {
      email,
      password,
    };

    try {
      const token = await login(loginRequest);

      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  return (
    <div>
      <h2>Login</h2>

      {location.state?.message && (
        <p>{location.state.message}</p>
      )}

      <label>Email</label>
      <br />
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <p>Email: {email}</p>

      <br />
      <br />

      <label>Password</label>
      <br />
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <p>Password: {password}</p>

      <br />
      <br />

      <button onClick={handleLogin}>
        Login
      </button>

      <p>
        Don't have an account?{" "}
        <Link to="/register">Register</Link>
      </p>
    </div>

  );
}

export default Login;