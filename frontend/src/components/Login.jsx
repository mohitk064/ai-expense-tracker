import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/AuthService";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
    </div>
  );
}

export default Login;