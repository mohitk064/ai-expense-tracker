import api from "../api/axiosConfig";

export async function login(loginRequest) {
  const response = await api.post(
    "/api/auth/login",
    loginRequest
  );

  return response.data;
}

export async function register(registerRequest) {
  const response = await api.post(
    "/api/auth/register",
    registerRequest
  );

  return response.data;
}

export async function verifyEmail(payload) {
  const response = await api.post(
    "/api/auth/verify-email",
    payload
  );

  return response.data;
}

export async function resendVerificationOtp(payload) {
  const response = await api.post(
    "/api/auth/resend-otp",
    payload
  );

  return response.data;
}