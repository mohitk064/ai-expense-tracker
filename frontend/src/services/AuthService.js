import api from "../api/axiosConfig";

export async function login(loginRequest) {
    const response = await api.post(
        "/api/auth/login",
        loginRequest
    );

    return response.data;
}