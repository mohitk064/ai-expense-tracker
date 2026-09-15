import api from "../api/axiosConfig";

export async function getAiFinancialAdvice() {
  const response = await api.post("/api/ai/coach");

  return response.data.data;
}

export async function getFinancialSummary() {
  const response = await api.get("/api/ai/summary");

  return response.data.data;
}