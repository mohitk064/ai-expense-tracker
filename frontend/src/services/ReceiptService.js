import api from "../api/axiosConfig";

export async function analyzeReceipt(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(
    "/api/receipts/upload",
    formData
  );

  return response.data;
}