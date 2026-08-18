import api from "../api/axiosConfig";

export async function getUserProfile() {
  const response = await api.get("/api/users/me");
  return response.data;
}

export async function changePassword(payload) {
  const response = await api.put(
    "/api/users/me/password",
    payload
  );

  return response.data;
}